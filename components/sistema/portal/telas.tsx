'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CalendarClock, Check, CheckCircle2, ChevronDown, CircleDot, Clock3, Download, FileStack, FileText, MessageCircle, Receipt, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo, type Demo } from '../demo-provider';
import { Cartao, CabecalhoCartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Selo } from '../ui/selo';
import { Avatar } from '../ui/avatar';
import { EsqueletoTela, EstadoVazio } from '../ui/vazio';
import { EnvioArquivos } from '../envio-arquivos';
import { LINK_ADVOGADO } from './shell';
import { FASES, type Fase, type Processo } from '@/lib/demo/dados';
import { dataCompleta, dataMedia, diasAte, hora, iniciais, moeda, relativo, rotuloD } from '@/lib/demo/formato';

/* ------------------------------------------------------- linguagem simples -- */

const FASE_SIMPLES: Record<Fase, { titulo: string; texto: string }> = {
  'peticao-inicial': { titulo: 'Pedido apresentado', texto: 'Entramos com o processo e aguardamos o juiz recebê-lo.' },
  citacao: { titulo: 'Outra parte avisada', texto: 'A Justiça está comunicando a outra parte sobre o processo.' },
  contestacao: { titulo: 'Defesa da outra parte', texto: 'A outra parte apresenta a versão dela; depois respondemos.' },
  instrucao: { titulo: 'Provas e argumentos', texto: 'Cada lado apresenta documentos e explicações ao juiz.' },
  sentenca: { titulo: 'Decisão do juiz', texto: 'O juiz analisa tudo e decide o caso.' },
  recurso: { titulo: 'Recurso ao tribunal', texto: 'A decisão é revista por desembargadores.' },
  cumprimento: { titulo: 'Cumprimento', texto: 'Fase de fazer valer o que foi decidido (pagamento, entrega etc.).' },
};

const processosDoCliente = (d: Demo) => d.processos.filter((p) => p.clienteId === d.portal.clienteId);

function proximoPasso(d: Demo, p: Processo) {
  return p.andamentos.find((a) => a.paraCliente?.proximo)?.paraCliente?.proximo ?? FASE_SIMPLES[p.fase].texto;
}

function JornadaFases({ fase, compacta }: { fase: Fase; compacta?: boolean }) {
  const idx = FASES.findIndex((f) => f.id === fase);
  return (
    <ol className={cn('grid grid-cols-7 gap-1', !compacta && 'gap-1.5')} aria-label={`Etapa atual: ${FASE_SIMPLES[fase].titulo} (${idx + 1} de 7)`}>
      {FASES.map((f, i) => (
        <li key={f.id} className="grid gap-1.5">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={cn('h-1.5 origin-left rounded-full', i < idx ? 'bg-(--s-primary)/55' : i === idx ? 'bg-(--s-primary)' : 'bg-(--s-border-2)')}
          />
          {!compacta && <span className={cn('hidden text-[10.5px] leading-tight md:block', i === idx ? 'font-medium text-(--s-fg)' : 'text-(--s-faint)')}>{FASE_SIMPLES[f.id].titulo}</span>}
        </li>
      ))}
    </ol>
  );
}

function CartaoProcesso({ d, p }: { d: Demo; p: Processo }) {
  const ultimo = p.andamentos.find((a) => a.paraCliente);
  return (
    <Link href={`/cliente/demo/processos/${p.id}`} className="group grid gap-3 rounded-2xl bg-(--s-card) p-5 ring-1 ring-(--s-border) transition-[box-shadow,background-color] hover:bg-(--s-card-2) hover:ring-(--s-border-2)">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Selo tom={p.area === 'Tributário' ? 'ambar' : 'marca'}>{p.area}</Selo>
          <h3 className="mt-2 text-[15px] leading-snug font-semibold">{p.titulo}</h3>
          <p className="mt-1 text-[12.5px] text-(--s-muted)">contra {p.parteContraria}</p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-(--s-faint) transition-transform group-hover:translate-x-0.5 group-hover:text-(--s-fg)" aria-hidden />
      </div>
      <JornadaFases fase={p.fase} compacta />
      <p className="text-[12.5px] text-(--s-fg-2)">
        <span className="font-medium text-(--s-fg)">{FASE_SIMPLES[p.fase].titulo}.</span> {ultimo?.paraCliente?.aconteceu}
      </p>
      <p className="flex items-center gap-1.5 text-[11.5px] text-(--s-faint)">
        <Clock3 className="size-3.5" aria-hidden /> Atualizado {ultimo ? relativo(ultimo.data, d.agora) : '—'}
      </p>
    </Link>
  );
}

