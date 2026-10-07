import type { Metadata } from 'next';
import Link from 'next/link';
import { getModelos } from '@/lib/modelos';
import { RevealGroup, RevealItem } from '@/components/reveal';
import { PageHero } from '@/components/site/page-hero';
import { Secao } from '@/components/site/secao';

export const metadata: Metadata = {
  title: 'Modelos e materiais gratuitos',
  description:
    'Modelos editáveis de recurso administrativo, mandado de segurança, pedido de ' +
    'reequilíbrio e roteiros de diagnóstico. Gratuitos, em .docx.',
  alternates: { canonical: '/modelos' },
};

export default async function ModelosIndex() {
  const modelos = await getModelos();
  return (
    <>
      <PageHero
        trilha={[{ label: 'Materiais' }]}
        rotulo="Materiais gratuitos"
        titulo="Modelos editáveis para quem precisa agir antes do prazo acabar."
        lead="Peças e roteiros que usamos como ponto de partida no escritório, com as notas de orientação que normalmente ficam de fora dos modelos que circulam por aí. Em .docx, para você editar no Word."
      />

      <Secao className="bg-[linear-gradient(180deg,#e9e9f2,var(--papel))]">
        {modelos.length > 0 ? (
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {modelos.map((m, i) => (
              <RevealItem key={m.slug} className="h-full">
                <Link href={`/modelos/${m.slug}`} className="card card-link group flex flex-col no-underline sm:p-9">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="rotulo text-[10.5px] text-marca">{m.documento}</span>
                    <span className="rotulo num text-[10px] text-cinza">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <h2 className="semi m-0 mt-4 text-[1.35rem] font-[720] leading-[1.18] tracking-[-0.015em] text-grafite group-hover:text-marca">
                    {m.chamada}
                  </h2>
                  <p className="m-0 mt-3 leading-relaxed text-cinza">{m.linha}</p>
                  <span className="link-seta mt-auto self-start pt-7">
                    Baixar gratuitamente <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="m-0 text-[1.1rem] text-cinza">Os materiais estão sendo atualizados. Volte em instantes.</p>
        )}
      </Secao>
    </>
  );
}
