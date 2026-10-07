// GET /api/pncp/uf — 27 UFs com coordenadas da capital, abertas (exato),
// valor estimado das abertas e publicadas em 30 dias. Cálculo pesado
// (~225 chamadas ao PNCP, ~60 s a frio): CDN 3 h frescas + 24 h servindo o anterior.

import { porUf } from '@/lib/pncp/agregados';
import { CACHE, responder } from '@/lib/pncp/rota';
import { snapshotUf } from '@/lib/pncp/snapshot';
import type { PorUf } from '@/lib/pncp/tipos';

export const maxDuration = 60;

const memoria: { ultimoBom?: PorUf } = {};

export async function GET(_requisicao: Request): Promise<Response> {
  return responder(
    () => porUf({ prazoTotalMs: 50_000, reserva: memoria.ultimoBom ?? snapshotUf }),
    memoria,
    snapshotUf,
    CACHE.uf,
  );
}
