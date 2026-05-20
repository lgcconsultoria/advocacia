/* =========================================================
   Bastos Camargo Advocacia — interações de interface
   Sem dependências externas.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Menu de navegação (mobile) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 880) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- Filtro de artigos do blog ---------- */
  var filterBar = document.querySelector('.filterbar');
  if (filterBar) {
    var posts = document.querySelectorAll('[data-area]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      var area = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      posts.forEach(function (post) {
        var match = area === 'todos' || post.getAttribute('data-area') === area;
        post.style.display = match ? '' : 'none';
      });
    });
  }

  /* ---------- Formulário de diagnóstico (validação client-side) ---------- */
  var form = document.getElementById('form-diagnostico');
  if (form) {
    var feedback = document.getElementById('form-feedback');

    var setError = function (field, on) {
      var wrap = field.closest('.field') || field.closest('.consent');
      if (wrap) wrap.classList.toggle('has-error', on);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      form.querySelectorAll('[required]').forEach(function (field) {
        var ok;
        if (field.type === 'checkbox') {
          ok = field.checked;
        } else if (field.type === 'radio') {
          ok = !!form.querySelector('input[name="' + field.name + '"]:checked');
        } else if (field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        } else {
          ok = field.value.trim() !== '';
        }
        setError(field, !ok);
        if (!ok) { valid = false; if (!firstInvalid) firstInvalid = field; }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Sem back-end nesta entrega: exibe confirmação de triagem.
         Conectar a um endpoint/serviço de e-mail antes de publicar. */
      form.setAttribute('hidden', '');
      if (feedback) {
        feedback.classList.add('is-visible');
        feedback.setAttribute('tabindex', '-1');
        feedback.focus();
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    form.addEventListener('input', function (e) {
      var field = e.target;
      if (field.closest('.has-error')) setError(field, false);
    });
  }

  /* ---------- Ano corrente no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
