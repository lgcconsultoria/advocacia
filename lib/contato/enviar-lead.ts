/**
 * Envio do formulário curto "diagnóstico" para a porta do escritório.
 *
 * Quem recebe é a porta do Dexter (`POST /p/contato/lead` em
 * propostas.senturiaoadv.com.br): grava o lead e avisa o escritório pelo
 * WhatsApp e por e-mail. Esta função só monta o corpo, manda e devolve
 * `{ ok: true, protocolo }` ou `{ ok: false, erro }` — com `erro` já em
 * português, pronto para mostrar ao visitante. Ela nunca lança exceção.
 *
 * Dois campos existem só para barrar robô (ver lib/contato/README.md):
 * - `website`: campo-isca, um <input> escondido que humano não vê nem preenche;
 * - `tempo_ms`: quanto tempo se passou entre o formulário aparecer e o envio.
 *   A porta recusa envio com menos de 2 segundos.
 *
 * Vão juntos a atribuição de anúncio (fbclid, ad_id, campaign_id; _fbc/_fbp só
 * com consentimento), o consentimento de marketing e um `event_id` por envio
 * (ver ./atribuicao.ts) — o mesmo `event_id` deve ir no `registrarLead`.
 *
 * Só funciona a partir de https://www.senturiaoadv.com.br e
 * https://senturiaoadv.com.br (a porta confere a origem). Em `next dev`
 * (http://localhost:3000) a porta só aceita se estiver com LEADS_CORS_DEV.
 */

import { lerConsentimento } from '@/lib/consentimento';
import { atribuicaoDaVisita, novoEventId, type AtribuicaoLead } from './atribuicao';

export { novoEventId } from './atribuicao';

export const ENDPOINT_LEAD = 'https://propostas.senturiaoadv.com.br/p/contato/lead';

export type Interesse = 'tributario' | 'licitacoes' | 'outro';

export type DadosLead = {
  nome: string;
  email: string;
  /** Como o visitante digitou: a porta normaliza "(67) 99999-8888", "+55 67 9…" etc. */
  telefone: string;
  empresa: string;
  interesse?: Interesse | null;
  /** Valor do campo-isca escondido. Humano deixa vazio; robô preenche. */
  website?: string;
};

export type OpcoesEnvioLead = {
  /**
   * `Date.now()` de quando o formulário apareceu (ex.: num `useRef` preenchido
   * no `useEffect` de montagem). Sem ele, conta desde o carregamento da página
   * (`performance.now()`).
   */
  inicio?: number;
  /** Página de origem. Padrão: `window.location.href`. */
  pagina?: string;
  /**
   * Id do evento deste envio (uuid). Gere com `novoEventId()` e passe o mesmo
   * para `registrarLead`, para a Meta desduplicar pixel × Conversions API.
   * Sem ele, a função gera um e devolve na resposta.
   */
  eventId?: string;
  /** Para testes. Padrão: `ENDPOINT_LEAD`. */
  endpoint?: string;
  signal?: AbortSignal;
  /** Desiste depois disso. Padrão: 15 segundos. */
  timeoutMs?: number;
};

export type RespostaLead =
  | { ok: true; protocolo: string; eventId: string }
  | { ok: false; erro: string };

const UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const CHAVE_UTMS = 'senturiao:utms';

const ERRO_REDE =
  'Não foi possível enviar agora. Verifique sua conexão e tente de novo, ou fale com o escritório pelo WhatsApp.';
const ERRO_INESPERADO =
  'Não conseguimos registrar agora. Tente de novo em instantes ou fale com o escritório pelo WhatsApp.';

/**
 * Os parâmetros de campanha (utm_*) da visita. Lidos da URL atual; se a
 * pessoa chegou por um anúncio e navegou até o formulário, vêm da primeira
 * página da sessão (guardados em sessionStorage, quando o navegador deixa).
 */
