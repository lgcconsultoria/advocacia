// Agregados do termômetro de contratações públicas, montados ao vivo a
// partir da busca do PNCP. Cada função aceita uma "reserva" (o último
// retrato bom): se uma parte falhar, só aquela parte vem da reserva e fica
// marcada com `fonte: 'snapshot'` e a data original da consulta.

import { contar, ErroPncp } from './cliente';
import type { Contador, FiltroBusca, OpcoesRequisicao } from './cliente';
import { dataHoraBrasilia, diaBrasilia, inicioDoMes, intervaloDeDias, somarDias } from './datas';
import { ESFERAS, MODALIDADES, UFS } from './ufs';
import { somarValores } from './valores';
import type { CampoValor } from './valores';
import type {
  Fonte,
  Medida,
  MedidaComRitmo,
  PontoSerie,
  PorUf,
  Procedencia,
  SerieDiaria,
  Termometro,
  UfAgregado,
  ValorEstimado,
} from './tipos';

export interface OpcoesAgregado {
  /** Prazo total em ms; ao estourar, o que faltar vem da reserva. */
  prazoTotalMs?: number;
  /** Último retrato bom, usado parte a parte quando o PNCP falha. */
  reserva?: unknown;
  /** Data de referência (testes). */
  agora?: Date;
}

const ABERTAS: FiltroBusca = { tipos_documento: 'edital', status: 'recebendo_proposta' };
const PUBLICADAS: FiltroBusca = { tipos_documento: 'edital', status: 'todos' };
const CONTRATOS: FiltroBusca = { tipos_documento: 'contrato', status: 'todos' };

/** Segundos no Data Cache do Next para cada tipo de chamada. */
export const REVALIDAR = {
  contagem: 120, // a própria busca do PNCP responde com max-age=120
  faixas: 900, // contagens das faixas de valor: mudam devagar
  diaPassado: 86_400,
} as const;

function descreverFiltro(f: FiltroBusca): string {
  const partes = Object.entries(f).map(([k, v]) => `${k}=${v}`);
  return `GET pncp.gov.br/api/search/?${partes.join('&')}`;
}

function criarSinal(prazoMs: number | undefined): { sinal?: AbortSignal; limpar: () => void } {
  if (!prazoMs) return { limpar: () => {} };
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), prazoMs);
  return { sinal: c.signal, limpar: () => clearTimeout(t) };
}

function procedencia(
  endpoint: string,
  metodo: Procedencia['metodo'],
  contador: Contador,
  consultadoEm: string,
  observacao?: string,
): Procedencia {
  return {
    fonte: 'pncp-ao-vivo',
    metodo,
    endpoint,
    requisicoes: contador.requisicoes,
    consultadoEm,
    ...(observacao ? { observacao } : {}),
  };
}

/** Marca uma parte copiada da reserva como vinda do snapshot. */
function daReserva<T>(parte: T): T {
  const copia = JSON.parse(JSON.stringify(parte)) as T;
  const marcar = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    if (r.procedencia && typeof r.procedencia === 'object') {
      (r.procedencia as Procedencia).fonte = 'snapshot';
    }
    if ('fonte' in r && (r.fonte === 'pncp-ao-vivo' || r.fonte === 'snapshot')) r.fonte = 'snapshot';
    Object.values(r).forEach(marcar);
  };
  marcar(copia);
  return copia;
}

interface ContextoValor {
  nome: string;
  /** Opções (com prazo próprio, mais curto) para a soma de valores. */
  opcoes: OpcoesRequisicao;
  /** Valor do último retrato bom, usado se só a soma falhar. */
  reserva?: ValorEstimado;
  avisos: string[];
  fontes: Fonte[];
}

async function medir(
  filtro: FiltroBusca,
  opcoes: OpcoesRequisicao,
  comValor: CampoValor | null,
  observacao?: string,
  ctxValor?: ContextoValor,
): Promise<Medida> {
  const contador: Contador = { requisicoes: 0 };
  const consultadoEm = new Date().toISOString();
  const quantidade = await contar(filtro, { ...opcoes, revalidar: REVALIDAR.contagem }, contador);
  const medida: Medida = {
    quantidade,
    procedencia: procedencia(descreverFiltro(filtro), 'exato-api', contador, consultadoEm, observacao),
  };
  if (!comValor) return medida;

  const contadorValor: Contador = { requisicoes: 0 };
  try {
    const soma = await somarValores(
      filtro,
      comValor,
      { ...(ctxValor?.opcoes ?? opcoes), revalidar: REVALIDAR.faixas },
      contadorValor,
      quantidade,
    );
    medida.valor = {
      ...soma.valor,
      procedencia: procedencia(
        `${descreverFiltro(filtro)} + ordenacao=-${comValor} + faixas ${comValor}_min/_max`,
        soma.metodo,
        contadorValor,
        consultadoEm,
        `soma de ${comValor} informado pelos órgãos`,
      ),
    };
  } catch (erro) {
    // A contagem ao vivo vale por si; só o valor recorre à reserva.
    if (!ctxValor?.reserva) throw erro;
    ctxValor.avisos.push(
      `${ctxValor.nome} (valor): PNCP lento ou indisponível (${String((erro as Error)?.message).slice(0, 80)}); valor do último retrato salvo.`,
    );
    ctxValor.fontes.push('snapshot');
    medida.valor = daReserva(ctxValor.reserva);
  }
  return medida;
}

