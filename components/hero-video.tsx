'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** As cinco condições do §4.2. Falta uma, o vídeo não carrega. */
function podeCarregarVideo(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia('(min-width: 1024px)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;

  // Sem informação de rede, a escolha conservadora é não baixar 600 KB.
  if (!conn) return false;
  if (conn.saveData === true) return false;
  return conn.effectiveType === '4g';
}

/**
 * Hero: o poster é sempre o LCP e nunca depende de JavaScript. O vídeo é
 * uma camada opcional, montada só em desktop, em 4G, sem economia de dados
 * e sem preferência por movimento reduzido.
 */
export function HeroVideo() {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [montar, setMontar] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (!podeCarregarVideo()) return;
    const host = hostRef.current;
    if (!host) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMontar(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  function alternar() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPausado(false);
    } else {
      v.pause();
      setPausado(true);
    }
  }

  return (
    <div className="hero-media" ref={hostRef}>
      <Image
        src="/assets/img/douglas-retrato.jpg"
        alt="Douglas Senturião, advogado responsável pelo escritório"
        width={1100}
        height={1650}
        sizes="(min-width: 940px) 46vw, 92vw"
        priority
      />

      {montar && (
        <>
          <video
            ref={videoRef}
            className={visivel ? 'hero-video is-visible' : 'hero-video'}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVisivel(true)}
          >
            <source src="/assets/video/hero.webm" type="video/webm" />
            <source src="/assets/video/hero.mp4" type="video/mp4" />
          </video>
          {visivel && (
            <button
              type="button"
              className="hero-video-toggle"
              onClick={alternar}
              aria-pressed={pausado}
              aria-label={
                pausado
                  ? 'Retomar o vídeo de fundo'
                  : 'Pausar o vídeo de fundo'
              }
            >
              {pausado ? (
                <Play size={18} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Pause size={18} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
