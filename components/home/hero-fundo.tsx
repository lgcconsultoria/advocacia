'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type RefObject } from 'react';
import { MeshGradient } from '@/components/ui/mesh-gradient';
import { cn } from '@/lib/utils';

// three + R3F + drei (~250 KB gz): só baixa quando o desktop com WebGL pede.
const Prisma3D = dynamic(() => import('@/components/ui/prisma-3d'), { ssr: false, loading: () => null });

type Modo = 'css' | 'malha' | 'prisma';

function temWebgl(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Fundo do hero da home:
 *  - desktop (≥ 1024 px), com WebGL e sem movimento reduzido: o cristal 3D
 *    (Prism Hero, 21st 25977) refratando a assinatura;
 *  - celular/tablet ou sem WebGL: a malha de gradiente (Mesh Gradient, 21st 33527);
 *  - movimento reduzido ou economia de dados: só o degradê em CSS.
 * O servidor sempre entrega o degradê; a troca acontece depois da hidratação.
 */
export function HeroFundo({ alvo }: { alvo?: RefObject<HTMLElement | null> }) {
  const [modo, setModo] = useState<Modo>('css');
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduzido || economia) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    const nucleos = navigator.hardwareConcurrency ?? 4;
    if (desktop && nucleos >= 4 && temWebgl()) setModo('prisma');
    else if (temWebgl()) setModo('malha');
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-tinta">
      {/* degradê de base (servidor, movimento reduzido e enquanto o resto carrega) */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgb(91_87_255/0.45),transparent_70%),radial-gradient(60%_60%_at_10%_100%,rgb(29_27_154/0.9),transparent_70%),radial-gradient(50%_50%_at_95%_90%,rgb(142_139_255/0.25),transparent_70%)]" />
      {modo === 'malha' && (
        <MeshGradient className="absolute inset-0 opacity-90" colors={['#0b0a2e', '#1d1b9a', '#8e8bff', '#14134a']} speed={0.18} />
      )}
      {modo === 'prisma' && (
        <Prisma3D
          palavra="SENTURIÃO"
          alvoScroll={alvo}
          deslocamento={0.25}
          altura={0.25}
          larguraPalavra={0.44}
          onPronto={() => requestAnimationFrame(() => setPronto(true))}
          className={cn('absolute inset-0 transition-opacity duration-[1400ms] ease-out', pronto ? 'opacity-100' : 'opacity-0')}
        />
      )}
      {/* vinheta e grão por cima de qualquer fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_40%,transparent_45%,var(--tinta)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-tinta/80 via-tinta/30 to-transparent max-lg:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-tinta to-transparent lg:h-[22%]" />
    </div>
  );
}
