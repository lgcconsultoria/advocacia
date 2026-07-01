'use client';

import * as Accordion from '@radix-ui/react-accordion';

export type FaqItem = { question: string; answer: string };

/**
 * Accessible, animated FAQ built on Radix Accordion (keyboard + ARIA handled).
 * The open/close height animation is driven by CSS using Radix's height var and
 * is neutralised under prefers-reduced-motion via globals.css.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="faq-acc">
      {items.map((item, i) => (
        <Accordion.Item key={i} value={`item-${i}`} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              {item.question}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-content">
            <div className="faq-content-inner">
              {item.answer
                .split('\n\n')
                .filter(Boolean)
                .map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
