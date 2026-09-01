import { readConsent } from './consent';

export type EventName =
  | 'view_area_page'
  | 'cta_click'
  | 'whatsapp_click'
  // Documentado no plano de medição (§6 do design), atrelado a rodapé/
  // contato — mas sem uso hoje: o projeto não tem nenhum link `tel:`, o
  // contato por telefone acontece via WhatsApp (`whatsapp_click`). Mantido
  // no tipo para não exigir realinhamento do plano de medição no GA4 caso
  // um link `tel:` direto seja adicionado no futuro.
  | 'phone_click'
  | 'email_click'
  | 'material_download'
  | 'article_read_75pct'
  | 'form_start'
  | 'generate_lead';

export type EventParams = Record<string, string | number | boolean>;

type Gtag = (...args: unknown[]) => void;
type Layer = { push: (...args: unknown[]) => void };

/**
 * Registra um evento no GA4. Fora de consentimento é um no-op silencioso —
 * a chamada pode ficar espalhada pelo código sem condicional em cada ponto.
 *
 * Usa a API canônica `window.gtag('event', name, params)` — é o próprio
 * `window.gtag` do public/vendor/ga4.js quem empurra o objeto `arguments`
 * para o `dataLayer` internamente, no formato que o gtag.js real (carregado
 * de googletagmanager.com) sabe drenar e transformar num hit de
 * `/g/collect`. Empurrar um array `['event', name, params]` direto no
 * `dataLayer` foi tentado e **não** produz hit — só a chamada a `gtag()`
 * (ou a fila de `arguments` que ela gera) é reconhecida pelo script real.
 * Ver adendo em task-8-report.md.
 */
export function track(name: EventName, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  const consent = readConsent();
  if (!consent?.analytics) return;

  const w = window as unknown as { gtag?: Gtag; dataLayer?: Layer };
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params);
    return;
  }
  // gtag ainda não existe — o vendor script (mesma origem) ainda está em
  // voo. Sem o `window.gtag` real não há como formar o objeto `arguments`
  // que o gtag.js consome; o push abaixo é o melhor esforço possível nesse
  // instante, mas não gera hit de rede — apenas evita lançar.
  w.dataLayer?.push(['event', name, params]);
}
