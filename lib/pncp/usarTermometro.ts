'use client';

// Hook React para componentes cliente: busca /api/pncp/termometro a cada
// `intervaloMs` (padrão 60 s; pausa com a aba oculta), guarda a leitura
// anterior para medir a taxa do valor em aberto e recalcula a projeção a
// cada segundo. Não inventa número: ver lib/pncp/animacao.ts.

import { useEffect, useRef, useState } from 'react';
import { projetarContador, projetarPorTaxa, rotuloAtualizado } from './animacao';
import type { Leitura, Projecao } from './animacao';
import type { Termometro } from './tipos';

export interface EstadoTermometro {
  dados: Termometro | null;
  erro: string | null;
  /** Valor em aberto (R$, sem atípicos), projetado pela taxa entre leituras. */
  valorAbertas: Projecao | null;
  /** Publicadas hoje, projetado pelo ritmo da última hora. */
  publicadasHoje: Projecao | null;
  /** "atualizado há X min", pela hora real da consulta ao PNCP. */
  rotulo: string;
}

export function usarTermometro(
  { intervaloMs = 60_000, url = '/api/pncp/termometro', inicial = null as Termometro | null } = {},
): EstadoTermometro {
  const [dados, setDados] = useState<Termometro | null>(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [agora, setAgora] = useState(() => new Date());
  const anterior = useRef<Leitura | null>(null);
  const atual = useRef<Leitura | null>(null);

  useEffect(() => {
    let vivo = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const carregar = async () => {
      if (typeof document !== 'undefined' && document.hidden) {
        timer = setTimeout(carregar, intervaloMs);
        return;
      }
      try {
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const t = (await r.json()) as Termometro;
        if (!vivo) return;
        const v = t.abertas.valor;
        if (v) {
          const nova: Leitura = { valor: v.valorSemAtipicos, em: v.procedencia.consultadoEm };
          if (!atual.current || atual.current.em !== nova.em) {
            anterior.current = atual.current;
            atual.current = nova;
          }
        }
        setDados(t);
        setErro(null);
      } catch (e) {
        if (vivo) setErro((e as Error).message);
      } finally {
        if (vivo) timer = setTimeout(carregar, intervaloMs);
      }
    };
    carregar();
    const relogio = setInterval(() => setAgora(new Date()), 1_000);
    return () => {
      vivo = false;
      if (timer) clearTimeout(timer);
      clearInterval(relogio);
    };
  }, [intervaloMs, url]);

  return {
    dados,
    erro,
    valorAbertas: atual.current ? projetarPorTaxa(anterior.current, atual.current, agora) : null,
    publicadasHoje: dados
      ? projetarContador(
          dados.publicadasHoje.quantidade,
          dados.publicadasHoje.procedencia.consultadoEm,
          dados.publicadasHoje.ritmoPorMinuto,
          agora,
        )
      : null,
    rotulo: dados ? rotuloAtualizado(dados.publicadasHoje.procedencia.consultadoEm, agora) : '',
  };
}
