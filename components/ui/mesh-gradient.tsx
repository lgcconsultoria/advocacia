'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Mesh Gradient — porta do 21st.dev `@adrielzimbril/mesh-gradient` (id 33527).
 *
 * Gradiente de malha em WebGL (@paper-design/shaders-react, importado sob
 * demanda). Na marca: tinta, marca, sinal e tinta-2; velocidade baixa.
 * Acréscimos: com movimento reduzido a malha fica parada (speed 0) e, fora da
 * tela, também para — o shader não gasta GPU à toa. Enquanto o módulo não
 * chega, fica um degradê em CSS com as mesmas cores.
 */

type ShaderProps = Record<string, unknown>;
let Cache: React.ComponentType<ShaderProps> | null = null;

export interface MeshGradientProps {
  colors?: string[];
  speed?: number;
  distortion?: number;
  swirl?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CORES_MARCA = ['#0b0a2e', '#1d1b9a', '#8e8bff', '#14134a'];

export const MeshGradient = React.memo(function MeshGradient({
  colors = CORES_MARCA,
  speed = 0.2,
  distortion = 0.8,
  swirl = 0.55,
  className,
  style,
}: MeshGradientProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [Comp, setComp] = React.useState<React.ComponentType<ShaderProps> | null>(() => Cache);
  const [ativo, setAtivo] = React.useState(true);
  const [reduzido, setReduzido] = React.useState(false);
  const [tamanho, setTamanho] = React.useState({ width: 800, height: 600 });

  React.useEffect(() => {
    setReduzido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!Cache) {
      import('@paper-design/shaders-react')
        .then((m) => {
          Cache = m.MeshGradient as unknown as React.ComponentType<ShaderProps>;
          setComp(() => Cache);
        })
        .catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0 && height > 0) setTamanho({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setAtivo(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none relative size-full select-none overflow-hidden', className)}
      style={{
        background: `radial-gradient(120% 90% at 75% 20%, ${colors[2]}55 0%, transparent 55%), radial-gradient(90% 90% at 10% 90%, ${colors[1]} 0%, transparent 60%), ${colors[0]}`,
        ...style,
      }}
    >
      {Comp && (
        <Comp
          width={tamanho.width}
          height={tamanho.height}
          colors={colors}
          distortion={distortion}
          swirl={swirl}
          speed={reduzido || !ativo ? 0 : speed}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
});

export default MeshGradient;
