'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { registrarContatoWhatsapp } from '@/lib/medicao';
import {
  assuntoDaPagina,
  linkWhatsappCom,
  mensagemWhatsapp,
  utmsDe,
  type Utms,
} from '@/lib/contato/whatsapp';

const CHAVE_UTMS = 'senturiao:utms';

function utmsDaSessao(): Utms {
  try {
    return utmsDe(window.location.search, window.sessionStorage.getItem(CHAVE_UTMS));
  } catch {
    return utmsDe(typeof window === 'undefined' ? '' : window.location.search, null);
  }
}

/**
 * Link de WhatsApp com a mensagem da página (a "dor") e a origem: caminho,
 * `ref` e campanha (utm_*). No servidor sai com o assunto da página; no
 * navegador, a campanha da sessão entra na mensagem. O clique registra
 * `Contact` (Pixel) e `whatsapp_click` (GA4), só com consentimento.
 *
 * `texto`/`codigo` substituem o assunto da página (botões com pedido próprio).
 */
export function LinkWhatsapp({
  whatsapp,
  texto,
  codigo,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  whatsapp: string;
  texto?: string;
  /** Código da dor (substitui o da página). */
  codigo?: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  const caminho = usePathname() || '/';
  const montar = (utms: Utms | null) =>
    linkWhatsappCom(whatsapp, mensagemWhatsapp({ caminho, texto, ref: codigo, utms }));
  const [href, setHref] = useState(() => montar(null));

  useEffect(() => {
    setHref(montar(utmsDaSessao()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caminho, whatsapp, texto, codigo]);

  function clicar(e: MouseEvent<HTMLAnchorElement>) {
    // a campanha pode ter chegado depois da montagem: recalcula na hora do clique
    e.currentTarget.href = montar(utmsDaSessao());
    registrarContatoWhatsapp({ pagina: caminho, ref: codigo ?? assuntoDaPagina(caminho).ref });
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener" onClick={clicar} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
