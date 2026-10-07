'use client';

// Uma única fonte de dados ao vivo para a página de Licitações: o termômetro
// (busca a cada 60 s pelo hook usarTermometro) e o retrato por UF (busca ao
// montar e a cada 15 min). Os dados iniciais vêm do servidor (ISR), então a
// página fica completa mesmo antes do primeiro fetch, ou sem JavaScript.

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { projetarContador } from '@/lib/pncp/animacao';
import { usarTermometro, type EstadoTermometro } from '@/lib/pncp/usarTermometro';
import type { PorUf, Termometro } from '@/lib/pncp/tipos';

interface Contexto extends Omit<EstadoTermometro, 'dados'> {
  dados: Termometro;
  uf: PorUf;
  /** true depois da hidratação: só então números projetados e "há X min" aparecem. */
  montado: boolean;
  /** Leituras do termômetro recebidas neste navegador (0 = só o dado do servidor). */
  leituras: number;
}

const Ctx = createContext<Contexto | null>(null);

export function ProvedorPncp({
  termometro,
  uf: ufInicial,
  children,
}: {
  termometro: Termometro;
  uf: PorUf;
  children: ReactNode;
}) {
  const estado = usarTermometro({ inicial: termometro });
  const [uf, setUf] = useState(ufInicial);
  const [montado, setMontado] = useState(false);
  const [leituras, setLeituras] = useState(0);

  useEffect(() => setMontado(true), []);

  // conta as leituras novas (muda a referência de `dados` a cada fetch)
  const dados = estado.dados ?? termometro;
  useEffect(() => {
    if (dados !== termometro) setLeituras((n) => n + 1);
  }, [dados, termometro]);

  useEffect(() => {
    let vivo = true;
    const carregar = async () => {
      try {
        const r = await fetch('/api/pncp/uf');
        if (!r.ok) return;
        const novo = (await r.json()) as PorUf;
        if (vivo && Array.isArray(novo.ufs) && novo.ufs.length) setUf(novo);
      } catch {
        /* fica o retrato do servidor */
      }
    };
    carregar();
    const t = setInterval(carregar, 15 * 60_000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, []);

  // Base da projeção de "publicadas hoje": só muda quando a contagem real muda.
  // Uma releitura com o mesmo número (contagem ainda em cache) não reinicia a
  // projeção — senão o contador voltaria para trás a cada minuto.
  const ph = dados.publicadasHoje;
  const base = useRef({ quantidade: ph.quantidade, em: ph.procedencia.consultadoEm });
  if (ph.quantidade !== base.current.quantidade || ph.procedencia.consultadoEm.slice(0, 10) !== base.current.em.slice(0, 10)) {
    base.current = { quantidade: ph.quantidade, em: ph.procedencia.consultadoEm };
  }
  const publicadasHoje = estado.publicadasHoje
    ? projetarContador(base.current.quantidade, base.current.em, ph.ritmoPorMinuto)
    : null;

  return (
    <Ctx.Provider value={{ ...estado, publicadasHoje, dados, uf, montado, leituras }}>{children}</Ctx.Provider>
  );
}

export function usePncp(): Contexto {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePncp fora do ProvedorPncp');
  return c;
}
