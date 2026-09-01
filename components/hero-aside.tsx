import Link from 'next/link';
import { MessageCircle, Clock } from 'lucide-react';
import { TrackAnchor } from '@/components/track-anchor';

/**
 * Preenche a coluna direita dos heroes internos com o que o visitante
 * com prazo em curso precisa: um caminho direto. A mensagem do WhatsApp
 * já sai preenchida com o contexto da página.
 *
 * Continua sendo um server component: `TrackAnchor` já é 'use client' no
 * próprio arquivo, e um server component pode renderizar um client
 * component diretamente — não é preciso "subir" a fronteira até aqui.
 */
export function HeroAside({
  whatsapp,
  contexto,
  titulo = 'Prazo em curso?',
}: {
  whatsapp: string;
  contexto: string;
  titulo?: string;
}) {
  const texto = encodeURIComponent(
    `Olá, vim da página de ${contexto} do site e gostaria de falar sobre o meu caso.`
  );

  return (
    <aside className="hero-aside" aria-label="Contato rápido">
      <p className="hero-aside-eyebrow">
        <Clock size={16} strokeWidth={1.5} aria-hidden="true" />
        {titulo}
      </p>
      <p>
        Quando há prazo correndo, o tempo de reação pesa tanto quanto a tese.
        Fale agora ou envie o caso para triagem técnica.
      </p>
      <div className="hero-aside-actions">
        <TrackAnchor
          className="btn btn-primary btn-block"
          href={`https://wa.me/${whatsapp}?text=${texto}`}
          target="_blank"
          rel="noopener"
          event="whatsapp_click"
          params={{ origem: contexto }}
        >
          <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
          Falar no WhatsApp
        </TrackAnchor>
        <Link className="btn btn-ghost btn-block" href="/diagnostico">
          Enviar para triagem
        </Link>
      </div>
      <p className="hero-aside-note">
        O contato inicial não constitui mandato profissional nem gera honorários.
      </p>
    </aside>
  );
}
