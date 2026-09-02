import type { Metadata } from 'next';
import Link from 'next/link';
import { getModelos } from '@/lib/modelos';
import { Reveal } from '@/components/reveal';

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
      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <p className="eyebrow">Materiais gratuitos</p>
            <h1>Modelos editáveis para quem precisa agir antes do prazo acabar.</h1>
            <p className="lead">
              Peças e roteiros que usamos como ponto de partida no escritório, com as
              notas de orientação que normalmente ficam de fora dos modelos que circulam
              por aí. Em .docx, para você editar no Word.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid-2">
            {modelos.map((m) => (
              <Reveal key={m.slug}>
                <Link href={`/modelos/${m.slug}`} className="area-card">
                  <p className="eyebrow">{m.documento}</p>
                  <h3>{m.chamada}</h3>
                  <p>{m.linha}</p>
                  <span className="btn btn-ghost">Baixar gratuitamente</span>
                </Link>
              </Reveal>
            ))}
          </div>
          {modelos.length === 0 && (
            <p className="lead">Os materiais estão sendo atualizados. Volte em instantes.</p>
          )}
        </div>
      </section>
    </>
  );
}
