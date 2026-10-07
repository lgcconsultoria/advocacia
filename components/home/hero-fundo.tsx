'use client';

import { useEffect, useState, type RefObject } from 'react';
import { MeshGradient } from '@/components/ui/mesh-gradient';
import { SeloLuz } from '@/components/ui/selo-luz';

type Modo = 'css' | 'malha';

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
 *  - com WebGL e sem movimento reduzido: a malha de gradiente (Mesh Gradient, 21st 33527);
 *  - movimento reduzido, economia de dados ou sem WebGL: só o degradê em CSS;
 *  - desktop (≥ 1024 px), sempre: o selo de luz com o símbolo da marca, à direita
 *    (SVG + CSS, entregue pelo servidor). Substituiu o cristal 3D em 07/10/2026: o
 *    cristal cortava a palavra e brigava com o cartão da Reforma.
 */
export function HeroFundo({ alvo }: { alvo?: RefObject<HTMLElement | null> }) {
  const [modo, setModo] = useState<Modo>('css');

  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduzido || economia) return;
    if (temWebgl()) setModo('malha');
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-tinta">
      {/* degradê de base (servidor, movimento reduzido e enquanto o resto carrega) */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgb(91_87_255/0.45),transparent_70%),radial-gradient(60%_60%_at_10%_100%,rgb(29_27_154/0.9),transparent_70%),radial-gradient(50%_50%_at_95%_90%,rgb(142_139_255/0.25),transparent_70%)]" />
      {modo === 'malha' && (
        <MeshGradient
          className="absolute inset-0 opacity-90 lg:opacity-60"
          colors={['#0b0a2e', '#1d1b9a', '#8e8bff', '#14134a']}
          speed={0.18}
        />
      )}
      {/* vinheta e grão por cima de qualquer fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_40%,transparent_45%,var(--tinta)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-tinta/80 via-tinta/30 to-transparent max-lg:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-tinta to-transparent lg:h-[22%]" />
      {/* o selo fica acima das vinhetas para manter o brilho */}
      <SeloLuz
        alvoScroll={alvo}
        className="absolute right-[3vw] top-[calc(var(--header-h)+1vh)] aspect-square w-[min(41vw,78vh,600px)] max-lg:hidden xl:right-[6vw]"
      />
    </div>
  );
}
