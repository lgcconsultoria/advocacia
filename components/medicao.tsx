'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  EVENTO_CONSENTIMENTO,
  EVENTO_REABRIR,
  gravarConsentimento,
  lerConsentimento,
} from '@/lib/consentimento';
import { HA_MEDICAO, IDS_MEDICAO } from '@/lib/medicao';

type Fbq = ((...a: unknown[]) => void) & {
  callMethod?: (...a: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};
type Janela = Window & {
  fbq?: Fbq;
  _fbq?: Fbq;
  gtag?: (...a: unknown[]) => void;
  dataLayer?: unknown[];
};

function anexarScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

/** O snippet oficial do Pixel, sem <script> inline. */
function carregarPixel(id: string) {
  const w = window as Janela;
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  anexarScript('https://connect.facebook.net/en_US/fbevents.js');
  n('init', id);
  n('track', 'PageView');
}

/** gtag.js com GA4 e/ou Google Ads (o que estiver configurado). */
function carregarGtag(ids: string[]) {
  const w = window as Janela;
  if (w.gtag || ids.length === 0) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
  w.gtag('js', new Date());
  for (const id of ids) w.gtag('config', id);
  anexarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`);
}

/**
 * Medição do site público + aviso de cookies (LGPD).
 *
 * Nada de terceiro entra no HTML: os scripts só são anexados depois de a pessoa
 * aceitar. Recusar depois de ter aceitado recarrega a página (único jeito
 * confiável de descarregar um script de terceiro já em memória).
 * Fica no layout de (site): /clientes, /entrar, /sistema, /cliente e /keystatic
 * ficam de fora por construção.
 */
export function Medicao() {
  const [aberto, setAberto] = useState(false);
  const carregou = useRef(false);

  useEffect(() => {
    if (!HA_MEDICAO) return;

    function aplicar() {
      const c = lerConsentimento();
      if (c?.medicao) {
        if (IDS_MEDICAO.pixel) carregarPixel(IDS_MEDICAO.pixel);
        carregarGtag([IDS_MEDICAO.ga4, IDS_MEDICAO.ads].filter(Boolean));
        carregou.current = true;
      } else if (c && !c.medicao && carregou.current) {
        window.location.reload();
      }
    }

    const reabrir = () => setAberto(true);
    aplicar();
    if (lerConsentimento() === null) setAberto(true);
    window.addEventListener(EVENTO_CONSENTIMENTO, aplicar);
    window.addEventListener(EVENTO_REABRIR, reabrir);
    return () => {
      window.removeEventListener(EVENTO_CONSENTIMENTO, aplicar);
      window.removeEventListener(EVENTO_REABRIR, reabrir);
    };
  }, []);

  if (!aberto) return null;

  function decidir(medicao: boolean) {
    gravarConsentimento(medicao);
    setAberto(false);
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      data-aviso-cookies=""
      className="fixed inset-x-3 bottom-[78px] z-[95] rounded-2xl border border-sinal/25 bg-tinta/95 p-4 text-[12.5px] leading-snug text-[#d4d3f3] shadow-[0_18px_44px_-16px_rgb(11_10_46/0.8)] backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[380px]"
    >
      <p className="m-0">
        Usamos cookies de medição (Meta e Google) para saber quais páginas ajudam quem procura o escritório. Só
        com a sua autorização.{' '}
        <Link href="/politica-de-privacidade" className="text-white underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-sm btn-contorno-claro flex-1" onClick={() => decidir(false)}>
          Recusar
        </button>
        <button type="button" className="btn btn-sm btn-contorno-claro flex-1" onClick={() => decidir(true)}>
          Aceitar
        </button>
      </div>
    </div>
  );
}

/** Link do rodapé que reabre o aviso (só existe se houver medição configurada). */
export function PreferenciasCookies({ className }: { className?: string }) {
  if (!HA_MEDICAO) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(EVENTO_REABRIR))}
    >
      Preferências de cookies
    </button>
  );
}
