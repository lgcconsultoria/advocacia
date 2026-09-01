import { describe, it, expect } from 'vitest';
import { contrastRatio } from '@/lib/contrast';

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
