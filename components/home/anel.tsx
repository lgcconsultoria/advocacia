'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Simbolo } from '@/components/site/marca';

export type FrenteAnel = { slug: string; curto: string; nome: string };

/**
 * O anel: as áreas do escritório giram em volta do símbolo DS. Arraste para
 * girar; um toque/clique sem arrasto abre a área. Com o teclado, o foco traz
 * a carta para a frente. Sob prefers-reduced-motion o anel fica parado.
 */
export function Anel({ frentes }: { frentes: FrenteAnel[] }) {
  const N = frentes.length;
  const PASSO = 360 / N;
  const cena = useRef<HTMLDivElement>(null);
  const anel = useRef<HTMLDivElement>(null);
  const cartas = useRef<(HTMLAnchorElement | null)[]>([]);
  const alvo = useRef<number | null>(null);
  const angRef = useRef(-18);

  useEffect(() => {
    const el = anel.current;
    const palco = cena.current;
    if (!el || !palco) return;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let vel = reduzido ? 0 : 9; // graus por segundo
    let arrasto: { x: number; ang: number; t: number; ultimo: number; id: number; ativo: boolean } | null = null;
    let moveu = false;
    let raf = 0;
    let antes = performance.now();
    let visivel = true;

    const pinta = () => {
      const ang = angRef.current;
      el.style.transform = `rotateX(-13deg) rotateY(${ang.toFixed(2)}deg)`;
      for (let i = 0; i < N; i++) {
        const c = cartas.current[i];
        if (!c) continue;
        // frente = 1 quando a carta encara o leitor
        const frente = Math.cos(((ang + i * PASSO) * Math.PI) / 180);
        c.style.opacity = String(0.28 + 0.72 * Math.max(0, frente) ** 1.4);
        c.style.filter = frente > 0.92 ? 'none' : `saturate(${0.5 + 0.5 * Math.max(0, frente)})`;
        c.style.pointerEvents = frente > 0.55 ? 'auto' : 'none';
      }
    };

    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - antes) / 1000);
      antes = agora;
      if (alvo.current !== null && !arrasto?.ativo) {
        // leva a carta focada para a frente pelo caminho mais curto
        const delta = ((((alvo.current - angRef.current) % 360) + 540) % 360) - 180;
        angRef.current += delta * (1 - Math.exp(-dt * 6));
        vel = 0;
        if (Math.abs(delta) < 0.2) alvo.current = null;
      } else if (!arrasto?.ativo) {
        const meta = reduzido ? 0 : 9;
        vel += (meta - vel) * (1 - Math.exp(-dt * 1.6));
        angRef.current += vel * dt;
      }
      pinta();
      if (visivel) raf = requestAnimationFrame(quadro);
    };

    const desce = (e: PointerEvent) => {
      if (e.button !== 0) return;
      moveu = false;
      alvo.current = null;
      arrasto = { x: e.clientX, ang: angRef.current, t: performance.now(), ultimo: e.clientX, id: e.pointerId, ativo: false };
    };
    const move = (e: PointerEvent) => {
      if (!arrasto || e.pointerId !== arrasto.id) return;
      if (!arrasto.ativo) {
        if (Math.abs(e.clientX - arrasto.x) < 6) return;
        arrasto.ativo = true;
        moveu = true;
        palco.setPointerCapture(e.pointerId);
        palco.style.cursor = 'grabbing';
      }
      const agora = performance.now();
      const dx = e.clientX - arrasto.ultimo;
      const dtm = Math.max(1, agora - arrasto.t);
      vel = (dx * 0.35 * 1000) / dtm;
      arrasto.t = agora;
      arrasto.ultimo = e.clientX;
      angRef.current = arrasto.ang + (e.clientX - arrasto.x) * 0.35;
    };
    const sobe = (e: PointerEvent) => {
      if (!arrasto) return;
      const eraAtivo = arrasto.ativo;
      arrasto = null;
      if (palco.hasPointerCapture(e.pointerId)) palco.releasePointerCapture(e.pointerId);
      palco.style.cursor = 'grab';
      if (eraAtivo) vel = Math.max(-240, Math.min(240, vel));
    };
    // Um arrasto não pode virar clique na carta que estava embaixo do dedo.
    const clique = (e: MouseEvent) => {
      if (moveu) {
        e.preventDefault();
        e.stopPropagation();
        moveu = false;
      }
    };

    const io = new IntersectionObserver(([en]) => {
      const era = visivel;
      visivel = en.isIntersecting;
      if (visivel && !era) {
        antes = performance.now();
        raf = requestAnimationFrame(quadro);
      }
    });
    io.observe(palco);
    palco.addEventListener('pointerdown', desce);
    palco.addEventListener('pointermove', move);
    palco.addEventListener('pointerup', sobe);
    palco.addEventListener('pointercancel', sobe);
    palco.addEventListener('click', clique, true);
    pinta();
    raf = requestAnimationFrame(quadro);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      palco.removeEventListener('pointerdown', desce);
      palco.removeEventListener('pointermove', move);
      palco.removeEventListener('pointerup', sobe);
      palco.removeEventListener('pointercancel', sobe);
      palco.removeEventListener('click', clique, true);
    };
  }, [N, PASSO]);

  return (
    <div
      ref={cena}
      className="relative mx-auto aspect-square w-full max-w-[560px] cursor-grab touch-pan-y select-none [--r:128px] min-[400px]:[--r:150px] sm:[--r:210px] lg:[--r:230px]"
      style={{ perspective: '1100px' }}
      role="group"
      aria-label={`${N} áreas de atuação em destaque. Arraste para girar; cada carta abre a página da área.`}
    >
      {/* luz */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(91_87_255/0.38),transparent_62%)] blur-2xl" />

      <div className="absolute inset-0 grid place-items-center" style={{ transformStyle: 'preserve-3d' }}>
        {/* o escritório no centro, em z = 0: as cartas da frente passam na frente dele */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 grid place-items-center"
          style={{ transform: 'translate(-50%,-50%) translateZ(0px)' }}
        >
          <Simbolo className="h-[64px] w-[64px] text-white sm:h-[96px] sm:w-[96px]" />
          <div className="expandida num mt-3 text-[12px] font-[700] tracking-[0.2em] text-sinal sm:text-[13px]">360°</div>
        </div>
        <div ref={anel} className="relative h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* mostrador no chão: os 360 graus, literalmente */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
              width: 'calc(var(--r) * 2.5)',
              height: 'calc(var(--r) * 2.5)',
              transform: 'translate(-50%,-50%) translateY(calc(var(--r) * 0.42)) rotateX(90deg)',
            }}
          >
            <Mostrador />
          </div>

          {frentes.map((f, i) => (
            <div
              key={f.slug}
              className="absolute left-0 top-0"
              style={{ transform: `rotateY(${i * PASSO}deg) translateZ(var(--r))`, transformStyle: 'preserve-3d' }}
            >
              <Link
                href={`/areas/${f.slug}`}
                ref={(n) => {
                  cartas.current[i] = n;
                }}
                draggable={false}
                onFocus={() => {
                  alvo.current = -i * PASSO;
                }}
                className="absolute block w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-sinal/35 bg-[linear-gradient(160deg,rgb(40_38_140/0.92),rgb(14_13_60/0.94))] px-3 pb-3 pt-3 text-left no-underline shadow-[0_18px_50px_-20px_rgb(91_87_255/0.8)] transition-[border-color] hover:border-sinal focus-visible:border-sinal sm:w-[150px] sm:px-4"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="rotulo num block text-[9.5px] text-sinal">
                  {String(Math.round(i * PASSO)).padStart(3, '0')}°
                </span>
                <span className="expandida mt-1.5 block text-[14px] font-[720] leading-tight text-white sm:text-[17px]">
                  {f.curto}
                </span>
                <span className="mt-1 block text-[10.5px] leading-snug text-cinza-escuro sm:text-[12px]">{f.nome}</span>
              </Link>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-[86px] w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-sinal/15 bg-tinta-2/40 sm:h-[96px] sm:w-[150px]"
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mostrador() {
  const marcas = Array.from({ length: 120 }, (_, i) => i * 3);
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
      <circle r="97" fill="none" stroke="rgb(142 139 255 / 0.35)" strokeWidth="0.4" />
      <circle r="72" fill="none" stroke="rgb(142 139 255 / 0.18)" strokeWidth="0.3" strokeDasharray="1 2" />
      {marcas.map((g) => {
        const a = (g * Math.PI) / 180;
        const longa = g % 45 === 0;
        const r1 = longa ? 88 : 93;
        return (
          <line
            key={g}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * 97}
            y2={Math.sin(a) * 97}
            stroke={longa ? 'rgb(142 139 255 / 0.9)' : 'rgb(142 139 255 / 0.4)'}
            strokeWidth={longa ? 0.7 : 0.35}
          />
        );
      })}
    </svg>
  );
}
