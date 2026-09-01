/** Luminância relativa de uma cor hex, conforme WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores hex (1 a 21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Cor opaca equivalente a `color-mix(in srgb, hex pct%, transparent)`
 * pintado sobre um fundo `bg` opaco — replica como o navegador compõe uma
 * cor translúcida (ex.: uma borda) contra o que está atrás dela. É a
 * técnica que o WCAG recomenda para medir contraste de cores com alfa:
 * compor sobre o fundo conhecido e então tratar o resultado como opaco.
 */
export function mixOverBackground(hex: string, bg: string, pct: number): string {
  const toRgb = (h: string) => {
    const s = h.replace('#', '');
    const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const [fr, fg, fb] = toRgb(hex);
  const [br, bgc, bb] = toRgb(bg);
  const a = pct / 100;
  const mix = (f: number, b: number) => Math.round(a * f + (1 - a) * b);
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(mix(fr, br))}${toHex(mix(fg, bgc))}${toHex(mix(fb, bb))}`.toUpperCase();
}
