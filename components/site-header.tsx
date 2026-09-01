'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './theme-toggle';

const NAV = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas', label: 'Áreas' },
  { href: '/blog', label: 'Blog' }, { href: '/modelos', label: 'Materiais' },
  { href: '/contato', label: 'Contato' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Douglas Senturião Advocacia — página inicial">
          <Image
            className="brand-logo"
            src="/assets/img/logo-horizontal.png"
            alt="Douglas Senturião Advocacia"
            width={266}
            height={92}
            sizes="133px"
            priority
          />
        </Link>
        <button
          ref={toggleRef}
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label="Abrir menu de navegação"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
        <nav
          className={`nav${open ? ' is-open' : ''}`}
          id="site-nav"
          aria-label="Navegação principal"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'A') setOpen(false);
          }}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link className="btn btn-primary header-cta" href="/diagnostico">
            Diagnóstico inicial
          </Link>
        </nav>
      </div>
    </header>
  );
}
