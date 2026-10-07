// GET /api/pncp/serie?dias=365 — contratações publicadas por dia
// ({date, count}) para o mapa de calor/skyline. O histórico vem do
// snapshot; só os últimos 7 dias (e os que faltarem) são reconsultados.

import { serieDiaria } from '@/lib/pncp/agregados';
import { CACHE, responder } from '@/lib/pncp/rota';
import { snapshotSerie } from '@/lib/pncp/snapshot';
import type { SerieDiaria } from '@/lib/pncp/tipos';

export const maxDuration = 60;

const memoria: { ultimoBom?: SerieDiaria } = {};

export async function GET(requisicao: Request): Promise<Response> {
  const pedido = Number(new URL(requisicao.url).searchParams.get('dias') ?? 365);
  const dias = Number.isFinite(pedido) ? Math.min(Math.max(Math.trunc(pedido), 7), 730) : 365;
  return responder(
    () => serieDiaria({ dias, prazoTotalMs: 40_000, reserva: memoria.ultimoBom ?? snapshotSerie }),
    memoria,
    recortar(snapshotSerie, dias),
    CACHE.serie,
  );
}

function recortar(serie: SerieDiaria, dias: number): SerieDiaria {
  const pontos = serie.pontos.slice(-dias);
  return { ...serie, pontos, inicio: pontos[0]?.date ?? serie.inicio };
}
