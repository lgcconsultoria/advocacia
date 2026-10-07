import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, CalendarCheck, FileSignature, Gavel, Layers3, ReceiptText, Scale, ShieldCheck, Users } from 'lucide-react';
import { getSettings } from '@/lib/reader';
import { PRAZOS_OPCAO, REFERENCIA_ESTIMADA, pct, reais, simularDemo } from '@/lib/tributario/simulador';
import { JsonLd } from '@/components/json-ld';
import { FaqAccordion, type FaqItem } from '@/components/faq-accordion';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';
import { Fatura3D } from '@/components/tributario/fatura-3d';
import { FaturaFilme } from '@/components/tributario/fatura-filme';
import { Recibos } from '@/components/tributario-pagina/recibos';
import { SimuladorPagina } from '@/components/tributario-pagina/simulador-pagina';
import { SplitPayment } from '@/components/tributario-pagina/split-payment';
import { LinhaReforma } from '@/components/tributario-pagina/linha-reforma';
import { GridBeam } from '@/components/ui/grid-beam';

const URL_PAGINA = 'https://www.senturiaoadv.com.br/tributario';

export const metadata: Metadata = {
  title: 'Assessoria tributária para empresas: Reforma Tributária, Simples híbrido e split payment',
  description:
    'A Reforma Tributária chegou à sua nota fiscal. Diagnóstico com os números da empresa, simulação ano a ano de 2027 a 2033, opção do Simples (puro ou híbrido), cláusulas de preço e reequilíbrio nos contratos e defesa em autuações. Simulador ilustrativo na página.',
  alternates: { canonical: '/tributario' },
  openGraph: {
    title: 'Assessoria tributária para empresas — Douglas Senturião Advocacia',
    description:
      'IBS e CBS, Simples puro × híbrido, split payment e contratos: o que muda na nota fiscal da sua empresa, de 2027 a 2033.',
    url: '/tributario',
  },
};

const demo = simularDemo(2027);
const ref = REFERENCIA_ESTIMADA.cbs + REFERENCIA_ESTIMADA.ibs;

const POR_QUE = [
  {
    Icone: Layers3,
    titulo: 'O tributo sobre o consumo muda de nome e de lugar na nota',
    texto:
      'PIS, Cofins, ICMS e ISS saem; entram a CBS (federal) e o IBS (estados e municípios), cobrados por fora do preço e destacados no documento fiscal. A troca é gradual, de 2027 a 2033.',
    fonte: 'EC 132/2023; LC 214/2025',
  },
  {
    Icone: Users,
    titulo: 'O crédito do seu cliente passa a contar no preço',
    texto:
      'A empresa do regime regular credita o IBS e a CBS das compras. Quem vende para ela entrega crédito — e, para o cliente, o custo que importa é o preço menos o crédito.',
    fonte: 'LC 214/2025, art. 47',
  },
  {
    Icone: Scale,
    titulo: 'A empresa do Simples precisa escolher',
    texto:
      'A partir de 2027, dá para manter tudo no DAS (Simples puro) ou recolher IBS e CBS por fora (híbrido). No puro, o cliente só credita o que o DAS cobrou desses tributos — em geral, uma fração pequena da nota.',
    fonte: 'LC 214/2025, arts. 41, § 3º, e 47, § 9º; LC 123/2006, art. 13, § 10',
  },
  {
    Icone: FileSignature,
    titulo: 'Preço e contrato precisam dizer o que vale',
    texto:
      'Com o tributo por fora, o “preço” tem duas leituras: com ou sem IBS/CBS. Contratos de prazo longo precisam definir qual vale e como se reequilibra. Nos contratos administrativos, a LC 214 prevê o reequilíbrio.',
    fonte: 'LC 214/2025, arts. 374 a 376',
  },
];

