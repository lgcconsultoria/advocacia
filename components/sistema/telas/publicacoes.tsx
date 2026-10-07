'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarPlus, Check, ChevronDown, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Selo } from '../ui/selo';
import { EsqueletoTela, EstadoVazio } from '../ui/vazio';
import { SeletorPapel } from '@/components/auth/seletor-papel';
import { clientePorId, processoPorId } from '@/lib/demo/dados';
import { dataCompleta, hora, relativo } from '@/lib/demo/formato';

export function TelaPublicacoes() {
  const d = useDemo();
  const [filtro, setFiltro] = React.useState<'nao-lidas' | 'todas'>('todas');
  const [lidas, setLidas] = React.useState<Set<string>>(new Set());
  const [abertas, setAbertas] = React.useState<Set<string>>(new Set());
  const [prazoCriado, setPrazoCriado] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (d) setLidas(new Set(d.publicacoes.filter((p) => p.lida).map((p) => p.id)));
  }, [d]);

  if (!d) return <EsqueletoTela />;
  const lista = d.publicacoes.filter((p) => filtro === 'todas' || !lidas.has(p.id));
  const naoLidas = d.publicacoes.filter((p) => !lidas.has(p.id)).length;
  const alternar = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string, forcar?: boolean) =>
    set((s) => {
      const n = new Set(s);
      if (forcar ?? !n.has(id)) n.add(id);
      else n.delete(id);
      return n;
    });

  return (
    <>
      <CabecalhoTela
        titulo="Publicações"
        destaque="DJEN"
        subtitulo={`Lidas pelo agente no Diário de Justiça Eletrônico Nacional a cada 30 minutos · ${naoLidas} não lidas.`}
        acoes={
          <SeletorPapel
            className="w-[260px]"
            rotulo="Filtrar publicações"
            valor={filtro}
            aoMudar={(v) => setFiltro(v as typeof filtro)}
            opcoes={[
              { value: 'todas', label: 'Todas' },
              { value: 'nao-lidas', label: 'Não lidas' },
            ]}
          />
        }
      />
      <Cartao className="overflow-hidden">
        {lista.length === 0 ? (
          <EstadoVazio icone={<Newspaper />} titulo="Nenhuma publicação pendente" texto="Tudo lido. O agente avisa no WhatsApp quando chegar algo novo." />
        ) : (
          <ul className="divide-y divide-(--s-border)">
            {lista.map((pub) => {
              const p = processoPorId(d, pub.processoId)!;
              const lida = lidas.has(pub.id);
              const aberta = abertas.has(pub.id);
              return (
                <li key={pub.id} className={cn('relative', !lida && 'bg-(--s-primary)/5')}>
                  {!lida && <span aria-hidden className="absolute top-4 bottom-4 left-0 w-[3px] rounded-r-full bg-(--s-primary)" />}
                  <div className="grid gap-3 px-5 py-4 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-start">
                    <div className="flex items-center gap-2 md:grid md:gap-1">
                      <Selo tom={pub.tipo === 'Sentença' ? 'ambar' : 'marca'} className="w-fit">{pub.tipo}</Selo>
                      <span className="f-mono text-[11.5px] text-(--s-faint)">{dataCompleta(pub.data)} {hora(pub.data)}</span>
                      <span className="text-[11px] text-(--s-faint) md:block">{relativo(pub.data, d.agora)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium">{clientePorId(d, p.clienteId)?.nome}</p>
                      <p className="mt-0.5 text-[12px] text-(--s-muted)">
                        <Link href={`/sistema/demo/processos?p=${p.id}`} className="f-mono text-[11.5px] hover:text-(--s-primary) hover:underline">{p.cnj}</Link> · {pub.orgao}
                      </p>
                      <button type="button" onClick={() => { alternar(setAbertas, pub.id); alternar(setLidas, pub.id, true); }} aria-expanded={aberta} className="mt-2 flex w-full items-start gap-2 text-left text-[13px] text-(--s-fg-2)">
                        <span className={cn('min-w-0 flex-1', !aberta && 'line-clamp-1')}>{pub.teor}</span>
                        <ChevronDown className={cn('mt-0.5 size-4 shrink-0 text-(--s-faint) transition-transform', aberta && 'rotate-180')} aria-hidden />
                        <span className="sr-only">{aberta ? 'Recolher teor' : 'Ler teor completo'}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {aberta && (
                          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="f-mono mt-2 overflow-hidden rounded-lg bg-(--s-card-2) p-3 text-[11.5px] leading-relaxed text-(--s-muted) ring-1 ring-inset ring-(--s-border)">
                            DJEN · {pub.orgao} · Disponibilizado em {dataCompleta(pub.data)}. Teor (fictício): {pub.teor}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <Botao variante={prazoCriado.has(pub.id) ? 'fantasma' : 'secundario'} tamanho="sm" onClick={() => alternar(setPrazoCriado, pub.id, true)} disabled={prazoCriado.has(pub.id)}>
                        {prazoCriado.has(pub.id) ? <><Check /> Prazo criado</> : <><CalendarPlus /> Criar prazo</>}
                      </Botao>
                      <Botao variante="fantasma" tamanho="sm" onClick={() => alternar(setLidas, pub.id)}>
                        {lida ? 'Marcar como não lida' : 'Marcar como lida'}
                      </Botao>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Cartao>
    </>
  );
}