/** Executa `tarefa`; se falhar e houver reserva para a parte, usa a reserva. */
async function comReserva<T>(
  nome: string,
  tarefa: () => Promise<T>,
  reserva: T | undefined,
  avisos: string[],
  fontes: Fonte[],
): Promise<T> {
  try {
    return await tarefa();
  } catch (erro) {
    const motivo = erro instanceof ErroPncp ? erro.message : (erro as Error)?.message;
    if (reserva === undefined) throw erro;
    avisos.push(`${nome}: PNCP indisponível (${String(motivo).slice(0, 120)}); usado o último retrato salvo.`);
    fontes.push('snapshot');
    return daReserva(reserva);
  }
}

// ------------------------------------------------------------ termômetro

/**
 * Números do termômetro. Orçamento: ~200 requisições pequenas à busca
 * (a maioria de ~3 KB, quatro de ~0,7 MB), 5–15 s com concorrência 8.
 * Dentro do Next, as contagens ficam 2 min e as faixas 15 min no Data Cache.
 */
export async function termometro(opcoes: OpcoesAgregado = {}): Promise<Termometro> {
  const agora = opcoes.agora ?? new Date();
  const hoje = diaBrasilia(agora);
  const reserva = opcoes.reserva as Termometro | undefined;
  const { sinal, limpar } = criarSinal(opcoes.prazoTotalMs);
  // Somas de valor param antes (80% do prazo) para as contagens ao vivo não se perderem.
  const prazoValores = criarSinal(opcoes.prazoTotalMs ? Math.floor(opcoes.prazoTotalMs * 0.8) : undefined);
  const op: OpcoesRequisicao = { sinal };
  const opValores: OpcoesRequisicao = { sinal: prazoValores.sinal ?? sinal };
  const avisos: string[] = [];
  const fontes: Fonte[] = [];
  const cv = (nome: string, reservaValor?: ValorEstimado): ContextoValor => ({
    nome,
    opcoes: opValores,
    reserva: reservaValor,
    avisos,
    fontes,
  });

  const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);
  const umDiaAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

  try {
    const [abertas, publicadasHoje, ultimaHora, publicadas24h, publicadas30d, contratosMes, contratosPublicadosHoje, porModalidade, porEsfera] =
      await Promise.all([
        comReserva('abertas', () => medir(ABERTAS, op, 'valor_total_estimado', 'recebendo ou a receber propostas', cv('abertas', reserva?.abertas.valor)), reserva?.abertas, avisos, fontes),
        comReserva('publicadasHoje', () => medir({ ...PUBLICADAS, data_publicacao_inicio: hoje, data_publicacao_fim: hoje }, op, 'valor_total_estimado', 'editais, avisos e atos de contratação direta publicados hoje (Brasília)', cv('publicadasHoje', reserva?.hoje === hoje ? reserva?.publicadasHoje.valor : undefined)), reserva?.publicadasHoje, avisos, fontes),
        comReserva('ultimaHora', () => medir({ ...PUBLICADAS, data_publicacao_inicio: dataHoraBrasilia(umaHoraAtras), data_publicacao_fim: dataHoraBrasilia(agora) }, op, null), undefined, avisos, fontes).catch(() => null),
        comReserva('publicadas24h', () => medir({ ...PUBLICADAS, data_publicacao_inicio: dataHoraBrasilia(umDiaAtras), data_publicacao_fim: dataHoraBrasilia(agora) }, op, null, 'últimas 24 horas corridas'), reserva?.publicadas24h, avisos, fontes),
        comReserva('publicadas30d', () => medir({ ...PUBLICADAS, data_publicacao_inicio: somarDias(hoje, -29), data_publicacao_fim: hoje }, op, 'valor_total_estimado', 'últimos 30 dias, incluindo hoje', cv('publicadas30d', reserva?.publicadas30d.valor)), reserva?.publicadas30d, avisos, fontes),
        comReserva('contratosMes', () => medir({ ...CONTRATOS, data_assinatura_inicio: inicioDoMes(hoje), data_assinatura_fim: hoje }, op, 'valor_global', 'contratos com data de assinatura no mês; a publicação no PNCP pode atrasar dias', cv('contratosMes', reserva?.hoje.slice(0, 7) === hoje.slice(0, 7) ? reserva?.contratosMes.valor : undefined)), reserva?.contratosMes, avisos, fontes),
        comReserva('contratosPublicadosHoje', () => medir({ ...CONTRATOS, data_publicacao_inicio: hoje, data_publicacao_fim: hoje }, op, 'valor_global', 'contratos publicados hoje no PNCP', cv('contratosPublicadosHoje', reserva?.hoje === hoje ? reserva?.contratosPublicadosHoje.valor : undefined)), reserva?.contratosPublicadosHoje, avisos, fontes),
        comReserva('porModalidade', async () => {
          const c: Contador = { requisicoes: 0 };
          const n = await Promise.all(MODALIDADES.map((m) => contar({ ...ABERTAS, modalidades: String(m.id) }, { ...op, revalidar: REVALIDAR.contagem }, c)));
          return MODALIDADES.map((m, i) => ({ id: m.id, nome: m.nome, abertas: n[i] })).filter((m) => m.abertas > 0).sort((a, b) => b.abertas - a.abertas);
        }, reserva?.porModalidade, avisos, fontes),
        comReserva('porEsfera', async () => {
          const c: Contador = { requisicoes: 0 };
          const n = await Promise.all(ESFERAS.map((e) => contar({ ...ABERTAS, esferas: e.id }, { ...op, revalidar: REVALIDAR.contagem }, c)));
          return ESFERAS.map((e, i) => ({ id: e.id, nome: e.nome, abertas: n[i] }));
        }, reserva?.porEsfera, avisos, fontes),
      ]);

    const ritmo = ultimaHora ? ultimaHora.quantidade / 60 : (reserva?.publicadasHoje.ritmoPorMinuto ?? 0);
    const publicadasHojeComRitmo: MedidaComRitmo = { ...publicadasHoje, ritmoPorMinuto: Math.round(ritmo * 100) / 100 };
    const fonte: Fonte = fontes.length ? 'snapshot' : 'pncp-ao-vivo';

    return {
      abertas: {
        ...abertas,
        valorEstimado: abertas.valor ? abertas.valor.valorSemAtipicos : null,
        fonte: abertas.procedencia.fonte,
        metodo: abertas.valor?.procedencia.metodo ?? abertas.procedencia.metodo,
      },
      publicadasHoje: publicadasHojeComRitmo,
      publicadas24h,
      publicadas30d,
      contratosMes,
      contratosPublicadosHoje,
      porModalidade,
      porEsfera,
      hoje,
      atualizadoEm: agora.toISOString(),
      fonte,
      avisos,
    };
  } finally {
    limpar();
    prazoValores.limpar();
  }
}

