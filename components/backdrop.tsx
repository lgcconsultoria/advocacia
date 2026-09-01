import { useId } from 'react';

/**
 * Grafismo decorativo de fundo. É SVG inline: não custa requisição, não tem
 * licença e não afirma nada sobre o escritório (sem pessoas, sem ambientes).
 * Puramente ornamental — por isso `aria-hidden` e `pointer-events: none`
 * (via CSS) para nunca competir com o conteúdo real nem capturar clique.
 *
 * O `id` do `<pattern>` é gerado com `useId()` em vez de fixo: se o
 * `Backdrop` aparecer mais de uma vez na mesma página, dois `id="dsa-grid"`
 * colidiriam e o navegador usaria a definição errada do `<pattern>`.
 */
export function Backdrop({ variant = 'grid' }: { variant?: 'grid' | 'arcs' }) {
  const gridId = `dsa-grid-${useId()}`;

  if (variant === 'arcs') {
    return (
      <svg className="backdrop" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        {[80, 140, 200, 260, 320].map((r) => (
          <circle key={r} cx="400" cy="0" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>
    );
  }
  return (
    <svg className="backdrop" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill={`url(#${gridId})`} />
    </svg>
  );
}
