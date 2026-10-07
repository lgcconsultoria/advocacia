/**
 * Simulador ilustrativo: Simples Nacional "puro" × Simples "híbrido" (opção pelo
 * regime regular do IBS e da CBS) sob a Reforma Tributária (LC 214/2025).
 *
 * Este arquivo é a porta, em escala de uma empresa e de uma fatura, do motor de
 * diagnóstico do escritório (Sistema-Juridico, `packages/juridico/diagnostico`,
 * regras `v2026.09`, dossiê `docs/superpowers/specs/2026-09-23-diagnostico-lc214-regras.md`).
 * As tabelas abaixo foram exportadas do YAML do motor (`regras/v2026.09/simples.yaml`,
 * `aliquotas.yaml`, `cronograma.yaml`) e as fórmulas seguem `motor/simples.py`,
 * `motor/regimes.py` e `motor/_regimes_util.py`. `scripts/tributario/verificar.mjs`
 * confere os números contra o motor em Python.
 *
 * Escopo (o que o motor faz e este simulador deliberadamente não faz): receita até o
 * sublimite de R$ 3,6 milhões; serviços dos Anexos III e V (comércio e indústria não
 * estão tabelados no motor); alíquota cheia (sem regimes diferenciados); compras só
 * de fornecedores do regime regular; sem FGTS (igual nos dois regimes); sem saldo
 * credor/ressarcimento. Tudo o que é premissa está em `premissas`.
 *
 * Funções puras, sem dependências: roda no navegador, no servidor e no `node --test`
 * (Node 24, remoção de tipos). Por isso nada de `enum` nem de import relativo.
 */

// ── Tipos públicos ───────────────────────────────────────────────────────────────

export type Ano = 2027 | 2028 | 2029 | 2030 | 2031 | 2032 | 2033;
export type Anexo = 'III' | 'V';
/** `servicos_iii`: atividade do Anexo III. `servicos_fator_r`: atividade do Anexo V
 * que vai ao Anexo III quando o fator R chega a 28% (LC 123, art. 18, §§ 5º-J e 5º-M). */
export type Atividade = 'servicos_iii' | 'servicos_fator_r';
/** `mantido`: o preço total da fatura não muda (no híbrido o IBS/CBS sai de dentro
 * dele — padrão do motor). `por_cima`: o IBS/CBS do híbrido é cobrado por cima do preço. */
export type Repasse = 'mantido' | 'por_cima';
export type Regime = 'puro' | 'hibrido';

export interface EntradaSimulacao {
  /** Receita bruta dos últimos 12 meses (RBT12), em R$. Também é a receita do ano. */
  faturamento12m: number;
  /** Valor de uma fatura (nota) emitida a uma empresa do regime regular, em R$. */
  faturaValor: number;
  atividade: Atividade;
  /** (Folha + pró-labore dos 12 meses) ÷ receita. Só pesa em `servicos_fator_r`. */
  fatorR?: number;
  /** Fração da receita vendida a empresas do regime regular que usam o serviço na
   * própria atividade (0 a 1). O resto: pessoas físicas ou empresas do Simples puro. */
  percentualB2B: number;
  /** Compras anuais de fornecedores do regime regular, em R$ (IBS/CBS dentro do preço). */
  comprasCreditaveis?: number;
  /** Alternativa: compras creditáveis como fração da receita (0 a 1). */
  comprasCreditaveisPct?: number;
  /** 2027 a 2033. Padrão: 2027. */
  ano?: Ano;
  /** Alíquota de referência (CBS + IBS cheios). Número = soma, dividida na proporção
   * IBS/CBS da estimada. Padrão: estimada, IBS 18,70% + CBS 9,21% = 27,91%. */
  aliquotaReferencia?: number | { cbs: number; ibs: number };
  repasse?: Repasse;
  /** Base do IBS/CBS no híbrido sem o ISS embutido no DAS (premissa do motor). Padrão: true. */
  baseHibridoDeduzIss?: boolean;
}

export interface Premissa {
  id: string;
  texto: string;
  fonte: string;
  /** `lei`: conferido no texto; `premissa`: a norma é omissa e o escritório adota uma
   * leitura; `estimativa`: número que ainda não é lei (alíquota de referência). */
  natureza: 'lei' | 'premissa' | 'estimativa';
}

/** Uma fatura vista pelos dois lados: o que a empresa recolhe e o que o cliente credita. */
export interface LadoFatura {
  regime: Regime;
  /** O que o cliente paga pela fatura. */
  valorCobrado: number;
  /** DAS da fatura. */
  das: number;
  /** CBS + IBS que estão dentro do DAS (puro). No híbrido, zero. */
  ibsCbsNoDas: number;
  /** IBS + CBS destacados na nota, por fora do DAS (híbrido). No puro, zero. */
  ibsCbsDestacado: number;
  /** Crédito de IBS/CBS da empresa sobre as compras ligadas a esta fatura (híbrido). */
  creditoCompras: number;
  /** IBS/CBS que a empresa recolhe por fora: destacado − crédito das compras (≥ 0). */
  ibsCbsRecolher: number;
  /** Imposto líquido da empresa na fatura: DAS + IBS/CBS a recolher. */
  impostoEmpresa: number;
  /** Crédito de IBS/CBS que o cliente (regime regular) toma. */
  creditoCliente: number;
  /** Custo líquido da fatura para o cliente: valor pago − crédito. */
  custoLiquidoCliente: number;
  /** O que sobra para a empresa: valor cobrado − imposto líquido. */
  receitaLiquidaEmpresa: number;
  /** Imposto que fica na cadeia (empresa + cliente): imposto da empresa − crédito do cliente. */
  custoCadeia: number;
}

