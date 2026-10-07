'use client';

/* Gráficos e KPIs — porte do Charts & KPI Cards (21st.dev 33507, @uvain)
   sobre recharts. Regras mantidas: cor segue a série (--s-chart-1…5), uma
   escala por gráfico, marcas finas, tooltip e tabela escondida para leitor
   de tela; o KPI sabe se "subir é bom" ou ruim. */

import * as React from 'react';
import NumberFlow, { type Format } from '@number-flow/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

export type Serie = { chave: string; rotulo: string; cor?: 1 | 2 | 3 | 4 | 5 };

const cor = (s: Serie, i: number) => `var(--s-chart-${s.cor ?? (i % 5) + 1})`;
const EIXO = { fill: 'var(--s-faint)', fontSize: 11 };
const fmtPadrao = (v: number) => v.toLocaleString('pt-BR');

function Legenda({ series }: { series: Serie[] }) {
  if (series.length < 2) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden>
      {series.map((s, i) => (
        <li key={s.chave} className="flex items-center gap-1.5 text-[12px] text-(--s-muted)">
          <span className="size-2 rounded-[3px]" style={{ background: cor(s, i) }} />
          {s.rotulo}
        </li>
      ))}
    </ul>
  );
}

type PayloadItem = { dataKey?: string | number; name?: string | number; value?: number | string; payload?: Record<string, unknown> };

