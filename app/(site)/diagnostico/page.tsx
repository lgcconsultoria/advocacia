import type { Metadata } from 'next';
import Link from 'next/link';
import { DiagnosticoForm } from '@/components/diagnostico-form';
import { getSettings } from '@/lib/reader';
import { HeroAside } from '@/components/hero-aside';

export const metadata: Metadata = {
  title: 'Diagnóstico jurídico inicial',
  description:
    'Solicite uma triagem técnica inicial do seu caso de direito administrativo. Retorno em até 1 dia útil. O envio do formulário não constitui mandato nem gera honorários.',
  alternates: { canonical: '/diagnostico' },
  openGraph: {
    title: 'Diagnóstico jurídico inicial — Douglas Senturião Advocacia',
    description:
      'Triagem técnica inicial do seu caso de direito administrativo, com retorno em até 1 dia útil.',
    url: '/diagnostico',
  },
};

export default async function DiagnosticoPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-copy">
            <nav className="breadcrumb" aria-label="Trilha de navegação">
              <Link href="/">Início</Link>
              <span aria-hidden="true">›</span>
              Diagnóstico jurídico inicial
            </nav>
            <h1>Diagnóstico jurídico inicial.</h1>
            <p className="lead">
              Uma triagem técnica do seu caso: identificamos a frente aplicável, o
              instrumento cabível e o tempo de reação. Retornamos em até 1 dia útil
              com os próximos passos.
            </p>
          </div>
          <HeroAside
            whatsapp={settings.whatsapp}
            contexto="diagnóstico jurídico inicial"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Como funciona</p>
            <h2>Quatro etapas, sem compromisso de contratação.</h2>
          </div>
          <ol className="steps">
            <li>
              <h3>Você envia o caso</h3>
              <p>
                Preenche o formulário com a descrição objetiva e anexa o ato, a
                decisão, o edital ou o contrato pertinente.
              </p>
            </li>
            <li>
              <h3>Triagem técnica</h3>
              <p>
                Analisamos a frente aplicável, o instrumento cabível e o tempo de
                reação disponível.
              </p>
            </li>
            <li>
              <h3>Retorno em até 1 dia útil</h3>
              <p>
                Você recebe a triagem inicial e os próximos passos sugeridos para
                o seu caso.
              </p>
            </li>
            <li>
              <h3>Decisão informada</h3>
              <p>
                Havendo interesse mútuo, escopo, condições e honorários são
                tratados em ambiente reservado.
              </p>
            </li>
          </ol>

          <div className="notice notice--inline">
            <strong>O que o diagnóstico é — e o que não é.</strong> O diagnóstico
            inicial é uma triagem técnica destinada a identificar a frente, o
            instrumento e o prazo. Não é parecer jurídico, não pré-classifica
            resultado e não substitui a análise aprofundada do caso. O envio do
            formulário não constitui mandato profissional nem estabelece relação
            advogado-cliente.
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <div className="section-head">
            <p className="eyebrow">Formulário de triagem</p>
            <h2>Conte o essencial sobre o seu caso.</h2>
            <p className="muted">
              Campos marcados com{' '}
              <span style={{ color: 'var(--danger)' }}>*</span> são obrigatórios.
              Leva cerca de 5 minutos.
            </p>
          </div>
          <DiagnosticoForm />
        </div>
      </section>
    </>
  );
}
