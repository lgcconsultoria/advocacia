import { Banknote, Landmark, ReceiptText } from 'lucide-react';
import { VideoFundo } from '@/components/site/video-fundo';

/**
 * O split payment explicado em três passos, sobre o vídeo do prisma que
 * separa o fluxo (Higgsfield). Linguagem simples; fonte na legenda.
 */
const PASSOS = [
  {
    Icone: ReceiptText,
    t: 'A nota sai com o IBS e a CBS destacados',
    d: 'O valor do serviço e o valor dos tributos aparecem separados no documento fiscal.',
  },
  {
    Icone: Banknote,
    t: 'No pagamento, o tributo é separado',
    d: 'Quando o cliente paga por meio eletrônico, o prestador de serviço de pagamento segrega a parcela do IBS e da CBS e a envia ao Fisco.',
  },
  {
    Icone: Landmark,
    t: 'A empresa recebe o valor líquido',
    d: 'Muda o momento em que o dinheiro do tributo sai do caixa — não o valor devido. O planejamento de capital de giro precisa considerar isso.',
  },
];

export function SplitPayment() {
  return (
    <section id="split-payment" className="planta relative isolate overflow-hidden" aria-labelledby="split-titulo">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <VideoFundo src="/assets/video/tributario-split.mp4" poster="/assets/video/tributario-split.jpg" posicao="62% 50%" className="opacity-80" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--tinta)_0%,rgb(11_10_46/0.55)_30%,rgb(11_10_46/0.55)_55%,var(--tinta)_100%)]"
      />
      <div className="container py-24 md:py-36">
        <p className="etiqueta etiqueta--escura m-0">
          <span className="num opacity-70">05</span>Split payment
        </p>
        <h2 id="split-titulo" className="titulo m-0 mt-5 max-w-[16ch] text-[clamp(2rem,5vw,3.9rem)] text-white">
          O imposto separado <em className="text-sinal">no pagamento</em>.
        </h2>
        <p className="m-0 mt-6 max-w-[58ch] text-[1.06rem] leading-relaxed text-[#d4d3f3]">
          O recolhimento na liquidação financeira (split payment) é uma das peças da Reforma: o tributo deixa de
          passar pelo caixa da empresa. Para o cliente, o crédito do IBS e da CBS fica ligado ao pagamento do
          tributo.
        </p>
        <ol className="m-0 mt-14 grid list-none gap-4 p-0 md:grid-cols-3">
          {PASSOS.map(({ Icone, t, d }, i) => (
            <li key={t} className="vidro-escuro relative rounded-[24px] p-6 sm:p-7">
              <span className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sinal/15 text-sinal">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rotulo num text-[10px] text-cinza-escuro">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3 className="semi m-0 mt-5 text-[1.15rem] font-[720] leading-snug text-white">{t}</h3>
              <p className="m-0 mt-2 text-[0.94rem] leading-relaxed text-cinza-escuro">{d}</p>
            </li>
          ))}
        </ol>
        <p className="rotulo m-0 mt-6 text-[10px] text-cinza-escuro">LC 214/2025, arts. 31 a 35 (split payment) e arts. 47 e 48 (crédito)</p>
      </div>
    </section>
  );
}
