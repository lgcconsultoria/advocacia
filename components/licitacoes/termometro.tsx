'use client';

import type { ReactNode } from 'react';
import { AVISOS_UI, formatarInteiro, formatarReais } from '@/lib/pncp/animacao';
import type { Medida } from '@/lib/pncp/tipos';
import { cn } from '@/lib/utils';
import { usePncp } from './contexto';
import { NumeroVivo } from './numero-vivo';
import { PilulaStatus, rotuloFixo, useStatus } from './status';

const DEC = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const PCT = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });

/** Marca discreta para números que incluem projeção entre leituras. */
export function MarcaEstimado({ ativo, className }: { ativo: boolean; className?: string }) {
  if (!ativo) return null;
  return (
    <span
      className={cn('rotulo ml-2 inline-block rounded-full border border-sinal/40 px-1.5 py-0.5 align-middle text-[9px] tracking-[0.1em] text-sinal', className)}
      title={AVISOS_UI.animacao}
    >
      ≈ projeção
    </span>
  );
}

function valorDe(m: Medida): number | null {
  return m.valor ? m.valor.valorSemAtipicos : null;
}

function Contador({
  n,
  titulo,
  valor,
  extra,
  nota,
  grande = false,
}: {
  n: string;
  titulo: string;
  valor: ReactNode;
  extra?: ReactNode;
  nota?: ReactNode;
  grande?: boolean;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col border-t border-sinal/20 pt-5', grande && 'lg:pr-6')}>
      <dt className="flex items-baseline gap-3">
        <span className="rotulo num text-[10px] text-sinal">{n}</span>
        <span className="text-[0.95rem] text-white/85">{titulo}</span>
      </dt>
      <dd className="m-0 mt-3">
        <span
          className={cn(
            'expandida num block font-[800] leading-[0.95] tracking-[-0.04em] text-white',
            grande ? 'text-[clamp(2.6rem,6.4vw,5rem)]' : 'text-[clamp(2rem,4vw,2.9rem)]',
          )}
        >
          {valor}
        </span>
        {extra && <span className="mt-2 block text-[0.95rem] text-white/80">{extra}</span>}
        {nota && <span className="mt-2 block text-[0.84rem] leading-snug text-cinza-escuro">{nota}</span>}
      </dd>
    </div>
  );
}

