import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Select nativo estilizado (acessível de graça: teclado, leitor de tela, celular). */
export function Selecao({
  rotulo,
  valor,
  aoMudar,
  opcoes,
  className,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  opcoes: { valor: string; rotulo: string }[];
  className?: string;
}) {
  const ativo = valor !== '';
  return (
    <label className={cn('relative inline-flex', className)}>
      <span className="sr-only">{rotulo}</span>
      <select
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-lg bg-(--s-card) pr-8 pl-3 text-[13px] ring-1 ring-inset transition-colors focus:ring-2 focus:ring-(--s-ring) focus:outline-none',
          ativo ? 'text-(--s-fg) ring-(--s-primary)/50' : 'text-(--s-muted) ring-(--s-border)',
        )}
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor} className="bg-(--s-bg-2) text-(--s-fg)">
            {o.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-(--s-faint)" />
    </label>
  );
}
