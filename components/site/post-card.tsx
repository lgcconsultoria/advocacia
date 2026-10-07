import Link from 'next/link';
import { cn } from '@/lib/utils';

export type PostResumo = {
  slug: string;
  title: string;
  area: string;
  description: string;
  readingTime: string;
};

/** Cartão de artigo: rótulo da área, título expandido e meta em mono. */
export function PostCard({ post, className }: { post: PostResumo; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn('card card-link group flex flex-col no-underline sm:p-8', className)}
    >
      <span className="rotulo text-[10.5px] text-marca">{post.area}</span>
      <h3 className="semi m-0 mt-4 text-[1.28rem] font-[720] leading-[1.18] tracking-[-0.015em] text-grafite group-hover:text-marca">
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
