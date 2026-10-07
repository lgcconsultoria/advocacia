/** Formatação em pt-BR usada pelas demonstrações. */
import { differenceInCalendarDays, format, formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const moeda = (v: number, opts?: { compacto?: boolean }) =>
  opts?.compacto && Math.abs(v) >= 1000
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v)
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: v % 1 === 0 ? 0 : 2 }).format(v);

export const numero = (v: number) => new Intl.NumberFormat('pt-BR').format(v);

export const dataCurta = (d: Date) => format(d, 'dd/MM', { locale: ptBR });
export const dataMedia = (d: Date) => format(d, "dd 'de' MMM", { locale: ptBR });
export const dataLonga = (d: Date) => format(d, "EEEE, dd 'de' MMMM", { locale: ptBR });
export const dataCompleta = (d: Date) => format(d, 'dd/MM/yyyy', { locale: ptBR });
export const hora = (d: Date) => format(d, 'HH:mm', { locale: ptBR });
export const mesAno = (d: Date) => format(d, 'MMMM yyyy', { locale: ptBR });
export const diaSemanaCurto = (d: Date) => format(d, 'EEE', { locale: ptBR }).replace('.', '');

/** Diferença em dias de calendário entre hoje e a data (negativo = passou). */
export const diasAte = (d: Date, hoje: Date) => differenceInCalendarDays(d, hoje);

/** Rótulo "D-x" usado nos prazos. */
export function rotuloD(d: Date, hoje: Date) {
  const n = diasAte(d, hoje);
  if (n === 0) return 'Hoje';
  if (n === 1) return 'Amanhã';
  if (n < 0) return `Venceu há ${-n}d`;
  return `D-${n}`;
}

export type Urgencia = 'vencido' | 'critico' | 'atencao' | 'tranquilo';

export function urgencia(d: Date, hoje: Date): Urgencia {
  const n = diasAte(d, hoje);
  if (n < 0) return 'vencido';
  if (n <= 1) return 'critico';
  if (n <= 5) return 'atencao';
  return 'tranquilo';
}

/** "há 12 min", "há 3 horas", "ontem", "há 5 dias" — relativo a um "agora". */
export function relativo(d: Date, agora: Date) {
  const min = Math.round((agora.getTime() - d.getTime()) / 60000);
  if (min < 0) {
    const dias = differenceInCalendarDays(d, agora);
    if (dias === 0) return `hoje, ${hora(d)}`;
    if (dias === 1) return `amanhã, ${hora(d)}`;
    return `em ${dias} dias`;
  }
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const dias = differenceInCalendarDays(agora, d);
  if (dias === 0) return `hoje, ${hora(d)}`;
  if (dias === 1) return `ontem, ${hora(d)}`;
  if (dias < 30) return `há ${dias} dias`;
  return formatDistanceStrict(d, agora, { locale: ptBR, addSuffix: true });
}

export const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
