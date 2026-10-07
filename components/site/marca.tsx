import { cn } from '@/lib/utils';

/** Símbolo DS em máscara: herda a cor do texto (currentColor). */
export function Simbolo({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('simbolo-mask inline-block shrink-0', className)} />;
}

/** Assinatura da marca: símbolo + nome em caixa expandida, como na proposta. */
export function Assinatura({
  className,
  tamanho = 'md',
}: {
  className?: string;
  tamanho?: 'md' | 'lg';
}) {
  const lg = tamanho === 'lg';
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <Simbolo className={lg ? 'h-11 w-11' : 'h-8 w-8'} />
      <span className="leading-tight">
        <span
          className={cn(
            'expandida block font-[650] tracking-[0.08em] uppercase',
            lg ? 'text-[15px]' : 'text-[12.5px]'
          )}
        >
          Douglas Senturião
        </span>
        <span className={cn('rotulo block opacity-70', lg ? 'text-[10.5px]' : 'text-[9.5px]')}>
          Advocacia
        </span>
      </span>
    </span>
  );
}
