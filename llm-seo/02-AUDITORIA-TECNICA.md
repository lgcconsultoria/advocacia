# 02 — Auditoria técnica (Fase 3) — LLM SEO / GEO

Site: https://www.senturiaoadv.com.br · Branch `llm-seo` · 27/10/2026.
Método ANTES: `01-DESCOBERTA.md` (curl no site no ar) + build de linha de base do código antes das alterações (`.next/server/app/*.html`).
Método DEPOIS: `npm run build` do branch, leitura do HTML gerado, `next start` + `curl`/navegador, scripts de verificação (abaixo).
Nota: 0 = ausente ou quebrado; 10 = sem pendência.

## Resumo

| Item | ANTES | DEPOIS | O que mudou |
| --- | :-: | :-: | --- |
| HTML sem JavaScript | 6 | 9 | Respostas do FAQ passaram a vir no HTML (92 respostas, 21 páginas) |
| robots.txt | 6 | 9 | Política de bots de IA declarada; `/keystatic` com `noindex` |
| sitemap | 8 | 8 | Sem mudança (ver pendências) |
| Metadados (title, description, canonical, OG) | 8 | 8 | Sem mudança |
| JSON-LD | 6 | 9 | Sem `priceRange`; `WebSite` e escritório globais; datas e autoria; trilhas e coleções novas |
| HTML semântico | 7 | 8 | FAQ com `h3` + `button` + `region`; "Leia também" em `nav`; `time` nas revisões |
| Links internos | 4 | 7 | "Leia também" no fim dos artigos; corpo dos artigos ainda sem links |
| llms.txt / llms-full.txt | 0 | 9 | Rotas novas, geradas do conteúdo real |
| **Média** | **5,6** | **8,4** | |

## 1. HTML sem JavaScript — antes 6, depois 9

**Antes.** O texto principal já vinha no HTML, mas o `components/faq-accordion.tsx` (Radix Accordion) só monta o conteúdo do item aberto. Verificado no código do Radix (`@radix-ui/react-collapsible`, `hidden: !isOpen` e `children: isOpen && children`): mesmo com `forceMount` o filho não é renderizado fechado. Resultado no HTML gerado pelo build de base: `<div data-state="closed" hidden="" role="region" class="faq-content"></div>` vazio.

```
$ python faqcheck.py   (antes)            $ python faqcheck.py   (depois)
paginas 21 vazias 92 com resposta 0       paginas 21 vazias 0 com resposta 92
```

Páginas afetadas: 12 áreas (4 respostas cada, inclusive `/areas/licitacoes` e `/areas/tributario`, que redirecionam em produção), `/licitacoes` (6), `/tributario` (6), 4 páginas de dor (5, 4, 4, 4) e `/licitacoes/mandado-de-seguranca` (7).

**Correção.** `components/faq-accordion.tsx` deixou de usar o Radix. O componente próprio mantém: um item aberto por vez, pode fechar todos, `aria-expanded`/`aria-controls`/`role="region"`, setas, Home e End entre as perguntas. O painel fechado fica no HTML e é recolhido por CSS (`grid-template-rows: 0fr`, em `app/globals.css`), marcado `inert` (sai da tabulação e da leitura assistiva, mas continua no documento). Mesmo visual e mesma animação (0,28 s ao abrir, 0,22 s ao fechar).

Teste no navegador (`next start`, `/areas/concursos`): fechado = altura 0 nos 4 painéis; clicar no 2º abre (133 px) e deixa os outros `inert`; clicar no 3º fecha o 2º e abre o 3º (189 px); clicar de novo fecha; seta para baixo move o foco para a pergunta seguinte; 0 erros no console.

**O que falta para 10.** `components/reveal.tsx` (Motion) emite `opacity:0` inicial no HTML e só revela ao entrar na tela. O texto está no HTML, mas ferramentas que renderizam e descartam o que é invisível podem ignorá-lo. Não mexi: seria mudança de comportamento visual.

