// Tipos públicos do termômetro de contratações públicas (PNCP).
// Regra da casa: todo número carrega a sua procedência — de onde veio,
// como foi calculado e quando foi consultado. Nada é inventado; o que é
// estimativa vem marcado como estimativa, com intervalo.

/**
 * Como o número foi obtido.
 * - `exato-api`: total devolvido pela própria API (campo `total`/`totalRegistros`).
 * - `soma-exata`: soma de todos os registros, baixados um a um.
 * - `topo-exato+faixas`: os maiores valores somados um a um; o restante
 *   estimado por contagens exatas em faixas de valor (ver `ValorEstimado`).
 * - `snapshot`: copiado do último retrato salvo (PNCP lento ou fora do ar).
 */
export type Metodo = 'exato-api' | 'soma-exata' | 'topo-exato+faixas';

export type Fonte = 'pncp-ao-vivo' | 'snapshot';

export interface Procedencia {
  fonte: Fonte;
  metodo: Metodo;
  /** Endpoint do PNCP e filtros usados (texto para auditoria). */
  endpoint: string;
  /** Requisições feitas ao PNCP para obter este número. */
  requisicoes: number;
  /** ISO 8601 (UTC) do momento em que o PNCP foi consultado. */
  consultadoEm: string;
  observacao?: string;
}

/** Soma de valores (R$) com a margem de erro do método. */
export interface ValorEstimado {
  /** Melhor estimativa da soma dos valores informados pelos órgãos (R$). */
  valor: number;
  /** Limites garantidos: a soma verdadeira está dentro deste intervalo. */
  intervalo: [number, number];
  /**
   * Mesma soma sem os registros com valor ≥ `atipicos.limite` (R$ 10 bi),
   * que no PNCP são quase sempre erro de digitação do órgão (ex.: um
   * credenciamento municipal de R$ 121 bi). A UI deve preferir este.
   */
  valorSemAtipicos: number;
  /** Limites garantidos de `valorSemAtipicos` (os atípicos são somados um a um). */
  intervaloSemAtipicos: [number, number];
  atipicos: { limite: number; quantidade: number; valor: number };
  /** Registros sem valor (zero, negativo, sigiloso ou nulo). */
  semValorInformado: number;
  procedencia: Procedencia;
}

export interface Medida {
  quantidade: number;
  procedencia: Procedencia;
  /** Presente quando o valor (R$) também foi apurado. */
  valor?: ValorEstimado;
}

export interface MedidaComRitmo extends Medida {
  /**
   * Publicações por minuto na última hora (contagem exata da última hora ÷ 60).
   * Serve para animar o contador entre atualizações — como estimativa.
   */
  ritmoPorMinuto: number;
}

export interface Termometro {
  /** Contratações recebendo propostas agora (inclui "a receber"). */
  abertas: Medida & { valorEstimado: number | null; fonte: Fonte; metodo: Metodo };
  publicadasHoje: MedidaComRitmo;
  publicadas24h: Medida;
  publicadas30d: Medida;
  /** Contratos com data de assinatura no mês corrente (Brasília). */
  contratosMes: Medida;
  /** Contratos publicados hoje no PNCP (assinatura costuma ser dias antes). */
  contratosPublicadosHoje: Medida;
  porModalidade: { id: number; nome: string; abertas: number }[];
  porEsfera: { id: string; nome: string; abertas: number }[];
  /** Dia civil de Brasília a que "hoje" se refere. */
  hoje: string;
  /** ISO 8601 (UTC): quando este conjunto foi montado. */
  atualizadoEm: string;
  /** `snapshot` se ao menos uma parte veio do retrato salvo. */
  fonte: Fonte;
  avisos: string[];
}

export interface UfAgregado {
  uf: string;
  nome: string;
  capital: string;
  lat: number;
  lng: number;
  abertas: number;
  /** Soma (R$) dos valores estimados das contratações abertas, sem atípicos. */
  valorEstimado: number;
  valorEstimadoBruto: number;
  /** Limites garantidos de `valorEstimado` (sem atípicos). */
  valorIntervalo: [number, number];
  publicadas30d: number;
  procedencia: Procedencia;
}

export interface PorUf {
  ufs: UfAgregado[];
  atualizadoEm: string;
  fonte: Fonte;
  avisos: string[];
}

export interface PontoSerie {
  date: string;
  count: number;
}

export interface SerieDiaria {
  /** Contratações publicadas por dia (dia civil de Brasília), em ordem. */
  pontos: PontoSerie[];
  inicio: string;
  fim: string;
  procedencia: Procedencia;
  /** Dias reaproveitados do snapshot (não reconsultados nesta montagem). */
  diasDoSnapshot: number;
  atualizadoEm: string;
  fonte: Fonte;
  avisos: string[];
}
