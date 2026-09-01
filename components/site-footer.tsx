import Link from 'next/link';
import Image from 'next/image';
import { ConsentReopen } from '@/components/consent-reopen';
import { TrackAnchor } from '@/components/track-anchor';
import { OAB_NOTICE } from '@/lib/legal-notice';

type FooterProps = {
  areas: { slug: string; title: string }[];
  settings: {
    firmName: string;
    lawyerName: string;
    oab: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagram: string;
  };
};

export function SiteFooter({ areas, settings }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/assets/img/logo-horizontal-light.png"
            alt={settings.firmName}
            width={300}
            height={104}
            sizes="150px"
          />
          <p>
            Escritório-boutique dedicado a conflitos entre o setor privado, o
            cidadão e a Administração Pública.
          </p>
          <p className="muted">
            {settings.lawyerName} · {settings.oab}
          </p>
        </div>
        <div>
          <h2 className="footer-heading">Áreas</h2>
          <ul className="footer-links">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-heading">Institucional</h2>
          <ul className="footer-links">
            <li><Link href="/sobre">Sobre o escritório</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/diagnostico">Diagnóstico jurídico inicial</Link></li>
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/aviso-publicidade">Aviso de Publicidade</Link></li>
            <li><ConsentReopen /></li>
          </ul>
          <h2 className="footer-heading" style={{ marginTop: '1.6rem' }}>Contato</h2>
          <ul className="footer-contact">
            <li>
              <TrackAnchor
                href={`mailto:${settings.email}`}
                event="email_click"
                params={{ origem: 'rodape' }}
              >
                {settings.email}
              </TrackAnchor>
            </li>
            <li>
              <TrackAnchor
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener"
                event="whatsapp_click"
                params={{ origem: 'rodape' }}
              >
                {settings.phone}
              </TrackAnchor>{' '}
              — atendimento por agendamento
            </li>
            <li>
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener"
              >
                Instagram · @{settings.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p className="ethic">{OAB_NOTICE}</p>
        <p>
          © <span>{new Date().getFullYear()}</span> {settings.firmName}
        </p>
      </div>
    </footer>
  );
}
