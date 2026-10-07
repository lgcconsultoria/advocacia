/**
 * Utilitários de animação em função do tempo, para o filme da fatura.
 *
 * O filme é uma função pura de `t` (ms): cada quadro depende só do tempo, nunca de
 * animações autônomas. Assim ele toca no site (relógio com requestAnimationFrame) e é
 * exportado em MP4 quadro a quadro, sem tremer (scripts/tributario/exportar-filme.mjs).
 */

export const lim = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Saída suave (cúbica), a curva da marca (--ease ≈ cubic-bezier(.2,.7,.2,1)). */
export const suave = (x: number) => 1 - Math.pow(1 - lim(x), 3);

/** Entrada e saída suaves. */
export const suave2 = (x: number) => {
  const v = lim(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};

/** Progresso 0→1 entre `ini` e `ini + dur`, com curva. */
export const fase = (t: number, ini: number, dur: number, curva: (x: number) => number = suave) =>
  curva((t - ini) / Math.max(dur, 1));

export const mistura = (a: number, b: number, p: number) => a + (b - a) * p;

/** Estilo de entrada: sobe `dy` px e acende. */
export function aparece(t: number, ini: number, dur = 650, dy = 18): { opacity: number; transform: string } {
  const p = fase(t, ini, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
}

/** Opacidade de uma cena: acende no começo e apaga no fim. */
export function vidaDaCena(t: number, dur: number, entrada = 450, saida = 450) {
  return Math.min(fase(t, 0, entrada), 1 - fase(t, dur - saida, saida, suave2));
}

/** Valor de um contador que vai de `de` a `ate` entre `ini` e `ini + dur`. */
export const conta = (t: number, ini: number, dur: number, ate: number, de = 0) =>
  mistura(de, ate, fase(t, ini, dur, suave2));
