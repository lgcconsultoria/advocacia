/* Bootstrap de mesma origem. Roda antes do primeiro paint.
   Existe para que o site não precise de nenhum <script> inline,
   o que permite um CSP com script-src 'self' e sem nonce. */
(function () {
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem('dsa-theme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    }
  } catch (e) {
    /* modo privado ou storage bloqueado: segue o prefers-color-scheme */
  }
})();
