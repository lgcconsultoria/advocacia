import { medicaoAutorizada } from '@/lib/consentimento';

/**
 * Medição (Meta Pixel, GA4 e Google Ads), sempre condicionada ao consentimento.
 * Os IDs do Google vêm de variáveis de ambiente; sem a variável, o provedor não existe.
 *
 *   PIXEL_DA_EMPRESA                  Pixel da Meta (fixo, ver abaixo)
 *   NEXT_PUBLIC_GA4_ID                GA4 (G-XXXXXXX)
 *   NEXT_PUBLIC_GOOGLE_ADS_ID         Google Ads (AW-XXXXXXXXX)
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL rótulo da conversão de lead no Ads (opcional)
 *   NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL rótulo da conversão "clique no WhatsApp" no Ads (opcional)
 */

/**
 * Pixel "Senturião Advocacia — Web", do portfólio de empresa da conta de anúncios
 * act_1786894042442518. O NEXT_PUBLIC_META_PIXEL_ID da Vercel apontava para um pixel de outra
 * conta de anúncios (1969211640374572), e as campanhas da empresa não viam as conversões
 * (16/10/2026). O ID do pixel é público (sai no HTML), por isso fica no código.
 */
export const PIXEL_DA_EMPRESA = '1629106798566329';

export const IDS_MEDICAO = {
  pixel: PIXEL_DA_EMPRESA,
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  ads: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? '',
  adsRotuloLead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? '',
  adsRotuloWhatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL ?? '',
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
 *
 * `eventId` é o mesmo `event_id` mandado com o lead (lib/contato/atribuicao.ts):
 * a Meta usa para desduplicar o evento do pixel com o da Conversions API do 360.
 */
export function registrarLead(
  dados: { categoria?: string; nome?: string; eventId?: string } = {},
): void {
  if (typeof window === 'undefined' || !medicaoAutorizada()) return;
  const w = window as Janela;
  try {
    if (typeof w.fbq === 'function') {
      const parametros = {
        ...(dados.categoria ? { content_category: dados.categoria } : {}),
        ...(dados.nome ? { content_name: dados.nome } : {}),
      };
      if (dados.eventId) w.fbq('track', 'Lead', parametros, { eventID: dados.eventId });
      else w.fbq('track', 'Lead', parametros);
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

/**
 * `ViewContent` no Pixel para página de serviço (tributário, licitações, áreas).
 * Só com consentimento e com o Pixel carregado; nunca lança.
 */
export function registrarVisualizacao(dados: { categoria: string; nome?: string }): boolean {
  if (typeof window === 'undefined' || !medicaoAutorizada()) return false;
  const w = window as Janela;
  if (typeof w.fbq !== 'function') return false;
  try {
    w.fbq('track', 'ViewContent', {
      content_category: dados.categoria,
      ...(dados.nome ? { content_name: dados.nome } : {}),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clique num link de WhatsApp: `Contact` no Pixel (evento padrão da Meta para
 * contato por chat) e `whatsapp_click` no GA4, com a página e o `ref` da dor
 * (lib/contato/whatsapp.ts); e a conversão do Ads, se houver rótulo próprio.
 * Não é `Lead`: lead é quem deixou os dados no formulário. Só com
 * consentimento; nunca lança e nunca atrasa a abertura do WhatsApp.
 */
export function registrarContatoWhatsapp(dados: { pagina: string; ref: string }): void {
  if (typeof window === 'undefined' || !medicaoAutorizada()) return;
  const w = window as Janela;
  try {
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'Contact', { content_category: 'whatsapp', content_name: dados.ref });
    }
  } catch {
    /* medição nunca derruba o clique */
  }
  try {
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'whatsapp_click', { page_path: dados.pagina, lead_source: dados.ref });
      if (IDS_MEDICAO.ads && IDS_MEDICAO.adsRotuloWhatsapp) {
        w.gtag('event', 'conversion', { send_to: `${IDS_MEDICAO.ads}/${IDS_MEDICAO.adsRotuloWhatsapp}` });
      }
    }
  } catch {
    /* idem */
  }
}