// ----------------------------------------------------------------- por UF

/**
 * Agregados por UF para o mapa/globo: abertas (exato), valor estimado das
 * abertas (topo exato + faixas, por UF) e publicadas nos últimos 30 dias
 * (exato). Orçamento medido: ~225 requisições, ~60 s a frio (UFs com ≤ 1.000 abertas somam
 * exato; as demais usam topo + 2 faixas/década) — pesado;
 * pensado para cache longo (3 h) ou para o script de snapshot.
 */
export async function porUf(opcoes: OpcoesAgregado = {}): Promise<PorUf> {
  const agora = opcoes.agora ?? new Date();
  const hoje = diaBrasilia(agora);
  const reserva = opcoes.reserva as PorUf | undefined;
  const { sinal, limpar } = criarSinal(opcoes.prazoTotalMs);
  const op: OpcoesRequisicao = { sinal };
  const avisos: string[] = [];
  const fontes: Fonte[] = [];

  try {
    const ufs = await Promise.all(
      UFS.map((ref) =>
        comReserva(
          `uf ${ref.uf}`,
          async (): Promise<UfAgregado> => {
            const consultadoEm = new Date().toISOString();
            const contador: Contador = { requisicoes: 0 };
            const filtro: FiltroBusca = { ...ABERTAS, ufs: ref.uf };
            const [abertas, publicadas30d] = await Promise.all([
              contar(filtro, { ...op, revalidar: REVALIDAR.contagem }, contador),
              contar({ ...PUBLICADAS, ufs: ref.uf, data_publicacao_inicio: somarDias(hoje, -29), data_publicacao_fim: hoje }, { ...op, revalidar: REVALIDAR.contagem }, contador),
            ]);
            // 2 faixas por década (≈ ±1% no total da UF; o intervalo continua garantido).
            const soma = await somarValores(filtro, 'valor_total_estimado', { ...op, revalidar: REVALIDAR.faixas }, contador, abertas, 2);
            return {
              ...ref,
              abertas,
              valorEstimado: soma.valor.valorSemAtipicos,
              valorEstimadoBruto: soma.valor.valor,
              valorIntervalo: soma.valor.intervaloSemAtipicos,
              publicadas30d,
              procedencia: procedencia(
                descreverFiltro(filtro),
                soma.metodo,
                contador,
                consultadoEm,
                `abertas e publicadas30d exatas; valor por ${soma.metodo}, sem registros ≥ R$ 10 bi`,
              ),
            };
          },
          reserva?.ufs.find((u) => u.uf === ref.uf),
          avisos,
          fontes,
        ),
      ),
    );
    return { ufs, atualizadoEm: agora.toISOString(), fonte: fontes.length ? 'snapshot' : 'pncp-ao-vivo', avisos };
  } finally {
    limpar();
  }
}

