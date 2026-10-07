import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreas, getPosts, getSettings } from '@/lib/reader';
import { JsonLd } from '@/components/json-ld';
import { FaqAccordion, type FaqItem } from '@/components/faq-accordion';
import { buttonVariants } from '@/components/ui/button';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { ProvedorPncp } from '@/components/licitacoes/contexto';
import { HeroLicitacoes } from '@/components/licitacoes/hero';
import { Termometro } from '@/components/licitacoes/termometro';
import { MapaUfs } from '@/components/licitacoes/mapa-ufs';
import { UmAno } from '@/components/licitacoes/um-ano';
import { Frentes } from '@/components/licitacoes/frentes';
import { FilmeLicitacoes } from '@/components/licitacoes/filme';
import { dadosIniciais } from './dados';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

// Números do PNCP montados no servidor e renovados a cada 2 min (ISR); no
// navegador, o termômetro segue ao vivo pelas rotas /api/pncp/*.
export const revalidate = 120;

const URL_PAGINA = 'https://www.senturiaoadv.com.br/licitacoes';

export const metadata: Metadata = {
  title: 'Departamento de Licitações: assessoria jurídica em licitações e contratos públicos',
  description:
    'Departamento jurídico de licitações para empresas: análise de edital e matriz de riscos, habilitação, impugnações, suporte na sessão, recursos, mandado de segurança, contratos, reequilíbrio (inclusive IBS/CBS) e defesa em sanções. Com o termômetro ao vivo das contratações públicas do PNCP.',
  alternates: { canonical: '/licitacoes' },
  openGraph: {
    title: 'Departamento de Licitações — Douglas Senturião Advocacia',
    description:
      'Soluções jurídicas integradas para o departamento de licitações da sua empresa, do edital ao contrato, sob a Lei 14.133/2021.',
    url: '/licitacoes',
  },
};

const FAQ: FaqItem[] = [
  {
    question: 'Qual é o prazo para impugnar um edital ou pedir esclarecimento?',
    answer:
      'Pela Lei 14.133/2021 (art. 164), qualquer pessoa pode impugnar o edital por irregularidade ou pedir esclarecimento sobre ele até 3 dias úteis antes da data de abertura do certame. A resposta deve ser divulgada no sítio eletrônico oficial em até 3 dias úteis, limitada ao último dia útil anterior à abertura.\n\nComo o prazo é curto e conta da data da sessão para trás, a leitura jurídica do edital precisa acontecer logo após a publicação.',
  },
  {
    question: 'Quanto tempo a empresa tem para recorrer do julgamento ou da inabilitação?',
    answer:
      'O recurso deve ser apresentado em 3 dias úteis, contados da intimação ou da lavratura da ata (art. 165, I). A intenção de recorrer precisa ser manifestada imediatamente na sessão, sob pena de preclusão (art. 165, § 1º, I).\n\nAs contrarrazões seguem o mesmo prazo, contado da intimação pessoal ou da divulgação da interposição do recurso (art. 165, § 4º). Recurso e pedido de reconsideração têm efeito suspensivo até a decisão final (art. 168).',
  },
  {
    question: 'A proposta pode ser desclassificada por preço inexequível sem chance de defesa?',
    answer:
      'O art. 59 da Lei 14.133/2021 permite à Administração fazer diligências para aferir a exequibilidade ou exigir que o licitante a demonstre (art. 59, § 2º). Em obras e serviços de engenharia, a lei presume inexequíveis as propostas abaixo de 75% do valor orçado (art. 59, § 4º), presunção que o TCU tem tratado como relativa.\n\nNa prática, a defesa da proposta se faz com planilha de custos, justificativa técnica e fundamentação jurídica, no prazo que a diligência fixar.',
  },
  {
    question: 'A Reforma Tributária dá direito a reequilíbrio em contratos administrativos?',
    answer:
      'A Lei Complementar 214/2025 (arts. 374 a 376) trata do restabelecimento do equilíbrio econômico-financeiro dos contratos administrativos afetados pela substituição dos tributos atuais pelo IBS e pela CBS.\n\nO pedido precisa demonstrar o impacto concreto na carga tributária do contrato, com memória de cálculo. Cada contrato exige análise própria: regime de preços, data da proposta e cláusulas de reajuste e repactuação influem no resultado.',
  },
  {
    question: 'A empresa pode se defender antes de ser punida pela Administração?',
    answer:
      'Sim. Para a multa, a lei garante defesa em 15 dias úteis (art. 157). O impedimento de licitar e a declaração de inidoneidade exigem processo de responsabilização conduzido por comissão, com defesa escrita e produção de provas em 15 dias úteis (art. 158).\n\nDa decisão cabem recurso (art. 166) ou pedido de reconsideração (art. 167), ambos em 15 dias úteis e com efeito suspensivo (art. 168). Depois de cumpridos os requisitos legais, é possível pedir a reabilitação (art. 163).',
  },
  {
    question: 'De onde vêm os números do termômetro e com que frequência mudam?',
    answer:
      'Do Portal Nacional de Contratações Públicas (PNCP), onde órgãos de todo o país publicam editais, avisos, atos de contratação direta e contratos por força da Lei 14.133/2021. As contagens são consultadas a cada 2 minutos, os valores a cada 15 minutos e o mapa por estado a cada 3 horas.\n\nOs valores são os estimados pelos próprios órgãos; a soma exclui registros acima de R$ 10 bilhões, em regra erros de cadastro. Entre uma consulta e outra, os contadores avançam no ritmo observado na última hora, e essa projeção vem marcada como tal.',
  },
];

