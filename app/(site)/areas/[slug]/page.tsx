import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArea, getAreas } from '@/lib/reader';
import { renderMarkdoc } from '@/lib/markdoc';
import { Reveal } from '@/components/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';

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

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: area.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const base = 'https://www.douglassenturiao.adv.br';
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
            <Link
              className="btn btn-primary btn-block"
              href="/diagnostico"
              style={{ marginTop: '1.2rem' }}
            >
              {area.sidebarCta}
            </Link>
            {area.sidebarNote && (
              <p className="hint" style={{ marginTop: '.8rem' }}>
                {area.sidebarNote}
              </p>
            )}
          </aside>
        </div>
      </section>

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

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>{area.ctaTitle}</h2>
            <p>{area.ctaText}</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-lg" href="/diagnostico">
              {area.sidebarCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
