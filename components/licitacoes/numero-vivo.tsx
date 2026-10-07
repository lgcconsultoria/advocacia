'use client';

// Número que anima do valor anterior para o novo a cada atualização (não do
// zero), em pt-BR, sobre o CountingNumber do kit de UI. Sob
// prefers-reduced-motion troca sem animar.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { CountingNumber } from '@/components/ui/counting-number';
import { formatarInteiro, formatarReais } from '@/lib/pncp/animacao';

const FORMATOS = {
  inteiro: formatarInteiro,
  reais: formatarReais,
} as const;

export type Formato = keyof typeof FORMATOS;

export function NumeroVivo({
  valor,
  formato = 'inteiro',
  className,
  duracao = 1.2,
}: {
  valor: number;
  formato?: Formato;
  className?: string;
  duracao?: number;
}) {
  const reduzir = useReducedMotion();
  const alvo = Math.round(valor);
  const [de, setDe] = useState(alvo);
  const anterior = useRef(alvo);

  // Novo alvo: parte do último alvo exibido.
  useEffect(() => {
    if (alvo !== anterior.current) {
      setDe(anterior.current);
      anterior.current = alvo;
    }
  }, [alvo]);

  const transition = useMemo(
    () => (reduzir ? { duration: 0 } : { duration: duracao, ease: [0.2, 0.7, 0.2, 1] as const, type: 'tween' as const }),
    [reduzir, duracao],
  );
  // Terminada a animação, "de" = alvo: novas renderizações não reanimam.
  const fim = useRef(alvo);
  fim.current = alvo;
  const aoTerminar = useCallback(() => setDe(fim.current), []);

  return (
    <CountingNumber
      from={de}
      target={alvo}
      transition={transition}
      format={FORMATOS[formato]}
      onComplete={aoTerminar}
      className={className}
    />
  );
}
