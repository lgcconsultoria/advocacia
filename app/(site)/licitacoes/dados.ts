// Dados iniciais da página (renderizada no servidor, com ISR): o mesmo
// código das rotas /api/pncp/*, com prazo curto. O que não chegar a tempo
// vem do snapshot versionado, marcado como reserva — a página nunca espera
// o PNCP por muito tempo nem mostra número inventado.

import { unstable_cache } from 'next/cache';
import { porUf, serieDiaria, termometro } from '@/lib/pncp/agregados';
import { comoSnapshot, snapshotSerie, snapshotTermometro, snapshotUf } from '@/lib/pncp/snapshot';
import type { PorUf, SerieDiaria, Termometro } from '@/lib/pncp/tipos';

// A regeneração do ISR roda em segundo plano: o prazo não pesa para o visitante.
const PRAZO_MS = 25_000;

// Por UF e série anual mudam devagar e são as consultas pesadas (páginas de até 2,5 MB, que o Data Cache do
// fetch não guarda): o resultado pronto, pequeno, fica no cache por 3 h e 1 h. Só o termômetro segue a cada 2 min.
const porUfEmCache = unstable_cache(
  () => porUf({ prazoTotalMs: PRAZO_MS, reserva: snapshotUf }),
  ['pncp-por-uf-v1'],
  { revalidate: 3 * 60 * 60 },
);
const serieEmCache = unstable_cache(
  () => serieDiaria({ dias: 365, prazoTotalMs: PRAZO_MS, reserva: snapshotSerie }),
  ['pncp-serie-365-v1'],
  { revalidate: 60 * 60 },
);

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
    comReserva(porUfEmCache, snapshotUf),
    comReserva(serieEmCache, snapshotSerie),
  ]);
  return { termometro: t, uf: u, serie: s };
}
