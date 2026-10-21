/**
 * Mensagem pré-preenchida do WhatsApp por página (a "dor" de quem clicou) e
 * com a origem: página, código curto (`ref`) e campanha (utm_*), para a
 * triagem saber de onde a conversa veio e o 360 poder ler a origem do texto.
 *
 * Formato da mensagem (uma linha de assunto + a etiqueta de origem):
 *
 *   Olá! Fui inabilitado numa licitação e quero analisar o recurso.
 *
 *   [site · /modelos/recurso-administrativo-licitacao · ref:recurso-inabilitacao · utm:instagram/ms-out]
 *
 * Arquivo sem dependências (nem `@/`), para os testes rodarem no Node puro.
 */

export type AssuntoWhatsapp = {
  /** Caminho exato (`/`) ou prefixo (termina sem barra e casa com `/x` e `/x/...`). */
  caminho: string;
  exato?: boolean;
  /** O que a pessoa quer, em primeira pessoa, já com o ponto final. */
  texto: string;
  /** Código curto da dor/página (minúsculas e hífen), lido pela triagem e pelo 360. */
  ref: string;
};

/**
 * Do mais específico para o mais geral: vale o primeiro que casar.
 * Ao criar página nova de serviço ou de dor, acrescente a linha aqui.
 */
export const ASSUNTOS_WHATSAPP: readonly AssuntoWhatsapp[] = [
  {
    caminho: '/licitacoes/mandado-de-seguranca',
    texto: 'Quero avaliar se cabe mandado de segurança no meu caso de licitação.',
    ref: 'ms-licitacao',
  },
  {
    caminho: '/modelos/recurso-administrativo-licitacao',
    texto: 'Fui inabilitado(a) numa licitação e quero analisar o recurso.',
    ref: 'recurso-inabilitacao',
  },
  {
    caminho: '/modelos/mandado-seguranca-desclassificacao',
    texto: 'Fui desclassificado(a) numa licitação e quero avaliar o mandado de segurança.',
    ref: 'ms-desclassificacao',
  },
  {
    caminho: '/modelos/reequilibrio-economico-financeiro',
    texto: 'Quero analisar o reequilíbrio econômico-financeiro de um contrato público.',
    ref: 'reequilibrio',
  },
  {
    caminho: '/modelos/diagnostico-reforma-tributaria',
    texto: 'Quero um diagnóstico da Reforma Tributária na minha empresa.',
    ref: 'reforma-diagnostico',
  },
  {
    caminho: '/modelos/reforma-tributaria-locadoras',
    texto: 'Tenho uma locadora e quero entender o impacto da Reforma Tributária.',
    ref: 'reforma-locadoras',
  },
  {
    caminho: '/blog/impugnacao-ao-edital-prazos-e-estrategia',
    texto: 'Quero avaliar a impugnação de um edital.',
    ref: 'impugnacao-edital',
  },
  {
    caminho: '/blog/mandado-de-seguranca-analise-de-cabimento',
    texto: 'Quero avaliar se cabe mandado de segurança no meu caso.',
    ref: 'ms-cabimento',
  },
  {
    caminho: '/areas/mandado-de-seguranca',
    texto: 'Quero avaliar se cabe mandado de segurança no meu caso.',
    ref: 'mandado-de-seguranca',
  },
  {
    caminho: '/areas/contratos-publicos',
    texto: 'Quero falar sobre um contrato público da minha empresa.',
    ref: 'contratos-publicos',
  },
  {
    caminho: '/areas/crimes-licitatorios',
    texto: 'Recebi uma intimação ligada a uma licitação e quero orientação.',
    ref: 'crimes-licitatorios',
  },
  {
    caminho: '/licitacoes',
    texto: 'Quero falar sobre o departamento jurídico de licitações da minha empresa.',
    ref: 'licitacoes',
  },
  {
    caminho: '/tributario',
    texto: 'Quero falar sobre a Reforma Tributária na minha empresa.',
    ref: 'tributario',
  },
  { caminho: '/diagnostico', texto: 'Gostaria de um diagnóstico inicial.', ref: 'diagnostico' },
  { caminho: '/modelos', texto: 'Vi os materiais gratuitos e gostaria de um atendimento.', ref: 'modelos' },
  { caminho: '/areas', texto: 'Gostaria de agendar um atendimento.', ref: 'areas' },
  { caminho: '/blog', texto: 'Li um artigo do blog e gostaria de um atendimento.', ref: 'blog' },
  { caminho: '/contato', texto: 'Gostaria de agendar um atendimento.', ref: 'contato' },
];

