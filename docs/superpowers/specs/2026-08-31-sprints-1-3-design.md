# Sprints 1 e 3 — Correção crítica e acabamento

**Data:** 2026-08-31
**Origem:** Briefing Técnico v2.0 — Douglas Senturião Advocacia
**Escopo:** Sprint 1 (P1, P2, P6, P7) + Sprint 3 (P8, P9, P11, P12, P13, dark mode, template de área §8.1)

---

## 1. Contexto

O site está em produção em `senturiaoadv.com.br` (Next.js 16 App Router, Keystatic +
Markdoc, design system CSS próprio em `app/globals.css`). O posicionamento, a copy e a
conformidade com a OAB são ativos e **não podem regredir**. O trabalho é de execução:
consertar o que quebra, medir o que não é medido e proteger o que está exposto.

### 1.1 Defeitos confirmados no código

| ID | Defeito | Evidência no repositório |
|----|---------|--------------------------|
| P1 | Conteúdo invisível sem JS | `components/reveal.tsx` — `initial: { opacity: 0 }` + `whileInView`; `app/globals.css:565` — `[data-reveal] { opacity: 0 }` órfão, sem nenhum código que remova o estado |
| P1b | Cascata longa demais | `RevealGroup` com `staggerChildren: 0.09` sobre 14 cards em `app/(site)/areas/page.tsx` = 1,26 s |
| P2 | Hero pesado | `public/assets/video/hero.mp4` — 2,5 MB, 720×1280, **10 s**, 1,96 Mbps, `preload="metadata"`, sem gate de rede ou viewport |
| P6 | Zero medição | Apenas `components/meta-pixel.tsx`, opcional e sem consentimento |
| P7 | Zero headers | `next.config.mjs` tem 5 linhas e nenhum `headers()` |
| P8 | Cards desalinhados | `.area-card` é `flex-direction: column` sem linhas reservadas |
| P9 | Colunas vazias | `.page-hero` ocupa metade da largura em `/areas`, `/diagnostico`, `/contato`, `/modelos` |
| P12 | Logo superdimensionado | `logo-horizontal.png` 1151×399 servido, exibido a 133×46 |
| P13 | Sem PWA, feed, dark mode ou cache de CDN | Nenhum `manifest.json`, nenhum `feed.xml`, `prefers-color-scheme` não usado |

### 1.2 Fora de escopo (e por quê)

| Item | Sprint | Bloqueio |
|------|--------|----------|
| Wizard do diagnóstico (P4) | 2 | — |
| Supabase, Resend, n8n, `/admin` | 2 | Credenciais não disponíveis nesta sessão |
| Prova social (P3) | 2 | **Fatos sobre o escritório.** Componentes serão construídos; números e casos são preenchidos pelo Douglas. Nada será inventado. |
| Verificador de prazo, busca, OG dinâmico (P14) | 4 | — |
| Ensaio fotográfico (P10 completo) | 5 | Exige foto real; ver §8.5 |
| Migração Keystatic → Content Collections | 2 | Sem dependência nos Sprints 1/3; ver §1.3 |

### 1.3 Decisões de stack

O cliente optou por migrar para a stack do briefing. Nenhum item dos Sprints 1 e 3
depende de Content Collections ou de react-hook-form — ambos chegam com o wizard.
Portanto, nesta entrega:

**Adotado agora:** Tailwind v4 com tokens em `@theme`, fontes self-hosted via
`next/font/google` (baixa e serve do próprio domínio no build), ícones Lucide,
Vitest, Playwright, `@axe-core/playwright`.

**Emparelhado com o Sprint 2:** Content Collections + MDX, react-hook-form + Zod,
primitivos shadcn/ui.

**Registro para reconsideração no Sprint 2:** Keystatic já versiona áreas e artigos
em Git — o objetivo declarado do briefing — **e** entrega um CMS visual em
`/keystatic`. Content Collections entrega o versionamento e remove o CMS. A troca
tem um custo para um usuário não-técnico que hoje edita conteúdo sozinho.

---

## 2. Fundação — tokens e tema

### 2.1 Arquitetura em duas camadas

O `globals.css` atual mistura marca e superfície num único nível (`--paper`,
`--ink`, `--text` são simultaneamente identidade e função). Isso torna o dark mode
uma auditoria de 579 linhas. A correção é separar:

**Camada 1 — rampas fixas.** Nunca mudam com o tema.

