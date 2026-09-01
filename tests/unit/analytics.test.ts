import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track } from '@/lib/analytics';
import { writeConsent } from '@/lib/consent';

type Layer = unknown[][];
type Gtag = (...args: unknown[]) => void;

function camada(): Layer {
  return (window as unknown as { dataLayer?: Layer }).dataLayer ?? [];
}

beforeEach(() => {
  localStorage.clear();
  (window as unknown as { dataLayer?: Layer }).dataLayer = [];
  // Nenhum teste deste arquivo carrega o vendor script de verdade — sem
  // isso, um `window.gtag` deixado por um teste anterior vazaria para o
  // próximo e mascararia qual caminho (`gtag()` ou fila do `dataLayer`)
  // está sendo exercido.
  delete (window as unknown as { gtag?: Gtag }).gtag;
});

// Sem `window.gtag` definido — como acontece enquanto o vendor script
// (public/vendor/ga4.js) ainda está em voo — `track()` cai no
// best-effort de empurrar `['event', name, params]` direto no
// `dataLayer`. É a fila de fallback: não é o que produz o hit de rede
// real (isso é coberto pelos testes de `window.gtag` abaixo e pela
// verificação de ponta a ponta no relatório da tarefa), mas precisa
// existir e nunca lançar.
describe('track — fila do dataLayer (sem window.gtag ainda carregado)', () => {
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

// Com `window.gtag` definido — o caminho real, usado assim que
// public/vendor/ga4.js termina de carregar. É essa chamada que o gtag.js
// remoto (googletagmanager.com) sabe transformar num hit de
// `/g/collect?...&en=<nome>`; confirmado por verificação manual de ponta
// a ponta (ver adendo em task-8-report.md) — empurrar um array cru no
// `dataLayer` não produz hit nenhum, só a API `gtag()` produz.
describe('track — API canônica window.gtag (vendor script já carregado)', () => {
  it('chama window.gtag("event", nome, params) quando consentido', () => {
    writeConsent({ analytics: true, marketing: false });
    const gtag = vi.fn();
    (window as unknown as { gtag?: Gtag }).gtag = gtag;

    track('cta_click', { origem: 'home', destino: '/diagnostico' });

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', {
      origem: 'home',
      destino: '/diagnostico',
    });
  });

  it('não chama gtag sem consentimento, mesmo com window.gtag disponível', () => {
    const gtag = vi.fn();
    (window as unknown as { gtag?: Gtag }).gtag = gtag;

    track('cta_click', { origem: 'home', destino: '/diagnostico' });

    expect(gtag).not.toHaveBeenCalled();
  });

  it('passa {} quando o evento não tem params', () => {
    writeConsent({ analytics: true, marketing: false });
    const gtag = vi.fn();
    (window as unknown as { gtag?: Gtag }).gtag = gtag;

    track('form_start');

    expect(gtag).toHaveBeenCalledWith('event', 'form_start', {});
  });

  it('prefere window.gtag ao dataLayer bruto quando ambos existem', () => {
    writeConsent({ analytics: true, marketing: false });
    const gtag = vi.fn();
    (window as unknown as { gtag?: Gtag }).gtag = gtag;

    track('cta_click');

    expect(gtag).toHaveBeenCalledTimes(1);
    // não deve ter empurrado nada manualmente no dataLayer — quem cuida
    // disso agora é o próprio `gtag()`.
    expect(camada()).toHaveLength(0);
  });
});
