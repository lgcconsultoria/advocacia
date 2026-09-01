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

  /* A partir daqui o CSS pode esconder. Antes disso, não podia. */
  root.classList.add('js');

  var pronto = false;
  /* Se a inicialização não completar, o conteúdo volta a aparecer.
     Só dispara quando `pronto` continua falso — uma navegação normal
     nunca perde a animação por causa deste timeout. */
  setTimeout(function () {
    if (!pronto) root.classList.add('reveal-done');
  }, 1200);

  try {
    var temTimeline =
      window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');

    if (temTimeline) {
      /* Caminho CSS puro: nada a fazer. */
      pronto = true;
      return;
    }

    if (!('IntersectionObserver' in window)) {
      root.classList.add('reveal-done');
      pronto = true;
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('is-in');
            io.unobserve(entries[i].target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    var observar = function () {
      var els = document.querySelectorAll('.reveal:not(.is-in)');
      for (var i = 0; i < els.length; i++) io.observe(els[i]);
    };

    var agendado = false;
    var agendar = function () {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(function () {
        agendado = false;
        observar();
      });
    };

    var iniciar = function () {
      observar();
      /* Navegação client-side do App Router injeta novos .reveal. */
      new MutationObserver(agendar).observe(document.body, {
        childList: true,
        subtree: true,
      });
      pronto = true;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', iniciar);
    } else {
      iniciar();
    }
  } catch (e) {
    root.classList.add('reveal-done');
    pronto = true;
  }
})();