```css
--brand-900:#0F0E52; --brand-800:#15137A; --brand-700:#1D1B9A;
--brand-600:#2B27C4; --brand-500:#3D38E0; --brand-100:#E4E3FB; --brand-50:#F2F1FE;
--ink-900:#16161D; --ink-700:#2A2A35; --ink-500:#5A5A6B;
--ink-300:#9A9AAB; --ink-100:#E8E8EE; --ink-50:#F4F4F7;
--paper:#FFFFFF;
--urgent:#B3261E; --success:#1B6E3C; --warning:#8A5A00; --info:var(--brand-700);
```

**Camada 2 — semântica de superfície.** É a única coisa que o dark mode redefine.

| Token | Claro | Escuro |
|-------|-------|--------|
| `--surface` | `--paper` | `#101016` |
| `--surface-alt` | `--ink-50` | `#17171F` |
| `--surface-raised` | `--paper` | `#1D1D27` |
| `--surface-inverse` | `--ink-900` | `#000` |
| `--text` | `--ink-700` | `#E8E8EE` |
| `--text-muted` | `--ink-500` | `#A8A8B8` |
| `--text-strong` | `--ink-900` | `#FFFFFF` |
| `--border` | `--ink-100` | `#2C2C38` |
| `--accent` | `--brand-700` | `#8B87F0` |

**Regra invariável:** nenhuma cor pode ter sua única definição dentro de um bloco
`@media` ou `[data-theme]`. Toda cor nasce em `:root`.

### 2.2 Os três estados de tema

```css
:root { /* claro — definição completa */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* só a camada 2 */ }
}
:root[data-theme="dark"] { /* mesma camada 2 — o toggle vence nos dois sentidos */ }
```

O toggle grava `localStorage['dsa-theme']` e escreve `data-theme` em `<html>`.
A leitura acontece em `/bootstrap.js` (§4.3), antes do primeiro paint, sem FOUC.

### 2.3 Contraste

O briefing exige AA em tudo e **AAA (≥7:1) no corpo de texto**. O `--text-muted`
atual (`#5E5E68` sobre `#F2F2F5`) fica em ~6,3:1 — passa AA, falha AAA.

Resolução: o corpo de texto corrido passa a `--ink-700` (`#2A2A35` sobre branco =
**14,2:1**). `--ink-500` fica restrito a texto auxiliar (hints, metadados, legendas),
onde AA é o requisito aplicável. Um teste automatizado registra os pares (§9.2).

### 2.4 Tipografia

Escala fluida do §3.2 do briefing, com as correções de micro-tipografia:

- `text-wrap: balance` em `h1`, `h2`, `.eyebrow`; `text-wrap: pretty` em `p`
- `hyphens: auto` com `lang="pt-BR"` já presente no `<html>`
- `font-variant-numeric: tabular-nums` em datas, prazos e números de etapa
- Medida de leitura do artigo: `max-width: 68ch` (hoje `720px`)
- Eyebrow: `letter-spacing` cai de `.17em` para `.08em` abaixo de 1024px, corrigindo
  a quebra em duas linhas observada em `/modelos`

Fontes via `next/font/google` — baixadas no build e servidas do próprio domínio,
eliminando os `<link>` para `fonts.googleapis.com` de `app/layout.tsx` e a
dependência de terceiro no caminho crítico. `font-display: swap`, subset `latin-ext`.

---

## 3. P1 — Reveal on scroll

### 3.1 Princípio

**O estado padrão é visível.** A animação é aditiva e só existe para quem tem JS.
Com JS desligado, nenhuma regra esconde nada.

### 3.2 Mecânica

`/bootstrap.js` (script clássico, bloqueante, ~400 bytes, cacheado) adiciona
`class="js"` a `<html>` antes do primeiro paint. Só então:

```css
.reveal { /* sem regra: visível */ }
.js .reveal { opacity: 0; transform: translateY(12px); }
.js .reveal.is-in {
  opacity: 1; transform: none;
  transition: opacity 320ms cubic-bezier(.22,.61,.36,1),
              transform 320ms cubic-bezier(.22,.61,.36,1);
  transition-delay: calc(var(--reveal-i, 0) * 40ms);
}
```

**Caminho primário — CSS puro, zero JS na main thread:**

```css
@supports (animation-timeline: view()) {
  .js .reveal {
    animation: reveal-in 320ms cubic-bezier(.22,.61,.36,1) both;
    animation-timeline: view();
    animation-range: entry calc(var(--reveal-i, 0) * 4%)
                     entry calc(30% + var(--reveal-i, 0) * 4%);
  }
}
```

