'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Dispara `article_read_75pct` uma única vez, quando o leitor passa de 75%
 * da altura do artigo. Usa rolagem passiva — não bloqueia a thread.
 */
export function ReadProgress({ slug }: { slug: string }) {
  useEffect(() => {
    const artigo = document.querySelector('.prose');
    if (!artigo) return;

    let disparado = false;
    const aoRolar = () => {
      if (disparado) return;
      const r = artigo.getBoundingClientRect();
      const lido = (window.innerHeight - r.top) / r.height;
      if (lido >= 0.75) {
        disparado = true;
        track('article_read_75pct', { slug });
        window.removeEventListener('scroll', aoRolar);
      }
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
    return () => window.removeEventListener('scroll', aoRolar);
  }, [slug]);

  return null;
}
