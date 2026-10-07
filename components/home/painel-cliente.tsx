'use client';

import Link from 'next/link';
import { Bell, CalendarClock, FileText, LockKeyhole } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll';
import { VideoFundo } from '@/components/site/video-fundo';

/**
 * A área do cliente revelada ao rolar (Container Scroll Animation, 21st 1081).
 * Dentro da moldura, o vídeo dos painéis de vidro (imagem ilustrativa, sem
 * dados de cliente) com uma barra de janela e três avisos flutuando.
 */
export function PainelCliente() {
  return (
    <ContainerScroll
      titulo={
        <>
          <p className="etiqueta etiqueta--escura m-0">
            <LockKeyhole className="h-3 w-3" aria-hidden="true" /> Área do cliente
          </p>
          <h2 className="titulo m-0 mx-auto mt-5 max-w-[20ch] text-[clamp(2rem,5vw,3.9rem)] text-white">
            O andamento do seu caso, <em className="text-sinal">sem precisar perguntar</em>.
          </h2>
          <p className="m-0 mx-auto mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-cinza-escuro">
            Prazos, publicações, documentos e próximos passos de cada demanda reunidos num só lugar, com acesso
            seguro para a sua equipe.
          </p>
        </>
      }
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/8]">
        <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center gap-2 border-b border-sinal/15 bg-tinta-2/90 px-4 backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="rotulo mx-auto truncate rounded-full bg-white/5 px-3 py-0.5 text-[9px] text-cinza-escuro">
            senturiaoadv.com.br/cliente
          </span>
        </div>
        <div className="absolute inset-0 top-9">
          <VideoFundo src="/assets/video/sistema-paineis.mp4" poster="/assets/video/sistema-paineis.jpg" posicao="center" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_10_46/0.85))]" />
        </div>

        <ul className="absolute bottom-3 left-3 right-3 z-10 m-0 grid list-none gap-2 p-0 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[340px]">
          {[
            { Icone: CalendarClock, t: 'Prazo controlado', d: 'Recurso administrativo · vence em 3 dias úteis' },
            { Icone: Bell, t: 'Nova publicação', d: 'Diário Eletrônico · intimação conferida' },
            { Icone: FileText, t: 'Documento disponível', d: 'Parecer · Reforma Tributária (minuta)' },
          ].map(({ Icone, t, d }, i) => (
            <li
              key={t}
              className={`vidro-escuro flex items-center gap-3 rounded-2xl px-3.5 py-2.5 ${i > 0 ? 'max-sm:hidden' : ''}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sinal/15 text-sinal">
                <Icone className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.85rem] font-[650] text-white">{t}</span>
                <span className="block truncate text-[0.76rem] text-cinza-escuro">{d}</span>
              </span>
            </li>
          ))}
        </ul>
        <span className="rotulo absolute bottom-3 right-4 z-10 text-[9px] text-white/50 max-sm:hidden">Imagem ilustrativa</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sinal/15 bg-tinta-2/60 px-4 py-3 sm:px-6">
        <span className="text-[0.88rem] text-cinza-escuro">Já é cliente? Acesse a sua área.</span>
        <Link href="/entrar" className="btn btn-sm btn-claro">
          Entrar na área do cliente
        </Link>
      </div>
    </ContainerScroll>
  );
}
