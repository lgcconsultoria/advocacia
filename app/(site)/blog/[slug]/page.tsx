import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPost, getPosts, getSettings } from '@/lib/reader';
import { renderMarkdoc, extractToc } from '@/lib/markdoc';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { buttonVariants } from '@/components/ui/button';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const url = `/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedDate ?? undefined,
    },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  if (!y || !m || !d) return iso;
  return `${d} de ${months[m - 1]} de ${y}`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const settings = await getSettings();
  const content = await post.content();
  const toc = extractToc(content.node);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate,
    author: {
      '@type': 'Person',
      name: settings.lawyerName,
      jobTitle: 'Advogado',
    },
    publisher: { '@type': 'Organization', name: settings.firmName },
    mainEntityOfPage: `https://www.senturiaoadv.com.br/blog/${slug}`,
    inLanguage: 'pt-BR',
  };

  const base = 'https://www.senturiaoadv.com.br';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${base}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${base}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />

      <PageHero
        trilha={[{ href: '/blog', label: 'Blog' }, { label: post.area }]}
        rotulo={post.area}
        titulo={post.title}
      >
        <p className="rotulo m-0 mt-8 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-cinza-escuro">
          <span>Análise técnica</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          {post.publishedDate && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{settings.lawyerName}</span>
        </p>
      </PageHero>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-[760px]">
            <article className="prose prose-lg max-w-none">
              {toc.length > 2 && (
                <nav className="toc not-prose" aria-label="Índice do artigo">
                  <p className="rotulo m-0 text-marca">Neste artigo</p>
                  <ol>
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>{item.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {renderMarkdoc(content.node)}
            </article>

            <div className="mt-14 grid items-center gap-6 rounded-3xl bg-white p-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-9">
              <Image
                src="/assets/img/douglas-autor.jpg"
                alt={settings.lawyerName}
                width={232}
                height={232}
                className="h-[104px] w-[104px] rounded-full object-cover object-[50%_18%]"
              />
              <div className="min-w-0">
                <p className="expandida m-0 text-[1.15rem] font-[750]">{settings.lawyerName}</p>
                <p className="rotulo m-0 mt-1 text-[10.5px] text-marca">{settings.oab}</p>
                <p className="m-0 mt-3 text-[0.95rem] leading-relaxed text-cinza">
                  Advogado dedicado ao Direito Administrativo, com atuação
                  concentrada em licitações e contratos públicos. Conteúdo de
                  caráter informativo, sem promessa de resultado.
                </p>
              </div>
            </div>

            <div className="notice notice--inline">
              Conteúdo informativo, em conformidade com o Código de Ética e
              Disciplina da OAB. Não substitui a análise de um caso concreto nem
              constitui aconselhamento jurídico individualizado.
            </div>

            <Link href="/blog" className="link-seta">
              <span aria-hidden="true">←</span> Todos os artigos
            </Link>
          </div>
        </div>
      </section>

      <CtaFaixa
        titulo="Esse tema toca um caso seu?"
        texto="Envie o caso para uma triagem técnica inicial. Retornamos em até 1 dia útil."
      >
        <Link className={buttonVariants({ variant: 'claro', size: 'lg' })} href="/diagnostico">
          Enviar caso para análise
        </Link>
      </CtaFaixa>
    </>
  );
}
