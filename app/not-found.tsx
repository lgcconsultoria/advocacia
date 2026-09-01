import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getAreas, getSettings } from '@/lib/reader';

// app/not-found.tsx fica fora do grupo de rotas (site) — quem monta
// SiteHeader/SiteFooter é app/(site)/layout.tsx, que não envolve esta
// página. Sem montar o chrome aqui, a 404 ficaria sem o aviso do
// Provimento CFOAB nº 205/2021 (embutido no rodapé), que a restrição
// global exige em toda página pública. Por ser um Server Component,
// dá para buscar areas/settings normalmente, como o layout faz.
export default async function NotFound() {
  const [areas, settings] = await Promise.all([getAreas(), getSettings()]);
  const areaLinks = areas.map((a) => ({ slug: a.slug, title: a.title }));

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <section className="page-hero">
          <div className="container">
            <div className="page-hero-copy">
              <p className="eyebrow">Erro 404</p>
              <h1>Esta página não existe.</h1>
              <p className="lead">
                O endereço pode ter mudado ou o link pode estar incompleto.
                Abaixo estão os caminhos mais usados.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <ul className="checklist">
              <li>
                <Link href="/areas">Áreas de atuação</Link>
              </li>
              <li>
                <Link href="/blog">Conteúdo técnico</Link>
              </li>
              <li>
                <Link href="/diagnostico">Diagnóstico jurídico inicial</Link>
              </li>
              <li>
                <Link href="/contato">Contato</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter areas={areaLinks} settings={settings} />
    </>
  );
}
