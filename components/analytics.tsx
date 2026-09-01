'use client';

import { useEffect, useRef } from 'react';
import { CONSENT_EVENT, readConsent } from '@/lib/consent';

type Gtag = (...args: unknown[]) => void;

function anexar(src: string, dataset: Record<string, string>) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(dataset)) s.dataset[k] = v;
  document.head.appendChild(s);
}

type Categorias = { analytics: boolean; marketing: boolean };

/**
 * Carrega os provedores de medição — e só depois do consentimento.
 * Cada um é env-gated: sem a variável, nada é anexado e o site funciona
 * exatamente como antes de a conta existir.
 *
 * Retirar consentimento precisa ser tão eficaz quanto concedê-lo. `anexar()`
 * deduplica por `<script src>`, então uma segunda chamada de `aplicar()`
 * nunca REMOVE um vendor já injetado — só adiciona os que faltam. Por isso
 * guardamos a última categoria aplicada (num ref — trocar isso não deve
 * causar re-render) e comparamos a cada mudança de consentimento:
 *
 * - REDUÇÃO (uma categoria que estava concedida deixou de estar): não basta
 *   parar de rastrear a partir de agora — o gtag.js e o Clarity já
 *   carregados continuam ativos em memória (o Clarity, em particular,
 *   mantém a gravação de sessão em andamento até a aba fechar). A única
 *   forma confiável de encerrar um script de terceiro já injetado é
 *   descartar o documento inteiro: avisamos o Consent Mode do Google
 *   (para o hit que porventura já esteja em voo) e recarregamos a página.
 *   Na recarga, `aplicar()` roda de novo já com o consentimento reduzido,
 *   e os vendors desativados simplesmente não são anexados de novo.
 * - AMPLIAÇÃO (categoria que passou a ser concedida) cujo vendor já esteja
 *   no DOM — ex.: usuário aceitou só análise e depois habilitou marketing
 *   pelo rodapé: `anexar()` não reinjeta o script (já existe pelo `src`),
 *   então o `data-marketing` do ga4.js, lido só na primeira injeção, nunca
 *   seria reavaliado. Disparamos o `consent update` correspondente direto.
 */
export function Analytics() {
  const anteriorRef = useRef<Categorias | null>(null);

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    function aplicar() {
      const c = readConsent();
      if (!c) return;

      const anterior = anteriorRef.current;
      const reduziu =
        anterior !== null &&
        ((anterior.analytics && !c.analytics) || (anterior.marketing && !c.marketing));

      const w = window as unknown as { gtag?: Gtag };

      if (reduziu) {
        // Sinaliza a retirada ao Consent Mode antes de descartar o
        // documento — cobre qualquer hit que já esteja em voo.
        w.gtag?.('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
        });
        anteriorRef.current = { analytics: c.analytics, marketing: c.marketing };
        window.location.reload();
        return;
      }

      const ampliouMarketing = anterior !== null && !anterior.marketing && c.marketing;
      if (ampliouMarketing && document.querySelector('script[src="/vendor/ga4.js"]')) {
        w.gtag?.('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }

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

      anteriorRef.current = { analytics: c.analytics, marketing: c.marketing };
    }

    aplicar();
    window.addEventListener(CONSENT_EVENT, aplicar);
    return () => window.removeEventListener(CONSENT_EVENT, aplicar);
  }, []);

  return null;
}
