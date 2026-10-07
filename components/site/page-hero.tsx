import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GradePlanta } from './secao';
import { VideoFundo } from './video-fundo';

export type Trilha = { href?: string; label: string }[];

/**
 * Abertura das páginas internas (v2): planta escura com brilhos azuis, grade
 * que some nas bordas, trilha em mono e título expandido grande. Opcional:
 * um vídeo de fundo (pôster + carregamento só quando visível).
 */
export function PageHero({
  trilha,
  rotulo,
  titulo,
  lead,
  children,
  className,
  video,
}: {
  trilha: Trilha;
  rotulo?: ReactNode;
  titulo: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
  video?: { src: string; poster: string; posicao?: string };
}) {
  return (
    <section className={cn('planta ruido relative isolate overflow-hidden', className)}>
      {video && (
        <>
          <div aria-hidden="true" className="absolute inset-0 -z-20">
            <VideoFundo src={video.src} poster={video.poster} posicao={video.posicao} className="opacity-70" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_10_46/0.96)_0%,rgb(11_10_46/0.78)_45%,rgb(11_10_46/0.2)_85%)] max-md:bg-[linear-gradient(180deg,rgb(11_10_46/0.55)_0%,rgb(11_10_46/0.92)_65%)]"
          />
        </>
      )}
      <GradePlanta className="opacity-[0.16]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgb(91_87_255/0.38),transparent_62%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-40 -z-10 h-[520px] w-[620px] rounded-full bg-[radial-gradient(circle,rgb(29_27_154/0.55),transparent_65%)] blur-3xl"
      />
      <div className="container relative pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-24 md:pt-[calc(var(--header-h)+3.5rem)]">
        <nav className="rotulo flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-cinza-escuro" aria-label="Trilha de navegação">
          <Link href="/" className="no-underline hover:text-white">Início</Link>
          {trilha.map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-sinal">/</span>
              {t.href ? (
                <Link href={t.href} className="no-underline hover:text-white">{t.label}</Link>
              ) : (
                <span aria-current="page" className="text-white/80">{t.label}</span>
              )}
            </span>
          ))}
        </nav>
        {rotulo && <p className="etiqueta etiqueta--escura m-0 mt-10 md:mt-14">{rotulo}</p>}
        <h1
          className={cn(
            'display m-0 max-w-[18ch] text-[clamp(2.3rem,6.6vw,5.4rem)] text-white',
            rotulo ? 'mt-5' : 'mt-10 md:mt-14'
          )}
        >
          {titulo}
        </h1>
        {lead && (
          <p className="mt-7 max-w-[60ch] text-[1.1rem] leading-relaxed text-cinza-escuro">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
