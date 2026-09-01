import Link from 'next/link';
import Image from 'next/image';
import { ConsentReopen } from '@/components/consent-reopen';

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
            width={1151}
            height={399}
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
          <h4>Áreas</h4>
          <ul className="footer-links">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Institucional</h4>
          <ul className="footer-links">
            <li><Link href="/sobre">Sobre o escritório</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/diagnostico">Diagnóstico jurídico inicial</Link></li>
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/aviso-publicidade">Aviso de Publicidade</Link></li>
            <li><ConsentReopen /></li>
          </ul>
          <h4 style={{ marginTop: '1.6rem' }}>Contato</h4>
          <ul className="footer-contact">
            <li>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener"
              >
                {settings.phone}
              </a>{' '}
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
        <p className="ethic">
          Conteúdo institucional de caráter informativo, em conformidade com o
          Código de Ética e Disciplina da OAB, o Estatuto da Advocacia (Lei
          8.906/94) e o Provimento CFOAB nº 205/2021. Não constitui oferta de
          serviços nem aconselhamento jurídico individualizado.
        </p>
        <p>
          © <span>{new Date().getFullYear()}</span> {settings.firmName}
        </p>
      </div>
    </footer>
  );
}
