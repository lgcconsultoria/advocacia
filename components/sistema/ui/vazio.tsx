import * as React from 'react';
import { cn } from '@/lib/utils';

/** Estado vazio (inspirado no Empty State Kit 27024): ícone em linha, frase curta, ação opcional. */
export function EstadoVazio({ icone, titulo, texto, acao, className }: { icone: React.ReactNode; titulo: string; texto?: string; acao?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-12 text-center', className)}>
      <span className="grid size-11 place-items-center rounded-xl bg-(--s-accent) text-(--s-primary) ring-1 ring-inset ring-(--s-border) [&_svg]:size-5">{icone}</span>
      <p className="text-[13.5px] font-medium">{titulo}</p>
      {texto && <p className="max-w-xs text-[12.5px] text-(--s-muted)">{texto}</p>}
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}

export function Esqueleto({ className }: { className?: string }) {
  return <div aria-hidden className={cn('esqueleto rounded-xl', className)} />;
}

/** Esqueleto de tela inteira enquanto os dados da demonstração são gerados no navegador. */
export function EsqueletoTela() {
  return (
    <div className="grid gap-4" role="status" aria-label="Carregando demonstração">
      <Esqueleto className="h-8 w-56" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Esqueleto key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Esqueleto className="h-72 lg:col-span-2" />
        <Esqueleto className="h-72" />
      </div>
    </div>
  );
}
