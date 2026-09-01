import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Backdrop } from '@/components/backdrop';

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

export default function SobrePage() {
  return (
    <>
      <section className="page-hero">
        <Backdrop variant="grid" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Sobre
          </nav>
          <h1>Um escritório técnico, com raiz no Direito Administrativo.</h1>
          <p className="lead">
            Trabalhamos por caso, não por volume. Cada matéria — do embate com o
            Poder Público às disputas cíveis e empresariais — tem advogado
            responsável, plano processual escrito e canal direto com o cliente.
          </p>
        </div>
      </section>

      {/* O QUE NOS DEFINE */}
      <section className="section">
        <div className="container split split--media">
          <div>
            <p className="eyebrow">O que nos define</p>
            <h2>
              Estruturados para resolver problemas na fronteira entre o privado
              e o público.
            </h2>
            <p>
              Somos um escritório-boutique sediado em São Paulo, com raiz no
              Direito Administrativo. Fomos estruturados para resolver, com
              profundidade, problemas que nascem na fronteira entre o setor
              privado e o Poder Público — e a mesma disciplina conduz frentes
              selecionadas do direito cível e empresarial.
            </p>
            <p>
              Acreditamos que advocacia bem feita exige três coisas
              inegociáveis: <strong>leitura precisa do caso</strong>,{' '}
              <strong>tese juridicamente sólida</strong> e{' '}
              <strong>velocidade na reação</strong>. Toda a nossa rotina é
              desenhada em torno desses três pilares — seja diante da
              Administração, seja num litígio entre particulares.
            </p>
          </div>
          <figure className="framed framed--bl">
            <Image
              src="/assets/img/douglas-poltrona.jpg"
              alt="Douglas Senturião analisando um processo"
              width={1100}
              height={1650}
              sizes="(min-width: 900px) 45vw, 92vw"
            />
          </figure>
        </div>
      </section>

      {/* COMO PENSAMOS */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Como pensamos a advocacia</p>
            <h2>Quatro princípios que orientam cada caso.</h2>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3>Caso a caso</h3>
              <p className="muted">
                Não usamos modelos prontos. Cada peça é redigida do zero, com
                pesquisa específica de norma e jurisprudência.
              </p>
            </div>
            <div className="card">
              <h3>Tese antes da peça</h3>
              <p className="muted">
                Antes de peticionar, escrevemos a tese. Antes de afirmar,
                conferimos. O improviso não entra na estratégia.
              </p>
            </div>
            <div className="card">
              <h3>Tempo é parte da estratégia</h3>
              <p className="muted">
                Em direito público, mover-se na semana errada custa o caso. O
                prazo orienta a sequência de decisões.
              </p>
            </div>
            <div className="card">
              <h3>Cliente decide informado</h3>
              <p className="muted">
                Apresentamos cenários, riscos e alternativas — não opiniões
                fechadas. A decisão final é sempre do cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUEM CONFIA */}
      <section className="section">
        <div className="container container--narrow">
          <p className="eyebrow">Quem confia em nós</p>
          <h2>Do embate com a Administração ao conflito entre particulares.</h2>
          <p>
            Empresas com contratos administrativos em curso. Licitantes em
            disputa por adjudicação. Servidores em processo administrativo
            disciplinar ou em vias de tomar posse. Agentes públicos chamados a
            se manifestar perante TCU, TCE, CGU ou controladorias internas.
            Cidadãos e empresas que tiveram direito líquido e certo violado por
            ato de autoridade.
          </p>
          <p>
            E também famílias em processos de divórcio, guarda e alimentos;
            pessoas que buscam proteção diante da violência doméstica; credores e
            devedores em disputas de cobrança e execução; sócios e empresas em
            questões contratuais e societárias.
          </p>
          <p>
            O que esses perfis têm em comum é a necessidade de uma resposta
            técnica, tempestiva e conduzida com discrição.
          </p>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Quem responde pelo escritório</p>
            <h2>Advogado responsável, com atuação identificada.</h2>
          </div>
          <div className="founder">
            <div className="founder-photo">
              <Image
                src="/assets/img/douglas-perfil.jpg"
                alt="Retrato de Douglas Senturião, advogado"
                width={1100}
                height={1650}
                sizes="(min-width: 760px) 40vw, 92vw"
              />
            </div>
            <div className="founder-body">
              <span className="oab">OAB/SC nº 73.764</span>
              <h3>Douglas Senturião</h3>
              <p>
                Advogado com raiz no Direito Administrativo — mandado de
                segurança, licitações, contratos públicos, servidores, concursos,
                defesa de agentes públicos, habeas data e execuções contra a
                Fazenda Pública —, atuando também no contencioso cível e
                empresarial: família, dívidas e obrigações, direito empresarial e
                crimes licitatórios. Cada caso é conduzido com diagnóstico
                técnico, tese fundamentada e plano processual escrito.
              </p>
              <p className="muted">
                Bacharel em Direito, inscrito na Ordem dos Advogados do Brasil —
                Seccional de Santa Catarina (OAB/SC nº 73.764).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--tight cta-band">
        <div className="container">
          <div>
            <h2>Conheça as áreas ou envie seu caso para análise.</h2>
            <p>
              A triagem técnica inicial é o primeiro passo para entender o
              instrumento adequado.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-ghost btn-lg" href="/areas">
              Áreas de atuação
            </Link>
            <Link className="btn btn-primary btn-lg" href="/diagnostico">
              Solicitar diagnóstico
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
