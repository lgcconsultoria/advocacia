'use client';

/* Busca global ⌘K — porte do Command Menu (21st.dev 33510, @uvain) sobre cmdk
   + Radix Dialog. Encontra processo por número CNJ, cliente ou assunto, e
   leva às telas. */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Command as Cmdk } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, CornerDownLeft, FileText, Moon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from './demo-provider';
import { useTema } from './tema';
import { TODAS_NAV } from './navegacao';
import { clientePorId } from '@/lib/demo/dados';

/** Abre com ⌘K (Mac) ou Ctrl+K. */
export function useAtalhoComando() {
  const [aberto, setAberto] = React.useState(false);
  React.useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAberto((o) => !o);
      }
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);
  return [aberto, setAberto] as const;
}

const grupo =
  'py-1 [&_[cmdk-group-heading]]:font-[family-name:var(--fonte-mono)] [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-(--s-faint) [&_[cmdk-group-heading]]:uppercase';

function Item({ icone, children, dica, aoSelecionar, valor, palavras }: { icone: React.ReactNode; children: React.ReactNode; dica?: React.ReactNode; aoSelecionar: () => void; valor: string; palavras?: string[] }) {
  return (
    <Cmdk.Item
      value={valor}
      keywords={palavras}
      onSelect={aoSelecionar}
      className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] outline-none select-none data-[selected=true]:bg-(--s-accent) [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-(--s-muted)"
    >
      {icone}
      <span className="grid min-w-0 flex-1">
        <span className="truncate">{children}</span>
        {dica && <span className="truncate text-[11.5px] text-(--s-muted)">{dica}</span>}
      </span>
      <CornerDownLeft className="opacity-0 group-data-[selected=true]:opacity-100" aria-hidden />
    </Cmdk.Item>
  );
}

export function MenuComando({ aberto, aoMudar }: { aberto: boolean; aoMudar: (v: boolean) => void }) {
  const router = useRouter();
  const d = useDemo();
  const { alternar } = useTema();
  const ir = (href: string) => {
    aoMudar(false);
    router.push(href);
  };

  return (
    <Dialog.Root open={aberto} onOpenChange={aoMudar}>
      <AnimatePresence>
        {aberto && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[70] bg-(--s-overlay) backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed top-[12dvh] left-1/2 z-[71] w-[calc(100vw-24px)] max-w-[600px] overflow-hidden rounded-2xl bg-(--s-bg-2) text-(--s-fg) shadow-(--s-shadow) ring-1 ring-(--s-border-2) outline-none"
                initial={{ opacity: 0, scale: 0.97, x: '-50%', y: -6 }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
                exit={{ opacity: 0, scale: 0.97, x: '-50%', y: -6 }}
                transition={{ type: 'spring', stiffness: 520, damping: 38 }}
              >
                <Dialog.Title className="sr-only">Busca global</Dialog.Title>
                <Cmdk loop label="Busca global" className="flex w-full flex-col">
                  <div className="flex items-center gap-2.5 border-b border-(--s-border) px-4">
                    <Search aria-hidden className="size-4 shrink-0 text-(--s-muted)" />
                    <Cmdk.Input autoFocus placeholder="Buscar por nº CNJ, cliente ou assunto…" className="h-13 w-full bg-transparent text-[14px] outline-none placeholder:text-(--s-faint) focus-visible:outline-none" />
                  </div>
                  <Cmdk.List className="rolagem max-h-[min(400px,60dvh)] overflow-y-auto overscroll-contain p-1.5">
                    <Cmdk.Empty className="px-3 py-10 text-center text-[13px] text-(--s-muted)">Nada encontrado. Tente parte do número CNJ (ex.: 9000101).</Cmdk.Empty>
                    <Cmdk.Group heading="Ir para" className={grupo}>
                      {TODAS_NAV.map((n) => (
                        <Item key={n.href} valor={`ir ${n.titulo}`} icone={<n.icone />} aoSelecionar={() => ir(n.href)}>
                          {n.titulo}
                        </Item>
                      ))}
                    </Cmdk.Group>
                    {d && (
                      <>
                        <Cmdk.Group heading="Processos" className={grupo}>
                          {d.processos.map((p) => (
                            <Item
                              key={p.id}
                              valor={`${p.cnj} ${p.titulo}`}
                              palavras={[clientePorId(d, p.clienteId)?.nome ?? '', p.parteContraria, p.tribunal, p.area, p.cnj.replace(/\D/g, '')]}
                              icone={<FileText />}
                              dica={`${clientePorId(d, p.clienteId)?.nome} · ${p.tribunal} · ${p.titulo}`}
                              aoSelecionar={() => ir(`/sistema/demo/processos?p=${p.id}`)}
                            >
                              <span className="f-mono text-[12.5px]">{p.cnj}</span>
                            </Item>
                          ))}
                        </Cmdk.Group>
                        <Cmdk.Group heading="Clientes" className={grupo}>
                          {d.clientes.map((c) => (
                            <Item key={c.id} valor={`cliente ${c.nome}`} palavras={[c.cidade, ...c.areas]} icone={<Building2 />} dica={`${c.cidade} · ${c.areas.join(', ')}`} aoSelecionar={() => ir(`/sistema/demo/clientes?c=${c.id}`)}>
                              {c.nome}
                            </Item>
                          ))}
                        </Cmdk.Group>
                      </>
                    )}
                    <Cmdk.Group heading="Ações" className={grupo}>
                      <Item valor="alternar tema claro escuro" icone={<Moon />} aoSelecionar={() => { alternar(); aoMudar(false); }}>
                        Alternar tema claro/escuro
                      </Item>
                    </Cmdk.Group>
                  </Cmdk.List>
                  <div className="flex items-center gap-4 border-t border-(--s-border) px-4 py-2 text-[11.5px] text-(--s-faint)">
                    <span><kbd className="f-mono">↑↓</kbd> navegar</span>
                    <span><kbd className="f-mono">↵</kbd> abrir</span>
                    <span><kbd className="f-mono">esc</kbd> fechar</span>
                    <span className={cn('ml-auto hidden sm:inline')}>Dados fictícios</span>
                  </div>
                </Cmdk>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
