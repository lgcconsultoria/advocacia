import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Seção da página. `escura` vira "planta" (tinta + tokens claros); `grade`
 * acrescenta a grade de planta ao fundo.
 */
export function Secao({
  id,
  escura = false,
  grade = false,
  className,
  containerClassName,
  children,
  'aria-labelledby': labelledBy,
}: {
  id?: string;
  escura?: boolean;
  grade?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  'aria-labelledby'?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative isolate py-20 md:py-28', escura && 'planta overflow-hidden', className)}
    >
      {grade && <GradePlanta />}
      <div className={cn('container relative', containerClassName)}>{children}</div>
    </section>
  );
}

export function GradePlanta({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grade-planta pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_75%)]',
        className
      )}
    />
  );
}

/**
 * Cabeçalho numerado (as "cláusulas" da proposta): número + rótulo à esquerda,
 * título expandido e texto de apoio à direita.
 */
export function Cabecalho({
  n,
  rotulo,
  titulo,
  children,
  escura = false,
  id,
  as: Titulo = 'h2',
  className,
}: {
  n?: number | string;
  rotulo: string;
  titulo: ReactNode;
  children?: ReactNode;
  escura?: boolean;
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <header className={cn('grid gap-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10', className)}>
      <div className={cn('rotulo pt-2', escura ? 'text-sinal' : 'text-marca')}>
        {n !== undefined && <>{typeof n === 'number' ? String(n).padStart(2, '0') : n} — </>}
        <span className={cn(n !== undefined && 'mt-1 block', escura ? 'text-cinza-escuro' : 'text-cinza')}>
          {rotulo}
        </span>
      </div>
      <div className="min-w-0">
        <Titulo
          id={id}
          className="expandida m-0 text-[clamp(1.85rem,4.4vw,3.4rem)] font-[780] leading-[1.02] tracking-[-0.03em]"
        >
          {titulo}
        </Titulo>
        {children && (
          <div
            className={cn(
              'mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed',
              escura ? 'text-cinza-escuro' : 'text-cinza'
            )}
          >
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
