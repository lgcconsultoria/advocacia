import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { metaSocial, SITE } from '@/lib/seo';
import { getSettings } from '@/lib/reader';
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
import { CABE, CAMINHO, ENVIAR, FAQ, HERO, META, NAO_CABE, PASSOS, REF, RESSALVA } from './conteudo';

/**
 * Landing de dor: "Mandado de segurança em licitação" (P1 da auditoria de
 * 21/10/2026). Uma intenção por URL, formulário curto com origem, WhatsApp com
 * a mensagem da dor e eventos (ViewContent, Lead, Contact). Os textos jurídicos
 * estão em ./conteudo.ts.
 */

export const metadata: Metadata = {
  title: META.titulo,
  description: META.descricao,
  keywords: [
    'mandado de segurança licitação',
    'mandado de segurança pregão',
    'inabilitação licitação',
    'desclassificação licitação',
    'prazo mandado de segurança 120 dias',
  ],
  alternates: { canonical: CAMINHO },
  ...metaSocial({ titulo: META.titulo, descricao: META.descricao, caminho: CAMINHO }),
};

export default async function MandadoSegurancaLicitacaoPage() {
  const settings = await getSettings();

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Licitações', item: `${SITE}/licitacoes` },
      { '@type': 'ListItem', position: 3, name: 'Mandado de segurança', item: `${SITE}${CAMINHO}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <VerConteudo categoria="licitacoes:mandado-de-seguranca" nome="Mandado de segurança em licitação" />

      <PageHero
        trilha={[{ href: '/licitacoes', label: 'Departamento de Licitações' }, { label: 'Mandado de segurança' }]}
        rotulo={HERO.rotulo}
        titulo={HERO.titulo}
        lead={HERO.lead}
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
        <Reveal>
          <Cabecalho rotulo="O que fazer agora" titulo="Os prazos são curtos. Comece por aqui." />
        </Reveal>
        <ol className="m-0 mt-12 grid list-none gap-5 p-0 md:grid-cols-2">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="rounded-3xl bg-white p-7 sm:p-8">
              <p className="rotulo num m-0 text-marca">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="semi m-0 mt-3 text-[1.2rem] font-[720] leading-tight">{p.titulo}</h3>
              <p className="m-0 mt-3 leading-relaxed text-cinza">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <Cabecalho rotulo="Quando cabe" titulo="Ato ilegal, prova documental e prazo em aberto." />
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-7">
                <h3 className="semi m-0 mb-4 text-[1.1rem] font-[720] leading-tight">Pode caber</h3>
                <ul className="checklist">
                  {CABE.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <h3 className="semi m-0 mb-4 text-[1.1rem] font-[720] leading-tight">Em regra, não cabe</h3>
                <ul className="checklist">
                  {NAO_CABE.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-10 rounded-3xl border-l-2 border-marca bg-white p-7 sm:p-9">
              <p className="citacao m-0 text-[1.6rem] leading-tight text-grafite">Uma ressalva honesta</p>
              <p className="m-0 mt-4 leading-relaxed text-cinza">{RESSALVA}</p>
            </div>
            <div className="mt-10">
              <p className="rotulo m-0 text-marca">O que enviar para análise</p>
              <ul className="checklist mt-4">
                {ENVIAR.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside id="analise" className="aside-card is-sticky self-start scroll-mt-28 sm:p-8">
            <FormularioDiagnostico
              whatsapp={settings.whatsapp}
              interesse="licitacoes"
              origemLead={REF}
              titulo="Envie o caso para análise"
              subtitulo="Quatro campos. O escritório retorna em até 1 dia útil e pede o edital, a ata e a decisão."
            />
            <p className="hint mb-0 mt-4">
              A triagem técnica inicial não constitui mandato profissional.
            </p>
          </aside>
        </div>
      </Secao>

      <Secao>
        <Reveal>
          <Cabecalho rotulo="Perguntas frequentes" titulo="Mandado de segurança em licitação: dúvidas comuns" />
        </Reveal>
        <div className="mt-12">
          <FaqAccordion items={FAQ} />
        </div>
        <p className="m-0 mt-10 text-[0.9rem] text-cinza">
          Veja também: <Link href="/areas/mandado-de-seguranca" className="text-marca underline underline-offset-2">mandado de segurança contra atos da Administração</Link>
          {' · '}
          <Link href="/modelos/mandado-seguranca-desclassificacao" className="text-marca underline underline-offset-2">roteiro para desclassificação</Link>
          {' · '}
          <Link href="/licitacoes/fui-inabilitado" className="text-marca underline underline-offset-2">fui inabilitado</Link>
          {' · '}
          <Link href="/licitacoes/desclassificada-no-pregao" className="text-marca underline underline-offset-2">desclassificada no pregão</Link>
          {' · '}
          <Link href="/licitacoes/recurso-administrativo" className="text-marca underline underline-offset-2">recurso administrativo</Link>
          {' · '}
          <Link href="/licitacoes/impugnacao-de-edital" className="text-marca underline underline-offset-2">impugnação de edital</Link>
          {' · '}
          <Link href="/licitacoes" className="text-marca underline underline-offset-2">Departamento de Licitações e Contratos Públicos</Link>.
        </p>
      </Secao>

      <CtaFaixa
        titulo="O prazo de 120 dias já está correndo?"
        texto="Envie a decisão e a data em que a empresa teve ciência. Retornamos a triagem técnica em até 1 dia útil."
      >
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
