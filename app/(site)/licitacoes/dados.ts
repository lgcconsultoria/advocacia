// Dados iniciais da página (renderizada no servidor, com ISR): o mesmo
// código das rotas /api/pncp/*, com prazo curto. O que não chegar a tempo
// vem do snapshot versionado, marcado como reserva — a página nunca espera
// o PNCP por muito tempo nem mostra número inventado.

import { porUf, serieDiaria, termometro } from '@/lib/pncp/agregados';
import { comoSnapshot, snapshotSerie, snapshotTermometro, snapshotUf } from '@/lib/pncp/snapshot';
import type { PorUf, SerieDiaria, Termometro } from '@/lib/pncp/tipos';

// A regeneração do ISR roda em segundo plano: o prazo não pesa para o visitante.
const PRAZO_MS = 25_000;

async function comReserva<T extends { fonte: string; avisos: string[]; atualizadoEm: string }>(
  gerar: () => Promise<T>,
  snapshot: T,
): Promise<T> {
  if (process.env.PNCP_MODO === 'snapshot') return comoSnapshot(snapshot, 'Modo snapshot ativado.');
  try {
    return await gerar();
  } catch (erro) {
    return comoSnapshot(snapshot, `PNCP indisponível (${String((erro as Error)?.message ?? erro).slice(0, 80)}).`);
  }
}

export async function dadosIniciais(): Promise<{ termometro: Termometro; uf: PorUf; serie: SerieDiaria }> {
  const [t, u, s] = await Promise.all([
    comReserva(() => termometro({ prazoTotalMs: PRAZO_MS, reserva: snapshotTermometro }), snapshotTermometro),
    comReserva(() => porUf({ prazoTotalMs: PRAZO_MS, reserva: snapshotUf }), snapshotUf),
    comReserva(() => serieDiaria({ dias: 365, prazoTotalMs: PRAZO_MS, reserva: snapshotSerie }), snapshotSerie),
  ]);
  return { termometro: t, uf: u, serie: s };
}
