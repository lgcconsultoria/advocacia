import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const seloVariantes = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 [&_svg]:size-3',
  {
    variants: {
      tom: {
        neutro: 'bg-(--s-elev) text-(--s-fg-2)',
        marca: 'bg-(--s-primary)/14 text-(--s-primary)',
        ambar: 'bg-(--s-amber)/16 text-(--s-amber)',
        perigo: 'bg-(--s-danger)/15 text-(--s-danger)',
        ok: 'bg-(--s-ok)/15 text-(--s-ok)',
        contorno: 'ring-1 ring-inset ring-(--s-border-2) text-(--s-muted)',
        solido: 'bg-(--s-primary) text-(--s-primary-fg)',
      },
    },
    defaultVariants: { tom: 'neutro' },
  },
);

export interface SeloProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof seloVariantes> {}

export function Selo({ className, tom, ...props }: SeloProps) {
  return <span className={cn(seloVariantes({ tom }), className)} {...props} />;
}

/** Bolinha de status com rótulo para leitor de tela. */
export function Ponto({ tom = 'marca', pulsar, className, rotulo }: { tom?: 'marca' | 'ambar' | 'perigo' | 'ok' | 'neutro'; pulsar?: boolean; className?: string; rotulo?: string }) {
  const cor = {
    marca: 'bg-(--s-primary)',
    ambar: 'bg-(--s-amber)',
    perigo: 'bg-(--s-danger)',
    ok: 'bg-(--s-ok)',
    neutro: 'bg-(--s-faint)',
  }[tom];
  return (
    <span className={cn('relative inline-flex size-2 shrink-0', className)}>
      {pulsar && <span aria-hidden className={cn('pulso absolute inset-0 rounded-full opacity-60 blur-[3px]', cor)} />}
      <span aria-hidden className={cn('relative size-2 rounded-full', cor)} />
      {rotulo && <span className="sr-only">{rotulo}</span>}
    </span>
  );
}