export function Termometro() {
  const { dados, montado, valorAbertas, publicadasHoje } = usePncp();
  const { reserva } = useStatus();
  const ab = dados.abertas;
  const vAb = ab.valor;
  const valorAberto = montado && valorAbertas ? valorAbertas.valor : vAb?.valorSemAtipicos ?? null;
  const hoje = montado && publicadasHoje ? publicadasHoje : { valor: dados.publicadasHoje.quantidade, estimado: false };
  const ritmo = dados.publicadasHoje.ritmoPorMinuto;
  const v30 = valorDe(dados.publicadas30d);
  const vMes = valorDe(dados.contratosMes);
  const vHoje = valorDe(dados.publicadasHoje);
  const valoresReserva =
    [dados.abertas, dados.publicadasHoje, dados.publicadas30d, dados.contratosMes]
      .map((m) => m.valor?.procedencia)
      .find((p) => p?.fonte === 'snapshot')?.consultadoEm ?? null;

  return (
    <div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <PilulaStatus />
        <span className="rotulo text-[10px] text-cinza-escuro">
          Contagens a cada 2 min · valores a cada 15 min
        </span>
      </div>

      <dl className="m-0 mt-8 grid gap-x-10 gap-y-10 lg:grid-cols-2">
        <Contador
          grande
          n="A"
          titulo="Contratações abertas agora"
          valor={<NumeroVivo valor={ab.quantidade} />}
          extra="recebendo propostas ou com recebimento a abrir"
          nota={AVISOS_UI.abertas}
        />
        <Contador
          grande
          n="B"
          titulo="Valor estimado em aberto"
          valor={
            valorAberto === null ? '—' : (
              <>
                <NumeroVivo valor={valorAberto} formato="reais" />
                <MarcaEstimado ativo={montado && !!valorAbertas?.estimado} />
              </>
            )
          }
          extra={
            vAb ? (
              <>
                intervalo garantido: {formatarReais(vAb.intervaloSemAtipicos[0])} a {formatarReais(vAb.intervaloSemAtipicos[1])}
              </>
            ) : null
          }
          nota={
            vAb ? (
              <>
                Sem atípicos: {formatarInteiro(vAb.atipicos.quantidade)}{' '}
                {vAb.atipicos.quantidade === 1 ? 'registro' : 'registros'} acima de {formatarReais(vAb.atipicos.limite)}{' '}
                ficam de fora; {formatarInteiro(vAb.semValorInformado)} sem valor informado.
              </>
            ) : null
          }
        />
      </dl>

      <dl className="m-0 mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
        <Contador
          n="C"
          titulo="Publicadas hoje"
          valor={
            <>
              <NumeroVivo valor={hoje.valor} duracao={0.8} />
              <MarcaEstimado ativo={hoje.estimado} />
            </>
          }
          extra={
            <>
              ritmo de <strong className="num font-[650] text-white">{DEC.format(ritmo)}</strong> por minuto na última hora
            </>
          }
          nota={vHoje !== null ? <>valor estimado: {formatarReais(vHoje)}</> : null}
        />
        <Contador
          n="D"
          titulo="Publicadas nos últimos 30 dias"
          valor={<NumeroVivo valor={dados.publicadas30d.quantidade} />}
          extra={v30 !== null ? <>valor estimado: {formatarReais(v30)}</> : null}
          nota="Inclui editais, avisos e atos de contratação direta (dispensas e inexigibilidades)."
        />
        <Contador
          n="E"
          titulo="Contratos assinados no mês"
          valor={<NumeroVivo valor={dados.contratosMes.quantidade} />}
          extra={vMes !== null ? <>valor global: {formatarReais(vMes)}</> : null}
          nota="O número cresce nos dias seguintes: a publicação do contrato no PNCP costuma atrasar."
        />
      </dl>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <Modalidades />
        <Esferas />
      </div>

      <div className="mt-14 grid gap-3 border-t border-sinal/15 pt-6 text-[0.84rem] leading-relaxed text-cinza-escuro md:grid-cols-3 md:gap-8">
        <p className="m-0">{AVISOS_UI.fonte}</p>
        <p className="m-0">{AVISOS_UI.valores}</p>
        <p className="m-0">{AVISOS_UI.animacao}</p>
      </div>
      {(reserva || valoresReserva) && (
        <ul className="m-0 mt-4 grid list-none gap-1 p-0 text-[0.84rem] text-madeira">
          {reserva && <li>{AVISOS_UI.reserva}</li>}
          {!reserva && valoresReserva && (
            <li>
              Contagens ao vivo; parte dos valores em reais vem do último retrato salvo ({rotuloFixo(valoresReserva)}),
              porque o PNCP não respondeu a tempo. A próxima consulta tenta de novo.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function Modalidades() {
  const { dados } = usePncp();
  const lista = [...dados.porModalidade].sort((a, b) => b.abertas - a.abertas);
  const total = lista.reduce((s, m) => s + m.abertas, 0) || 1;
  const topo = lista.slice(0, 6);
  const resto = lista.slice(6);
  const linhas = [
    ...topo.map((m) => ({ nome: m.nome.replace(' - ', ' · '), abertas: m.abertas })),
    ...(resto.length
      ? [{ nome: `Demais modalidades (${resto.length})`, abertas: resto.reduce((s, m) => s + m.abertas, 0) }]
      : []),
  ];
  const max = Math.max(...linhas.map((l) => l.abertas), 1);
  return (
    <figure className="m-0 min-w-0">
      <figcaption className="rotulo text-[10.5px] text-sinal">Abertas por modalidade</figcaption>
      <ul className="m-0 mt-5 grid list-none gap-3.5 p-0">
        {linhas.map((l) => (
          <li key={l.nome} className="min-w-0">
            <div className="flex items-baseline justify-between gap-4 text-[0.92rem]">
              <span className="truncate text-white/90">{l.nome}</span>
              <span className="num shrink-0 text-white">
                {formatarInteiro(l.abertas)}
                <span className="ml-2 text-[0.8rem] text-cinza-escuro">{PCT.format(l.abertas / total)}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-white/[0.06]" aria-hidden="true">
              <div
                className="h-full rounded-full bg-sinal transition-[width] duration-700"
                style={{ width: `${Math.max(0.6, (l.abertas / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-4 text-[0.82rem] text-cinza-escuro">
        Credenciamentos ficam abertos por meses e pesam no total de abertas.
      </p>
    </figure>
  );
}

const TONS = ['#8e8bff', '#5b57ff', '#c9c7ff', '#3b38d6'];

function Esferas() {
  const { dados } = usePncp();
  const lista = [...dados.porEsfera].sort((a, b) => b.abertas - a.abertas);
  const total = lista.reduce((s, e) => s + e.abertas, 0) || 1;
  return (
    <figure className="m-0 min-w-0">
      <figcaption className="rotulo text-[10.5px] text-sinal">Abertas por esfera</figcaption>
      <div className="mt-5 flex h-4 gap-[2px] overflow-hidden rounded-full" aria-hidden="true">
        {lista.map((e, i) => (
          <div
            key={e.id}
            className="h-full transition-[flex-grow] duration-700 first:rounded-l-full last:rounded-r-full"
            style={{ flexGrow: e.abertas, flexBasis: 0, minWidth: 3, background: TONS[i % TONS.length] }}
            title={`${e.nome}: ${formatarInteiro(e.abertas)}`}
          />
        ))}
      </div>
      <dl className="m-0 mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
        {lista.map((e, i) => (
          <div key={e.id} className="min-w-0 border-l-2 pl-3" style={{ borderColor: TONS[i % TONS.length] }}>
            <dt className="text-[0.88rem] text-cinza-escuro">{e.nome}</dt>
            <dd className="m-0 mt-0.5">
              <span className="expandida num text-[1.5rem] font-[760] leading-none text-white">{formatarInteiro(e.abertas)}</span>
              <span className="num ml-2 text-[0.85rem] text-cinza-escuro">{PCT.format(e.abertas / total)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
