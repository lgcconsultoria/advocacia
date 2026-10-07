'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Container Scroll Animation — porta do 21st.dev `@manuarora700/container-scroll-animation`
 * (Aceternity, id 1081). A tela começa inclinada em 3D e se endireita conforme a
 * página rola. framer-motion → motion/react; moldura em tinta com borda de vidro;
 * escala mobile/desktop por CSS (sem estado de largura, sem salto na hidratação);
 * com movimento reduzido a tela já aparece reta.
 */
export function ContainerScroll({
  titulo,
  children,
  className,
}: {
  titulo: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0.1, 0.5], [24, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0.1, 0.5], [0, -60]);

  return (
    <div ref={ref} className={cn('relative flex items-center justify-center px-0 py-6 md:py-14', className)}>
      <div className="w-full" style={{ perspective: '1100px' }}>
        <motion.div style={reduzir ? undefined : { translateY: translate }} className="mx-auto max-w-5xl text-center">
          {titulo}
        </motion.div>
        <Cartao rotate={rotate} scale={scale} reduzir={!!reduzir}>
          {children}
        </Cartao>
      </div>
    </div>
  );
}

function Cartao({
  rotate,
  scale,
  reduzir,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  reduzir: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={
        reduzir
          ? undefined
          : {
              rotateX: rotate,
              scale,
            }
      }
      className="mx-auto mt-10 w-full max-w-5xl rounded-[28px] border border-sinal/25 bg-[linear-gradient(180deg,#1c1b5c,#0f0e3a)] p-2 shadow-[0_0_0_1px_rgb(255_255_255/0.04)_inset,0_9px_20px_#0000004a,0_37px_37px_#00000042,0_84px_50px_#00000026,0_149px_60px_#0000000a] md:mt-12 md:p-4"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-tinta">{children}</div>
    </motion.div>
  );
}

export default ContainerScroll;
