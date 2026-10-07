// GET /api/pncp/termometro — números do termômetro (abertas, publicadas
// hoje/24h/30d, contratos do mês), com procedência de cada número.
// CDN: 2 min frescos + 1 h servindo o anterior enquanto revalida.

import { termometro } from '@/lib/pncp/agregados';
import { CACHE, responder } from '@/lib/pncp/rota';
import { snapshotTermometro } from '@/lib/pncp/snapshot';
import type { Termometro } from '@/lib/pncp/tipos';

export const maxDuration = 60;

const memoria: { ultimoBom?: Termometro } = {};

export async function GET(_requisicao: Request): Promise<Response> {
  return responder(
    () => termometro({ prazoTotalMs: 45_000, reserva: memoria.ultimoBom ?? snapshotTermometro }),
    memoria,
    snapshotTermometro,
    CACHE.termometro,
  );
}
