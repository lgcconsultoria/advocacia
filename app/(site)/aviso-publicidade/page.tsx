import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso de Publicidade',
  description:
    'Enquadramento ético da comunicação institucional do escritório Douglas Senturião Advocacia, em conformidade com o Provimento CFOAB nº 205/2021 e o Estatuto da Advocacia.',
  alternates: { canonical: '/aviso-publicidade' },
};

export default function AvisoPublicidadePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Aviso de Publicidade
          </nav>
          <h1>Aviso de Publicidade.</h1>
          <p className="lead">
            O enquadramento ético da comunicação institucional deste escritório,
            em observância às normas que regem a publicidade na advocacia.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow prose">
          <h2>Caráter informativo da comunicação</h2>
          <p>
            Este site e os perfis institucionais associados ao escritório{' '}
            <strong>Douglas Senturião Advocacia</strong> têm caráter
            exclusivamente informativo, em estrita observância ao Código de Ética
            e Disciplina da OAB, ao Estatuto da Advocacia (Lei 8.906/94) e ao
            Provimento CFOAB nº 205/2021, que regula a publicidade da advocacia.
          </p>
          <p>
            O conteúdo aqui publicado não constitui oferta de serviços, captação
            de clientela ou mercantilização da advocacia. Os textos das áreas de
            atuação e do blog não substituem consulta jurídica individualizada, e
            o envio de mensagens ou de formulário não estabelece relação
            advogado-cliente nem mandato profissional. Eventuais informações
            enviadas pelos canais oficiais são tratadas em sigilo profissional, na
            forma da Lei 13.709/2018 (LGPD).
          </p>

          <h2>Compromissos que orientam esta comunicação</h2>
          <p>
            Na produção do site, do blog e dos perfis institucionais, o escritório
            adota, como diretriz permanente, os seguintes compromissos:
          </p>
          <ul>
            <li>
              Não prometer resultado, êxito ou vantagem, ainda que de forma
              implícita.
            </li>
            <li>
              Não empregar linguagem mercantilista, sensacionalista ou
              superlativos auto-referentes.
            </li>
            <li>
              Não divulgar valores de honorários como atrativo publicitário —
              honorários são tratados apenas em ambiente reservado e individual.
            </li>
            <li>Não comparar o escritório a outros profissionais ou bancas.</li>
            <li>
              Não publicar depoimentos identificados de clientes, fotos de
              clientes ou decisões que permitam reconhecer parte ou caso.
            </li>
            <li>
              Não responder consultas jurídicas individualizadas por canais
              públicos, encaminhando-as sempre ao atendimento reservado.
            </li>
            <li>
              Identificar o advogado responsável, com nome e inscrição na OAB, no
              conteúdo de comunicação.
            </li>
            <li>
              Manter tom moderado, sóbrio e técnico, com finalidade educativa.
            </li>
          </ul>

          <h2>Conteúdo do blog</h2>
          <p>
            As publicações do blog são produzidas com finalidade exclusivamente
            informativa. Não constituem consulta nem aconselhamento jurídico
            individualizado e não substituem o exame caso a caso. Referências a
            normas e a entendimentos jurisprudenciais têm caráter ilustrativo e
            devem ser conferidas em sua versão atualizada.
          </p>

          <h2>Identificação do escritório</h2>
          <p>
            Douglas Senturião Advocacia — sociedade de advogados inscrita na
            OAB/SC sob o nº 0.000. Endereço: Av. Brigadeiro Faria Lima, 1768 — São
            Paulo/SP. Contato:{' '}
            <a href="mailto:contato@senturiaoadv.com.br">
              contato@senturiaoadv.com.br
            </a>
            .
          </p>

          <div className="notice notice--inline">
            Em caso de dúvida sobre o enquadramento ético de qualquer conteúdo,
            prevalecem o Código de Ética e Disciplina da OAB, o Estatuto da
            Advocacia e o Provimento CFOAB nº 205/2021, bem como eventuais atos
            normativos que venham a sucedê-los.
          </div>
        </div>
      </section>
    </>
  );
}