const PAPEL = [
  {
    Icone: Calculator,
    titulo: 'Diagnóstico com os números reais',
    texto: 'Faturamento, folha, compras e perfil dos clientes — quanto da receita vem de empresas que aproveitam crédito.',
  },
  {
    Icone: Layers3,
    titulo: 'Simulação ano a ano, de 2027 a 2033',
    texto: 'Os dois regimes lado a lado em cada ano da transição, com o ponto em que a escolha muda.',
  },
  {
    Icone: CalendarCheck,
    titulo: 'Opção dentro do prazo',
    texto: `Para valer no 1º semestre de 2027, a opção vai até ${PRAZOS_OPCAO.opcao1oSemestre2027} (desistência ${PRAZOS_OPCAO.desistencia}); a próxima janela é em ${PRAZOS_OPCAO.proximaJanela}.`,
    fonte: PRAZOS_OPCAO.fonte,
  },
  {
    Icone: FileSignature,
    titulo: 'Cláusulas de preço e reequilíbrio',
    texto: 'Preço líquido de IBS/CBS, repasse e reequilíbrio nos contratos com clientes, fornecedores e com o Poder Público.',
  },
  {
    Icone: ShieldCheck,
    titulo: 'Defesa em autuações e consultas',
    texto: 'Impugnações e recursos administrativos, medidas judiciais e consultas formais ao Fisco quando a norma deixa dúvida.',
  },
];

const FAQ: FaqItem[] = [
  {
    question: 'O Simples híbrido é sempre melhor para quem vende a outras empresas?',
    answer: `Não. Depende de quanto da receita vem de empresas do regime regular, de quanto a empresa compra com crédito e do que acontece com o preço. No cenário de demonstração desta página (serviço 100% B2B, 2027), o cliente paga ${reais(Math.abs(demo.fatura.diferencas.custoCliente))} a menos por fatura de R$ 100 mil, mas a empresa recolhe ${reais(demo.fatura.diferencas.impostoEmpresa)} a mais se mantiver o preço.\n\nQuando a maior parte das vendas é para pessoas físicas, ou quando há poucas compras com crédito, o Simples puro tende a continuar melhor. Por isso a decisão pede um estudo com os dados da empresa.`,
  },
  {
    question: 'Qual será a alíquota do IBS e da CBS?',
    answer: `Ainda não há alíquota definitiva. A referência estimada hoje é de ${pct(ref)} somados (CBS ${pct(REFERENCIA_ESTIMADA.cbs)} + IBS ${pct(REFERENCIA_ESTIMADA.ibs)}), segundo a Res. CGIBS 14/2026 — é uma estimativa, não a alíquota legal, que depende de resolução do Senado Federal (LC 214/2025, arts. 349 e 353).`,
  },
  {
    question: 'Até quando a empresa do Simples precisa decidir entre o puro e o híbrido?',
    answer: `Para valer no 1º semestre de 2027, a opção pelo recolhimento do IBS e da CBS pelo regime regular vai até ${PRAZOS_OPCAO.opcao1oSemestre2027}, com desistência possível ${PRAZOS_OPCAO.desistencia}; a próxima janela é em ${PRAZOS_OPCAO.proximaJanela} (${PRAZOS_OPCAO.fonte}).\n\nComo a regulamentação ainda pode mudar, confirme o prazo vigente antes de decidir.`,
  },
  {
    question: 'O split payment aumenta o imposto?',
    answer:
      'Não muda o valor devido; muda o momento. No pagamento eletrônico, a parcela do IBS e da CBS é separada e enviada ao Fisco, e a empresa recebe o valor líquido (LC 214/2025, arts. 31 a 35). O efeito está no caixa e no capital de giro.',
  },
  {
    question: 'Meus contratos precisam mudar?',
    answer:
      'Os de prazo longo, provavelmente. É preciso definir se o preço é com ou sem IBS/CBS, quem absorve a mudança de carga na transição e como se faz o reequilíbrio. Nos contratos administrativos, a LC 214/2025 (arts. 374 a 376) trata do restabelecimento do equilíbrio econômico-financeiro.',
  },
  {
    question: 'A simulação desta página vale como parecer?',
    answer:
      'Não. É uma simulação ilustrativa, com premissas públicas listadas no próprio simulador. O resultado de cada empresa depende do estudo com os dados dela, e nada aqui é promessa de economia ou de resultado.',
  },
];