function utmsDaVisita(): Partial<Record<(typeof UTMS)[number], string>> {
  if (typeof window === 'undefined') return {};
  const daUrl: Partial<Record<(typeof UTMS)[number], string>> = {};
  const parametros = new URLSearchParams(window.location.search);
  for (const chave of UTMS) {
    const valor = parametros.get(chave);
    if (valor) daUrl[chave] = valor.slice(0, 200);
  }
  try {
    if (Object.keys(daUrl).length > 0) {
      window.sessionStorage.setItem(CHAVE_UTMS, JSON.stringify(daUrl));
      return daUrl;
    }
    const guardado = window.sessionStorage.getItem(CHAVE_UTMS);
    return guardado ? (JSON.parse(guardado) as typeof daUrl) : {};
  } catch {
    return daUrl;
  }
}

/**
 * fbclid/ad_id/campaign_id da visita, cookies da Meta (só com consentimento)
 * e o consentimento de marketing. Nunca lança.
 */
export function atribuicaoDoNavegador(): AtribuicaoLead {
  if (typeof window === 'undefined') {
    return { consentimento_marketing: false, consentimento_marketing_em: null };
  }
  let armazenamento: Storage | null = null;
  try {
    armazenamento = window.sessionStorage;
  } catch {
    armazenamento = null;
  }
  let cookies = '';
  try {
    cookies = document.cookie;
  } catch {
    cookies = '';
  }
  return atribuicaoDaVisita({
    search: window.location.search,
    armazenamento,
    cookies,
    consentimento: lerConsentimento(),
    agora: Date.now(),
  });
}

/**
 * Chame cedo (ex.: no layout) para guardar os utm_* e os parâmetros de anúncio
 * (fbclid, ad_id, campaign_id) da página de entrada.
 */
export function lembrarUtms(): void {
  utmsDaVisita();
  atribuicaoDoNavegador();
}

function tempoDesde(inicio?: number): number {
  if (typeof inicio === 'number' && Number.isFinite(inicio)) {
    return Math.max(0, Math.round(Date.now() - inicio));
  }
  if (typeof performance !== 'undefined') return Math.round(performance.now());
  return 0;
}

function respostaValida(corpo: unknown, eventId: string): RespostaLead | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const r = corpo as Record<string, unknown>;
  if (r.ok === true && typeof r.protocolo === 'string') {
    return { ok: true, protocolo: r.protocolo, eventId };
  }
  if (r.ok === false && typeof r.erro === 'string' && r.erro) {
    return { ok: false, erro: r.erro };
  }
  return null;
}

/**
 * Manda o lead para a porta. Resolve sempre (nunca rejeita):
 * `{ ok: true, protocolo, eventId }` ou `{ ok: false, erro }` em português.
 */
export async function enviarLead(
  dados: DadosLead,
  opcoes: OpcoesEnvioLead = {},
): Promise<RespostaLead> {
  const pagina =
    opcoes.pagina ?? (typeof window !== 'undefined' ? window.location.href : undefined);
  const eventId = opcoes.eventId ?? novoEventId();
  const corpo = {
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    empresa: dados.empresa,
    interesse: dados.interesse ?? null,
    pagina: pagina ?? null,
    ...utmsDaVisita(),
    ...atribuicaoDoNavegador(),
    event_id: eventId,
    website: dados.website ?? '',
    tempo_ms: tempoDesde(opcoes.inicio),
  };

  const controle = new AbortController();
  const prazo = setTimeout(() => controle.abort(), opcoes.timeoutMs ?? 15_000);
  const desistir = () => controle.abort();
  opcoes.signal?.addEventListener('abort', desistir, { once: true });

  try {
    const resposta = await fetch(opcoes.endpoint ?? ENDPOINT_LEAD, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: controle.signal,
    });
    let json: unknown = null;
    try {
      json = await resposta.json();
    } catch {
      json = null;
    }
    return respostaValida(json, eventId) ?? { ok: false, erro: ERRO_INESPERADO };
  } catch {
    // Rede fora, CORS recusado, tempo esgotado ou cancelado.
    return { ok: false, erro: ERRO_REDE };
  } finally {
    clearTimeout(prazo);
    opcoes.signal?.removeEventListener('abort', desistir);
  }
}
