'use client';

import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Diálogo animado — inspirado no 21st.dev `@rmahammad/animated-dialog` (id 26905).
 * Radix Dialog (foco preso, Esc fecha, título e descrição para leitor de tela)
 * com coreografia em motion: no celular vira folha que sobe da borda de baixo;
 * a partir de 640 px, cartão central que cresce com mola. Movimento reduzido:
 * só esmaecimento.
 */
export function Dialogo({
  aberto,
  onAbertoChange,
  titulo,
  descricao,
  children,
  className,
}: {
  aberto: boolean;
  onAbertoChange: (v: boolean) => void;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduzir = useReducedMotion();
  const [celular, setCelular] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const aplicar = () => setCelular(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  const painel = reduzir
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : celular
      ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
      : { initial: { opacity: 0, scale: 0.94, y: 12 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 8 } };

  return (
    <D.Root open={aberto} onOpenChange={onAbertoChange}>
      <AnimatePresence>
        {aberto && (
          <D.Portal forceMount>
            <D.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[120] bg-tinta/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              />
            </D.Overlay>
            <D.Content
              forceMount
              className="fixed inset-0 z-[121] flex items-end justify-center outline-none sm:items-center sm:p-6"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) onAbertoChange(false);
              }}
            >
              <motion.div
                {...painel}
                transition={reduzir ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }}
                className={cn(
                  'relative max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-white shadow-[0_-20px_80px_-20px_rgb(11_10_46/0.6)] sm:max-w-[520px] sm:rounded-[28px]',
                  className,
                )}
              >
                <span aria-hidden="true" className="mx-auto mt-2.5 block h-1.5 w-11 rounded-full bg-papel-2 sm:hidden" />
                <D.Title className="sr-only">{titulo}</D.Title>
                {descricao ? <D.Description className="sr-only">{descricao}</D.Description> : null}
                <D.Close
                  className="absolute right-3.5 top-3.5 z-10 grid h-10 w-10 place-items-center rounded-full bg-papel text-grafite transition-colors hover:bg-papel-2"
                  aria-label="Fechar"
                >
                  <X className="h-[18px] w-[18px]" aria-hidden="true" />
                </D.Close>
                {children}
              </motion.div>
            </D.Content>
          </D.Portal>
        )}
      </AnimatePresence>
    </D.Root>
  );
}