// ------------------------------------------------------------ série diária

export interface OpcoesSerie extends OpcoesAgregado {
  dias?: number;
  /**
   * Dias mais antigos que isto são reaproveitados da reserva, se lá
   * estiverem (a data de publicação no PNCP não muda depois de gravada).
   * Padrão 7. Use 0 para reconsultar tudo.
   */
  reconsultarUltimosDias?: number;
}

/**
 * Contratações publicadas por dia (dia civil de Brasília): uma contagem
 * exata por dia. Com reserva, só os dias recentes/ausentes são consultados
 * (≈ 7 requisições); sem reserva, `dias` requisições (365 ≈ 10 s).
 */
export async function serieDiaria(opcoes: OpcoesSerie = {}): Promise<SerieDiaria> {
  const agora = opcoes.agora ?? new Date();
  const dias = Math.min(Math.max(opcoes.dias ?? 365, 1), 730);
  const fim = diaBrasilia(agora);
  const inicio = somarDias(fim, -(dias - 1));
  const reserva = opcoes.reserva as SerieDiaria | undefined;
  const reconsultar = opcoes.reconsultarUltimosDias ?? 7;
  const limiteReuso = somarDias(fim, -reconsultar);
  const { sinal, limpar } = criarSinal(opcoes.prazoTotalMs);
  const avisos: string[] = [];
  const contador: Contador = { requisicoes: 0 };
  const consultadoEm = new Date().toISOString();

  const daReservaPorDia = new Map<string, number>();
  for (const p of reserva?.pontos ?? []) daReservaPorDia.set(p.date, p.count);

  try {
    let diasDoSnapshot = 0;
    let falhas = 0;
    const pontos: PontoSerie[] = await Promise.all(
      intervaloDeDias(inicio, fim).map(async (date) => {
        const salvo = daReservaPorDia.get(date);
        if (salvo !== undefined && date < limiteReuso) {
          diasDoSnapshot++;
          return { date, count: salvo };
        }
        try {
          const count = await contar(
            { ...PUBLICADAS, data_publicacao_inicio: date, data_publicacao_fim: date },
            { sinal, revalidar: date < limiteReuso ? REVALIDAR.diaPassado : REVALIDAR.contagem * 5 },
            contador,
          );
          return { date, count };
        } catch (erro) {
          if (salvo === undefined) throw erro;
          falhas++;
          diasDoSnapshot++;
          return { date, count: salvo };
        }
      }),
    );
    if (falhas) avisos.push(`${falhas} dia(s) recentes vieram do último retrato salvo (PNCP falhou).`);
    return {
      pontos,
      inicio,
      fim,
      procedencia: procedencia(
        descreverFiltro({ ...PUBLICADAS, data_publicacao_inicio: '<dia>', data_publicacao_fim: '<dia>' }),
        'exato-api',
        contador,
        consultadoEm,
        'uma contagem exata por dia; o dia de hoje está em andamento',
      ),
      diasDoSnapshot,
      atualizadoEm: agora.toISOString(),
      fonte: falhas ? 'snapshot' : 'pncp-ao-vivo',
      avisos,
    };
  } finally {
    limpar();
  }
}
