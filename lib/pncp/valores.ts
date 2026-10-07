// Soma de valores (R$) sem baixar milhares de páginas.
//
// A busca do PNCP não devolve somas, só contagens. Para somar o valor das
// ~38 mil contratações abertas seria preciso baixar ~140 MB (36 páginas de
// 2.000 itens, ~40 s). Em vez disso:
//
// 1. TOPO EXATO: baixa os K maiores valores (ordenacao=-valor) e soma um a
//    um. No PNCP o valor é muito concentrado: os 200 maiores respondem por
//    mais da metade do total — e são justamente onde ficam os erros de
//    digitação (R$ 121 bi num credenciamento municipal).
// 2. FAIXAS: abaixo do K-ésimo valor (T), conta exatamente quantos registros
//    caem em cada faixa geométrica [a, b) de R$ 1 até T (4 faixas por década,
//    filtros valor_min/valor_max, que são inclusivos). Cada faixa contribui
//    com contagem × média log-uniforme (b−a)/ln(b/a). Os limites garantidos
//    são contagem × a e contagem × b.
//
// Validação em 07/10/2026 contra a soma completa (38.269 abertas, R$ 421,8 bi
// brutos): K=200 e 4 faixas/década erram +0,32% no total (+1,6% na parte
// abaixo do topo), com ~36 requisições pequenas em vez de 36 grandes.

import { buscar, contar } from './cliente';
import type { Contador, FiltroBusca, OpcoesRequisicao } from './cliente';
import type { Metodo, ValorEstimado } from './tipos';

export const LIMITE_ATIPICO = 10_000_000_000; // R$ 10 bi
const K_TOPO = 200;
/** Até este total, baixa tudo e soma exato (≤ 2 páginas de 500). */
const LIMITE_SOMA_EXATA = 1_000;
const FAIXAS_POR_DECADA = 4;

export type CampoValor = 'valor_total_estimado' | 'valor_global';

function filtroFaixa(filtro: FiltroBusca, campo: CampoValor, min: number, max: number): FiltroBusca {
  const arred = (x: number) => Math.round(x * 100) / 100;
  return campo === 'valor_total_estimado'
    ? { ...filtro, valor_total_estimado_min: arred(min), valor_total_estimado_max: arred(max) }
    : { ...filtro, valor_global_min: arred(min), valor_global_max: arred(max) };
}

/** Bordas geométricas de R$ 1 até `teto` (exclusivo). */
export function bordasDasFaixas(teto: number, porDecada = FAIXAS_POR_DECADA): number[] {
  const razao = 10 ** (1 / porDecada);
  const bordas = [1];
  // Folga relativa evita uma faixa degenerada quando teto é potência exata (1e8 ≈ razão^32).
  while (bordas[bordas.length - 1] * razao < teto * (1 - 1e-9)) bordas.push(bordas[bordas.length - 1] * razao);
  bordas.push(teto);
  return bordas;
}

export interface ResultadoSoma {
  total: number;
  valor: Omit<ValorEstimado, 'procedencia'>;
  metodo: Metodo;
}

/**
 * Soma o campo de valor de todos os registros do filtro.
 * Exata se houver ≤ 1.000 registros; senão topo exato + faixas.
 */
export async function somarValores(
  filtro: FiltroBusca,
  campo: CampoValor,
  opcoes: OpcoesRequisicao,
  contador: Contador,
  totalConhecido?: number,
  faixasPorDecada: number = FAIXAS_POR_DECADA,
): Promise<ResultadoSoma> {
  const total = totalConhecido ?? (await contar(filtro, opcoes, contador));
  const ordenacao = campo === 'valor_total_estimado' ? '-valor_total_estimado' : '-valor_global';
  const lerValor = (i: { valor_total_estimado: number | null; valor_global: number | null }) =>
    (campo === 'valor_total_estimado' ? i.valor_total_estimado : i.valor_global) ?? 0;

  const atipicos = { limite: LIMITE_ATIPICO, quantidade: 0, valor: 0 };
  const contarAtipico = (v: number) => {
    if (v >= LIMITE_ATIPICO) {
      atipicos.quantidade++;
      atipicos.valor += v;
    }
  };

  // Caso pequeno: baixa tudo.
  if (total <= LIMITE_SOMA_EXATA) {
    let soma = 0;
    let semValor = 0;
    for (let pagina = 1; (pagina - 1) * 500 < total; pagina++) {
      const r = await buscar(filtro, { ordenacao, pagina, tam_pagina: 500 }, opcoes, contador);
      for (const item of r.items) {
        const v = lerValor(item);
        if (v > 0) {
          soma += v;
          contarAtipico(v);
        } else semValor++;
      }
    }
    return {
      total,
      metodo: 'soma-exata',
      valor: {
        valor: soma,
        intervalo: [soma, soma],
        valorSemAtipicos: soma - atipicos.valor,
        intervaloSemAtipicos: [soma - atipicos.valor, soma - atipicos.valor],
        atipicos,
        semValorInformado: semValor,
      },
    };
  }

  // 1. Topo exato.
  const topo = await buscar(filtro, { ordenacao, pagina: 1, tam_pagina: K_TOPO }, opcoes, contador);
  const valoresTopo = topo.items.map(lerValor);
  const teto = valoresTopo[valoresTopo.length - 1] ?? 0;
  let somaTopo = 0;
  let nTopo = 0;
  for (const v of valoresTopo) {
    if (v > teto) {
      somaTopo += v;
      nTopo++;
      contarAtipico(v);
    }
  }

  // Empates no teto: contados à parte, exatos.
  const nNoTeto = teto >= 1 ? await contar(filtroFaixa(filtro, campo, teto, teto), opcoes, contador) : 0;
  if (teto >= LIMITE_ATIPICO) {
    atipicos.quantidade += nNoTeto;
    atipicos.valor += nNoTeto * teto;
  }

  // 2. Faixas abaixo do teto.
  let estimativa = 0;
  let minimo = 0;
  let maximo = 0;
  let nFaixas = 0;
  if (teto > 1) {
    const bordas = bordasDasFaixas(teto, faixasPorDecada);
    const pares = bordas.slice(0, -1).map((a, i) => [a, bordas[i + 1]] as const);
    const contagens = await Promise.all(
      pares.map(([a, b]) => contar(filtroFaixa(filtro, campo, a, b - 0.01), opcoes, contador)),
    );
    pares.forEach(([a, b], i) => {
      const c = contagens[i];
      nFaixas += c;
      estimativa += c * ((b - a) / Math.log(b / a));
      minimo += c * a;
      maximo += c * b;
    });
  }

  const exato = somaTopo + nNoTeto * teto;
  const valor = exato + estimativa;
  return {
    total,
    metodo: 'topo-exato+faixas',
    valor: {
      valor,
      intervalo: [exato + minimo, exato + maximo],
      valorSemAtipicos: valor - atipicos.valor,
      intervaloSemAtipicos: [exato + minimo - atipicos.valor, exato + maximo - atipicos.valor],
      atipicos,
      semValorInformado: Math.max(0, total - nTopo - nNoTeto - nFaixas),
    },
  };
}
