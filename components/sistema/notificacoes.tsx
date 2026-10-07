'use client';

/* Central de alertas (sino) — porte do Notification Panel (21st.dev 27135,
   @uvain): a notificação é uma frase; o tipo vai no selo do avatar; abas por
   tipo; "marcar todas como lidas"; Esc e clique fora fecham. */

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bell, BriefcaseBusiness, CalendarClock, CheckCheck, Cpu, MessageCircle, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notificacao, TipoNotificacao } from '@/lib/demo/dados';
import { relativo } from '@/lib/demo/formato';
import { differenceInCalendarDays } from 'date-fns';

const ICONE: Record<TipoNotificacao, React.ComponentType<{ className?: string }>> = {
  publicacao: Newspaper,
  prazo: CalendarClock,
  whatsapp: MessageCircle,
  lead: BriefcaseBusiness,
  sistema: Cpu,
};

const TOM: Record<TipoNotificacao, string> = {
  publicacao: 'bg-(--s-primary) text-(--s-primary-fg)',
  prazo: 'bg-(--s-danger) text-white',
  whatsapp: 'bg-(--s-ok) text-[#06281a]',
  lead: 'bg-(--s-amber) text-[#1a1206]',
  sistema: 'bg-(--s-faint) text-white',
};

type Aba = 'todas' | 'publicacao' | 'prazo' | 'whatsapp';
const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'publicacao', rotulo: 'DJEN' },
  { id: 'prazo', rotulo: 'Prazos' },
  { id: 'whatsapp', rotulo: 'WhatsApp' },
];

function Linha({ n, agora, aoAbrir }: { n: Notificacao; agora: Date; aoAbrir: () => void }) {
  const Icone = ICONE[n.tipo];
  const conteudo = (
    <>
      <span className="relative mt-0.5 block size-8 shrink-0">
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-(--s-elev) text-[10.5px] font-semibold text-(--s-fg-2) ring-1 ring-inset ring-(--s-border)">
          {n.ator.slice(0, 2).toUpperCase()}
        </span>
        <span aria-hidden className={cn('absolute -right-0.5 -bottom-0.5 grid size-[16px] place-items-center rounded-full ring-2 ring-(--s-bg-2)', TOM[n.tipo])}>
          <Icone className="size-[9px]" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-[1.45] text-(--s-fg-2)">
          <span className="font-medium text-(--s-fg)">{n.ator}</span>{' '}
          {n.frase.map((t, i) => (typeof t === 'string' ? <React.Fragment key={i}>{t}</React.Fragment> : <span key={i} className="font-medium text-(--s-fg)">{t.destaque}</span>))}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-(--s-faint)">
          <span>{relativo(n.quando, agora)}</span>
          {n.contexto && (
            <>
              <span aria-hidden>·</span>
              <span className="f-mono truncate text-[11px]">{n.contexto}</span>
            </>
          )}
        </span>
      </span>
      {!n.lida ? <span aria-label="Não lida" className="mt-2 size-[7px] shrink-0 rounded-full bg-(--s-primary)" /> : <span className="size-[7px] shrink-0" />}
    </>
  );
  const cls = cn(
    'flex w-full gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-offset-[-2px]',
    !n.lida ? 'bg-(--s-primary)/6 hover:bg-(--s-primary)/10' : 'hover:bg-(--s-accent)',
  );
  return n.href ? (
    <Link href={n.href} onClick={aoAbrir} className={cls}>
      {conteudo}
    </Link>
  ) : (
    <button type="button" onClick={aoAbrir} className={cls}>
      {conteudo}
    </button>
  );
}

