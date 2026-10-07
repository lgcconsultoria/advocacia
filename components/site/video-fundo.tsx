'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Vídeo decorativo de fundo (mudo, em loop). Nada é baixado antes de ele chegar
 * perto da tela (preload="none" + pôster); toca só enquanto está visível; fica
 * parado no pôster com movimento reduzido ou economia de dados.
 */
export function VideoFundo({
  src,
  poster,
  className,
  posicao = 'center',
}: {
  src: string;
  poster: string;
  className?: string;
  posicao?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || conexao?.saveData) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          if (el.preload !== 'auto') el.preload = 'auto';
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: '120px 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={cn('h-full w-full object-cover', className)}
      style={{ objectPosition: posicao }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
