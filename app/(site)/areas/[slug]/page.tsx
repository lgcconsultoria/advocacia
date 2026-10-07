import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArea, getAreas } from '@/lib/reader';
import { renderMarkdoc } from '@/lib/markdoc';
import { Reveal } from '@/components/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { buttonVariants } from '@/components/ui/button';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

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

      <PageHero
        trilha={[{ href: '/areas', label: 'Áreas' }, { label: area.title }]}
        rotulo={area.group === 'civel' ? 'Contencioso Cível e Empresarial' : 'Direito Público'}
        titulo={area.heroTitle}
        lead={area.lead}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <BotaoDiagnostico variant="claro" size="lg">
            {area.sidebarCta}
          </BotaoDiagnostico>
        </div>
      </PageHero>

      <Secao>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="rotulo m-0 text-marca">{area.whenEyebrow}</p>
            <h2 className="expandida m-0 mt-4 text-[clamp(1.7rem,3.6vw,2.7rem)] font-[780] leading-[1.05] tracking-[-0.03em]">
              {area.whenTitle}
            </h2>
            <div className="prose mt-8">{renderMarkdoc(intro.node)}</div>

            {hasAchieves && (
              <div className="mt-10 rounded-3xl bg-white p-7 sm:p-9">
                {area.achievesTitle && (
                  <h3 className="semi m-0 mb-4 text-[1.2rem] font-[720] leading-tight">{area.achievesTitle}</h3>
                )}
                <ul className="checklist">
                  {area.achieves.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {hasNotice && (
              <div className="notice notice--inline">
                {area.notice.title && <strong>{area.notice.title}</strong>}{' '}
                {area.notice.body}
              </div>
            )}
          </div>

          <aside className="aside-card is-sticky self-start sm:p-8">
            <p className="rotulo m-0 text-marca">{area.sidebarTitle}</p>
            <ul className="checklist mt-4">
              {area.sidebarItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <BotaoDiagnostico variant="marca" block className="mt-6">
              {area.sidebarCta}
            </BotaoDiagnostico>
            {area.sidebarNote && <p className="hint mb-0 mt-4">{area.sidebarNote}</p>}
          </aside>
        </div>
      </Secao>

      {area.faq.length > 0 && (
        <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
          <Reveal>
            <Cabecalho rotulo="Perguntas frequentes" titulo={`${area.title}: dúvidas comuns`} />
          </Reveal>
          <div className="mt-12 md:pl-[calc(9rem+2.5rem)]">
            <FaqAccordion items={area.faq} />
          </div>
        </Secao>
      )}

      <CtaFaixa titulo={area.ctaTitle} texto={area.ctaText}>
        <BotaoDiagnostico variant="claro" size="lg">
          {area.sidebarCta}
        </BotaoDiagnostico>
      </CtaFaixa>
    </>
  );
}
