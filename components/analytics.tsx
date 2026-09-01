'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, readConsent } from '@/lib/consent';

function anexar(src: string, dataset: Record<string, string>) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(dataset)) s.dataset[k] = v;
  document.head.appendChild(s);
}

/**
 * Carrega os provedores de medição — e só depois do consentimento.
 * Cada um é env-gated: sem a variável, nada é anexado e o site funciona
 * exatamente como antes de a conta existir.
 */
export function Analytics() {
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    function aplicar() {
      const c = readConsent();
      if (!c) return;
      if (c.analytics && gaId) {
        anexar('/vendor/ga4.js', {
          gaId,
          marketing: c.marketing ? '1' : '0',
        });
      }
      if (c.analytics && clarityId) {
        anexar('/vendor/clarity.js', { clarityId });
      }
      if (c.marketing && pixelId) {
        anexar('/vendor/meta-pixel.js', { pixelId });
      }
    }

    aplicar();
    window.addEventListener(CONSENT_EVENT, aplicar);
    return () => window.removeEventListener(CONSENT_EVENT, aplicar);
  }, []);

  return null;
}