export interface LadoAnual {
  regime: Regime;
  anexo: Anexo;
  faixa: number;
  rbt12: number;
  /** Alíquota efetiva do Simples (fração). */
  aliquotaEfetiva: number;
  das: number;
  ibsCbsRecolher: number;
  creditoCompras: number;
  /** Imposto da empresa no ano (carga do motor, sem FGTS). */
  impostoEmpresa: number;
  /** Crédito entregue aos clientes do regime regular no ano. */
  creditoClientes: number;
  custoCadeia: number;
  /** Custo líquido de R$ 100 faturados para o cliente PJ (métrica do motor). */
  custoLiquidoPjPor100: number;
  /** Valor cobrado no ano − imposto da empresa. */
  receitaLiquidaEmpresa: number;
}

export interface Diferencas {
  /** híbrido − puro (negativo = híbrido mais barato para o cliente). */
  custoCliente: number;
  /** híbrido − puro (positivo = a empresa paga mais no híbrido). */
  impostoEmpresa: number;
  /** híbrido − puro no que sobra para a empresa (valor cobrado − imposto). */
  receitaEmpresa: number;
  /** puro − híbrido no imposto da cadeia (positivo = o híbrido tira imposto da cadeia). */
  ganhoCadeia: number;
}

export type TipoVeredito = 'hibrido' | 'hibrido_com_preco' | 'empate' | 'puro';

export interface Veredito {
  tipo: TipoVeredito;
  /** Frase-síntese ("Neste cenário, ..."). */
  titulo: string;
  texto: string;
}

export interface ResultadoSimulacao {
  entrada: Required<Omit<EntradaSimulacao, 'comprasCreditaveisPct' | 'aliquotaReferencia'>> & {
    aliquotaReferencia: { cbs: number; ibs: number };
  };
  ano: Ano;
  /** Alíquotas do IBS e da CBS no ano, por fora (regime regular). */
  aliquotasAno: { cbs: number; ibs: number; soma: number };
  fatura: { puro: LadoFatura; hibrido: LadoFatura; diferencas: Diferencas };
  anual: { puro: LadoAnual; hibrido: LadoAnual; diferencas: Diferencas };
  veredito: Veredito;
  /** Passos em linguagem simples, com os números do cenário. */
  explicacoes: string[];
  premissas: Premissa[];
}

// ── Regras (exportadas do motor, v2026.09) ───────────────────────────────────────

/** [teto da faixa (RBT12), alíquota nominal, parcela a deduzir, partilha da CBS, do IBS e do ISS]. */
type FaixaT = readonly [number, number, number, { readonly cbs: number; readonly ibs: number; readonly iss: number }];
type Periodo = '2027' | '2029' | '2030' | '2031' | '2032' | '2033';

const DISP_III = 'LC 123/2006, Anexo III (redação do Anexo XX da LC 214/2025, com a LC 227/2026)';
const DISP_V = 'LC 123/2006, Anexo V (redação do Anexo XXII da LC 214/2025)';

/**
 * Faixas 1 a 5 (até o sublimite de R$ 3,6 mi). Da partilha legal ficam só CBS, IBS e
 * ISS — os demais tributos do DAS (IRPJ, CSLL, CPP) não mudam entre puro e híbrido.
 * Período "2027" vale para 2027 e 2028; "2033" para 2033 em diante.
 */
