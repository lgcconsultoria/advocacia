# SDD ledger — plan: docs/superpowers/plans/2026-08-31-sprints-1-3.md

Spec: docs/superpowers/specs/2026-08-31-sprints-1-3-design.md (lido)
Branch: feat/sprints-1-3 (criada a partir de f30c454 em claude/law-firm-website-Kdo2d)

Ruling: trabalhar em branch dedicada no diretório atual em vez de git worktree —
o "main" do repo é `claude/law-firm-website-Kdo2d`, o usuário está com este
diretório aberto no VS Code, e um worktree exigiria reinstalar node_modules de um
projeto Next 16 + Keystatic enquanto esconderia o progresso do editor dele.
Custo se errado: o trabalho fica numa branch que precisa de merge em vez de um
diretório isolado — recuperável com merge/rebase normal.

## Scan pré-voo

### Pares de tarefas que compartilham arquivo ou interface

| Par | Produz → consome | Achado |
|-----|------------------|--------|
| T2 → T3,T5,T10,T11,T12,T13,T15 | tokens `--surface*`, `--text*`, `--border*`, `--accent*`, `--urgent`, `--ink-300`, `--brand-100`, `--shadow-md` | OK — todo token usado nas tarefas seguintes é definido em T2 |
| T2 → T2 | `--ink` removido / 15 usos reescritos | OK — Step 3 remove a definição, Step 4 reescreve os 15 usos, sem commit entre eles |
| T3 → T4 | `public/bootstrap.js` (tema) → append do runtime de reveal no mesmo IIFE | OK — `var root` declarado em T3, usado em T4 |
| T3 → T4 | classe `.js` | OK — `.js` e o CSS que depende dela chegam juntos, em T4; nunca há janela com um sem o outro |
| T3 → T6,T10,T11,T12,T13 | `lucide-react` | OK — instalado em T3 Step 5, antes de todos os consumidores |
| T7 → T8 | `readConsent`, `writeConsent`, `CONSENT_EVENT`, `CONSENT_KEY` | OK — nomes batem |
| T7 → T7 | `'dsa-consent-reopen'` string literal em dois componentes | OK — mesmo literal nos dois lados |
| T8 → T9 | hosts de terceiro → allowlist do CSP | OK — googletagmanager, connect.facebook.net, clarity.ms batem |
| T8 → T9 | `va.vercel-scripts.com` no CSP | Entrada de allowlist sem consumidor. Inofensiva, prevista no spec §5.2. Mantida. |
| T4 → T15 | `RevealItem index` | OK — mesma assinatura; T15 precisa importar `RevealItem` em areas/[slug] (hoje só importa `Reveal`) |
| T15 → T15 | teste lê `/sitemap.xml` esperando 14 áreas | OK — verificado: `app/sitemap.ts` emite uma URL por área, 14 áreas em content/areas |
| T10 → resto | `AreaIcon` mantém assinatura | OK |
| globals.css | T2,T3,T4,T5,T6,T7,T10,T11,T12,T13,T15,T16 | Sequencial, cada uma em bloco próprio. Ver ACHADO 4 para o único conflito real. |
| app/layout.tsx | T3 (script), T5 (fontes), T14 (feed) | OK — T3 diz explicitamente que os links do Google saem em T5 |

### Consistência interna de cada tarefa

| Tarefa | Testes × código × arquivos | Achado |
|--------|---------------------------|--------|
| T1 | smoke unit + e2e, scripts, gitignore | OK |
| T2 | teste de contraste × tokens × 15 usos de `--ink` | Step 1 cria teste e lib juntos — ver ACHADO 5 |
| T3 | 3 testes e2e × bootstrap + toggle | OK |
| T4 | 4 testes e2e × reveal + bootstrap + call sites | OK |
| T5 | build + e2e × fontes + tipografia | OK |
| T6 | 2 testes de orçamento × ffmpeg + HeroVideo | OK — vídeo não entra em `porUrl` (headless não tem `navigator.connection`), o segundo teste cobre os arquivos direto |
| T7 | 9 unit + 4 e2e × consent + banner | OK — o e2e "nenhum script de terceiro" passa trivialmente antes de T8 e vira significativo depois; previsto |
| T8 | 5 unit × analytics + vendors + instrumentação | Ver ACHADO 1 |
| T9 | 10 unit + 3 e2e × csp + next.config | Ver ACHADO 2 |
| T10 | 2 e2e × grid + Lucide | OK — 14 chaves de ICON_OPTIONS, 14 entradas no mapa |
| T11 | 2 e2e × HeroAside + grid | Ver ACHADO 4 |
| T12 | 2 e2e × MapEmbed | OK |
| T13 | 2 e2e × logo + sizes + Backdrop | OK |
| T14 | 3 e2e × manifest + feed + 404 | Ver ACHADOS 3 e 6 |
| T15 | 4 e2e × schema + template + conteúdo | OK |
| T16 | axe + teclado + OAB × CI | OK |

## Rulings do pré-voo

**ACHADO 1 — T8 manda deletar `components/meta-pixel.tsx`, que está em uso.**
Verificado: `app/(site)/modelos/[slug]/page.tsx:6,40` importa `MetaPixel` e
`components/modelo-form.tsx:4,57` importa `pixelEvento`. Deletar quebraria o build.
Ruling: T8 migra os dois pontos de uso antes de deletar — `<MetaPixel />` sai da
página de modelo (o `<Analytics />` do layout passa a cobrir o pixel), e
`pixelEvento('Lead', ...)` vira `track('material_download', { slug })`. O evento de
lead do modelo já está previsto no §6.4 do spec como `material_download`.
Custo se errado: um evento de conversão do Meta deixa de disparar até alguém
reintroduzi-lo — visível no Gerenciador de Anúncios, reversível.

