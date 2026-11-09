import type { Frente } from '@/lib/frentes';
import { BotaoWhatsapp, IconeWhatsapp } from './botao-whatsapp';

/**
 * Botão flutuante do WhatsApp das landings de frente. Mesmo desenho do botão
 * global, mas com o texto e o código da frente.
 */
export function WhatsappFlutuante({ frente, texto }: { frente: Frente; texto: string }) {
  return (
    <BotaoWhatsapp
      frente={frente}
      texto={texto}
      className="fixed bottom-4 right-4 z-[90] grid h-[54px] w-[54px] place-items-center rounded-full border border-sinal/40 bg-marca text-white shadow-[0_14px_34px_-10px_rgb(11_10_46/0.65)] ring-4 ring-white/40 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-tinta sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      aria-label="Falar no WhatsApp"
    >
      <IconeWhatsapp className="h-7 w-7" />
    </BotaoWhatsapp>
  );
}