O stagger vira espacial em vez de temporal — cada item do lote entra 4% de
viewport depois do anterior. Elementos já visíveis no load já passaram de
`entry 100%` e renderizam no estado final.

**Fallback — `IntersectionObserver`,** apenas sob `@supports not (animation-timeline: view())`:
`rootMargin: '0px 0px -8% 0px'`, `threshold: 0.05`, `unobserve` após entrar.

**Rede de segurança.** `/bootstrap.js` agenda, no mesmo tick em que adiciona `.js`,
um `setTimeout` de 1200 ms que aplica `.reveal-done` em `<html>`:

```css
.reveal-done .reveal {
  opacity: 1 !important; transform: none !important; animation: none !important;
}
```

Se o bundle React nunca carregar, ou o observer nunca disparar, o conteúdo aparece
mesmo assim. Isso torna o P1 impossível de reincidir por falha de JS.

### 3.3 Limites

- Deslocamento 12px, duração 320ms, stagger 40ms, **máximo 6 itens por lote**
  (`--reveal-i: min(index, 5)` calculado no servidor, não no cliente)
- `prefers-reduced-motion: reduce` → `opacity: 1`, `transform: none`, `animation: none`
- **Nada acima da dobra é animado.** `Reveal` sai do hero da home e da primeira
  seção de todas as páginas.

### 3.4 Limpeza

Remover `[data-reveal] { opacity: 0 }` e `.reveal-ready [data-reveal]` de
`globals.css:564-566`. São CSS morto que apaga qualquer elemento que ganhe o
atributo — uma regressão esperando um autor desavisado.

`components/reveal.tsx` deixa de ser client component: passa a renderizar
elementos comuns com `className="reveal"` e `style={{'--reveal-i': i}}`. Motion
deixa de ser carregado nas páginas que só usam reveal.

### 3.5 Critério de aceite

- Com JS desativado, `/areas` exibe os 14 cards (teste Playwright, §9.3)
- Nenhum elemento permanece invisível por mais de 400 ms após entrar no viewport

---

## 4. P2 — Mídia do hero

### 4.1 Poster como LCP

`next/image` com `priority`, `sizes` correto e `width`/`height` explícitos.
`next.config.mjs` já habilita AVIF e WebP. O poster é o LCP e não depende de JS.

### 4.2 Vídeo condicional

Monta apenas se **todas** forem verdadeiras:

- `matchMedia('(min-width: 1024px)').matches`
- `navigator.connection?.effectiveType === '4g'`
- `navigator.connection?.saveData !== true`
- `!matchMedia('(prefers-reduced-motion: reduce)').matches`
- elemento em viewport (`IntersectionObserver`)

`preload="none"`, `muted`, `loop`, `playsInline`. Crossfade de 240 ms sobre o poster
no evento `canplay`. Se `navigator.connection` não existir (Safari), o vídeo **não**
carrega — degradação conservadora, coerente com o orçamento.

### 4.3 Botão de pausa

WCAG 2.2.2 exige controle para movimento automático acima de 5 s. O clipe tem 10 s.
Botão real (`<button>`, alvo ≥44×44px, rótulo acessível, `aria-pressed`), visível
sempre que o vídeo estiver montado — não apenas no hover.

### 4.4 Reencode

Origem: 720×1280, 10 s, H.264, 1,96 Mbps, 2,5 MB.
Alvo: 608×1080 (lado maior ≤1080), **8 s**, sem áudio, **≤600 KB por arquivo**.

```
# AV1/WebM (primário)
ffmpeg -i hero.mp4 -t 8 -an -vf scale=608:1080 \
  -c:v libsvtav1 -crf 45 -preset 6 -g 240 -pix_fmt yuv420p hero.webm

# H.264/MP4 (fallback)
ffmpeg -i hero.mp4 -t 8 -an -vf scale=608:1080 \
  -c:v libx264 -crf 30 -preset slow -profile:v high -pix_fmt yuv420p \
  -movflags +faststart hero.mp4
```

CRF é ajustado até o arquivo caber no orçamento; o tamanho final é medido e
registrado, não presumido. Se `libsvtav1` não estiver no build local do ffmpeg,
cai para `libvpx-vp9`.

### 4.5 Orçamento

