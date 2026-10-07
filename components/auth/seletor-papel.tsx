'use client';

/* Porte do Segmented Control (21st.dev 23552, @ddoemonn): radiogroup com
   polegar deslizante e máscara de texto; recolorido para a marca. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

const MOLA = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 } as const;
const SEG_PADRAO = 'f-mono px-3 py-2 text-center text-[12px] font-medium uppercase tracking-[0.06em] whitespace-nowrap';
const SEG_COMPACTO = 'f-mono px-1 py-2 text-center text-[11px] font-medium uppercase tracking-[0.02em] whitespace-nowrap sm:px-2 sm:text-[11.5px] sm:tracking-[0.05em]';

export type OpcaoSegmento = { value: string; label: string };

export function SeletorPapel({
  opcoes,
  rotulo,
  valor,
  aoMudar,
  className,
  compacto,
}: {
  opcoes: OpcaoSegmento[];
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  className?: string;
  /** Texto menor, para quatro ou mais opções em telas estreitas. */
  compacto?: boolean;
}) {
  const SEG = compacto ? SEG_COMPACTO : SEG_PADRAO;
  const n = Math.max(1, opcoes.length);
  const colunas = `repeat(${n}, minmax(0, 1fr))`;
  const idx = Math.max(0, opcoes.findIndex((o) => o.value === valor));
  const [hover, setHover] = useState(-1);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const reduzido = useReducedMotion();
  const pos = useMotionValue(idx);
  const x = useTransform(pos, (v) => `${v * 100}%`);
  const xMascara = useTransform(pos, (v) => `${v * -100}%`);

  useEffect(() => {
    if (reduzido) {
      pos.set(idx);
      return;
    }
    const c = animate(pos, idx, MOLA);
    return () => c.stop();
  }, [idx, reduzido, pos]);

  const ir = useCallback(
    (i: number) => {
      const o = opcoes[(i + n) % n];
      botoes.current[(i + n) % n]?.focus();
      aoMudar(o.value);
    },
    [opcoes, n, aoMudar],
  );

  return (
    <div
      role="radiogroup"
      aria-label={rotulo}
      className={cn('relative block w-full select-none rounded-xl bg-(--s-card-2) p-1 ring-1 ring-inset ring-(--s-border-2)', className)}
    >
      <div className="relative grid" style={{ gridTemplateColumns: colunas, touchAction: 'manipulation' }}>
        {opcoes.map((o, i) => (
          <span key={o.value} aria-hidden className={cn(SEG, 'pointer-events-none transition-colors', hover === i && i !== idx ? 'text-(--s-fg)' : 'text-(--s-muted)')}>
            {o.label}
          </span>
        ))}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-lg bg-(--s-primary) shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--s-primary)_70%,transparent)]"
          style={{ width: `${100 / n}%`, x }}
        >
          <motion.div className="absolute inset-0" style={{ x: xMascara }}>
            <div className="absolute inset-y-0 left-0 grid" style={{ width: `${n * 100}%`, gridTemplateColumns: colunas }}>
              {opcoes.map((o) => (
                <span key={o.value} className={cn(SEG, 'text-(--s-primary-fg)')}>
                  {o.label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: colunas }} onPointerLeave={() => setHover(-1)}>
          {opcoes.map((o, i) => (
            <button
              key={o.value}
              ref={(el) => {
                botoes.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={i === idx}
              tabIndex={i === idx ? 0 : -1}
              onClick={() => aoMudar(o.value)}
              onPointerEnter={() => setHover(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  ir(i + 1);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  ir(i - 1);
                }
              }}
              className="cursor-pointer rounded-lg outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--s-ring)] focus-visible:outline-none"
            >
              <span className="sr-only">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
