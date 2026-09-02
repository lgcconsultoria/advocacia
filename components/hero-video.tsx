'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Hero em vídeo: autoplay silencioso, em loop, com poster de fallback.
 * Sob prefers-reduced-motion o vídeo não é montado — renderiza a foto
 * institucional no lugar, sem nenhum movimento.
 */
export function HeroVideo() {
  const [reduce, setReduce] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduce) {
    return (
      <Image
        src="/assets/img/douglas-retrato.jpg"
        alt="Douglas Senturião, advogado responsável pelo escritório"
        width={1100}
        height={1650}
        priority
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/img/douglas-retrato.jpg"
      aria-label="Vídeo institucional do escritório"
    >
      <source src="/assets/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
