import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAreas, getPosts, getSettings } from '@/lib/reader';
import { AreaIcon } from '@/components/area-icon';
import { HeroVideo } from '@/components/hero-video';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  // Título voltado ao termo de maior busca ("advogado direito administrativo")
  // + cidade, mantendo o H1 do hero acolhedor para todas as áreas.
  title: {
    absolute:
      'Advogado de Direito Administrativo em São Paulo | Douglas Senturião Advocacia',
  },
  description:
    'Advogado de Direito Administrativo em São Paulo: mandado de segurança, licitações, contratos públicos, servidores e concursos — e contencioso cível e empresarial. Diagnóstico técnico com retorno em até 1 dia útil.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [areas, posts, settings] = await Promise.all([
    getAreas(),
    getPosts(),
    getSettings(),
  ]);
  const featured = posts.slice(0, 2);
  const areasPublico = areas.filter((a) => a.group !== 'civel');
  const areasCivel = areas.filter((a) => a.group === 'civel');

  const legalServiceLd = {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'Attorney'],
    '@id': 'https://www.senturiaoadv.com.br/#escritorio',
    name: settings.firmName,
    alternateName: 'Advogado de Direito Administrativo — Douglas Senturião',
    description:
      'Escritório-boutique de Direito Administrativo em São Paulo, com atuação em mandado de segurança, licitações, contratos públicos, servidores, concursos, defesa de agentes públicos, habeas data e execuções — e frentes selecionadas de contencioso cível e empresarial.',
    url: 'https://www.senturiaoadv.com.br/',
    image: 'https://www.senturiaoadv.com.br/assets/img/og-image.png',
    logo: 'https://www.senturiaoadv.com.br/assets/img/logo-horizontal.png',
    telephone: `+55${settings.whatsapp.replace(/^55/, '').replace(/\D/g, '')}`,
    email: settings.email,
    priceRange: '$$',
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Brigadeiro Faria Lima, 1768',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '01451-001',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Atendimento',
      telephone: `+55${settings.whatsapp.replace(/^55/, '').replace(/\D/g, '')}`,
      email: settings.email,
      availableLanguage: 'Portuguese',
    },
    knowsAbout: areas.map((a) => a.title),
    sameAs: [`https://instagram.com/${settings.instagram}`],
  };

  const attorneyLd = {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: settings.lawyerName,
    url: 'https://www.senturiaoadv.com.br/sobre/',
    image: 'https://www.senturiaoadv.com.br/assets/img/douglas-estudio.jpg',
    worksFor: { '@type': 'LegalService', name: settings.firmName },
    areaServed: 'Brasil',
    knowsAbout: areas.map((a) => a.title),
  };

  return (
    <>
      <JsonLd data={legalServiceLd} />
      <JsonLd data={attorneyLd} />

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Direito Administrativo · Cível · Empresarial — Atuação em todo o Brasil</p>
              <h1>Estratégia jurídica para quem tem um conflito e um prazo.</h1>
              <p className="lead">
                Seja um embate com o Poder Público ou uma disputa cível ou
                empresarial, o tempo de reação muda o resultado. Cuidamos do
                diagnóstico, da tese e do plano processual desde o primeiro
                contato — com a técnica de um escritório-boutique.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" href="/diagnostico">
                  Solicitar diagnóstico inicial
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/areas">
                  Conhecer as áreas de atuação
                </Link>
              </div>
            </div>
            <div className="hero-photo">
              <HeroVideo />
            </div>
          </div>
          <dl className="hero-meta">
            <div>
              <dt>Boutique técnica</dt>
              <dd>Trabalho por caso, não por volume.</dd>
            </div>
            <div>
              <dt>Resposta em até 1 dia útil</dt>
              <dd>Triagem técnica para quem tem prazo em curso.</dd>
            </div>
            <div>
              <dt>Tese antes da peça</dt>
              <dd>Diagnóstico e plano processual por escrito.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Quem somos</p>
            <h2>Um escritório-boutique com raiz no Direito Administrativo.</h2>
            <p className="lead">
              Sede em São Paulo e atuação em todo o Brasil. Nossa força está no
              contencioso contra o Poder Público — e a mesma disciplina técnica
              conduz frentes selecionadas do direito cível e empresarial, do
              caso urgente ao acompanhamento de longo prazo.
            </p>
            <p>
              Cada caso é conduzido com pesquisa própria e contato direto com o
              advogado responsável, sem peças padronizadas. Quando há prazo em
              curso, o tempo de reação pesa tanto quanto a tese — e o escritório
              é organizado para responder rápido.
            </p>
            <p>
              Atendemos empresas, cidadãos, servidores e agentes públicos, mas
              também famílias e pessoas em conflitos cíveis, credores e devedores
              em disputas de cobrança, e sócios e empresas em questões
              societárias e contratuais.
            </p>
            <Link className="btn btn-ghost" href="/sobre">
              Sobre o escritório
            </Link>
          </Reveal>
          <Reveal className="aside-card" delay={0.1}>
            <p className="eyebrow">O que sustenta o trabalho</p>
            <div className="deflist">
              <div className="item">
                <h3>Leitura precisa do caso</h3>
                <p>
                  O diagnóstico vem antes da peça: é ele que aponta o vício e o
                  instrumento certo.
                </p>
              </div>
              <div className="item">
                <h3>Tese bem fundamentada</h3>
                <p>Pesquisa de norma e jurisprudência específica para cada caso.</p>
              </div>
              <div className="item">
                <h3>Velocidade na reação</h3>
                <p>Quando há prazo, mover-se na semana errada pode custar o caso.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="founder">
            <div className="founder-photo">
              <Image
                src="/assets/img/douglas-estudio.jpg"
                alt="Douglas Senturião, advogado responsável pelo escritório"
                width={1100}
                height={1650}
              />
            </div>
            <div className="founder-body">
              <p className="eyebrow">O advogado</p>
              <h2>{settings.lawyerName}</h2>
              <span className="oab">{settings.oab}</span>
              <p>
                Há mais de dez anos dedicado ao direito público, com atuação
                concentrada em licitações e contratos administrativos — e a mesma
                disciplina aplicada a causas cíveis e empresariais selecionadas.
                Acompanha cada caso de perto, do primeiro diagnóstico à
                sustentação, e atende em todo o Brasil, de forma presencial ou
                remota.
              </p>
              <Link className="btn btn-ghost" href="/sobre">
                Conhecer o escritório
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Áreas de atuação</p>
            <h2>Duas frentes, a mesma disciplina técnica.</h2>
            <p className="lead">
              Do contencioso contra o Poder Público às disputas cíveis e
              empresariais. Cada área tem regime jurídico próprio e prazos
              específicos — e é conduzida com o mesmo método.
            </p>
          </Reveal>
          <Reveal as="div">
            <p className="eyebrow" style={{ marginBottom: '1.4rem' }}>
              Direito Público
            </p>
          </Reveal>
          <RevealGroup className="grid grid-4">
            {areasPublico.map((area) => (
              <RevealItem key={area.slug}>
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

          {areasCivel.length > 0 && (
            <>
              <Reveal as="div">
                <p
                  className="eyebrow"
                  style={{ marginTop: '3rem', marginBottom: '1.4rem' }}
                >
                  Contencioso Cível e Empresarial
                </p>
              </Reveal>
              <RevealGroup className="grid grid-4">
                {areasCivel.map((area) => (
                  <RevealItem key={area.slug}>
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
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Como trabalhamos</p>
            <h2>Método em quatro etapas, do diagnóstico ao acompanhamento.</h2>
          </Reveal>
          <ol className="steps">
            <li>
              <h3>Diagnóstico técnico</h3>
              <p>
                Mapeamos o caso, identificamos o instrumento adequado e o tempo
                de reação disponível.
              </p>
            </li>
            <li>
              <h3>Estratégia</h3>
              <p>
                Construímos a tese, o plano processual e o cenário de risco — por
                escrito.
              </p>
            </li>
            <li>
              <h3>Execução</h3>
              <p>
                Peticionamos, monitoramos prazos e sustentamos a posição nas
                instâncias cabíveis.
              </p>
            </li>
            <li>
              <h3>Acompanhamento</h3>
              <p>
                Relatórios objetivos e comunicação direta, para o cliente decidir
                bem informado a cada etapa.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Para quem trabalhamos</p>
            <h2>
              Quem nos procura tem um ponto em comum: um conflito que precisa de
              estratégia.
            </h2>
            <p>
              Público ou privado, pessoa ou empresa — atendemos por agendamento,
              com triagem técnica inicial. Se há prazo em curso, ele orienta a
              prioridade do atendimento.
            </p>
            <Link className="btn btn-primary" href="/diagnostico">
              Solicitar diagnóstico inicial
            </Link>
          </Reveal>
          <ul className="checklist">
            <li>Empresas que contratam com o Poder Público.</li>
            <li>Servidores efetivos, comissionados e empregados públicos.</li>
            <li>Agentes públicos sob investigação administrativa ou judicial.</li>
            <li>Candidatos eliminados ou prejudicados em concursos.</li>
            <li>Cidadãos e empresas atingidos por ato administrativo ilegal.</li>
            <li>Credores da Fazenda Pública.</li>
            <li>Famílias e pessoas em conflitos cíveis que pedem discrição.</li>
            <li>Empresas em disputas contratuais, societárias e de cobrança.</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Conteúdo técnico</p>
            <h2>O que muda no direito público, explicado com clareza.</h2>
            <p className="lead">
              Artigos sobre prazos, leis e entendimentos dos tribunais — úteis
              para quem decide e para quem estuda.
            </p>
          </Reveal>
          <div className="post-list">
            {featured.map((post) => (
              <Link
                key={post.slug}
                className="card post-card"
                href={`/blog/${post.slug}`}
              >
                <span className="post-tag">{post.area}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <span className="post-meta">
                  <span>Leitura técnica</span>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </span>
              </Link>
            ))}
            <Link className="card post-card" href="/blog">
              <span className="post-tag">Blog</span>
              <h3>Todos os artigos e temas em pauta</h3>
              <p>
                Mandado de segurança, licitações, contratos, servidores,
                concursos, improbidade e execuções.
              </p>
              <span className="post-meta">
                <span>Ver índice completo</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>Tem um prazo em curso ou uma decisão pendente?</h2>
            <p>
              Solicite uma triagem técnica inicial. Retornamos em até 1 dia útil
              com os próximos passos.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-lg" href="/diagnostico">
              Solicitar diagnóstico
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/contato">
              Falar com o escritório
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
