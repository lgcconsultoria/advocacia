'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent } from '@/lib/consent';

/**
 * Consentimento granular, sem dark pattern: "Recusar todos" e "Aceitar todos"
 * usam o mesmo componente de botão, o mesmo tamanho e o mesmo contraste.
 * Reabrível pelo rodapé.
 */
export function ConsentBanner() {
  const [aberto, setAberto] = useState(false);
  // Desmarcadas por padrão: a orientação da ANPD desfavorece caixa
  // pré-marcada como forma de consentimento. "Salvar escolha" com as duas
  // desmarcadas equivale a "Recusar todos" — nada muda de fato, exceto que
  // agora é preciso um clique explícito em cada categoria para habilitá-la.
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setAberto(true);
    const reabrir = () => setAberto(true);
    window.addEventListener('dsa-consent-reopen', reabrir);
    return () => window.removeEventListener('dsa-consent-reopen', reabrir);
  }, []);

  function decidir(escolha: { analytics: boolean; marketing: boolean }) {
    writeConsent(escolha);
    setAberto(false);
  }

  if (!aberto) return null;

  return (
    <div
      className="consent-banner"
      role="dialog"
      aria-modal="false"
      aria-label="Preferências de privacidade"
    >
      <div className="consent-banner-inner">
        <div className="consent-banner-copy">
          <h2>Preferências de privacidade</h2>
          <p>
            Usamos cookies necessários para o funcionamento do site. Cookies de
            análise e de marketing só são ativados com a sua autorização. Você
            pode mudar essa escolha a qualquer momento no rodapé. Detalhes na{' '}
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
          </p>
          <ul className="consent-options">
            <li>
              <label className="choice">
                <input type="checkbox" checked disabled readOnly />
                <span>
                  <strong>Necessários</strong> — sempre ativos. Sustentam a
                  navegação e a segurança do site.
                </span>
              </label>
            </li>
            <li>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span>
                  <strong>Análise</strong> — mostram quais páginas ajudam quem
                  procura o escritório.
                </span>
              </label>
            </li>
            <li>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span>
                  <strong>Marketing</strong> — medem o resultado de anúncios.
                </span>
              </label>
            </li>
          </ul>
        </div>
        <div className="consent-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => decidir({ analytics: false, marketing: false })}
          >
            Recusar todos
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => decidir({ analytics, marketing })}
          >
            Salvar escolha
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => decidir({ analytics: true, marketing: true })}
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
