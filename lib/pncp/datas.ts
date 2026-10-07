// Datas no fuso de Brasília. O PNCP grava e filtra datas no horário de
// Brasília (America/Sao_Paulo, UTC−3, sem horário de verão desde 2019):
// "hoje" para o termômetro é o dia civil de Brasília, não o de UTC.

const OFFSET_BRASILIA_MS = -3 * 60 * 60 * 1000;

/** Data e hora "de parede" de Brasília como componentes UTC de um Date deslocado. */
function emBrasilia(d: Date): Date {
  return new Date(d.getTime() + OFFSET_BRASILIA_MS);
}

const dois = (n: number) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' do dia civil de Brasília. */
export function diaBrasilia(d: Date = new Date()): string {
  const b = emBrasilia(d);
  return `${b.getUTCFullYear()}-${dois(b.getUTCMonth() + 1)}-${dois(b.getUTCDate())}`;
}

/** 'YYYY-MM-DDTHH:mm:ss' no horário de Brasília (formato aceito pela busca do PNCP). */
export function dataHoraBrasilia(d: Date = new Date()): string {
  const b = emBrasilia(d);
  return `${diaBrasilia(d)}T${dois(b.getUTCHours())}:${dois(b.getUTCMinutes())}:${dois(b.getUTCSeconds())}`;
}

/** Soma `n` dias a uma data 'YYYY-MM-DD' (aritmética de calendário, sem fuso). */
export function somarDias(dia: string, n: number): string {
  const [a, m, d] = dia.split('-').map(Number);
  const x = new Date(Date.UTC(a, m - 1, d + n));
  return `${x.getUTCFullYear()}-${dois(x.getUTCMonth() + 1)}-${dois(x.getUTCDate())}`;
}

/** Primeiro dia do mês de uma data 'YYYY-MM-DD'. */
export function inicioDoMes(dia: string): string {
  return `${dia.slice(0, 7)}-01`;
}

/** Lista de dias de `inicio` a `fim`, inclusive. */
export function intervaloDeDias(inicio: string, fim: string): string[] {
  const dias: string[] = [];
  for (let d = inicio; d <= fim; d = somarDias(d, 1)) dias.push(d);
  return dias;
}
