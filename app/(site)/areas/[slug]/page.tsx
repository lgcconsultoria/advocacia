import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArea, getAreas, getPostsByArea } from '@/lib/reader';
import { renderMarkdoc } from '@/lib/markdoc';
import { Reveal, RevealItem } from '@/components/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';
import { TrackLink } from '@/components/track-link';
import { TrackView } from '@/components/track-view';
import { OAB_NOTICE } from '@/lib/legal-notice';

export async function generateStaticParams() {
  const areas = await getAreas();
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) return {};
  const url = `/areas/${slug}`;
  return {
    title: area.metaTitle || area.heroTitle,
    description: area.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: area.ogTitle || area.metaTitle,
      description: area.ogDescription || area.metaDescription,
      url,
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();

  const intro = await area.intro();
  const hasAchieves = area.achieves.length > 0;
  const hasNotice = area.notice.title || area.notice.body;
  const relacionados = await getPostsByArea(area.areaKey ?? '');

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: area.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const base = 'https://www.senturiaoadv.com.br';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Áreas', item: `${base}/areas` },
      {
        '@type': 'ListItem',
        position: 3,
        name: area.title,
        item: `${base}/areas/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      {area.faq.length > 0 && <JsonLd data={faqLd} />}
      <TrackView event="view_area_page" params={{ area: slug }} />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            <Link href="/areas">Áreas</Link>
            <span aria-hidden="true">›</span>
            {area.title}
          </nav>
          <h1>{area.heroTitle}</h1>
          <p className="lead">{area.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">{area.whenEyebrow}</p>
            <h2>{area.whenTitle}</h2>
            <div className="prose">{renderMarkdoc(intro.node)}</div>

            {hasAchieves && (
              <>
                {area.achievesTitle && (
                  <h3 style={{ marginTop: '2.2rem' }}>{area.achievesTitle}</h3>
                )}
                <ul className="checklist">
                  {area.achieves.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {hasNotice && (
              <div className="notice notice--inline">
                {area.notice.title && <strong>{area.notice.title}</strong>}{' '}
                {area.notice.body}
              </div>
            )}
          </div>

          <aside className="aside-card is-sticky">
            <p className="eyebrow">{area.sidebarTitle}</p>
            <ul className="checklist">
              {area.sidebarItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <TrackLink
              className="btn btn-primary btn-block"
              href="/diagnostico"
              style={{ marginTop: '1.2rem' }}
              event="cta_click"
              params={{ origem: `areas/${slug}#sidebar`, destino: '/diagnostico' }}
            >
              {area.sidebarCta}
            </TrackLink>
            {area.sidebarNote && (
              <p className="hint" style={{ marginTop: '.8rem' }}>
                {area.sidebarNote}
              </p>
            )}
          </aside>
        </div>
      </section>

      {area.deadlines.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Prazos</p>
              <h2>{area.deadlinesTitle || 'O prazo'}</h2>
              <p className="lead">
                Mover-se na semana errada pode custar o caso. Estes são os prazos que
                orientam a reação nesta matéria.
              </p>
            </Reveal>
            <ul className="deadline-list">
              {area.deadlines.map((d, i) => (
                <li className="deadline-item" key={i}>
                  <p className="deadline-prazo" data-prazo>{d.prazo}</p>
                  <div>
                    <h3>{d.label}</h3>
                    {d.base && <p className="hint">{d.base}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="hint" style={{ marginTop: '1.2rem' }}>
              Informação de caráter geral. Prazos variam conforme o caso concreto e a
              contagem depende da data de ciência — não substitui análise individualizada.
            </p>
          </div>
        </section>
      )}

      {area.decisive.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Técnica</p>
              <h2>{area.decisiveTitle || 'O que costuma decidir o caso'}</h2>
            </Reveal>
            <div className="deflist">
              {area.decisive.map((d, i) => (
                <div className="item" key={i}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Conteúdo técnico</p>
              <h2>Artigos sobre {area.title.toLowerCase()}.</h2>
            </Reveal>
            <div className="post-list related-posts">
              {relacionados.map((p, i) => (
                <RevealItem key={p.slug} index={i}>
                  <Link className="card post-card" href={`/blog/${p.slug}`}>
                    <span className="post-tag">{p.area}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <span className="post-meta"><span>{p.readingTime}</span></span>
                  </Link>
                </RevealItem>
              ))}
            </div>
          </div>
        </section>
      )}

      {area.faq.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Perguntas frequentes</p>
              <h2>{area.title}: dúvidas comuns.</h2>
            </Reveal>
            <FaqAccordion items={area.faq} />
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container container--narrow">
          <div className="notice">{OAB_NOTICE}</div>
        </div>
      </section>

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>{area.ctaTitle}</h2>
            <p>{area.ctaText}</p>
          </div>
          <div className="cta-actions">
            <TrackLink
              className="btn btn-primary btn-lg"
              href="/diagnostico"
              event="cta_click"
              params={{ origem: `areas/${slug}#cta-final`, destino: '/diagnostico' }}
            >
              {area.sidebarCta}
            </TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}
