import { describe, it, expect, beforeEach } from 'vitest';
import { track } from '@/lib/analytics';
import { writeConsent } from '@/lib/consent';

type Layer = unknown[][];

function camada(): Layer {
  return (window as unknown as { dataLayer?: Layer }).dataLayer ?? [];
}

beforeEach(() => {
  localStorage.clear();
  (window as unknown as { dataLayer?: Layer }).dataLayer = [];
});

describe('track', () => {
  it('não registra nada sem consentimento', () => {
    track('cta_click', { origem: 'home', destino: '/diagnostico' });
    expect(camada()).toHaveLength(0);
  });

  it('não registra nada quando a análise foi recusada', () => {
    writeConsent({ analytics: false, marketing: false });
    track('cta_click', { origem: 'home', destino: '/diagnostico' });
    expect(camada()).toHaveLength(0);
  });

  it('registra o evento quando a análise foi autorizada', () => {
    writeConsent({ analytics: true, marketing: false });
    track('cta_click', { origem: 'home', destino: '/diagnostico' });
    expect(camada()).toHaveLength(1);
    expect(camada()[0]).toEqual([
      'event',
      'cta_click',
      { origem: 'home', destino: '/diagnostico' },
    ]);
  });

  it('aceita evento sem parâmetros', () => {
    writeConsent({ analytics: true, marketing: false });
    track('form_start');
    expect(camada()[0]).toEqual(['event', 'form_start', {}]);
  });

  it('não lança quando o dataLayer ainda não existe', () => {
    writeConsent({ analytics: true, marketing: false });
    delete (window as unknown as { dataLayer?: Layer }).dataLayer;
    expect(() => track('form_start')).not.toThrow();
  });
});
