'use client';

/* Lista de processos — porte do Data Table (21st.dev 31861, @wensity), sem
   TanStack: busca, filtros, ordenação, paginação e linha expansível com a
   linha do tempo de andamentos. No celular a tabela vira cartões. */

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, FilterX, MessageCircle, Search, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo, type Demo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Entrada } from '../ui/campo';
import { Selecao } from '../ui/selecao';
import { Selo } from '../ui/selo';
import { Avatar } from '../ui/avatar';
import { EsqueletoTela, EstadoVazio } from '../ui/vazio';
import { LinhaDoTempo } from '../linha-do-tempo';
import { SeloPrazo, SeloSistema, TrilhoFase, eventosDoProcesso } from '../rotulos';
import { AREAS, FASES, clientePorId, proximoPrazo, rotuloFase, ultimoAndamento, usuarioPorId, type DadosDemo, type Fase, type Processo } from '@/lib/demo/dados';
import { dataCompleta, dataCurta, moeda, relativo } from '@/lib/demo/formato';

type Coluna = 'cnj' | 'cliente' | 'andamento' | 'prazo';
type Ordem = { coluna: Coluna; dir: 'asc' | 'desc' };
const POR_PAGINA = 10;

function valorOrdem(d: DadosDemo, p: Processo, c: Coluna): number | string {
  if (c === 'cnj') return p.cnj;
  if (c === 'cliente') return clientePorId(d, p.clienteId)?.nome ?? '';
  if (c === 'andamento') return ultimoAndamento(p)?.data.getTime() ?? 0;
  return proximoPrazo(d, p.id)?.data.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function CabecalhoOrdenavel({ rotulo, coluna, ordem, aoOrdenar, className }: { rotulo: string; coluna: Coluna; ordem: Ordem; aoOrdenar: (c: Coluna) => void; className?: string }) {
  const ativa = ordem.coluna === coluna;
  const Icone = !ativa ? ArrowUpDown : ordem.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <th scope="col" aria-sort={ativa ? (ordem.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn('px-3 py-2.5 text-left font-medium whitespace-nowrap', className)}>
      <button type="button" onClick={() => aoOrdenar(coluna)} className={cn('inline-flex items-center gap-1 rounded hover:text-(--s-fg)', ativa && 'text-(--s-fg)')}>
        {rotulo}
        <Icone className={cn('size-3', !ativa && 'opacity-50')} aria-hidden />
      </button>
    </th>
  );
}

function Detalhe({ d, p }: { d: Demo; p: Processo }) {
  const prazos = d.prazos.filter((z) => z.processoId === p.id);
  return (
    <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <p className="f-mono mb-2 text-[10.5px] tracking-[0.12em] text-(--s-faint) uppercase">Movimentações</p>
        <LinhaDoTempo eventos={eventosDoProcesso(p)} agora={d.agora} rotulo={`Movimentações do processo ${p.cnj}`} compacta fundoRotulo="bg-(--s-card-2)" />
      </div>
      <dl className="grid h-fit gap-3 rounded-xl bg-(--s-card) p-4 text-[12.5px] ring-1 ring-(--s-border)">
        {[
          ['Assunto', p.titulo],
          ['Parte contrária', p.parteContraria],
          ['Polo', p.polo === 'ativo' ? 'Ativo (autor)' : 'Passivo (réu)'],
          ['Órgão', `${p.tribunal} · ${p.orgao}`],
          ['Valor da causa', moeda(p.valorCausa)],
          ['Distribuído em', dataCompleta(p.distribuidoEm)],
        ].map(([k, v]) => (
          <div key={k} className="grid gap-0.5">
            <dt className="text-[11px] text-(--s-faint)">{k}</dt>
            <dd className="text-(--s-fg-2)">{v}</dd>
          </div>
        ))}
        <div className="grid gap-1.5 border-t border-(--s-border) pt-3">
          <dt className="text-[11px] text-(--s-faint)">Prazos</dt>
          {prazos.length === 0 && <dd className="text-(--s-muted)">Nenhum prazo aberto.</dd>}
          {prazos.map((z) => (
            <dd key={z.id} className="flex items-center gap-2">
              <SeloPrazo data={z.data} hoje={d.hoje} />
              <span className="min-w-0 flex-1 truncate text-(--s-fg-2)">{z.titulo}</span>
              {z.avisarWhatsapp && <MessageCircle className="size-3.5 text-(--s-ok)" aria-label="Aviso no WhatsApp" />}
            </dd>
          ))}
        </div>
      </dl>
    </div>
  );
}

export function TelaProcessos() {
  const d = useDemo();
  const params = useSearchParams();
  const alvo = params.get('p');

  const [busca, setBusca] = React.useState('');
  const [area, setArea] = React.useState('');
  const [sistema, setSistema] = React.useState('');
  const [fase, setFase] = React.useState<Fase | ''>('');
  const [resp, setResp] = React.useState('');
  const [ordem, setOrdem] = React.useState<Ordem>({ coluna: 'andamento', dir: 'desc' });
  const [pagina, setPagina] = React.useState(0);
  const [abertos, setAbertos] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!alvo || !d) return;
    const p = d.processos.find((x) => x.id === alvo);
    if (!p) return;
    setBusca(p.cnj);
    setAbertos(new Set([p.id]));
    setPagina(0);
  }, [alvo, d]);

  const filtrados = React.useMemo(() => {
    if (!d) return [];
    const q = busca.trim().toLowerCase();
    const qDig = q.replace(/\D/g, '');
    return d.processos
      .filter((p) => {
        if (area && p.area !== area) return false;
        if (sistema && p.sistema !== sistema) return false;
        if (fase && p.fase !== fase) return false;
        if (resp && p.responsavelId !== resp) return false;
        if (!q) return true;
        const cli = clientePorId(d, p.clienteId)?.nome.toLowerCase() ?? '';
        return p.cnj.includes(q) || (qDig.length >= 4 && p.cnj.replace(/\D/g, '').includes(qDig)) || cli.includes(q) || p.titulo.toLowerCase().includes(q) || p.parteContraria.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const va = valorOrdem(d, a, ordem.coluna);
        const vb = valorOrdem(d, b, ordem.coluna);
        const r = typeof va === 'string' ? va.localeCompare(vb as string, 'pt-BR') : va - (vb as number);
        return ordem.dir === 'asc' ? r : -r;
      });
  }, [d, busca, area, sistema, fase, resp, ordem]);

  if (!d) return <EsqueletoTela />;

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pag = Math.min(pagina, paginas - 1);
  const visiveis = filtrados.slice(pag * POR_PAGINA, pag * POR_PAGINA + POR_PAGINA);
  const temFiltro = !!(busca || area || sistema || fase || resp);
  const limpar = () => {
    setBusca('');
    setArea('');
    setSistema('');
    setFase('');
    setResp('');
    setPagina(0);
  };
  const ordenar = (c: Coluna) => setOrdem((o) => (o.coluna === c ? { coluna: c, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { coluna: c, dir: c === 'andamento' ? 'desc' : 'asc' }));
  const alternar = (id: string) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <>
      <CabecalhoTela titulo="Processos" subtitulo={`${d.processos.length} processos monitorados nos tribunais (e-SAJ, eproc, PJe) e no DJEN.`} />

      {/* trilho de fases (filtro) */}
      <nav aria-label="Filtrar por fase" className="sem-rolagem -mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ol className="flex min-w-max items-center gap-1">
          {FASES.map((f, i) => {
            const n = d.processos.filter((p) => p.fase === f.id).length;
            const ativa = fase === f.id;
            return (
              <li key={f.id} className="flex items-center gap-1">
                <button
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => {
                    setFase(ativa ? '' : f.id);
                    setPagina(0);
                  }}
                  className={cn(
                    'group inline-flex h-9 items-center gap-2 rounded-full pr-2 pl-3 text-[12.5px] ring-1 ring-inset transition-colors',
                    ativa ? 'bg-(--s-primary) text-(--s-primary-fg) ring-(--s-primary)' : 'bg-(--s-card) text-(--s-fg-2) ring-(--s-border) hover:ring-(--s-border-2)',
                  )}
                >
                  <span className="f-mono text-[10px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  {f.rotulo}
                  <span className={cn('f-mono grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10.5px] tabular-nums', ativa ? 'bg-(--s-primary-fg)/15' : 'bg-(--s-elev) text-(--s-muted)')}>{n}</span>
                </button>
                {i < FASES.length - 1 && <ChevronRight aria-hidden className="size-3.5 text-(--s-faint)" />}
              </li>
            );
          })}
        </ol>
      </nav>

      <Cartao className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-(--s-border) p-3">
          <div className="w-full sm:w-72">
            <Entrada
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(0);
              }}
              placeholder="Buscar CNJ, cliente, assunto…"
              aria-label="Buscar processos"
              icone={<Search />}
            />
          </div>
          <Selecao rotulo="Área" valor={area} aoMudar={(v) => { setArea(v); setPagina(0); }} opcoes={[{ valor: '', rotulo: 'Todas as áreas' }, ...AREAS.map((a) => ({ valor: a, rotulo: a }))]} />
          <Selecao rotulo="Sistema do tribunal" valor={sistema} aoMudar={(v) => { setSistema(v); setPagina(0); }} opcoes={[{ valor: '', rotulo: 'Todos os sistemas' }, { valor: 'e-SAJ', rotulo: 'e-SAJ' }, { valor: 'eproc', rotulo: 'eproc' }, { valor: 'PJe', rotulo: 'PJe' }]} />
          <Selecao rotulo="Responsável" valor={resp} aoMudar={(v) => { setResp(v); setPagina(0); }} opcoes={[{ valor: '', rotulo: 'Todos os responsáveis' }, ...d.usuarios.map((u) => ({ valor: u.id, rotulo: u.nome }))]} />
          {temFiltro && (
            <Botao variante="fantasma" tamanho="sm" onClick={limpar}>
              <FilterX /> Limpar
            </Botao>
          )}
          <p className="ml-auto text-[12px] text-(--s-faint)" aria-live="polite">
            {filtrados.length} {filtrados.length === 1 ? 'processo' : 'processos'}
          </p>
        </div>

        {filtrados.length === 0 ? (
          <EstadoVazio icone={<SearchX />} titulo="Nenhum processo encontrado" texto="Tente outro número CNJ ou limpe os filtros." acao={<Botao variante="secundario" tamanho="sm" onClick={limpar}>Limpar filtros</Botao>} />
        ) : (
          <>
            {/* desktop: tabela */}
            <div className="rolagem relative hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[940px] border-collapse text-[13px]">
                <caption className="sr-only">Processos, com último andamento e próximo prazo. Use o botão de cada linha para ver as movimentações.</caption>
                <thead className="bg-(--s-card-2) text-[11.5px] text-(--s-muted)">
                  <tr className="border-b border-(--s-border)">
                    <th scope="col" className="w-10 px-2"><span className="sr-only">Expandir</span></th>
                    <CabecalhoOrdenavel rotulo="Nº CNJ" coluna="cnj" ordem={ordem} aoOrdenar={ordenar} />
                    <CabecalhoOrdenavel rotulo="Cliente" coluna="cliente" ordem={ordem} aoOrdenar={ordenar} />
                    <th scope="col" className="px-3 py-2.5 text-left font-medium">Tribunal</th>
                    <th scope="col" className="px-3 py-2.5 text-left font-medium">Fase</th>
                    <CabecalhoOrdenavel rotulo="Último andamento" coluna="andamento" ordem={ordem} aoOrdenar={ordenar} />
                    <CabecalhoOrdenavel rotulo="Próximo prazo" coluna="prazo" ordem={ordem} aoOrdenar={ordenar} />
                    <th scope="col" className="px-3 py-2.5 text-left font-medium">Resp.</th>
                  </tr>
                </thead>
                <tbody>
                  {visiveis.map((p) => {
                    const aberto = abertos.has(p.id);
                    const ua = ultimoAndamento(p);
                    const pz = proximoPrazo(d, p.id);
                    const u = usuarioPorId(d, p.responsavelId)!;
                    return (
                      <React.Fragment key={p.id}>
                        <tr
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('a,button')) return;
                            alternar(p.id);
                          }}
                          className={cn('cursor-pointer border-b border-(--s-border) transition-colors hover:bg-(--s-accent)/40', aberto && 'bg-(--s-accent)/50', alvo === p.id && 'shadow-[inset_3px_0_0_var(--s-primary)]')}
                        >
                          <td className="px-2 py-3 align-top">
                            <button type="button" onClick={() => alternar(p.id)} aria-expanded={aberto} aria-controls={`det-${p.id}`} aria-label={`${aberto ? 'Recolher' : 'Ver'} movimentações de ${p.cnj}`} className="grid size-7 place-items-center rounded-md text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg)">
                              <ChevronDown className={cn('size-4 transition-transform', aberto && 'rotate-180')} />
                            </button>
                          </td>
                          <td className="px-3 py-3 align-top">
                            <p className="f-mono text-[12px] whitespace-nowrap text-(--s-fg)">{p.cnj}</p>
                            <p className="mt-0.5 max-w-[220px] truncate text-[11.5px] text-(--s-faint)" title={p.titulo}>{p.titulo}</p>
                          </td>
                          <td className="max-w-[150px] px-3 py-3 align-top">
                            <Link href={`/sistema/demo/clientes?c=${p.clienteId}`} className="line-clamp-2 hover:text-(--s-primary) hover:underline">
                              {clientePorId(d, p.clienteId)?.nome}
                            </Link>
                            <Selo tom="contorno" className="mt-1">{p.area}</Selo>
                          </td>
                                                    <td className="px-3 py-3 align-top"><SeloSistema tribunal={p.tribunal} sistema={p.sistema} /></td>
                          <td className="px-3 py-3 align-top"><TrilhoFase fase={p.fase} className="hidden xl:inline-flex" /><span className="xl:hidden"><TrilhoFase fase={p.fase} compacto /><span className="mt-1 block text-[11.5px] text-(--s-fg-2)">{rotuloFase(p.fase)}</span></span></td>
                          <td className="max-w-[210px] px-3 py-3 align-top">
                            <p className="truncate text-(--s-fg-2)" title={ua?.titulo}>{ua?.titulo}</p>
                            <p className="mt-0.5 text-[11.5px] text-(--s-faint)">{ua && relativo(ua.data, d.agora)} · {ua?.fonte}</p>
                          </td>
                          <td className="px-3 py-3 align-top">
                            {pz ? (
                              <div className="grid gap-1">
                                <SeloPrazo data={pz.data} hoje={d.hoje} className="w-fit" />
                                <span className="max-w-[120px] truncate text-[11.5px] text-(--s-faint)" title={pz.titulo}>{dataCurta(pz.data)} · {pz.titulo}</span>
                              </div>
                            ) : (
                              <span className="text-[12px] text-(--s-faint)">—</span>
                            )}
                          </td>
                          <td className="px-3 py-3 align-top"><Avatar nome={u.nome} iniciais={u.iniciais} tamanho="sm" /></td>
                        </tr>
                        <AnimatePresence initial={false}>
                          {aberto && (
                            <tr id={`det-${p.id}`} className="border-b border-(--s-border) bg-(--s-card-2)">
                              <td colSpan={8} className="p-0">
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} className="overflow-hidden">
                                  <Detalhe d={d} p={p} />
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* celular/tablet: cartões */}
            <ul className="divide-y divide-(--s-border) lg:hidden">
              {visiveis.map((p) => {
                const aberto = abertos.has(p.id);
                const ua = ultimoAndamento(p);
                const pz = proximoPrazo(d, p.id);
                const u = usuarioPorId(d, p.responsavelId)!;
                return (
                  <li key={p.id} className={cn(aberto && 'bg-(--s-card-2)')}>
                    <button type="button" onClick={() => alternar(p.id)} aria-expanded={aberto} className="grid w-full grid-cols-[minmax(0,1fr)] gap-2 p-4 text-left">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="f-mono block text-[12px] break-all text-(--s-fg)">{p.cnj}</span>
                          <span className="mt-0.5 block text-[13.5px] font-medium">{clientePorId(d, p.clienteId)?.nome}</span>
                        </span>
                        {pz && <SeloPrazo data={pz.data} hoje={d.hoje} className="shrink-0" />}
                      </span>
                      <span className="line-clamp-2 text-[12.5px] text-(--s-muted)">{p.titulo}</span>
                      <span className="flex flex-wrap items-center gap-2">
                        <Selo tom="contorno">{p.area}</Selo>
                        <SeloSistema tribunal={p.tribunal} sistema={p.sistema} />
                        <TrilhoFase fase={p.fase} compacto />
                        <span className="text-[11.5px] text-(--s-fg-2)">{rotuloFase(p.fase)}</span>
                      </span>
                      <span className="flex items-center gap-2 rounded-lg bg-(--s-elev)/60 px-2.5 py-2 text-[12px]">
                        <span className="min-w-0 flex-1 truncate text-(--s-fg-2)">{ua?.titulo}</span>
                        <span className="shrink-0 text-(--s-faint)">{ua && relativo(ua.data, d.agora)}</span>
                      </span>
                      <span className="flex items-center justify-between text-[11.5px] text-(--s-faint)">
                        <span className="flex items-center gap-1.5">
                          <Avatar nome={u.nome} iniciais={u.iniciais} tamanho="xs" /> {u.nome}
                        </span>
                        <span className="inline-flex items-center gap-1 text-(--s-primary)">
                          {aberto ? 'Recolher' : 'Movimentações'} <ChevronDown className={cn('size-3.5 transition-transform', aberto && 'rotate-180')} aria-hidden />
                        </span>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {aberto && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <Detalhe d={d} p={p} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-(--s-border) px-4 py-3 text-[12px] text-(--s-muted)">
              <span>
                {pag * POR_PAGINA + 1}–{Math.min(filtrados.length, (pag + 1) * POR_PAGINA)} de {filtrados.length}
              </span>
              <div className="flex items-center gap-1">
                <Botao variante="fantasma" tamanho="iconeSm" aria-label="Página anterior" disabled={pag === 0} onClick={() => setPagina(pag - 1)}>
                  <ChevronLeft />
                </Botao>
                {Array.from({ length: paginas }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPagina(i)}
                    aria-current={i === pag ? 'page' : undefined}
                    aria-label={`Página ${i + 1}`}
                    className={cn('f-mono grid size-8 place-items-center rounded-lg text-[12px]', i === pag ? 'bg-(--s-accent) text-(--s-fg)' : 'hover:bg-(--s-accent)/50')}
                  >
                    {i + 1}
                  </button>
                ))}
                <Botao variante="fantasma" tamanho="iconeSm" aria-label="Próxima página" disabled={pag >= paginas - 1} onClick={() => setPagina(pag + 1)}>
                  <ChevronRight />
                </Botao>
              </div>
            </div>
          </>
        )}
      </Cartao>
    </>
  );
}
