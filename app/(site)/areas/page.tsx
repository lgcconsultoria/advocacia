import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreas } from '@/lib/reader';
import { RevealGroup, RevealItem } from '@/components/reveal';
import { PageHero } from '@/components/site/page-hero';
import { Cabecalho, Secao } from '@/components/site/secao';
import { CtaFaixa } from '@/components/site/cta-faixa';
import { AreaCard } from '@/components/site/area-card';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Áreas de atuação — Direito Administrativo e Contencioso',
  description:
    'Áreas de atuação: mandado de segurança, licitações, contratos públicos, concursos, servidores, defesa de agentes, habeas data, execuções — e contencioso cível e empresarial: família, violência doméstica, dívidas e obrigações, empresarial e crimes licitatórios.',
  alternates: { canonical: '/areas' },
  openGraph: {
    title: 'Áreas de atuação — Direito Administrativo e Contencioso',
    description:
      'Frentes de direito público e de contencioso cível e empresarial, cada uma com regime jurídico próprio e prazos específicos.',
    url: '/areas',
  },
};

export default async function AreasPage() {
  const areas = await getAreas();
  const areasPublico = areas.filter((a) => a.group !== 'civel');
  const areasCivel = areas.filter((a) => a.group === 'civel');

  return (
    <>
      <PageHero
        trilha={[{ label: 'Áreas de atuação' }]}
        rotulo={`${areas.length} áreas · 2 grupos`}
        titulo="Áreas de atuação."
        lead="O núcleo do escritório é o Direito Administrativo — e a mesma disciplina técnica se estende a frentes selecionadas do contencioso cível e empresarial. Cada área tem instrumento próprio, prazo específico e exige diagnóstico antes da peça."
      />

      <Secao>
        <Cabecalho n={1} rotulo="Direito Público" titulo="O conflito é com a Administração" />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areasPublico.map((area, i) => (
            <RevealItem key={area.slug} className="h-full">
              <AreaCard area={area} n={i + 1} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Secao>

      {areasCivel.length > 0 && (
        <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
          <Cabecalho n={2} rotulo="Contencioso Cível e Empresarial" titulo="O conflito é entre particulares" />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areasCivel.map((area, i) => (
              <RevealItem key={area.slug} className="h-full">
                <AreaCard area={area} n={i + 1} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Secao>
      )}

      <CtaFaixa
        titulo="Não sabe qual instrumento se aplica ao seu caso?"
        texto="O diagnóstico inicial existe justamente para isso: identificar a frente e o tempo de reação."
      >
        <Link className={buttonVariants({ variant: 'claro', size: 'lg' })} href="/diagnostico">
          Solicitar diagnóstico
        </Link>
      </CtaFaixa>
    </>
  );
}
