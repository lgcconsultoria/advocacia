# Douglas Senturião Advocacia — site institucional

Site institucional de escritório-boutique de Direito Administrativo, reconstruído
sobre o stack premium de 2026: **Next.js 16 (App Router) + React 19 + Tailwind
CSS v4**, com **Motion** e **Lenis** para o movimento discreto, **Radix UI** para
componentes acessíveis e **Keystatic** como CMS headless git-based.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC) + React 19 |
| Estilo | Tailwind CSS v4 + design system em `app/globals.css` (tokens da marca) |
| Tipografia | Archivo (display) + Inter (corpo), via Google Fonts |
| Animação | Motion (`motion/react`) para revelações ao rolar |
| Scroll suave | Lenis (headless, desligado sob `prefers-reduced-motion`) |
| Componentes acessíveis | Radix UI (Accordion no FAQ) |
| CMS | Keystatic (git-based, admin em `/keystatic`) |
| Conteúdo | Markdoc + YAML em `content/` |

Todas as animações respeitam `prefers-reduced-motion`; o scroll suave é
desativado por completo para quem tem sensibilidade a movimento.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

- Site: `http://localhost:3000`
- CMS (edição de conteúdo): `http://localhost:3000/keystatic`

Build de produção:

```bash
npm run build
npm start
```

## Editar conteúdo (CMS)

O conteúdo vive em arquivos versionados, editáveis pela interface do Keystatic
em `/keystatic` (ou direto nos arquivos):

- **Áreas de atuação** — `content/areas/*.mdoc`
- **Artigos do blog** — `content/posts/*.mdoc`
- **Configurações do site** (contato, OAB, WhatsApp) — `content/settings/index.yaml`

No modo local (padrão), a edição pela interface funciona em `npm run dev` e grava
diretamente nos arquivos. Para editar em produção (Vercel), troque o `storage`
em `keystatic.config.ts` para `{ kind: 'github', repo: '...' }` e configure o app
do GitHub conforme a documentação do Keystatic.

## Estrutura

```
app/
├── (site)/            Páginas públicas (layout com header/footer/WhatsApp/Lenis)
│   ├── page.tsx       Home
│   ├── areas/         Índice + [slug] (data-driven)
│   ├── blog/          Índice + [slug] (artigos em Markdoc)
│   ├── diagnostico/   Formulário com ACK persistido pelo Senturião OS
│   ├── sobre/ contato/ politica-de-privacidade/ aviso-publicidade/
├── keystatic/         Admin do CMS
├── api/keystatic/     Route handler do CMS
├── layout.tsx         Root (fontes, metadata, viewport)
├── sitemap.ts robots.ts
components/            Header, Footer, Reveal, SmoothScroll, FaqAccordion, ...
lib/                   reader (Keystatic) + renderizador Markdoc
content/               Conteúdo (áreas, posts, settings)
public/assets/img/     Logos, fotos, favicon, og-image
```

## SEO

Metadata por página (API `metadata`), dados estruturados JSON-LD
(`LegalService`, `Attorney`, `FAQPage`, `Article`, `BreadcrumbList`),
`sitemap.xml` e `robots.txt` gerados dinamicamente.

## Deploy

Otimizado para **Vercel**: `git push` conectado ao projeto, sem configuração
extra. Alternativamente, qualquer host que rode Next.js.
