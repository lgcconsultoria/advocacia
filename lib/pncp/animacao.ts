// Funções puras para fazer os números "andarem" entre duas atualizações
// sem inventar dado: a projeção parte do último valor real, usa só ritmos
// observados (no próprio PNCP ou entre duas leituras) e para depois de um
// horizonte curto. Toda projeção vem marcada `estimado: true`, e a UI deve
// mostrar o horário real da última consulta ("atualizado há X min").

import { diaBrasilia } from './datas';

export interface Projecao {
  valor: number;
  /** true se o número exibido inclui projeção além do último valor real. */
  estimado: boolean;
}

/** "atualizado agora", "atualizado há 3 min", "atualizado há 2 h". */
export function rotuloAtualizado(iso: string, agora: Date = new Date()): string {
  const seg = Math.max(0, (agora.getTime() - new Date(iso).getTime()) / 1000);
  if (seg < 60) return 'atualizado agora';
  const min = Math.floor(seg / 60);
  if (min < 60) return `atualizado há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 48) return `atualizado há ${h} h`;
  return `atualizado em ${new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

/**
 * Contador que só cresce (ex.: publicadas hoje), com ritmo por minuto
 * medido pelo servidor na última hora. Projeta no máximo `horizonteMs`
 * além da consulta e zera a projeção quando vira o dia em Brasília.
 */
export function projetarContador(
  quantidade: number,
  consultadoEm: string,
  ritmoPorMinuto: number,
  agora: Date = new Date(),
  horizonteMs = 3 * 60_000,
): Projecao {
  const t0 = new Date(consultadoEm);
  if (diaBrasilia(agora) !== diaBrasilia(t0) || !(ritmoPorMinuto > 0)) {
    return { valor: quantidade, estimado: false };
  }
  const decorrido = Math.min(Math.max(0, agora.getTime() - t0.getTime()), horizonteMs);
  const extra = Math.floor((ritmoPorMinuto * decorrido) / 60_000);
  return { valor: quantidade + extra, estimado: extra > 0 };
}

export interface Leitura {
  valor: number;
  /** ISO 8601 da consulta ao PNCP. */
  em: string;
}

/**
 * Valor contínuo (ex.: R$ em aberto) a partir de duas leituras reais:
 * segue a taxa observada entre elas por até `horizonteMs`. Sem leitura
 * anterior, ou com leituras muito próximas, devolve o valor real.
 */
export function projetarPorTaxa(
  anterior: Leitura | null,
  atual: Leitura,
  agora: Date = new Date(),
  horizonteMs = 3 * 60_000,
): Projecao {
  if (!anterior) return { valor: atual.valor, estimado: false };
  const dt = new Date(atual.em).getTime() - new Date(anterior.em).getTime();
  if (dt < 30_000) return { valor: atual.valor, estimado: false };
  const taxa = (atual.valor - anterior.valor) / dt;
  const decorrido = Math.min(Math.max(0, agora.getTime() - new Date(atual.em).getTime()), horizonteMs);
  const extra = taxa * decorrido;
  return { valor: atual.valor + extra, estimado: Math.abs(extra) > 0 };
}

/** Interpolação suave (ease-out) entre o número exibido e o novo valor real. */
export function suavizar(de: number, para: number, progresso: number): number {
  const p = Math.min(Math.max(progresso, 0), 1);
  return de + (para - de) * (1 - (1 - p) ** 3);
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const COMPACTO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

/** R$ 201,6 bi / R$ 4,6 mi / R$ 12.500 */
export function formatarReais(valor: number): string {
  const abs = Math.abs(valor);
  if (abs >= 1e12) return `R$ ${COMPACTO.format(valor / 1e12)} tri`;
  if (abs >= 1e9) return `R$ ${COMPACTO.format(valor / 1e9)} bi`;
  if (abs >= 1e6) return `R$ ${COMPACTO.format(valor / 1e6)} mi`;
  return BRL.format(valor);
}

export function formatarInteiro(n: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(n));
}

/** Textos fixos de fonte e ressalvas para a UI. */
export const AVISOS_UI = {
  fonte:
    'Fonte: PNCP — Portal Nacional de Contratações Públicas (Lei 14.133/2021). Dados públicos consultados automaticamente; contagens atualizadas a cada 2 minutos, valores a cada 15 minutos e o mapa por estado a cada 3 horas.',
  valores:
    'Valores estimados informados pelos próprios órgãos ao publicar a contratação. A soma exclui registros acima de R$ 10 bilhões, em regra erros de cadastro, e pode variar cerca de 1% em relação à soma registro a registro.',
  animacao:
    'Entre uma atualização e outra, os contadores avançam no ritmo observado na última hora; é uma projeção, conferida a cada nova consulta.',
  abertas: 'Contratações com recebimento de propostas aberto ou a abrir, em todo o país.',
  reserva: 'O PNCP não respondeu agora; exibindo o último retrato salvo.',
} as const;
