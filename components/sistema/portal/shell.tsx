'use client';

/* Casca do portal do cliente: mais simples que a do sistema interno —
   marca, quatro abas, botão de falar com o advogado (WhatsApp). */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { FileStack, Gavel, Home, MessageCircle, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoProvider, useDemo } from '../demo-provider';
import { FaixaDemonstracao } from '../shell';
import { BotaoTema } from '../tema';
import { Botao } from '../ui/botao';
import { Avatar } from '../ui/avatar';
import { linkWhatsapp } from '@/lib/demo/dados';

const BASE = '/cliente/demo';
const ABAS = [
  { href: BASE, titulo: 'Visão geral', icone: Home },
  { href: `${BASE}/processos`, titulo: 'Meus processos', icone: Gavel },
  { href: `${BASE}/documentos`, titulo: 'Documentos', icone: FileStack },
  { href: `${BASE}/financeiro`, titulo: 'Contrato e faturas', icone: Receipt },
];

export const LINK_ADVOGADO = linkWhatsapp('Olá! Estou vendo a demonstração do portal do cliente do Jurídico 360 e gostaria de saber mais.');

function Casca({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const d = useDemo();
  const cliente = d?.clientes.find((c) => c.id === d.portal.clienteId);
  const ativa = (href: string) => (href === BASE ? pathname === BASE : pathname.startsWith(href));

  return (
    <div className="min-h-dvh pb-20 sm:pb-0">
      <a href="#conteudo" className="sr-only z-[90] rounded-lg bg-(--s-primary) px-3 py-2 text-(--s-primary-fg) focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Pular para o conteúdo
      </a>
      <div className="sticky top-0 z-40">
        <FaixaDemonstracao outro={{ href: '/sistema/demo', rotulo: 'Ver o sistema da equipe' }} />
        <header className="border-b border-(--s-border) bg-(--s-bg)/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:px-6">
            <Link href={BASE} className="flex shrink-0 items-center gap-2.5" aria-label="Portal do cliente — início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo-horizontal-light.png" alt="Douglas Senturião Advocacia" width={1151} height={399} className="h-8 w-auto [[data-tema=papel]_&]:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo-horizontal.png" alt="" width={1151} height={399} className="hidden h-8 w-auto [[data-tema=papel]_&]:block" />
              <span className="f-mono hidden rounded-md bg-(--s-accent) px-2 py-1 text-[10px] tracking-[0.12em] text-(--s-primary) uppercase md:inline">Portal do cliente</span>
            </Link>
            <nav aria-label="Seções do portal" className="mx-auto hidden items-center gap-1 sm:flex">
              {ABAS.map((a) => (
                <Link key={a.href} href={a.href} aria-current={ativa(a.href) ? 'page' : undefined} className={cn('relative rounded-lg px-3 py-2 text-[13px] transition-colors', ativa(a.href) ? 'text-(--s-fg)' : 'text-(--s-muted) hover:text-(--s-fg)')}>
                  {ativa(a.href) && <motion.span layoutId="aba-portal" className="absolute inset-0 rounded-lg bg-(--s-accent)" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span className="relative">{a.titulo}</span>
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
              <Botao asChild tamanho="sm" variante="secundario" className="hidden md:inline-flex">
                <a href={LINK_ADVOGADO} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="text-(--s-ok)" /> Falar com o advogado
                </a>
              </Botao>
              <BotaoTema />
              {cliente && <Avatar nome="Lúcia Exemplo" iniciais="LE" tamanho="sm" />}
            </div>
          </div>
        </header>
      </div>

      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1200px] px-4 py-6 outline-none sm:px-6 sm:py-8">
        {children}
      </main>

      {/* celular: abas no rodapé */}
      <nav aria-label="Seções do portal" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-(--s-border) bg-(--s-bg-2)/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        {ABAS.map((a) => (
          <Link key={a.href} href={a.href} aria-current={ativa(a.href) ? 'page' : undefined} className={cn('flex flex-col items-center gap-1 py-2.5 text-[10.5px]', ativa(a.href) ? 'text-(--s-primary)' : 'text-(--s-muted)')}>
            <a.icone className="size-5" strokeWidth={1.7} aria-hidden />
            {a.titulo.replace('Contrato e faturas', 'Faturas').replace('Meus processos', 'Processos')}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function ShellPortal({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <Casca>{children}</Casca>
    </DemoProvider>
  );
}
