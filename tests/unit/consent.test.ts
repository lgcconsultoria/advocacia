import { describe, it, expect, beforeEach } from 'vitest';
import {
  CONSENT_KEY,
  parseConsent,
  readConsent,
  writeConsent,
} from '@/lib/consent';

describe('parseConsent', () => {
  it('devolve null para ausência de valor', () => {
    expect(parseConsent(null)).toBeNull();
  });

  it('devolve null para JSON inválido', () => {
    expect(parseConsent('{oops')).toBeNull();
  });

  it('devolve null para versão desconhecida — força nova escolha', () => {
    expect(parseConsent(JSON.stringify({ v: 99, analytics: true, marketing: true, ts: 1 }))).toBeNull();
  });

  it('devolve null quando um campo não é booleano', () => {
    expect(parseConsent(JSON.stringify({ v: 1, analytics: 'sim', marketing: false, ts: 1 }))).toBeNull();
  });

  it('aceita um estado válido', () => {
    const estado = { v: 1, analytics: true, marketing: false, ts: 1735689600000 };
    expect(parseConsent(JSON.stringify(estado))).toEqual(estado);
  });
});

describe('readConsent / writeConsent', () => {
  beforeEach(() => localStorage.clear());

  it('sem escolha prévia, não há consentimento', () => {
    expect(readConsent()).toBeNull();
  });

  it('grava e relê a escolha', () => {
    const gravado = writeConsent({ analytics: true, marketing: false });
    expect(gravado.analytics).toBe(true);
    expect(gravado.marketing).toBe(false);
    expect(readConsent()).toEqual(gravado);
  });

  it('a recusa é um estado gravado, não a ausência de estado', () => {
    writeConsent({ analytics: false, marketing: false });
    const lido = readConsent();
    expect(lido).not.toBeNull();
    expect(lido?.analytics).toBe(false);
  });

  it('sobrevive a localStorage indisponível', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new Error('bloqueado'); },
    });
    expect(() => readConsent()).not.toThrow();
    expect(readConsent()).toBeNull();
    if (original) Object.defineProperty(window, 'localStorage', original);
  });
});

describe('chave de armazenamento', () => {
  it('é estável', () => {
    expect(CONSENT_KEY).toBe('dsa-consent');
  });
});
