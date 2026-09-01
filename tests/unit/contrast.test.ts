import { describe, it, expect } from 'vitest';
import { contrastRatio, mixOverBackground } from '@/lib/contrast';

const T = {
  paper: '#FFFFFF',
  ink50: '#F4F4F7',
  ink900: '#16161D',
  ink700: '#2A2A35',
  ink500: '#5A5A6B',
  brand700: '#1D1B9A',
  darkSurface: '#101016',
  darkText: '#E8E8EE',
  darkMuted: '#A8A8B8',
  darkAccent: '#8B87F0',
};

describe('contraste dos tokens', () => {
  it('calcula razões conhecidas', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('corpo de texto atinge AAA (>= 7:1) no tema claro', () => {
    expect(contrastRatio(T.ink700, T.paper)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(T.ink700, T.ink50)).toBeGreaterThanOrEqual(7);
  });

  it('texto auxiliar atinge AA (>= 4.5:1) no tema claro', () => {
    expect(contrastRatio(T.ink500, T.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(T.ink500, T.ink50)).toBeGreaterThanOrEqual(4.5);
  });

  it('links de marca atingem AA no tema claro', () => {
    expect(contrastRatio(T.brand700, T.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('corpo de texto atinge AAA no tema escuro', () => {
    expect(contrastRatio(T.darkText, T.darkSurface)).toBeGreaterThanOrEqual(7);
  });

  it('texto auxiliar e acento atingem AA no tema escuro', () => {
    expect(contrastRatio(T.darkMuted, T.darkSurface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(T.darkAccent, T.darkSurface)).toBeGreaterThanOrEqual(4.5);
  });

  it('texto sobre o acento atinge AA nos dois temas', () => {
    expect(contrastRatio('#FFFFFF', T.brand700)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#0F0E52', T.darkAccent)).toBeGreaterThanOrEqual(4.5);
  });

  it('a cor de erro atinge AA nas três superfícies escuras', () => {
    const erroEscuro = '#FF8A80';
    expect(contrastRatio(erroEscuro, '#101016')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(erroEscuro, '#1D1D27')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(erroEscuro, '#17171F')).toBeGreaterThanOrEqual(4.5);
  });

  it('a cor de erro atinge AA nas superfícies claras', () => {
    expect(contrastRatio('#B3261E', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#B3261E', '#F4F4F7')).toBeGreaterThanOrEqual(4.5);
  });
});

// Bordas de elemento não textual — WCAG 1.4.11 exige só 3:1, e a técnica
// para cores translúcidas é compor sobre o fundo conhecido antes de medir
// (mixOverBackground simula o color-mix(...,transparent) do CSS).
describe('contraste de borda — .btn-ghost sobre fundos reativos ao tema (WCAG 1.4.11)', () => {
  const onAccentClaro = '#FFFFFF';
  const onAccentEscuro = '#0F0E52'; // brand-900
  const accentClaro = '#1D1B9A'; // brand-700 — fundo do .cta-band no claro
  const accentEscuro = '#8B87F0'; // fundo do .cta-band no escuro

  it('.cta-band .btn-ghost: borda color-mix(on-accent 70%) atinge >=3:1 nos dois temas', () => {
    const bordaClara = mixOverBackground(onAccentClaro, accentClaro, 70);
    const bordaEscura = mixOverBackground(onAccentEscuro, accentEscuro, 70);
    expect(contrastRatio(bordaClara, accentClaro)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(bordaEscura, accentEscuro)).toBeGreaterThanOrEqual(3);
  });

  it('.cta-band .btn-ghost: 60% (valor descartado) fica abaixo de 3:1 no escuro — documenta por que 70% foi escolhido', () => {
    const bordaEscura60 = mixOverBackground(onAccentEscuro, accentEscuro, 60);
    expect(contrastRatio(bordaEscura60, accentEscuro)).toBeLessThan(3);
  });

  it('.hero-aside .btn-ghost: borda color-mix(text-on-inverse 60%) atinge >=3:1 nos dois temas', () => {
    const textoSobreInverso = '#C6C6D6'; // --text-on-inverse — igual nos dois temas
    // Fundo do cartão: color-mix(paper 6%, transparent) sobre --surface-inverse.
    const cartaoClaro = mixOverBackground('#FFFFFF', '#16161D', 6); // surface-inverse claro = ink-900
    const cartaoEscuro = mixOverBackground('#FFFFFF', '#08080C', 6); // surface-inverse escuro
    const bordaClara = mixOverBackground(textoSobreInverso, cartaoClaro, 60);
    const bordaEscura = mixOverBackground(textoSobreInverso, cartaoEscuro, 60);
    expect(contrastRatio(bordaClara, cartaoClaro)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(bordaEscura, cartaoEscuro)).toBeGreaterThanOrEqual(3);
  });

  it('.hero-aside .btn-ghost: usar --on-accent (abordagem literal do item 1) falharia no escuro — por isso usamos --text-on-inverse', () => {
    const cartaoEscuro = mixOverBackground('#FFFFFF', '#08080C', 6);
    const bordaComOnAccent = mixOverBackground(onAccentEscuro, cartaoEscuro, 60);
    expect(contrastRatio(bordaComOnAccent, cartaoEscuro)).toBeLessThan(3);
  });
});