export const ASSUNTO_PADRAO: Omit<AssuntoWhatsapp, 'caminho'> = {
  texto: 'Gostaria de agendar um atendimento.',
  ref: 'home',
};

const UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
export type Utms = Partial<Record<(typeof UTMS)[number], string>>;

/** Caminho limpo: sem query, sem âncora, sem barra final (exceto a raiz). */
export function limparCaminho(caminho: string): string {
  let c = (caminho || '/').split(/[?#]/)[0] || '/';
  if (!c.startsWith('/')) c = `/${c}`;
  if (c.length > 1) c = c.replace(/\/+$/, '');
  return c || '/';
}

/** O assunto da página: o primeiro de ASSUNTOS_WHATSAPP que casar, ou o padrão. */
export function assuntoDaPagina(caminho: string): Omit<AssuntoWhatsapp, 'caminho'> {
  const c = limparCaminho(caminho);
  for (const a of ASSUNTOS_WHATSAPP) {
    if (c === a.caminho || (!a.exato && c.startsWith(`${a.caminho}/`))) {
      return { texto: a.texto, ref: a.ref };
    }
  }
  return ASSUNTO_PADRAO;
}

/** `utm:fonte/campanha` (só o que houver), curto e sem quebrar linha. */
function campanha(utms: Utms | null | undefined): string {
  if (!utms) return '';
  const partes = [utms.utm_source, utms.utm_campaign]
    .map((v) => (v ?? '').replace(/[\s\]\[]+/g, '-').slice(0, 60))
    .filter(Boolean);
  return partes.length ? `utm:${partes.join('/')}` : '';
}

/**
 * Texto completo da mensagem: assunto + etiqueta de origem.
 * `texto` substitui o assunto da página (ex.: um botão com pedido próprio);
 * `ref` idem.
 */
export function mensagemWhatsapp(opcoes: {
  caminho: string;
  texto?: string;
  ref?: string;
  utms?: Utms | null;
  marca?: string;
}): string {
  const caminho = limparCaminho(opcoes.caminho);
  const daPagina = assuntoDaPagina(caminho);
  const texto = (opcoes.texto ?? daPagina.texto).trim();
  const ref = opcoes.ref ?? daPagina.ref;
  const etiqueta = [opcoes.marca ?? 'site', caminho, `ref:${ref}`, campanha(opcoes.utms)]
    .filter(Boolean)
    .join(' · ');
  return `Olá! ${texto}\n\n[${etiqueta}]`;
}

/** `https://wa.me/<numero>?text=<mensagem>`; o número só com dígitos (55 + DDD + número). */
export function linkWhatsappCom(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}

/** Os utm_* da URL atual ou, se não houver, os guardados na sessão (`senturiao:utms`). */
export function utmsDe(search: string, guardado: string | null): Utms {
  const p = new URLSearchParams(search);
  const daUrl: Utms = {};
  for (const k of UTMS) {
    const v = p.get(k);
    if (v) daUrl[k] = v.slice(0, 200);
  }
  if (Object.keys(daUrl).length) return daUrl;
  if (!guardado) return {};
  try {
    const o = JSON.parse(guardado) as Record<string, unknown>;
    const saida: Utms = {};
    for (const k of UTMS) if (typeof o[k] === 'string' && o[k]) saida[k] = String(o[k]).slice(0, 200);
    return saida;
  } catch {
    return {};
  }
}
