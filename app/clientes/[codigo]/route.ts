import { PAGINAS_RESERVADAS, type PaginaCifrada } from '@/lib/clientes';

/**
 * Página reservada: entrega o HTML cifrado dentro de uma tela de senha. A decifração
 * acontece no navegador (Web Crypto); o servidor nunca vê a senha nem o conteúdo.
 * Fora do índice dos buscadores (cabeçalho X-Robots-Tag e robots.txt).
 */
const CABECALHOS = {
  'Content-Type': 'text/html; charset=utf-8',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  // A página decifrada é um HTML autocontido: scripts e estilos inline, Google Fonts.
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    'font-src https://fonts.gstatic.com',
    "img-src 'self' data: blob:",
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
};

export async function GET(_req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const pagina = PAGINAS_RESERVADAS[codigo];
  if (!pagina) {
    return new Response('Página não encontrada.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
  }
  return new Response(telaDeSenha(pagina), { headers: CABECALHOS });
}

function telaDeSenha(p: PaginaCifrada): string {
  const cifra = JSON.stringify(p).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Documento reservado</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  html,body{height:100%;margin:0}
  body{background:#0E2A42;color:#F5F2EB;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;display:grid;place-items:center;padding:24px 16px}
  main{width:100%;max-width:420px;display:flex;flex-direction:column;gap:18px}
  .selo{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#D8A74A;font-weight:700}
  h1{font-size:26px;line-height:1.2;margin:0;font-weight:700}
  p{margin:0;color:#A9BBCC;line-height:1.5;font-size:15px}
  form{display:flex;flex-direction:column;gap:10px;margin-top:6px}
  label{font-size:14px;font-weight:600}
  input{font:inherit;font-size:16px;padding:12px 14px;border-radius:8px;border:1px solid rgba(236,228,210,.28);background:#0A2236;color:#F5F2EB}
  input:focus{outline:2px solid #D8A74A;outline-offset:2px}
  button{font:inherit;font-weight:700;font-size:16px;padding:12px 14px;border:0;border-radius:8px;background:#D8A74A;color:#081B2B;cursor:pointer}
  button:disabled{opacity:.6;cursor:progress}
  .erro{color:#F4A988;min-height:1.4em;font-size:14px}
  footer{font-size:12px;color:#7F93A8;border-top:1px solid rgba(236,228,210,.14);padding-top:14px}
</style>
</head>
<body>
<main>
  <span class="selo">Área do cliente</span>
  <h1>Documento reservado</h1>
  <p>Este conteúdo é confidencial. Digite a senha que você recebeu do escritório para abrir.</p>
  <form id="f" autocomplete="off">
    <label for="senha">Senha</label>
    <input id="senha" name="senha" type="password" required autofocus spellcheck="false" autocapitalize="off">
    <button id="abrir" type="submit">Abrir documento</button>
    <span class="erro" id="erro" role="alert"></span>
  </form>
  <footer>Douglas Senturião Advocacia · OAB/SC 73.764</footer>
</main>
<script>
(() => {
  const C = ${cifra};
  const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const f = document.getElementById('f'), btn = document.getElementById('abrir'), erro = document.getElementById('erro');
  if (!window.crypto || !crypto.subtle) { erro.textContent = 'Este navegador não consegue abrir o documento. Use uma versão atual do Chrome, Safari, Edge ou Firefox.'; btn.disabled = true; return; }
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    erro.textContent = ''; btn.disabled = true; btn.textContent = 'Abrindo…';
    try {
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(f.senha.value.trim()), 'PBKDF2', false, ['deriveKey']);
      const chave = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(C.sal), iterations: C.iteracoes, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      const html = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(C.iv) }, chave, bytes(C.dados)));
      document.open(); document.write(html); document.close();
    } catch (_) {
      erro.textContent = 'Senha incorreta. Confira maiúsculas, minúsculas e hífens e tente de novo.';
      btn.disabled = false; btn.textContent = 'Abrir documento'; f.senha.select();
    }
  });
})();
</script>
</body>
</html>`;
}
