import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PostResumo = {
  slug: string;
  title: string;
  area: string;
  description: string;
  readingTime: string;
};

/** Cartão de artigo (v2): etiqueta da área, título expandido, seta que acende no hover. */
export function PostCard({ post, className }: { post: PostResumo; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn('card card-link group flex flex-col overflow-hidden no-underline sm:p-8', className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.28),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="flex items-start justify-between gap-4">
        <span className="etiqueta">{post.area}</span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-papel-2 text-marca transition-all duration-300 group-hover:rotate-45 group-hover:border-marca group-hover:bg-marca group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </span>
      <h3 className="semi m-0 mt-6 text-[1.3rem] font-[720] leading-[1.16] tracking-[-0.018em] text-grafite group-hover:text-marca">
        {post.title}
      </h3>
      <p className="m-0 mt-3 text-[0.96rem] leading-relaxed text-cinza">{post.description}</p>
      <span className="rotulo mt-auto flex flex-wrap gap-x-2 pt-6 text-[10px] text-cinza">
        <span>Análise técnica</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime}</span>
      </span>
    </Link>
  );
}
