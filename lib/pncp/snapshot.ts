// Último retrato bom, versionado no repositório (gerado por
// `node scripts/pncp/snapshot.mjs`). Serve de reserva quando o PNCP está
// lento ou fora do ar, e de histórico para a série diária.

import termometroJson from './snapshot/termometro.json';
import ufJson from './snapshot/uf.json';
import serieJson from './snapshot/serie.json';
import type { PorUf, SerieDiaria, Termometro } from './tipos';

export const snapshotTermometro = termometroJson as unknown as Termometro;
export const snapshotUf = ufJson as unknown as PorUf;
export const snapshotSerie = serieJson as unknown as SerieDiaria;

/** Cópia do retrato marcada como vinda do snapshot, com aviso para a UI. */
export function comoSnapshot<T extends { fonte: string; avisos: string[]; atualizadoEm: string }>(
  retrato: T,
  motivo: string,
): T {
  const copia = JSON.parse(JSON.stringify(retrato)) as T;
  const marcar = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    if (r.fonte === 'pncp-ao-vivo') r.fonte = 'snapshot';
    Object.values(r).forEach(marcar);
  };
  marcar(copia);
  copia.avisos = [
    ...copia.avisos,
    `${motivo} Exibindo o último retrato salvo, de ${copia.atualizadoEm}.`,
  ];
  return copia;
}
