import Link from 'next/link';
import { AreaIcon } from '@/components/area-icon';
import { cn } from '@/lib/utils';

/** Cartão de área de atuação: ícone, número, título e resumo do CMS. */
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
    <Link href={`/areas/${area.slug}`} className={cn('card card-link group flex flex-col no-underline', className)}>
      <span className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-marca/[0.07] text-marca transition-colors group-hover:bg-marca group-hover:text-white [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true">
          <AreaIcon icon={area.icon} />
        </span>
        {n !== undefined && <span className="rotulo num text-[10px] text-cinza">{String(n).padStart(2, '0')}</span>}
      </span>
      <h3 className="semi m-0 mt-6 text-[1.18rem] font-[720] leading-tight tracking-[-0.01em] text-grafite">{area.title}</h3>
      <p className="m-0 mt-2 text-[0.95rem] leading-relaxed text-cinza">{area.summary}</p>
      <span className="link-seta mt-auto self-start pt-6 text-[0.9rem]">
        Ver área <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
