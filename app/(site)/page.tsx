import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getAreas, getPosts, getSettings } from '@/lib/reader';
import { snapshotTermometro } from '@/lib/pncp/snapshot';
import { REFERENCIA_ESTIMADA, simularDemo } from '@/lib/tributario/simulador';
import { Reveal } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';
import { Cabecalho, Secao } from '@/components/site/secao';
import { PostCard } from '@/components/site/post-card';
import { HeroV2 } from '@/components/home/hero-v2';
import { FaixaNumeros } from '@/components/home/faixa-numeros';
import { BentoPilares } from '@/components/home/bento-pilares';
import { PainelCliente } from '@/components/home/painel-cliente';
import { MarqueeNormas } from '@/components/home/marquee-normas';
import { Filme } from '@/components/home/filme';
import { FormularioDiagnostico } from '@/components/diagnostico/formulario';
import { GridBeam } from '@/components/ui/grid-beam';

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
  const featured = posts.slice(0, 3);
  const demo = simularDemo(2027);
  const pncp = {
    abertas: snapshotTermometro.abertas.quantidade,
    publicadas30d: snapshotTermometro.publicadas30d.quantidade,
    consultadoEm: snapshotTermometro.atualizadoEm,
    aoVivo: false,
  };

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

      <HeroV2 oab={settings.oab} />

      <FaixaNumeros
        pncp={pncp}
        economiaCliente={demo.fatura.diferencas.custoCliente}
        custoEmpresa={demo.fatura.diferencas.impostoEmpresa}
        referencia={REFERENCIA_ESTIMADA.cbs + REFERENCIA_ESTIMADA.ibs}
      />

      <Secao id="areas" className="overflow-hidden">
        <div aria-hidden="true" className="grade-papel pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Cabecalho
            n={1}
            rotulo="Onde atuamos"
            titulo={
              <>
                Quatro frentes para quem <em className="text-marca">fatura, licita e contrata</em>.
              </>
            }
          >
            <p className="m-0">
              O escritório concentra o trabalho onde o Direito toca o caixa da empresa: o tributo sobre a nota, o
              contrato com o Poder Público e o ato administrativo que trava a operação.
            </p>
          </Cabecalho>
          <Link href="/areas" className="link-seta">
            Todas as áreas de atuação <span aria-hidden="true">→</span>
          </Link>
        </div>
        <BentoPilares />
      </Secao>

      <MarqueeNormas />

      <section className="planta relative isolate overflow-hidden pb-10 pt-24 md:pb-16 md:pt-32" aria-labelledby="painel-titulo">
        <GridBeam rows={4} cols={6} className="absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_50%_40%,black_30%,transparent_75%)]" />
        <div className="container" id="painel-titulo">
          <PainelCliente />
        </div>
      </section>

      <Secao id="como-trabalhamos" escura grade>
        <Cabecalho n={2} rotulo="Como trabalhamos" titulo={<>Da mensagem no WhatsApp <em className="text-sinal">ao prazo no calendário</em>.</>} escura>
          <p className="m-0">
            Seis passos que se repetem em cada caso. O exemplo é ilustrativo: um pregão, uma inabilitação e um prazo
            de recurso — nenhum cliente real aparece nas cenas.
          </p>
        </Cabecalho>
        <Filme />
      </Secao>

      <Secao id="advogado" className="overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.28),transparent_65%)] blur-2xl" />
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[440px]">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[34px] bg-[linear-gradient(135deg,rgb(142_139_255/0.5),rgb(29_27_154/0.15)_50%,rgb(211_154_91/0.35))] blur-[2px]" />
            <div className="relative overflow-hidden rounded-[30px] bg-tinta">
              <Image
                src="/assets/img/douglas-estudio.jpg"
                alt="Douglas Senturião, advogado responsável pelo escritório"
                width={1100}
                height={1650}
                sizes="(min-width: 768px) 440px, 90vw"
                className="h-auto w-full"
              />
              <div className="vidro-escuro absolute bottom-4 left-4 right-4 rounded-2xl px-4 py-3 text-white">
                <span className="rotulo block text-[10px] text-sinal">Advogado responsável</span>
                <span className="semi mt-0.5 block text-[1.02rem] font-[700]">{settings.lawyerName}</span>
              </div>
            </div>
          </Reveal>
          <div className="min-w-0">
            <p className="etiqueta m-0">
              <span className="num opacity-70">03</span>O advogado
            </p>
            <h2 className="display m-0 mt-5 text-[clamp(2.4rem,5.4vw,4.4rem)] text-grafite">
              {settings.lawyerName}
            </h2>
            <span className="rotulo mt-5 inline-block rounded-full border border-marca/25 bg-white px-3 py-1.5 text-[10.5px] text-marca">
              {settings.oab}
            </span>
            <p className="m-0 mt-6 max-w-[56ch] text-[1.06rem] leading-relaxed text-cinza">
              Há mais de dez anos dedicado ao direito público, com atuação concentrada em licitações e contratos
              administrativos — e a mesma disciplina aplicada às questões tributárias da empresa e a causas cíveis e
              empresariais selecionadas. Acompanha cada caso de perto, do primeiro diagnóstico à sustentação, e
              atende em todo o Brasil, de forma presencial ou remota.
            </p>
            <blockquote className="citacao m-0 mt-8 max-w-[34ch] border-l-2 border-marca pl-5 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.2] text-grafite">
              Tese antes da peça, prazo antes de tudo.
            </blockquote>
            <Link href="/sobre" className="link-seta mt-9">
              Conhecer o escritório <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Secao>

      <Secao id="conteudo" className="bg-[linear-gradient(180deg,var(--papel),#e7e6f1)] pt-0 md:pt-0">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Cabecalho n={4} rotulo="Conteúdo técnico" titulo="O que muda na lei, explicado com clareza.">
            <p className="m-0">
              Artigos sobre prazos, leis e entendimentos dos tribunais, para quem decide na empresa.
            </p>
          </Cabecalho>
          <Link href="/blog" className="link-seta">
            Ver todos os artigos <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Secao>

      <section className="planta ruido relative isolate overflow-hidden py-20 md:py-28" aria-labelledby="cta-final-titulo">
        <GridBeam rows={3} cols={5} className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_50%,black_30%,transparent_80%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[600px] w-[700px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(29_27_154/0.75),transparent)] blur-2xl" />
        <div className="container grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="etiqueta etiqueta--escura etiqueta--ambar m-0">Próximo passo</p>
            <h2 id="cta-final-titulo" className="display m-0 mt-6 text-[clamp(2.4rem,5.6vw,4.6rem)] text-white">
              Tem uma nota, um edital ou um prazo <em className="text-sinal">na mesa</em>?
            </h2>
            <p className="m-0 mt-6 max-w-[50ch] text-[1.06rem] leading-relaxed text-cinza-escuro">
              Conte em quatro campos. O escritório lê o caso, aponta o caminho e o prazo, e retorna em até 1 dia útil.
            </p>
            <ul className="m-0 mt-8 grid list-none gap-3 p-0 text-[0.95rem] text-[#d4d3f3]">
              {['Diagnóstico por escrito, antes de qualquer proposta', 'Atendimento direto com o advogado responsável', 'Em todo o Brasil, presencial ou remoto'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sinal/15 text-sinal">
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá, gostaria de agendar um atendimento.')}`}
              target="_blank"
              rel="noopener"
              className="link-seta mt-9"
            >
              Prefere o WhatsApp? <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="vidro-escuro relative rounded-[30px] p-6 sm:p-9">
            <FormularioDiagnostico whatsapp={settings.whatsapp} escuro titulo="Diagnóstico inicial" />
          </div>
        </div>
      </section>
    </>
  );
}
