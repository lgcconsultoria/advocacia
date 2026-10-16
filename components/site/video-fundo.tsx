'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Vídeo decorativo de fundo (mudo, em loop). Nada é baixado antes de ele chegar
 * perto da tela (preload="none" + pôster); toca só enquanto está visível; fica
 * parado no pôster com movimento reduzido ou economia de dados.
 *
 * O pôster também espera: o atributo `poster` baixa a imagem na hora, mesmo com
 * preload="none", e os pôsteres abaixo da dobra pesavam no LCP da home. Só entra
 * quando o vídeo chega a ~1 tela de distância — ou já no servidor, com `imediato`
 * (vídeo acima da dobra, como o do PageHero).
 */
export function VideoFundo({
  src,
  poster,
  className,
  posicao = 'center',
  imediato = false,
}: {
  src: string;
  poster: string;
  className?: string;
  posicao?: string;
  /** Acima da dobra: pôster já no HTML. */
  imediato?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [verPoster, setVerPoster] = useState(imediato);

  useEffect(() => {
    const el = ref.current;
    if (!el || verPoster) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVerPoster(true);
      return;
    }
    const io = new IntersectionObserver(
      ([en]) => {
        if (en?.isIntersecting) {
          setVerPoster(true);
          io.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [verPoster]);

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
      poster={verPoster ? poster : undefined}
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