/* ------------------------------------------------------------ visão geral -- */

export function PortalVisaoGeral() {
  const d = useDemo();
  const [msgs, setMsgs] = React.useState<Demo['portal']['mensagens']>([]);
  const [texto, setTexto] = React.useState('');
  React.useEffect(() => {
    if (d) setMsgs(d.portal.mensagens);
  }, [d]);
  if (!d) return <EsqueletoTela />;

  const procs = processosDoCliente(d);
  const pendentes = d.portal.documentos.filter((x) => x.status === 'pendente');
  const proxFatura = d.faturas.filter((f) => f.clienteId === d.portal.clienteId && f.status !== 'paga').sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime())[0];
  const passos = [
    ...pendentes.map((x) => ({ id: x.id, quem: 'Você', texto: `Enviar: ${x.nome}`, data: x.prazo, href: '/cliente/demo/documentos' })),
    ...d.prazos
      .filter((z) => procs.some((p) => p.id === z.processoId) && diasAte(z.data, d.hoje) >= 0)
      .slice(0, 3)
      .map((z) => ({ id: z.id, quem: 'Escritório', texto: z.tipo === 'reuniao' ? z.titulo : `${z.titulo} (nós cuidamos disso)`, data: z.data, href: `/cliente/demo/processos/${z.processoId}` })),
  ].sort((a, b) => (a.data?.getTime() ?? 0) - (b.data?.getTime() ?? 0));

  return (
    <>
      <div className="mb-7">
        <p className="f-mono text-[11px] tracking-[0.14em] text-(--s-primary) uppercase">Empresa Exemplo Ltda.</p>
        <h1 className="f-exp mt-2 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          Olá, Lúcia. <span className="f-serif font-normal tracking-normal text-(--s-primary)">Seus processos, à vista.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] text-(--s-muted)">
          Você tem {procs.length} processos em andamento e {pendentes.length} documentos para enviar. Aqui tudo é explicado em linguagem simples — os detalhes técnicos ficam a um clique.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section aria-labelledby="t-procs" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 id="t-procs" className="text-[15px] font-semibold">Meus processos</h2>
            <Link href="/cliente/demo/processos" className="text-[12.5px] text-(--s-primary) hover:underline">Ver todos</Link>
          </div>
          {procs.map((p) => (
            <CartaoProcesso key={p.id} d={d} p={p} />
          ))}
        </section>

        <div className="grid h-fit gap-4">
          <Cartao>
            <CabecalhoCartao titulo="Próximos passos" subtitulo="O que acontece nos próximos dias" icone={<CalendarClock />} />
            <ol className="mt-3 grid gap-1 px-3 pb-3">
              {passos.map((s) => (
                <li key={s.id}>
                  <Link href={s.href} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-(--s-accent)/50">
                    <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full', s.quem === 'Você' ? 'bg-(--s-amber)/18 text-(--s-amber)' : 'bg-(--s-primary)/15 text-(--s-primary)')}>
                      <CircleDot className="size-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] leading-snug">{s.texto}</span>
                      <span className="text-[11.5px] text-(--s-faint)">
                        {s.quem} · {s.data ? `${dataMedia(s.data)} (${rotuloD(s.data, d.hoje)})` : 'sem data'}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Cartao>

          <Cartao className="overflow-hidden">
            <CabecalhoCartao
              titulo="Documentos pendentes"
              icone={<FileStack />}
              acoes={<Selo tom="ambar">{pendentes.length} para enviar</Selo>}
            />
            <ul className="mt-3 grid gap-2 px-5 pb-4">
              {pendentes.map((x) => (
                <li key={x.id} className="flex items-center gap-3 rounded-xl bg-(--s-card-2) px-3 py-2.5 ring-1 ring-inset ring-(--s-border)">
                  <FileText className="size-4 shrink-0 text-(--s-amber)" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{x.nome}</span>
                    <span className="text-[11.5px] text-(--s-faint)">até {x.prazo && dataMedia(x.prazo)}</span>
                  </span>
                </li>
              ))}
              <Botao asChild variante="secundario" tamanho="sm" className="mt-1 w-full">
                <Link href="/cliente/demo/documentos">Enviar documentos</Link>
              </Botao>
            </ul>
          </Cartao>

          <Cartao className="flex flex-col overflow-hidden">
            <CabecalhoCartao titulo="Mensagens" subtitulo="Conversa com a equipe" icone={<MessageCircle />} />
            <ol className="rolagem mt-3 grid max-h-[320px] gap-3 overflow-y-auto px-4 pb-3" aria-live="polite">
              {msgs.map((m) => (
                <li key={m.id} className={cn('flex gap-2', m.de === 'cliente' && 'flex-row-reverse')}>
                  <Avatar nome={m.autor} iniciais={iniciais(m.autor)} tamanho="xs" className="mt-1" />
                  <div className={cn('max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed', m.de === 'cliente' ? 'rounded-tr-sm bg-(--s-primary) text-(--s-primary-fg)' : 'rounded-tl-sm bg-(--s-card-2) text-(--s-fg-2) ring-1 ring-inset ring-(--s-border)')}>
                    <p className={cn('mb-0.5 text-[11px] font-medium', m.de === 'cliente' ? 'opacity-80' : 'text-(--s-fg)')}>
                      {m.autor} · {hora(m.quando)}
                    </p>
                    {m.texto}
                  </div>
                </li>
              ))}
            </ol>
            <form
              className="flex items-center gap-2 border-t border-(--s-border) p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!texto.trim()) return;
                setMsgs((s) => [...s, { id: `m-${Date.now()}`, de: 'cliente', autor: 'Lúcia Exemplo', texto: `${texto.trim()} (demonstração — não enviada)`, quando: new Date(d.agora.getTime() + 60000) }]);
                setTexto('');
              }}
            >
              <label htmlFor="msg" className="sr-only">Escrever mensagem</label>
              <input id="msg" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva uma mensagem…" className="h-10 min-w-0 flex-1 rounded-lg bg-(--s-card-2) px-3 text-[13px] ring-1 ring-inset ring-(--s-border-2) placeholder:text-(--s-faint) focus:ring-2 focus:ring-(--s-ring) focus:outline-none" />
              <Botao type="submit" tamanho="icone" aria-label="Enviar mensagem">
                <Send />
              </Botao>
            </form>
          </Cartao>

          {proxFatura && (
            <Cartao className="p-5">
              <p className="flex items-center gap-2 text-[12px] text-(--s-muted)">
                <Receipt className="size-4" aria-hidden /> {proxFatura.status === 'vencida' ? 'Fatura em aberto' : 'Próxima fatura'}
              </p>
              <p className="f-exp mt-2 text-[24px] font-semibold tracking-[-0.02em]">{moeda(proxFatura.valor)}</p>
              <p className="text-[12.5px] text-(--s-muted)">
                {proxFatura.status === 'vencida' ? (
                  <span className="font-medium text-(--s-danger)">Venceu em {dataMedia(proxFatura.vencimento)}</span>
                ) : (
                  <>vence em {dataMedia(proxFatura.vencimento)}</>
                )}{' '}
                · {proxFatura.descricao}
              </p>
              <Link href="/cliente/demo/financeiro" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-(--s-primary) hover:underline">
                Contrato e faturas <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </Cartao>
          )}
        </div>
      </div>
      <BotaoWhatsappFlutuante />
    </>
  );
}