**ACHADO 2 — `next.config.mjs` não consegue importar `lib/csp.ts`.**
O plano deixa isso como condicional ("se não conseguir, converter"). Um condicional
no meio de uma tarefa é um convite a improviso.
Ruling: T9 converte para `next.config.ts` de saída. O Next 16 suporta nativamente e
`vercel.json` usa `next build`, que não depende da extensão.
Custo se errado: se o Next 16 recusar `next.config.ts`, T9 volta para `.mjs` e
duplica a lista de headers em JS — feio, mas funcional.

**ACHADO 3 — os `sizes` do manifest no plano não batem com os arquivos reais.**
Verificado: favicon 64×64 (o plano declara 192×192), apple-touch-icon 180×180 (bate),
logo-mark 591×591 (o plano declara 512×512). Um `sizes` mentiroso quebra a instalação
no Android.
Ruling: T14 declara os tamanhos reais e gera um `icon-512-maskable.png` de 512×512 a
partir de `logo-mark.png` com margem de segurança (a zona segura maskable é ~80% do
quadro; um logo sem margem é cortado). Nada de declarar tamanho que o arquivo não tem.
Custo se errado: o ícone maskable fica com margem errada e aparece pequeno demais no
launcher Android — cosmético, corrigível com um reexport.

**ACHADO 4 — a grade de 2 colunas de T11 quebra o hero interno.**
Verificado em `app/(site)/diagnostico/page.tsx:22-35`: `nav.breadcrumb`, `h1` e
`p.lead` são filhos DIRETOS de `.container`. Com `display: grid` e duas colunas, o
`h1` cairia na coluna 1 e o `lead` na coluna 2 — o hero se desmontaria.
Ruling: T11 envolve breadcrumb + h1 + lead num `<div className="page-hero-copy">` nas
quatro páginas e posiciona `.page-hero-copy` na coluna 1 e `.hero-aside` na coluna 2.
O CSS `.breadcrumb { grid-column: 1 / -1 }` do plano deixa de ser necessário e sai.
Custo se errado: um nível a mais de div no hero — nenhum impacto semântico, já que
`.container` não tem papel ARIA.

**ACHADO 5 — T2 Step 1 mistura escrever o teste e criar a lib.**
Ruling: T2 escreve `tests/unit/contrast.test.ts` primeiro, roda (falha por módulo
ausente), só então cria `lib/contrast.ts`. Ordem TDD explícita no brief.
Custo se errado: nenhum — é ordem de execução, não de resultado.

**ACHADO 6 — `app/not-found.tsx` fica fora do grupo `(site)` e perde o rodapé.**
O 404 renderizaria sem header, sem rodapé e, portanto, sem o aviso do Provimento
CFOAB 205/2021 — que a Global Constraint exige em todas as páginas.
Ruling: T14 monta `SiteHeader` e `SiteFooter` dentro de `app/not-found.tsx` (o
`not-found` de rota não encontrada precisa ficar na raiz do `app/`, então o chrome
tem de ser importado explicitamente). `app/error.tsx` recebe o mesmo tratamento.
Custo se errado: duplicação da montagem do chrome em duas páginas de erro —
aceitável frente a uma página pública sem o aviso obrigatório da OAB.

---

## Execução

Task 1: implementer a9cd99846e4032621, DONE_WITH_CONCERNS (commit a369d29).
  Concern: porta 3000 ocupada permanentemente por container Docker não relacionado
  (com.docker PID 84939, verificado por mim com lsof). Com `reuseExistingServer`
  local, o Playwright reaproveitava o servidor errado e o teste falhava.

Task 1: Ruling: a suíte Playwright sai da porta 3000 para a 3100 (verificada livre),
  com `npm run start -- --port 3100`, mantendo `reuseExistingServer`. A 3000 é
  disputada em máquina de desenvolvimento; a suíte precisa de porta determinística e
  própria. Corrigido na fundação porque as 16 tarefas rodam `npm run e2e`.
  Custo se errado: se a 3100 for ocupada por outro serviço no futuro, a suíte falha
  ao subir — mensagem clara e correção de uma linha.

Task 1: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 0 Minor.
  ⚠️ fora do diff (resolvido por mim): o plano ainda fixava localhost:3000 em
  6 pontos. O pior era o filtro do teste de orçamento da Tarefa 6
  (`if (!url.startsWith('http://localhost:3000')) return;`): com a suíte na 3100
  ele nunca casaria, `porUrl` ficaria vazio, o total daria 0 e o teste de
  ≤900 KB PASSARIA POR ACIDENTE.
Task 1: Ruling: o filtro deixa de citar porta e passa a casar
  `http://localhost:` — um número de porta num teste de orçamento é acoplamento
  desnecessário e um modo de falha silencioso. As verificações manuais do plano
  (dev server e Lighthouse) também vão para a 3100. Corrigido no plano em b13807d
  e os briefs 2 e 3 foram regenerados a partir do plano corrigido.
  Custo se errado: o filtro aceitaria respostas de outro serviço local que a
  página porventura chamasse, inflando o total — falha para MAIS rigor, nunca
  para menos.
Task 1: complete (commits f30c454..d40dc51, review clean)

Task 2: implementer a28d6145810b032bd, DONE_WITH_CONCERNS (commit e3954b0).
  Corrigiu além do brief, corretamente: `body { background: var(--paper) }` deixava
  a página branca no escuro; `.btn-primary`/`.filter-btn.is-active` com `#fff` sobre
  acento caíam a 3,07:1.
  Reportou risco residual em `.cta-band .btn-primary`, `.skip-link`, `.steps li::before`.

