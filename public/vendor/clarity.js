/* Microsoft Clarity (heatmap). Configurado por data-clarity-id. */
(function () {
  var el = document.currentScript;
  var id = el && el.dataset ? el.dataset.clarityId : null;
  if (!id) return;

  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(id);
  document.head.appendChild(s);
})();
