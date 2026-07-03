import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade do escritório Douglas Senturião Advocacia: tratamento de dados pessoais em conformidade com a LGPD (Lei 13.709/2018).',
  alternates: { canonical: '/politica-de-privacidade' },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Política de Privacidade
          </nav>
          <h1>Política de Privacidade.</h1>
          <p className="lead">
            Como o escritório trata os dados pessoais coletados por meio deste
            site, em conformidade com a Lei Geral de Proteção de Dados (Lei
            13.709/2018).
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow prose">
          <p className="muted">Última atualização: 20 de maio de 2026.</p>

          <h2>1. Controlador dos dados</h2>
          <p>
            O tratamento de dados pessoais descrito nesta política é realizado
            por <strong>Douglas Senturião Advocacia</strong>, sociedade de
            advogados inscrita na OAB/SC sob o nº 0.000, com endereço na Av.
            Brigadeiro Faria Lima, 1768 — São Paulo/SP — CEP 01451-001.
          </p>

          <h2>2. Quais dados coletamos</h2>
          <p>
            Coletamos apenas os dados estritamente necessários à finalidade de
            cada interação:
          </p>
          <ul>
            <li>
              <strong>Dados de identificação e contato</strong> fornecidos
              voluntariamente no formulário de diagnóstico: nome ou razão
              social, CPF ou CNPJ (quando informado), e-mail, telefone, cidade e
              UF.
            </li>
            <li>
              <strong>Dados sobre a demanda</strong>: a frente jurídica
              indicada, a existência de prazos, a descrição do caso e os
              documentos eventualmente anexados.
            </li>
            <li>
              <strong>Dados de navegação</strong>: informações técnicas geradas
              pelo acesso ao site, como endereço IP e páginas visitadas, quando
              aplicável.
            </li>
          </ul>
          <p>
            O envio de informações é facultativo; contudo, sem os dados marcados
            como obrigatórios não é possível realizar a triagem solicitada.
          </p>

          <h2>3. Para que usamos os dados</h2>
          <ul>
            <li>
              Realizar a triagem técnica inicial do caso e retornar o contato
              solicitado.
            </li>
            <li>
              Comunicar-nos com o titular a respeito da demanda apresentada.
            </li>
            <li>
              Cumprir obrigações legais e regulatórias aplicáveis à advocacia.
            </li>
            <li>Avaliar e aprimorar o funcionamento do site.</li>
          </ul>
          <p>
            Os dados não são utilizados para finalidades incompatíveis com as
            aqui informadas, nem comercializados.
          </p>

          <h2>4. Base legal do tratamento</h2>
          <p>
            O tratamento se fundamenta, conforme o caso, no consentimento do
            titular, na necessidade de adoção de providências preliminares
            relacionadas a um eventual contrato de prestação de serviços, no
            cumprimento de obrigação legal ou regulatória e no legítimo
            interesse, sempre nos limites do art. 7º da LGPD.
          </p>

          <h2>5. Compartilhamento</h2>
          <p>
            Os dados não são compartilhados com terceiros para fins de
            marketing. Eventual compartilhamento ocorre apenas com prestadores
            de serviço que apoiam a operação do escritório (por exemplo,
            hospedagem e infraestrutura de e-mail), no limite necessário, ou
            quando exigido por autoridade competente, na forma da lei.
          </p>

          <h2>6. Sigilo profissional</h2>
          <p>
            As informações enviadas são tratadas com o sigilo profissional
            inerente à advocacia, garantia que se soma — e não se substitui — às
            obrigações decorrentes da LGPD.
          </p>

          <h2>7. Retenção e eliminação</h2>
          <p>
            Os dados são mantidos pelo período necessário ao cumprimento das
            finalidades informadas e das obrigações legais aplicáveis. Encerrada
            a finalidade, os dados são eliminados ou anonimizados, ressalvadas as
            hipóteses de guarda obrigatória previstas em lei.
          </p>

          <h2>8. Direitos do titular</h2>
          <p>
            Nos termos do art. 18 da LGPD, o titular pode solicitar, entre
            outros: a confirmação da existência de tratamento; o acesso aos
            dados; a correção de dados incompletos, inexatos ou desatualizados; a
            anonimização, o bloqueio ou a eliminação de dados desnecessários ou
            tratados em desconformidade; a portabilidade; a informação sobre
            compartilhamentos; e a revogação do consentimento.
          </p>

          <h2>9. Segurança</h2>
          <p>
            Adotamos medidas técnicas e administrativas razoáveis para proteger
            os dados pessoais contra acessos não autorizados e situações de
            destruição, perda, alteração ou difusão indevidas.
          </p>

          <h2>10. Cookies</h2>
          <p>
            O site pode utilizar cookies estritamente necessários ao seu
            funcionamento e, se aplicável, cookies de medição de audiência. O
            titular pode gerenciar as preferências de cookies nas configurações
            do seu navegador.{' '}
            <span className="muted">
              [Ajustar este item conforme as ferramentas efetivamente utilizadas
              no site.]
            </span>
          </p>

          <h2>11. Encarregado e contato</h2>
          <p>
            Para exercer os seus direitos ou esclarecer dúvidas sobre esta
            política, o titular pode entrar em contato com o encarregado pelo
            tratamento de dados pessoais pelo e-mail{' '}
            <a href="mailto:douglas@senturiaoadv.com.br">
              douglas@senturiaoadv.com.br
            </a>
            .
          </p>

          <h2>12. Alterações desta política</h2>
          <p>
            Esta política pode ser atualizada a qualquer tempo para refletir
            mudanças legais, regulatórias ou operacionais. A versão vigente é
            sempre a publicada nesta página, com a respectiva data de
            atualização.
          </p>

          <div className="notice notice--inline">
            Documento de caráter informativo. O modelo deve ser revisado por
            profissional responsável e adaptado às ferramentas, fluxos e dados
            efetivamente tratados pelo escritório antes da publicação.
          </div>
        </div>
      </section>
    </>
  );
}
