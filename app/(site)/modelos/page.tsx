import type { Metadata } from 'next';
import Link from 'next/link';
import { getModelos } from '@/lib/modelos';
import { getSettings } from '@/lib/reader';
import { HeroAside } from '@/components/hero-aside';
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
  const settings = await getSettings();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-copy">
            <nav className="breadcrumb" aria-label="Trilha de navegação">
              <Link href="/">Início</Link>
              <span aria-hidden="true">›</span>
              Materiais gratuitos
            </nav>
            <p className="eyebrow">Materiais gratuitos</p>
            <h1>Modelos editáveis para quem precisa agir antes do prazo acabar.</h1>
            <p className="lead">
              Peças e roteiros que usamos como ponto de partida no escritório, com as
              notas de orientação que normalmente ficam de fora dos modelos que circulam
              por aí. Em .docx, para você editar no Word.
            </p>
          </div>
          <HeroAside whatsapp={settings.whatsapp} contexto="materiais gratuitos" />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid-2">
            {modelos.map((m) => (
              <Reveal key={m.slug}>
                <Link href={`/modelos/${m.slug}`} className="card area-card">
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
