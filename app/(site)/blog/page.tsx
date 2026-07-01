import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getSettings } from '@/lib/reader';
import { BlogList } from '@/components/blog-list';

export const metadata: Metadata = {
  title: 'Blog — Análise técnica de Direito Administrativo',
  description:
    'Artigos técnicos de Direito Administrativo: mandado de segurança, licitações, contratos públicos, servidores, concursos, improbidade e execuções. Conteúdo informativo.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Análise técnica de Direito Administrativo',
    description:
      'Artigos sobre direito público: prazos, leis e decisões dos tribunais, em linguagem objetiva.',
    url: '/blog',
  },
};

const UPCOMING = [
  'Nova Lei de Improbidade: a defesa após a Lei 14.230/2021.',
  'Sanção administrativa em contrato público: roteiro de defesa.',
  'Habeas Data: o instrumento para acessar e corrigir dados públicos.',
  'Cobrança contra a Fazenda Pública: precatório, RPV e estratégias.',
  'Mandado de Segurança coletivo: legitimados e hipóteses.',
];

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const cards = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    area: p.area,
    areaKey: p.areaKey,
    description: p.description,
    readingTime: p.readingTime,
  }));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Blog
          </nav>
          <h1>Blog</h1>
          <p className="lead">
            Artigos sobre direito público — prazos, leis e decisões dos
            tribunais, em linguagem objetiva para quem precisa entender o próprio
            caso.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notice" style={{ marginBottom: '2rem' }}>
            Os artigos têm caráter informativo e não substituem a análise de um
            caso concreto.
          </div>
          <BlogList posts={cards} />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Em pauta</p>
            <h2>Próximos temas que entram no blog.</h2>
          </div>
          <ul className="checklist">
            {UPCOMING.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="author-card" style={{ margin: 0, maxWidth: 760 }}>
            <Image
              src="/assets/img/douglas-institucional.jpg"
              alt={settings.lawyerName}
              width={116}
              height={116}
            />
            <div>
              <p className="eyebrow">Quem escreve</p>
              <p className="author-name">{settings.lawyerName}</p>
              <p className="author-oab">{settings.oab}</p>
              <p>
                Os artigos são escritos por {settings.lawyerName}, advogado com
                mais de dez anos de atuação em direito público e licitações. A
                proposta é explicar bem os instrumentos, os prazos e o que os
                tribunais vêm decidindo — sem juridiquês desnecessário.
              </p>
              <Link
                className="btn btn-ghost"
                href="/sobre"
                style={{ marginTop: '.6rem' }}
              >
                Conhecer o escritório
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>Tem um caso concreto, e não apenas uma dúvida?</h2>
            <p>
              Solicite uma triagem técnica inicial. Retornamos em até 1 dia útil
              com os próximos passos.
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