const FORMAS = [
  {
    rotulo: 'Contínuo',
    titulo: 'Departamento jurídico de licitações',
    texto:
      'Acompanhamento mensal das licitações e dos contratos da empresa: editais analisados à medida que surgem, prazos monitorados, suporte nas sessões, recursos, gestão dos contratos em execução e reuniões periódicas com a equipe comercial.',
    itens: ['Escopo e volume definidos por escrito', 'Um mesmo time do edital ao contrato', 'Relatórios objetivos de cada certame'],
  },
  {
    rotulo: 'Pontual',
    titulo: 'Atuação por certame',
    texto:
      'Para um edital específico: da análise de viabilidade à homologação, ou só na fase em que a empresa precisa de apoio (impugnação, sessão, recurso ou contrarrazões).',
    itens: ['Diagnóstico antes da proposta de trabalho', 'Atenção ao calendário do certame', 'Peças com tese própria'],
  },
  {
    rotulo: 'Contencioso',
    titulo: 'Medidas judiciais e defesa em sanções',
    texto:
      'Mandado de segurança contra atos ilegais no certame ou no contrato, ações sobre reequilíbrio e pagamentos, e defesa em processos administrativos sancionadores.',
    itens: ['Avaliação de cabimento e urgência', 'Pedido liminar quando cabível', 'Coordenação entre as esferas administrativa e judicial'],
  },
];