export function PainelNotificacoes({
  aberto,
  aoMudar,
  itens,
  aoMudarItens,
  agora,
  ancora,
}: {
  aberto: boolean;
  aoMudar: (v: boolean) => void;
  itens: Notificacao[];
  aoMudarItens: (n: Notificacao[]) => void;
  agora: Date;
  ancora: React.RefObject<HTMLElement | null>;
}) {
  const reduzido = useReducedMotion();
  const [aba, setAba] = React.useState<Aba>('todas');
  const painel = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!painel.current?.contains(t) && !ancora.current?.contains(t)) aoMudar(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        aoMudar(false);
        ancora.current?.focus();
      }
    };
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', esc);
    painel.current?.focus();
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto, aoMudar, ancora]);

  const visiveis = itens.filter((n) => aba === 'todas' || n.tipo === aba);
  const naoLidas = itens.filter((n) => !n.lida).length;
  const grupos = React.useMemo(() => {
    const g: { rotulo: string; itens: Notificacao[] }[] = [];
    for (const n of [...visiveis].sort((a, b) => b.quando.getTime() - a.quando.getTime())) {
      const dd = differenceInCalendarDays(agora, n.quando);
      const rotulo = dd === 0 ? 'Hoje' : dd === 1 ? 'Ontem' : 'Anteriores';
      const atual = g.find((x) => x.rotulo === rotulo);
      if (atual) atual.itens.push(n);
      else g.push({ rotulo, itens: [n] });
    }
    return g;
  }, [visiveis, agora]);

  const marcar = (id: string) => aoMudarItens(itens.map((n) => (n.id === id ? { ...n, lida: true } : n)));

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          ref={painel}
          tabIndex={-1}
          role="dialog"
          aria-label="Notificações"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="fixed top-[calc(var(--s-topo,96px)+4px)] right-3 z-[55] w-[min(420px,calc(100vw-24px))] origin-top-right overflow-hidden rounded-2xl bg-(--s-bg-2) text-(--s-fg) shadow-(--s-shadow) ring-1 ring-(--s-border-2) outline-none sm:right-6"
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-1">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Notificações</h2>
            <button
              type="button"
              onClick={() => aoMudarItens(itens.map((n) => ({ ...n, lida: true })))}
              disabled={naoLidas === 0}
              className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12.5px] font-medium text-(--s-muted) transition-colors hover:text-(--s-fg) disabled:pointer-events-none disabled:opacity-40"
            >
              <CheckCheck className="size-3.5" aria-hidden /> Marcar todas como lidas
            </button>
          </div>
          <div role="tablist" aria-label="Filtrar notificações" className="sem-rolagem flex items-center gap-0.5 overflow-x-auto border-b border-(--s-border) px-3">
            {ABAS.map((a) => {
              const ativa = a.id === aba;
              const qtd = itens.filter((n) => !n.lida && (a.id === 'todas' || n.tipo === a.id)).length;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={ativa}
                  type="button"
                  onClick={() => setAba(a.id)}
                  className={cn('relative shrink-0 px-2 py-2.5 text-[13px] font-medium transition-colors', ativa ? 'text-(--s-fg)' : 'text-(--s-muted) hover:text-(--s-fg-2)')}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {a.rotulo}
                    {qtd > 0 && <span className="rounded-full bg-(--s-primary) px-1.5 py-px text-[10.5px] font-semibold text-(--s-primary-fg)">{qtd}</span>}
                  </span>
                  {ativa && <motion.span layoutId="notif-aba" transition={reduzido ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-x-1.5 -bottom-px h-[2px] rounded-full bg-(--s-primary)" />}
                </button>
              );
            })}
          </div>
          <div className="rolagem max-h-[min(460px,65dvh)] overflow-y-auto">
            {grupos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="grid size-10 place-items-center rounded-xl bg-(--s-accent) text-(--s-primary)">
                  <Bell className="size-[18px]" />
                </span>
                <p className="text-[13px] font-medium">Tudo em dia</p>
                <p className="text-[12.5px] text-(--s-muted)">Novas publicações e prazos aparecem aqui.</p>
              </div>
            ) : (
              grupos.map((g) => (
                <section key={g.rotulo} aria-label={g.rotulo}>
                  <h3 className="f-mono sticky top-0 z-10 bg-(--s-bg-2)/95 px-4 py-1.5 text-[10px] tracking-[0.14em] text-(--s-faint) uppercase backdrop-blur">{g.rotulo}</h3>
                  <ul className="divide-y divide-(--s-border)">
                    {g.itens.map((n) => (
                      <li key={n.id}>
                        <Linha n={n} agora={agora} aoAbrir={() => { marcar(n.id); if (n.href) aoMudar(false); }} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
          <div className="border-t border-(--s-border) px-4 py-2.5 text-[11.5px] text-(--s-faint)">
            Avisos de WhatsApp saem pela Iris — veja as regras em{' '}
            <Link href="/sistema/demo/alertas" onClick={() => aoMudar(false)} className="text-(--s-primary) underline-offset-4 hover:underline">
              Alertas
            </Link>
            .
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
