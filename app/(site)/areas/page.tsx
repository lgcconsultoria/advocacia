import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreas } from '@/lib/reader';
import { AreaIcon } from '@/components/area-icon';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal';
import { TrackLink } from '@/components/track-link';

export const metadata: Metadata = {
  title: 'Áreas de atuação — Direito Administrativo e Contencioso',
  description:
    'Áreas de atuação: mandado de segurança, licitações, contratos públicos, concursos, servidores, defesa de agentes, habeas data, execuções — e contencioso cível e empresarial: família, violência doméstica, dívidas e obrigações, empresarial e crimes licitatórios.',
  alternates: { canonical: '/areas' },
  openGraph: {
    title: 'Áreas de atuação — Direito Administrativo e Contencioso',
    description:
      'Frentes de direito público e de contencioso cível e empresarial, cada uma com regime jurídico próprio e prazos específicos.',
    url: '/areas',
  },
};

export default async function AreasPage() {
  const areas = await getAreas();
  const areasPublico = areas.filter((a) => a.group !== 'civel');
  const areasCivel = areas.filter((a) => a.group === 'civel');

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Áreas de atuação
          </nav>
          <h1>Áreas de atuação.</h1>
          <p className="lead">
            O núcleo do escritório é o Direito Administrativo — e a mesma
            disciplina técnica se estende a frentes selecionadas do contencioso
            cível e empresarial. Cada área tem instrumento próprio, prazo
            específico e exige diagnóstico antes da peça.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Direito Público</p>
            <h2>O conflito é com a Administração.</h2>
          </div>
          <RevealGroup className="grid grid-3">
            {areasPublico.map((area, i) => (
              <RevealItem key={area.slug} index={i}>
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

      {areasCivel.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Contencioso Cível e Empresarial</p>
              <h2>O conflito é entre particulares.</h2>
            </div>
            <RevealGroup className="grid grid-3">
              {areasCivel.map((area, i) => (
                <RevealItem key={area.slug} index={i}>
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
      )}

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
            <TrackLink
              className="btn btn-primary btn-lg"
              href="/diagnostico"
              event="cta_click"
              params={{ origem: 'areas#cta-final', destino: '/diagnostico' }}
            >
              Solicitar diagnóstico
            </TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}