Home ≤ 900 KB no primeiro carregamento; nenhum asset isolado > 600 KB. Verificado
por teste (§9.3), não por estimativa.

---

## 5. P7 — Segurança

### 5.1 A decisão: nonce via middleware

> **Correção de 2026-09-01.** A versão anterior desta seção decidia por "zero scripts
> inline, logo `script-src 'self'` sem nonce". **A premissa era falsa.** O runtime do
> App Router do Next emite scripts inline `self.__next_f.push(...)` no HTML servido
> para transmitir o payload RSC — verificado no build deste projeto. Eles não são
> removíveis sem desligar o streaming de RSC. Sob `script-src 'self'` sem
> `unsafe-inline` e sem nonce, seriam bloqueados e a hidratação quebraria.

Restam duas configurações possíveis, e elas são excludentes:

| | CSP forte | Cache de CDN no HTML |
|---|---|---|
| **A — nonce via middleware** | sim | não |
| **B — `'unsafe-inline'`** | não | sim |

O motivo de serem excludentes: um nonce em página cacheada publicamente é um nonce
público. O atacante lê o HTML, lê o nonce, usa o nonce. Cachear HTML com nonce é
teatro de segurança, não segurança.

**Escolha: A.** É o que o briefing original pediu literalmente no §4.7
(`Content-Security-Policy (nonce, sem unsafe-inline)`), e é o caminho suportado
pelo Next: quando o middleware põe `'nonce-<valor>'` no header de CSP, o Next
propaga esse nonce para os próprios scripts inline dele.

Consequências assumidas:

- As páginas passam a ser renderizadas dinamicamente. O TTFB deixa de ser os 39 ms
  do HTML estático em CDN e passa a depender da origem.
- **O item de cache de CDN do P13 não é entregue para HTML.** `stale-while-revalidate`
  fica valendo para o que pode ser cacheado sem nonce: assets de `/_next/static`
  (já imutáveis), `/feed.xml`, `/sitemap.xml`, `/robots.txt` e o conteúdo de
  `/assets`. Isso é uma meta do briefing não atingida, e está registrado como tal.
- O LCP alvo (≤1,8 s) não é ameaçado por um TTFB de origem na casa dos 100 ms.

Os arquivos de mesma origem continuam existindo e continuam valendo a pena, agora
por higiene e não por necessidade de CSP:

- Bootstrap de tema e reveal → `public/bootstrap.js`
- Inicialização de GA4, Clarity e Meta Pixel → `public/vendor/*.js`
- JSON-LD permanece inline: `type="application/ld+json"` não é executável e não é
  governado por `script-src`

Quanto menos inline próprio, menor a superfície que depende do nonce.

### 5.2 Política

```
default-src 'self';
script-src 'self' 'nonce-<gerado por requisição>' 'strict-dynamic'
           https://www.googletagmanager.com https://connect.facebook.net
           https://www.clarity.ms https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://www.google-analytics.com https://www.facebook.com
        https://*.clarity.ms https://maps.gstatic.com https://*.googleapis.com;
font-src 'self' data:;
connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com
            https://*.googletagmanager.com https://*.clarity.ms
            https://webhook.licitacaogc.com.br https://va.vercel-scripts.com;
frame-src https://www.google.com https://maps.google.com;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
upgrade-insecure-requests
```

**`style-src 'unsafe-inline'` é mantido conscientemente.** O Next injeta estilos
inline para `next/font` e para o `<style>` crítico do App Router; removê-lo exigiria
hash por resposta, reintroduzindo o problema do nonce. É uma permissão de risco
muito menor que a equivalente em `script-src`, e está documentada aqui como decisão,
não como descuido.

`connect-src` inclui `webhook.licitacaogc.com.br` porque
`components/diagnostico-form.tsx` posta nele hoje. Sai quando o Sprint 2 mover o
envio para uma Server Action.

### 5.3 Demais headers

| Header | Valor |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

`/keystatic` e `/api/keystatic` recebem uma política relaxada em rota própria — o
CMS usa recursos que o CSP do site quebraria. Só o site público carrega a política
estrita.

### 5.4 Cache (P13) — parcialmente não entregue

A escolha do §5.1 (nonce por requisição) **exclui** cache público de HTML: uma página
cacheada carrega um nonce cacheado, que qualquer visitante lê. O item "HTML sem cache
de CDN" do P13 fica, portanto, **não atendido para HTML**, por decisão consciente, em
favor do P7.

`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` é aplicado ao que
pode ser cacheado sem nonce:

