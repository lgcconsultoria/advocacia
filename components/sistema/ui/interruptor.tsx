'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/** Switch acessível (role="switch"); só interface — nada é salvo. */
export function Interruptor({
  ligado,
  aoMudar,
  rotulo,
  className,
  tamanho = 'md',
  id,
}: {
  ligado: boolean;
  aoMudar: (v: boolean) => void;
  rotulo: string;
  className?: string;
  tamanho?: 'sm' | 'md';
  id?: string;
}) {
  const sm = tamanho === 'sm';
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => aoMudar(!ligado)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
        sm ? 'h-5 w-9' : 'h-6 w-11',
        ligado ? 'bg-(--s-primary)' : 'bg-(--s-elev) ring-1 ring-inset ring-(--s-border-2)',
        className,
      )}
    >
      <motion.span
        aria-hidden
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 36 }}
        className={cn(
          'block rounded-full shadow-sm',
          sm ? 'size-4' : 'size-5',
          ligado ? 'ml-auto bg-(--s-primary-fg)' : 'bg-(--s-fg-2)',
        )}
      />
    </button>
  );
}
