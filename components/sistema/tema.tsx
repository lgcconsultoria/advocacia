'use client';

import * as React from 'react';
import { MotionConfig } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tema = 'tinta' | 'papel';

const CHAVE = 's360:tema';

type Ctx = { tema: Tema; definir: (t: Tema) => void; alternar: () => void };
const TemaContext = React.createContext<Ctx>({ tema: 'tinta', definir: () => {}, alternar: () => {} });

export const useTema = () => React.useContext(TemaContext);

function lerTema(): Tema | null {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === 'papel' || v === 'tinta' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Raiz da área logada: escopo de tokens (.s360), tema escuro por padrão com
 * alternância para o claro, e movimento que respeita "reduzir movimento".
 * O corpo da página também recebe .s360 enquanto a área estiver aberta, para
 * que diálogos e gavetas (renderizados em portal no <body>) herdem os tokens.
 */
export function RaizSistema({ children, className }: { children: React.ReactNode; className?: string }) {
  const [tema, setTema] = React.useState<Tema>('tinta');

  React.useEffect(() => {
    const salvo = lerTema();
    if (salvo) setTema(salvo);
  }, []);

  React.useEffect(() => {
    const body = document.body;
    body.classList.add('s360');
    body.dataset.tema = tema;
    return () => {
      body.classList.remove('s360');
      delete body.dataset.tema;
    };
  }, [tema]);

  const definir = React.useCallback((t: Tema) => {
    setTema(t);
    try {
      window.localStorage.setItem(CHAVE, t);
    } catch {
      /* navegação privada: o tema vale só nesta visita */
    }
  }, []);

  const valor = React.useMemo<Ctx>(
    () => ({ tema, definir, alternar: () => definir(tema === 'tinta' ? 'papel' : 'tinta') }),
    [tema, definir],
  );

  return (
    <TemaContext.Provider value={valor}>
      <MotionConfig reducedMotion="user">
        <div className={cn('s360 min-h-dvh', className)} data-tema={tema}>
          {children}
        </div>
      </MotionConfig>
    </TemaContext.Provider>
  );
}

export function BotaoTema({ className }: { className?: string }) {
  const { tema, alternar } = useTema();
  const claro = tema === 'papel';
  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={claro ? 'Usar tema escuro' : 'Usar tema claro'}
      title={claro ? 'Tema escuro' : 'Tema claro'}
      className={cn(
        'grid size-9 place-items-center rounded-lg text-(--s-muted) transition-colors hover:bg-(--s-accent) hover:text-(--s-fg)',
        className,
      )}
    >
      {claro ? <Moon className="size-[18px]" strokeWidth={1.6} /> : <Sun className="size-[18px]" strokeWidth={1.6} />}
    </button>
  );
}
