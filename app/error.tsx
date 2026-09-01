'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { OAB_NOTICE, FIRM_NAME, LAWYER_NAME, OAB } from '@/lib/legal-notice';

// app/error.tsx é obrigatoriamente Client Component (exigência do Next.js
// para error boundaries) e por isso não pode `await` funções de servidor
// como getAreas()/getSettings() (lib/reader.ts usa o keystatic reader,
// que lê do sistema de arquivos — inexistente no bundle do navegador).
// Por estar fora do grupo (site), este boundary também não herda o
// SiteFooter montado em app/(site)/layout.tsx.
//
// Solução: SiteHeader já é Client Component, então é reaproveitado
// normalmente. Para o rodapé, em vez de replicar toda a grade de links
// do SiteFooter (que depende de dados assíncronos), mantém-se só o
// aviso legal obrigatório — importado de lib/legal-notice.ts, a mesma
// fonte que components/site-footer.tsx usa, para que uma correção do
// aviso alcance as duas páginas sem depender de ninguém lembrar de
// editar as duas cópias.

export default function Error({ reset }: { error: Error; reset: () => void }) {
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
              <p className="eyebrow">Erro inesperado</p>
              <h1>Algo falhou ao carregar esta página.</h1>
              <p className="lead">
                Tente novamente. Se o problema continuar e o seu caso tiver
                prazo em curso, fale direto com o escritório pelo{' '}
                <Link href="/contato">canal de contato</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <button type="button" className="btn btn-primary" onClick={reset}>
              Tentar novamente
            </button>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-bottom">
          <p className="ethic">{OAB_NOTICE}</p>
          <p>
            © <span>{new Date().getFullYear()}</span> {FIRM_NAME} ·{' '}
            {LAWYER_NAME} · {OAB}
          </p>
        </div>
      </footer>
    </>
  );
}