Task 2: Ruling: o risco residual é falha real de AA e é corrigido agora, não adiado.
  Verifiquei a matemática: #FFFFFF sobre #8B87F0 = 3,08:1 (AA exige 4,5:1). O axe não
  pegou porque skip-link só existe sob foco e `::before` é pseudo-elemento — nenhum
  dos dois é avaliado. Em vez de remendar regra a regra, entra um token semântico
  `--on-accent` (#FFFFFF no claro, var(--brand-900) no escuro = 5,66:1 sobre o acento),
  com caso de teste travando os dois temas.
  Custo se errado: um token a mais na camada semântica — se o valor escuro ficasse
  ruim, é uma linha para ajustar, e o teste unitário avisaria antes do merge.

Task 2: Ruling: a reversão de `var(--font-inter)`/`var(--font-archivo)` para as strings
  "Inter"/"Archivo" feita pelo implementador está MANTIDA. O bloco @theme do plano era
  prospectivo: quem define essas variáveis é a Tarefa 5, via next/font/google. Publicar
  a referência antes da definição quebraria a tipografia entre as duas tarefas.
  CARREGAR PARA A TAREFA 5: ela precisa trocar `--font-sans`/`--font-display` no
  @theme para `var(--font-inter)`/`var(--font-archivo)` ao introduzir next/font.
  Custo se errado: se a Tarefa 5 esquecer, o site fica com as fontes self-hosted
  carregadas mas não aplicadas — visível a olho nu na primeira conferência.

Task 2: revisão — spec ✅; qualidade NÃO aprovado: 1 Important, 2 Minor.
  Important: `--urgent`/`--danger` fixo na Camada 1 fica em 2,43:1 no tema escuro
  (`.form-error`), e 2,56:1 na borda de campo com erro (mínimo 3:1). Regressão
  introduzida por esta tarefa e plan-mandated — o brief põe `--urgent` na Camada 1.
  Escapou ao axe porque `.form-error`/`.field-error` são `display:none` por padrão.
Task 2: Ruling: a cor de erro atravessa a camada semântica como todas as outras.
  `--urgent` fica na Camada 1 como vermelho cru; `--danger` deixa de ser apelido
  legado e vira token semântico de Camada 2 (claro = var(--urgent), escuro = tom
  claro que passe ≥4,5:1 nas três superfícies escuras). Todo texto e borda de erro
  passa por `--danger`. Exigida evidência do estado de erro RENDERIZADO no axe, não
  só aritmética — foi a segunda vez que um estado condicional escapou à varredura.
  Custo se errado: o vermelho de erro do tema escuro fica com tom destoante da marca
  — cosmético, uma linha para reajustar, com o teste garantindo o piso de contraste.
  CARREGAR PARA A TAREFA 15: `.deadline-prazo` e a borda de `.deadline-item` usam a
  cor de erro como texto/borda — devem usar `var(--danger)`, nunca `var(--urgent)`.
Task 2: minor (deferred): `.cta-band .btn-primary:hover` mistura base fixa (#fff) com
  hover reativo a token — inconsistente, contraste OK nos dois temas.
Task 2: minor (deferred): `.cta-band .btn-ghost` com `border-color: rgba(255,255,255,.45)`
  fixo sobre fundo que clareia no escuro — risco de WCAG 1.4.11, não confirmado.
Task 2: fix round 1/5 (1 addressed, 0 open — `--danger` de Camada 2 nos três blocos,
  #FF8A80 no escuro: 8,30:1 / 7,32:1 / 7,80:1; commits 8c65ca2..5b5bb81)
Task 2: complete (commits b13807d..5b5bb81, review clean)

Task 3: implementer a558e69725795ab93, DONE (commit d905bdc).
Task 3: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 2 Minor.
Task 3: minor (deferred): teste de FOUC usa assertion com auto-retry (~5s), então é
  proxy razoável e não prova estrita de "zero flash". Plan-mandated.
Task 3: minor (deferred): no primeiro render o ThemeToggle mostra sempre o ícone de
  lua até o useEffect rodar — flicker de ícone, não de fundo. Inerente ao padrão
  anti-mismatch de hidratação que o brief prescreve.
Task 3: complete (commits 5b5bb81..d905bdc, review clean)

Task 3: ACHADO ESTRUTURAL levantado pelo implementador e confirmado por mim
  (`grep self.__next_f.push .next/server/app/index.html` → presente):
  o runtime do App Router emite scripts inline que NÃO são removíveis. A decisão
  do spec §5.1 ("zero scripts inline, logo script-src 'self' sem nonce") partia de
  uma premissa FALSA e teria quebrado a hidratação na Tarefa 9.
Task 3: Ruling: a Tarefa 9 passa a usar nonce por requisição via middleware —
  que é literalmente o que o briefing original do cliente pedia no §4.7
  ("Content-Security-Policy (nonce, sem unsafe-inline)"). Foi o meu spec que
  desviou, não o briefing. Spec §5.1 e §5.4 reescritos; Tarefa 9 do plano
  reescrita por inteiro (novo middleware.ts, buildCsp(nonce), next.config.ts,
  e o teste E2E que afirmava "nenhum script inline" trocado por "todo script
  inline carrega o nonce da resposta" — o antigo teria falhado).
  CONSEQUÊNCIA ASSUMIDA: nonce por requisição e cache público de HTML são
  excludentes (nonce cacheado é nonce público, legível por qualquer visitante).
  O HTML deixa de ser cacheável na CDN; o item de cache do P13 fica atendido só
  para /feed.xml, /sitemap.xml, /robots.txt, /assets e /bootstrap.js.
  Custo se errado: o TTFB sai dos 39 ms estáticos para a latência de origem. Se
  na verificação final isso ameaçar o LCP alvo de 1,8 s, a decisão se reabre com
  o número medido em mãos — registrado no spec §5.4.

Task 4: implementer a8fda73329ef77aee, DONE (commit 9a7c4dc). e2e reveal 4/4,
  suíte 8/8, unit 10/10, build limpo. Fallback do IntersectionObserver verificado
  com teste ad-hoc temporário (removido antes do commit).
  Confirmei por conta própria: `[data-reveal]` não aparece mais em app/globals.css.
Task 4: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
Task 4: minor (deferred → CARREGADO PARA A TAREFA 11): `app/(site)/modelos/page.tsx`
  envolve o H1 (acima da dobra) num <Reveal>. Viola a restrição global "nada acima da
  dobra é animado". Fora da lista de arquivos da Tarefa 4; a Tarefa 11 já edita esse
  arquivo, então a correção vai junto com ela.
Task 4: complete (commits aca295f..9a7c4dc, review clean)

Task 5: implementer af7b27bda80fa739f, DONE_WITH_CONCERNS (commit ebd083e).
  Fontes self-hosted OK: 0 requisições a fonts.googleapis.com/gstatic.com, @font-face
  apontando para /_next/static/media/*.woff2. Pendência da Tarefa 2 (@theme →
  var(--font-inter)/var(--font-archivo)) fechada e confirmada.
  Concern: pulou a escala tipográfica do Step 3 alegando que a Tarefa 2 a havia
  estabelecido.
Task 5: Ruling: a premissa do desvio é FALSA e a escala deve ser aplicada.
  Verifiquei com `git diff f30c454..HEAD -- app/globals.css`: nenhuma tarefa deste
  plano tocou h1/h2/h3. A escala em globals.css:143-145 é a original do site. A escala
  do brief vem do §3.2 do briefing DO CLIENTE (h1 até 4rem contra 3,05rem) — é
  requisito de entrega, não refinamento opcional. Mandado aplicar com merge cuidadoso
  (remover line-height/letter-spacing da regra compartilhada, preservar text-wrap e
  cor) e varrer 9 rotas × 3 larguras atrás de quebra de layout. Instrução explícita:
  se quebrar, ajusta-se o layout, nunca a escala.
  Custo se errado: títulos maiores podem apertar layouts que ninguém revisou a olho
  nu — a varredura de 27 combinações é a mitigação, e é reversível numa linha.
Task 5: fix round 1/5 (escala tipográfica do §3.2 aplicada; commit d05aa86)
Task 5: Ruling: a busca do implementador por `<h4>` cobriu só app/, perdendo os três
  <h4> de components/site-footer.tsx, presentes em TODAS as páginas. Ao remover
  `line-height: 1.2` da regra compartilhada, eles caíram para o 1.7 do body.
  Regressão nova introduzida pela própria correção. Mandado dar regra própria ao h4
  e refazer a busca em app/ E components/.
  Custo se errado: entrelinha do rodapé fora do original — visual, 1 linha de CSS.
Task 5: fix round 2/5 (h4 com line-height próprio; commit c8c8ef2)
Task 5: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
Task 5: minor (deferred): `h4 { line-height: 1.3 }` é valor escolhido pelo
  implementador; o briefing só especifica h1-h3.
Task 5: complete (commits 9a7c4dc..c8c8ef2, review clean)

PADRÃO OBSERVADO (3 ocorrências): afirmações de verificação dos implementadores não
  se sustentaram quando conferidas — "a Tarefa 2 estabeleceu a escala" (não tocou),
  "não há <h4> no site" (há três), "npm run e2e passa" (rodava contra servidor
  errado). Mitigação adotada: conferir toda alegação factual com comando próprio
  antes de aceitar o relatório. Foi o que pegou as três.

Task 6: implementer a688ea05e9a71fce2, PARCIAL (commit 8828ec9).
  hero.mp4 2.625.307 B -> hero.webm 174.678 B + hero.mp4 297.759 B (-88,6%).
  e2e 9/10: falhou "home ≤900 KB" com 1287 KB medidos. Implementer isolou via
  git stash: sem vídeo nenhum a home já media 902,8 KB — o estouro não vem do vídeo.
Task 6: Ruling: o teste de orçamento tem defeito de MEDIÇÃO, e o defeito é meu.
  Ele usa `await res.body()`, que devolve o corpo DESCOMPRIMIDO. O critério do
  briefing ("home ≤900 KB", "JS ≤150 KB gzip") é de bytes TRANSFERIDOS. Para JS/CSS/
  HTML servidos com gzip/brotli isso superestima ~3x — os 562 KB de JS descomprimido
  equivalem a ~150-180 KB em gzip. Mandado trocar para
  `res.request().sizes()` (responseBodySize + responseHeadersSize) e remedir.
  Instrução explícita: se ainda estourar medido corretamente, NÃO forçar o teste a
  passar nem mexer em bundle — relatar os números por categoria e parar.
  Custo se errado: se `sizes()` subestimar algo, o orçamento passa frouxo; mitigado
  por eu exigir também a soma isolada dos .js contra o teto de 150 KB.
Task 6: fix round 1/5 (medição por bytes de rede; commit 7de3a61).
  Home: 731,5 KB transferidos (folga de 168,5 KB contra o teto de 900 KB).
  Maior asset: hero.webm 170,9 KB. e2e 10/10, unit 10/10, build limpo.
Task 6: LACUNA REGISTRADA (não é falha desta tarefa): JS transferido = 168,6 KB
  contra o teto de 150 KB gzip do briefing §9. O número inclui o prefetch automático
  de next/link para outras rotas, que NÃO é "JS inicial" — a medição honesta do
  critério precisa separar as duas coisas.
  Investiguei: `motion` não é mais importado por nenhum arquivo (dependência morta
  desde a Tarefa 4); `lenis` é carregado em toda página via components/smooth-scroll.tsx.
  CARREGAR PARA A TAREFA 16: medir JS inicial SEM prefetch contra os 150 KB, remover
  `motion` do package.json, e avaliar se o Lenis se paga.
Task 6: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 2 Minor.
  Revisor validou de forma independente a justificativa de não migrar o teste 2
  (`sizes()` não existe em APIRequestContext) e o cálculo de especificidade do CSS.
Task 6: minor (deferred): teste 2 depende de o servidor nunca comprimir hero.mp4/webm,
  premissa verdadeira hoje mas sem asserção que a trave.
Task 6: minor (deferred): `border-radius: var(--radius-lg)` repetido em três seletores
  do hero, consequência de a regra nova conviver com a legada.
Task 6: complete (commits c8c8ef2..7de3a61, review clean)

Task 7: implementer a089aac8cfdf7fc7d, DONE (commit c958214). unit 20/20, e2e 14/14,
  build limpo. Axe com banner aberto nos dois temas: 0 violação de contraste.
Task 7: Ruling: 62 tabs até o banner é barreira de acessibilidade, não consequência
  aceitável. O `aria-modal="false"` do brief manda NÃO aprisionar foco — não manda
  pôr o banner no fim da ordem de tabulação; fui eu que misturei as duas coisas ao
  escrever o brief. `<ConsentBanner />` vai para antes de `<SiteHeader />`, logo após
  o skip-link. Sendo `position: fixed`, a aparência não muda; muda a ordem do DOM.
  Custo se errado: se o banner passar à frente do skip-link, quebra a WCAG 2.4.1 —
  por isso exigi verificação explícita de que o skip-link segue como primeiro
  elemento focável.
Task 7: aceito como está: `.wa-float` escondido enquanto o banner está aberto
  (contato por WhatsApp segue no rodapé); `max-height:100vh; overflow-y:auto` como
  rede de segurança em telas baixas.
Task 7: CARREGAR PARA A TAREFA 16: violação `heading-order` (moderate) pré-existente
  no rodapé — três <h4> sem <h3> antes. Não introduzida por esta tarefa. axe classifica
  como moderate, então não barra o portão de "serious/critical" da Tarefa 16, mas é
  falha real de WCAG e a Tarefa 16 é dona da acessibilidade.
Task 7: fix round 1/5 (banner movido para antes do SiteHeader; commit 151ae72).
  Tabs até o primeiro botão do banner: 62 -> 5. Skip-link segue como tab 1.
Task 7: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
Task 7: minor (deferred → TAREFA 16): checkboxes de opção do banner são 18x18px,
  abaixo dos 44x44 da WCAG 2.5.8. Mitigado pelo <label> inteiro ser clicável.
Task 7: complete (commits 7de3a61..151ae72, review clean)

Task 8: implementer ac7f44327513286ec, DONE (commit 3b69c20). unit 25/25, e2e 14/14,
  build limpo. Migrou os dois usos do meta-pixel antes de deletar (achado 1 do pré-voo)
  e o teste "sem consentimento, nenhum script de terceiro" da Tarefa 7 segue verde.
Task 8: DEFEITO MEU no brief, achado pelo implementador: `layer.push('event', name,
  params)` usa Array.prototype.push com 3 args, empurrando 3 itens separados — e o
  meu próprio teste unitário esperava UM array. Código e teste errados juntos.
Task 8: Ruling: aceito a correção para `push(['event', name, params])`, MAS exigida
  prova de ponta a ponta antes de fechar: hit real para google-analytics.com/g/collect
  com `en=<evento>` na query. O ga4.js define gtag como `push(arguments)` (array-like),
  e o track empurra array de verdade; na prática o gtag.js trata os dois, mas
  "na prática" não basta quando o modo de falha é registrar silenciosamente nada.
  Fallback determinado caso o hit não saia: chamar `window.gtag('event', ...)` quando
  existir, com o push em array só como retaguarda.
  Custo se errado: a medição inteira do escritório fica muda sem ninguém notar — por
  isso a exigência de evidência de rede em vez de teste unitário com dataLayer falso.
Task 8: CARREGAR PARA A TAREFA 16: `npm run lint` está quebrado na branch base
  ("Invalid project directory"), pré-existente, confirmado por git stash.
Task 8: fix round 1/5 (commit 68d3894). PROVA DE REDE CONFIRMOU O DEFEITO:
  empurrar `['event', name, params]` no dataLayer NÃO gera hit nenhum no gtag.js real
  (esperou 8s, nada saiu). `track()` passa a chamar `window.gtag('event', name, params)`;
  o push cru vira só fallback de melhor esforço para a janela antes do vendor carregar.
  Hits capturados sem interceptação, servidor de produção, GA_ID de teste:
    en=cta_click&ep.origem=home%23hero&ep.destino=%2Fareas
    en=material_download&ep.slug=recurso-administrativo-licitacao
  Consentimento recusado: nenhum hit, nenhuma requisição a /vendor/. unit 29/29,
  e2e 14/14, build limpo.
  CONFIRMA A DECISÃO DE EXIGIR EVIDÊNCIA DE REDE: o teste unitário com dataLayer falso
  passava com o código que não emitia nada. A medição teria nascido muda.
Task 8: achado extra registrado: o próprio gtag.js corrompe (en= vazio) evento
  customizado disparado nos ~5s seguintes a uma navegação client-side do Next.
  Limite de terceiro, não do nosso código. Relevante para investigar métrica "furada"
  perto de navegação rápida.
Task 8: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
  Revisor reconferiu por conta própria: grep do pixel, SVG idêntico byte a byte,
  separação analytics/marketing sem vazamento, dataset ligado ponta a ponta.
Task 8: minor (deferred): `phone_click` está no tipo EventName mas não tem uso —
  não existe link `tel:` no projeto. Adaptação correta do implementador (o "telefone"
  do rodapé é wa.me e virou whatsapp_click), mas o evento não está ligado.
Task 8: complete (commits 151ae72..68d3894, review clean)

Task 9: implementer aa4b078e61e5b46cf (interrompido por erro de API antes do commit;
  retomado e concluído), DONE (commit 80b2092). unit 43/43, e2e 20/20, build limpo.
  TTFB: 1,54 ms (estático) -> 11,04 ms (nonce por requisição). Delta +9,5 ms local.
Task 9: A PREOCUPAÇÃO DO SPEC §5.4 NÃO SE CONFIRMOU. Eu havia registrado que, se o
  TTFB dinâmico ameaçasse o LCP alvo de 1,8 s, a decisão de usar nonce se reabriria.
  Com +9,5 ms medidos, não se reabre. A escolha por CSP forte em vez de cache de HTML
  custou menos do que eu temia.
Task 9: desvio deliberado e correto do implementador: `app/layout.tsx` propaga o nonce
  ao `<script src="/bootstrap.js">`. Sob 'strict-dynamic' o navegador ignora 'self' e
  a allowlist para scripts, então um <script> escrito à mão só executa com nonce —
  sem isso o bootstrap seria bloqueado e tema/reveal quebrariam em silêncio.
  O brief não previa; a correção é necessária.
Task 9: CARREGAR PARA A TAREFA 16: Next 16.2 avisa que `middleware.ts` está depreciado
  em favor de `proxy.ts`. Build funciona; migração fica como pendência conhecida.
Task 9: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 2 Minor.
  Revisor validou que o desvio do layout segue o padrão oficial do Next e verificou
  fora do diff que o teste do alternador de tema NÃO é vazio (bootstrap.js só grava
  data-theme se houver localStorage prévio; em contexto limpo o atributo está ausente
  antes do clique, então o teste prova hidratação de verdade).
Task 9: minor (deferred): teste "não tem diretiva vazia" é tautológico (length >= 1
  sempre verdadeiro após o filtro). Plan-mandated, sem impacto de segurança.
Task 9: minor (deferred): matcher do middleware não exclui feed.xml/sitemap.xml/
  robots.txt/bootstrap.js, que recebem CSP com nonce à toa — trabalho desperdiçado,
  sem impacto de segurança. Plan-mandated.
Task 9: complete (commits 68d3894..80b2092, review clean)
=== SPRINT 1 COMPLETO: P1 reveal, P2 hero, P6 medição, P7 segurança ===

Task 10: implementer aff66ec573c0dcd86, DONE (commit 156e345). e2e cards 2/2,
  e2e 22/22, unit 43/43, build limpo. Verificação visual em 4 larguras x 2 temas.
Task 10: CARREGAR PARA A TAREFA 11: `app/(site)/modelos/page.tsx:37` usa
  className="area-card" SEM a classe "card" — os itens da página de materiais ficam
  sem fundo, sem borda e sem padding. Pré-existente, confirmado por mim com grep.
  A Tarefa 11 já edita esse arquivo (HeroAside), então a correção vai junto.
Task 10: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
  Revisor confirmou os 14 ícones 1:1 e validou de forma independente que a lógica de
  agrupamento por linha do teste é sólida (folga de 250-350px contra tolerância de 8px).
Task 10: minor (deferred): `flex: none` em `.area-card .card-icon` é CSS morto —
  o card é grid, não flex.
Task 10: complete (commits 80b2092..156e345, review clean)

Task 11: implementer a9a1fae54b51b5828, DONE (commit b183f4f). unit 43/43, e2e 24/24,
  build limpo. As duas correções carregadas foram feitas: Reveal removido do h1 de
  /modelos (acima da dobra) e `area-card` -> `card area-card`.
Task 11: Ruling: aceito o acréscimo do breadcrumb "Início › Materiais gratuitos" em
  /modelos. A página não tinha `.page-hero` e precisou ser reestruturada nesse padrão
  para receber o cartão; o breadcrumb é navegação, existe em TODAS as outras páginas
  internas, e conferi no diff que nenhuma palavra da copy original foi alterada
  (eyebrow, h1 e lead intactos). A página passa de fundo claro para o fundo escuro
  das demais internas — mudança visual real, mas na direção da consistência.
  Custo se errado: se o cliente preferir /modelos sem breadcrumb ou com topo claro,
  são 2 linhas para reverter.
Task 11: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
  Revisor foi além do escopo e conferiu a regra de colapso contra TODAS as páginas
  com .page-hero (aviso-publicidade, blog, blog/[slug], politica-de-privacidade,
  sobre, areas/[slug]) — nenhuma desmonta nem ganha coluna vazia.
Task 11: minor (deferred): hero-aside.tsx monta a mensagem de WhatsApp com lógica
  parecida à de whatsapp-float.tsx — oportunidade de DRY, não defeito.
Task 11: complete (commits 156e345..b183f4f, review clean)

Task 12: implementer ab9427269147f4088, DONE (commit cbf4309). e2e mapa 2/2,
  e2e 26/26, unit 43/43, build limpo. Iframe carrega sem violação de CSP; endereço
  com travessão resolve corretamente no Google Maps; CLS ~0 na troca.
Task 12: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
Task 12: minor (deferred): `rel="noopener"` poderia ser `noopener noreferrer`.
Task 12: complete (commits b183f4f..cbf4309, review clean)

Task 13: implementer a2556ff7c60e70b55, DONE (commit b53f0a3). e2e 28/28, unit 43/43,
  build limpo. Home: 731 KB -> 641,8 KB (folga de ~258 KB sob o teto de 900 KB).
  Logo confirmado nítido em dpr 1/2/3. Backdrop sem violação de contraste no axe.
Task 13: LIMITE ASSUMIDO E MANTIDO: o logo continua PNG. Não é possível vetorizar o
  bitmap com fidelidade e o arquivo vetorial original não está no repositório.
  Instruí explicitamente a NÃO gerar um SVG "aproximado" por traçado ou redesenho —
  logo redesenhado é marca alterada, pior que PNG bem dimensionado.
  DEPENDÊNCIA DO CLIENTE: arquivo vetorial (.ai/.eps/.svg) destrava o P12 completo.
Task 13: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 1 Minor.
  Revisor conferiu a aritmética dos `sizes` contra o CSS real de layout (não só a
  alegação), confirmou que nenhum SVG de marca entrou no diff, e destacou duas
  melhorias do implementador sobre a receita do brief: `useId()` em vez de id fixo
  no <pattern>, e correção proativa de `.section--ink` sem position:relative
  (sem o que o grafismo cobriria o texto).
Task 13: minor (deferred): variante `arcs` do Backdrop pode deixar faixas laterais
  vazias em seção não quadrada por causa do preserveAspectRatio padrão. Estético.
Task 13: complete (commits cbf4309..b53f0a3, review clean)

Task 14: implementer afcaa55c490a16e32, DONE (commit e06fb81). e2e plataforma 3/3,
  e2e 31/31, unit 43/43, build limpo. As duas correções do pré-voo aplicadas:
  sizes reais no manifest + icon-512-maskable.png gerado (confirmei: 512x512 reais),
  e chrome montado explicitamente em not-found.tsx e error.tsx (confirmei: aviso do
  Provimento presente nas duas). Removeu Cache-Control duplicado do route.ts do feed.
Task 14: revisão — spec ✅, qualidade Aprovado, 0 Critical, 1 Important, 1 Minor.
  Revisor confirmou de forma independente: sizes do manifest batem com `file`, o
  monograma ocupa ~74-78% do quadro maskable (dentro da zona segura de ~80%), o
  aviso da OAB em error.tsx é byte a byte igual ao do rodapé, as constantes batem
  com o fallback de lib/reader.ts, e o Cache-Control do feed não está duplicado.
Task 14: Ruling: o achado Important (aviso do Provimento e identidade do escritório
  duplicados à mão em app/error.tsx) entra em correção, apesar de as cópias baterem
  hoje. O risco é deriva: nada obriga uma futura correção do aviso a alcançar as duas
  cópias, e error.tsx é a página que ninguém revisita. Num site de advocacia, aviso
  de publicidade desatualizado em página pública é exposição regulatória, não dívida
  cosmética. Extração para `lib/legal-notice.ts` como fonte única, com exigência de
  prova byte a byte de que o texto renderizado não mudou.
  Custo se errado: um módulo a mais; se a extração alterar o texto, o teste de
  igualdade byte a byte pega antes do merge.
Task 14: minor (deferred): comentário em feed.xml/route.ts:105 diz "cinco caracteres"
  mas escapar() trata quatro (não escapa apóstrofo). Inofensivo — todos os atributos
  do XML gerado usam aspas duplas.
Task 14: fix round 1/5 (1 addressed, 0 open — lib/legal-notice.ts como fonte única,
  texto idêntico byte a byte em 4 superfícies; commit 5f83f1b)
Task 14: complete (commits b53f0a3..5f83f1b, review clean)

Task 15: primeiro implementer interrompido pelo usuário com trabalho no disco, não
  commitado e não verificado. Segundo implementer a86c53eb2eb880bc4 auditou, verificou
  e fechou (commit 42192cf). unit 43/43, e2e 35/35, build limpo.
  Auditoria: prazos de mandado de segurança verbatim do brief, var(--danger) correto,
  as outras 13 áreas sem deadlines/decisive.
  Confirmei por conta própria: `git diff f30c454..HEAD -- content/` não remove NENHUMA
  linha em toda a branch, e exatamente 1 área tem deadlines.
Task 15: ARMADILHA DE AMBIENTE registrada: um processo Node obsoleto na porta 3100,
  de sessão anterior, foi reaproveitado pelo Playwright (reuseExistingServer) e
  causou 3 falsas falhas. Matar o processo e reconstruir resolveu (35/35).
  CARREGAR PARA A TAREFA 16: o CI usa `reuseExistingServer: !process.env.CI`, então
  em CI isso não ocorre — mas em máquina local pode enganar quem rodar a suíte.
Task 15: revisão — spec ✅, qualidade Aprovado, 0 Critical, 0 Important, 0 Minor.
  Revisor comparou LINHA A LINHA o conteúdo jurídico do brief com o .mdoc: idêntico,
  incluindo cada prazo e cada base legal. Nenhum prazo inventado, reformulado ou
  "melhorado". As 13 outras áreas recebem exatamente 1 linha (areaKey), nada mais.
Task 15: complete (commits 5f83f1b..42192cf, review clean)

=== PENDÊNCIAS ACUMULADAS PARA A TAREFA 16 ===
1. Medir JS inicial SEM prefetch contra o teto de 150 KB gzip (hoje 168,6 KB com
   prefetch incluído). Remover `motion` do package.json (dependência morta desde a
   Tarefa 4). Avaliar se o Lenis se paga.
2. Violação `heading-order` (moderate) pré-existente: três <h4> no rodapé sem <h3>.
3. Checkboxes do banner de consentimento são 18x18px (WCAG 2.5.8 pede 44x44);
   mitigado pelo <label> clicável.
4. `npm run lint` quebrado na branch base ("Invalid project directory"), pré-existente.
5. Next 16.2 avisa que `middleware.ts` está depreciado em favor de `proxy.ts`.
6. `phone_click` no tipo EventName sem uso (não há link tel: no projeto).

Task 16: implementer aecb5517be62c4206, DONE (commit dc1ba00). unit 43/43,
  e2e 48/48 (13 de acessibilidade), build limpo, NENHUMA regra do axe desabilitada
  (confirmei por grep). `motion` removido do package.json (confirmei).
  Lighthouse mobile: Performance 88, Acessibilidade 100, Boas Práticas 100, SEO 100.
Task 16: revisão — spec ✅, qualidade Aprovado, 0 Critical, 1 Important, 1 Minor.
  Revisor cruzou os dois documentos célula a célula (batem), verificou que a soma dos
  chunks fecha em 180,8 KB, e conferiu ele mesmo a cascata CSS do rodapé provando que
  a troca de <h4> por <h2> preserva a aparência (line-height 1.3 recolocado
  explicitamente). Considerou a afirmação do LCP tecnicamente sustentável e destacou
  que o documento mantém o número PIOR como oficial.
Task 16: Ruling: o achado Important (ausência de saída bruta do Lighthouse e do CDP)
  entra em correção. É exatamente o risco que esta tarefa existe para evitar: o
  documento de resultados é o que o cliente lê para decidir, e número sem procedência
  colável não atende a isso, por mais forte que seja a evidência circunstancial.
  Exigido: refazer as medições preservando os JSON, colar saída literal via jq, e —
  se divergirem — registrar os números novos E o fato de terem divergido, com mediana
  de 3 execuções se possível.
  Custo se errado: uma rodada a mais de medição; se os números novos forem piores, o
  cliente recebe a verdade em vez de um número sortudo.
Task 16: fix round 1/5 (commit 11be482 — remedição com evidência bruta e mediana de 3).
  A EXIGÊNCIA DE SAÍDA BRUTA SE PAGOU. A remedição revelou dois fatos que a rodada
  única escondia:
  (a) Performance DESKTOP era 85 na primeira rodada (TBT 230 ms) e deu 100 nas 3
      execuções da segunda (TBT 0 ms) — variância de medição por disputa de CPU, agora
      documentada em vez de tratada como número determinístico.
  (b) ACHADO NOVO: CLS = 0,0563 em 2 de 3 execuções sob perfil CDP com CPU throttling
      4x — acima da meta de 0,05. A primeira rodada reportava CLS 0. O Lighthouse
      mobile reporta CLS 0; a divergência aparece só sob CPU throttled.
  Mobile: Performance 88 (0,88 nas 3), LCP mediana 3,877 s, TBT mediana 25 ms.
Task 16: complete (commits 42192cf..11be482, 1 minor deferred)
=== AS 16 TAREFAS ESTÃO IMPLEMENTADAS ===

=== REVISÃO FINAL DA BRANCH (28 commits, f30c454..11be482) ===
Veredito: pronto para merge COM correções. 0 Critical, 7 Important, ~10 Minor.
Confirmou: arquitetura de tokens intacta após 12 tarefas editando globals.css (só 4
seletores duplicados, todos intencionais); zero regressão de conteúdo; OAB_NOTICE
como fonte única real; os três prazos do MS conferidos contra a lei (art. 23 e art.
7º I da Lei 12.016/2009; art. 1.003 §5º e 1.015 I do CPC) — nenhum inventado.

CAUSA DO CLS IDENTIFICADA (o achado que ninguém tinha diagnosticado):
  `.hero h1 { max-width: 16ch }` (globals.css:292) — `ch` depende da métrica do glifo.
  No domready o max-width computado é 351,31px (Archivo Fallback) e após o swap vira
  380,80px (Archivo real). Nas cargas em que as duas atualizações não caem no mesmo
  frame, o h1 passa por 4 linhas e volta a 3: tudo abaixo dele desce 42px e sobe.
  42px = exatamente uma linha do h1 (40px x line-height 1.05).
  Reproduzido 6 vezes em 9 execuções, com entry.sources idênticos.
  `16ch` é PRÉ-EXISTENTE (f30c454:globals.css:186); a Tarefa 5 apenas amplificou
  (linha passou de 38,4px para 42px). Correção: trocar `ch` por `em`.

Task 16: o "1 minor" não nomeado no ledger era a lacuna do `git add` no Step 7 do
  brief (não listava site-footer.tsx/analytics.ts/package.json). O commit real os
  incluiu corretamente. Sem ação. Pendência encerrada.

Onda única de correção da revisão final: 8 commits (c7065ff..20df65f), todos os 8
  achados ADDRESSED na re-revisão escopada, 0 quebras novas.
  CLS: 0,0563 -> 0,0000 em 6 de 6 execuções.
  Re-revisor recalculou a aritmética de contraste de forma independente e confirmou
  os dois desvios do implementador (70% em vez de 60%; troca de variável no item 2,
  porque o valor que EU sugeri daria 1,00:1 e teria piorado o defeito).

ACHADO MEU NA VERIFICAÇÃO FINAL: a suíte E2E era instável sob paralelismo — 3
  execuções minhas deram 3 resultados diferentes, e cada teste passava isolado.
  Ruling: corrigir, não conviver. Um portão que falha aleatoriamente ensina a
  reexecutar até passar e deixa de pegar regressão real.
  Diagnóstico (commit c396473), com evidência e não hipótese:
  (a) condição de corrida NO TESTE: `waitForRequest` era registrado DEPOIS do click,
      mas a requisição dispara sincronamente no handler. Isolado, falhava 11/20.
      Corrigido com Promise.all — 20/20.
  (b) contenção real: quase toda rota é SSR por requisição (consequência do CSP com
      nonce) contra um único `next start`. `page.goto` ia de 0,3s para 8,6s sob carga
      com 10 workers. Limitado a workers: 3.
  Nenhum retry, nenhuma asserção enfraquecida.
  Verifiquei por conta própria: 2 execuções, 49/49 nas duas.