const ANEXOS: Record<Anexo, Record<Periodo, readonly FaixaT[]>> = {
  III: {
    '2027': [
      [180000, 0.06, 0, { cbs: 0.1543, ibs: 0.0017, iss: 0.335 }],
      [360000, 0.112, 9360, { cbs: 0.1691, ibs: 0.0019, iss: 0.32 }],
      [720000, 0.135, 17640, { cbs: 0.1641, ibs: 0.0019, iss: 0.325 }],
      [1800000, 0.16, 35640, { cbs: 0.1641, ibs: 0.0019, iss: 0.325 }],
      [3600000, 0.21, 125640, { cbs: 0.1543, ibs: 0.0017, iss: 0.335 }],
    ],
    '2029': [
      [180000, 0.06, 0, { cbs: 0.156, ibs: 0.0335, iss: 0.3015 }],
      [360000, 0.112, 9360, { cbs: 0.171, ibs: 0.032, iss: 0.288 }],
      [720000, 0.135, 17640, { cbs: 0.166, ibs: 0.0325, iss: 0.2925 }],
      [1800000, 0.16, 35640, { cbs: 0.166, ibs: 0.0325, iss: 0.2925 }],
      [3600000, 0.21, 125640, { cbs: 0.156, ibs: 0.0335, iss: 0.3015 }],
    ],
    '2030': [
      [180000, 0.06, 0, { cbs: 0.156, ibs: 0.067, iss: 0.268 }],
      [360000, 0.112, 9360, { cbs: 0.171, ibs: 0.064, iss: 0.256 }],
      [720000, 0.135, 17640, { cbs: 0.166, ibs: 0.065, iss: 0.26 }],
      [1800000, 0.16, 35640, { cbs: 0.166, ibs: 0.065, iss: 0.26 }],
      [3600000, 0.21, 125640, { cbs: 0.156, ibs: 0.067, iss: 0.268 }],
    ],
    '2031': [
      [180000, 0.06, 0, { cbs: 0.156, ibs: 0.1005, iss: 0.2345 }],
      [360000, 0.112, 9360, { cbs: 0.171, ibs: 0.096, iss: 0.224 }],
      [720000, 0.135, 17640, { cbs: 0.166, ibs: 0.0975, iss: 0.2275 }],
      [1800000, 0.16, 35640, { cbs: 0.166, ibs: 0.0975, iss: 0.2275 }],
      [3600000, 0.21, 125640, { cbs: 0.156, ibs: 0.1005, iss: 0.2345 }],
    ],
    '2032': [
      [180000, 0.06, 0, { cbs: 0.156, ibs: 0.134, iss: 0.201 }],
      [360000, 0.112, 9360, { cbs: 0.171, ibs: 0.128, iss: 0.192 }],
      [720000, 0.135, 17640, { cbs: 0.166, ibs: 0.13, iss: 0.195 }],
      [1800000, 0.16, 35640, { cbs: 0.166, ibs: 0.13, iss: 0.195 }],
      [3600000, 0.21, 125640, { cbs: 0.156, ibs: 0.134, iss: 0.201 }],
    ],
    '2033': [
      [180000, 0.06, 0, { cbs: 0.156, ibs: 0.335, iss: 0 }],
      [360000, 0.112, 9360, { cbs: 0.171, ibs: 0.32, iss: 0 }],
      [720000, 0.135, 17640, { cbs: 0.166, ibs: 0.325, iss: 0 }],
      [1800000, 0.16, 35640, { cbs: 0.166, ibs: 0.325, iss: 0 }],
      [3600000, 0.21, 125640, { cbs: 0.156, ibs: 0.335, iss: 0 }],
    ],
  },
  V: {
    '2027': [
      [180000, 0.155, 0, { cbs: 0.1696, ibs: 0.0019, iss: 0.14 }],
      [360000, 0.18, 4500, { cbs: 0.1696, ibs: 0.0019, iss: 0.17 }],
      [720000, 0.195, 9900, { cbs: 0.1795, ibs: 0.002, iss: 0.19 }],
      [1800000, 0.205, 17100, { cbs: 0.1894, ibs: 0.0021, iss: 0.21 }],
      [3600000, 0.23, 62100, { cbs: 0.1696, ibs: 0.0019, iss: 0.235 }],
    ],
    '2029': [
      [180000, 0.155, 0, { cbs: 0.1715, ibs: 0.014, iss: 0.126 }],
      [360000, 0.18, 4500, { cbs: 0.1715, ibs: 0.017, iss: 0.153 }],
      [720000, 0.195, 9900, { cbs: 0.1815, ibs: 0.019, iss: 0.171 }],
      [1800000, 0.205, 17100, { cbs: 0.1915, ibs: 0.021, iss: 0.189 }],
      [3600000, 0.23, 62100, { cbs: 0.1715, ibs: 0.0235, iss: 0.2115 }],
    ],
    '2030': [
      [180000, 0.155, 0, { cbs: 0.1715, ibs: 0.028, iss: 0.112 }],
      [360000, 0.18, 4500, { cbs: 0.1715, ibs: 0.034, iss: 0.136 }],
      [720000, 0.195, 9900, { cbs: 0.1815, ibs: 0.038, iss: 0.152 }],
      [1800000, 0.205, 17100, { cbs: 0.1915, ibs: 0.042, iss: 0.168 }],
      [3600000, 0.23, 62100, { cbs: 0.1715, ibs: 0.047, iss: 0.188 }],
    ],
    '2031': [
      [180000, 0.155, 0, { cbs: 0.1715, ibs: 0.042, iss: 0.098 }],
      [360000, 0.18, 4500, { cbs: 0.1715, ibs: 0.051, iss: 0.119 }],
      [720000, 0.195, 9900, { cbs: 0.1815, ibs: 0.057, iss: 0.133 }],
      [1800000, 0.205, 17100, { cbs: 0.1915, ibs: 0.063, iss: 0.147 }],
      [3600000, 0.23, 62100, { cbs: 0.1715, ibs: 0.0705, iss: 0.1645 }],
    ],
    '2032': [
      [180000, 0.155, 0, { cbs: 0.1715, ibs: 0.056, iss: 0.084 }],
      [360000, 0.18, 4500, { cbs: 0.1715, ibs: 0.068, iss: 0.102 }],
      [720000, 0.195, 9900, { cbs: 0.1815, ibs: 0.076, iss: 0.114 }],
      [1800000, 0.205, 17100, { cbs: 0.1915, ibs: 0.084, iss: 0.126 }],
      [3600000, 0.23, 62100, { cbs: 0.1715, ibs: 0.094, iss: 0.141 }],
    ],
    '2033': [
      [180000, 0.155, 0, { cbs: 0.1715, ibs: 0.14, iss: 0 }],
      [360000, 0.18, 4500, { cbs: 0.1715, ibs: 0.17, iss: 0 }],
      [720000, 0.195, 9900, { cbs: 0.1815, ibs: 0.19, iss: 0 }],
      [1800000, 0.205, 17100, { cbs: 0.1915, ibs: 0.21, iss: 0 }],
      [3600000, 0.23, 62100, { cbs: 0.1715, ibs: 0.235, iss: 0 }],
    ],
  },
};

/**
 * Nota (*) do Anexo III, 5ª faixa: se a alíquota efetiva passa do limiar, o ISS fica
 * fixo em `issMax` e cada tributo vale (efetiva − issMax) × fator. O Anexo V não tem
 * a regra; em 2033 o ISS está extinto.
 */
const TETO_ISS_III: Partial<Record<Periodo, { limiar: number; issMax: number; cbs: number; ibs: number }>> = {
  '2027': { limiar: 0.1492537, issMax: 0.05, cbs: 0.232, ibs: 0.0026 },
  '2029': { limiar: 0.1492537, issMax: 0.045, cbs: 0.2233, ibs: 0.048 },
  '2030': { limiar: 0.1492537, issMax: 0.04, cbs: 0.2131, ibs: 0.0915 },
  '2031': { limiar: 0.1492537, issMax: 0.035, cbs: 0.2038, ibs: 0.1313 },
  '2032': { limiar: 0.1492537, issMax: 0.03, cbs: 0.1952, ibs: 0.1677 },
};

/** Alíquota de referência estimada (Res. CGIBS 14/2026, Quadro 2; CBS deduzida). */
export const REFERENCIA_ESTIMADA = { cbs: 0.0921, ibs: 0.187 } as const;
/** CBS de 2027 e 2028 = referência − 0,1 p.p.; IBS fixo em 0,1% (LC 214, arts. 344 e 347). */
const REDUTOR_CBS_2027_2028 = 0.001;
const IBS_FIXO_2027_2028 = 0.001;
/** Fração do IBS de referência em cada ano (LC 214, arts. 361 a 365; 2029–2032 = premissa). */
const FATOR_IBS: Record<Ano, number> = { 2027: 0, 2028: 0, 2029: 0.1, 2030: 0.2, 2031: 0.3, 2032: 0.4, 2033: 1 };

