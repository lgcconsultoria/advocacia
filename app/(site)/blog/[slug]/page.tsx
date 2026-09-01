import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPost, getPosts, getSettings } from '@/lib/reader';
import { renderMarkdoc, extractToc } from '@/lib/markdoc';
import { JsonLd } from '@/components/json-ld';
import { ReadProgress } from '@/components/read-progress';
import { TrackLink } from '@/components/track-link';

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
      <ReadProgress slug={slug} />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">›</span>
            {post.area}
          </nav>
          <div className="article-head">
            <span className="post-tag">{post.area}</span>
            <h1>{post.title}</h1>
            <p className="article-meta">
              <span>Análise técnica</span>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.publishedDate && (
                <>
                  <span>·</span>
                  <time dateTime={post.publishedDate}>
                    {formatDate(post.publishedDate)}
                  </time>
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <article className="prose">
            {toc.length > 2 && (
              <nav className="toc" aria-label="Índice do artigo">
                <h2>Neste artigo</h2>
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

            <div className="author-card">
              <Image
                src="/assets/img/douglas-autor.jpg"
                alt={settings.lawyerName}
                width={116}
                height={116}
              />
              <div>
                <p className="author-name">{settings.lawyerName}</p>
                <p className="author-oab">{settings.oab}</p>
                <p>
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
          </article>
        </div>
      </section>

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>Esse tema toca um caso seu?</h2>
            <p>
              Envie o caso para uma triagem técnica inicial. Retornamos em até 1
              dia útil.
            </p>
          </div>
          <div className="cta-actions">
            <TrackLink
              className="btn btn-primary btn-lg"
              href="/diagnostico"
              event="cta_click"
              params={{ origem: `blog/${slug}#cta-final`, destino: '/diagnostico' }}
            >
              Enviar caso para análise
            </TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}
