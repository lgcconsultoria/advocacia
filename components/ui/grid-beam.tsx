'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Grid Beam — porta do 21st.dev `@cult-ui/grid-beam` (id 18024), na marca.
 *
 * Um canvas desenha feixes de luz correndo pelas linhas de uma grade (como as
 * "plantas" do escritório). Paleta da casa (sinal e marca, opacidade baixa).
 * Mudanças em relação ao original: sem next-themes, o laço para fora da tela
 * (IntersectionObserver) e em aba oculta, e com movimento reduzido fica só a
 * grade, sem feixes.
 */

type RGB = readonly [number, number, number];
type Faixa = { color: RGB; op: number };

const PALETA: { h: Faixa[]; v: Faixa[] } = {
  h: [
    { color: [142, 139, 255], op: 0.42 },
    { color: [98, 95, 235], op: 0.36 },
    { color: [185, 183, 255], op: 0.34 },
    { color: [142, 139, 255], op: 0.38 },
  ],
  v: [
    { color: [120, 117, 250], op: 0.36 },
    { color: [211, 154, 91], op: 0.26 }, // âmbar, só um feixe
    { color: [142, 139, 255], op: 0.4 },
    { color: [98, 95, 235], op: 0.34 },
  ],
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const gauss = (x: number, s: number) => Math.exp(-(x * x) / (2 * s * s));

export function GridBeam({
  rows = 3,
  cols = 4,
  duration = 4,
  strength = 1,
  linhas = 'rgb(142 139 255 / 0.13)',
  className,
  children,
}: {
  rows?: number;
  cols?: number;
  duration?: number;
  strength?: number;
  /** Cor das linhas da grade. */
  linhas?: string;
  className?: string;
  children?: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visivel = false;
    let raf = 0;
    const inicio = performance.now();
    const rgba = (r: number, g: number, b: number, a: number) =>
      `rgba(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)},${Math.max(0, a).toFixed(4)})`;

    const feixe = (
      x0: number, y0: number, x1: number, y1: number, cx: number, cy: number,
      bloom: number, [cr, cg, cb]: RGB, op: number, gs: number, horizontal: boolean,
    ) => {
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloom);
      bg.addColorStop(0, rgba(cr, cg, cb, op * 0.3 * gs));
      bg.addColorStop(0.4, rgba(cr, cg, cb, op * 0.12 * gs));
      bg.addColorStop(1, 'transparent');
      ctx.save();
      if (horizontal) {
        ctx.scale(1, 4 / bloom);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, (cy * bloom) / 4, bloom, 0, Math.PI * 2);
      } else {
        ctx.scale(4 / bloom, 1);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc((cx * bloom) / 4, cy, bloom, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
      const lg = ctx.createLinearGradient(x0, y0, x1, y1);
      lg.addColorStop(0, 'transparent');
      lg.addColorStop(0.12, rgba(cr, cg, cb, op * 0.4 * gs));
      lg.addColorStop(0.35, rgba(cr + 60, cg + 60, cb + 60, op * 0.8 * gs));
      lg.addColorStop(0.5, rgba(cr + 100, cg + 100, cb + 100, op * gs));
      lg.addColorStop(0.65, rgba(cr + 60, cg + 60, cb + 60, op * 0.8 * gs));
      lg.addColorStop(0.88, rgba(cr, cg, cb, op * 0.4 * gs));
      lg.addColorStop(1, 'transparent');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    };

    const draw = (agora: number) => {
      raf = 0;
      if (!visivel || document.hidden) return;
      const t = (agora - inicio) / 1000;
      ctx.clearRect(0, 0, w, h);
      const gs = smooth(Math.min(1, t / 0.8)) * strength;
      const br = 0.85 + 0.3 * Math.sin(t * 1.4) + 0.1 * Math.sin(t * 2.3);
      const cw = w / cols;
      const ch = h / rows;
      const posH = (r: number) => ((((t * (1 + (r % 3) * 0.12)) / duration + r * 0.21 + (r % 2) * 0.35) % 1) * w);
      const posV = (c: number) => ((((t * (1 + (c % 3) * 0.1)) / (duration * 1.2) + c * 0.26 + (c % 2) * 0.4) % 1) * h);

      for (let r = 1; r < rows; r++) {
        const y = r * ch;
        const x = posH(r);
        const p = PALETA.h[r % PALETA.h.length];
        const len = cw * 0.55 * br;
        feixe(x - len, y, x + len, y, x, y, cw * 0.6 * br, p.color, p.op, gs, true);
      }
      for (let c = 1; c < cols; c++) {
        const x = c * cw;
        const y = posV(c);
        const p = PALETA.v[c % PALETA.v.length];
        const len = ch * 0.55 * br;
        feixe(x, y - len, x, y + len, x, y, ch * 0.6 * br, p.color, p.op, gs, false);
      }
      // brilho nos cruzamentos quando dois feixes se encontram
      for (let r = 1; r < rows; r++) {
        for (let c = 1; c < cols; c++) {
          const ix = c * cw;
          const iy = r * ch;
          const prox = gauss((posH(r) - ix) / cw, 0.25) * gauss((posV(c) - iy) / ch, 0.25);
          if (prox <= 0.05) continue;
          const fr = 3.5 * Math.sqrt(prox);
          const g = ctx.createRadialGradient(ix, iy, 0, ix, iy, fr);
          g.addColorStop(0, rgba(255, 255, 255, prox * 0.6 * gs));
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(ix, iy, fr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([en]) => {
      visivel = en.isIntersecting;
      if (visivel && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onVis = () => {
      if (!document.hidden && visivel && !raf) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [rows, cols, duration, strength]);

  return (
    <div className={cn('relative overflow-hidden', className)} data-slot="grid-beam">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {Array.from({ length: rows - 1 }, (_, r) => {
          const y = `${((r + 1) / rows) * 100}%`;
          return <line key={`h${r}`} x1="0" x2="100%" y1={y} y2={y} stroke={linhas} strokeWidth={1} />;
        })}
        {Array.from({ length: cols - 1 }, (_, c) => {
          const x = `${((c + 1) / cols) * 100}%`;
          return <line key={`v${c}`} x1={x} x2={x} y1="0" y2="100%" stroke={linhas} strokeWidth={1} />;
        })}
      </svg>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      {children !== undefined && <div className="relative">{children}</div>}
    </div>
  );
}

export default GridBeam;
