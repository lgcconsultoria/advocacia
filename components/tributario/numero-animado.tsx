'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { reais } from '@/lib/tributario/simulador';

/**
 * Número que desliza até o novo valor quando a simulação muda (R$ por padrão).
 * Escreve direto no texto do nó, sem re-renderizar a árvore a cada quadro.
 * Com movimento reduzido, troca na hora.
 */
export function NumeroAnimado({
  valor,
  formatar = reais,
  className,
  duracao = 0.55,
}: {
  valor: number;
  formatar?: (v: number) => string;
  className?: string;
  duracao?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const atual = useRef(valor);
  const reduzido = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduzido) {
      atual.current = valor;
      el.textContent = formatar(valor);
      return;
    }
    const controle = animate(atual.current, valor, {
      duration: duracao,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        atual.current = v;
        el.textContent = formatar(v);
      },
    });
    return () => controle.stop();
  }, [valor, formatar, reduzido, duracao]);

  return (
    <span ref={ref} className={className}>
      {formatar(valor)}
    </span>
  );
}
