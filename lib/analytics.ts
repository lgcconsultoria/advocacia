import { readConsent } from './consent';

export type EventName =
  | 'view_area_page'
  | 'cta_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'material_download'
  | 'article_read_75pct'
  | 'form_start'
  | 'generate_lead';

export type EventParams = Record<string, string | number | boolean>;

type Layer = { push: (...args: unknown[]) => void };

/**
 * Registra um evento no GA4. Fora de consentimento é um no-op silencioso —
 * a chamada pode ficar espalhada pelo código sem condicional em cada ponto.
 */
export function track(name: EventName, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  const consent = readConsent();
  if (!consent?.analytics) return;

  const layer = (window as unknown as { dataLayer?: Layer }).dataLayer;
  if (!layer) return;
  // Empurra um único item — array de 3 posições — reproduzindo o que o
  // `gtag('event', name, params)` do public/vendor/ga4.js faz ao empurrar o
  // objeto `arguments` para o dataLayer (e não 3 argumentos separados para
  // `push`, que o Array.prototype.push espalharia em 3 elementos distintos).
  layer.push(['event', name, params]);
}
