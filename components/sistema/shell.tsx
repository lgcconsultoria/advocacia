'use client';

/* Casca do Sistema 360 — porte do Dashboard Sidebar "Charcoal Ink"
   (21st.dev 14941, @arunjdass) recolorido para tinta: barra lateral com
   grupos e contadores, que recolhe para trilho de ícones no desktop e vira
   gaveta no celular; barra superior com busca ⌘K, sino e tema. */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, ChevronsUpDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoProvider, useDemo } from './demo-provider';
import { BotaoTema } from './tema';
import { NAVEGACAO, NAV_RODAPE, TODAS_NAV, type ItemNav } from './navegacao';
import { MenuComando, useAtalhoComando } from './comando';
import { PainelNotificacoes } from './notificacoes';
import { Gaveta } from './ui/gaveta';
import { Avatar } from './ui/avatar';
import { Kbd } from './ui/campo';
import { diasAte } from '@/lib/demo/formato';
import type { Notificacao } from '@/lib/demo/dados';

/* ---------------------------------------------------------------- banner -- */

export function FaixaDemonstracao({ outro }: { outro: { href: string; rotulo: string } }) {
  return (
    <div className="relative z-40 flex h-9 items-center justify-center gap-2 overflow-hidden bg-(--s-amber) px-3 text-[12px] font-medium text-[#1a1206]">
      <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
      <p className="truncate">
        <strong className="font-semibold">Demonstração com dados fictícios</strong>
        <span className="hidden sm:inline"> — nenhuma informação real, nada é salvo ou enviado.</span>
      </p>
      <span className="mx-1 hidden h-3.5 w-px bg-[#1a1206]/30 md:block" aria-hidden />
      <Link href={outro.href} className="hidden shrink-0 underline underline-offset-2 hover:no-underline md:inline">
        {outro.rotulo}
      </Link>
      <Link href="/entrar" className="shrink-0 underline underline-offset-2 hover:no-underline">
        Voltar ao login
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------- contadores -- */

function useContadores() {
  const d = useDemo();
  return React.useMemo(() => {
    if (!d) return {} as Record<NonNullable<ItemNav['contador']>, number>;
    return {
      prazosSemana: d.prazos.filter((p) => {
        const n = diasAte(p.data, d.hoje);
        return n >= 0 && n <= 7;
      }).length,
      publicacoesHoje: d.publicacoes.filter((p) => diasAte(p.data, d.hoje) === 0).length,
      leadsNovos: d.leads.filter((l) => l.etapa === 'novo').length,
      alertasAtivos: d.regras.filter((r) => r.ativo).length,
    };
  }, [d]);
}

/* ------------------------------------------------------------ navegação -- */

function LinkNav({ item, recolhida, ativo, contador, aoNavegar }: { item: ItemNav; recolhida: boolean; ativo: boolean; contador?: number; aoNavegar?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={aoNavegar}
      aria-current={ativo ? 'page' : undefined}
      title={recolhida ? item.titulo : undefined}
      className={cn(
        'group relative flex h-9 items-center gap-2.5 rounded-lg text-[13px] transition-colors',
        recolhida ? 'justify-center px-0' : 'px-2.5',
        ativo ? 'bg-(--s-accent) font-medium text-(--s-fg)' : 'text-(--s-muted) hover:bg-(--s-accent)/60 hover:text-(--s-fg)',
      )}
    >
      {ativo && <motion.span layoutId="nav-ativo" className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full bg-(--s-primary)" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
      <item.icone className={cn('size-[17px] shrink-0', ativo ? 'text-(--s-primary)' : 'text-(--s-faint) group-hover:text-(--s-fg-2)')} strokeWidth={1.7} aria-hidden />
      {!recolhida && <span className="truncate">{item.titulo}</span>}
      {!!contador && (
        <span
          className={cn(
            'f-mono grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10.5px] font-medium tabular-nums',
            recolhida ? 'absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px]' : 'ml-auto',
            item.contador === 'prazosSemana' ? 'bg-(--s-danger)/18 text-(--s-danger)' : item.contador === 'leadsNovos' ? 'bg-(--s-amber)/18 text-(--s-amber)' : 'bg-(--s-primary)/15 text-(--s-primary)',
          )}
        >
          {contador}
          <span className="sr-only"> itens</span>
        </span>
      )}
    </Link>
  );
}

function BarraLateral({ recolhida, aoNavegar, className }: { recolhida: boolean; aoNavegar?: () => void; className?: string }) {
  const pathname = usePathname();
  const contadores = useContadores();
  const d = useDemo();
  const ativo = (href: string) => (href === '/sistema/demo' ? pathname === href : pathname.startsWith(href));

  return (
    <nav aria-label="Navegação do sistema" className={cn('flex h-full flex-col gap-4 p-3', className)}>
      <div className={cn('flex items-center gap-2.5 rounded-lg py-1.5', recolhida ? 'justify-center' : 'px-1.5')}>
        <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#1d1b9a] ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo-mark-light.png" alt="" width={591} height={591} className="size-6" />
        </span>
        {!recolhida && (
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[13px] font-semibold">Senturião Advocacia</span>
            <span className="f-mono truncate text-[10.5px] tracking-[0.08em] text-(--s-faint) uppercase">Jurídico 360 · demo</span>
          </span>
        )}
        {!recolhida && <ChevronsUpDown className="size-4 shrink-0 text-(--s-faint)" aria-hidden />}
      </div>

      <div className="sem-rolagem -mx-1 flex flex-1 flex-col gap-4 overflow-y-auto px-1">
        {NAVEGACAO.map((g, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {g.titulo &&
              (recolhida ? (
                <span aria-hidden className="mx-auto my-1 h-px w-5 bg-(--s-border)" />
              ) : (
                <span className="f-mono mb-1 px-2.5 text-[10px] font-medium tracking-[0.14em] text-(--s-faint) uppercase">{g.titulo}</span>
              ))}
            {g.itens.map((it) => (
              <LinkNav key={it.id} item={it} recolhida={recolhida} ativo={ativo(it.href)} contador={it.contador ? contadores[it.contador] : undefined} aoNavegar={aoNavegar} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-0.5 border-t border-(--s-border) pt-3">
        {NAV_RODAPE.map((it) => (
          <LinkNav key={it.id} item={it} recolhida={recolhida} ativo={ativo(it.href)} aoNavegar={aoNavegar} />
        ))}
        <Link
          href="/entrar"
          title={recolhida ? 'Sair da demonstração' : undefined}
          className={cn('flex h-9 items-center gap-2.5 rounded-lg text-[13px] text-(--s-muted) transition-colors hover:bg-(--s-accent)/60 hover:text-(--s-fg)', recolhida ? 'justify-center' : 'px-2.5')}
        >
          <LogOut className="size-[17px] shrink-0 text-(--s-faint)" strokeWidth={1.7} aria-hidden />
          {!recolhida && 'Sair da demonstração'}
        </Link>
        {d && (
          <div className={cn('mt-2 flex items-center gap-2.5 rounded-xl bg-(--s-card) p-2 ring-1 ring-(--s-border)', recolhida && 'justify-center bg-transparent p-0 ring-0')}>
            <Avatar nome={d.eu.nome} iniciais={d.eu.iniciais} tamanho="sm" />
            {!recolhida && (
              <span className="grid min-w-0 leading-tight">
                <span className="truncate text-[12.5px] font-medium">{d.eu.nome}</span>
                <span className="truncate text-[11px] text-(--s-faint)">{d.eu.cargo} · papel: sócio</span>
              </span>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

/* ----------------------------------------------------------------- casca -- */

function CascaInterna({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const d = useDemo();
  const [recolhida, setRecolhida] = React.useState(false);
  const [menuMovel, setMenuMovel] = React.useState(false);
  const [comando, setComando] = useAtalhoComando();
  const [sino, setSino] = React.useState(false);
  const [notificacoes, setNotificacoes] = React.useState<Notificacao[]>([]);
  const sinoRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (d) setNotificacoes(d.notificacoes);
  }, [d]);

  React.useEffect(() => {
    try {
      setRecolhida(window.localStorage.getItem('s360:recolhida') === '1');
    } catch {}
  }, []);
  const alternarRecolhida = () => {
    setRecolhida((r) => {
      try {
        window.localStorage.setItem('s360:recolhida', r ? '0' : '1');
      } catch {}
      return !r;
    });
  };

  const atual = TODAS_NAV.filter((n) => (n.href === '/sistema/demo' ? pathname === n.href : pathname.startsWith(n.href))).pop();
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="min-h-dvh" style={{ ['--s-topo' as string]: '92px' }}>
      <a href="#conteudo" className="sr-only z-[90] rounded-lg bg-(--s-primary) px-3 py-2 text-(--s-primary-fg) focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Pular para o conteúdo
      </a>
      <div className="sticky top-0 z-40">
        <FaixaDemonstracao outro={{ href: '/cliente/demo', rotulo: 'Ver o portal do cliente' }} />
      </div>

      <div className="flex">
        <motion.aside
          initial={false}
          animate={{ width: recolhida ? 68 : 252 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="sticky top-9 hidden h-[calc(100dvh-36px)] shrink-0 overflow-hidden border-r border-(--s-border) bg-(--s-bg-2) lg:block"
        >
          <BarraLateral recolhida={recolhida} />
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-9 z-30 flex h-14 items-center gap-2 border-b border-(--s-border) bg-(--s-bg)/85 px-3 backdrop-blur-md sm:px-5">
            <button
              type="button"
              onClick={() => setMenuMovel(true)}
              aria-label="Abrir menu"
              className="grid size-9 place-items-center rounded-lg text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg) lg:hidden"
            >
              <Menu className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={alternarRecolhida}
              aria-label={recolhida ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              aria-pressed={recolhida}
              className="hidden size-9 place-items-center rounded-lg text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg) lg:grid"
            >
              {recolhida ? <PanelLeftOpen className="size-[18px]" strokeWidth={1.6} /> : <PanelLeftClose className="size-[18px]" strokeWidth={1.6} />}
            </button>
            <nav aria-label="Trilha" className="hidden min-w-0 items-center gap-2 text-[13px] text-(--s-faint) sm:flex">
              <span className="truncate">Jurídico 360</span>
              <span aria-hidden>/</span>
              <span className="truncate font-medium text-(--s-fg)">{atual?.titulo ?? 'Painel'}</span>
            </nav>

            <button
              type="button"
              onClick={() => setComando(true)}
              className="ml-auto flex h-9 w-full max-w-[340px] min-w-0 items-center gap-2 rounded-lg bg-(--s-card) px-3 text-[13px] text-(--s-faint) ring-1 ring-inset ring-(--s-border) transition-colors hover:text-(--s-muted) hover:ring-(--s-border-2) sm:w-72"
            >
              <Search className="size-4 shrink-0" aria-hidden />
              <span className="truncate">Buscar CNJ, cliente…</span>
              <span className="ml-auto hidden items-center gap-1 sm:flex">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </button>

            <button
              ref={sinoRef}
              type="button"
              onClick={() => setSino((s) => !s)}
              aria-label={`Notificações${naoLidas ? `, ${naoLidas} não lidas` : ''}`}
              aria-expanded={sino}
              aria-haspopup="dialog"
              className={cn('relative grid size-9 shrink-0 place-items-center rounded-lg text-(--s-muted) hover:bg-(--s-accent) hover:text-(--s-fg)', sino && 'bg-(--s-accent) text-(--s-fg)')}
            >
              <Bell className="size-[18px]" strokeWidth={1.6} />
              {naoLidas > 0 && (
                <span aria-hidden className="f-mono absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-(--s-danger) px-1 text-[9px] font-semibold text-white ring-2 ring-(--s-bg)">
                  {naoLidas}
                </span>
              )}
            </button>
            <BotaoTema className="shrink-0" />
            {d && <Avatar nome={d.eu.nome} iniciais={d.eu.iniciais} tamanho="sm" className="hidden shrink-0 sm:inline-grid" />}
          </header>

          <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1480px] min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>

      <Gaveta aberta={menuMovel} aoMudar={setMenuMovel} titulo="Menu" lado="esquerda" largura="max-w-[300px]" semCabecalho>
        <BarraLateral recolhida={false} aoNavegar={() => setMenuMovel(false)} />
      </Gaveta>
      <MenuComando aberto={comando} aoMudar={setComando} />
      {d && <PainelNotificacoes aberto={sino} aoMudar={setSino} itens={notificacoes} aoMudarItens={setNotificacoes} agora={d.agora} ancora={sinoRef} />}
    </div>
  );
}

export function ShellSistema({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <CascaInterna>{children}</CascaInterna>
    </DemoProvider>
  );
}

/* --------------------------------------------------------- cabeçalho tela -- */

export function CabecalhoTela({ titulo, destaque, subtitulo, acoes, voltar }: { titulo: string; destaque?: string; subtitulo?: React.ReactNode; acoes?: React.ReactNode; voltar?: { href: string; rotulo: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {voltar && (
          <Link href={voltar.href} className="mb-2 inline-flex items-center gap-1.5 text-[12.5px] text-(--s-muted) hover:text-(--s-fg)">
            <ArrowLeft className="size-3.5" aria-hidden /> {voltar.rotulo}
          </Link>
        )}
        <h1 className="f-exp text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          {titulo} {destaque && <span className="f-serif font-normal tracking-normal text-(--s-primary)">{destaque}</span>}
        </h1>
        {subtitulo && <p className="mt-1.5 text-[13.5px] text-(--s-muted)">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}
