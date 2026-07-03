import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato — Douglas Senturião Advocacia | Direito Administrativo em São Paulo',
  description:
    'Fale com o escritório Douglas Senturião Advocacia. Atendimento por agendamento em São Paulo/SP. Endereço, e-mail, telefone e horário de funcionamento.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato — Douglas Senturião Advocacia',
    description:
      'Atendimento por agendamento em São Paulo/SP. Para enviar um caso, use o diagnóstico jurídico inicial.',
    url: '/contato',
  },
};

export default function ContatoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            Contato
          </nav>
          <h1>Fale com o escritório.</h1>
          <p className="lead">
            Atendimento por agendamento. Para que possamos entender o seu caso, o
            caminho mais rápido é o formulário de diagnóstico — retornamos em até 1
            dia útil com a triagem inicial e os próximos passos.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Dados do escritório</p>
            <h2>Onde estamos e como falar conosco.</h2>
            <div className="deflist" style={{ marginTop: '1.6rem' }}>
              <div className="item">
                <h3>Endereço</h3>
                <p>Av. Brigadeiro Faria Lima, 1768 — São Paulo/SP — CEP 01451-001.</p>
              </div>
              <div className="item">
                <h3>E-mail</h3>
                <p>
                  <a href="mailto:contato@senturiaoadv.com.br">
                    contato@senturiaoadv.com.br
                  </a>
                </p>
              </div>
              <div className="item">
                <h3>Telefone / WhatsApp comercial</h3>
                <p>
                  <a href="https://wa.me/5567991675629" target="_blank" rel="noopener">
                    (67) 99167-5629
                  </a>{' '}
                  — atendimento exclusivamente para agendamento.
                </p>
              </div>
              <div className="item">
                <h3>Instagram</h3>
                <p>
                  <a
                    href="https://instagram.com/douglassadvogado"
                    target="_blank"
                    rel="noopener"
                  >
                    @douglassadvogado
                  </a>
                </p>
              </div>
              <div className="item">
                <h3>Horário</h3>
                <p>Segunda a sexta, das 9h às 18h.</p>
              </div>
            </div>
          </div>

          <aside className="aside-card">
            <p className="eyebrow">Tem um caso para enviar?</p>
            <h3>Use o diagnóstico jurídico inicial</h3>
            <p className="muted">
              O formulário de diagnóstico organiza as informações essenciais —
              frente, prazo e documentos — e garante uma triagem técnica mais
              precisa do que uma mensagem livre.
            </p>
            <Link
              className="btn btn-primary btn-block"
              href="/diagnostico"
              style={{ marginTop: '.4rem' }}
            >
              Solicitar diagnóstico inicial
            </Link>
            <p className="hint" style={{ marginTop: '.9rem' }}>
              Para questões institucionais que não envolvam um caso concreto,
              escreva para o e-mail acima.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section--tight section--alt">
        <div className="container">
          <p className="eyebrow">Localização</p>
          <h2 className="mb-0" style={{ marginBottom: '1.2rem' }}>
            São Paulo/SP
          </h2>
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--paper-pure)',
            }}
          >
            <iframe
              title="Mapa — Av. Brigadeiro Faria Lima, 1768, São Paulo/SP"
              src="https://www.google.com/maps?q=Av.%20Brigadeiro%20Faria%20Lima%2C%201768%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001451-001&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="notice">
            <strong>Aviso.</strong> O contato por estes canais não constitui
            mandato profissional, não estabelece relação advogado-cliente e não
            gera honorários. As informações enviadas serão tratadas com sigilo
            profissional e em conformidade com a LGPD (Lei 13.709/2018).
            Honorários, escopo e condições são tratados exclusivamente em ambiente
            reservado e individual.
          </div>
        </div>
      </section>
    </>
  );
}
