import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exclusão de dados',
  description:
    'Como pedir a exclusão dos seus dados tratados por Douglas Senturião Advocacia, inclusive os recebidos pelo Instagram.',
  alternates: { canonical: '/exclusao-de-dados' },
};

export default function ExclusaoDeDadosPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Exclusão de dados
          </nav>
          <h1>Exclusão de dados.</h1>
          <p className="lead">
            Você pode pedir, a qualquer momento, que os seus dados sejam
            apagados. Sem custo e sem precisar justificar.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow prose">
          <p className="muted">Última atualização: 5 de outubro de 2026.</p>

          <h2>Como pedir</h2>
          <ul>
            <li>
              <strong>Pelo Instagram:</strong> envie a palavra{' '}
              <strong>EXCLUIR</strong> por mensagem direta para{' '}
              <a href="https://www.instagram.com/douglassenturiao/">
                @douglassenturiao
              </a>
              .
            </li>
            <li>
              <strong>Por e-mail:</strong> escreva para{' '}
              <a href="mailto:douglas@senturiaoadv.com.br?subject=Exclus%C3%A3o%20de%20dados">
                douglas@senturiaoadv.com.br
              </a>{' '}
              com o assunto “Exclusão de dados” e o seu nome de usuário no
              Instagram ou o e-mail usado no site.
            </li>
          </ul>

          <h2>O que é apagado</h2>
          <p>
            O identificador da sua conta no Instagram, o nome de usuário, os
            comentários registrados para entrega de material, o histórico de
            entregas e de cliques nos links, e os dados enviados pelo formulário
            do site. A exclusão é concluída em até 15 dias, e você recebe a
            confirmação pelo mesmo canal do pedido.
          </p>

          <h2>O que pode ser mantido</h2>
          <p>
            Apenas o que a lei obriga a guardar, como registros ligados a uma
            relação de prestação de serviços advocatícios já contratada, pelo
            prazo legal. Os detalhes estão na{' '}
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
