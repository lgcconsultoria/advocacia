/* Pixel da Meta. Configurado por data-pixel-id. Só carrega sob
   consentimento de marketing. */
(function () {
  var el = document.currentScript;
  var id = el && el.dataset ? el.dataset.pixelId : null;
  if (!id) return;

  if (!window.fbq) {
    var n = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    window.fbq = n;
    window._fbq = n;
  }
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);

  window.fbq('init', id);
  window.fbq('track', 'PageView');
})();
