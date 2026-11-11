'use client';

import { useId, useRef, useState } from 'react';

export type FaqItem = { question: string; answer: string };

/**
 * FAQ acessível (um item aberto por vez, pode fechar todos; setas, Home e End
 * movem o foco entre as perguntas, como no Radix Accordion).
 *
 * As respostas ficam SEMPRE no HTML, também fechadas (SSR): o Radix só monta o
 * conteúdo do item aberto, e por isso rastreadores de IA que leem o HTML bruto
 * viam as respostas vazias. Aqui o painel fechado é recolhido por CSS
 * (grid-template-rows 0fr, ver `.faq-content` em globals.css) e marcado `inert`,
 * o que o tira da tabulação e da leitura por tecnologia assistiva sem tirá-lo
 * do documento. Mesmo visual e mesma animação de abrir/fechar de antes.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const base = useId();
  const [aberto, setAberto] = useState<number | null>(null);
  const raiz = useRef<HTMLDivElement>(null);

  function aoTeclar(e: React.KeyboardEvent<HTMLDivElement>) {
    const teclas = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!teclas.includes(e.key)) return;
    const botoes = Array.from(raiz.current?.querySelectorAll<HTMLButtonElement>('.faq-trigger') ?? []);
    const atual = botoes.findIndex((b) => b === document.activeElement);
    if (atual < 0) return;
    e.preventDefault();
    const n = botoes.length;
    const destino =
      e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : e.key === 'ArrowDown' ? (atual + 1) % n : (atual - 1 + n) % n;
    botoes[destino]?.focus();
  }

  return (
    <div ref={raiz} className="faq-acc" onKeyDown={aoTeclar}>
      {items.map((item, i) => {
        const estado = aberto === i ? 'open' : 'closed';
        const idBotao = `${base}-t-${i}`;
        const idPainel = `${base}-c-${i}`;
        return (
          <div key={i} data-state={estado} className="faq-item">
            <h3 className="faq-header">
              <button
                type="button"
                id={idBotao}
                aria-expanded={aberto === i}
                aria-controls={idPainel}
                data-state={estado}
                className="faq-trigger"
                onClick={() => setAberto(aberto === i ? null : i)}
              >
                {item.question}
              </button>
            </h3>
            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              data-state={estado}
              className="faq-content"
              inert={estado === 'closed'}
            >
              <div className="faq-content-clip">
                <div className="faq-content-inner">
                  {item.answer
                    .split('\n\n')
                    .filter(Boolean)
                    .map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