export const FATOR_R_LIMITE = 0.28;
export const SUBLIMITE = 3_600_000;
export const ANOS: readonly Ano[] = [2027, 2028, 2029, 2030, 2031, 2032, 2033];

export const ATIVIDADES: Record<Atividade, { rotulo: string; detalhe: string; anexo: Anexo }> = {
  servicos_iii: {
    rotulo: 'Serviços do Anexo III',
    detalhe: 'Ex.: cursos livres, agência de viagens e demais serviços do Anexo III.',
    anexo: 'III',
  },
  servicos_fator_r: {
    rotulo: 'Serviços intelectuais (Anexo V, com fator R)',
    detalhe: 'Ex.: consultoria, engenharia, publicidade. Com folha ≥ 28% da receita, vão ao Anexo III.',
    anexo: 'V',
  },
};

/** Cenário de demonstração: a "fatura de R$ 100 mil" de uma empresa de serviços B2B
 * no Anexo III (por exemplo, consultoria com fator R ≥ 28%), RBT12 de R$ 1,8 mi
 * (4ª faixa) e compras creditáveis de 20% da receita. */
export const CENARIO_DEMO: EntradaSimulacao = {
  faturamento12m: 1_800_000,
  faturaValor: 100_000,
  atividade: 'servicos_fator_r',
  fatorR: 0.3,
  percentualB2B: 1,
  comprasCreditaveisPct: 0.2,
  ano: 2027,
  repasse: 'mantido',
};

// ── Aritmética ───────────────────────────────────────────────────────────────────

/** Arredonda para centavos, meia unidade para cima (o único arredondamento do motor). */
export function centavos(v: number): number {
  const x = Math.abs(v) * 100;
  const r = Math.floor(x + 0.5 + 1e-7);
  return (Math.sign(v) * r) / 100 || 0;
}

const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

function periodo(ano: number): Periodo {
  if (ano <= 2028) return '2027';
  if (ano >= 2033) return '2033';
  return String(ano) as Periodo;
}

function normalizarReferencia(ref: EntradaSimulacao['aliquotaReferencia']): { cbs: number; ibs: number } {
  if (ref === undefined) return { ...REFERENCIA_ESTIMADA };
  if (typeof ref === 'number') {
    // Mesma divisão do motor: IBS na proporção da estimada (10 casas); a CBS fecha a soma.
    const razao = REFERENCIA_ESTIMADA.ibs / (REFERENCIA_ESTIMADA.cbs + REFERENCIA_ESTIMADA.ibs);
    const ibs = Math.round(ref * razao * 1e10) / 1e10;
    return { cbs: ref - ibs, ibs };
  }
  return { cbs: ref.cbs, ibs: ref.ibs };
}

/** CBS e IBS do ano, por fora, alíquota cheia (motor/aliquotas.py, `aliquotas_cheias`). */
export function aliquotasDoAno(ano: Ano, ref: { cbs: number; ibs: number } = REFERENCIA_ESTIMADA) {
  const cbs = ano <= 2028 ? ref.cbs - REDUTOR_CBS_2027_2028 : ref.cbs;
  const ibs = ano <= 2028 ? IBS_FIXO_2027_2028 : ref.ibs * FATOR_IBS[ano];
  return { cbs, ibs, soma: cbs + ibs };
}

function indiceFaixa(anexo: Anexo, ano: Ano, rbt12: number): number {
  const faixas = ANEXOS[anexo][periodo(ano)];
  const i = faixas.findIndex((f) => rbt12 <= f[0]);
  if (i < 0) throw new RangeError(`RBT12 acima do sublimite de ${SUBLIMITE} (fora do escopo do simulador)`);
  return i;
}

/** `(RBT12 × nominal − deduzir) ÷ RBT12` (LC 123, art. 18, § 1º-A). */
export function aliquotaEfetiva(anexo: Anexo, ano: Ano, rbt12: number): number {
  const f = ANEXOS[anexo][periodo(ano)][indiceFaixa(anexo, ano, rbt12)];
  if (rbt12 <= 0) return f[1];
  return (rbt12 * f[1] - f[2]) / rbt12;
}

/** Fração da receita que CBS, IBS e ISS levam dentro do DAS (com o teto de ISS da 5ª faixa). */
export function aliquotasNoDas(anexo: Anexo, ano: Ano, rbt12: number) {
  const i = indiceFaixa(anexo, ano, rbt12);
  const p = ANEXOS[anexo][periodo(ano)][i][3];
  const ef = aliquotaEfetiva(anexo, ano, rbt12);
  const teto = anexo === 'III' ? TETO_ISS_III[periodo(ano)] : undefined;
  if (i === 4 && teto && ef > teto.limiar) {
    const resto = ef - teto.issMax;
    return { ef, cbs: resto * teto.cbs, ibs: resto * teto.ibs, iss: teto.issMax, faixa: i + 1 };
  }
  return { ef, cbs: ef * p.cbs, ibs: ef * p.ibs, iss: ef * p.iss, faixa: i + 1 };
}

/** Anexo V com (folha ÷ RBT12) ≥ 28% vai ao Anexo III (LC 123, art. 18, §§ 5º-J e 5º-M). */
function anexoDe(atividade: Atividade, folha: number, rbt12: number): Anexo {
  const base = ATIVIDADES[atividade].anexo;
  if (base !== 'V' || rbt12 <= 0) return base;
  return folha / rbt12 >= FATOR_R_LIMITE ? 'III' : 'V';
}

// ── Cálculo ──────────────────────────────────────────────────────────────────────

interface Normalizada {
  R: number;
  F: number;
  atividade: Atividade;
  fatorR: number;
  pB2B: number;
  compras: number;
  ano: Ano;
  ref: { cbs: number; ibs: number };
  repasse: Repasse;
  deduzIss: boolean;
}