export default async function TributarioPage() {
  const settings = await getSettings();

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${URL_PAGINA}#servico`,
    name: 'Assessoria tributária para empresas',
    alternateName: 'Reforma Tributária: IBS, CBS e Simples híbrido',
    serviceType: 'Assessoria jurídica tributária',
    description:
      'Diagnóstico tributário com os números da empresa, simulação de 2027 a 2033, opção do Simples Nacional (puro ou híbrido), cláusulas de preço e reequilíbrio nos contratos e defesa em autuações e consultas.',
    url: URL_PAGINA,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: { '@type': 'BusinessAudience', name: 'Empresas, inclusive optantes pelo Simples Nacional' },
    provider: {
      '@type': 'LegalService',
      '@id': 'https://www.senturiaoadv.com.br/#escritorio',
      name: settings.firmName,
      url: 'https://www.senturiaoadv.com.br/',
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
      { '@type': 'ListItem', position: 2, name: 'Assessoria tributária', item: URL_PAGINA },
    ],
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={trilhaLd} />

      <PageHero
        trilha={[{ label: 'Tributário' }]}
        rotulo="Assessoria tributária para empresas"
        titulo={
          <>
            A Reforma Tributária chegou à <em className="citacao font-[400] tracking-[-0.01em] text-sinal">sua nota fiscal</em>.
          </>
        }
        lead="De 2027 a 2033, PIS, Cofins, ICMS e ISS dão lugar à CBS e ao IBS. Muda o preço, muda o crédito do seu cliente, muda o caixa. O escritório faz a conta com os números da sua empresa — e mostra quem ganha, quem paga e quando renegociar."
        video={{ src: '/assets/video/tributario-fatura.mp4', poster: '/assets/video/tributario-fatura.jpg', posicao: '68% 50%' }}
        className="min-h-[92svh]"
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <BotaoDiagnostico interesse="tributario" variant="claro">
            Fazer diagnóstico tributário <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
          </BotaoDiagnostico>
          <Link href="#simulador" className="btn btn-lg btn-contorno-claro">
            Simular agora
          </Link>
        </div>
        <ul className="m-0 mt-12 flex list-none flex-wrap gap-2.5 p-0">
          {[
            [pct(ref), 'IBS + CBS · referência estimada'],
            ['2027 → 2033', 'transição'],
            ['Simples', 'puro ou híbrido'],
          ].map(([n, t]) => (
            <li key={t} className="vidro-escuro flex items-baseline gap-2 rounded-full px-4 py-2">
              <span className="expandida num text-[0.95rem] font-[780] text-white">{n}</span>
              <span className="rotulo text-[9.5px] text-cinza-escuro">{t}</span>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* 01 — por que importa */}
      <Secao id="por-que" className="overflow-hidden">
        <div aria-hidden="true" className="grade-papel pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_20%_0%,black,transparent_70%)]" />
        <Cabecalho
          n={1}
          rotulo="Por que importa"
          titulo={
            <>
              Para quem fatura, a Reforma <em className="text-marca">não é só uma alíquota nova</em>.
            </>
          }
        >
          <p className="m-0">
            Em linguagem direta: o que muda para a empresa que emite nota fiscal, vende para outras empresas e assina
            contratos de prazo longo.
          </p>
        </Cabecalho>
        <ol className="m-0 mt-14 grid list-none gap-4 p-0 md:grid-cols-2">
          {POR_QUE.map(({ Icone, titulo, texto, fonte }, i) => (
            <li key={titulo} className="card group flex flex-col overflow-hidden p-7 sm:p-9">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(142_139_255/0.2),rgb(29_27_154/0.08))] text-marca">
                  <Icone className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rotulo num text-[10px] text-cinza">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3 className="semi m-0 mt-6 text-[1.3rem] font-[740] leading-[1.18] tracking-[-0.015em] text-grafite">{titulo}</h3>
              <p className="m-0 mt-3 text-[0.98rem] leading-relaxed text-cinza">{texto}</p>
              <p className="rotulo m-0 mt-auto pt-6 text-[10px] text-marca">{fonte}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* 02 — a fatura em 3D */}
      <Secao id="fatura" className="bg-[linear-gradient(180deg,var(--papel),#e6e5f1)] pt-0 md:pt-0">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0">
            <Cabecalho
              n={2}
              rotulo="A fatura em camadas"
              titulo={
                <>
                  Uma nota de R$ 100 mil, <em className="text-marca">aberta ao meio</em>.
                </>
              }
            >
              <p className="m-0">
                Incline, gire e role: a nota se separa em duas camadas — o custo líquido para o seu cliente e o IBS/CBS
                que ele aproveita como crédito. Troque entre o Simples puro e o híbrido para ver a diferença.
              </p>
            </Cabecalho>
            <dl className="m-0 mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-papel-2 bg-white p-5">
                <dt className="rotulo text-[10px] text-cinza">Custo do cliente · híbrido × puro</dt>
                <dd className="expandida num m-0 mt-2 text-[1.5rem] font-[800] tracking-[-0.03em] text-[#14593a]">
                  {reais(demo.fatura.diferencas.custoCliente)}
                </dd>
              </div>
              <div className="rounded-2xl border border-papel-2 bg-white p-5">
                <dt className="rotulo text-[10px] text-cinza">Imposto da empresa · híbrido × puro</dt>
                <dd className="expandida num m-0 mt-2 text-[1.5rem] font-[800] tracking-[-0.03em] text-[#8c2f26]">
                  +{reais(demo.fatura.diferencas.impostoEmpresa)}
                </dd>
              </div>
            </dl>
            <p className="m-0 mt-4 text-[0.82rem] text-cinza">
              Simulação ilustrativa (2027). O resultado depende do estudo com os dados da sua empresa.
            </p>
          </div>
          <Fatura3D className="min-w-0" />
        </div>
      </Secao>

      {/* 03 — o filme */}
      <Secao id="filme" escura grade>
        <Cabecalho
          n={3}
          rotulo="O filme da fatura"
          escura
          titulo={
            <>
              Dois regimes, <em className="text-sinal">dois resultados</em>.
            </>
          }
        >
          <p className="m-0">
            Em 45 segundos, a mesma fatura nos dois regimes do Simples: o DAS, o IBS/CBS destacado, o crédito das
            compras e o crédito do cliente. Use os capítulos para pular de uma parte a outra.
          </p>
        </Cabecalho>
        <div className="mt-12">
          <FaturaFilme />
        </div>
      </Secao>

      {/* 04 — quem ganha o quê */}
      <Secao id="quem-ganha">
        <Cabecalho
          n={4}
          rotulo="Quem ganha o quê"
          titulo={
            <>
              O ganho aparece no cliente. <em className="text-marca">A conta, na sua empresa</em>.
            </>
          }
        >
          <p className="m-0">
            Com o preço mantido, o híbrido barateia a fatura para o cliente e encarece o imposto da empresa. A diferença
            é o espaço para renegociar — e há casos em que o Simples puro segue melhor.
          </p>
        </Cabecalho>
        <Recibos />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ['Vendas a pessoas físicas', 'Quem compra como consumidor final não aproveita crédito: o híbrido só faz a empresa recolher mais.'],
            ['Pouco B2B', 'Mesmo no cenário do exemplo, se só 30% das vendas forem a empresas do regime regular, o puro segue melhor.'],
            ['Tributo cobrado por cima', 'Se o IBS/CBS for somado ao preço, a vantagem passa toda para a empresa — e o cliente pode resistir ao reajuste.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[22px] border border-papel-2 bg-white/70 p-6">
              <p className="rotulo m-0 text-[10px] text-marca">Quando o puro tende a ganhar</p>
              <h3 className="semi m-0 mt-3 text-[1.1rem] font-[720] text-grafite">{t}</h3>
              <p className="m-0 mt-2 text-[0.94rem] leading-relaxed text-cinza">{d}</p>
            </div>
          ))}
        </div>
      </Secao>

      {/* 05 — split payment */}
      <SplitPayment />

      {/* 06 — linha do tempo */}
      <section id="linha-do-tempo" className="planta relative isolate overflow-hidden py-20 md:py-32" aria-labelledby="linha-titulo">
        <span id="reforma" className="absolute -top-20" aria-hidden="true" />
        <GridBeam rows={4} cols={8} className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_30%,black_25%,transparent_75%)]" />
        <div className="container">
          <Cabecalho
            n={6}
            rotulo="Cronograma"
            id="linha-titulo"
            escura
            titulo={
              <>
                Sete anos de transição, <em className="text-sinal">ano a ano</em>.
              </>
            }
          >
            <p className="m-0">
              Os tributos antigos saem aos poucos e os novos entram na mesma medida. Cada ano pede uma conta diferente
              — por isso a simulação é feita de 2027 a 2033.
            </p>
          </Cabecalho>
          <LinhaReforma />
        </div>
      </section>

      {/* 07 — simulador */}
      <Secao id="simulador" className="overflow-hidden bg-[linear-gradient(180deg,#e9e8f3,var(--papel))]">
        <Cabecalho
          n={7}
          rotulo="Simulador"
          titulo={
            <>
              Faça a conta com <em className="text-marca">o seu cenário</em>.
            </>
          }
        >
          <p className="m-0">
            Ajuste faturamento, atividade, vendas a empresas e compras com crédito. O simulador mostra os dois regimes
            lado a lado, o passo a passo e as premissas, com as fontes.
          </p>
        </Cabecalho>
        <div className="mt-12">
          <SimuladorPagina />
        </div>
        <p className="m-0 mt-6 text-[0.85rem] text-cinza">
          Simulação ilustrativa. O resultado depende do estudo com os dados da sua empresa.
        </p>
      </Secao>

      {/* 08 — o papel do escritório */}
      <Secao id="escritorio" escura>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Cabecalho
              n={8}
              rotulo="O papel do escritório"
              escura
              titulo={
                <>
                  Do número à <em className="text-sinal">cláusula</em>.
                </>
              }
            >
              <p className="m-0">
                O estudo tributário parte dos dados da empresa e termina em decisão, prazo cumprido e contrato
                ajustado. Escopo e honorários são definidos por escrito depois do diagnóstico.
              </p>
            </Cabecalho>
            <div className="mt-9">
              <BotaoDiagnostico interesse="tributario" variant="claro">
                Fazer diagnóstico tributário <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
              </BotaoDiagnostico>
            </div>
          </div>
          <ol className="m-0 grid list-none gap-3 p-0">
            {PAPEL.map(({ Icone, titulo, texto, fonte }, i) => (
              <li key={titulo} className="vidro-escuro flex gap-5 rounded-[24px] p-6 sm:p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sinal/15 text-sinal">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="rotulo num block text-[10px] text-cinza-escuro">{String(i + 1).padStart(2, '0')}</span>
                  <span className="semi mt-1 block text-[1.15rem] font-[720] leading-snug text-white">{titulo}</span>
                  <span className="mt-2 block text-[0.95rem] leading-relaxed text-cinza-escuro">{texto}</span>
                  {fonte && <span className="rotulo mt-3 block text-[9.5px] text-sinal">{fonte}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Secao>

      {/* 09 — perguntas */}
      <Secao id="perguntas" aria-labelledby="perguntas-titulo">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Cabecalho n={9} rotulo="Perguntas frequentes" id="perguntas-titulo" titulo="O que os empresários perguntam.">
            <p className="m-0">Respostas curtas, com a base legal. Cada empresa pede análise própria.</p>
          </Cabecalho>
          <div className="min-w-0">
            <FaqAccordion items={FAQ} />
            <p className="m-0 mt-8 flex items-start gap-2 text-[0.85rem] leading-relaxed text-cinza">
              <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-marca" aria-hidden="true" />
              Conteúdo informativo (Provimento CFOAB 205/2021). Números e simulações são ilustrativos e não são promessa
              de resultado.
            </p>
          </div>
        </div>
      </Secao>

      <CtaFaixa
        rotulo="Assessoria tributária"
        titulo="Antes de decidir, faça a conta com os seus números."
        texto="Conte em quatro campos quem é a sua empresa. O escritório retorna em até 1 dia útil com os próximos passos do estudo."
      >
        <BotaoDiagnostico interesse="tributario" variant="claro">
          Fazer diagnóstico <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
        </BotaoDiagnostico>
        <a
          className="btn btn-lg btn-contorno-claro"
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá, gostaria de falar sobre a Reforma Tributária na minha empresa.')}`}
          target="_blank"
          rel="noopener"
        >
          <Gavel className="h-4 w-4" aria-hidden="true" /> Falar pelo WhatsApp
        </a>
      </CtaFaixa>
    </>
  );
}
