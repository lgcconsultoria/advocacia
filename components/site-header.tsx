'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Assinatura } from '@/components/site/marca';
import { buttonVariants } from '@/components/ui/button';

const NAV = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas', label: 'Áreas' },
  { href: '/licitacoes', label: 'Licitações' },
  { href: '/blog', label: 'Blog' },
  { href: '/modelos', label: 'Materiais' },
  { href: '/contato', label: 'Contato' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao navegar e com Esc.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'planta sticky top-0 z-[100] border-b border-sinal/15 transition-[background-color,box-shadow] duration-300',
        scrolled || open
          ? 'bg-tinta/95 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-md'
          : 'bg-tinta'
      )}
    >
      <div className="container flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link
          href="/"
          className="text-white no-underline"
          title="Página inicial"
        >
          <Assinatura />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'semi rounded-full px-3 py-2 text-[14px] font-[560] no-underline transition-colors',
                isActive(item.href) ? 'text-sinal' : 'text-white/75 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/diagnostico"
            className={buttonVariants({ variant: 'claro', size: 'sm', className: 'ml-3' })}
          >
            Diagnóstico inicial
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-sinal/30 bg-transparent text-white lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movel"
          aria-label={open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={cn(
                'absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-300',
                open && 'translate-y-[5px] rotate-45'
              )}
            />
            <span
              className={cn(
                'absolute bottom-0 left-0 h-[1.5px] w-5 bg-current transition-transform duration-300',
                open && '-translate-y-[5.5px] -rotate-45'
              )}
            />
          </span>
        </button>
      </div>

      <div
        id="menu-movel"
        hidden={!open}
        className="planta absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-sinal/15 lg:hidden"
      >
        <nav className="container grid gap-1 pb-8 pt-4" aria-label="Navegação principal (celular)">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-b border-sinal/10 py-3.5 no-underline',
                isActive(item.href) ? 'text-sinal' : 'text-white'
              )}
            >
              <span className="rotulo num text-[10px] text-cinza-escuro">{String(i + 1).padStart(2, '0')}</span>
              <span className="expandida text-[1.35rem] font-[720] tracking-[-0.02em]">{item.label}</span>
            </Link>
          ))}
          <Link
            href="/diagnostico"
            onClick={() => setOpen(false)}
            className={buttonVariants({ variant: 'claro', size: 'lg', block: true, className: 'mt-6' })}
          >
            Solicitar diagnóstico inicial
          </Link>
        </nav>
      </div>
    </header>
  );
}
