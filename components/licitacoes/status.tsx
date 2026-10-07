'use client';

import { rotuloAtualizado } from '@/lib/pncp/animacao';
import { cn } from '@/lib/utils';
import { usePncp } from './contexto';

const HORA = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

/** "consultado em 07/10, 11:22" — determinístico (igual no servidor e no cliente). */
export function rotuloFixo(iso: string): string {
  return `consultado em ${HORA.format(new Date(iso)).replace(' ', ' às ').replace(',', '')}`;
}

/** Mais de 20 min sem dado novo deixa de ser "ao vivo". */
const VELHO_MS = 20 * 60_000;

export function useStatus() {
  const { dados, montado, rotulo } = usePncp();
  const consultadoEm = dados.publicadasHoje.procedencia.consultadoEm;
  const velho = montado && Date.now() - new Date(consultadoEm).getTime() > VELHO_MS;
  // "ao vivo" segue as contagens; valores que vierem do retrato têm aviso próprio
  const reserva =
    dados.abertas.procedencia.fonte === 'snapshot' || dados.publicadasHoje.procedencia.fonte === 'snapshot' || velho;
  return {
    reserva,
    texto: montado ? rotulo : rotuloFixo(consultadoEm),
    consultadoEm,
  };
}

/** Pílula de estado: "ao vivo" (ponto pulsando) ou "dados de reserva". */
export function PilulaStatus({ className, claro = true }: { className?: string; claro?: boolean }) {
  const { reserva, texto } = useStatus();
  return (
    <span className={cn('rotulo inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px]', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-2.5 py-1',
          reserva
            ? 'border-madeira/50 text-madeira'
            : claro
              ? 'border-sinal/45 text-white'
              : 'border-marca/30 text-marca',
        )}
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          {!reserva && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5ee0a0] opacity-60 motion-reduce:hidden" />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', reserva ? 'bg-madeira' : 'bg-[#5ee0a0]')} />
        </span>
        {reserva ? 'Dados de reserva' : 'Ao vivo'}
      </span>
      <span className={claro ? 'text-cinza-escuro' : 'text-cinza'} suppressHydrationWarning>
        {texto} · Fonte: PNCP
      </span>
    </span>
  );
}
