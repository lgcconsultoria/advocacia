import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, FileSignature, Scale } from 'lucide-react';
import { VideoFundo } from '@/components/site/video-fundo';
import { BorderBeam } from '@/components/ui/border-beam';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';
import { cn } from '@/lib/utils';

/**
 * Bento dos pilares (v2), no espírito do 21st `Feature Grid Spotlight` (26797):
 * cartões de tamanhos diferentes, os grandes com os vídeos (Higgsfield) de
 * fundo — que só carregam e tocam quando aparecem — e um cartão de diagnóstico
 * com a borda acesa (Border Beam, 1268).
 */

function Tile({
  href,
  rotulo,
  titulo,
  texto,
  video,
  className,
  grande = false,
  medio = false,
  posicao,
}: {
  href: string;
  rotulo: string;
  titulo: ReactNode;
  texto: string;
  video: string;
  className?: string;
  grande?: boolean;
  medio?: boolean;
  posicao?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'planta group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] p-6 text-white no-underline ring-1 ring-inset ring-sinal/15 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgb(29_27_154/0.8)] sm:p-7',
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
        <VideoFundo src={`/assets/video/${video}.mp4`} poster={`/assets/video/${video}.jpg`} posicao={posicao} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_10_46/0.05)_0%,rgb(11_10_46/0.35)_40%,rgb(11_10_46/0.94)_100%)]" />
      <span className="absolute left-6 top-6 sm:left-7 sm:top-7">
        <span className="etiqueta etiqueta--escura bg-tinta/40 backdrop-blur-md">{rotulo}</span>
      </span>
      <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-tinta">
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3
        className={cn(
          'expandida m-0 max-w-[20ch] font-[790] tracking-[-0.035em]',
          grande ? 'text-[clamp(1.9rem,3.4vw,2.9rem)]' : medio ? 'text-[clamp(1.5rem,2.3vw,2.05rem)]' : 'text-[1.4rem]',
          'leading-[1.02]',
        )}
      >
        {titulo}
      </h3>
      <p className={cn('m-0 mt-3 max-w-[48ch] text-[#d4d3f3]', grande ? 'text-[1.02rem]' : 'text-[0.93rem]', 'leading-relaxed')}>{texto}</p>
    </Link>
  );
}

export function BentoPilares() {
  return (
    <div className="mt-14 grid auto-rows-[minmax(300px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[290px]">
      <Tile
        grande
        href="/tributario"
        rotulo="Tributário · Reforma"
        titulo={
          <>
            A Reforma Tributária chegou à <em className="citacao font-[400] text-sinal">sua nota fiscal</em>.
          </>
        }
        texto="IBS e CBS no lugar de PIS, Cofins, ICMS e ISS, de 2027 a 2033. Simulação ano a ano, opção do Simples, preço e contratos — com os números da sua empresa."
        video="tributario-fatura"
        className="md:col-span-2 lg:row-span-2 min-h-[420px]"
        posicao="40% 50%"
      />
      <Tile
        medio
        href="/licitacoes"
        rotulo="Licitações e contratos públicos"
        titulo="Do edital ao contrato, sob a Lei 14.133."
        texto="Impugnação, habilitação, recursos, reequilíbrio e defesa em sanções — com o termômetro ao vivo do PNCP."
        video="licitacoes-brasil"
        className="md:col-span-2"
        posicao="70% 50%"
      />
      <Tile
        href="/areas/mandado-de-seguranca"
        rotulo="Mandado de segurança"
        titulo="Contra o ato ilegal, no prazo."
        texto="Cabimento, liminar e a contagem dos 120 dias."
        video="colunas"
        posicao="65% 50%"
      />
      <Tile
        href="/areas/empresarial"
        rotulo="Empresarial"
        titulo="Contratos, sócios e cobrança."
        texto="Disputas contratuais, societárias e de crédito entre empresas."
        video="empresas-industria"
        posicao="50% 60%"
      />
      <Tile
        medio
        href="/tributario#split-payment"
        rotulo="Split payment"
        titulo="O imposto separado no pagamento."
        texto="O IBS e a CBS separados no momento do pagamento: muda o caixa da empresa, não o valor do tributo."
        video="tributario-split"
        className="md:col-span-2"
        posicao="60% 50%"
      />
      <Link
        href="/areas/contratos-publicos"
        className="card card-link group flex flex-col justify-between rounded-[28px] p-6 no-underline sm:p-7"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(142_139_255/0.2),rgb(29_27_154/0.08))] text-marca">
          <FileSignature className="h-6 w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="etiqueta">Contratos</span>
          <span className="expandida mt-4 block text-[1.35rem] font-[780] leading-[1.06] tracking-[-0.03em] text-grafite">
            Preço, reajuste e reequilíbrio.
          </span>
          <span className="mt-2 block text-[0.92rem] leading-relaxed text-cinza">
            Cláusulas de preço líquido de IBS/CBS e pedidos de reequilíbrio nos contratos públicos e privados.
          </span>
        </span>
      </Link>
      <div className="planta relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-7">
        <BorderBeam size={180} duration={8} />
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sinal/15 text-sinal">
          <Scale className="h-6 w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="expandida block text-[1.35rem] font-[780] leading-[1.06] tracking-[-0.03em] text-white">
            Não sabe por onde começar?
          </span>
          <span className="mt-2 block text-[0.92rem] leading-relaxed text-cinza-escuro">
            Quatro campos e o escritório indica o caminho.
          </span>
          <BotaoDiagnostico variant="claro" size="sm" className="mt-5">
            Fazer diagnóstico
          </BotaoDiagnostico>
        </span>
      </div>
    </div>
  );
}
