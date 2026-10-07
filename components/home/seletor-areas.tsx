'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type AreaSeletor = {
  slug: string;
  title: string;
  curto: string;
  summary: string;
  lead: string;
};

export type GrupoSeletor = { id: string; nome: string; titulo: string; areas: AreaSeletor[] };

const R_EXT = 46;
const R_INT = 29;

function setor(i: number, N: number) {
  const gap = 1.6;
  const a0 = ((i * 360) / N - 90 - 360 / N / 2 + gap / 2) * (Math.PI / 180);
  const a1 = (((i + 1) * 360) / N - 90 - 360 / N / 2 - gap / 2) * (Math.PI / 180);
  const p = (r: number, a: number) => `${(50 + r * Math.cos(a)).toFixed(3)} ${(50 + r * Math.sin(a)).toFixed(3)}`;
  return `M ${p(R_EXT, a0)} A ${R_EXT} ${R_EXT} 0 0 1 ${p(R_EXT, a1)} L ${p(R_INT, a1)} A ${R_INT} ${R_INT} 0 0 0 ${p(R_INT, a0)} Z`;
}

/**
 * O mostrador das áreas: escolha o grupo, gire o seletor e leia a área ao lado.
 * Gira sozinho até o leitor tocar nele (e nunca sob movimento reduzido).
 */
export function SeletorAreas({ grupos }: { grupos: GrupoSeletor[] }) {
  const [g, setG] = useState(0);
  const [ativa, setAtiva] = useState(0);
  const [auto, setAuto] = useState(true);
  const grupo = grupos[g];
  const AREAS = grupo.areas;
  const N = AREAS.length;

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setAtiva((a) => (a + 1) % N), 4200);
    return () => clearInterval(t);
  }, [auto, N]);

  const a = AREAS[Math.min(ativa, N - 1)];
  const escolhe = (i: number) => {
    setAuto(false);
    setAtiva(i);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Grupos de atuação">
        {grupos.map((gr, i) => (
          <button
            key={gr.id}
            type="button"
            role="tab"
            aria-selected={i === g}
            onClick={() => {
              setG(i);
              setAtiva(0);
              setAuto(false);
            }}
            className={cn(
              'expandida cursor-pointer rounded-full border px-4 py-2 text-[13px] font-[650] transition',
              i === g ? 'border-tinta bg-tinta text-white' : 'border-grafite/15 bg-transparent text-grafite hover:border-marca'
            )}
          >
            {gr.nome} <span className="num ml-1 opacity-60">{String(gr.areas.length).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16" role="tabpanel">
        <div className="relative mx-auto w-full max-w-[460px]">
          <svg viewBox="0 0 100 100" className="block w-full" role="group" aria-label={`Áreas de ${grupo.nome}`}>
            <circle cx="50" cy="50" r="49.3" fill="none" stroke="var(--papel-2)" strokeWidth="0.4" />
            {AREAS.map((ar, i) => {
              const ang = ((i * 360) / N - 90) * (Math.PI / 180);
              const on = i === ativa;
              return (
                <g
                  key={ar.slug}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={ar.title}
                  onClick={() => escolhe(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      escolhe(i);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>path]:stroke-marca [&:focus-visible>path]:[stroke-width:0.8]"
                >
                  <path
                    d={setor(i, N)}
                    fill={on ? 'var(--marca)' : '#fff'}
                    stroke={on ? 'var(--marca)' : 'var(--papel-2)'}
                    strokeWidth="0.3"
                    className="transition-[fill] duration-300 hover:fill-[#dcdcf6]"
                    style={on ? { fill: 'var(--marca)' } : undefined}
                  />
                  <text
                    x={(50 + ((R_EXT + R_INT) / 2) * Math.cos(ang)).toFixed(3)}
                    y={(50 + ((R_EXT + R_INT) / 2) * Math.sin(ang)).toFixed(3)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={ar.curto.length > 10 ? 2.6 : 3.1}
                    fontWeight={650}
                    fill={on ? '#fff' : 'var(--grafite)'}
                    style={{ fontStretch: '112%', pointerEvents: 'none' }}
                  >
                    {ar.curto}
                  </text>
                </g>
              );
            })}
            {/* ponteiro */}
            <g
              style={{
                transform: `rotate(${(ativa * 360) / N}deg)`,
                transformOrigin: '50px 50px',
                transition: 'transform 700ms cubic-bezier(.6,0,.2,1)',
              }}
            >
              <line x1="50" y1="50" x2="50" y2={50 - R_INT + 2.5} stroke="var(--marca)" strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="50" cy={50 - R_INT + 2.5} r="0.9" fill="var(--marca)" />
            </g>
            <circle cx="50" cy="50" r="12.5" fill="var(--tinta)" />
            <text x="50" y="49" textAnchor="middle" fontSize="5.4" fontWeight={800} fill="#fff" style={{ fontStretch: '125%' }}>
              360°
            </text>
            <text
              x="50"
              y="55.2"
              textAnchor="middle"
              fontSize="2.3"
              fill="var(--sinal)"
              style={{ letterSpacing: '0.3px', fontFamily: 'var(--f-mono)' }}
            >
              {String(ativa + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </text>
          </svg>
        </div>

        <div className="min-w-0" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={`${grupo.id}-${a.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl bg-white p-7 shadow-[0_30px_80px_-40px_rgb(29_27_154/0.35)] sm:p-10"
            >
              <div className="rotulo text-marca">{grupo.titulo} · {a.title}</div>
              <h3 className="citacao m-0 mt-4 text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.1]">{a.summary}</h3>
              <p className="m-0 mt-6 border-t border-papel-2 pt-5 text-[0.98rem] leading-relaxed text-cinza">{a.lead}</p>
              <Link href={`/areas/${a.slug}`} className="link-seta mt-7">
                Ver a área de {a.title} <span aria-hidden="true">→</span>
              </Link>
            </motion.article>
          </AnimatePresence>
          <div className="mt-5 flex flex-wrap gap-2">
            {AREAS.map((ar, i) => (
              <button
                key={ar.slug}
                type="button"
                onClick={() => escolhe(i)}
                aria-pressed={i === ativa}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] transition',
                  i === ativa ? 'border-marca bg-marca text-white' : 'border-grafite/15 bg-transparent text-grafite hover:border-marca'
                )}
              >
                {ar.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