export default async function LicitacoesPage() {
  const [{ termometro, uf, serie }, areas, posts, settings] = await Promise.all([
    dadosIniciais(),
    getAreas(),
    getPosts(),
    getSettings(),
  ]);
  const nomesAreas = Object.fromEntries(areas.map((a) => [a.slug, a.title]));
  const nomesPosts = Object.fromEntries(posts.map((p) => [p.slug, p.title]));

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${URL_PAGINA}#servico`,
    name: 'Assessoria jurídica em licitações',
    alternateName: 'Departamento jurídico de licitações',
    serviceType: 'Assessoria jurídica em licitações e contratos públicos',
    description:
      'Departamento jurídico de licitações para empresas licitantes e contratadas: análise de edital, habilitação, impugnações, suporte na sessão, recursos, mandado de segurança, contratos administrativos, reequilíbrio econômico-financeiro e defesa em processos sancionadores, sob a Lei 14.133/2021.',
    url: URL_PAGINA,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: { '@type': 'BusinessAudience', name: 'Empresas que disputam e executam contratos públicos' },
    provider: {
      '@type': 'LegalService',
      '@id': 'https://www.senturiaoadv.com.br/#escritorio',
      name: settings.firmName,
      url: 'https://www.senturiaoadv.com.br/',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formas de atuação',
      itemListElement: FORMAS.map((f) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: f.titulo, description: f.texto },
      })),
    },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/\n\n/g, ' ') },
    })),
  };
  const trilhaLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.senturiaoadv.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Departamento de Licitações', item: URL_PAGINA },
    ],
  };

  return (
    <ProvedorPncp termometro={termometro} uf={uf}>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={trilhaLd} />

      <HeroLicitacoes whatsapp={settings.whatsapp} />

      <Secao id="termometro" escura grade className="border-t border-sinal/15" aria-labelledby="termometro-titulo">
        <Cabecalho
          n={1}
          rotulo="Ao vivo"
          id="termometro-titulo"
          escura
          titulo={
            <>
              Termômetro das <span className="text-sinal">contratações públicas</span>
            </>
          }
        >
          <p className="m-0">
            O movimento do mercado público brasileiro, consultado no Portal Nacional
            de Contratações Públicas enquanto você lê: quantas contratações estão
            recebendo propostas, quanto somam e quantas são publicadas por minuto.
          </p>
        </Cabecalho>
        <Termometro />
      </Secao>

      <Secao id="estados" className="bg-[linear-gradient(180deg,var(--papel),#e9e9f2)]" aria-labelledby="estados-titulo">
        <Cabecalho
          n={2}
          rotulo="Por estado"
          id="estados-titulo"
          titulo={
            <>
              Compras públicas <span className="text-marca">por estado</span>
            </>
          }
        >
          <p className="m-0">
            Contratações abertas em cada unidade da federação, o valor estimado em
            aberto e o que foi publicado nos últimos 30 dias. Cada ponto do globo
            fica na capital; o tamanho acompanha o número de contratações abertas.
          </p>
        </Cabecalho>
        <MapaUfs />
      </Secao>

      <Secao id="um-ano" escura aria-labelledby="um-ano-titulo">
        <Cabecalho n={3} rotulo="O ritmo" id="um-ano-titulo" escura titulo="Um ano de licitações, dia a dia">
          <p className="m-0">
            Cada quadrado é um dia; a altura, quantas contratações foram publicadas
            no PNCP. Os dias úteis formam a cidade, os fins de semana ficam rentes
            ao chão. É esse fluxo que o departamento acompanha, edital por edital.
          </p>
        </Cabecalho>
        <UmAno serie={serie} />
      </Secao>

      <Secao id="departamento" aria-labelledby="departamento-titulo">
        <Cabecalho
          n={4}
          rotulo="O departamento"
          id="departamento-titulo"
          titulo={
            <>
              O departamento jurídico <span className="text-marca">de licitações</span>
            </>
          }
        >
          <p className="m-0">
            Para a empresa que disputa contratos públicos, o jurídico precisa estar
            em todas as fases, não só quando surge um problema. O escritório funciona
            como o departamento jurídico de licitações da empresa, integrado à equipe
            comercial e às rotinas de cada certame.
          </p>
        </Cabecalho>
        <p className="citacao m-0 mt-12 max-w-[34ch] text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.15] text-grafite">
            Cada fase da licitação tem um prazo próprio. Perder um deles costuma encerrar a disputa.
          </p>
        <Frentes areas={nomesAreas} posts={nomesPosts} />
      </Secao>

      <Secao id="como-opera" escura aria-labelledby="como-opera-titulo">
        <Cabecalho n={5} rotulo="Como o departamento opera" id="como-opera-titulo" escura titulo="Do edital captado ao contrato em execução">
          <p className="m-0">
            Seis momentos que se repetem em cada certame. O exemplo é ilustrativo:
            nenhum cliente, órgão ou caso real aparece nas cenas.
          </p>
        </Cabecalho>
        <FilmeLicitacoes />
      </Secao>

      <Secao id="formas" className="bg-[linear-gradient(180deg,#ebe9f1,var(--papel))]" aria-labelledby="formas-titulo">
        <Cabecalho n={6} rotulo="Formas de atuação" id="formas-titulo" titulo="Contínuo, por certame ou no contencioso">
          <p className="m-0">
            O formato acompanha a rotina da empresa. Escopo e honorários são
            definidos por escrito depois do diagnóstico inicial, conforme a
            complexidade e o volume de trabalho.
          </p>
        </Cabecalho>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {FORMAS.map((f, i) => (
            <article
              key={f.titulo}
              className={
                i === 0
                  ? 'planta relative isolate flex flex-col overflow-hidden rounded-[28px] p-7 shadow-[0_40px_80px_-40px_rgb(29_27_154/0.7)] sm:p-9'
                  : 'flex flex-col rounded-[28px] border border-papel-2 bg-white p-7 sm:p-9'
              }
            >
              <p className={`rotulo m-0 text-[10.5px] ${i === 0 ? 'text-sinal' : 'text-marca'}`}>
                {String(i + 1).padStart(2, '0')} · {f.rotulo}
              </p>
              <h3 className={`expandida m-0 mt-4 text-[1.3rem] font-[740] leading-[1.12] tracking-[-0.015em] ${i === 0 ? 'text-white' : ''}`}>
                {f.titulo}
              </h3>
              <p className={`m-0 mt-3 text-[0.96rem] leading-relaxed ${i === 0 ? 'text-cinza-escuro' : 'text-cinza'}`}>{f.texto}</p>
              <ul className="checklist mt-5">
                {f.itens.map((t) => (
                  <li key={t} className="text-[0.93rem]">{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="m-0 mt-8 max-w-[80ch] text-[0.85rem] leading-relaxed text-cinza">
          A atuação é técnica e de meio: o escritório não promete resultado em
          licitações, recursos ou processos. Informações nesta página têm caráter
          informativo, nos termos do Provimento 205/2021 do Conselho Federal da OAB.
        </p>
      </Secao>

      <Secao id="perguntas" aria-labelledby="perguntas-titulo">
        <Cabecalho n={7} rotulo="Perguntas frequentes" id="perguntas-titulo" titulo="O que as empresas perguntam sobre licitações">
          <p className="m-0">
            Respostas curtas, com a base legal. Cada caso pede análise própria do
            edital e dos documentos.
          </p>
        </Cabecalho>
        <div className="mt-12">
          <FaqAccordion items={FAQ} />
          <Link href="/areas/licitacoes" className="link-seta mt-10">
            Ver a área de Licitações Públicas <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Secao>

      <CtaFaixa
        rotulo="Departamento de Licitações"
        titulo="Tem um edital aberto ou um prazo correndo?"
        texto="Envie o edital ou a ata para um diagnóstico inicial. Retornamos em até 1 dia útil com os próximos passos."
      >
        <BotaoDiagnostico variant="claro" size="lg" interesse="licitacoes">
          Solicitar diagnóstico
        </BotaoDiagnostico>
        <a
          className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá, gostaria de falar sobre o departamento jurídico de licitações.')}`}
          target="_blank"
          rel="noopener"
        >
          Falar pelo WhatsApp
        </a>
      </CtaFaixa>
    </ProvedorPncp>
  );
}
