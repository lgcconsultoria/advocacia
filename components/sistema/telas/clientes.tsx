'use client';

/* Clientes — tabela compacta estilo CRM (inspirada na Records Table 23604)
   e ficha do cliente com abas: processos, financeiro e histórico. */

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'motion/react';
import { Building2, ChevronRight, Mail, Phone, Search, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao } from '../ui/cartao';
import { Entrada } from '../ui/campo';
import { Selo } from '../ui/selo';
import { Avatar } from '../ui/avatar';
import { Botao } from '../ui/botao';
import { EsqueletoTela, EstadoVazio } from '../ui/vazio';
import { LinhaDoTempo } from '../linha-do-tempo';
import { SeloPrazo, SeloSistema, TrilhoFase, eventosDoProcesso } from '../rotulos';
import { proximoPrazo, ultimoAndamento, usuarioPorId, type Cliente } from '@/lib/demo/dados';
import { dataCompleta, iniciais, moeda, relativo } from '@/lib/demo/formato';

const STATUS_FATURA = { paga: { rotulo: 'Paga', tom: 'ok' as const }, aberta: { rotulo: 'Em aberto', tom: 'ambar' as const }, vencida: { rotulo: 'Vencida', tom: 'perigo' as const } };

export function TelaClientes() {
  const d = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const [busca, setBusca] = React.useState('');
  const sel = params.get('c') ?? 'c-exemplo';
  const ficha = React.useRef<HTMLDivElement>(null);

  if (!d) return <EsqueletoTela />;

  const lista = d.clientes.filter((c) => !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cidade.toLowerCase().includes(busca.toLowerCase()));
  const c = d.clientes.find((x) => x.id === sel) ?? d.clientes[0];
  const procs = d.processos.filter((p) => p.clienteId === c.id);
  const faturas = d.faturas.filter((f) => f.clienteId === c.id).sort((a, b) => b.vencimento.getTime() - a.vencimento.getTime());
  const resp = usuarioPorId(d, c.responsavelId)!;
  const escolher = (cl: Cliente) => {
    router.replace(`/sistema/demo/clientes?c=${cl.id}`, { scroll: false });
    if (window.matchMedia('(max-width: 1279px)').matches) setTimeout(() => ficha.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <>
      <CabecalhoTela titulo="Clientes" subtitulo={`${d.clientes.length} clientes ativos · ${d.clientes.filter((x) => x.honorariosMensais).length} com assessoria mensal (Jurídico 360).`} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] [&>*]:min-w-0">
        <Cartao className="h-fit overflow-hidden">
          <div className="border-b border-(--s-border) p-3">
            <Entrada value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar cliente ou cidade…" aria-label="Buscar clientes" icone={<Search />} />
          </div>
          {lista.length === 0 ? (
            <EstadoVazio icone={<Search />} titulo="Nenhum cliente encontrado" />
          ) : (
            <ul role="listbox" aria-label="Clientes" className="divide-y divide-(--s-border)">
              {lista.map((cl) => {
                const n = d.processos.filter((p) => p.clienteId === cl.id).length;
                const ativo = cl.id === c.id;
                return (
                  <li key={cl.id} role="option" aria-selected={ativo}>
                    <button type="button" onClick={() => escolher(cl)} className={cn('relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors', ativo ? 'bg-(--s-accent)' : 'hover:bg-(--s-accent)/50')}>
                      {ativo && <motion.span layoutId="cliente-ativo" className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-(--s-primary)" />}
                      <Avatar nome={cl.nome} iniciais={iniciais(cl.nome)} />
                      <span className="grid min-w-0 flex-1 gap-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-medium">{cl.nome}</span>
                          {cl.tipo === 'PF' && <Selo tom="contorno">PF</Selo>}
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5">
                          {cl.areas.map((a) => (
                            <Selo key={a} tom={a === 'Tributário' ? 'ambar' : a === 'Licitações' ? 'marca' : 'neutro'}>{a}</Selo>
                          ))}
                          <span className="text-[11.5px] text-(--s-faint)">{cl.cidade}</span>
                        </span>
                      </span>
                      <span className="hidden text-right sm:block">
                        <span className="f-mono block text-[13px] tabular-nums">{n}</span>
                        <span className="block text-[10.5px] text-(--s-faint)">processos</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-(--s-faint)" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Cartao>

        <div ref={ficha} className="scroll-mt-28">
          <Cartao key={c.id} className="overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="relative overflow-hidden border-b border-(--s-border) p-5">
                <div aria-hidden className="absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--s-primary)_20%,transparent),transparent)]" />
                <div className="relative flex flex-wrap items-start gap-4">
                  <Avatar nome={c.nome} iniciais={iniciais(c.nome)} tamanho="lg" />
                  <div className="min-w-0 flex-1">
                    <h2 className="f-exp text-[19px] leading-tight font-semibold tracking-[-0.02em]">{c.nome}</h2>
                    <p className="f-mono mt-1 text-[11.5px] text-(--s-faint)">
                      {c.tipo === 'PJ' ? 'CNPJ' : 'CPF'} {c.documento}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-(--s-muted)">
                      <span className="inline-flex items-center gap-1.5"><UserRound className="size-3.5" aria-hidden /> {c.contato.nome}</span>
                      <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" aria-hidden /> {c.contato.email}</span>
                      <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" aria-hidden /> {c.contato.telefone}</span>
                    </p>
                  </div>
                  {c.id === d.portal.clienteId && (
                    <Botao asChild variante="secundario" tamanho="sm">
                      <Link href="/cliente/demo">Ver como o cliente vê</Link>
                    </Botao>
                  )}
                </div>
                <dl className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['Cliente desde', dataCompleta(c.clienteDesde)],
                    ['Plano', c.plano ?? 'Por demanda'],
                    ['Honorários/mês', c.honorariosMensais ? moeda(c.honorariosMensais) : '—'],
                    ['Responsável', resp.nome],
                  ].map(([k, v]) => (
                    <div key={k} className="min-w-0 rounded-xl bg-(--s-card-2) px-3 py-2.5 ring-1 ring-inset ring-(--s-border)">
                      <dt className="text-[11px] text-(--s-faint)">{k}</dt>
                      <dd className="mt-0.5 truncate text-[12.5px] font-medium" title={v}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Tabs.Root defaultValue="processos">
                <Tabs.List aria-label="Ficha do cliente" className="sem-rolagem flex gap-1 overflow-x-auto border-b border-(--s-border) px-3">
                  {[
                    ['processos', `Processos (${procs.length})`],
                    ['financeiro', 'Financeiro'],
                    ['historico', 'Histórico'],
                  ].map(([v, r]) => (
                    <Tabs.Trigger key={v} value={v} className="relative shrink-0 px-3 py-3 text-[13px] font-medium text-(--s-muted) transition-colors hover:text-(--s-fg) data-[state=active]:text-(--s-fg) data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-(--s-primary)">
                      {r}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Tabs.Content value="processos" className="outline-none">
                  {procs.length === 0 ? (
                    <EstadoVazio icone={<Building2 />} titulo="Sem processos" texto="Este cliente tem só consultoria no momento." />
                  ) : (
                    <ul className="divide-y divide-(--s-border)">
                      {procs.map((p) => {
                        const pz = proximoPrazo(d, p.id);
                        const ua = ultimoAndamento(p);
                        return (
                          <li key={p.id}>
                            <Link href={`/sistema/demo/processos?p=${p.id}`} className="grid gap-2 px-5 py-3.5 transition-colors hover:bg-(--s-accent)/40">
                              <span className="flex flex-wrap items-center justify-between gap-2">
                                <span className="f-mono text-[12px]">{p.cnj}</span>
                                {pz && <SeloPrazo data={pz.data} hoje={d.hoje} />}
                              </span>
                              <span className="text-[13px] font-medium">{p.titulo}</span>
                              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <SeloSistema tribunal={p.tribunal} sistema={p.sistema} />
                                <TrilhoFase fase={p.fase} />
                                <span className="text-[11.5px] text-(--s-faint)">Último: {ua?.titulo} · {ua && relativo(ua.data, d.agora)}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Tabs.Content>
                <Tabs.Content value="financeiro" className="outline-none">
                  {faturas.length === 0 ? (
                    <EstadoVazio icone={<Building2 />} titulo="Sem faturas" texto="Cliente atendido por demanda, cobrado por peça." />
                  ) : (
                    <table className="w-full text-[13px]">
                      <caption className="sr-only">Faturas do cliente</caption>
                      <thead className="text-[11.5px] text-(--s-muted)">
                        <tr className="border-b border-(--s-border)">
                          <th scope="col" className="px-5 py-2.5 text-left font-medium">Descrição</th>
                          <th scope="col" className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">Vencimento</th>
                          <th scope="col" className="px-3 py-2.5 text-right font-medium">Valor</th>
                          <th scope="col" className="px-5 py-2.5 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faturas.map((f) => (
                          <tr key={f.id} className="border-b border-(--s-border) last:border-0">
                            <td className="px-5 py-3">
                              <p className="line-clamp-1">{f.descricao}</p>
                              <p className="text-[11.5px] text-(--s-faint)">Competência {f.competencia}</p>
                            </td>
                            <td className="f-mono hidden px-3 py-3 text-[12px] sm:table-cell">{dataCompleta(f.vencimento)}</td>
                            <td className="f-mono px-3 py-3 text-right text-[12.5px] tabular-nums">{moeda(f.valor)}</td>
                            <td className="px-5 py-3 text-right"><Selo tom={STATUS_FATURA[f.status].tom}>{STATUS_FATURA[f.status].rotulo}</Selo></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Tabs.Content>
                <Tabs.Content value="historico" className="p-4 outline-none">
                  <LinhaDoTempo eventos={procs.flatMap((p) => eventosDoProcesso(p))} agora={d.agora} rotulo={`Histórico de ${c.nome}`} alturaMax={440} compacta />
                </Tabs.Content>
              </Tabs.Root>
            </motion.div>
          </Cartao>
        </div>
      </div>
    </>
  );
}
