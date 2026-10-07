'use client';

import * as React from 'react';
import { SIMBOLO_CAIXA, SIMBOLO_D, SIMBOLO_TRANSFORM } from '@/lib/marca/simbolo';
import { cn } from '@/lib/utils';

/**
 * Selo de luz: o símbolo DS da marca como um selo em camadas (substitui o cristal 3D).
 *
 * Só SVG e CSS (sem three.js): o servidor já entrega o desenho, a entrada roda em CSS
 * (o traço do selo varre o círculo como um ponteiro de relógio), e o JavaScript só
 * acrescenta a inclinação pelo ponteiro e o leve giro pela rolagem. Camadas em
 * profundidade (translateZ) dão o relevo; com movimento reduzido fica tudo parado
 * e visível (globals.css, bloco "selo").
 */

const C = SIMBOLO_CAIXA / 2; // centro
const ANEL_TEXTO = 'DOUGLAS SENTURIÃO ADVOCACIA · DIREITO TRIBUTÁRIO · DIREITO PÚBLICO · LICITAÇÕES · SÃO PAULO ·';

// arredonda para o HTML do servidor e o do navegador baterem na hidratação
const arred = (v: number) => Math.round(v * 100) / 100;
const R_TEXTO = C + 160;
const VOLTA_TEXTO = arred(2 * Math.PI * R_TEXTO * 0.985);

function Marcas() {
  // 72 marcas no anel externo; a cada 6, uma longa (como a borda de uma moeda)
  const r1 = C + 205;
  const itens = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const longa = i % 6 === 0;
    const r0 = r1 - (longa ? 26 : 12);
    itens.push(
      <line
        key={i}
        x1={arred(C + Math.cos(a) * r0)}
        y1={arred(C + Math.sin(a) * r0)}
        x2={arred(C + Math.cos(a) * r1)}
        y2={arred(C + Math.sin(a) * r1)}
        strokeWidth={longa ? 3 : 1.6}
      />,
    );
  }
  return <g className="selo-marcas">{itens}</g>;
}

export function SeloLuz({ className, alvoScroll }: { className?: string; alvoScroll?: React.RefObject<HTMLElement | null> }) {
  const palco = React.useRef<HTMLDivElement>(null);
  const uid = React.useId().replace(/:/g, '');
  const id = (n: string) => `selo-${uid}-${n}`;

  React.useEffect(() => {
    const el = palco.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0, p: 0 };
    let raf = 0;
    let visivel = true;
    const mover = (e: PointerEvent) => {
      alvo.x = (e.clientX / window.innerWidth - 0.5) * 2;
      alvo.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const quadro = () => {
      raf = 0;
      const ref = alvoScroll?.current ?? el;
      const r = ref.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      atual.x += (alvo.x - atual.x) * 0.06;
      atual.y += (alvo.y - atual.y) * 0.06;
      atual.p += (p - atual.p) * 0.12;
      el.style.setProperty('--selo-rx', `${(-atual.y * 9).toFixed(2)}deg`);
      el.style.setProperty('--selo-ry', `${(atual.x * 12).toFixed(2)}deg`);
      el.style.setProperty('--selo-p', atual.p.toFixed(3));
      if (visivel) raf = requestAnimationFrame(quadro);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && !raf) raf = requestAnimationFrame(quadro);
    });
    io.observe(el);
    window.addEventListener('pointermove', mover, { passive: true });
    raf = requestAnimationFrame(quadro);
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', mover);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [alvoScroll]);

  const caixa = `${-260} ${-260} ${SIMBOLO_CAIXA + 520} ${SIMBOLO_CAIXA + 520}`;

  return (
    <div ref={palco} className={cn('selo', className)} aria-hidden="true">
      <div className="selo-cena">
        {/* camada 0: halo */}
        <div className="selo-halo" />

        {/* camada 1: anel com marcas e texto, girando devagar */}
        <svg className="selo-camada selo-anel" viewBox={caixa}>
          <defs>
            <path id={id('arco')} d={`M ${C - R_TEXTO} ${C} a ${R_TEXTO} ${R_TEXTO} 0 1 1 ${2 * R_TEXTO} 0 a ${R_TEXTO} ${R_TEXTO} 0 1 1 -${2 * R_TEXTO} 0`} />
          </defs>
          <circle cx={C} cy={C} r={C + 215} className="selo-linha" />
          <Marcas />
          <text className="selo-texto">
            <textPath href={`#${id('arco')}`} startOffset="0" textLength={VOLTA_TEXTO} lengthAdjust="spacing">
              {ANEL_TEXTO}
            </textPath>
          </text>
        </svg>

        {/* camada 2: órbitas finas e o ponto âmbar */}
        <svg className="selo-camada selo-orbitas" viewBox={caixa}>
          <circle cx={C} cy={C} r={C + 95} className="selo-linha selo-tracejada" />
          <circle cx={C} cy={C} r={C + 60} className="selo-linha selo-fraca" />
          <g className="selo-planeta">
            <circle cx={C} cy={C - (C + 95)} r={9} className="selo-ponto" />
            <circle cx={C} cy={C - (C + 95)} r={22} className="selo-ponto-halo" />
          </g>
        </svg>

        {/* camada 3: o símbolo */}
        <svg className="selo-camada selo-simbolo" viewBox={caixa}>
          <defs>
            <linearGradient id={id('preench')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.55" stopColor="#d9d8ff" />
              <stop offset="1" stopColor="#8e8bff" />
            </linearGradient>
            <linearGradient id={id('faixa')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id={id('brilho')} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
            <clipPath id={id('recorte')}>
              <path d={SIMBOLO_D} transform={SIMBOLO_TRANSFORM} />
            </clipPath>
            {/* entrada: um ponteiro de relógio revela o selo */}
            <mask id={id('varredura')} maskUnits="userSpaceOnUse" x={-260} y={-260} width={SIMBOLO_CAIXA + 520} height={SIMBOLO_CAIXA + 520}>
              <circle
                cx={C}
                cy={C}
                r={340}
                pathLength={1}
                className="selo-varredura"
                transform={`rotate(-90 ${C} ${C})`}
              />
            </mask>
          </defs>
          <g mask={`url(#${id('varredura')})`}>
            {/* a animação vai no <g>: transform em CSS no <path> apagaria o transform do potrace */}
            <g className="selo-glow">
              <path d={SIMBOLO_D} transform={SIMBOLO_TRANSFORM} filter={`url(#${id('brilho')})`} />
            </g>
            <path d={SIMBOLO_D} transform={SIMBOLO_TRANSFORM} fill={`url(#${id('preench')})`} className="selo-corpo" />
            <g clipPath={`url(#${id('recorte')})`}>
              <rect x={-200} y={-200} width={420} height={SIMBOLO_CAIXA + 400} fill={`url(#${id('faixa')})`} className="selo-reflexo" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
