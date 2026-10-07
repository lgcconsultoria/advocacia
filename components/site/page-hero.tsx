import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GradePlanta } from './secao';

export type Trilha = { href?: string; label: string }[];

/** Abertura das páginas internas: planta escura com grade, trilha e título expandido. */
export function PageHero({
  trilha,
  rotulo,
  titulo,
  lead,
  children,
  className,
}: {
  trilha: Trilha;
  rotulo?: ReactNode;
  titulo: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('planta relative isolate overflow-hidden', className)}>
      <GradePlanta />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgb(91_87_255/0.32),transparent_62%)] blur-2xl"
      />
      <div className="container relative pb-16 pt-10 md:pb-24 md:pt-14">
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
        {rotulo && <div className="rotulo mt-10 text-sinal md:mt-14">{rotulo}</div>}
        <h1
          className={cn(
            'expandida m-0 max-w-[20ch] text-[clamp(2.1rem,6vw,4.6rem)] font-[800] leading-[0.98] tracking-[-0.04em] text-white',
            rotulo ? 'mt-4' : 'mt-10 md:mt-14'
          )}
        >
          {titulo}
        </h1>
        {lead && (
          <p className="mt-6 max-w-[60ch] text-[1.08rem] leading-relaxed text-cinza-escuro">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
