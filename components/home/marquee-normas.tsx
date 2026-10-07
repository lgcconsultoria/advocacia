/**
 * Faixa de normas e tribunais (no espírito do 21st `Logo Marquee` acessível,
 * 23537): texto em mono, sem logos e sem depoimentos. Só CSS; pausa no hover e
 * para com movimento reduzido. A lista duplicada é decorativa (aria-hidden).
 */
const NORMAS = [
  'EC 132/2023',
  'LC 214/2025',
  'LC 123/2006',
  'Lei 14.133/2021',
  'Lei 12.016/2009',
  'Lei 8.429/1992',
  'Lei 9.784/1999',
  'CTN',
  'STF',
  'STJ',
  'TCU',
  'Tribunais de Contas',
];

export function MarqueeNormas({ escura = false }: { escura?: boolean }) {
  const item = (n: string, i: number) => (
    <li key={`${n}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
      <span>{n}</span>
      <span aria-hidden="true" className={escura ? 'text-sinal' : 'text-marca'}>◆</span>
    </li>
  );
  return (
    <div
      className={`relative overflow-hidden border-y py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${escura ? 'planta border-sinal/15 text-cinza-escuro' : 'border-papel-2 bg-white/50 text-cinza'}`}
    >
      <p className="sr-only">Normas e tribunais com que o escritório trabalha: {NORMAS.join(', ')}.</p>
      <div
        aria-hidden="true"
        className="group flex w-max"
        style={{ ['--marquee-dur' as string]: '55s' }}
      >
        <ul className="rotulo m-0 flex w-max animate-marquee list-none gap-10 p-0 pr-10 text-[12px] group-hover:[animation-play-state:paused]">
          {[...NORMAS, ...NORMAS].map(item)}
        </ul>
      </div>
    </div>
  );
}
