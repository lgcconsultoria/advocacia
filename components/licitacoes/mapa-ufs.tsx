'use client';

import { useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { GlobeAnalytics, locationToAngles, type AnalyticsMarker } from '@/components/ui/cobe-globe-analytics';
import { formatarInteiro, formatarReais, rotuloAtualizado } from '@/lib/pncp/animacao';
import { cn } from '@/lib/utils';
import { usePncp } from './contexto';
import { rotuloFixo } from './status';

const CENTRO_BRASIL: [number, number] = [-14.5, -51];
const MARCA: [number, number, number] = [0.114, 0.106, 0.604]; // #1d1b9a
const DESTAQUE: [number, number, number] = [0.83, 0.6, 0.36]; // madeira
const ROTULOS_NO_GLOBO = 6;
const [PHI_BR, THETA_BR] = locationToAngles(CENTRO_BRASIL[0], CENTRO_BRASIL[1]);

export function MapaUfs() {
  const { uf, montado } = usePncp();
  const reduzir = useReducedMotion();
  const [sel, setSel] = useState<string | null>(null);

  const ufs = useMemo(() => [...uf.ufs].sort((a, b) => b.abertas - a.abertas), [uf]);
  const max = ufs[0]?.abertas || 1;
  const topo = useMemo(() => new Set(ufs.slice(0, ROTULOS_NO_GLOBO).map((u) => u.uf)), [ufs]);
  const atual = ufs.find((u) => u.uf === sel) ?? null;

  const markers = useMemo<AnalyticsMarker[]>(
    () =>
      ufs.map((u) => ({
        id: `uf-${u.uf.toLowerCase()}`,
        location: [u.lat, u.lng],
        visitors: u.abertas,
        trend: 0,
        size: 0.018 + 0.07 * Math.sqrt(u.abertas / max),
        color: u.uf === sel ? DESTAQUE : undefined,
        showLabel: u.uf === sel || (sel === null && topo.has(u.uf)),
        label: (
          <span className="flex items-baseline gap-1.5 font-mono text-[11px] leading-none">
            <b className="font-semibold">{u.uf}</b>
            <span className="num">{formatarInteiro(u.abertas)}</span>
            <span className="num opacity-70">· {formatarReais(u.valorEstimado)}</span>
          </span>
        ),
      })),
    [ufs, max, sel, topo],
  );

  const consultado = uf.atualizadoEm;
  const totalAbertas = ufs.reduce((s, u) => s + u.abertas, 0);

  return (
    <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
      <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
        <div className="relative mx-auto w-full max-w-[560px]">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(29_27_154/0.16),transparent_68%)] blur-2xl"
          />
          <GlobeAnalytics
            markers={markers}
            drift={false}
            speed={0}
            focusEase={reduzir ? 1 : 0.06}
            focus={atual ? [atual.lat, atual.lng] : CENTRO_BRASIL}
            initialPhi={reduzir ? PHI_BR : PHI_BR + 0.9}
            initialTheta={reduzir ? THETA_BR : 0.15}
            baseColor={[1, 1, 1]}
            markerColor={MARCA}
            glowColor={[0.9, 0.9, 0.96]}
            dark={0}
            diffuse={1.3}
            mapBrightness={6}
            labelStyle={{
              background: 'rgb(11 10 46 / 0.92)',
              color: '#fff',
              borderRadius: 999,
              padding: '0.32rem 0.6rem',
              border: '1px solid rgb(142 139 255 / 0.45)',
            }}
            className="w-full"
          />
          <p className="sr-only">
            Globo com marcadores nas capitais dos 27 estados; o tamanho de cada marcador é proporcional ao
            número de contratações abertas. Os números estão na tabela ao lado.
          </p>
        </div>
        <p className="rotulo m-0 mt-4 text-center text-[10px] text-cinza">
          Arraste para girar · escolha um estado na lista
        </p>
        {atual && (
          <div className="mx-auto mt-5 max-w-[460px] rounded-2xl border border-papel-2 bg-white p-5 shadow-[0_30px_80px_-50px_rgb(29_27_154/0.45)]" aria-live="polite">
            <div className="flex items-baseline justify-between gap-3">
              <p className="expandida m-0 text-[1.15rem] font-[760]">
                {atual.nome} <span className="rotulo text-[10px] text-marca">{atual.uf}</span>
              </p>
              <button type="button" onClick={() => setSel(null)} className="rotulo cursor-pointer border-0 bg-transparent p-0 text-[10px] text-cinza underline hover:text-marca">
                Ver o Brasil
              </button>
            </div>
            <dl className="m-0 mt-3 grid grid-cols-3 gap-3 text-[0.85rem]">
              <div><dt className="text-cinza">Abertas</dt><dd className="num m-0 font-[650]">{formatarInteiro(atual.abertas)}</dd></div>
              <div><dt className="text-cinza">Em aberto</dt><dd className="num m-0 font-[650]">{formatarReais(atual.valorEstimado)}</dd></div>
              <div><dt className="text-cinza">30 dias</dt><dd className="num m-0 font-[650]">{formatarInteiro(atual.publicadas30d)}</dd></div>
            </dl>
            <p className="m-0 mt-3 text-[0.8rem] text-cinza">Marcador na capital: {atual.capital}.</p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <table className="w-full border-collapse text-[0.9rem]">
          <caption className="rotulo mb-4 text-left text-[10.5px] text-marca">
            Os 27 estados, por contratações abertas
          </caption>
          <thead>
            <tr className="rotulo text-[9.5px] text-cinza">
              <th scope="col" className="pb-2 text-left font-normal">Estado</th>
              <th scope="col" className="pb-2 text-right font-normal">Abertas</th>
              <th scope="col" className="pb-2 text-right font-normal">Valor em aberto</th>
              <th scope="col" className="pb-2 text-right font-normal">
                <span className="max-sm:hidden">Publicadas em </span>30 dias
              </th>
            </tr>
          </thead>
          <tbody>
            {ufs.map((u, i) => {
              const ativo = u.uf === sel;
              return (
                <tr key={u.uf} className={cn('border-t border-papel-2 transition-colors', ativo ? 'bg-white' : 'hover:bg-white/60')}>
                  <th scope="row" className="py-0 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => setSel(ativo ? null : u.uf)}
                      aria-pressed={ativo}
                      title={`${u.nome}: mostrar no globo`}
                      className="group flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-1 py-2.5 text-left text-grafite"
                    >
                      <span className="rotulo num w-5 shrink-0 text-[9.5px] text-cinza">{String(i + 1).padStart(2, '0')}</span>
                      <span className={cn('expandida w-8 shrink-0 text-[0.9rem] font-[740]', ativo ? 'text-madeira-escura' : 'text-marca')}>{u.uf}</span>
                      <span className="min-w-0 truncate max-sm:hidden group-hover:text-marca">{u.nome}</span>
                    </button>
                  </th>
                  <td className="num relative py-2.5 pl-2 text-right">
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[7px] right-0 h-[2px] rounded-full bg-marca/35"
                      style={{ width: `${(u.abertas / max) * 100}%` }}
                    />
                    <span className="relative">{formatarInteiro(u.abertas)}</span>
                  </td>
                  <td className="num py-2.5 pl-2 text-right">{formatarReais(u.valorEstimado)}</td>
                  <td className="num py-2.5 pl-2 text-right text-cinza">{formatarInteiro(u.publicadas30d)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-grafite">
              <th scope="row" className="py-3 pl-1 text-left text-[0.85rem] font-[650]">Soma das UFs</th>
              <td className="num py-3 pl-2 text-right font-[650]">{formatarInteiro(totalAbertas)}</td>
              <td className="num py-3 pl-2 text-right font-[650]">{formatarReais(ufs.reduce((s, u) => s + u.valorEstimado, 0))}</td>
              <td className="num py-3 pl-2 text-right text-cinza">{formatarInteiro(ufs.reduce((s, u) => s + u.publicadas30d, 0))}</td>
            </tr>
          </tfoot>
        </table>
        <p className="m-0 mt-5 text-[0.84rem] leading-relaxed text-cinza" suppressHydrationWarning>
          Mapa por estado {montado ? rotuloAtualizado(consultado) : rotuloFixo(consultado)} · Fonte: PNCP.
          Valores sem registros acima de R$ 10 bilhões, somados por estado (margem de cerca de 1%); a soma das
          UFs pode diferir um pouco do total nacional, porque as consultas são feitas em momentos diferentes.
          {uf.fonte === 'snapshot' && ' Parte dos estados vem do último retrato salvo: o PNCP não respondeu a tempo.'}
        </p>
      </div>
    </div>
  );
}
