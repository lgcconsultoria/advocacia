/**
 * Consentimento LGPD para os cookies de medição (Meta Pixel, GA4, Google Ads).
 *
 * Uma escolha só — aceitar ou recusar a medição — guardada no navegador. Sem
 * escolha registrada, nada de medição carrega. Formato versionado: qualquer
 * coisa fora dele vale como "ainda não escolheu" e o aviso reaparece.
 * Base: plano revertido de 31/08 (lib/consent.ts do commit d4d6ba4), simplificado.
 */

export const CHAVE_CONSENTIMENTO = 'senturiao:consentimento';
/** Disparado na janela quando a escolha muda (o carregador da medição escuta). */
export const EVENTO_CONSENTIMENTO = 'senturiao:consentimento';
/** Disparado pelo link do rodapé para reabrir o aviso. */
export const EVENTO_REABRIR = 'senturiao:consentimento-reabrir';

const VERSAO = 1 as const;

export type Consentimento = { v: typeof VERSAO; medicao: boolean; ts: number };

export function lerConsentimentoBruto(raw: string | null): Consentimento | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (o.v !== VERSAO || typeof o.medicao !== 'boolean' || typeof o.ts !== 'number') return null;
    return { v: VERSAO, medicao: o.medicao, ts: o.ts };
  } catch {
    return null;
  }
}

export function lerConsentimento(): Consentimento | null {
  if (typeof window === 'undefined') return null;
  try {
    return lerConsentimentoBruto(window.localStorage.getItem(CHAVE_CONSENTIMENTO));
  } catch {
    return null;
  }
}

/** A medição está autorizada agora? */
export function medicaoAutorizada(): boolean {
  return lerConsentimento()?.medicao === true;
}

export function gravarConsentimento(medicao: boolean): Consentimento {
  const estado: Consentimento = { v: VERSAO, medicao, ts: Date.now() };
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, JSON.stringify(estado));
  } catch {
    /* sem armazenamento: a escolha vale só para esta página */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMENTO, { detail: estado }));
  return estado;
}
