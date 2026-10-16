import { medicaoAutorizada } from '@/lib/consentimento';

/**
 * Medição (Meta Pixel, GA4 e Google Ads), sempre condicionada ao consentimento.
 * Os IDs vêm de variáveis de ambiente; sem a variável, o provedor não existe.
 *
 *   NEXT_PUBLIC_META_PIXEL_ID         Pixel da Meta
 *   NEXT_PUBLIC_GA4_ID                GA4 (G-XXXXXXX)
 *   NEXT_PUBLIC_GOOGLE_ADS_ID         Google Ads (AW-XXXXXXXXX)
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL rótulo da conversão de lead no Ads (opcional)
 */

export const IDS_MEDICAO = {
  pixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  ads: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? '',
  adsRotuloLead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? '',
};

/** Há algum provedor configurado? Sem nenhum, o aviso de cookies nem aparece. */
export const HA_MEDICAO = Boolean(IDS_MEDICAO.pixel || IDS_MEDICAO.ga4 || IDS_MEDICAO.ads);

type Janela = Window & {
  fbq?: (...a: unknown[]) => void;
  gtag?: (...a: unknown[]) => void;
};

/**
 * Registra um lead enviado com sucesso: `Lead` no Pixel e `generate_lead` no
 * GA4 (e a conversão do Ads, se houver rótulo). Nunca lança: sem consentimento
 * ou sem o script carregado, simplesmente não faz nada.
 */
export function registrarLead(dados: { categoria?: string; nome?: string } = {}): void {
  if (typeof window === 'undefined' || !medicaoAutorizada()) return;
  const w = window as Janela;
  try {
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'Lead', {
        ...(dados.categoria ? { content_category: dados.categoria } : {}),
        ...(dados.nome ? { content_name: dados.nome } : {}),
      });
    }
  } catch {
    /* medição nunca derruba o formulário */
  }
  try {
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'generate_lead', {
        ...(dados.categoria ? { lead_source: dados.categoria } : {}),
        ...(dados.nome ? { item_name: dados.nome } : {}),
      });
      if (IDS_MEDICAO.ads && IDS_MEDICAO.adsRotuloLead) {
        w.gtag('event', 'conversion', { send_to: `${IDS_MEDICAO.ads}/${IDS_MEDICAO.adsRotuloLead}` });
      }
    }
  } catch {
    /* idem */
  }
}
