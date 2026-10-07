import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { GradePlanta } from '@/components/site/secao';
import { Reveal } from '@/components/reveal';
import { Anel, type FrenteAnel } from './anel';

/** Abertura da home: o anel das áreas em volta do símbolo DS, em planta escura. */
export function HeroHome({ frentes }: { frentes: FrenteAnel[] }) {
  return (
    <section className="planta relative isolate overflow-hidden">
      <GradePlanta />
      <div className="container relative pb-16 pt-10 md:pb-24 lg:pt-14">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <Reveal className="min-w-0">
            <p className="rotulo m-0 text-sinal">Direito Administrativo · Atuação em todo o Brasil</p>
            <h1 className="expandida m-0 mt-5 text-[clamp(3.1rem,9.6vw,7.2rem)] font-[820] leading-[0.88] tracking-[-0.045em] text-white">
              Direito
              <span className="block text-sinal">Público.</span>
              <span className="sr-only"> Advocacia em Direito Administrativo — Douglas Senturião Advocacia</span>
            </h1>
            <p className="citacao m-0 mt-7 max-w-[30ch] text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.15] text-white/95">
              Estratégia jurídica para quem tem um conflito com o Poder Público e um prazo correndo.
            </p>
            <p className="m-0 mt-5 max-w-[52ch] text-[1.02rem] leading-relaxed text-cinza-escuro">
              Escritório-boutique de Direito Administrativo, com sede em São Paulo e
              atuação em todo o Brasil, que leva a mesma disciplina técnica a frentes
              selecionadas do contencioso cível e empresarial. Diagnóstico, tese e
              plano processual desde o primeiro contato.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/diagnostico" className={buttonVariants({ variant: 'claro', size: 'lg' })}>
                Solicitar diagnóstico inicial
              </Link>
              <Link href="/licitacoes" className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}>
                Departamento de Licitações
              </Link>
            </div>
          </Reveal>

          <div className="min-w-0">
            <Anel frentes={frentes} />
            <p className="rotulo -mt-2 text-center text-[10px] text-cinza-escuro">
              Arraste para girar · toque numa área para abrir
            </p>
          </div>
        </div>

        <dl className="m-0 mt-12 grid gap-6 border-t border-sinal/15 pt-8 sm:grid-cols-3">
          {[
            ['Boutique técnica', 'Trabalho por caso, não por volume.'],
            ['Resposta em até 1 dia útil', 'Triagem técnica para quem tem prazo em curso.'],
            ['Tese antes da peça', 'Diagnóstico e plano processual por escrito.'],
          ].map(([t, d], i) => (
            <div key={t} className="min-w-0">
              <dt className="flex items-baseline gap-3">
                <span className="rotulo num text-[10px] text-sinal">{String(i + 1).padStart(2, '0')}</span>
                <span className="expandida text-[15px] font-[700] text-white">{t}</span>
              </dt>
              <dd className="m-0 mt-1.5 pl-[1.9rem] text-[0.92rem] text-cinza-escuro">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
