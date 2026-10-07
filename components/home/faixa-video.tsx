'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Faixa cinematográfica com vídeo de fundo (mudo, em loop) sob um degradê.
 * Só toca quando está na tela; sob prefers-reduced-motion fica parado no
 * pôster. Se o arquivo ainda não existir, o degradê de fundo segura a faixa.
 */
export function FaixaVideo({
  src,
  poster,
  children,
}: {
  src: string;
  poster?: string;
  children: ReactNode;
}) {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.pause();
      el.removeAttribute('autoplay');
      return;
    }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <section className="planta relative isolate overflow-hidden">
      {/* fundo de segurança: aparece enquanto o vídeo carrega ou se ele faltar */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(90%_120%_at_85%_30%,#2b29a8_0%,#15146f_40%,var(--tinta)_80%)]"
      />
      <video
        ref={v}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_50%] md:object-right"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_10_46/0.95)_0%,rgb(11_10_46/0.72)_45%,rgb(11_10_46/0.1)_85%)] max-md:bg-[linear-gradient(180deg,rgb(11_10_46/0.55)_0%,rgb(11_10_46/0.9)_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-tinta to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-tinta to-transparent" />
      <div className="container grid py-28 md:min-h-[600px] md:items-center md:py-36">{children}</div>
    </section>
  );
}
