export const CONSENT_KEY = 'dsa-consent';
/** Evento de janela emitido quando a escolha muda, para os carregadores reagirem. */
export const CONSENT_EVENT = 'dsa-consent-change';

const VERSAO = 1 as const;

export type ConsentState = {
  v: typeof VERSAO;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

/** Valida e desserializa. Qualquer coisa fora do formato vira null — o que
 *  significa "ainda não escolheu" e faz o banner reaparecer. */
export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (o.v !== VERSAO) return null;
    if (typeof o.analytics !== 'boolean') return null;
    if (typeof o.marketing !== 'boolean') return null;
    if (typeof o.ts !== 'number') return null;
    return { v: VERSAO, analytics: o.analytics, marketing: o.marketing, ts: o.ts };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

export function writeConsent(escolha: {
  analytics: boolean;
  marketing: boolean;
}): ConsentState {
  const estado: ConsentState = { v: VERSAO, ...escolha, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(estado));
  } catch {
    /* sem persistência: a escolha vale para esta sessão */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: estado }));
  return estado;
}
