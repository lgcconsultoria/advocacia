/**
 * Atribuição de anúncio do lead: de qual anúncio da Meta a pessoa veio e os
 * identificadores que o 360 usa para devolver o evento à Meta (Conversions API).
 *
 * - Da URL (sempre, como os utm_*): `fbclid`, `ad_id` e `campaign_id` (ou
 *   `utm_id`, que vale como campaign_id). Guardados em sessionStorage na
 *   primeira página da sessão, para chegar ao formulário mesmo se a pessoa
 *   navegou antes.
 * - Dos cookies da Meta (só com o consentimento de medição/marketing dado):
 *   `_fbp` e `_fbc`. Sem `_fbc` mas com `fbclid`, monta `fb.1.<ms>.<fbclid>`
 *   como a Meta documenta, com a hora em que o fbclid chegou.
 * - `consentimento_marketing` (true/false) e a data da escolha.
 * - `event_id`: um uuid por envio de lead, que vai também no
 *   `fbq('track','Lead', …, { eventID })` para a Meta desduplicar com a CAPI.
 *
 * Arquivo sem dependências (nem `@/`), para os testes rodarem no Node puro.
 */

export const CHAVE_ANUNCIO = 'senturiao:anuncio';

export type ParametrosAnuncio = {
  fbclid?: string;
  ad_id?: string;
  campaign_id?: string;
};

export type AtribuicaoLead = ParametrosAnuncio & {
  fbc?: string;
  fbp?: string;
  consentimento_marketing: boolean;
  /** ISO 8601 da escolha (aceite ou recusa); null se a pessoa ainda não escolheu. */
  consentimento_marketing_em: string | null;
};

/** O que importa do consentimento (mesmo formato de lib/consentimento.ts). */
export type ConsentimentoLido = { medicao: boolean; ts: number } | null;

type Guardado = ParametrosAnuncio & { fbclid_ts?: number };

const RE_FBCLID = /^[A-Za-z0-9_-]{1,500}$/;
const RE_ID_META = /^\d{1,30}$/;
const RE_FBC = /^fb\.\d\.\d{1,16}\.[A-Za-z0-9_-]{1,500}$/;
const RE_FBP = /^fb\.\d\.\d{1,16}\.\d{1,30}$/;

/** Os parâmetros de anúncio presentes na query string (já validados). */
export function parametrosDaUrl(search: string): ParametrosAnuncio {
  const p = new URLSearchParams(search);
  const saida: ParametrosAnuncio = {};
  const fbclid = p.get('fbclid');
  if (fbclid && RE_FBCLID.test(fbclid)) saida.fbclid = fbclid;
  const ad = p.get('ad_id');
  if (ad && RE_ID_META.test(ad)) saida.ad_id = ad;
  const campanha = p.get('campaign_id') ?? p.get('utm_id');
  if (campanha && RE_ID_META.test(campanha)) saida.campaign_id = campanha;
  return saida;
}

/** Valor de um cookie em `document.cookie`, ou null. */
export function lerCookie(cookies: string, nome: string): string | null {
  for (const parte of cookies.split(';')) {
    const i = parte.indexOf('=');
    if (i < 0) continue;
    if (parte.slice(0, i).trim() === nome) {
      try {
        return decodeURIComponent(parte.slice(i + 1).trim());
      } catch {
        return parte.slice(i + 1).trim();
      }
    }
  }
  return null;
}

/** `fb.<subdomínio>.<criação em ms>.<fbclid>`, como a Meta documenta para o fbc. */
export function montarFbc(fbclid: string, criadoEm: number): string {
  return `fb.1.${Math.round(criadoEm)}.${fbclid}`;
}

function lerGuardado(armazenamento: Storage | null): Guardado {
  if (!armazenamento) return {};
  try {
    const bruto = armazenamento.getItem(CHAVE_ANUNCIO);
    if (!bruto) return {};
    const o = JSON.parse(bruto) as Record<string, unknown>;
    const g: Guardado = {};
    if (typeof o.fbclid === 'string' && RE_FBCLID.test(o.fbclid)) g.fbclid = o.fbclid;
    if (typeof o.ad_id === 'string' && RE_ID_META.test(o.ad_id)) g.ad_id = o.ad_id;
    if (typeof o.campaign_id === 'string' && RE_ID_META.test(o.campaign_id)) g.campaign_id = o.campaign_id;
    if (typeof o.fbclid_ts === 'number' && Number.isFinite(o.fbclid_ts)) g.fbclid_ts = o.fbclid_ts;
    return g;
  } catch {
    return {};
  }
}

/**
 * Parâmetros de anúncio da visita: os da URL atual, se houver (e então
 * substituem os guardados); senão, os guardados na sessão.
 */
function parametrosDaVisita(search: string, armazenamento: Storage | null, agora: number): Guardado {
  const daUrl: Guardado = parametrosDaUrl(search);
  if (Object.keys(daUrl).length === 0) return lerGuardado(armazenamento);
  if (daUrl.fbclid) {
    const anterior = lerGuardado(armazenamento);
    // mesmo fbclid (recarregou a página): mantém a hora em que ele chegou
    daUrl.fbclid_ts = anterior.fbclid === daUrl.fbclid && anterior.fbclid_ts ? anterior.fbclid_ts : agora;
  }
  try {
    armazenamento?.setItem(CHAVE_ANUNCIO, JSON.stringify(daUrl));
  } catch {
    /* sem armazenamento: vale só para esta página */
  }
  return daUrl;
}

export function atribuicaoDaVisita(entrada: {
  search: string;
  armazenamento: Storage | null;
  cookies: string;
  consentimento: ConsentimentoLido;
  agora: number;
}): AtribuicaoLead {
  const { fbclid_ts, ...parametros } = parametrosDaVisita(entrada.search, entrada.armazenamento, entrada.agora);
  const c = entrada.consentimento;
  const saida: AtribuicaoLead = {
    ...parametros,
    consentimento_marketing: c?.medicao === true,
    consentimento_marketing_em: c ? new Date(c.ts).toISOString() : null,
  };
  if (c?.medicao === true) {
    const fbp = lerCookie(entrada.cookies, '_fbp');
    if (fbp && RE_FBP.test(fbp)) saida.fbp = fbp;
    const fbc = lerCookie(entrada.cookies, '_fbc');
    if (fbc && RE_FBC.test(fbc)) saida.fbc = fbc;
    else if (parametros.fbclid) saida.fbc = montarFbc(parametros.fbclid, fbclid_ts ?? entrada.agora);
  }
  return saida;
}

/** uuid v4 para o `event_id` do lead (desduplicação pixel × Conversions API). */
export function novoEventId(cripto: Crypto | undefined = globalThis.crypto): string {
  if (cripto && typeof cripto.randomUUID === 'function') return cripto.randomUUID();
  const b = new Uint8Array(16);
  if (cripto && typeof cripto.getRandomValues === 'function') cripto.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
