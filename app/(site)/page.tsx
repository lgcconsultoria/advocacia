import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAreas, getPosts, getSettings } from '@/lib/reader';
import { DESTAQUE_ANEL, nomeCurto } from '@/lib/areas';
import { Reveal } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';
import { buttonVariants } from '@/components/ui/button';
import { Cabecalho, GradePlanta, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { PostCard } from '@/components/site/post-card';
import { HeroHome } from '@/components/home/hero-home';
import { FaixaVideo } from '@/components/home/faixa-video';
import { Filme } from '@/components/home/filme';
import { SeletorAreas, type GrupoSeletor } from '@/components/home/seletor-areas';

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

  // Anel do topo: as frentes em destaque, na ordem de DESTAQUE_ANEL (só as que existem no CMS).
  const anel = DESTAQUE_ANEL.map((slug) => areas.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({ slug: a.slug, curto: nomeCurto(a.slug, a.title), nome: a.title }));

  const paraSeletor = (lista: typeof areas) =>
    lista.map((a) => ({
      slug: a.slug,
      title: a.title,
      curto: nomeCurto(a.slug, a.title),
      summary: a.summary,
      lead: a.lead,
    }));
  const grupos: GrupoSeletor[] = [
    { id: 'publico', nome: 'Direito Público', titulo: 'Direito Público', areas: paraSeletor(areasPublico) },
    ...(areasCivel.length
      ? [{ id: 'civel', nome: 'Cível e Empresarial', titulo: 'Cível e Empresarial', areas: paraSeletor(areasCivel) }]
      : []),
  ];

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

      <HeroHome frentes={anel} />

      <FaixaVideo src="/assets/video/colunas.mp4" poster="/assets/video/colunas.jpg">
        <Reveal className="max-w-[660px]">
          <p className="rotulo m-0 text-sinal">O tempo da Administração</p>
          <blockquote className="citacao m-0 mt-6 text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.1] text-white">
            Diante do Poder Público, o tempo de reação pesa tanto quanto a tese.
          </blockquote>
          <p className="m-0 mt-8 max-w-[52ch] text-[1.05rem] leading-relaxed text-cinza-escuro">
            Recurso, impugnação, mandado de segurança: cada instrumento tem o seu
            prazo, e ele corre sozinho. Por isso o trabalho começa por um
            diagnóstico escrito, que aponta o vício do ato, o caminho cabível e
            quanto tempo ainda resta.
          </p>
        </Reveal>
      </FaixaVideo>

      <Secao id="areas" className="bg-[linear-gradient(180deg,var(--papel),#e9e9f2)]">
        <Cabecalho
          n={1}
          rotulo="Áreas de atuação"
          titulo={
            <>
              Duas frentes, <span className="text-marca">a mesma disciplina técnica</span>
            </>
          }
        >
          <p className="m-0">
            Do contencioso contra o Poder Público às disputas cíveis e
            empresariais. Cada área tem regime jurídico próprio e prazos
            específicos, e é conduzida com o mesmo método. Toque numa área para
            ver o que entra nela.
          </p>
        </Cabecalho>
        <SeletorAreas grupos={grupos} />
        <div className="mt-12 flex justify-end">
          <Link href="/areas" className="link-seta">
            Ver todas as áreas de atuação <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Secao>

      <Secao id="como-trabalhamos" escura>
        <Cabecalho n={2} rotulo="Como trabalhamos" titulo="Da mensagem no WhatsApp ao prazo no calendário" escura>
          <p className="m-0">
            Seis passos que se repetem em cada caso, do pedido mais simples à
            disputa mais delicada. O exemplo é ilustrativo: um pregão, uma
            inabilitação e um prazo de recurso.
          </p>
        </Cabecalho>
        <Filme />
      </Secao>

      <Secao id="licitacoes">
        <Cabecalho n={3} rotulo="Departamento de Licitações" titulo="Para quem disputa contratos com o Poder Público">
          <p className="m-0">
            Uma frente dedicada às empresas licitantes e contratadas, do edital ao
            contrato, sob a Lei 14.133/2021.
          </p>
        </Cabecalho>
        <div className="planta relative isolate mt-12 overflow-hidden rounded-[26px] p-6 sm:p-10 lg:p-14">
          <GradePlanta className="opacity-[0.16]" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="min-w-0">
              <p className="rotulo m-0 text-sinal">Licitações e contratos públicos</p>
              <p className="citacao m-0 mt-5 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.12] text-white">
                Cada fase da licitação tem um prazo próprio. Perder um deles costuma
                encerrar a disputa.
              </p>
              <p className="m-0 mt-6 max-w-[54ch] text-[1rem] leading-relaxed text-cinza-escuro">
                Leitura do edital, pedidos de esclarecimento e impugnação,
                recursos e contrarrazões, mandado de segurança licitatório,
                reequilíbrio econômico-financeiro e defesa em processos de sanção.
                Na página do departamento, o movimento das contratações aparece
                com dados públicos do Portal Nacional de Contratações Públicas
                (PNCP).
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/licitacoes" className={buttonVariants({ variant: 'claro', size: 'lg' })}>
                  Conhecer o departamento
                </Link>
                <Link href="/diagnostico" className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}>
                  Enviar edital para análise
                </Link>
              </div>
            </div>
            <ol className="m-0 grid list-none content-center gap-0 p-0" aria-label="Fases em que o escritório atua">
              {[
                ['Edital', 'leitura, esclarecimento e impugnação'],
                ['Sessão', 'propostas, lances e julgamento'],
                ['Habilitação', 'documentos, diligências e saneamento'],
                ['Recurso', 'razões e contrarrazões'],
                ['Contrato', 'execução, aditivos e reequilíbrio'],
                ['Sanções', 'defesa no processo administrativo'],
              ].map(([fase, texto], i) => (
                <li key={fase} className="grid grid-cols-[2.6rem_minmax(0,1fr)] items-baseline gap-3 border-t border-sinal/15 py-3.5 first:border-t-0">
                  <span className="rotulo num text-[10px] text-sinal">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="expandida block text-[15px] font-[700] text-white">{fase}</span>
                    <span className="block text-[0.9rem] text-cinza-escuro">{texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Secao>

      <Secao id="metodo" className="bg-[linear-gradient(180deg,#ebe9f1,var(--papel))]">
        <Cabecalho n={4} rotulo="O método" titulo="Tese antes da peça, prazo antes de tudo">
          <p className="m-0">
            Cada caso é conduzido com pesquisa própria e contato direto com o
            advogado responsável, sem peças padronizadas.
          </p>
        </Cabecalho>
        <ol className="m-0 mt-14 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Diagnóstico técnico', 'Mapeamos o caso, identificamos o instrumento adequado e o tempo de reação disponível.'],
            ['Estratégia', 'Construímos a tese, o plano processual e o cenário de risco, por escrito.'],
            ['Execução', 'Peticionamos, monitoramos prazos e sustentamos a posição nas instâncias cabíveis.'],
            ['Acompanhamento', 'Relatórios objetivos e comunicação direta, para o cliente decidir bem informado a cada etapa.'],
          ].map(([t, d], i) => (
            <li key={t} className="min-w-0 border-t-2 border-grafite pt-4">
              <span className="rotulo num text-[10.5px] text-marca">Etapa {i + 1}</span>
              <h3 className="expandida m-0 mt-2 text-[1.1rem] font-[700] leading-tight">{t}</h3>
              <p className="m-0 mt-2 text-[0.94rem] leading-snug text-cinza">{d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="rounded-3xl bg-white p-7 shadow-[0_30px_80px_-50px_rgb(29_27_154/0.35)] sm:p-10">
            <p className="rotulo m-0 text-marca">O que sustenta o trabalho</p>
            <dl className="m-0 mt-6 grid gap-6">
              {[
                ['Leitura precisa do caso', 'O diagnóstico vem antes da peça: é ele que aponta o vício e o instrumento certo.'],
                ['Tese bem fundamentada', 'Pesquisa de norma e jurisprudência específica para cada caso.'],
                ['Velocidade na reação', 'Quando há prazo, mover-se na semana errada pode custar o caso.'],
              ].map(([t, d]) => (
                <div key={t} className="border-l-2 border-marca pl-4">
                  <dt className="citacao text-[1.45rem] leading-tight text-grafite">{t}</dt>
                  <dd className="m-0 mt-1.5 text-[0.95rem] leading-relaxed text-cinza">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 rounded-3xl border border-papel-2 p-7 sm:p-10">
            <p className="rotulo m-0 text-marca">Para quem trabalhamos</p>
            <h3 className="semi m-0 mt-4 text-[1.4rem] font-[720] leading-tight tracking-[-0.015em]">
              Quem nos procura tem um ponto em comum: um conflito que precisa de estratégia.
            </h3>
            <ul className="checklist mt-6 sm:grid-cols-2 sm:gap-x-8 sm:[&_li:nth-child(2)]:border-t-0">
              <li>Empresas que contratam com o Poder Público.</li>
              <li>Servidores efetivos, comissionados e empregados públicos.</li>
              <li>Agentes públicos sob investigação administrativa ou judicial.</li>
              <li>Candidatos eliminados ou prejudicados em concursos.</li>
              <li>Cidadãos e empresas atingidos por ato administrativo ilegal.</li>
              <li>Credores da Fazenda Pública.</li>
              <li>Famílias e pessoas em conflitos cíveis que pedem discrição.</li>
              <li>Empresas em disputas contratuais, societárias e de cobrança.</li>
            </ul>
            <p className="m-0 mt-6 text-[0.95rem] text-cinza">
              Atendimento por agendamento, com triagem técnica inicial. Se há prazo
              em curso, ele orienta a prioridade do atendimento.
            </p>
          </div>
        </div>
      </Secao>

      <Secao id="advogado" escura grade>
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[420px]">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-[70%] w-[70%] rounded-[24px] bg-marca" />
            <Image
              src="/assets/img/douglas-estudio.jpg"
              alt="Douglas Senturião, advogado responsável pelo escritório"
              width={1100}
              height={1650}
              sizes="(min-width: 768px) 420px, 90vw"
              className="relative h-auto w-full rounded-[24px] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.8)]"
            />
          </Reveal>
          <div className="min-w-0">
            <p className="rotulo m-0 text-sinal">05 — O advogado</p>
            <h2 className="expandida m-0 mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-[780] leading-[1.02] tracking-[-0.03em] text-white">
              {settings.lawyerName}
            </h2>
            <span className="rotulo mt-5 inline-block rounded-full border border-sinal/40 px-3 py-1.5 text-[10.5px] text-sinal">
              {settings.oab}
            </span>
            <p className="m-0 mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-cinza-escuro">
              Há mais de dez anos dedicado ao direito público, com atuação
              concentrada em licitações e contratos administrativos — e a mesma
              disciplina aplicada a causas cíveis e empresariais selecionadas.
              Acompanha cada caso de perto, do primeiro diagnóstico à
              sustentação, e atende em todo o Brasil, de forma presencial ou
              remota.
            </p>
            <Link href="/sobre" className="link-seta mt-8">
              Conhecer o escritório <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Secao>

      <Secao id="conteudo">
        <Cabecalho n={6} rotulo="Conteúdo técnico" titulo="O que muda no direito público, explicado com clareza">
          <p className="m-0">
            Artigos sobre prazos, leis e entendimentos dos tribunais — úteis para
            quem decide e para quem estuda.
          </p>
        </Cabecalho>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          <Link
            href="/blog"
            className="card card-link planta group flex flex-col border-transparent bg-tinta no-underline sm:p-8"
          >
            <span className="rotulo text-[10.5px] text-sinal">Blog</span>
            <span className="semi mt-4 block text-[1.28rem] font-[720] leading-[1.18] text-white">
              Todos os artigos e temas em pauta
            </span>
            <span className="mt-3 block text-[0.96rem] leading-relaxed text-cinza-escuro">
              Mandado de segurança, licitações, contratos, servidores, concursos,
              improbidade e execuções.
            </span>
            <span className="link-seta mt-auto self-start pt-6">
              Ver índice completo <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </Secao>

      <CtaFaixa
        titulo="Tem um prazo em curso ou uma decisão pendente?"
        texto="Solicite uma triagem técnica inicial. Retornamos em até 1 dia útil com os próximos passos."
      >
        <Link className={buttonVariants({ variant: 'claro', size: 'lg' })} href="/diagnostico">
          Solicitar diagnóstico
        </Link>
        <Link className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })} href="/contato">
          Falar com o escritório
        </Link>
      </CtaFaixa>
    </>
  );
}
