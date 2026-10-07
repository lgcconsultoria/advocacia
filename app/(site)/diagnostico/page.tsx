import type { Metadata } from 'next';
import { DiagnosticoForm } from '@/components/diagnostico-form';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';

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

export default function DiagnosticoPage() {
  const etapas = [
    ['Você envia o caso', 'Preenche o formulário com a descrição objetiva e anexa o ato, a decisão, o edital ou o contrato pertinente.'],
    ['Triagem técnica', 'Analisamos a frente aplicável, o instrumento cabível e o tempo de reação disponível.'],
    ['Retorno em até 1 dia útil', 'Você recebe a triagem inicial e os próximos passos sugeridos para o seu caso.'],
    ['Decisão informada', 'Havendo interesse mútuo, escopo, condições e honorários são tratados em ambiente reservado.'],
  ];

  return (
    <>
      <PageHero
        trilha={[{ label: 'Diagnóstico jurídico inicial' }]}
        rotulo="Triagem técnica"
        titulo="Diagnóstico jurídico inicial."
        lead="Uma triagem técnica do seu caso: identificamos a frente aplicável, o instrumento cabível e o tempo de reação. Retornamos em até 1 dia útil com os próximos passos."
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a className="btn btn-claro btn-lg" href="#formulario">
            Ir para o formulário
          </a>
        </div>
      </PageHero>

      <Secao>
        <Cabecalho n={1} rotulo="Como funciona" titulo="Quatro etapas, sem compromisso de contratação" />
        <ol className="m-0 mt-14 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map(([t, d], i) => (
            <li key={t} className="min-w-0 border-t-2 border-grafite pt-4">
              <span className="rotulo num text-[10.5px] text-marca">Etapa {i + 1}</span>
              <h3 className="expandida m-0 mt-2 text-[1.1rem] font-[700] leading-tight">{t}</h3>
              <p className="m-0 mt-2 text-[0.94rem] leading-snug text-cinza">{d}</p>
            </li>
          ))}
        </ol>

        <div className="notice mt-14 max-w-[860px]">
          <strong>O que o diagnóstico é — e o que não é.</strong> O diagnóstico
          inicial é uma triagem técnica destinada a identificar a frente, o
          instrumento e o prazo. Não é parecer jurídico, não pré-classifica
          resultado e não substitui a análise aprofundada do caso. O envio do
          formulário não constitui mandato profissional nem estabelece relação
          advogado-cliente.
        </div>
      </Secao>

      <Secao id="formulario" className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        <div className="mx-auto max-w-[820px]">
          <p className="rotulo m-0 text-marca">02 — Formulário de triagem</p>
          <h2 className="expandida m-0 mt-4 text-[clamp(1.8rem,3.8vw,2.8rem)] font-[780] leading-[1.04] tracking-[-0.03em]">
            Conte o essencial sobre o seu caso.
          </h2>
          <p className="m-0 mt-4 text-cinza">
            Campos marcados com <span className="text-[var(--perigo)]">*</span> são
            obrigatórios. Leva cerca de 5 minutos.
          </p>
          <div className="mt-10 rounded-[28px] bg-white/60 p-5 ring-1 ring-papel-2 sm:p-10">
            <DiagnosticoForm />
          </div>
        </div>
      </Secao>
    </>
  );
}
