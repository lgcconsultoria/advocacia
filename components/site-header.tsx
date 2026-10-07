'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, LockKeyhole, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Assinatura } from '@/components/site/marca';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

/**
 * Cabeçalho v2 — no estilo do 21st.dev `@laziekiki/morphing-scroll-navbar` (id 27428).
 * No topo é uma faixa transparente sobre o hero escuro; ao rolar vira cápsula
 * de tinta com vidro e, ao descer, encolhe (os links saem, ficam a marca e os
 * dois botões). Barra de progresso de leitura no topo. No celular, menu em
 * folha cheia. Movimento reduzido: troca seca, sem mola.
 */

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/tributario', label: 'Tributário' },
  { href: '/licitacoes', label: 'Licitações' },
  { href: '/areas', label: 'Áreas' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const reduzir = useReducedMotion();
  const [aberto, setAberto] = useState(false);
  const [noTopo, setNoTopo] = useState(true);
  const [descendo, setDescendo] = useState(false);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    let ultimo = window.scrollY;
    let raf = 0;
    const atualizar = () => {
      raf = 0;
      const y = window.scrollY;
      const d = y - ultimo;
      setNoTopo(y < 12);
      if (d > 6) setDescendo(true);
      else if (d < -6) setDescendo(false);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgresso(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      ultimo = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setAberto(false), [pathname]);
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', onKey);
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = antes;
    };
  }, [aberto]);

  const ativo = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const flutuando = !noTopo || aberto;
  const compacto = flutuando && descendo && !aberto;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[102] h-[2px] origin-left bg-[linear-gradient(90deg,var(--sinal),#c9c7ff_60%,var(--madeira))]"
        style={{ transform: `scaleX(${progresso})` }}
      />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-2.5 sm:px-5">
        <div
          className={cn(
            'pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 rounded-[22px] border text-white',
            reduzir
              ? 'transition-none'
              : 'transition-[max-width,height,margin,padding,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(.34,1.2,.5,1)]',
            flutuando
              ? 'mt-2.5 h-[60px] border-sinal/20 bg-tinta/75 pl-3.5 pr-1.5 shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_18px_50px_-24px_rgb(0_0_0/0.85)] backdrop-blur-xl backdrop-saturate-150 sm:pl-5 sm:pr-2'
              : 'mt-0 h-[var(--header-h)] border-transparent bg-transparent px-1.5 sm:px-3',
            compacto ? 'max-w-[680px]' : flutuando ? 'max-w-[1240px]' : 'max-w-[1300px]',
          )}
        >
          <Link href="/" className="min-w-0 shrink text-white no-underline" title="Página inicial" aria-label="Douglas Senturião Advocacia — página inicial">
            <Assinatura />
          </Link>

          <nav
            aria-label="Navegação principal"
            className={cn(
              'hidden items-center gap-0.5 overflow-hidden xl:flex',
              reduzir ? '' : 'transition-[max-width,opacity] duration-500',
              compacto ? 'pointer-events-none max-w-0 opacity-0' : 'max-w-[760px] opacity-100',
            )}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={compacto ? -1 : undefined}
                aria-current={ativo(item.href) ? 'page' : undefined}
                className={cn(
                  'relative isolate whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] font-[560] no-underline transition-colors',
                  ativo(item.href) ? 'text-white' : 'text-white/65 hover:text-white',
                )}
              >
                {ativo(item.href) && (
                  <motion.span
                    layoutId={reduzir ? undefined : 'nav-ativo'}
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.09] ring-1 ring-inset ring-sinal/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/entrar"
              className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-sinal/30 px-3.5 py-2 text-[13px] font-[600] text-white/90 no-underline transition-colors hover:border-sinal hover:bg-white/[0.06] hover:text-white md:inline-flex"
            >
              <LockKeyhole className="h-3.5 w-3.5 text-sinal" aria-hidden="true" />
              Área do cliente
            </Link>
            <BotaoDiagnostico variant="claro" size="sm" className="!gap-1.5 !px-3.5 !py-2.5 max-[359px]:!px-3">
              Diagnóstico <ArrowRight className="seta h-3.5 w-3.5 max-[379px]:hidden" aria-hidden="true" />
            </BotaoDiagnostico>
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/10 xl:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id="menu-celular"
            className="planta fixed inset-0 z-[99] overflow-y-auto px-5 pb-10 pt-[92px] xl:hidden"
            initial={reduzir ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at 92% 4%)' }}
            animate={reduzir ? { opacity: 1 } : { opacity: 1, clipPath: 'circle(150% at 92% 4%)' }}
            exit={reduzir ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: reduzir ? 0.15 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div
              aria-hidden="true"
              className="grade-planta pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_80%_0%,black,transparent_70%)]"
            />
            <nav aria-label="Navegação principal (celular)" className="relative mx-auto max-w-[640px]">
              <ul className="m-0 grid list-none gap-0 p-0">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduzir ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduzir ? 0 : 0.08 + i * 0.04 }}
                    className="border-b border-sinal/15"
                  >
                    <Link
                      href={item.href}
                      aria-current={ativo(item.href) ? 'page' : undefined}
                      className="flex items-center justify-between py-4 text-white no-underline"
                    >
                      <span className="expandida text-[1.6rem] font-[760] tracking-[-0.03em]">{item.label}</span>
                      <span className="rotulo num text-[10px] text-sinal">{String(i + 1).padStart(2, '0')}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3">
                <BotaoDiagnostico variant="claro" block>
                  Fazer diagnóstico <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
                </BotaoDiagnostico>
                <Link href="/entrar" className="btn btn-lg btn-block btn-contorno-claro">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Área do cliente
                </Link>
                <Link href="/modelos" className="rotulo mt-3 text-center text-[10.5px] text-cinza-escuro no-underline">
                  Materiais gratuitos · modelos e guias
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
