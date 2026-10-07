import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModelo, getModelos } from '@/lib/modelos';
import { ModeloForm } from '@/components/modelo-form';
import { MetaPixel } from '@/components/meta-pixel';
import { Reveal } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getModelos()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getModelo(slug);
  if (!m) return {};
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    keywords: m.buscas,
    alternates: { canonical: `/modelos/${slug}` },
    openGraph: { title: m.metaTitle, description: m.metaDescription, url: `/modelos/${slug}` },
  };
}

export default async function ModeloPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getModelo(slug);
  if (!m) notFound();

  return (
    <>
      <MetaPixel />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: m.titulo,
          description: m.metaDescription,
          step: m.entrega.map((e, i) => ({
            '@type': 'HowToStep', position: i + 1, name: e,
          })),
        }}
      />

      <PageHero
        trilha={[{ href: '/modelos', label: 'Materiais' }, { label: m.documento }]}
        rotulo="Material gratuito"
        titulo={m.chamada}
        lead={m.linha}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a className={buttonVariants({ variant: 'claro', size: 'lg' })} href="#baixar">
            Baixar o modelo
          </a>
        </div>
      </PageHero>

      <Secao>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <p className="rotulo m-0 text-marca">{m.documento}</p>
              <h2 className="expandida m-0 mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] font-[780] leading-[1.05] tracking-[-0.03em]">
                O que você leva
              </h2>
              <ul className="checklist mt-8 text-[1.02rem]">
                {m.entrega.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </Reveal>

            <Reveal>
              <div className="mt-12 rounded-3xl border-l-2 border-marca bg-white p-7 sm:p-9">
                <p className="citacao m-0 text-[1.6rem] leading-tight text-grafite">Uma ressalva honesta</p>
                <p className="m-0 mt-4 leading-relaxed text-cinza">
                  Modelo não é estratégia. Ele organiza a estrutura e lembra o que não
                  pode faltar, mas o que decide o resultado é o enquadramento do seu
                  caso, o prazo aplicável e a prova que você tem em mãos. Use como
                  ponto de partida, não como resposta pronta.
                </p>
              </div>
            </Reveal>
          </div>

          <aside className="aside-card is-sticky self-start sm:p-8" id="baixar">
            <p className="rotulo m-0 text-marca">Baixar o modelo</p>
            <p className="m-0 mb-6 mt-3 text-[.95rem] text-cinza">
              Preencha para receber o arquivo em .docx, já com o nome da sua empresa.
            </p>
            <ModeloForm slug={m.slug} documento={m.documento} />
          </aside>
        </div>
      </Secao>

      <CtaFaixa
        titulo="Prefere que alguém olhe o seu caso antes?"
        texto="A triagem técnica inicial é gratuita e não constitui mandato. Envie os documentos e retornamos em até 1 dia útil."
      >
        <Link href="/diagnostico" className={buttonVariants({ variant: 'claro', size: 'lg' })}>
          Enviar caso para triagem
        </Link>
      </CtaFaixa>
    </>
  );
}
