import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { metaSocial } from '@/lib/seo';
import { CONTEUDO_FRENTES } from '@/content/frentes';
import { ehFrenteComLanding, FRENTES_COM_LANDING, tituloPorTermo } from '@/lib/frentes';
import { JsonLd } from '@/components/json-ld';
import { Assinatura } from '@/components/site/marca';
import { Cabecalho, GradePlanta, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { Reveal } from '@/components/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { VerConteudo } from '@/components/ver-conteudo';
import { buttonVariants } from '@/components/ui/button';
import { FormularioFrente } from '@/components/frente/formulario-frente';
import { BotaoWhatsapp } from '@/components/frente/botao-whatsapp';
import { WhatsappFlutuante } from '@/components/frente/whatsapp-flutuante';

/**
 * Landing de anúncio por frente: /f/<frente>. Uma promessa de problema (sem
 * promessa de resultado), formulário curto já na primeira dobra, WhatsApp com o
 * código da frente, sem menu de saída. O título pode vir da palavra-chave do
 * anúncio (`?kw=`), mas só de uma lista fechada por frente (content/frentes).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return FRENTES_COM_LANDING.map((frente) => ({ frente }));
}

type Props = {
  params: Promise<{ frente: string }>;
  searchParams: Promise<{ kw?: string | string[] }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { frente } = await params;
  if (!ehFrenteComLanding(frente)) return {};
  const c = CONTEUDO_FRENTES[frente];
  const caminho = `/f/${frente}`;
  return {
    title: c.meta.titulo,
    description: c.meta.descricao,
    alternates: { canonical: caminho },
    ...metaSocial({ titulo: c.meta.titulo, descricao: c.meta.descricao, caminho }),
  };
}

export default async function LandingFrente({ params, searchParams }: Props) {
  const { frente } = await params;
  if (!ehFrenteComLanding(frente)) notFound();
  const c = CONTEUDO_FRENTES[frente];
  const { kw } = await searchParams;
  const titulo = tituloPorTermo(kw, c.titulosPorTermo, c.titulo);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.perguntasFrequentes.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <VerConteudo categoria={frente} nome={`frente:${frente}`} />

      <section className="planta ruido relative isolate overflow-hidden">
        <GradePlanta className="opacity-[0.16]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgb(91_87_255/0.38),transparent_62%)] blur-2xl"
        />
        <div className="container relative pb-14 pt-6 md:pb-20 md:pt-8">
          <Assinatura className="text-white" />

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <p className="etiqueta etiqueta--escura m-0">{c.rotulo}</p>
              <h1 className="display m-0 mt-5 text-[clamp(1.95rem,4.8vw,3.3rem)] text-white">{titulo}</h1>
              <p className="mt-6 max-w-[56ch] text-[1.08rem] leading-relaxed text-cinza-escuro">{c.subtitulo}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className={buttonVariants({ variant: 'claro', size: 'lg' })} href="#analise">
                  Enviar o caso para análise <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
                </a>
                <BotaoWhatsapp
                  frente={frente}
                  texto={c.textoWhatsapp}
                  className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}
                >
                  Falar pelo WhatsApp
                </BotaoWhatsapp>
              </div>
            </div>

            <aside id="analise" className="aside-card min-w-0 scroll-mt-6 sm:p-8">
              <FormularioFrente
                frente={frente}
                interesse={c.interesse}
                pergunta={c.pergunta}
                mostrarEmpresa={c.mostrarEmpresa}
                textoWhatsapp={c.textoWhatsapp}
              />
            </aside>
          </div>
        </div>
      </section>

      <Secao>
        <Reveal>
          <Cabecalho rotulo="Você se reconhece?" titulo={c.dorTitulo} />
        </Reveal>
        <ul className="m-0 mt-12 grid list-none gap-5 p-0 md:grid-cols-3">
          {c.dor.map((t) => (
            <li key={t} className="rounded-3xl bg-white p-7">
              <Check className="h-5 w-5 text-marca" strokeWidth={2.4} aria-hidden="true" />
              <p className="m-0 mt-4 leading-relaxed text-grafite">{t}</p>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        <Reveal>
          <Cabecalho rotulo="Como funciona" titulo="Três passos, sem burocracia." />
        </Reveal>
        <ol className="m-0 mt-12 grid list-none gap-5 p-0 md:grid-cols-3">
          {c.como.map((p, i) => (
            <li key={p.titulo} className="rounded-3xl bg-white p-7 sm:p-8">
              <p className="rotulo num m-0 text-marca">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="semi m-0 mt-3 text-[1.2rem] font-[720] leading-tight">{p.titulo}</h3>
              <p className="m-0 mt-3 leading-relaxed text-cinza">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao escura>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <Cabecalho escura rotulo="Quem atende" titulo="Advogado responsável pelo seu caso." />
          </Reveal>
          <ul className="m-0 grid list-none gap-4 p-0">
            {c.credenciais.map((t) => (
              <li key={t} className="flex gap-3 text-[1.04rem] leading-relaxed text-cinza-escuro">
                <Check className="mt-1 h-5 w-5 shrink-0 text-sinal" strokeWidth={2.4} aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao>
        <Reveal>
          <Cabecalho rotulo="Perguntas frequentes" titulo="Dúvidas comuns antes de enviar o caso." />
        </Reveal>
        <div className="mt-12">
          <FaqAccordion items={c.perguntasFrequentes} />
        </div>
      </Secao>

      <CtaFaixa
        rotulo="Próximo passo"
        titulo="Envie o caso e saiba o que cabe."
        texto="A triagem técnica inicial não constitui mandato profissional. O escritório retorna em até 1 dia útil."
      >
        <a className={buttonVariants({ variant: 'claro', size: 'lg' })} href="#analise">
          Enviar o caso <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
        </a>
        <BotaoWhatsapp
          frente={frente}
          texto={c.textoWhatsapp}
          className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}
        >
          Falar pelo WhatsApp
        </BotaoWhatsapp>
      </CtaFaixa>

      <WhatsappFlutuante frente={frente} texto={c.textoWhatsapp} />
    </>
  );
}
