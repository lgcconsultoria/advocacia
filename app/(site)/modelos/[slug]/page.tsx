import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModelo, getModelos } from '@/lib/modelos';
import { ModeloForm } from '@/components/modelo-form';
import { MetaPixel } from '@/components/meta-pixel';
import { Reveal } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';

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

      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
            <Link href="/modelos">Materiais</Link> <span aria-hidden="true">/</span>{' '}
            <span>{m.documento}</span>
          </nav>

          <div className="split" style={{ marginTop: '2rem' }}>
            <div>
              <Reveal>
                <p className="eyebrow">Material gratuito</p>
                <h1>{m.chamada}</h1>
                <p className="lead">{m.linha}</p>
              </Reveal>

              <Reveal>
                <h2 style={{ marginTop: '2.5rem' }}>O que você leva</h2>
                <ul className="checklist">
                  {m.entrega.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </Reveal>

              <Reveal>
                <div className="aside-card" style={{ marginTop: '2rem' }}>
                  <h3>Uma ressalva honesta</h3>
                  <p className="mb-0">
                    Modelo não é estratégia. Ele organiza a estrutura e lembra o que não
                    pode faltar, mas o que decide o resultado é o enquadramento do seu
                    caso, o prazo aplicável e a prova que você tem em mãos. Use como
                    ponto de partida, não como resposta pronta.
                  </p>
                </div>
              </Reveal>
            </div>

            <aside className="aside-card is-sticky" id="baixar">
              <h3>Baixar o modelo</h3>
              <p style={{ fontSize: '.92rem' }}>
                Preencha para receber o arquivo em .docx, já com o nome da sua empresa.
              </p>
              <ModeloForm slug={m.slug} documento={m.documento} />
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow center">
          <Reveal>
            <h2>Prefere que alguém olhe o seu caso antes?</h2>
            <p className="lead">
              A triagem técnica inicial é gratuita e não constitui mandato. Envie os
              documentos e retornamos em até 1 dia útil.
            </p>
            <Link href="/diagnostico" className="btn btn-primary btn-lg">
              Enviar caso para triagem
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
