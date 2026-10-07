import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Seção da página (v2). `escura` vira "planta" (tinta + tokens escuros, com um
 * brilho azul ao fundo); `grade` acrescenta a grade de planta.
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
      className={cn('relative isolate py-20 md:py-32', escura && 'planta overflow-hidden', className)}
    >
      {escura && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(29_27_154/0.55),transparent)] blur-2xl"
        />
      )}
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
 * Cabeçalho de seção (v2): etiqueta em pílula (número + rótulo), título
 * expandido grande e texto de apoio. `centro` centraliza tudo.
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
  centro = false,
}: {
  n?: number | string;
  rotulo: string;
  titulo: ReactNode;
  children?: ReactNode;
  escura?: boolean;
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
  centro?: boolean;
}) {
  return (
    <header className={cn('max-w-[920px]', centro && 'mx-auto text-center', className)}>
      <p className={cn('etiqueta m-0', escura && 'etiqueta--escura')}>
        {n !== undefined && (
          <span className="num opacity-70">{typeof n === 'number' ? String(n).padStart(2, '0') : n}</span>
        )}
        {rotulo}
      </p>
      <Titulo
        id={id}
        className={cn(
          'titulo m-0 mt-5 text-[clamp(2rem,5vw,3.9rem)]',
          escura ? 'text-white' : 'text-grafite'
        )}
      >
        {titulo}
      </Titulo>
      {children && (
        <div
          className={cn(
            'mt-6 max-w-[62ch] text-[1.06rem] leading-relaxed',
            centro && 'mx-auto',
            escura ? 'text-cinza-escuro' : 'text-cinza'
          )}
        >
          {children}
        </div>
      )}
    </header>
  );
}
