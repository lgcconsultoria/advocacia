/* GA4. Configurado por data-ga-id. Só é anexado ao DOM depois do
   consentimento de análise — ver components/analytics.tsx. */
(function () {
  var el = document.currentScript;
  var id = el && el.dataset ? el.dataset.gaId : null;
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  if (el.dataset.marketing === '1') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
  }

  gtag('js', new Date());
  gtag('config', id, { send_page_view: true });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
})();