- `/feed.xml`, `/sitemap.xml`, `/robots.txt`
- `/assets/**` (imagens, vídeo, logos)
- `/bootstrap.js` e `/vendor/*.js`

Assets versionados de `/_next/static` já vêm imutáveis do Next.

Se, na verificação final, o TTFB dinâmico se mostrar ruim a ponto de ameaçar o LCP
alvo, a decisão do §5.1 deve ser reaberta com o número em mãos — não antes.

---

## 6. P6 — Medição com consentimento

### 6.1 Ordem obrigatória

Nenhum script de analytics carrega antes do consentimento. Google Consent Mode v2
inicia com todos os sinais em `denied`; o `consent update` só dispara depois da
escolha do usuário.

### 6.2 Banner

Três categorias: **necessários** (sempre ativos, sem toggle), **analytics**,
**marketing**. "Recusar tudo" e "Aceitar tudo" com peso visual idêntico — mesmo
componente de botão, mesmo tamanho, mesmo contraste. Sem dark pattern. Link para
`/politica-de-privacidade`. Escolha persistida em
`localStorage['dsa-consent'] = {v:1, analytics:bool, marketing:bool, ts:number}`.
Reabrível por link no rodapé.

### 6.3 Módulo

`lib/analytics.ts` expõe uma função `track(name, params)` tipada por união literal.
Fora de consentimento, `track` é no-op silencioso. Cada provedor é `env`-gated
(`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) e
desaparece se a variável não existir — mesmo padrão já correto em
`components/meta-pixel.tsx`.

### 6.4 Eventos nesta sprint

Os que têm superfície existente:

| Evento | Parâmetros | Onde |
|--------|-----------|------|
| `view_area_page` | `area` | `/areas/[slug]` |
| `cta_click` | `origem`, `destino` | todos os `.btn` de CTA |
| `whatsapp_click` | `origem` | float + links |
| `phone_click` / `email_click` | `origem` | rodapé, `/contato` |
| `material_download` | `slug` | `/modelos/[slug]` |
| `article_read_75pct` | `slug` | `/blog/[slug]` |
| `form_start` | — | `diagnostico-form` |
| `generate_lead` | `frente`, `tem_prazo` | `diagnostico-form` |

`form_step_complete` e `form_abandon` chegam com o wizard (Sprint 2).

---

## 7. Template de área (§8.1)

Estender o schema Keystatic de `areas` com os blocos ausentes, **todos opcionais**,
para que as 14 áreas continuem renderizando enquanto o conteúdo é preenchido:

- `deadlines` — array `{ label, prazo, base legal }`. É a seção "O prazo", o ativo
  único do site e a expressão direta do posicionamento.
- `decisive` — array `{ title, body }` para "O que costuma decidir o caso"
- `relatedPosts` — derivado automaticamente de `areaKey` nos posts, sem campo novo

Estrutura de renderização em 9 partes conforme §8.1. O que já existe (`heroTitle`,
`lead`, `intro`, `achieves`, `notice`, `faq`, `ctaTitle`) é reaproveitado, não
reescrito. Seções sem conteúdo simplesmente não renderizam.

Schema `FAQPage` adicionado onde `faq` estiver preenchido.

---

## 8. Acabamento

### 8.1 P8 — Grid de cards

```css
.area-card {
  display: grid;
  grid-template-rows: auto auto 1fr auto; /* ícone · título · descrição · link */
}
.area-card h3 { min-height: 2lh; }
.area-card .card-icon { width: 48px; height: 48px; flex: none; }
```

Hover: borda escurece, fundo muda ~2%, `translateY(-2px)`, 160 ms. Sombra sai —
a borda é o separador padrão do sistema (§3.3 do briefing). Ícones passam a Lucide,
stroke 1.5, 24px dentro do círculo de 48px.

### 8.2 P9 — Colunas vazias

Componente `<HeroAside>`: cartão de contexto na coluna direita dos heroes internos,
com a pergunta de urgência ("Prazo em curso?"), CTA de WhatsApp contextual e
resumo da página. Aplicado a `/areas`, `/diagnostico`, `/contato`, `/modelos`.

Regra estrutural: nenhuma seção pode ter coluna vazia ocupando ≥40% da largura em
desktop. Onde não houver conteúdo para a coluna, o layout colapsa para coluna única
centralizada com `max-width: 68ch`.

### 8.3 P11 — Mapa

`<MapEmbed>`: skeleton com `aspect-ratio` fixo (CLS zero), iframe carregado sob
clique em "Ver no mapa", link alternativo para o Google Maps sempre presente e
funcional sem JS.

### 8.4 P12 — Logo

**Limite honesto:** não é possível vetorizar o PNG com fidelidade. Nesta entrega o
logo é servido a 2× do tamanho de exibição (266×92 em vez de 1151×399), corrigindo
o superdimensionamento de 4×. O SVG fica pendente do arquivo vetorial original —
registrado em §11 como dependência do cliente.

### 8.5 P10 — Imagens

As 6 fotos existentes passam por `next/image` com `srcset`, `sizes`, AVIF/WebP e
dimensões explícitas. Grafismos de apoio para as colunas e fundos são **SVG/CSS
gerados no próprio código** — sem pessoas, sem ambientes, sem peso de rede e sem
risco de licença.

Não serão geradas por IA imagens de retrato ou de ambiente do escritório. O próprio
briefing define essas fotos como "prova de existência física"; uma imagem sintética
apresentada como o escritório real seria exatamente a afirmação falsa que a seção
existe para evitar. O ensaio real é dependência do cliente (§11).

### 8.6 P13 — Plataforma

- `app/manifest.ts` → `manifest.json` com ícones maskable
- `app/feed.xml/route.ts` → feed Atom do blog com `lastmod` real
- `app/not-found.tsx` e `app/error.tsx` desenhadas, dentro do design system
- Dark mode (§2.2), com toggle no header e persistência

---

## 9. Verificação

### 9.1 Ferramentas

Vitest (unidades), Playwright (E2E), `@axe-core/playwright` (a11y no CI).

### 9.2 Unidades

- `lib/analytics.ts` — `track` é no-op sem consentimento; com consentimento, monta o
  payload esperado pelo GA4 e não perde parâmetros
- `lib/consent.ts` — serialização, migração de versão, ausência de `localStorage`
- `lib/csp.ts` — a política gerada contém todas as diretivas e **não** contém
  `unsafe-inline` em `script-src`
- contraste — os pares texto/superfície declarados atingem os alvos de §2.3

### 9.3 E2E

| Teste | Critério do briefing |
|-------|---------------------|
| `/areas` com JS desabilitado exibe 14 cards | §11, critério 1 |
| Nenhum `.reveal` com `opacity: 0` após 400 ms no viewport | §11, critério 2 |
| Home ≤ 900 KB; nenhum asset > 600 KB | §11, critério 3 |
| Os 7 headers presentes na resposta | §11, critério 8 |
| Navegação completa por teclado sem mouse | §11, critério 7 |
| `axe-core` sem violação séria ou crítica | §11, critério 6 |
| Dark mode consistente nas rotas principais | §11, critério 12 |
| Avisos OAB presentes em todas as páginas | §11, critério 14 |

### 9.4 Manual

Lighthouse mobile ≥95 nas 4 categorias; LCP ≤1,8 s, INP ≤150 ms, CLS ≤0,05 em 4G
throttled. Medido e reportado com o número real — não afirmado.

---

## 10. Não-regressão

O critério "sem regressão de conteúdo: toda a copy atual preservada ou melhorada" é
verificado por diff explícito. Nenhum texto institucional, aviso legal, `metaTitle`,
`metaDescription` ou conteúdo `.mdoc` é alterado nesta entrega, salvo os campos
novos e opcionais do §7. Os avisos do Provimento CFOAB 205/2021 no rodapé permanecem
literalmente intactos.

---

## 11. Dependências do cliente

Itens que não podem ser concluídos sem o Douglas:

1. **Arquivo vetorial do logo** (`.ai`, `.eps` ou `.svg`) — destrava o P12 completo
2. **Confirmação do endereço de São Paulo** — o schema receberá `PostalAddress` com
   a Av. Brigadeiro Faria Lima, 1768. Um endereço não ocupado no schema é pior que
   nenhum endereço, e afeta E-E-A-T
3. **Alinhamento do telefone** — o DDD 67 (MS) contradiz a praça declarada de São
   Paulo em três sinais do site
4. **Números de prova social** — anos, casos, liminares, tribunais (Sprint 2)
5. **Ensaio fotográfico real** — retrato, contexto de trabalho, ambiente (Sprint 5)
6. **Chaves de ambiente** — `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`. Sem elas o
   código funciona e não carrega nada; a medição só começa quando forem definidas