function DicaGrafico({ active, payload, label, series, fmt }: { active?: boolean; payload?: PayloadItem[]; label?: string | number; series: Serie[]; fmt: (v: number) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[150px] rounded-xl bg-(--s-bg-2) px-3 py-2 text-[12px] text-(--s-fg) shadow-(--s-shadow) ring-1 ring-(--s-border-2)">
      {label !== undefined && <p className="mb-1.5 font-medium">{label}</p>}
      <ul className="grid gap-1">
        {payload.map((p, k) => {
          const i = series.findIndex((s) => s.chave === p.dataKey);
          const s = series[i] ?? { chave: String(p.name), rotulo: String(p.name) };
          return (
            <li key={k} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-(--s-muted)">
                <span className="size-2 rounded-[3px]" style={{ background: i >= 0 ? cor(s, i) : String((p.payload as { fill?: string })?.fill ?? 'var(--s-chart-1)') }} />
                {s.rotulo}
              </span>
              <span className="f-mono font-medium tabular-nums">{fmt(Number(p.value))}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TabelaOculta<T extends Record<string, unknown>>({ legenda, dados, x, series, fmt }: { legenda: string; dados: T[]; x: string; series: Serie[]; fmt: (v: number) => string }) {
  return (
    <div className="sr-only">
      <table>
        <caption>{legenda}</caption>
        <thead>
          <tr>
            <th scope="col">{x}</th>
            {series.map((s) => (
              <th key={s.chave} scope="col">{s.rotulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((r, i) => (
            <tr key={i}>
              <th scope="row">{String(r[x])}</th>
              {series.map((s) => (
                <td key={s.chave}>{fmt(Number(r[s.chave]))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Cartesiano<T> = { dados: T[]; x: keyof T & string; series: Serie[]; fmt?: (v: number) => string; altura?: number; descricao: string; className?: string; empilhado?: boolean };

export function TendenciaArea<T extends Record<string, unknown>>({ dados, x, series, fmt = fmtPadrao, altura = 220, descricao, className, empilhado }: Cartesiano<T>) {
  const id = React.useId().replace(/:/g, '');
  return (
    <div className={cn('grid gap-3', className)}>
      <Legenda series={series} />
      <div role="img" aria-label={descricao} style={{ height: altura }}>
        <div aria-hidden className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dados} margin={{ top: 6, right: 6, bottom: 0, left: -12 }}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={s.chave} id={`${id}-${s.chave}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cor(s, i)} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={cor(s, i)} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="var(--s-border)" />
              <XAxis dataKey={x as string} tickLine={false} axisLine={false} tick={EIXO} tickMargin={8} minTickGap={16} />
              <YAxis tickLine={false} axisLine={false} tick={EIXO} tickFormatter={fmt} width={44} allowDecimals={false} />
              <Tooltip cursor={{ stroke: 'var(--s-border-2)', strokeWidth: 1 }} content={(p) => <DicaGrafico {...(p as object)} series={series} fmt={fmt} />} />
              {series.map((s, i) => (
                <Area
                  key={s.chave}
                  type="monotone"
                  dataKey={s.chave}
                  name={s.rotulo}
                  stackId={empilhado ? 'a' : undefined}
                  stroke={cor(s, i)}
                  strokeWidth={2}
                  fill={`url(#${id}-${s.chave})`}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--s-card)', fill: cor(s, i) }}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <TabelaOculta legenda={descricao} dados={dados} x={x} series={series} fmt={fmt} />
    </div>
  );
}

export function BarrasComparadas<T extends Record<string, unknown>>({ dados, x, series, fmt = fmtPadrao, altura = 220, descricao, className, empilhado, horizontal }: Cartesiano<T> & { horizontal?: boolean }) {
  return (
    <div className={cn('grid gap-3', className)}>
      <Legenda series={series} />
      <div role="img" aria-label={descricao} style={{ height: altura }}>
        <div aria-hidden className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 6, right: 6, bottom: 0, left: horizontal ? 8 : -12 }} barCategoryGap="26%">
              <CartesianGrid vertical={!!horizontal} horizontal={!horizontal} stroke="var(--s-border)" />
              {horizontal ? (
                <>
                  <XAxis type="number" tickLine={false} axisLine={false} tick={EIXO} allowDecimals={false} />
                  <YAxis type="category" dataKey={x as string} tickLine={false} axisLine={false} tick={{ ...EIXO, fill: 'var(--s-muted)' }} width={92} />
                </>
              ) : (
                <>
                  <XAxis dataKey={x as string} tickLine={false} axisLine={false} tick={EIXO} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tick={EIXO} tickFormatter={fmt} width={44} allowDecimals={false} />
                </>
              )}
              <Tooltip cursor={{ fill: 'var(--s-accent)' }} content={(p) => <DicaGrafico {...(p as object)} series={series} fmt={fmt} />} />
              {series.map((s, i) => (
                <Bar
                  key={s.chave}
                  dataKey={s.chave}
                  name={s.rotulo}
                  stackId={empilhado ? 'a' : undefined}
                  fill={cor(s, i)}
                  maxBarSize={22}
                  radius={empilhado && i < series.length - 1 ? 0 : horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <TabelaOculta legenda={descricao} dados={dados} x={x} series={series} fmt={fmt} />
    </div>
  );
}

export type Fatia = { rotulo: string; valor: number; cor?: 1 | 2 | 3 | 4 | 5 };

export function Rosca({ dados, fmt = fmtPadrao, rotuloCentro = 'Total', descricao, tamanho = 168, className }: { dados: Fatia[]; fmt?: (v: number) => string; rotuloCentro?: string; descricao: string; tamanho?: number; className?: string }) {
  const total = dados.reduce((n, d) => n + d.valor, 0);
  const series: Serie[] = dados.map((d, i) => ({ chave: d.rotulo, rotulo: d.rotulo, cor: d.cor ?? (((i % 5) + 1) as 1) }));
  return (
    <div className={cn('flex flex-wrap items-center gap-6', className)}>
      <div role="img" aria-label={descricao} className="relative shrink-0" style={{ width: tamanho, height: tamanho }}>
        <div aria-hidden className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dados} dataKey="valor" nameKey="rotulo" innerRadius="70%" outerRadius="100%" stroke="var(--s-card)" strokeWidth={2} startAngle={90} endAngle={-270} rootTabIndex={-1} isAnimationActive={false}>
                {dados.map((d, i) => (
                  <Cell key={d.rotulo} fill={cor(series[i], i)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-[11px] text-(--s-muted)">{rotuloCentro}</span>
          <span className="f-exp text-[20px] font-semibold tabular-nums">{fmt(total)}</span>
        </div>
      </div>
      <ul className="grid min-w-[160px] flex-1 gap-2">
        {dados.map((d, i) => (
          <li key={d.rotulo} className="flex items-center justify-between gap-4 text-[12.5px]">
            <span className="flex items-center gap-2 text-(--s-muted)">
              <span className="size-2.5 rounded-[3px]" style={{ background: cor(series[i], i) }} />
              {d.rotulo}
            </span>
            <span className="f-mono tabular-nums">
              <span className="font-medium text-(--s-fg)">{fmt(d.valor)}</span>
              <span className="ml-2 text-(--s-faint)">{total ? Math.round((d.valor / total) * 100) : 0}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MiniLinha({ dados, cor: c = 1, altura = 32, className }: { dados: number[]; cor?: 1 | 2 | 3 | 4 | 5; altura?: number; className?: string }) {
  const linhas = dados.map((v, i) => ({ i, v }));
  return (
    <div aria-hidden className={className} style={{ height: altura }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={linhas} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke={`var(--s-chart-${c})`} strokeWidth={2} dot={false} isAnimationActive={false} strokeLinecap="round" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CartaoKpi({
  rotulo,
  valor,
  formato,
  delta,
  bom = 'sobe',
  periodo,
  tendencia,
  icone,
  nota,
  destaque,
  className,
}: {
  rotulo: string;
  valor: number;
  formato?: Format;
  delta?: number;
  bom?: 'sobe' | 'desce';
  periodo?: string;
  tendencia?: number[];
  icone?: React.ReactNode;
  nota?: React.ReactNode;
  destaque?: 'ambar' | 'perigo';
  className?: string;
}) {
  const subiu = (delta ?? 0) >= 0;
  const positivo = delta === undefined ? null : (subiu && bom === 'sobe') || (!subiu && bom === 'desce');
  return (
    <div className={cn('relative grid gap-2.5 overflow-hidden rounded-2xl bg-(--s-card) p-4 ring-1 ring-(--s-border)', className)}>
      {destaque && <span aria-hidden className={cn('absolute inset-x-0 top-0 h-0.5', destaque === 'ambar' ? 'bg-(--s-amber)' : 'bg-(--s-danger)')} />}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-medium text-(--s-muted)">{rotulo}</p>
        {icone && <span className="text-(--s-faint) [&_svg]:size-4">{icone}</span>}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="f-exp text-[26px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          <NumberFlow value={valor} locales="pt-BR" format={formato} />
        </p>
        {tendencia && <MiniLinha dados={tendencia} className="w-20" altura={28} cor={destaque === 'ambar' ? 4 : 1} />}
      </div>
      <div className="flex min-h-[18px] flex-wrap items-center gap-x-1.5 text-[12px]">
        {delta !== undefined && (
          <span className={cn('inline-flex items-center gap-0.5 font-medium tabular-nums', positivo ? 'text-(--s-ok)' : 'text-(--s-danger)')}>
            {subiu ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
            <span className="sr-only">{subiu ? 'Subiu' : 'Caiu'} </span>
            {Math.abs(delta * 100).toFixed(0)}%
          </span>
        )}
        {periodo && <span className="text-(--s-faint)">{periodo}</span>}
        {nota && <span className="text-(--s-faint)">{nota}</span>}
      </div>
    </div>
  );
}