function normalizar(e: EntradaSimulacao): Normalizada {
  const R = Number(e.faturamento12m);
  const F = Number(e.faturaValor);
  if (!(R > 0)) throw new RangeError('faturamento12m deve ser positivo');
  if (R > SUBLIMITE) throw new RangeError(`faturamento12m acima do sublimite de R$ 3,6 milhões: fora do escopo`);
  if (!(F > 0)) throw new RangeError('faturaValor deve ser positivo');
  const pB2B = Math.min(1, Math.max(0, Number(e.percentualB2B)));
  const compras =
    e.comprasCreditaveis !== undefined
      ? Math.max(0, Number(e.comprasCreditaveis))
      : Math.max(0, Number(e.comprasCreditaveisPct ?? 0)) * R;
  const ano = (e.ano ?? 2027) as Ano;
  if (!ANOS.includes(ano)) throw new RangeError('ano deve estar entre 2027 e 2033');
  return {
    R,
    F,
    atividade: e.atividade,
    fatorR: Math.max(0, Number(e.fatorR ?? 0)),
    pB2B,
    compras,
    ano,
    ref: normalizarReferencia(e.aliquotaReferencia),
    repasse: e.repasse ?? 'mantido',
    deduzIss: e.baseHibridoDeduzIss ?? true,
  };
}

interface Taxas {
  anexo: Anexo;
  rbt12: number;
  faixa: number;
  ef: number;
  /** Fração da receita (líquida) de CBS, IBS e ISS no DAS. */
  noDas: { cbs: number; ibs: number; iss: number };
}

function taxas(n: Normalizada, rbt12: number): Taxas {
  const folha = n.fatorR * n.R;
  const anexo = anexoDe(n.atividade, folha, rbt12);
  const d = aliquotasNoDas(anexo, n.ano, rbt12);
  return { anexo, rbt12, faixa: d.faixa, ef: d.ef, noDas: { cbs: d.cbs, ibs: d.ibs, iss: d.iss } };
}

/** Puro: DAS = R × ef; o cliente credita a CBS e o IBS cobrados no DAS. */
function puroValores(t: Taxas, valor: number, fracaoPj: number) {
  const das = centavos(valor * t.ef);
  const cbs = centavos(valor * t.noDas.cbs);
  const ibs = centavos(valor * t.noDas.ibs);
  const credito = centavos((cbs + ibs) * fracaoPj);
  return { das, ibsCbsNoDas: cbs + ibs, credito };
}

/**
 * Híbrido: DAS sem as parcelas de CBS e IBS; IBS/CBS por fora sobre
 * B = base do preço × (1 − ef × %ISS), menos o crédito das compras, tributo a tributo.
 */
function hibridoValores(n: Normalizada, t: Taxas, basePreco: number, compras: number) {
  const a = aliquotasDoAno(n.ano, n.ref);
  const das = centavos(basePreco * (t.ef - t.noDas.cbs - t.noDas.ibs));
  const fator = n.deduzIss ? 1 - t.noDas.iss : 1;
  const B = basePreco * fator;
  const deb = { cbs: B * a.cbs, ibs: B * a.ibs };
  const cred = { cbs: (compras * a.cbs) / (1 + a.soma), ibs: (compras * a.ibs) / (1 + a.soma) };
  const recolher = centavos(Math.max(deb.cbs - cred.cbs, 0)) + centavos(Math.max(deb.ibs - cred.ibs, 0));
  return { das, debito: deb.cbs + deb.ibs, creditoCompras: cred.cbs + cred.ibs, recolher, fator };
}

/** Base do preço e RBT12 no híbrido: com preço mantido, o IBS/CBS sai de dentro do valor. */
function basesHibrido(n: Normalizada, valor: number) {
  const a = aliquotasDoAno(n.ano, n.ref).soma;
  return n.repasse === 'mantido' ? valor / (1 + a) : valor;
}

type Lado = { custo: number; imposto: number; cadeia: number; receita: number };

function diferencas(p: Lado, h: Lado): Diferencas {
  return {
    custoCliente: centavos(h.custo - p.custo),
    impostoEmpresa: centavos(h.imposto - p.imposto),
    receitaEmpresa: centavos(h.receita - p.receita),
    ganhoCadeia: centavos(p.cadeia - h.cadeia),
  };
}

