import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AreaIcon } from '@/components/area-icon';
import { cn } from '@/lib/utils';

/** Cartão de área de atuação (v2): ícone em vidro, número em mono, brilho no hover. */
export function AreaCard({
  area,
  n,
  className,
}: {
  area: { slug: string; title: string; summary: string; icon: string };
  n?: number;
  className?: string;
}) {
  return (
    <Link href={`/areas/${area.slug}`} className={cn('card card-link group flex flex-col overflow-hidden no-underline', className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.3),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="flex items-start justify-between gap-4">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(142_139_255/0.18),rgb(29_27_154/0.08))] text-marca ring-1 ring-inset ring-marca/10 transition-colors group-hover:bg-marca group-hover:text-white [&_svg]:h-6 [&_svg]:w-6"
          aria-hidden="true"
        >
          <AreaIcon icon={area.icon} />
        </span>
        {n !== undefined && <span className="rotulo num text-[10px] text-cinza">{String(n).padStart(2, '0')}</span>}
      </span>
      <h3 className="semi m-0 mt-6 text-[1.2rem] font-[720] leading-tight tracking-[-0.012em] text-grafite">{area.title}</h3>
      <p className="m-0 mt-2 text-[0.95rem] leading-relaxed text-cinza">{area.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-[0.9rem] font-[650] text-marca">
        Ver área <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