## 2. robots.txt — antes 6, depois 9

**Antes.** Só o grupo `*` (nenhum bot de IA bloqueado nem declarado), diretiva `Host:` sem efeito no Google, `/keystatic` respondia 200 com `index, follow`.

**Depois** (`app/robots.ts`, saída em `.next/server/app/robots.txt.body`):

```
User-Agent: *            Allow: /   Disallow: /keystatic /api/ /clientes/ /entrar /sistema /cliente
User-Agent: GPTBot | OAI-SearchBot | ChatGPT-User | ClaudeBot | Claude-SearchBot | Claude-User |
            PerplexityBot | Perplexity-User | Google-Extended | Applebot-Extended   (cada um: Allow: / + os mesmos Disallow)
Host: https://www.senturiaoadv.com.br
Sitemap: https://www.senturiaoadv.com.br/sitemap.xml
```

- Cada bot repete os bloqueios porque o rastreador que tem grupo próprio ignora o grupo `*`.
- **CCBot** fica de fora (herda `*`, portanto permitido): é repositório genérico de dados e não decide citação em nenhum assistente; declará-lo seria ruído. Decisão provisória (ver `TODO-DOUGLAS.md`).
- `/keystatic` ganhou `<meta name="robots" content="noindex, nofollow, nocache">` em `app/keystatic/layout.tsx` (confirmado com `curl localhost:3056/keystatic | grep robots`). O admin continua funcionando: só metadados no layout.
- Teste novo: `lib/seo/robots.test.mts` (3 testes: bots declarados, bloqueios repetidos, sitemap).

**Para 10.** Confirmar com o Douglas a política de treino (Google-Extended, GPTBot, ClaudeBot, Applebot-Extended).

## 3. sitemap — antes 8, depois 8

Sem alteração. Pontos fortes: 49 URLs (agora 52 com os novos artigos), `lastmod` real, redirecionadas fora. Fragilidade herdada: se a API `senturiao-os` falhar, `getModelos()` devolve `[]` e os 5 modelos somem do sitemap e do `/llms.txt` até o próximo ISR. `lastmod` das áreas é um valor fixo (`AREAS_ATUALIZADAS_EM`, 01/09/2026), não a data real de cada área.

## 4. Metadados — antes 8, depois 8

Sem alteração: `title`, `description`, `canonical` relativo com `metadataBase`, OG e Twitter por página, `lang="pt-BR"`. Lacunas que ficam: imagem OG única; descrições longas em `/licitacoes` e `/tributario` (acima de 155 caracteres); posicionamento inconsistente entre títulos (home "Tributário e Licitações", `/areas` "Direito Administrativo e Contencioso") — decisão do Douglas.

## 5. JSON-LD — antes 6, depois 9

Verificado por script nas 54 páginas públicas geradas: todo bloco é JSON válido; zero `priceRange`; toda referência `{"@id": ...}` tem definição no conjunto.

| Mudança | Onde |
| --- | --- |
| `priceRange: "$$"` removido (risco OAB) | era na home; o nó do escritório foi movido para `lib/schema.ts` (`escritorioLd`) |
| `WebSite` (`@id` `/#website`) + `LegalService`/`Attorney` (`@id` `/#escritorio`) em todas as páginas públicas, em um `@graph` | `app/(site)/layout.tsx` |
| `alternateName` | só o que já estava no site ("Douglas Senturião — Direito Tributário e Público para empresas"); LGC não incluída |
| `Article`: `@id` próprio, `articleSection`, `isPartOf` o site, `mainEntityOfPage` como `WebPage`, `author` com o `@id` da pessoa, `dateModified` (= `updatedDate` ou data de publicação) | `app/(site)/blog/[slug]/page.tsx` |
| `WebPage` com `author` (@id da pessoa), `publisher`, `isPartOf`; `dateModified` e `lastReviewed` = 21/10/2026 só nas 4 páginas de dor | dores, mandado de segurança (sem data), áreas (sem data) |
| `CollectionPage` + `ItemList` | `/areas`, `/blog` |
| `ContactPage` ligado ao escritório | `/contato` |
| `BreadcrumbList` onde faltava | `/areas`, `/blog`, `/contato`, `/sobre`, `/modelos`, `/modelos/[slug]` |