/** Simula puro × híbrido para uma empresa e uma fatura. Lança `RangeError` fora do escopo. */
export function simular(entrada: EntradaSimulacao): ResultadoSimulacao {
  const n = normalizar(entrada);
  const a = aliquotasDoAno(n.ano, n.ref);
  const comprasPct = n.compras / n.R;

  // ── Ano (escala da empresa, igual ao motor) ──
  const tP = taxas(n, n.R);
  const pAno = puroValores(tP, n.R, n.pB2B);
  const baseH = basesHibrido(n, n.R);
  const tH = taxas(n, baseH);
  const hAno = hibridoValores(n, tH, baseH, n.compras);
  const creditoClientesH = centavos(hAno.debito * n.pB2B);
  const vPj = n.R * n.pB2B;
  const anualPuro: LadoAnual = {
    regime: 'puro',
    anexo: tP.anexo,
    faixa: tP.faixa,
    rbt12: centavos(n.R),
    aliquotaEfetiva: tP.ef,
    das: pAno.das,
    ibsCbsRecolher: 0,
    creditoCompras: 0,
    impostoEmpresa: pAno.das,
    creditoClientes: pAno.credito,
    custoCadeia: centavos(pAno.das - pAno.credito),
    custoLiquidoPjPor100: vPj > 0 ? centavos(100 - (100 * pAno.credito) / vPj) : 100,
    receitaLiquidaEmpresa: centavos(n.R - pAno.das),
  };
  const pagoPor100 = n.repasse === 'por_cima' ? 100 * (1 + hAno.debito / n.R) : 100;
  const anualHib: LadoAnual = {
    regime: 'hibrido',
    anexo: tH.anexo,
    faixa: tH.faixa,
    rbt12: centavos(baseH),
    aliquotaEfetiva: tH.ef,
    das: hAno.das,
    ibsCbsRecolher: hAno.recolher,
    creditoCompras: centavos(hAno.creditoCompras),
    impostoEmpresa: centavos(hAno.das + hAno.recolher),
    creditoClientes: creditoClientesH,
    custoCadeia: centavos(hAno.das + hAno.recolher - creditoClientesH),
    custoLiquidoPjPor100: vPj > 0 ? centavos(pagoPor100 - (100 * creditoClientesH) / vPj) : 100,
    receitaLiquidaEmpresa: centavos(
      n.R + (n.repasse === 'por_cima' ? hAno.debito : 0) - hAno.das - hAno.recolher
    ),
  };

  // ── Fatura (as taxas do ano aplicadas a uma nota emitida a empresa do regime regular) ──
  const pF = puroValores(tP, n.F, 1);
  const faturaPuro: LadoFatura = {
    regime: 'puro',
    valorCobrado: centavos(n.F),
    das: pF.das,
    ibsCbsNoDas: centavos(pF.ibsCbsNoDas),
    ibsCbsDestacado: 0,
    creditoCompras: 0,
    ibsCbsRecolher: 0,
    impostoEmpresa: pF.das,
    creditoCliente: pF.credito,
    custoLiquidoCliente: centavos(n.F - pF.credito),
    receitaLiquidaEmpresa: centavos(n.F - pF.das),
    custoCadeia: centavos(pF.das - pF.credito),
  };
  const baseHF = basesHibrido(n, n.F);
  const hF = hibridoValores(n, tH, baseHF, n.F * comprasPct);
  const destacado = centavos(hF.debito);
  const cobradoH = n.repasse === 'por_cima' ? centavos(n.F + destacado) : centavos(n.F);
  const impostoH = centavos(hF.das + hF.recolher);
  const faturaHib: LadoFatura = {
    regime: 'hibrido',
    valorCobrado: cobradoH,
    das: hF.das,
    ibsCbsNoDas: 0,
    ibsCbsDestacado: destacado,
    creditoCompras: centavos(hF.creditoCompras),
    ibsCbsRecolher: hF.recolher,
    impostoEmpresa: impostoH,
    creditoCliente: destacado,
    custoLiquidoCliente: centavos(cobradoH - destacado),
    receitaLiquidaEmpresa: centavos(cobradoH - impostoH),
    custoCadeia: centavos(impostoH - destacado),
  };

  const lado = (x: LadoFatura | LadoAnual, custo: number): Lado => ({
    custo,
    imposto: x.impostoEmpresa,
    cadeia: x.custoCadeia,
    receita: x.receitaLiquidaEmpresa,
  });
  const difFatura = diferencas(
    lado(faturaPuro, faturaPuro.custoLiquidoCliente),
    lado(faturaHib, faturaHib.custoLiquidoCliente)
  );
  const difAnual = diferencas(
    lado(anualPuro, anualPuro.custoLiquidoPjPor100),
    lado(anualHib, anualHib.custoLiquidoPjPor100)
  );

  const resultadoParcial = {
    entrada: {
      faturamento12m: n.R,
      faturaValor: n.F,
      atividade: n.atividade,
      fatorR: n.fatorR,
      percentualB2B: n.pB2B,
      comprasCreditaveis: n.compras,
      ano: n.ano,
      aliquotaReferencia: n.ref,
      repasse: n.repasse,
      baseHibridoDeduzIss: n.deduzIss,
    },
    ano: n.ano,
    aliquotasAno: a,
    fatura: { puro: faturaPuro, hibrido: faturaHib, diferencas: difFatura },
    anual: { puro: anualPuro, hibrido: anualHib, diferencas: difAnual },
  };
  return {
    ...resultadoParcial,
    veredito: veredito(resultadoParcial),
    explicacoes: explicar(resultadoParcial, comprasPct, hF.fator),
    premissas: premissas(n),
  };
}

/** Empate técnico do motor: diferença de até 2% do custo do vencedor. */
const EMPATE = 0.02;

type Parcial = Omit<ResultadoSimulacao, 'veredito' | 'explicacoes' | 'premissas'>;

function veredito(r: Parcial): Veredito {
  const { anual, fatura } = r;
  const ganho = anual.diferencas.ganhoCadeia;
  const economiaCliente = -fatura.diferencas.custoCliente;
  const ganhoEmpresa = fatura.diferencas.receitaEmpresa;
  const ganhoEmpresaAno = anual.diferencas.receitaEmpresa;
  const ref = Math.max(anual.puro.custoCadeia, 1);
  if (r.entrada.percentualB2B <= 0 || ganho <= 0) {
    return {
      tipo: 'puro',
      titulo: 'Neste cenário, o Simples puro segue melhor.',
      texto:
        r.entrada.percentualB2B <= 0
          ? 'Sem clientes empresas do regime regular, ninguém aproveita o crédito cheio do híbrido; a empresa só passaria a recolher mais.'
          : `O crédito a mais que os clientes recebem não compensa o imposto a mais da empresa: no ano, a cadeia pagaria ${reais(-ganho)} a mais no híbrido.`,
    };
  }
  if (ganho <= ref * EMPATE) {
    return {
      tipo: 'empate',
      titulo: 'Neste cenário, a diferença é pequena: o Simples puro segue sendo a escolha mais simples.',
      texto: `O híbrido tiraria só ${reais(ganho)} de imposto da cadeia no ano — dentro da margem de 2% que o escritório trata como empate técnico.`,
    };
  }
  if (economiaCliente > 0 && ganhoEmpresaAno >= 0) {
    return {
      tipo: 'hibrido',
      titulo: `Neste cenário, o híbrido reduz o custo do seu cliente em ${reais(economiaCliente)} por fatura.`,
      texto: `E a sua empresa não perde: fica com ${reais(ganhoEmpresaAno)} a mais no ano, porque os créditos das compras compensam o IBS/CBS por fora.`,
    };
  }
  if (economiaCliente > 0) {
    return {
      tipo: 'hibrido_com_preco',
      titulo: `Neste cenário, o híbrido reduz o custo do seu cliente em ${reais(economiaCliente)} por fatura.`,
      texto: `Mas, com o preço mantido, a sua empresa fica com ${reais(-ganhoEmpresa)} a menos por fatura (${reais(-ganhoEmpresaAno)} no ano). A economia é da cadeia — ${reais(ganho)} a menos de imposto no ano — e só chega ao caixa da empresa se o preço for renegociado. Sem isso, o puro segue melhor para a empresa.`,
    };
  }
  return {
    tipo: 'hibrido_com_preco',
    titulo: `Neste cenário, o híbrido deixa ${reais(ganhoEmpresa)} a mais por fatura no caixa da sua empresa.`,
    texto: `Mas, com o IBS/CBS cobrado por cima, o custo líquido do seu cliente sobe ${reais(-economiaCliente)} por fatura. A economia da cadeia — ${reais(ganho)} no ano — fica toda com a empresa; o cliente pode resistir ao reajuste.`,
  };
}

