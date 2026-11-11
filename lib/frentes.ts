/**
 * Frentes (assuntos) do funil da advocacia: o código vai no lead (`frente`) e,
 * no WhatsApp, vira o sufixo `[MS]`, `[PV]`… que o 360 lê para classificar a conversa.
 *
 * Arquivo sem dependências (nem `@/`), para os testes rodarem no Node puro.
 */

export const FRENTES = [
  'ms_licitacao',
  'previdencia',
  'execucao',
  'empresarial',
  'superendividamento',
  'outro',
] as const;

export type Frente = (typeof FRENTES)[number];

/** Frentes com landing em /f/<frente> (`outro` não tem landing nem campanha). */
export const FRENTES_COM_LANDING = [
  'ms_licitacao',
  'previdencia',
  'execucao',
  'empresarial',
  'superendividamento',
] as const satisfies readonly Frente[];

export type FrenteComLanding = (typeof FRENTES_COM_LANDING)[number];

/** Código do texto pronto do WhatsApp. `outro` não leva código. */
export const CODIGO: Record<Frente, string> = {
  ms_licitacao: 'MS',
  previdencia: 'PV',
  execucao: 'EX',
  empresarial: 'EM',
  superendividamento: 'SE',
  outro: '',
};

/** Número oficial da advocacia (12 dígitos; não trocar pelo de 13). */
export const WHATSAPP_ADVOCACIA = '554796542331';

export function ehFrente(valor: unknown): valor is Frente {
  return typeof valor === 'string' && (FRENTES as readonly string[]).includes(valor);
}

export function ehFrenteComLanding(valor: unknown): valor is FrenteComLanding {
  return typeof valor === 'string' && (FRENTES_COM_LANDING as readonly string[]).includes(valor);
}

/**
 * `https://wa.me/554796542331?text=<texto> [CODIGO]`. O código fica no fim da
 * mensagem, entre colchetes; `outro` não leva código.
 */
export function linkWhatsapp(frente: Frente, texto: string): string {
  const codigo = CODIGO[frente];
  const mensagem = codigo ? `${texto.trim()} [${codigo}]` : texto.trim();
  return `https://wa.me/${WHATSAPP_ADVOCACIA}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Frente da página que o visitante está lendo, para o botão global do
 * WhatsApp levar o código certo. Só as páginas que já são de uma frente;
 * qualquer outra é `outro`.
 */
const FRENTE_POR_CAMINHO: readonly { prefixo: string; frente: Frente }[] = [
  { prefixo: '/f/ms_licitacao', frente: 'ms_licitacao' },
  { prefixo: '/f/previdencia', frente: 'previdencia' },
  { prefixo: '/f/execucao', frente: 'execucao' },
  { prefixo: '/f/empresarial', frente: 'empresarial' },
  { prefixo: '/f/superendividamento', frente: 'superendividamento' },
  { prefixo: '/licitacoes/mandado-de-seguranca', frente: 'ms_licitacao' },
  { prefixo: '/licitacoes/fui-inabilitado', frente: 'ms_licitacao' },
  { prefixo: '/licitacoes/desclassificada-no-pregao', frente: 'ms_licitacao' },
  { prefixo: '/licitacoes/recurso-administrativo', frente: 'ms_licitacao' },
  { prefixo: '/licitacoes/impugnacao-de-edital', frente: 'ms_licitacao' },
  { prefixo: '/blog/edital-restritivo-clausulas-ilegais-como-impugnar', frente: 'ms_licitacao' },
  { prefixo: '/blog/proposta-inexequivel-desclassificacao-lei-14133', frente: 'ms_licitacao' },
  { prefixo: '/blog/contrarrazoes-recurso-licitacao-lei-14133', frente: 'ms_licitacao' },
  { prefixo: '/blog/acordo-de-socios-clausulas-validade-quando-fazer', frente: 'empresarial' },
  { prefixo: '/blog/embargos-a-execucao-prazo-e-o-que-alegar', frente: 'execucao' },
  { prefixo: '/blog/conta-bloqueada-sisbajud-desbloqueio-cpc', frente: 'execucao' },
  { prefixo: '/blog/inss-negou-beneficio-recurso-crps-novo-pedido-acao', frente: 'previdencia' },
  { prefixo: '/blog/bpc-loas-negado-motivos-recurso-lei-8742', frente: 'previdencia' },
  { prefixo: '/blog/lei-do-superendividamento-repactuacao-de-dividas-como-funciona', frente: 'superendividamento' },
  { prefixo: '/blog/consignado-limite-de-desconto-e-superendividamento', frente: 'superendividamento' },
  { prefixo: '/areas/mandado-de-seguranca', frente: 'ms_licitacao' },
  { prefixo: '/areas/execucoes', frente: 'execucao' },
  { prefixo: '/areas/empresarial', frente: 'empresarial' },
  { prefixo: '/areas/dividas-e-obrigacoes', frente: 'execucao' },
];

export function frenteDoCaminho(caminho: string): Frente {
  const c = (caminho || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  for (const { prefixo, frente } of FRENTE_POR_CAMINHO) {
    if (c === prefixo || c.startsWith(`${prefixo}/`)) return frente;
  }
  return 'outro';
}

/** `Inabilitação  Licitação!` vira `inabilitacao-licitacao` (a chave da lista fechada de títulos). */
export function chaveDoTermo(termo: string): string {
  return termo
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Título da landing pela palavra-chave do anúncio (`?kw=`): só vale um título
 * da lista fechada da frente. Termo desconhecido, vazio ou malicioso
 * (`<script>`, `__proto__`…) devolve o título padrão.
 */
export function tituloPorTermo(
  termo: string | string[] | null | undefined,
  titulos: Record<string, string>,
  padrao: string,
): string {
  const bruto = Array.isArray(termo) ? termo[0] : termo;
  if (!bruto) return padrao;
  const chave = chaveDoTermo(bruto);
  if (!chave || !Object.prototype.hasOwnProperty.call(titulos, chave)) return padrao;
  return titulos[chave] || padrao;
}
