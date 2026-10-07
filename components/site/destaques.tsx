import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { VideoFundo } from './video-fundo';

/** As duas frentes em destaque (Tributário e Licitações), em cartões com vídeo de fundo. */
const FRENTES = [
  {
    href: '/tributario',
    rotulo: 'Assessoria tributária',
    titulo: 'Reforma Tributária, Simples híbrido e split payment',
    texto: 'Diagnóstico com os números da empresa, simulação de 2027 a 2033, contratos e defesa.',
    video: 'tributario-fatura',
  },
  {
    href: '/licitacoes',
    rotulo: 'Departamento de Licitações',
    titulo: 'Do edital ao contrato, sob a Lei 14.133',
    texto: 'Impugnação, habilitação, recursos, reequilíbrio e sanções — com o termômetro ao vivo do PNCP.',
    video: 'licitacoes-brasil',
  },
];

export function DestaquesFrentes() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {FRENTES.map((f) => (
        <Link
          key={f.href}
          href={f.href}
          className="planta group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] p-7 text-white no-underline ring-1 ring-inset ring-sinal/15 transition-transform duration-500 hover:-translate-y-1 sm:p-9"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-20 transition-transform duration-[1.2s] group-hover:scale-[1.04]">
            <VideoFundo src={`/assets/video/${f.video}.mp4`} poster={`/assets/video/${f.video}.jpg`} posicao="65% 50%" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_10_46/0.1),rgb(11_10_46/0.92))]" />
          <span className="etiqueta etiqueta--escura absolute left-7 top-7 bg-tinta/40 backdrop-blur-md sm:left-9 sm:top-9">{f.rotulo}</span>
          <span className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all group-hover:rotate-45 group-hover:bg-white group-hover:text-tinta">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="expandida m-0 max-w-[22ch] text-[clamp(1.5rem,2.6vw,2.2rem)] font-[790] leading-[1.04] tracking-[-0.035em]">{f.titulo}</h2>
          <p className="m-0 mt-3 max-w-[48ch] text-[0.98rem] leading-relaxed text-[#d4d3f3]">{f.texto}</p>
        </Link>
      ))}
    </div>
  );
}
