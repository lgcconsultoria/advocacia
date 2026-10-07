'use client';

import * as React from 'react';
import { CalendarClock, FileSignature, Gavel, MessagesSquare, Newspaper, RefreshCw, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Selo } from './ui/selo';
import type { Andamento, Fase, Processo, TipoAndamento, TipoPrazo } from '@/lib/demo/dados';
import { FASES, rotuloFase } from '@/lib/demo/dados';
import { rotuloD, urgencia, type Urgencia } from '@/lib/demo/formato';
import type { EventoLinha } from './linha-do-tempo';

export const ICONE_ANDAMENTO: Record<TipoAndamento, React.ComponentType<{ className?: string }>> = {
  movimentacao: RefreshCw,
  publicacao: Newspaper,
  peticao: FileSignature,
  decisao: Gavel,
  audiencia: Users,
};

export const TOM_ANDAMENTO: Record<TipoAndamento, EventoLinha['tom']> = {
  movimentacao: 'neutro',
  publicacao: 'marca',
  peticao: 'ok',
  decisao: 'ambar',
  audiencia: 'marca',
};

export const ROTULO_TIPO_ANDAMENTO: Record<TipoAndamento, string> = {
  movimentacao: 'Movimentação',
  publicacao: 'Publicação',
  peticao: 'Petição do escritório',
  decisao: 'Decisão',
  audiencia: 'Audiência / perícia',
};

export const ICONE_PRAZO: Record<TipoPrazo, React.ComponentType<{ className?: string }>> = {
  prazo: CalendarClock,
  audiencia: Users,
  reuniao: MessagesSquare,
};

export function eventosDoProcesso(p: Processo, limite?: number): EventoLinha[] {
  return p.andamentos.slice(0, limite).map((a: Andamento) => {
    const Icone = ICONE_ANDAMENTO[a.tipo];
    return {
      id: a.id,
      data: a.data,
      titulo: a.titulo,
      meta: `${ROTULO_TIPO_ANDAMENTO[a.tipo]} · fonte: ${a.fonte}`,
      detalhe: a.descricao,
      icone: <Icone />,
      tom: TOM_ANDAMENTO[a.tipo],
    };
  });
}

const TOM_URGENCIA: Record<Urgencia, 'perigo' | 'ambar' | 'marca' | 'neutro'> = {
  vencido: 'perigo',
  critico: 'perigo',
  atencao: 'ambar',
  tranquilo: 'neutro',
};

export function SeloPrazo({ data, hoje, className }: { data: Date; hoje: Date; className?: string }) {
  const u = urgencia(data, hoje);
  return (
    <Selo tom={TOM_URGENCIA[u]} className={cn('f-mono tabular-nums', className)}>
      {rotuloD(data, hoje)}
    </Selo>
  );
}

export const corUrgencia = (u: Urgencia) =>
  ({ vencido: 'var(--s-danger)', critico: 'var(--s-danger)', atencao: 'var(--s-amber)', tranquilo: 'var(--s-primary)' })[u];

export function SeloSistema({ sistema, tribunal }: { sistema: string; tribunal?: string }) {
  return (
    <span className="f-mono inline-flex items-center gap-1 text-[11px] whitespace-nowrap text-(--s-muted)">
      {tribunal && <span className="text-(--s-fg-2)">{tribunal}</span>}
      {tribunal && <span aria-hidden className="text-(--s-faint)">·</span>}
      <span>{sistema}</span>
    </span>
  );
}

/** Fase atual como trilho de 7 pontos (petição inicial → cumprimento). */
export function TrilhoFase({ fase, compacto, className }: { fase: Fase; compacto?: boolean; className?: string }) {
  const idx = FASES.findIndex((f) => f.id === fase);
  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={`Fase: ${rotuloFase(fase)}`}>
      <span aria-hidden className="flex items-center gap-[3px]">
        {FASES.map((f, i) => (
          <span key={f.id} className={cn('h-1.5 rounded-full', i === idx ? 'w-3.5 bg-(--s-primary)' : i < idx ? 'w-1.5 bg-(--s-primary)/45' : 'w-1.5 bg-(--s-border-2)')} />
        ))}
      </span>
      {!compacto && <span className="text-[12px] whitespace-nowrap text-(--s-fg-2)">{rotuloFase(fase)}</span>}
      {compacto && <span className="sr-only">Fase: {rotuloFase(fase)}</span>}
    </span>
  );
}
