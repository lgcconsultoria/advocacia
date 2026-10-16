'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * Headless Lenis smooth-scroll. Attaches to window scroll without adding a
 * wrapper element, and is disabled entirely when the user prefers reduced
 * motion — the "premium" scroll feel, but never at the cost of accessibility.
 * O Lenis é importado sob demanda, depois da hidratação: fica fora do JavaScript
 * inicial (que pesava no LCP simulado da home).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let cancelado = false;
    let lenis: Lenis | null = null;
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    import('lenis').then(({ default: L }) => {
      if (cancelado) return;
      lenis = new L({ lerp: 0.1, duration: 1.1, smoothWheel: true });
      raf = requestAnimationFrame(loop);
    });

    // In-page anchor links (TOC, skip-link) scroll smoothly too.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el && lenis) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -90 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
