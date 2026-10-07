'use client';

import ContributionSkyline, { type SkylineLabels } from '@/components/ui/contribution-skyline';
import { formatarInteiro } from '@/lib/pncp/animacao';
import type { SerieDiaria } from '@/lib/pncp/tipos';

const ROTULOS: Partial<SkylineLabels> = {
  total: 'Publicadas em 12 meses',
  busiest: 'Dia de maior movimento',
  longest: 'Maior sequência de dias com publicação',
  current: 'Sequência atual',
  day: 'dia',
  days: 'dias',
  none: 'Sem',
  on: 'em',
  between: 'entre',
  inLastYear: 'nos últimos 12 meses',
  hintFlat: 'Passe o mouse num dia para ver o número · setas do teclado navegam',
  hintOrbit: 'Arraste para girar · clique duplo volta ao ângulo inicial',
  less: 'Menos',
  more: 'Mais',
  levels: ['Sem publicações', 'Pouco movimento', 'Moderado', 'Intenso', 'Pico'],
  flat: 'Mapa de calor',
  skyline: 'Skyline em 3D',
  viewGroup: 'Modo de visualização',
  shownAs: 'exibido como',
  readDays: 'Use as setas do teclado para ler cada dia.',
};

// azul da marca, do mais apagado ao mais aceso, para a planta escura (e o inverso no papel)
const PALETA = {
  light: ['#c9c8f3', '#8e8bff', '#4a46d8', '#1d1b9a'],
  dark: ['#2a2880', '#4744c9', '#7b77ff', '#c9c7ff'],
};

export function UmAno({ serie }: { serie: SerieDiaria }) {
  const pontos = serie.pontos;
  const total = pontos.reduce((s, p) => s + p.count, 0);
  const uteis = pontos.slice(0, -1).filter((p) => {
    const d = new Date(p.date + 'T12:00:00Z').getUTCDay();
    return d >= 1 && d <= 5;
  });
  const mediaUtil = uteis.length ? Math.round(uteis.reduce((s, p) => s + p.count, 0) / uteis.length) : 0;
  return (
    // no celular, a unidade quebra para baixo do número nos totais
    <div className="mt-12 max-sm:[&_.items-baseline]:flex-wrap">
      <ContributionSkyline
        data={pontos}
        endDate={serie.fim}
        locale="pt-BR"
        unit="publicação"
        unitPlural="publicações"
        palette={PALETA}
        labels={ROTULOS}
        weekStart={0}
        heightScale={0.9}
        duration={1600}
        className="!border-sinal/20"
        title={
          <span className="text-cinza-escuro">
            Um ano de contratações publicadas no PNCP, <span className="text-white">dia a dia</span>
          </span>
        }
      />
      <p className="m-0 mt-5 max-w-[80ch] text-[0.86rem] leading-relaxed text-cinza-escuro">
        {formatarInteiro(total)} editais, avisos e atos de contratação direta em {formatarInteiro(pontos.length)} dias
        {mediaUtil ? <> — em média {formatarInteiro(mediaUtil)} por dia de segunda a sexta</> : null}. Os fins de semana aparecem
        quase vazios: os órgãos publicam em dias úteis. O dia de hoje ainda está em andamento. Fonte: PNCP, uma
        contagem exata por dia (fuso de Brasília).
      </p>
    </div>
  );
}