function explicar(r: Parcial, comprasPct: number, fatorIss: number): string[] {
  const { fatura: f, anual: an, aliquotasAno: a, entrada: e } = r;
  const p = f.puro;
  const h = f.hibrido;
  const passos: string[] = [];
  const anexoTxt =
    an.puro.anexo === an.hibrido.anexo
      ? `Anexo ${an.puro.anexo}`
      : `Anexo ${an.puro.anexo} no puro e Anexo ${an.hibrido.anexo} no híbrido (o fator R muda com a receita sem IBS/CBS)`;
  passos.push(
    `Com ${reais(e.faturamento12m)} de receita nos últimos 12 meses, a empresa fica na ${an.puro.faixa}ª faixa do ${anexoTxt}. A alíquota efetiva do Simples é ${pct(an.puro.aliquotaEfetiva)}.`
  );
  passos.push(
    `Simples puro: a fatura de ${reais(p.valorCobrado)} gera ${reais(p.das)} de DAS. Dentro dele, ${reais(p.ibsCbsNoDas)} são CBS e IBS — e é só isso que o cliente pode creditar.`
  );
  const repasseTxt =
    e.repasse === 'mantido'
      ? `Com o preço mantido em ${reais(e.faturaValor)}, o IBS/CBS sai de dentro do valor`
      : `O IBS/CBS é cobrado por cima: o cliente paga ${reais(h.valorCobrado)}`;
  passos.push(
    `Simples híbrido: o IBS e a CBS saem do DAS, que cai para ${reais(h.das)}. ${repasseTxt}, e a nota destaca ${reais(h.ibsCbsDestacado)} de IBS/CBS (alíquota de ${pct(a.soma)} em ${r.ano}${fatorIss < 1 ? ', sobre a base sem o ISS que continua no DAS' : ''}).`
  );
  passos.push(
    comprasPct > 0
      ? `As compras ligadas à fatura (${pct(comprasPct)} da receita, de fornecedores do regime regular) dão à empresa ${reais(h.creditoCompras)} de crédito. Ela recolhe ${reais(h.ibsCbsRecolher)} de IBS/CBS por fora.`
      : `Sem compras creditáveis, a empresa recolhe todo o IBS/CBS destacado: ${reais(h.ibsCbsRecolher)}.`
  );
  passos.push(
    `Para o cliente: custo líquido de ${reais(p.custoLiquidoCliente)} no puro e de ${reais(h.custoLiquidoCliente)} no híbrido — ${diferencaTxt(-f.diferencas.custoCliente, 'a menos', 'a mais')}.`
  );
  passos.push(
    `Para a empresa: imposto líquido de ${reais(p.impostoEmpresa)} no puro e de ${reais(h.impostoEmpresa)} no híbrido — ${diferencaTxt(f.diferencas.impostoEmpresa, 'a mais', 'a menos')}.`
  );
  passos.push(
    `Somando os dois lados, o imposto que fica na cadeia por fatura é ${reais(p.custoCadeia)} no puro e ${reais(h.custoCadeia)} no híbrido. No ano, com ${pct(e.percentualB2B)} da receita vendida a empresas do regime regular, a diferença é de ${reais(Math.abs(an.diferencas.ganhoCadeia))} ${an.diferencas.ganhoCadeia >= 0 ? 'a favor do híbrido' : 'a favor do puro'}.`
  );
  return passos;
}

function diferencaTxt(v: number, positivo: string, negativo: string) {
  if (Math.abs(v) < 0.005) return 'a mesma coisa';
  return `${reais(Math.abs(v))} ${v > 0 ? positivo : negativo}`;
}

