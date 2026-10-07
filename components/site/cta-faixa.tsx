import type { ReactNode } from 'react';
import { Simbolo } from './marca';

/** Faixa final de chamada: azul da marca, título expandido e as ações. */
export function CtaFaixa({
  rotulo = 'Próximo passo',
  titulo,
  texto,
  children,
}: {
  rotulo?: string;
  titulo: ReactNode;
  texto?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_140%_at_85%_0%,#3b38d6_0%,var(--marca)_45%,var(--marca-funda)_100%)] text-white">
      <Simbolo className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[420px] w-[420px] -translate-y-1/2 text-white/[0.06]" />
      <div className="container grid items-end gap-8 py-16 md:grid-cols-[minmax(0,1.3fr)_auto] md:py-20">
        <div className="min-w-0">
          <div className="rotulo text-white/70">{rotulo}</div>
          <h2 className="expandida m-0 mt-4 max-w-[22ch] text-[clamp(1.7rem,3.8vw,2.9rem)] font-[790] leading-[1.04] tracking-[-0.03em]">
            {titulo}
          </h2>
          {texto && <p className="mt-4 max-w-[52ch] text-[1.03rem] text-white/80">{texto}</p>}
        </div>
        <div className="flex flex-wrap gap-3 [&_.btn-contorno-claro]:border-white/45 [&_.btn-contorno-claro:hover]:border-white">{children}</div>
      </div>
    </section>
  );
}
