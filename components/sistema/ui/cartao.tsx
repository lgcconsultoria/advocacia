import * as React from 'react';
import { cn } from '@/lib/utils';

export function Cartao({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative rounded-2xl bg-(--s-card) text-(--s-fg) ring-1 ring-(--s-border)', className)}
      {...props}
    />
  );
}

export function CabecalhoCartao({
  titulo,
  subtitulo,
  acoes,
  icone,
  className,
  nivel = 2,
}: {
  titulo: React.ReactNode;
  subtitulo?: React.ReactNode;
  acoes?: React.ReactNode;
  icone?: React.ReactNode;
  className?: string;
  nivel?: 2 | 3;
}) {
  const H = nivel === 2 ? 'h2' : 'h3';
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-4', className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {icone && <span className="mt-0.5 text-(--s-primary) [&_svg]:size-4">{icone}</span>}
        <div className="grid min-w-0 gap-0.5">
          <H className="truncate text-[14px] font-semibold tracking-[-0.01em]">{titulo}</H>
          {subtitulo && <p className="text-[12px] text-(--s-muted)">{subtitulo}</p>}
        </div>
      </div>
      {acoes && <div className="flex shrink-0 items-center gap-1.5">{acoes}</div>}
    </div>
  );
}
