import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal';
import { buttonVariants } from '@/components/ui/button';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

export const metadata: Metadata = {
  title: 'Sobre o escritório',
  description:
    'Escritório-boutique com raiz no Direito Administrativo, em São Paulo, e atuação também no contencioso cível e empresarial. Trabalhamos por caso, não por volume: leitura precisa do caso, tese sólida e velocidade na reação.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre o escritório — Douglas Senturião Advocacia',
    description:
      'Um escritório técnico, com raiz no Direito Administrativo e atuação no contencioso cível e empresarial. Cada matéria tem advogado responsável e plano processual escrito.',
    url: '/sobre',
  },
};

const PRINCIPIOS = [
  ['Caso a caso', 'Não usamos modelos prontos. Cada peça é redigida do zero, com pesquisa específica de norma e jurisprudência.'],
  ['Tese antes da peça', 'Antes de peticionar, escrevemos a tese. Antes de afirmar, conferimos. O improviso não entra na estratégia.'],
  ['Tempo é parte da estratégia', 'Em direito público, mover-se na semana errada custa o caso. O prazo orienta a sequência de decisões.'],
  ['Cliente decide informado', 'Apresentamos cenários, riscos e alternativas — não opiniões fechadas. A decisão final é sempre do cliente.'],
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        trilha={[{ label: 'Sobre' }]}
        rotulo="O escritório"
        titulo="Um escritório técnico, com raiz no Direito Administrativo."
        lead="Trabalhamos por caso, não por volume. Cada matéria — do embate com o Poder Público às disputas cíveis e empresariais — tem advogado responsável, plano processual escrito e canal direto com o cliente."
      />

      {/* O QUE NOS DEFINE */}
      <Secao>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="min-w-0">
            <Cabecalho
              n={1}
              rotulo="O que nos define"
              titulo="Na fronteira entre o privado e o público"
              className="md:grid-cols-1 md:gap-5"
            />
            <div className="mt-8 grid max-w-[62ch] gap-5 text-[1.05rem] leading-relaxed text-cinza">
              <p className="m-0">
                Somos um escritório-boutique sediado em São Paulo, com raiz no
                Direito Administrativo. Fomos estruturados para resolver, com
                profundidade, problemas que nascem na fronteira entre o setor
                privado e o Poder Público — e a mesma disciplina conduz frentes
                selecionadas do direito cível e empresarial.
              </p>
              <p className="m-0">
                Acreditamos que advocacia bem feita exige três coisas
                inegociáveis: <strong className="text-grafite">leitura precisa do caso</strong>,{' '}
                <strong className="text-grafite">tese juridicamente sólida</strong> e{' '}
                <strong className="text-grafite">velocidade na reação</strong>. Toda a nossa rotina é
                desenhada em torno desses três pilares — seja diante da
                Administração, seja num litígio entre particulares.
              </p>
            </div>
          </div>
          <Reveal className="relative mx-auto w-full max-w-[420px]">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-[62%] w-[62%] rounded-[24px] bg-marca" />
            <Image
              src="/assets/img/douglas-poltrona.jpg"
              alt="Douglas Senturião analisando um processo"
              width={1100}
              height={1650}
              sizes="(min-width: 1024px) 420px, 90vw"
              className="relative h-auto w-full rounded-[24px] shadow-[0_40px_90px_-50px_rgb(29_27_154/0.6)]"
            />
          </Reveal>
        </div>
      </Secao>

      {/* COMO PENSAMOS */}
      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        <Cabecalho n={2} rotulo="Como pensamos" titulo="Quatro princípios que orientam cada caso" />
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {PRINCIPIOS.map(([t, d], i) => (
            <RevealItem key={t} className="h-full">
              <article className="card sm:p-9">
                <span className="rotulo num text-[10.5px] text-marca">Princípio {String(i + 1).padStart(2, '0')}</span>
                <h3 className="citacao m-0 mt-4 text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.1] text-grafite">{t}</h3>
                <p className="m-0 mt-4 leading-relaxed text-cinza">{d}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Secao>

      {/* QUEM CONFIA */}
      <Secao escura grade>
        <Cabecalho n={3} rotulo="Para quem trabalhamos" titulo="Do embate com a Administração ao conflito entre particulares" escura />
        <div className="mt-12 grid gap-10">
          <div className="grid max-w-[64ch] gap-6 text-[1.05rem] leading-relaxed text-cinza-escuro">
            <p className="m-0">
              Empresas com contratos administrativos em curso. Licitantes em
              disputa por adjudicação. Servidores em processo administrativo
              disciplinar ou em vias de tomar posse. Agentes públicos chamados a
              se manifestar perante TCU, TCE, CGU ou controladorias internas.
              Cidadãos e empresas que tiveram direito líquido e certo violado por
              ato de autoridade.
            </p>
            <p className="m-0">
              E também famílias em processos de divórcio, guarda e alimentos;
              pessoas que buscam proteção diante da violência doméstica; credores e
              devedores em disputas de cobrança e execução; sócios e empresas em
              questões contratuais e societárias.
            </p>
            <p className="citacao m-0 border-l-2 border-sinal pl-5 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.2] text-white">
              O que esses perfis têm em comum é a necessidade de uma resposta
              técnica, tempestiva e conduzida com discrição.
            </p>
          </div>
        </div>
      </Secao>

      {/* QUEM RESPONDE */}
      <Secao>
        <Cabecalho n={4} rotulo="Quem responde pelo escritório" titulo="Advogado responsável, com atuação identificada" />
        <div className="mt-14 grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[400px]">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-[70%] w-[70%] rounded-[24px] bg-marca" />
            <Image
              src="/assets/img/douglas-perfil.jpg"
              alt="Retrato de Douglas Senturião, advogado"
              width={1100}
              height={1650}
              sizes="(min-width: 768px) 400px, 90vw"
              className="relative h-auto w-full rounded-[24px] shadow-[0_40px_90px_-50px_rgb(29_27_154/0.6)]"
            />
          </Reveal>
          <div className="min-w-0">
            <span className="rotulo inline-block rounded-full border border-marca/30 bg-marca/[0.06] px-3 py-1.5 text-[10.5px] text-marca">
              OAB/SC nº 73.764
            </span>
            <h3 className="expandida m-0 mt-5 text-[clamp(1.8rem,3.6vw,2.7rem)] font-[780] leading-[1.04] tracking-[-0.03em]">
              Douglas Senturião
            </h3>
            <p className="m-0 mt-6 max-w-[60ch] text-[1.05rem] leading-relaxed text-cinza">
              Advogado com raiz no Direito Administrativo — mandado de
              segurança, licitações, contratos públicos, servidores, concursos,
              defesa de agentes públicos, habeas data e execuções contra a
              Fazenda Pública —, atuando também no contencioso cível e
              empresarial: família, dívidas e obrigações, direito empresarial e
              crimes licitatórios. Cada caso é conduzido com diagnóstico
              técnico, tese fundamentada e plano processual escrito.
            </p>
            <p className="m-0 mt-4 max-w-[60ch] text-[0.95rem] text-cinza">
              Bacharel em Direito, inscrito na Ordem dos Advogados do Brasil —
              Seccional de Santa Catarina (OAB/SC nº 73.764).
            </p>
          </div>
        </div>
      </Secao>

      <CtaFaixa
        titulo="Conheça as áreas ou envie seu caso para análise."
        texto="A triagem técnica inicial é o primeiro passo para entender o instrumento adequado."
      >
        <Link className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })} href="/areas">
          Áreas de atuação
        </Link>
        <BotaoDiagnostico variant="claro" size="lg">
          Solicitar diagnóstico
        </BotaoDiagnostico>
      </CtaFaixa>
    </>
  );
}
