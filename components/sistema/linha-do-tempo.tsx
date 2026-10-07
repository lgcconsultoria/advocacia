'use client';

/* Linha do tempo de andamentos — porte do Activity Timeline (21st.dev 35051,
   @kuratlielia): feed vertical agrupado por dia, rótulo do dia fixo ao rolar,
   a linha se desenha ao aparecer, linhas com detalhe
   expandem no lugar e as setas ↑↓ andam entre elas. */

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { dataLonga, hora } from '@/lib/demo/formato';

export type EventoLinha = {
  id: string;
  data: Date;
  ator?: string;
  titulo: React.ReactNode;
  meta?: React.ReactNode;
  detalhe?: React.ReactNode;
  icone?: React.ReactNode;
  tom?: 'neutro' | 'marca' | 'ok' | 'perigo' | 'ambar';
};

const TOM: Record<NonNullable<EventoLinha['tom']>, string> = {
  neutro: 'bg-(--s-elev) text-(--s-muted) ring-(--s-border-2)',
  marca: 'bg-(--s-primary)/18 text-(--s-primary) ring-(--s-primary)/40',
  ok: 'bg-(--s-ok)/16 text-(--s-ok) ring-(--s-ok)/40',
  perigo: 'bg-(--s-danger)/16 text-(--s-danger) ring-(--s-danger)/40',
  ambar: 'bg-(--s-amber)/16 text-(--s-amber) ring-(--s-amber)/40',
};

function rotuloDia(d: Date, agora: Date) {
  const n = differenceInCalendarDays(agora, d);
  if (n === 0) return 'Hoje';
  if (n === 1) return 'Ontem';
  const s = dataLonga(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function LinhaDoTempo({
  eventos,
  agora,
  rotulo,
  alturaMax,
  compacta,
  fundoRotulo = 'bg-(--s-card)',
  className,
}: {
  eventos: EventoLinha[];
  agora: Date;
  rotulo: string;
  alturaMax?: number | string;
  compacta?: boolean;
  fundoRotulo?: string;
  className?: string;
}) {
  const [abertos, setAbertos] = React.useState<Set<string>>(new Set());
  const raiz = React.useRef<HTMLDivElement>(null);

  const grupos = React.useMemo(() => {
    const ord = [...eventos].sort((a, b) => b.data.getTime() - a.data.getTime());
    const g: { chave: string; rotulo: string; itens: EventoLinha[] }[] = [];
    for (const e of ord) {
      const chave = e.data.toDateString();
      const atual = g.find((x) => x.chave === chave);
      if (atual) atual.itens.push(e);
      else g.push({ chave, rotulo: rotuloDia(e.data, agora), itens: [e] });
    }
    return g;
  }, [eventos, agora]);

  const alternar = (id: string) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const linhas = Array.from(raiz.current?.querySelectorAll<HTMLElement>('[data-linha]') ?? []);
    const i = linhas.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    linhas[Math.max(0, Math.min(linhas.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]?.focus();
  };

  return (
    <div
      ref={raiz}
      role="feed"
      aria-label={rotulo}
      onKeyDown={aoTeclar}
      className={cn('rolagem relative', alturaMax !== undefined && 'overflow-y-auto overscroll-contain', className)}
      style={alturaMax !== undefined ? { maxHeight: alturaMax } : undefined}
    >
      {grupos.map((g) => (
        <section key={g.chave} aria-label={g.rotulo} className="relative">
          <h3 className={cn('f-mono sticky top-0 z-10 flex items-center gap-2 py-1.5 text-[10.5px] tracking-[0.12em] text-(--s-faint) uppercase', fundoRotulo)}>
            {g.rotulo}
            <span className="rounded-full bg-(--s-elev) px-1.5 text-[10px] tracking-normal text-(--s-muted) tabular-nums">{g.itens.length}</span>
          </h3>
          <ol className="relative">
            {g.itens.map((e, i) => {
              const aberto = abertos.has(e.id);
              const ultimo = i === g.itens.length - 1;
              const Gatilho = e.detalhe ? 'button' : 'div';
              return (
                <motion.li
                  key={e.id}
                  className="relative grid grid-cols-[28px_1fr] gap-x-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: Math.min(i, 6) * 0.05 }}
                >
                  <div className="relative flex justify-center">
                    <motion.span
                      className={cn('relative z-[1] mt-2 grid size-7 place-items-center rounded-full ring-1 ring-inset [&_svg]:size-3.5', TOM[e.tom ?? 'neutro'])}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22, delay: Math.min(i, 6) * 0.05 }}
                    >
                      {e.icone ?? <span className="size-1.5 rounded-full bg-current" />}
                    </motion.span>
                    {!ultimo && (
                      <motion.span
                        aria-hidden
                        className="absolute top-9 -bottom-2 w-px origin-top bg-(--s-border-2)"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.45, delay: 0.1 + Math.min(i, 6) * 0.05 }}
                      />
                    )}
                  </div>
                  <div className={cn('min-w-0', compacta ? 'pb-2' : 'pb-3')}>
                    <Gatilho
                      data-linha=""
                      {...(e.detalhe ? { type: 'button' as const, 'aria-expanded': aberto, onClick: () => alternar(e.id) } : { tabIndex: 0 })}
                      className={cn(
                        'flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors focus-visible:outline-offset-0',
                        e.detalhe && 'cursor-pointer hover:bg-(--s-accent)/60',
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-snug text-(--s-fg-2)">
                          {e.ator && <span className="font-medium text-(--s-fg)">{e.ator} </span>}
                          {e.titulo}
                        </span>
                        {e.meta && <span className="mt-0.5 block truncate text-[11.5px] text-(--s-faint)">{e.meta}</span>}
                      </span>
                      <time dateTime={e.data.toISOString()} className="f-mono mt-0.5 shrink-0 text-[11px] text-(--s-faint) tabular-nums">
                        {hora(e.data)}
                      </time>
                      {e.detalhe && <ChevronDown className={cn('mt-0.5 size-3.5 shrink-0 text-(--s-faint) transition-transform', aberto && 'rotate-180')} aria-hidden />}
                    </Gatilho>
                    <AnimatePresence initial={false}>
                      {aberto && e.detalhe && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 36 }} className="overflow-hidden">
                          <div className="mx-2 mt-1 mb-1 rounded-lg bg-(--s-card-2) p-3 text-[12.5px] leading-relaxed text-(--s-fg-2) ring-1 ring-inset ring-(--s-border)">{e.detalhe}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
