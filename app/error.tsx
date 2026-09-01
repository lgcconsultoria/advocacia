'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

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
// aviso legal obrigatório — com o texto idêntico ao de
// components/site-footer.tsx — usando o nome do escritório e o número
// da OAB exatamente como definidos em lib/reader.ts (mesmos valores
// que getSettings() usa como fallback), portanto nenhum dado é
// inventado aqui.
const FIRM_NAME = 'Douglas Senturião Advocacia';
const LAWYER_NAME = 'Douglas Senturião';
const OAB = 'OAB/SC nº 73.764';

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
          <p className="ethic">
            Conteúdo institucional de caráter informativo, em conformidade
            com o Código de Ética e Disciplina da OAB, o Estatuto da
            Advocacia (Lei 8.906/94) e o Provimento CFOAB nº 205/2021. Não
            constitui oferta de serviços nem aconselhamento jurídico
            individualizado.
          </p>
          <p>
            © <span>{new Date().getFullYear()}</span> {FIRM_NAME} ·{' '}
            {LAWYER_NAME} · {OAB}
          </p>
        </div>
      </footer>
    </>
  );
}
