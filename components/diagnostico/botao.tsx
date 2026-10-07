'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { Interesse } from '@/lib/contato/enviar-lead';
import { buttonVariants, type ButtonSize, type ButtonVariant } from '@/components/ui/button';
import { useDiagnostico } from './contexto';

/**
 * Botão "Diagnóstico": abre o modal com o assunto da página. Sem JavaScript
 * (ou fora do provedor) é um link comum para /diagnostico.
 */
export function BotaoDiagnostico({
  interesse,
  children = 'Fazer diagnóstico',
  variant = 'marca',
  size = 'lg',
  block,
  className,
  semEstilo = false,
}: {
  interesse?: Interesse;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  /** Só o comportamento (para links de texto e itens de menu). */
  semEstilo?: boolean;
}) {
  const ctx = useDiagnostico();
  const href = interesse ? `/diagnostico?interesse=${interesse}` : '/diagnostico';
  return (
    <a
      href={href}
      className={semEstilo ? className : buttonVariants({ variant, size, block, className })}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (!ctx || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        ctx.abrir(interesse);
      }}
      aria-haspopup="dialog"
    >
      {children}
    </a>
  );
}
