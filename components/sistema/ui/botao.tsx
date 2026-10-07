import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Botão da área logada (cópia própria, independente de components/ui). */
export const botaoVariantes = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variante: {
        primario: 'bg-(--s-primary) text-(--s-primary-fg) shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:brightness-110',
        secundario: 'bg-(--s-card-2) text-(--s-fg) ring-1 ring-inset ring-(--s-border-2) hover:bg-(--s-elev)',
        fantasma: 'text-(--s-fg-2) hover:bg-(--s-accent) hover:text-(--s-fg)',
        ambar: 'bg-(--s-amber) text-[#1a1206] hover:brightness-110',
        perigo: 'bg-(--s-danger)/15 text-(--s-danger) ring-1 ring-inset ring-(--s-danger)/30 hover:bg-(--s-danger)/25',
        link: 'h-auto px-0 text-(--s-primary) underline-offset-4 hover:underline',
      },
      tamanho: {
        sm: 'h-8 px-3 text-[12.5px] [&_svg]:size-3.5',
        md: 'h-9 px-3.5 text-[13px] [&_svg]:size-4',
        lg: 'h-11 px-5 text-[14px] [&_svg]:size-4',
        icone: 'size-9 [&_svg]:size-[18px]',
        iconeSm: 'size-8 [&_svg]:size-4',
      },
    },
    defaultVariants: { variante: 'primario', tamanho: 'md' },
  },
);

export interface BotaoProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof botaoVariantes> {
  asChild?: boolean;
}

export const Botao = React.forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  { className, variante, tamanho, asChild = false, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(botaoVariantes({ variante, tamanho }), className)}
      {...props}
    />
  );
});
