// Cliente de baixo nível do PNCP: fetch com prazo, novas tentativas com
// recuo exponencial, limite de concorrência e User-Agent do site.
//
// Duas APIs:
// - BUSCA (`/api/search/`): a mesma que o portal pncp.gov.br usa. Devolve
//   `total` exato, aceita filtros por UF, modalidade, esfera, datas (com
//   hora) e faixa de valor, e ordena por valor. Sem limite de taxa
//   observado, mas o firewall derruba a conexão (ECONNRESET) de clientes
//   cujo User-Agent não pareça navegador — por isso o UA abaixo.
//   Janela máxima: pagina × tam_pagina ≤ 10.000.
// - CONSULTA (`/api/consulta/v1`): a API oficial documentada (Swagger).
//   Limite de taxa agressivo (HTTP 429 em HTML após ~20 requisições em
//   poucos segundos, sem Retry-After; libera em 20–60 s). Usada só como
//   conferência.
//
// Funciona no Next (o `next.revalidate` liga o Data Cache) e no Node puro
// (scripts), onde a opção `next` é ignorada.

export const URL_BUSCA = 'https://pncp.gov.br/api/search/';
export const URL_CONSULTA = 'https://pncp.gov.br/api/consulta/v1';

/**
 * UA de navegador + identificação do site. Medido em 07/10/2026: com UA
 * "de robô" (curl, node, "SenturiaoAdv/1.0") 60–80% das chamadas à busca
 * levam ECONNRESET; com este, 0%.
 */
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/130 Safari/537.36 SenturiaoAdv-Termometro/1.0 (+https://senturiaoadv.com.br)';

export class ErroPncp extends Error {
  status: number;
  url: string;
  constructor(mensagem: string, status: number, url: string) {
    super(mensagem);
    this.name = 'ErroPncp';
    this.status = status;
    this.url = url;
  }
}

// ---------------------------------------------------------------- semáforo

let concorrenciaMaxima = 10;
let emCurso = 0;
const fila: (() => void)[] = [];

/** Ajusta o limite global de requisições simultâneas ao PNCP. */
export function definirConcorrencia(n: number): void {
  concorrenciaMaxima = Math.max(1, Math.floor(n));
}

async function comVaga<T>(tarefa: () => Promise<T>): Promise<T> {
  if (emCurso >= concorrenciaMaxima) {
    await new Promise<void>((liberar) => fila.push(liberar));
  }
  emCurso++;
  try {
    return await tarefa();
  } finally {
    emCurso--;
    const proximo = fila.shift();
    if (proximo) proximo();
  }
}

// ----------------------------------------------------------- requisição

export interface OpcoesRequisicao {
  /** Prazo por tentativa, em ms (padrão 15 s). */
  prazoMs?: number;
  /** Novas tentativas além da primeira (padrão 2). */
  tentativas?: number;
  /** Segundos no Data Cache do Next (só tem efeito dentro do Next). */
  revalidar?: number;
  /** Cancela tudo (ex.: prazo total da rota estourou). */
  sinal?: AbortSignal;
}

type Parametros = Record<string, string | number | boolean | undefined | null>;

/** Contador de requisições feitas, para a procedência dos números. */
export interface Contador {
  requisicoes: number;
  /**
   * Instante (ms) da resposta mais antiga usada, pelo cabeçalho `Date` do PNCP. Com o Data Cache do Next,
   * a resposta guardada mantém o `Date` original: é ele que diz quando o PNCP foi de fato consultado.
   */
  respostaEm?: number;
}

function montarUrl(base: string, params: Parametros): string {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * GET com prazo, novas tentativas e limite de concorrência.
 * Devolve o JSON, ou `null` em 204 (a CONSULTA responde 204 quando não há registros).
 */
export async function requisitar<T>(
  url: string,
  opcoes: OpcoesRequisicao = {},
  contador?: Contador,
): Promise<T | null> {
  const { prazoMs = 12_000, tentativas = 2, revalidar, sinal } = opcoes;
  let ultimoErro: unknown;

  for (let tentativa = 0; tentativa <= tentativas; tentativa++) {
    if (sinal?.aborted) throw new ErroPncp('cancelado', 0, url);
    try {
      return await comVaga(async () => {
        if (contador) contador.requisicoes++;
        const controle = new AbortController();
        const cancelar = () => controle.abort();
        const timer = setTimeout(cancelar, prazoMs);
        sinal?.addEventListener('abort', cancelar, { once: true });
        try {
          const init: RequestInit & { next?: { revalidate?: number } } = {
            headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
            signal: controle.signal,
          };
          if (revalidar !== undefined) init.next = { revalidate: revalidar };
          const res = await fetch(url, init);
          const data = Date.parse(res.headers.get('date') ?? '');
          if (contador && Number.isFinite(data)) {
            contador.respostaEm = Math.min(contador.respostaEm ?? data, data);
          }
          if (res.status === 204) return null;
          if (!res.ok) {
            const corpo = (await res.text()).slice(0, 200);
            throw new ErroPncp(`HTTP ${res.status}: ${corpo}`, res.status, url);
          }
          return (await res.json()) as T;
        } finally {
          clearTimeout(timer);
          sinal?.removeEventListener('abort', cancelar);
        }
      });
    } catch (erro) {
      ultimoErro = erro;
      const status = erro instanceof ErroPncp ? erro.status : 0;
      // 4xx (exceto 429) é erro nosso de parâmetro: não adianta repetir.
      if (status >= 400 && status < 500 && status !== 429) break;
      if (tentativa < tentativas) {
        const base = status === 429 ? 20_000 : 600 * 2 ** tentativa;
        await esperar(base + Math.random() * 400);
      }
    }
  }
  if (ultimoErro instanceof ErroPncp) throw ultimoErro;
  throw new ErroPncp(
    `falha de rede: ${(ultimoErro as Error)?.message ?? String(ultimoErro)}`,
    0,
    url,
  );
}

// ------------------------------------------------------------------ busca

/** Item da busca do PNCP (só os campos que o termômetro usa). */
export interface ItemBusca {
  id: string;
  numero_controle_pncp: string | null;
  uf: string | null;
  modalidade_licitacao_id: string | null;
  esfera_id: string | null;
  tipo_id: string | null;
  valor_total_estimado: number | null;
  valor_global: number | null;
  data_publicacao_pncp: string | null;
  data_assinatura: string | null;
  data_fim_vigencia: string | null;
}

export interface RespostaBusca {
  total: number;
  items: ItemBusca[];
}

/** Filtros da busca. Listas múltiplas usam "|" (ex.: ufs: 'SP|MG'). */
export interface FiltroBusca {
  tipos_documento: 'edital' | 'contrato' | 'ata';
  status: 'recebendo_proposta' | 'propostas_encerradas' | 'encerradas' | 'todos' | 'vigente' | 'nao_vigente';
  ufs?: string;
  modalidades?: string;
  esferas?: string;
  /** 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:mm:ss' (horário de Brasília). */
  data_publicacao_inicio?: string;
  data_publicacao_fim?: string;
  data_assinatura_inicio?: string;
  data_assinatura_fim?: string;
  valor_total_estimado_min?: number;
  valor_total_estimado_max?: number;
  valor_global_min?: number;
  valor_global_max?: number;
}

export interface PaginaBusca {
  pagina?: number;
  tam_pagina?: number;
  ordenacao?: '-data' | 'data' | '-valor_total_estimado' | 'valor_total_estimado' | '-valor_global' | 'valor_global';
}

export function urlBusca(filtro: FiltroBusca, pagina: PaginaBusca = {}): string {
  return montarUrl(URL_BUSCA, {
    ...filtro,
    ordenacao: pagina.ordenacao ?? '-data',
    pagina: pagina.pagina ?? 1,
    tam_pagina: pagina.tam_pagina ?? 10,
  } as Parametros);
}

export async function buscar(
  filtro: FiltroBusca,
  pagina: PaginaBusca = {},
  opcoes: OpcoesRequisicao = {},
  contador?: Contador,
): Promise<RespostaBusca> {
  const tam = pagina.tam_pagina ?? 10;
  const n = pagina.pagina ?? 1;
  if (n * tam > 10_000) throw new ErroPncp('janela da busca > 10.000', 400, URL_BUSCA);
  const r = await requisitar<RespostaBusca>(urlBusca(filtro, pagina), opcoes, contador);
  return { total: r?.total ?? 0, items: r?.items ?? [] };
}

/** Total exato de registros que casam com o filtro (1 requisição, ~3 KB). */
export async function contar(
  filtro: FiltroBusca,
  opcoes: OpcoesRequisicao = {},
  contador?: Contador,
): Promise<number> {
  const r = await buscar(filtro, { tam_pagina: 1 }, opcoes, contador);
  return r.total;
}

// --------------------------------------------------------------- consulta

export interface RespostaConsulta<T> {
  data: T[];
  totalRegistros: number;
  totalPaginas: number;
  numeroPagina: number;
  paginasRestantes: number;
  empty: boolean;
}

/** GET na API de Consultas oficial. Datas no formato yyyyMMdd. */
export async function consultar<T = unknown>(
  caminho: string,
  params: Parametros,
  opcoes: OpcoesRequisicao = {},
  contador?: Contador,
): Promise<RespostaConsulta<T>> {
  const r = await requisitar<RespostaConsulta<T>>(
    montarUrl(URL_CONSULTA + caminho, params),
    opcoes,
    contador,
  );
  return (
    r ?? { data: [], totalRegistros: 0, totalPaginas: 0, numeroPagina: 1, paginasRestantes: 0, empty: true }
  );
}
