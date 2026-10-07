'use client';

/* Calendário mensal — porte do Calendar (21st.dev 31350, @wensity), com
   lucide no lugar de @tabler: seleção de dia, pontos de evento, navegação
   animada entre meses e setas do teclado entre os dias (tabindex móvel). */

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, addMonths, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { mesAno } from '@/lib/demo/formato';

export type MarcaDia = { data: Date; tom: 'ambar' | 'marca' | 'perigo'; rotulo: string };

const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TOM = { ambar: 'bg-(--s-amber)', marca: 'bg-(--s-primary)', perigo: 'bg-(--s-danger)' };

function grade(mes: Date) {
  const ini = startOfWeek(startOfMonth(mes), { weekStartsOn: 0 });
  return Array.from({ length: 42 }, (_, i) => addDays(ini, i));
}

export function Calendario({
  hoje,
  selecionado,
  aoSelecionar,
  marcas,
  className,
}: {
  hoje: Date;
  selecionado?: Date;
  aoSelecionar: (d: Date | undefined) => void;
  marcas: MarcaDia[];
  className?: string;
}) {
  const [mes, setMes] = React.useState(() => startOfMonth(selecionado ?? hoje));
  const [direcao, setDirecao] = React.useState(0);
  const [foco, setFoco] = React.useState<Date>(selecionado ?? hoje);
  const celulas = React.useRef(new Map<string, HTMLButtonElement>());
  const querFoco = React.useRef(false);

  const dias = grade(mes);
  const irMes = (n: number) => {
    setDirecao(n);
    setMes((m) => addMonths(m, n));
    setFoco((f) => addMonths(f, n));
  };

  React.useEffect(() => {
    if (!querFoco.current) return;
    querFoco.current = false;
    celulas.current.get(foco.toDateString())?.focus();
  }, [foco, mes]);

  const mover = (e: React.KeyboardEvent, d: Date) => {
    const passos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in passos)) return;
    e.preventDefault();
    const novo = addDays(d, passos[e.key]);
    querFoco.current = true;
    if (!isSameMonth(novo, mes)) {
      setDirecao(novo > d ? 1 : -1);
      setMes(startOfMonth(novo));
    }
    setFoco(novo);
  };

  const titulo = mesAno(mes);

  return (
    <div className={cn('select-none', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold capitalize" aria-live="polite">
          {titulo}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setDirecao(0);
              setMes(startOfMonth(hoje));
              setFoco(hoje);
            }}
            className="h-8 rounded-lg px-2.5 text-[12px] text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg)"
          >
            Hoje
          </button>
          <button type="button" aria-label="Mês anterior" onClick={() => irMes(-1)} className="grid size-8 place-items-center rounded-lg text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg)">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Próximo mês" onClick={() => irMes(1)} className="grid size-8 place-items-center rounded-lg text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg)">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div role="grid" aria-label={`Calendário de ${titulo}`} className="overflow-hidden">
        <div role="row" className="grid grid-cols-7">
          {SEMANA.map((s) => (
            <span role="columnheader" key={s} className="f-mono py-1.5 text-center text-[10.5px] tracking-[0.08em] text-(--s-faint) uppercase">
              {s}
            </span>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={false} custom={direcao}>
          <motion.div
            key={mes.toISOString()}
            custom={direcao}
            initial={{ opacity: 0, x: direcao * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direcao * -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-7 gap-1"
          >
            {dias.map((d) => {
              const doMes = isSameMonth(d, mes);
              const eHoje = isSameDay(d, hoje);
              const sel = selecionado && isSameDay(d, selecionado);
              const ms = marcas.filter((m) => isSameDay(m.data, d));
              const focavel = isSameDay(d, foco);
              return (
                <button
                  key={d.toISOString()}
                  ref={(el) => {
                    if (el) celulas.current.set(d.toDateString(), el);
                    else celulas.current.delete(d.toDateString());
                  }}
                  type="button"
                  role="gridcell"
                  tabIndex={focavel ? 0 : -1}
                  aria-selected={!!sel}
                  aria-current={eHoje ? 'date' : undefined}
                  aria-label={`${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}${ms.length ? `, ${ms.length} compromisso${ms.length > 1 ? 's' : ''}: ${ms.map((m) => m.rotulo).join('; ')}` : ''}`}
                  onClick={() => {
                    setFoco(d);
                    aoSelecionar(sel ? undefined : d);
                  }}
                  onKeyDown={(e) => mover(e, d)}
                  className={cn(
                    'relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-xl text-[13px] tabular-nums transition-colors sm:aspect-[1.15]',
                    !doMes && 'text-(--s-faint)/60',
                    doMes && !sel && 'hover:bg-(--s-accent)',
                    eHoje && !sel && 'font-semibold text-(--s-primary) ring-1 ring-inset ring-(--s-primary)/50',
                    sel && 'bg-(--s-primary) font-semibold text-(--s-primary-fg)',
                  )}
                >
                  {d.getDate()}
                  {ms.length > 0 && (
                    <span aria-hidden className="absolute bottom-1.5 flex gap-0.5">
                      {ms.slice(0, 3).map((m, i) => (
                        <span key={i} className={cn('size-1.5 rounded-full', sel ? 'bg-(--s-primary-fg)' : TOM[m.tom])} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-(--s-muted)">
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-(--s-danger)" /> Vence em até 1 dia</li>
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-(--s-amber)" /> Prazo</li>
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-(--s-primary)" /> Audiência / reunião</li>
      </ul>
    </div>
  );
}
