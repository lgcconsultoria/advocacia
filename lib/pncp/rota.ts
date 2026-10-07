// Montagem das respostas das rotas /api/pncp/*: cache na CDN da Vercel,
// último resultado bom em memória e, por fim, o snapshot versionado.
//
// Onde o dado fica guardado (não há banco):
// 1. CDN da Vercel — `s-maxage` + `stale-while-revalidate`: depois da
//    primeira montagem, todo visitante recebe a resposta do cache e a
//    revalidação acontece em segundo plano. É o "armazenamento" principal.
// 2. Data Cache do Next — cada chamada pequena ao PNCP (contagens,
//    faixas) fica 2–15 min; recálculos saem quase de graça.
// 3. Memória da instância — o último resultado bom, para quando o PNCP
//    cair entre duas montagens na mesma instância.
// 4. Snapshot no repositório — último recurso, sempre disponível.

import { comoSnapshot } from './snapshot';

export interface PoliticaCache {
  /** Segundos de frescor na CDN. */
  sMaxAge: number;
  /** Segundos em que a CDN pode servir o velho enquanto revalida. */
  swr: number;
}

export const CACHE = {
  termometro: { sMaxAge: 120, swr: 3_600 },
  uf: { sMaxAge: 3 * 3_600, swr: 24 * 3_600 },
  serie: { sMaxAge: 3_600, swr: 24 * 3_600 },
  /** Quando a resposta veio do snapshot: tentar de novo logo. */
  reserva: { sMaxAge: 60, swr: 600 },
} as const satisfies Record<string, PoliticaCache>;

/** Modo forçado por variável de ambiente (testes/CI): só snapshot. */
export const SO_SNAPSHOT = () => process.env.PNCP_MODO === 'snapshot';

export function json(corpo: unknown, cache: PoliticaCache, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=0, s-maxage=${cache.sMaxAge}, stale-while-revalidate=${cache.swr}`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

interface Retrato {
  fonte: string;
  avisos: string[];
  atualizadoEm: string;
}

/**
 * Gera o retrato ao vivo; se falhar por inteiro, devolve o último bom da
 * memória ou o snapshot. Nunca responde erro à UI.
 */
export async function responder<T extends Retrato>(
  gerar: () => Promise<T>,
  memoria: { ultimoBom?: T },
  snapshot: T,
  cache: PoliticaCache,
): Promise<Response> {
  if (SO_SNAPSHOT()) return json(comoSnapshot(snapshot, 'Modo snapshot ativado.'), CACHE.reserva);
  try {
    const vivo = await gerar();
    if (vivo.fonte === 'pncp-ao-vivo') memoria.ultimoBom = vivo;
    return json(vivo, vivo.fonte === 'pncp-ao-vivo' ? cache : CACHE.reserva);
  } catch (erro) {
    const motivo = `PNCP indisponível (${String((erro as Error)?.message ?? erro).slice(0, 120)}).`;
    const reserva = memoria.ultimoBom ?? snapshot;
    return json(comoSnapshot(reserva, motivo), CACHE.reserva);
  }
}
