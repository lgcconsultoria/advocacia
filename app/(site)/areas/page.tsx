import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreas } from '@/lib/reader';
import { AreaIcon } from '@/components/area-icon';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'Áreas de atuação — Direito Administrativo',
  description:
    'Áreas de atuação em Direito Administrativo: mandado de segurança, licitações, contratos públicos, concursos, servidores, defesa de agentes públicos, habeas data e execuções.',
  alternates: { canonical: '/areas' },
  openGraph: {
    title: 'Áreas de atuação — Direito Administrativo',
    description:
      'Oito frentes de direito público, cada uma com regime jurídico próprio e prazos específicos.',
    url: '/areas',
  },
};

export default async function AreasPage() {
  const areas = await getAreas();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Áreas de atuação
          </nav>
          <h1>Áreas de atuação em Direito Administrativo.</h1>
          <p className="lead">
            Oito frentes de direito público. Cada uma tem instrumento próprio,
            prazo específico e exige diagnóstico antes da peça.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RevealGroup className="grid grid-3">
            {areas.map((area) => (
              <RevealItem key={area.slug}>
                <Link className="card area-card" href={`/areas/${area.slug}`}>
                  <span className="card-icon" aria-hidden="true">
                    <AreaIcon icon={area.icon} />
                  </span>
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                  <span className="card-link">Ver área →</span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>Não sabe qual instrumento se aplica ao seu caso?</h2>
            <p>
              O diagnóstico inicial existe justamente para isso: identificar a
              frente e o tempo de reação.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-lg" href="/diagnostico">
              Solicitar diagnóstico
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
