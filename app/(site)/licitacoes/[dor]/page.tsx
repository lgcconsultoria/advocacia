import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { metaSocial, SITE } from '@/lib/seo';
import { getSettings } from '@/lib/reader';
import { DORES, ESCOPO_LEI, getDor } from '@/lib/licitacoes/dores';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { Reveal } from '@/components/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { FormularioDiagnostico } from '@/components/diagnostico/formulario';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';
import { VerConteudo } from '@/components/ver-conteudo';
import { LinkWhatsapp } from '@/components/link-whatsapp';
import { buttonVariants } from '@/components/ui/button';

/**
 * Páginas por dor do Departamento de Licitações (/licitacoes/<dor>): fui
 * inabilitado, desclassificada no pregão, recurso administrativo e impugnação
 * de edital. Mesmo desenho da página de mandado de segurança; textos em
 * lib/licitacoes/dores.ts (validados).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return DORES.map((d) => ({ dor: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ dor: string }> }): Promise<Metadata> {
  const d = getDor((await params).dor);
  if (!d) return {};
  const caminho = `/licitacoes/${d.slug}`;
  return {
    title: d.titulo,
    description: d.descricao,
    alternates: { canonical: caminho },
    ...metaSocial({ titulo: d.titulo, descricao: d.descricao, caminho }),
  };
}

/** Outras situações do departamento (links internos entre as páginas). */
const OUTRAS = [
  ...DORES.map((d) => ({ href: `/licitacoes/${d.slug}`, label: d.h1 })),
  { href: '/licitacoes/mandado-de-seguranca', label: 'Mandado de segurança em licitação' },
];

export default async function DorLicitacaoPage({ params }: { params: Promise<{ dor: string }> }) {
  const d = getDor((await params).dor);
  if (!d) notFound();
  const settings = await getSettings();
  const caminho = `/licitacoes/${d.slug}`;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Departamento de Licitações', item: `${SITE}/licitacoes` },
      { '@type': 'ListItem', position: 3, name: d.h1, item: `${SITE}${caminho}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <VerConteudo categoria={`licitacoes:${d.slug}`} nome={d.h1} />

      <PageHero
        trilha={[{ href: '/licitacoes', label: 'Departamento de Licitações' }, { label: d.h1 }]}
        rotulo={d.selo}
        titulo={d.h1}
        lead={d.lead}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a className={buttonVariants({ variant: 'claro', size: 'lg' })} href="#analise">
            Enviar o caso para análise <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
          </a>
          <LinkWhatsapp whatsapp={settings.whatsapp} className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Falar pelo WhatsApp
          </LinkWhatsapp>
        </div>
      </PageHero>

      <Secao>
        <div className="notice notice--inline mt-0" role="note">
          <strong>{d.prazo.titulo}</strong> {d.prazo.texto}
          <span className="mt-3 block text-[0.92rem] opacity-80">{ESCOPO_LEI}</span>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <Cabecalho rotulo="Departamento de Licitações" titulo={d.passosTitulo} />
            </Reveal>
            <ol className="m-0 mt-10 grid list-none gap-5 p-0 md:grid-cols-2">
              {d.passos.map((p, i) => (
                <li key={p.titulo} className="rounded-3xl bg-white p-7">
                  <p className="rotulo num m-0 text-marca">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="semi m-0 mt-3 text-[1.15rem] font-[720] leading-tight">{p.titulo}</h3>
                  <p className="m-0 mt-3 leading-relaxed text-cinza">{p.texto}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {d.blocos.map((b) => (
                <div key={b.titulo} className="rounded-3xl bg-white p-7">
                  <h3 className="semi m-0 mb-4 text-[1.1rem] font-[720] leading-tight">{b.titulo}</h3>
                  <ul className="checklist">
                    {b.itens.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl border-l-2 border-marca bg-white p-7 sm:p-9">
              <p className="citacao m-0 text-[1.6rem] leading-tight text-grafite">Uma ressalva honesta</p>
              <p className="m-0 mt-4 leading-relaxed text-cinza">{d.ressalva}</p>
            </div>
          </div>

          <aside id="analise" className="aside-card is-sticky self-start scroll-mt-28 sm:p-8">
            <FormularioDiagnostico
              whatsapp={settings.whatsapp}
              interesse="licitacoes"
              origemLead={d.ref}
              titulo="Envie o caso para análise"
              subtitulo="Quatro campos obrigatórios. O departamento de licitações retorna em até 1 dia útil e pede o edital, a ata e a decisão."
            />
            <p className="hint mb-0 mt-4">A triagem técnica inicial não constitui mandato profissional.</p>
          </aside>
        </div>
      </Secao>

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        <Reveal>
          <Cabecalho rotulo="Perguntas frequentes" titulo={`${d.h1.replace(/[?.]$/, '')}: dúvidas comuns`} />
        </Reveal>
        <div className="mt-12">
          <FaqAccordion items={d.faq} />
        </div>
        <nav aria-label="Outras situações" className="mt-12">
          <p className="rotulo m-0 text-marca">Outras situações no Departamento de Licitações</p>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0 sm:grid-cols-2">
            {OUTRAS.filter((o) => o.href !== caminho).map((o) => (
              <li key={o.href}>
                <Link href={o.href} className="text-marca underline underline-offset-2">{o.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/licitacoes" className="text-marca underline underline-offset-2">Departamento de Licitações e Contratos Públicos</Link>
            </li>
          </ul>
        </nav>
      </Secao>

      <CtaFaixa rotulo="Departamento de Licitações" titulo={d.cta.titulo} texto={d.cta.texto}>
        <BotaoDiagnostico variant="claro" size="lg" interesse="licitacoes">
          Enviar caso para triagem
        </BotaoDiagnostico>
        <LinkWhatsapp whatsapp={settings.whatsapp} className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}>
          Falar pelo WhatsApp
        </LinkWhatsapp>
      </CtaFaixa>
    </>
  );
}