`reviewedBy` não foi usado: a validação de 21/10/2026 é do "validador jurídico" do processo, não consta que foi o Douglas; afirmar seria inventar. Ver pendências.

Ainda sem: `Service` por área (só `/licitacoes` e `/tributario`), imagem do `Article` específica (todas usam a OG genérica).

Comando de verificação: `python ldcheck.py` lê `.next/server/app/**/*.html`, extrai `<script type="application/ld+json">`, faz `json.loads`, coleta `@id` definidos e referenciados. Saída final: `paginas 54 json invalido 0 priceRange 0 refs sem definicao []`.

## 6. HTML semântico — antes 7, depois 8

Já havia: um `h1` por página, `h2`/`h3`, `time` nos artigos, `nav` com `aria-label`, `ol` nos passos. Mudou: FAQ com `h3 > button` e `div role="region" aria-labelledby`; "Leia também" em `nav aria-labelledby`; linha de autoria com `time dateTime` onde há data de revisão. Para 10: `Reveal` e o `article` das páginas de dor/área (hoje `div`).

## 7. Links internos — antes 4, depois 7

Antes: zero links dentro de `content/posts` e `content/areas`, nenhum "relacionados". Agora: `components/blog/leia-tambem.tsx` no fim de cada artigo lista até 3 artigos da mesma `areaKey` (do mais recente ao mais antigo, sem o próprio) e o link da área (`hrefArea`, então `licitacoes` vai para `/licitacoes`). Verificado: `/blog/guarda-compartilhada-na-pratica` lista o de pensão alimentícia + a área; `/blog/impugnacao-ao-edital-...` lista a área. Para 10: links dentro do texto dos artigos e das áreas para as páginas de dor (é edição de conteúdo, fora do escopo desta fase) e artigos com mais de um par por área.

## 8. llms.txt — antes 0, depois 9

- `app/llms.txt/route.ts` e `app/llms-full.txt/route.ts` (estáticas, `text/plain; charset=utf-8`), texto montado por `lib/llms.ts` a partir do Keystatic, `lib/licitacoes/dores.ts` e `mandado-de-seguranca/conteudo.ts`. Domínio: `SITE` de `lib/seo.ts`, o mesmo do sitemap.
- `curl -s -o /dev/null -w "%{http_code} %{content_type}" localhost:3056/llms.txt` → `200 text/plain; charset=utf-8` (idem `/llms-full.txt`).
- `/llms.txt` (~14 KB): título, resumo em citação, 6 páginas principais, 5 situações em licitação, 12 áreas, todos os artigos, modelos (se a API responder) e seção `## Opcional`. Cada linha `- [título](URL absoluta): descrição`.
- `/llms-full.txt` (~200 KB): texto integral das situações, áreas e artigos, com autor e datas dos artigos, aviso ético e FAQ; títulos rebaixados para caber na hierarquia.
- Nada inventado: descrições são as meta descriptions já publicadas. Menção à LGC fora.
- Pesa a cada build; com mais artigos o `llms-full.txt` cresce (hoje 18 artigos).

**Para 10.** Conferir os dois arquivos depois do deploy em produção e submeter no Search Console/Bing Webmaster; avaliar se o `llms-full.txt` não fica grande demais (algumas ferramentas truncam).

## Verificação de build e testes

- `npm run build`: compila sem erro (Next 16.2.9 / Turbopack); `/llms.txt`, `/llms-full.txt`, `/robots.txt` aparecem como estáticas.
- `npm test`: 23 testes passam (20 anteriores + 3 do robots).
