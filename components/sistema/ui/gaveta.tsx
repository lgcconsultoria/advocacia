'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Gaveta lateral (sheet) sobre Radix Dialog: foco preso, Esc fecha, título
 * anunciado. Usada no menu do celular, no detalhe do lead e nas notificações.
 */
export function Gaveta({
  aberta,
  aoMudar,
  titulo,
  descricao,
  lado = 'direita',
  largura = 'max-w-[440px]',
  children,
  rodape,
  semCabecalho,
  className,
}: {
  aberta: boolean;
  aoMudar: (v: boolean) => void;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  lado?: 'direita' | 'esquerda';
  largura?: string;
  children: React.ReactNode;
  rodape?: React.ReactNode;
  semCabecalho?: boolean;
  className?: string;
}) {
  const dir = lado === 'direita' ? 1 : -1;
  return (
    <Dialog.Root open={aberta} onOpenChange={aoMudar}>
      <AnimatePresence>
        {aberta && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-(--s-overlay) backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={descricao ? undefined : undefined}>
              <motion.div
                className={cn(
                  'fixed inset-y-0 z-[61] flex w-full flex-col bg-(--s-bg-2) text-(--s-fg) shadow-(--s-shadow) ring-1 ring-(--s-border) outline-none',
                  lado === 'direita' ? 'right-0' : 'left-0',
                  largura,
                  className,
                )}
                initial={{ x: `${dir * 100}%` }}
                animate={{ x: 0 }}
                exit={{ x: `${dir * 100}%` }}
                transition={{ type: 'spring', stiffness: 420, damping: 40, mass: 0.9 }}
              >
                <div className={cn('flex items-start justify-between gap-3 border-b border-(--s-border) px-5 py-4', semCabecalho && 'sr-only')}>
                  <div className="grid min-w-0 gap-1">
                    <Dialog.Title className="text-[15px] font-semibold tracking-[-0.01em]">{titulo}</Dialog.Title>
                    {descricao ? (
                      <Dialog.Description className="text-[12.5px] text-(--s-muted)">{descricao}</Dialog.Description>
                    ) : (
                      <Dialog.Description className="sr-only">Painel lateral</Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close
                    aria-label="Fechar"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-(--s-muted) transition-colors hover:bg-(--s-accent) hover:text-(--s-fg)"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>
                <div className="rolagem min-h-0 flex-1 overflow-y-auto">{children}</div>
                {rodape && <div className="border-t border-(--s-border) px-5 py-3">{rodape}</div>}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
