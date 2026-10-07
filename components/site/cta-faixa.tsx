import type { ReactNode } from 'react';
import { GridBeam } from '@/components/ui/grid-beam';
import { BorderBeam } from '@/components/ui/border-beam';
import { Simbolo } from './marca';

/**
 * Chamada final (v2): planta com a grade de feixes (Grid Beam, 21st 18024) e um
 * cartão de vidro com borda acesa (Border Beam, 21st 1268). Título expandido
 * grande e as ações à direita.
 */
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
    <section className="planta relative isolate overflow-hidden py-16 md:py-24">
      <GridBeam rows={3} cols={6} className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_50%,black_35%,transparent_80%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[min(900px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(29_27_154/0.7),transparent)] blur-2xl"
      />
      <div className="container">
        <div className="vidro-escuro relative grid items-end gap-8 overflow-hidden rounded-[32px] p-7 sm:p-10 md:grid-cols-[minmax(0,1.3fr)_auto] md:p-14">
          <BorderBeam size={260} duration={10} />
          <Simbolo className="pointer-events-none absolute -right-16 -top-10 h-[300px] w-[300px] text-white/[0.04]" />
          <div className="relative min-w-0">
            <p className="etiqueta etiqueta--escura etiqueta--ambar m-0">{rotulo}</p>
            <h2 className="titulo m-0 mt-5 max-w-[20ch] text-[clamp(1.85rem,4.4vw,3.4rem)] text-white">{titulo}</h2>
            {texto && <p className="m-0 mt-5 max-w-[54ch] text-[1.04rem] leading-relaxed text-cinza-escuro">{texto}</p>}
          </div>
          <div className="relative flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