export function BotaoWhatsappFlutuante() {
  return (
    <a
      href={LINK_ADVOGADO}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-24 z-30 inline-flex items-center gap-2 rounded-full bg-[#1f9d57] px-4 py-3 text-[13px] font-medium text-white shadow-(--s-shadow) transition-transform hover:-translate-y-0.5 sm:bottom-6 md:hidden"
    >
      <MessageCircle className="size-4" aria-hidden /> Falar com o advogado
    </a>
  );
}

/* --------------------------------------------------------------- processos -- */

export function PortalProcessos() {
  const d = useDemo();
  if (!d) return <EsqueletoTela />;
  const procs = processosDoCliente(d);
  return (
    <>
      <h1 className="f-exp mb-2 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.03em]">Meus processos</h1>
      <p className="mb-6 text-[14px] text-(--s-muted)">Toque em um processo para ver o que já aconteceu e o que vem agora.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {procs.map((p) => (
          <CartaoProcesso key={p.id} d={d} p={p} />
        ))}
      </div>
      <BotaoWhatsappFlutuante />
    </>
  );
}

export function PortalProcesso({ id }: { id: string }) {
  const d = useDemo();
  const [tecnico, setTecnico] = React.useState(false);
  if (!d) return <EsqueletoTela />;
  const p = processosDoCliente(d).find((x) => x.id === id);
  if (!p) return <EstadoVazio icone={<FileText />} titulo="Processo não encontrado" texto="Ele pode ter sido arquivado ou não pertence a esta empresa." acao={<Botao asChild variante="secundario" tamanho="sm"><Link href="/cliente/demo/processos">Voltar aos processos</Link></Botao>} />;
  const comTexto = p.andamentos.filter((a) => a.paraCliente);
  const agora = comTexto[0];
  const resp = d.usuarios.find((u) => u.id === p.responsavelId)!;

  return (
    <>
      <Link href="/cliente/demo/processos" className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] text-(--s-muted) hover:text-(--s-fg)">
        ← Meus processos
      </Link>
      <div className="mb-6 grid gap-3">
        <Selo tom={p.area === 'Tributário' ? 'ambar' : 'marca'} className="w-fit">{p.area}</Selo>
        <h1 className="f-exp text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.12] font-semibold tracking-[-0.03em]">{p.titulo}</h1>
        {p.resumoCliente && <p className="max-w-3xl text-[14.5px] leading-relaxed text-(--s-fg-2)">{p.resumoCliente}</p>}
      </div>

      <Cartao className="mb-4 p-5">
        <p className="mb-3 text-[12px] text-(--s-muted)">
          Etapa {FASES.findIndex((f) => f.id === p.fase) + 1} de 7 · <strong className="font-medium text-(--s-fg)">{FASE_SIMPLES[p.fase].titulo}</strong>
        </p>
        <JornadaFases fase={p.fase} />
      </Cartao>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid h-fit gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Cartao className="p-5">
              <p className="flex items-center gap-2 text-[12px] font-medium text-(--s-muted)">
                <CheckCircle2 className="size-4 text-(--s-ok)" aria-hidden /> O que aconteceu
              </p>
              <p className="mt-2 text-[14px] leading-relaxed">{agora?.paraCliente?.aconteceu}</p>
              <p className="mt-2 text-[11.5px] text-(--s-faint)">{agora && relativo(agora.data, d.agora)}</p>
            </Cartao>
            <Cartao className="overflow-hidden p-5 ring-(--s-primary)/40">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-(--s-primary)" />
              <p className="flex items-center gap-2 text-[12px] font-medium text-(--s-primary)">
                <Sparkles className="size-4" aria-hidden /> O que vem agora
              </p>
              <p className="mt-2 text-[14px] leading-relaxed">{proximoPasso(d, p)}</p>
            </Cartao>
          </div>

          <Cartao className="p-5">
            <h2 className="mb-4 text-[15px] font-semibold">Linha do tempo</h2>
            <ol className="relative grid gap-5">
              {comTexto.map((a, i) => (
                <motion.li key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="relative grid grid-cols-[32px_1fr] gap-3">
                  {i < comTexto.length - 1 && <span aria-hidden className="absolute top-8 bottom-[-20px] left-[15.5px] w-px bg-(--s-border-2)" />}
                  <span className={cn('relative grid size-8 place-items-center rounded-full ring-1 ring-inset', i === 0 ? 'bg-(--s-primary) text-(--s-primary-fg) ring-(--s-primary)' : 'bg-(--s-elev) text-(--s-muted) ring-(--s-border-2)')}>
                    {i === 0 ? <CircleDot className="size-4" aria-hidden /> : <Check className="size-3.5" aria-hidden />}
                  </span>
                  <div className="min-w-0 pt-1">
                    <p className="f-mono text-[11px] text-(--s-faint)">{dataCompleta(a.data)}</p>
                    <p className="mt-1 text-[14px] leading-relaxed">{a.paraCliente!.aconteceu}</p>
                    {a.paraCliente!.proximo && (
                      <p className="mt-2 rounded-xl bg-(--s-primary)/8 px-3 py-2 text-[13px] text-(--s-fg-2) ring-1 ring-inset ring-(--s-primary)/20">
                        <span className="font-medium text-(--s-primary)">E agora: </span>
                        {a.paraCliente!.proximo}
                      </p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ol>
          </Cartao>
        </div>

        <div className="grid h-fit gap-4">
          <Cartao className="p-5">
            <p className="text-[12px] text-(--s-muted)">Quem cuida do seu processo</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar nome={resp.nome} iniciais={resp.iniciais} tamanho="lg" />
              <div>
                <p className="text-[14px] font-medium">{resp.nome}</p>
                <p className="text-[12px] text-(--s-muted)">{resp.cargo}</p>
              </div>
            </div>
            <Botao asChild className="mt-4 w-full">
              <a href={LINK_ADVOGADO} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> Falar com o advogado
              </a>
            </Botao>
            <p className="mt-2 text-center text-[11px] text-(--s-faint)">Abre o WhatsApp do escritório</p>
          </Cartao>

          <Cartao className="overflow-hidden">
            <button type="button" onClick={() => setTecnico((t) => !t)} aria-expanded={tecnico} className="flex w-full items-center justify-between px-5 py-4 text-left text-[13.5px] font-medium">
              Detalhes técnicos
              <ChevronDown className={cn('size-4 text-(--s-faint) transition-transform', tecnico && 'rotate-180')} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {tecnico && (
                <motion.dl initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid gap-3 overflow-hidden border-t border-(--s-border) px-5 py-4 text-[12.5px]">
                  {[
                    ['Número (CNJ)', p.cnj],
                    ['Tribunal', `${p.tribunal} · ${p.orgao}`],
                    ['Sistema', p.sistema],
                    ['Valor da causa', moeda(p.valorCausa)],
                    ['Último andamento oficial', p.andamentos[0].titulo],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-0.5">
                      <dt className="text-[11px] text-(--s-faint)">{k}</dt>
                      <dd className={cn('text-(--s-fg-2)', k === 'Número (CNJ)' && 'f-mono')}>{v}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}
            </AnimatePresence>
          </Cartao>
        </div>
      </div>
      <BotaoWhatsappFlutuante />
    </>
  );
}

/* ------------------------------------------------------------- documentos -- */

const STATUS_DOC = {
  pendente: { rotulo: 'Pendente', tom: 'ambar' as const },
  enviado: { rotulo: 'Em análise', tom: 'marca' as const },
  aprovado: { rotulo: 'Recebido', tom: 'ok' as const },
};

export function PortalDocumentos() {
  const d = useDemo();
  if (!d) return <EsqueletoTela />;
  const docs = d.portal.documentos;
  return (
    <>
      <h1 className="f-exp mb-2 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.03em]">Documentos</h1>
      <p className="mb-6 text-[14px] text-(--s-muted)">Envie o que pedimos e acompanhe o que já recebemos. Na demonstração, nenhum arquivo sai do seu navegador.</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Cartao className="p-5">
          <h2 className="mb-1 text-[15px] font-semibold">Enviar</h2>
          <p className="mb-4 text-[12.5px] text-(--s-muted)">Pedimos: {docs.filter((x) => x.status === 'pendente').map((x) => x.nome).join(' e ')}.</p>
          <EnvioArquivos />
        </Cartao>
        <Cartao className="overflow-hidden">
          <CabecalhoCartao titulo="Seus documentos" subtitulo={`${docs.length} no total`} />
          <ul className="mt-3 divide-y divide-(--s-border) border-t border-(--s-border)">
            {docs.map((x) => (
              <li key={x.id} className="flex items-start gap-3 px-5 py-3.5">
                <FileText className={cn('mt-0.5 size-4 shrink-0', x.status === 'pendente' ? 'text-(--s-amber)' : 'text-(--s-faint)')} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium">{x.nome}</p>
                  <p className="text-[12px] text-(--s-muted)">{x.descricao}</p>
                  <p className="mt-0.5 text-[11.5px] text-(--s-faint)">{x.status === 'pendente' ? `Enviar até ${x.prazo && dataMedia(x.prazo)} (${x.prazo && rotuloD(x.prazo, d.hoje)})` : `Enviado em ${x.enviadoEm && dataCompleta(x.enviadoEm)}`}</p>
                </div>
                <Selo tom={STATUS_DOC[x.status].tom}>{STATUS_DOC[x.status].rotulo}</Selo>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
      <BotaoWhatsappFlutuante />
    </>
  );
}

/* ------------------------------------------------------------- financeiro -- */

const STATUS_FAT = { paga: { rotulo: 'Paga', tom: 'ok' as const }, aberta: { rotulo: 'Em aberto', tom: 'ambar' as const }, vencida: { rotulo: 'Vencida', tom: 'perigo' as const } };

export function PortalFinanceiro() {
  const d = useDemo();
  if (!d) return <EsqueletoTela />;
  const c = d.portal.contrato;
  const fat = d.faturas.filter((f) => f.clienteId === d.portal.clienteId).sort((a, b) => b.vencimento.getTime() - a.vencimento.getTime());
  return (
    <>
      <h1 className="f-exp mb-2 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.03em]">Contrato e faturas</h1>
      <p className="mb-6 text-[14px] text-(--s-muted)">Tudo o que foi combinado, num só lugar.</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Cartao className="relative h-fit overflow-hidden p-5">
          <div aria-hidden className="absolute -top-20 -right-20 size-56 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--s-primary)_22%,transparent),transparent)]" />
          <p className="f-mono text-[10.5px] tracking-[0.12em] text-(--s-faint) uppercase">Contrato {c.numero}</p>
          <h2 className="mt-2 text-[16px] leading-snug font-semibold">{c.objeto}</h2>
          <dl className="mt-4 grid gap-3 text-[12.5px]">
            {[
              ['Honorários mensais', moeda(c.honorariosMensais)],
              ['Êxito', c.exito],
              ['Início', dataCompleta(c.inicio)],
              ['Renovação', dataCompleta(c.renovacao)],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-0.5">
                <dt className="text-[11px] text-(--s-faint)">{k}</dt>
                <dd className="text-(--s-fg-2)">{v}</dd>
              </div>
            ))}
          </dl>
          <Botao variante="secundario" tamanho="sm" className="mt-5 w-full" disabled title="Desativado na demonstração">
            <Download /> Baixar contrato (PDF)
          </Botao>
        </Cartao>
        <Cartao className="overflow-hidden">
          <CabecalhoCartao titulo="Faturas" subtitulo="Boleto e Pix disponíveis na versão final" />
          <ul className="mt-3 divide-y divide-(--s-border) border-t border-(--s-border)">
            {fat.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                <div className="min-w-0 flex-1 basis-[220px]">
                  <p className="text-[13.5px] font-medium">{f.descricao}</p>
                  <p className="text-[12px] text-(--s-muted)">
                    Competência {f.competencia} · vence {dataCompleta(f.vencimento)}
                  </p>
                </div>
                <span className="f-mono text-[13.5px] tabular-nums">{moeda(f.valor)}</span>
                <Selo tom={STATUS_FAT[f.status].tom}>{STATUS_FAT[f.status].rotulo}</Selo>
                {f.status !== 'paga' && (
                  <Botao variante="secundario" tamanho="sm" disabled title="Desativado na demonstração">
                    2ª via
                  </Botao>
                )}
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
      <BotaoWhatsappFlutuante />
    </>
  );
}
