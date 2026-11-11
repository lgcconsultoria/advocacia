# 01 — Descoberta (Fase 1) — LLM SEO / GEO

Site: Douglas Senturião Advocacia (https://www.senturiaoadv.com.br) · Worktree `advocacia-llm-seo`, branch `llm-seo` (base `origin/claude/law-firm-website-Kdo2d`, que já contém a branch `seo-medicao-2026-10`).
Data da descoberta: 27/10/2026.
Método: leitura do código (`app/`, `lib/`, `components/`, `content/`, `GUIA-DO-SITE.md`, `README.md`) e conferência do que está **no ar** por `curl` (HTML bruto, sem JavaScript) com os user-agents GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended e Googlebot. Nada foi alterado no site.

> Aviso: o `GUIA-DO-SITE.md` está desatualizado (fala em 5 posts e 13 áreas; hoje são 15 posts e 14 áreas; sugere palavras-chave "florianópolis" e "direito administrativo" enquanto a home foi reposicionada em 16/10/2026 para Tributário + Licitações). Vale o código e o site no ar.

---

## 1. Stack e renderização

### 1.1 Stack

| Camada | Situação |
| --- | --- |
| Framework | Next.js `^16.2.9` (App Router, RSC) + React `^19.2.7`; TypeScript 6 |
| Estilo | Tailwind v4 + design system em `app/globals.css` |
| Animação | Motion (`components/reveal.tsx`) e Lenis; desligados sob `prefers-reduced-motion` |
| CMS | Keystatic em modo `storage: { kind: 'local' }` (`keystatic.config.ts`), conteúdo em `content/areas/*.mdoc`, `content/posts/*.mdoc`, `content/settings/index.yaml`; leitura por `createReader` (`lib/reader.ts`) no servidor, Markdoc renderizado em `lib/markdoc.tsx` |
| Deploy | Vercel (`vercel.json`: `next build`, `npm ci`). `X-Vercel-Cache: HIT` nas páginas conferidas |
| Dados externos | PNCP (termômetro de licitações, `lib/pncp/*`, ISR + snapshot de reserva); catálogo de modelos vem de `https://senturiao-os.vercel.app/api/modelos` (`lib/modelos.ts`) |
| Testes | `node --test "lib/**/*.test.mts"` (só `lib/contato`) |

`node_modules` não existe no worktree: não houve `next build`. A renderização abaixo foi deduzida do código e **confirmada no HTML servido em produção**.

### 1.2 Como cada rota é renderizada

| Rota | Modo | Conteúdo principal no HTML sem JS? |
| --- | --- | --- |
| `/`, `/sobre`, `/areas`, `/contato`, `/diagnostico`, `/blog`, `/tributario`, páginas legais | Estática (SSG); dados do Keystatic lidos em build | Sim (home: ~11,6 mil caracteres de texto visível; `/tributario`: ~19,9 mil) |
| `/areas/[slug]` (`generateStaticParams`) | SSG | Sim, **exceto as respostas do FAQ** (ver 1.3) |
| `/blog/[slug]` (`generateStaticParams`) | SSG | Sim (artigo inteiro em Markdoc renderizado no servidor, índice "Neste artigo", data em `<time>`, autor) |
| `/licitacoes` | ISR, `export const revalidate = 120`; números do PNCP montados no servidor (`dados.ts`, com `unstable_cache` e snapshot de reserva) | Sim (~13,5 mil caracteres); termômetro vem com valor inicial do servidor e depois atualiza no navegador |
| `/licitacoes/[dor]` (`dynamicParams = false` + `generateStaticParams`, 4 páginas: `fui-inabilitado`, `desclassificada-no-pregao`, `recurso-administrativo`, `impugnacao-de-edital`) | SSG; textos em `lib/licitacoes/dores.ts` | Sim, exceto respostas do FAQ |
| `/licitacoes/mandado-de-seguranca` | SSG; textos em `conteudo.ts` | Sim, exceto respostas do FAQ |
| `/modelos`, `/modelos/[slug]` | ISR (`revalidate = 300`), catálogo vem de API externa | Sim (se a API responder; ver riscos) |
| `/api/pncp/{termometro,serie,uf}` | Route handlers dinâmicos (JSON) | Não é página |
| `/api/keystatic/*`, `/keystatic` | Admin do CMS | Não indexável por regra, ver 3.1 |
| `app/clientes/[codigo]` | Route handler: HTML cifrado com tela de senha, `X-Robots-Tag: noindex, nofollow, noarchive` | Irrelevante (proposta privada) |
| `app/(app)`: `/entrar`, `/sistema`, `/cliente` e `/*/demo/*` | Portal demo, `'use client'` em quase tudo, `robots: noindex, nofollow` no layout | Irrelevante (fora do escopo) |
| `app/not-found.tsx` | 404 | `/llms.txt` hoje cai aqui |

### 1.3 Verificação de dependência de JavaScript

- Todas as páginas públicas respondem **200 com texto completo no HTML** para GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended e Googlebot (conferido em `/licitacoes/impugnacao-de-edital`). Não há bloqueio por user-agent, nem desafio de bot, nem `X-Robots-Tag` nas páginas públicas.
- `ssr: false` aparece só em `components/licitacoes/mapa-ufs.tsx` (globo) e `um-ano.tsx` (skyline), ambos gráficos decorativos carregados sob demanda (`SobDemanda`). Nenhum texto jurídico depende disso.
- `'use client'` está em ~70 arquivos, mas componentes cliente do Next também são renderizados no servidor. O que importa:
  - **`components/faq-accordion.tsx` (Radix Accordion): QUEBRADO PARA IAs.** O Radix só monta o conteúdo do item aberto. No HTML servido, cada resposta fecha em `<div data-state="closed" hidden role="region"></div>` **vazio**. Conferido em `/areas/concursos`: as 4 respostas não estão no HTML visível. Elas só existem no JSON-LD `FAQPage`. Isso afeta todas as páginas com FAQ: 13 áreas, `/licitacoes`, as 4 páginas de dor, `/licitacoes/mandado-de-seguranca` e `/tributario`. É onde está a maior parte das respostas diretas e com base legal do site.
  - `components/reveal.tsx` (Motion): o HTML sai com `opacity:0` inicial até entrar na tela. O texto está no HTML, então leitores de texto bruto o veem; ferramentas que renderizam e filtram por visibilidade podem tratá-lo como oculto. Risco menor.
  - `components/blog-list.tsx` (filtro por área): a lista completa de cards é renderizada no servidor (filtro "Todos" por padrão). OK.
  - `components/ver-conteudo.tsx`, `medicao.tsx`, `whatsapp-float.tsx`: só medição/UX, sem conteúdo.

---

## 2. Páginas e rotas

Sitemap no ar: **49 URLs**. Inventário completo (com o arquivo-fonte do conteúdo):

### 2.1 Institucionais e de serviço

| URL | Fonte | Observação |
| --- | --- | --- |
| `/` | `app/(site)/page.tsx` | Posicionamento atual (16/10/2026): "Tributário e Licitações para Empresas"; 4 frentes (tributo, licitações/contratos, ato administrativo, direito público) |
| `/sobre` | `app/(site)/sobre/page.tsx` | "Escritório-boutique com raiz no Direito Administrativo"; advogado responsável, OAB/SC 73.764 |
| `/areas` | `app/(site)/areas/page.tsx` | Índice: Direito Público + Contencioso Cível e Empresarial |
| `/licitacoes` | `app/(site)/licitacoes/page.tsx` | **Departamento de Licitações e Contratos Públicos** (a antiga LGC); termômetro PNCP, 5 situações, formas de atuação, FAQ de 6 perguntas |
| `/tributario` | `app/(site)/tributario/page.tsx` | Reforma Tributária (IBS/CBS, LC 214/2025), simulador; fora do foco desta fase |
| `/blog` | `app/(site)/blog/page.tsx` | Índice dos 15 artigos |
| `/modelos`, `/modelos/[slug]` (5) | `app/(site)/modelos/*`, API externa | Modelos editáveis gratuitos (recurso administrativo, MS em desclassificação, reequilíbrio, 2 de reforma tributária) |
| `/diagnostico`, `/contato` | `app/(site)/*` | Conversão |
| `/politica-de-privacidade`, `/exclusao-de-dados`, `/aviso-publicidade` | `app/(site)/*` | Legais/éticas |

### 2.2 Páginas por situação de licitação (`/licitacoes/*`)

| URL | Fonte | FAQ |
| --- | --- | --- |
| `/licitacoes/fui-inabilitado` | `lib/licitacoes/dores.ts` | 5 |
| `/licitacoes/desclassificada-no-pregao` | `lib/licitacoes/dores.ts` | 4 |
| `/licitacoes/recurso-administrativo` | `lib/licitacoes/dores.ts` | 4 |
| `/licitacoes/impugnacao-de-edital` | `lib/licitacoes/dores.ts` | 4 |
| `/licitacoes/mandado-de-seguranca` | `app/(site)/licitacoes/mandado-de-seguranca/conteudo.ts` | 7 |

Os textos de `dores.ts` foram validados em 21/10/2026 (comentário de cabeçalho do arquivo, **não exposto na página**) e vieram das páginas da LGC.

### 2.3 Áreas (`/areas/[slug]`, `content/areas/*.mdoc`, 4 perguntas de FAQ cada)

Direito Público: `mandado-de-seguranca`, `contratos-publicos`, `concursos`, `servidores`, `defesa-agentes`, `habeas-data`, `execucoes`.
Contencioso Cível e Empresarial: `familia`, `violencia-domestica`, `dividas-e-obrigacoes`, `empresarial`, `crimes-licitatorios`.
`licitacoes` e `tributario` existem como `.mdoc`, mas `/areas/licitacoes` e `/areas/tributario` fazem **301** para `/licitacoes` e `/tributario` (`next.config.mjs`) e saem do sitemap.

### 2.4 Artigos (`/blog/[slug]`, `content/posts/*.mdoc`, 15)

Foco administrativo/licitações (7): `impugnacao-ao-edital-prazos-e-estrategia`, `mandado-de-seguranca-analise-de-cabimento`, `reequilibrio-economico-financeiro-14133`, `processo-administrativo-disciplinar-defesa`, `eliminacao-concurso-controle-judicial` (todos de 20/05/2026) e `crimes-licitatorios-lei-14133`, `intimacao-investigacao-licitacao-primeiros-passos` (03/07/2026).
Cível/família/empresarial (8, 03/07/2026): cheque prescrito, dissolução parcial, execução de título, guarda compartilhada, inadimplemento contratual, medidas protetivas, pensão alimentícia, violência patrimonial e psicológica.

### 2.5 Redirecionamentos e hosts

- `licitacaogc.com.br` e `www.licitacaogc.com.br` → **301** para `https://www.senturiaoadv.com.br/licitacoes` (qualquer caminho vai para a mesma URL).
- `senturiaoadv.com.br` → 308 para `www`.
- `proposta.senturiaoadv.com.br/<nome>` → reescreve para `/clientes/<código>` (páginas privadas cifradas).

### 2.6 Links internos

- Header/Footer (`components/site-header.tsx`, `site-footer.tsx`) listam todas as áreas.
- `/licitacoes` liga as 4 páginas de dor + MS, e o componente `Frentes` liga áreas e artigos por frente (impugnação → post de impugnação; MS → post de cabimento; contratos → post de reequilíbrio).
- Páginas de dor têm bloco "Outras situações" e ligam de volta a `/licitacoes`.
- **Corpo dos artigos e das áreas: zero links internos** (nenhum `](/...)` em `content/posts` ou `content/areas`). O artigo não liga para a página de dor correspondente, nem para a área, nem para outros artigos; o rodapé do artigo só tem "Todos os artigos" e CTA. Não há "artigos relacionados".
- Os artigos de 20/05/2026 sobre licitações (`impugnacao...`) não citam artigo de lei no texto (0 ocorrências de "art."), enquanto as páginas de dor citam arts. 164 a 168 da Lei 14.133/2021.

---

## 3. Estado atual de robots, sitemap, metadados, JSON-LD e llms.txt

### 3.1 robots.txt (`app/robots.ts`, conferido no ar)

```
User-Agent: *
Allow: /
Disallow: /keystatic
Disallow: /api/
Disallow: /clientes/
Disallow: /entrar
Disallow: /sistema
Disallow: /cliente
Host: https://www.senturiaoadv.com.br
Sitemap: https://www.senturiaoadv.com.br/sitemap.xml
```

| Bot | Situação hoje |
| --- | --- |
| GPTBot (treino OpenAI) | Permitido implicitamente (herda `*`). Sem regra própria |
| OAI-SearchBot (busca ChatGPT) | Permitido implicitamente |
| ChatGPT-User | Permitido implicitamente |
| ClaudeBot / Claude-SearchBot / Claude-User | Permitido implicitamente |
| PerplexityBot / Perplexity-User | Permitido implicitamente |
| Google-Extended (Gemini/treino) | Permitido implicitamente |
| Bingbot, Applebot-Extended, CCBot, etc. | Permitido implicitamente |

Ou seja, **nenhum bot de IA está bloqueado e nenhum está declarado**. A diretiva `Host:` é legado do Yandex e não tem efeito no Google. `Disallow: /cliente` bloqueia também qualquer URL futura que comece com `/cliente`. `/keystatic` responde 200 em produção com `<meta name="robots" content="index, follow">` herdado do layout raiz (protegido só pelo `robots.txt`). A decisão sobre treino (GPTBot, Google-Extended, CCBot) versus busca/citação (OAI-SearchBot, Claude-SearchBot, PerplexityBot) é do Douglas: TODO.

### 3.2 sitemap.xml (`app/sitemap.ts`, 49 URLs)

- Dinâmico a partir do Keystatic e do catálogo de modelos; `lastmod` real por página (tabela manual `ATUALIZADO_EM` em `lib/seo.ts`; para posts usa `updatedDate ?? publishedDate`; áreas fixas em `AREAS_ATUALIZADAS_EM = 2026-09-01`; modelos fixos em `2026-10-07`).
- Prioridades: home 1; `/tributario` e `/licitacoes*` 0,9; modelos 0,9; áreas 0,8; posts 0,6.
- Exclui `/areas/licitacoes` e `/areas/tributario` (redirecionadas). Não lista `/clientes`, `/entrar`, `/sistema`.
- Fragilidade: se a API `senturiao-os` falhar, `getModelos()` devolve `[]` em silêncio e os 5 modelos somem do sitemap e das páginas até o próximo ISR.

### 3.3 Metadados, canonical e Open Graph

- `app/layout.tsx`: `metadataBase`, `title.template = '%s — Douglas Senturião Advocacia'`, descrição padrão, `robots: index, follow`, `lang="pt-BR"`, ícones, verificação do Search Console por variável de ambiente.
- Cada página define `title`, `description`, `alternates.canonical` (relativo, resolvido pelo `metadataBase`) e usa `metaSocial()` (`lib/seo.ts`) para `openGraph` (type `website` ou `article` com `published_time`/`modified_time`) e `twitter: summary_large_image`. Conferido no HTML de home, áreas, dores, MS, posts, blog e modelos.
- **Todas as páginas usam a mesma imagem OG** (`/assets/img/og-image.png`) com alt "Douglas Senturião Advocacia — Direito Tributário e Público para empresas".
- Inconsistências de posicionamento no que as máquinas leem:
  - Título padrão do layout: "Tributário e Licitações"; `/areas`: "Direito Administrativo e Contencioso"; `/sobre`: "raiz no Direito Administrativo"; artigos: "Advogado dedicado ao Direito Administrativo".
  - `lib/schema.ts` `TEMAS` lista Tributário e Reforma Tributária primeiro, e só depois licitações e direito administrativo.
- Os títulos das páginas de dor são orientados à consulta (ex.: "Impugnação de edital: prazo (até 3 dias úteis antes da abertura) e como fazer"), o que é bom para citação.

### 3.4 JSON-LD existente (conferido no HTML no ar)

| Página | Tipos |
| --- | --- |
| `/` | `LegalService` + `Attorney` (`@id` `/#escritorio`; endereço, telefone, e-mail, `areaServed`, `knowsAbout`, `sameAs`, `priceRange: "$$"`), `Person` (`@id` `/sobre#douglas-senturiao`, com credencial OAB e `worksFor`) |
| `/sobre` | `Person` |
| `/areas/[slug]` | `BreadcrumbList` + `FAQPage` |
| `/licitacoes` | `Service` (com `OfferCatalog`, `BusinessAudience`, `provider` → `LegalService`) + `FAQPage` + `BreadcrumbList` |
| `/licitacoes/{dor}` e `/licitacoes/mandado-de-seguranca` | `BreadcrumbList` + `FAQPage` |
| `/tributario` | `Service` + `FAQPage` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` (headline, description, `datePublished`, `dateModified`, `author` Person com `@id` e `sameAs`, `publisher` Organization com logo, `inLanguage`) + `BreadcrumbList` |
| `/modelos/[slug]` | `HowTo` |
| `/areas`, `/blog`, `/contato`, `/diagnostico`, `/modelos` | **nenhum** (sem `CollectionPage`/`ItemList`/`ContactPage`) |

Pontos fortes: `@id`s ligando escritório, pessoa e artigos; FAQ estruturado em quase todas as páginas de serviço; OAB como credencial.
Lacunas: `Article.image` é sempre a OG genérica; nenhum `Article` tem `updatedDate`/revisão (`dateModified` = `datePublished`); `Service` só em `/licitacoes` e `/tributario` (as áreas não têm `Service`); sem `WebSite`/`Organization` global com `alternateName`; páginas de dor e de área **não têm autor nem data no JSON-LD nem na tela**.

### 3.5 llms.txt

**Não existe.** `/llms.txt` e `/llms-full.txt` respondem **404** (caem em `not-found.tsx`). Não há arquivo em `public/` nem rota em `app/`.

### 3.6 Autor e data nos posts

- Tela: linha "Análise técnica · tempo de leitura · `<time dateTime>` · Douglas Senturião" e cartão do autor no fim (foto, nome, `OAB/SC nº 73.764`, minibio).
- Dados: `publishedDate` obrigatório; `updatedDate` existe no schema do Keystatic, mas **nenhum dos 15 posts o preenche**. Só há duas datas de publicação: `2026-05-20` (5 posts) e `2026-07-03` (10 posts).
- Cada post tem aviso ético padronizado, CTA "Enviar caso para análise" e índice interno por âncoras.

### 3.7 SEO prévio (branch `seo-medicao-2026-10`, já incorporada à base)

Entregue: sitemap com `lastmod` e sem áreas redirecionadas; redirects 301 explícitos para a canibalização `/areas/licitacoes` e `/areas/tributario`; favicon; LCP (H1 visível, menos bytes antes do LCP, globo/skyline sob demanda); pixel de medição e consentimento (`lib/medicao.ts`, `lib/consentimento.ts`); páginas por dor em `/licitacoes/*`. A medição (Pixel) e o Search Console (variável `GOOGLE_SITE_VERIFICATION`) já têm gancho. Não há nenhum trabalho prévio voltado a IA (llms.txt, política de bots, FAQ visível).

---

## 4. O negócio (só o que está escrito no site)

**Quem é.** Douglas Senturião Advocacia, "escritório-boutique" com "raiz no Direito Administrativo", sede em São Paulo/SP (Av. Brigadeiro Faria Lima, 1768, CEP 01451-001), atuação "em todo o Brasil, de forma presencial ou remota". Advogado responsável: Douglas Senturião, OAB/SC nº 73.764. Contato: WhatsApp (67) 99167-5629, douglas@senturiaoadv.com.br, Instagram @douglassadvogado. Descrição na home: "Há mais de dez anos dedicado ao direito público, com atuação concentrada em licitações e contratos administrativos". Lema: "Tese antes da peça, prazo antes de tudo."

**Posicionamento vigente (home, desde 16/10/2026).** "Advocacia para empresas em Direito Tributário e Direito Público: Reforma Tributária, licitações e contratos públicos." Quatro frentes "para quem fatura, licita e contrata". O Departamento de Licitações e Contratos Públicos é a continuação da antiga LGC Consultoria: `licitacaogc.com.br` redireciona para `/licitacoes`. **O site público não menciona a LGC em nenhum texto** (só um comentário em `lib/licitacoes/dores.ts`).

**O que faz.**
- Direito Público: mandado de segurança; licitações; contratos públicos (reequilíbrio, sanções, aditivos, rescisão); concursos (eliminação, preterição, nomeação); servidores (PAD, posse, carreira); defesa de agentes públicos (improbidade, TCU/TCE, CGU); habeas data; execuções contra a Fazenda (precatório, RPV).
- Contencioso cível e empresarial: família; violência doméstica (Maria da Penha); dívidas e obrigações; empresarial/societário; crimes licitatórios (arts. 337-E a 337-P do CP).
- Tributário: Reforma Tributária (IBS/CBS, LC 214/2025), Simples híbrido, split payment.
- Departamento de Licitações: análise de edital e matriz de riscos, habilitação, impugnações, suporte na sessão, recursos e contrarrazões, mandado de segurança, contratos, reequilíbrio (inclusive IBS/CBS) e defesa em sanções. Três formas de atuação: contínuo (departamento jurídico mensal), pontual (por certame) e contencioso.

**Para quem (texto de `/sobre`).** Empresas com contratos administrativos; licitantes em disputa; servidores em PAD ou prestes a tomar posse; agentes públicos perante TCU/TCE/CGU; cidadãos e empresas com direito líquido e certo violado; e também famílias (divórcio, guarda, alimentos), pessoas em violência doméstica, credores e devedores, sócios e empresas.

**Diferenciais declarados (sem comparar com outros escritórios).** Atendimento direto com o advogado responsável; diagnóstico por escrito antes de qualquer proposta; retorno "em até 1 dia útil"; peças redigidas do zero, "sem modelos prontos"; plano processual escrito; escopo e honorários definidos por escrito depois do diagnóstico; "um mesmo time do edital ao contrato"; **termômetro ao vivo das contratações do PNCP** (dado próprio e atualizado, raro em site de escritório); modelos editáveis gratuitos; cada página de dor traz prazo legal, passos, ressalva honesta e FAQ com base legal. O tom é consistentemente informativo e sem promessa de resultado (aviso ético no rodapé, "Aviso de Publicidade", triagem "sem mandato").

**Público das perguntas de IA.** Prioridade: (1) empresa licitante/contratada (decisor jurídico, comercial ou financeiro); (2) concurseiro; (3) servidor; (4) agente público investigado; (5) cidadão/família (fora do foco desta fase).

**Inconsistências a esclarecer com o Douglas (TODO).**
- `/licitacoes` e o cartão do autor falam em "os advogados do Departamento" no plural, enquanto o site identifica um único advogado responsável. TODO: confirmar equipe e se há outros advogados que possam ser nomeados.
- OAB/SC com sede em São Paulo e telefone com DDD 67: coerente para quem conhece a história, mas pode confundir a entidade para um modelo de IA. TODO: decidir se vale uma frase explicativa (inscrição suplementar em SP? TODO confirmar; **não inventar**).
- "Há mais de dez anos": TODO confirmar o dado e a data de início (para `foundingDate`/`Person` e para o E-E-A-T).
- Posicionamento: a home diz Tributário + Licitações; o GUIA e `/sobre` dizem Direito Administrativo. TODO: o Douglas define a frase única do escritório que as IAs devem repetir.

---

## 5. As 20 perguntas

Critério: perguntas informativas (como o cliente digitaria a uma IA), sem captação nem promessa. "Responde hoje" é o arquivo que contém a resposta. **Resposta no FAQ** significa que o texto existe, mas, pelo achado 1.3, **não está no HTML visível** (só no JSON-LD). "Artigo novo" = recomendação de conteúdo para a Fase 3, sujeita ao checklist ético do `GUIA-DO-SITE.md` (seção 9) e à revisão do advogado.

| # | Pergunta (como o cliente escreveria) | Intenção | Responde hoje | Cobertura | Artigo novo? |
| --- | --- | --- | --- | --- | --- |
| 1 | Qual o prazo para impugnar um edital de licitação na Lei 14.133 e quem pode impugnar? | Informacional | `lib/licitacoes/dores.ts` (slug `impugnacao-de-edital`, FAQ "prazo" e "quem pode impugnar"); `content/posts/impugnacao-ao-edital-prazos-e-estrategia.mdoc`; FAQ de `app/(site)/licitacoes/page.tsx` | Boa. Post sem citar o art. 164; respostas no FAQ não aparecem no HTML | Não (reforçar post com base legal e link para a página de dor) |
| 2 | Qual a diferença entre impugnação, pedido de esclarecimento e recurso administrativo em licitação? | Comparação | `content/posts/impugnacao-ao-edital-prazos-e-estrategia.mdoc` (seção "Impugnação, esclarecimento ou recurso") | Parcial: está como seção de um post de 682 palavras, sem tabela nem FAQ próprio | Não (virar bloco comparativo/FAQ no post e na página de dor) |
| 3 | Fui inabilitado em uma licitação, o que fazer e em quanto tempo posso recorrer? | Informacional (urgência) | `lib/licitacoes/dores.ts` (slug `fui-inabilitado`) → `/licitacoes/fui-inabilitado` | Boa (5 FAQs) | Não |
| 4 | Qual a diferença entre inabilitação e desclassificação na licitação? | Comparação | FAQ em `fui-inabilitado` e `desclassificada-no-pregao` (`dores.ts`) e em `licitacoes/mandado-de-seguranca/conteudo.ts` | Boa, mas repetida em 3 lugares, nenhuma é "a" página canônica | Não (consolidar numa seção citável) |
| 5 | Posso juntar documento que faltou depois da inabilitação ou na diligência (art. 64 da Lei 14.133)? | Informacional | FAQ "Posso juntar documento novo no recurso?" em `dores.ts` (`fui-inabilitado`); `Frentes` cita art. 64 | Parcial: uma resposta de FAQ, sem página nem artigo sobre saneamento de documentos de habilitação (atestado de capacidade técnica aparece em 1 só arquivo) | **Sim**: "Documento de habilitação faltando: diligência, saneamento e o que pode ser complementado" |
| 6 | Minha proposta foi desclassificada por preço inexequível, posso me defender? | Informacional | `lib/licitacoes/dores.ts` (slug `desclassificada-no-pregao`); FAQ de `licitacoes/page.tsx` (art. 59) | Boa | Não |
| 7 | Esqueci de manifestar a intenção de recorrer no pregão. Ainda posso recorrer? | Informacional (urgência) | FAQ em `dores.ts` (slug `recurso-administrativo`); FAQ de `licitacoes/page.tsx` e de `content/areas/licitacoes.mdoc` | Boa, mas só em FAQ (invisível no HTML) | Não |
| 8 | O recurso administrativo em licitação suspende o processo? Quem julga? | Informacional | `lib/licitacoes/dores.ts` (slug `recurso-administrativo`) | Boa | Não |
| 9 | Cabe mandado de segurança em licitação? Qual o prazo e dá para pedir liminar? | Informacional / contratação | `app/(site)/licitacoes/mandado-de-seguranca/conteudo.ts` e `page.tsx`; `content/posts/mandado-de-seguranca-analise-de-cabimento.mdoc`; `content/areas/mandado-de-seguranca.mdoc` | Boa (7 FAQs + artigo + área) | Não |
| 10 | Minha empresa foi multada ou impedida de licitar. Quais são as sanções da Lei 14.133, como me defender e como pedir reabilitação? | Informacional (alto valor) | FAQ "A empresa pode se defender antes de ser punida?" em `licitacoes/page.tsx`; seção "Defesa em sanções" em `content/areas/contratos-publicos.mdoc` e `licitacoes.mdoc` | **LACUNA** de página dedicada: tema vendido na home e no departamento, mas só há 1 resposta de FAQ (arts. 156 a 163, 166 a 168 citados lá) | **Sim** (prioridade 1): "Sanções na Lei 14.133: advertência, multa, impedimento e inidoneidade — prazos de defesa, recurso e reabilitação". Possível página de dor `/licitacoes/sancao-administrativa` |
| 11 | Quando posso pedir reequilíbrio econômico-financeiro do contrato com a Administração? | Informacional | `content/posts/reequilibrio-economico-financeiro-14133.mdoc`; `content/areas/contratos-publicos.mdoc` (FAQ); FAQ IBS/CBS em `licitacoes/page.tsx` | Boa (post de 843 palavras com poucas citações legais) | Não (reforçar base legal e exemplos) |
| 12 | Qual a diferença entre reajuste, repactuação e reequilíbrio em contrato público? | Comparação | Nenhuma página (menções soltas: reajuste em 4 arquivos, repactuação em 2) | **LACUNA** | **Sim**: "Reajuste, repactuação e reequilíbrio: qual usar no contrato administrativo" |
| 13 | O órgão público está atrasando o pagamento. Posso suspender a entrega ou rescindir o contrato? | Informacional | `content/areas/contratos-publicos.mdoc` (FAQ "Posso rescindir o contrato com a Administração?"); `content/areas/execucoes.mdoc` (cobrança da Fazenda) | **LACUNA** parcial: não trata de atraso de pagamento, suspensão e rescisão pelo contratado | **Sim**: "Atraso de pagamento pela Administração: o que o contratado pode fazer" (TODO validar base legal com o validador jurídico antes de redigir) |
| 14 | Quais são os crimes em licitação na Lei 14.133 e quais as penas? | Informacional | `content/posts/crimes-licitatorios-lei-14133.mdoc` (1.627 palavras, 21 citações de artigo); `content/areas/crimes-licitatorios.mdoc` | Boa | Não |
| 15 | Fui intimado em investigação sobre fraude em licitação. Preciso de advogado e o que não devo fazer? | Informacional / contratação | `content/posts/intimacao-investigacao-licitacao-primeiros-passos.mdoc`; FAQ "Fui intimado para depor" em `crimes-licitatorios.mdoc` | Boa | Não |
| 16 | Fui eliminado em concurso (exame psicológico, investigação social, prova física). Posso recorrer à Justiça? | Informacional | `content/posts/eliminacao-concurso-controle-judicial.mdoc` (634 palavras, 0 citações de artigo); `content/areas/concursos.mdoc` (FAQ) | Parcial: texto enxuto e sem base legal/jurisprudência citada | Não (reforçar post com base legal e dividir por fase: psicológico, social, TAF, heteroidentificação — TODO validar) |
| 17 | Passei dentro do número de vagas, tenho direito à nomeação? E se estou no cadastro de reserva? | Informacional | FAQ em `content/areas/concursos.mdoc` ("dentro do número de vagas"); "cadastro de reserva" aparece em 1 arquivo | Parcial: só uma resposta de FAQ | **Sim**: "Nomeação, preterição e cadastro de reserva: o que diz a jurisprudência" (TODO jurisprudência a validar) |
| 18 | Estou sendo investigado em PAD. Posso ser demitido sem advogado? Quais prazos e nulidades? | Informacional | `content/posts/processo-administrativo-disciplinar-defesa.mdoc` (635 palavras, 0 citações); `content/areas/servidores.mdoc` (FAQ PAD vs sindicância) | Parcial: texto curto, sem base legal | Não (reforçar o post existente; considerar artigo "PAD x sindicância" se houver demanda) |
| 19 | O que mudou na improbidade administrativa após a Lei 14.230/2021 para o agente público? | Informacional | FAQ em `content/areas/defesa-agentes.mdoc` ("O que mudou na improbidade após 2021") | Parcial: só FAQ | **Sim**: "Improbidade administrativa após 2021: dolo, prescrição e o que mudou para o agente público" (TODO validar) |
| 20 | Como funciona um departamento jurídico de licitações para empresa que disputa pregões todo mês? Compensa por certame ou contínuo? | Contratação / comparação | `app/(site)/licitacoes/page.tsx` (seção "Formas de atuação": contínuo, pontual, contencioso) | Boa na tela, mas fora do FAQ e do JSON-LD de pergunta; não há resposta objetiva a "como funciona" nem a "quando contratar" | Não como artigo; **sim como FAQ** na página `/licitacoes` ("Como funciona", "O que o departamento entrega em cada certame"), sem valores nem comparação com outros escritórios |

**Resumo.** 11 perguntas têm resposta adequada hoje (1, 3, 4, 6, 7, 8, 9, 11, 14, 15 e a 20 na tela, ainda fora do FAQ); 6 têm cobertura parcial (2, 5, 16, 17, 18, 19); 3 têm **LACUNA** (10, 12, 13). **Artigos novos recomendados (6)**: #5, #10 (prioridade 1), #12, #13, #17, #19. Mais **reforço de 5 posts existentes** (impugnação, reequilíbrio, eliminação, PAD, MS) com base legal, links internos e data de revisão; e **1 bloco de FAQ** novo em `/licitacoes` (#20).

---

## 6. Lacunas e riscos

### 6.1 O que está quebrado ou fraco para IAs (por impacto)

1. **Respostas do FAQ não estão no HTML** (Radix fecha o item e não renderiza o texto). Cerca de 20 páginas perdem justamente a resposta direta, com artigo de lei, que um modelo mais gostaria de citar. Hoje a resposta só chega a quem lê o JSON-LD. Correção candidata (fase de implementação, não agora): renderizar as respostas no servidor (por exemplo `forceMount` com CSS, ou `<details>`/lista visível), mantendo a acessibilidade.
2. **Não existe `/llms.txt`** (nem `/llms-full.txt`): 404.
3. **Sem política declarada de bots de IA.** Todos são permitidos por herança. Falta decidir treino x busca e documentar no `robots.ts` (TODO Douglas); sem bloqueio acidental hoje, comprovado por teste de user-agent.
4. **Posts sem link interno, sem artigos relacionados, sem data de revisão.** Os artigos de licitação mais citáveis (impugnação, PAD, eliminação) não citam artigos de lei no corpo. Dois lotes de datas (20/05 e 03/07/2026) e nenhum `updatedDate`: conteúdo jurídico sem sinal de atualização.
5. **Páginas de maior valor (dores, MS, áreas) sem autor, data nem "última revisão" visíveis ou em JSON-LD.** A validação jurídica de 21/10/2026 existe só em comentário de código.
6. **Entidade confusa:** posicionamento diferente entre home (Tributário + Licitações), `/areas` e `/sobre` (Direito Administrativo); OAB/SC com sede em SP e DDD 67; o site nunca diz que o Departamento de Licitações é a antiga LGC (e `licitacaogc.com.br` redireciona tudo para `/licitacoes`), então uma IA que conhece "LGC Consultoria" não consegue ligar as entidades. TODO: o Douglas define se e como declarar a continuidade (texto aprovado por ele; não inventar histórico).
7. **Sem JSON-LD** em `/areas`, `/blog`, `/contato`, `/diagnostico`, `/modelos`; `Article.image` sempre a OG genérica; áreas sem `Service`; sem `WebSite`/`Organization` global com `alternateName`.
8. **Plural "os advogados do Departamento"** contra um único advogado identificado: risco de afirmação não verificável (TODO confirmar equipe).
9. **Dependência externa dos modelos** (`senturiao-os.vercel.app`): se cair, as páginas `/modelos/*` e as entradas do sitemap somem sem aviso.
10. **Admin `/keystatic` responde 200 com `index, follow`**, bloqueado apenas pelo `robots.txt`. Baixo risco (modo `local`), mas convém `noindex` explícito numa fase de implementação.
11. `GUIA-DO-SITE.md` desatualizado (contagens, palavras-chave de Florianópolis): risco de orientar equipe errada.
12. Reveal com `opacity:0` inicial: texto presente, mas ferramentas que filtram por visibilidade podem ignorá-lo (risco baixo).

### 6.2 Riscos éticos (OAB: Provimento 205/2021, CED arts. 39 a 47)

- **`priceRange: "$$"` no JSON-LD do `LegalService` (home)**: sinal de preço em dado estruturado pode ser lido como mercantilização/oferta de preço. Sugestão: remover na implementação (TODO decisão do Douglas).
- A FAQ "Quanto custa?" do MS responde sem valor ("honorários dependem do caso"): adequado; manter.
- O compromisso "Retornamos em até 1 dia útil" é promessa de prazo de atendimento, não de resultado: aceitável, mas não amplificar em conteúdo para IA.
- Qualquer conteúdo novo deve passar pelo checklist da seção 9 do `GUIA-DO-SITE.md`: sem promessa de resultado, sem comparação com outros escritórios, sem depoimento, sem casos reconhecíveis, sem superlativos, com identificação do advogado e OAB/UF, com aviso padrão. As 20 perguntas acima são informativas e não induzem a contratação; a #20 é a única de natureza comercial e deve ser respondida só com descrição de método, sem valores nem superlativos.
- Os números do termômetro PNCP são "estimados pelos próprios órgãos" (já ressalvado na página); qualquer citação por IA deve manter essa ressalva. TODO: não criar números novos nem estatísticas de "sucesso".

### 6.3 Oportunidades já presentes (para explorar nas próximas fases)

- Páginas de dor já têm a estrutura que as IAs preferem: pergunta no título, prazo legal no topo, passos numerados, ressalva e FAQ com base legal.
- Termômetro do PNCP é um dado próprio e recorrente, citável como fonte ("Fonte: PNCP, consultado em ...").
- `@id`s de escritório e pessoa já ligam o grafo de entidades; basta estender (`Service` por área, autor/revisor nas dores, `WebSite`).
- Redirect da LGC já canaliza para `/licitacoes`: a autoridade herdada existe, só falta a ponte semântica aprovada pelo Douglas.

### 6.4 Pendências (TODO) para o Douglas antes das próximas fases

1. Decidir a política de bots de IA (permitir tudo, ou permitir busca/citação e bloquear treino).
2. Definir a frase única de posicionamento do escritório.
3. Confirmar: equipe do departamento (singular ou plural), "mais de dez anos" e data de início, e a explicação da OAB/SC com sede em SP.
4. Autorizar (ou não) a menção à continuidade LGC → Departamento de Licitações e a redação dela.
5. Autorizar a exibição de "última revisão" e do nome do advogado revisor nas páginas de dor.
6. Decidir sobre `priceRange` no JSON-LD.
7. Validar com o validador jurídico a base legal dos artigos novos #5, #10, #12, #13, #17 e #19 antes da redação (não citar jurisprudência sem conferência).