function premissas(n: Normalizada): Premissa[] {
  const ref = n.ref;
  const estimada = ref.cbs === REFERENCIA_ESTIMADA.cbs && ref.ibs === REFERENCIA_ESTIMADA.ibs;
  return [
    {
      id: 'referencia',
      texto: estimada
        ? 'Alíquota de referência estimada: IBS 18,70% + CBS 9,21% = 27,91%. Não é alíquota legal: a resolução do Senado ainda não saiu, e a CBS foi deduzida (27,91 − 18,70).'
        : `Alíquota de referência informada: CBS ${pct(ref.cbs)} + IBS ${pct(ref.ibs)}.`,
      fonte: 'LC 214/2025, art. 349; art. 353, § 2º; Res. CGIBS 14/2026, Anexo, Quadro 2',
      natureza: 'estimativa',
    },
    {
      id: 'cronograma',
      texto:
        'Transição: em 2027 e 2028, CBS = referência − 0,1 p.p. e IBS = 0,1%; de 2029 a 2032, IBS = 10%, 20%, 30% e 40% da referência (o número exato desses anos é premissa); em 2033, IBS e CBS cheios e ISS extinto.',
      fonte: 'LC 214/2025, arts. 344, 347, 361 a 365; ADCT, arts. 127 a 129',
      natureza: 'lei',
    },
    {
      id: 'das',
      texto:
        'DAS pela alíquota efetiva da faixa: (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12, com as tabelas dos Anexos III e V na redação da Reforma, que já repartem uma fatia do DAS para a CBS e o IBS.',
      fonte: 'LC 123/2006, art. 18, § 1º-A; Anexos III e V (Anexos XX e XXII da LC 214/2025, com a LC 227/2026)',
      natureza: 'lei',
    },
    {
      id: 'credito_puro',
      texto:
        'No Simples puro, o cliente do regime regular credita só a CBS e o IBS cobrados dentro do DAS, pelo percentual da faixa do fornecedor.',
      fonte: 'LC 214/2025, art. 47, § 9º, II; LC 123/2006, art. 23, §§ 1º-A e 2º',
      natureza: 'lei',
    },
    {
      id: 'opcao_hibrido',
      texto:
        'No híbrido, a empresa continua no Simples, mas apura o IBS e a CBS pelo regime regular: as parcelas deles saem do DAS [DAS = receita × efetiva × (1 − %CBS − %IBS) é a leitura do escritório], e ela credita o IBS/CBS das compras.',
      fonte: 'LC 214/2025, art. 41, § 3º; LC 123/2006, art. 13, §§ 9º e 10',
      natureza: 'premissa',
    },
    {
      id: 'credito_hibrido',
      texto:
        'No híbrido, o cliente do regime regular credita todo o IBS/CBS destacado na nota. Pessoa física e empresa do Simples puro não creditam.',
      fonte: 'LC 214/2025, art. 47, caput, §§ 2º, I, 3º e 9º, I',
      natureza: 'lei',
    },
    {
      id: 'base_iss',
      texto: n.deduzIss
        ? 'Base do IBS/CBS no híbrido sem o ISS que continua dentro do DAS (receita × efetiva × %ISS). A lei não diz como tratar o ISS recolhido no DAS; a alternativa conservadora é não deduzir.'
        : 'Base do IBS/CBS no híbrido sobre o valor cheio, sem deduzir o ISS do DAS (leitura conservadora).',
      fonte: 'LC 214/2025, art. 12, § 2º, V',
      natureza: 'premissa',
    },
    {
      id: 'preco',
      texto:
        n.repasse === 'mantido'
          ? 'Preço mantido: o cliente paga o mesmo valor nos dois regimes; no híbrido o IBS/CBS sai de dentro do preço, e a receita do Simples (e o RBT12) é o valor sem o IBS/CBS.'
          : 'Imposto por cima: no híbrido o IBS/CBS destacado é somado ao preço; o cliente paga mais e credita tudo.',
      fonte: 'LC 214/2025, art. 12, § 2º, I; Decreto-Lei 1.598/1977, art. 12, § 4º',
      natureza: 'premissa',
    },
    {
      id: 'compras',
      texto:
        'Compras creditáveis de fornecedores do regime regular, com o IBS/CBS dentro do preço: crédito = compras × alíquota ÷ (1 + alíquota). Uso e consumo pessoal não dá crédito; compras de fornecedores do Simples puro dariam crédito menor e não entram aqui.',
      fonte: 'LC 214/2025, art. 47, caput, §§ 1º e 10; art. 57',
      natureza: 'premissa',
    },
    {
      id: 'cliente',
      texto:
        'O cliente empresa está no regime regular e usa o serviço na própria atividade; o crédito vale para o IBS e a CBS separadamente.',
      fonte: 'LC 214/2025, art. 47, § 1º, I; art. 57',
      natureza: 'premissa',
    },
    {
      id: 'fator_r',
      texto: 'Fator R: atividade do Anexo V com folha (inclusive pró-labore) de 28% ou mais da receita dos 12 meses vai ao Anexo III.',
      fonte: 'LC 123/2006, art. 18, §§ 5º-J e 5º-M',
      natureza: 'lei',
    },
    {
      id: 'split',
      texto:
        'O split payment muda o momento do pagamento (o IBS/CBS é separado na liquidação financeira), não o valor; enquanto não for implantado, o crédito do cliente não depende do pagamento.',
      fonte: 'LC 214/2025, arts. 31 a 35 e 48',
      natureza: 'lei',
    },
    {
      id: 'escopo',
      texto:
        'Fora desta simulação: receita acima de R$ 3,6 milhões (sublimite), comércio e indústria, reduções de alíquota de regimes diferenciados, saldo credor e ressarcimento (que impedem a volta ao puro), FGTS e encargos (iguais nos dois regimes) e o efeito do fluxo de caixa.',
      fonte: 'LC 123/2006, art. 13-A; LC 214/2025, art. 41, § 5º',
      natureza: 'premissa',
    },
  ];
}

// ── Séries e formatação ──────────────────────────────────────────────────────────

/** A mesma entrada simulada em cada ano de 2027 a 2033. */
export function simularAnos(entrada: EntradaSimulacao): ResultadoSimulacao[] {
  return ANOS.map((ano) => simular({ ...entrada, ano }));
}

export function simularDemo(ano: Ano = 2027): ResultadoSimulacao {
  return simular({ ...CENARIO_DEMO, ano });
}

const FMT_REAIS = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const FMT_REAIS_INTEIRO = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** R$ 1.234,56 (espaço inseparável depois do símbolo: "R$" nunca fica sozinho no fim da linha). */
export function reais(v: number, inteiro = false): string {
  return (inteiro ? FMT_REAIS_INTEIRO : FMT_REAIS).format(v);
}

/** 0,1402 → "14,02%" (até 2 casas, sem zeros sobrando). */
export function pct(v: number, casas = 2): string {
  return (
    new Intl.NumberFormat('pt-BR', { maximumFractionDigits: casas, minimumFractionDigits: 0 }).format(v * 100) + '%'
  );
}

/** Prazos da opção pelo regime regular informados pelo escritório (confirmar no DOU). */
export const PRAZOS_OPCAO = {
  opcao1oSemestre2027: '30/10/2026',
  desistencia: 'de 3/11 a 20/12/2026',
  proximaJanela: 'março de 2027 (para o 2º semestre de 2027)',
  fonte: 'Res. CGSN 194/2026; LC 123/2006, art. 13, § 10',
} as const;
