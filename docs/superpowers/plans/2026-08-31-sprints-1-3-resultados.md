# Resultados de verificação — Sprints 1–3 (Tarefa 16)

Data da medição: 2026-09-01 (ambiente local, build de produção `npm run build && npm run start`, porta 3100).
Commit medido: HEAD desta branch, após as tarefas 1–16 (`feat/sprints-1-3`).

Este documento registra os critérios do §11 do spec que não são automatizáveis por teste.
**Todo número abaixo é o resultado real medido — inclui os que ficaram abaixo da meta.**

**Revisão (2026-09-01, mesma data)**: as medições de Lighthouse e de Core Web Vitals foram refeitas
3 vezes cada, num ambiente isolado, com os JSONs/logs brutos preservados fora de `/tmp` (em
`.superpowers/sdd/2026-08-31-sprints-1-3/evidence/`, não versionado em git — mesma convenção dos
demais artefatos internos de tarefa deste repositório) e a saída de `jq`/dos scripts colada
literalmente abaixo. Onde os números novos divergiram da primeira rodada (execução única), o
documento foi atualizado com o valor novo e a divergência está explicada no lugar — ver §1 (desktop
Performance 85→100) e §2.2 (CLS intermitente sob CPU throttled, achado novo). O número oficial contra
cada meta continua sendo o do Lighthouse simulado; as medições CDP são evidência complementar.

---

## 1. Lighthouse

Comandos exatamente como no brief da Tarefa 16 (§ Step 4), contra o build de produção local.
**Rodado 3 vezes para cada perfil** (desktop e mobile), em sequência, num ambiente isolado (só o
servidor de produção na porta 3100 ativo — nenhum outro build/servidor concorrente da sessão, ao
contrário da primeira rodada de medição, ver "Divergência" abaixo). Os JSONs brutos das 6 execuções
estão preservados em `.superpowers/sdd/2026-08-31-sprints-1-3/evidence/lh-{desktop,mobile}-{1,2,3}.json`
(não estão em `/tmp`; não estão no git — ver nota sobre `.gitignore` no relatório da tarefa).

```
npx lighthouse http://localhost:3100 --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=.../evidence/lh-desktop-N.json
npx lighthouse http://localhost:3100 --form-factor=mobile --throttling-method=simulate --quiet --chrome-flags="--headless" --output=json --output-path=.../evidence/lh-mobile-N.json
```

Chrome usado: "Chrome for Testing" 151.0.7922.34 (o Chromium instalado pelo Playwright — não
havia Chrome/Chromium do sistema no ambiente de medição). Lighthouse 13.4.1.

### Saída bruta (`jq` sobre os 6 JSONs)

Comando rodado sobre cada arquivo:

```bash
jq '{
  performance: .categories.performance.score,
  accessibility: .categories.accessibility.score,
  best_practices: .categories["best-practices"].score,
  seo: .categories.seo.score,
  lcp_numericValue: .audits["largest-contentful-paint"].numericValue,
  lcp_displayValue: .audits["largest-contentful-paint"].displayValue,
  cls_numericValue: .audits["cumulative-layout-shift"].numericValue,
  tbt_numericValue: .audits["total-blocking-time"].numericValue,
  tbt_displayValue: .audits["total-blocking-time"].displayValue
}' lh-<perfil>-<N>.json
```

Saída literal das 6 execuções:

```
=== desktop run 1 ===
{ "performance": 1, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 809.1826500000004, "lcp_displayValue": "0.8 s",
  "cls_numericValue": 0, "tbt_numericValue": 0, "tbt_displayValue": "0 ms" }
=== desktop run 2 ===
{ "performance": 1, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 788.156, "lcp_displayValue": "0.8 s",
  "cls_numericValue": 0, "tbt_numericValue": 0, "tbt_displayValue": "0 ms" }
=== desktop run 3 ===
{ "performance": 1, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 782.2532500000001, "lcp_displayValue": "0.8 s",
  "cls_numericValue": 0, "tbt_numericValue": 0, "tbt_displayValue": "0 ms" }
=== mobile run 1 ===
{ "performance": 0.88, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 3864.8232000000007, "lcp_displayValue": "3.9 s",
  "cls_numericValue": 0, "tbt_numericValue": 24, "tbt_displayValue": "20 ms" }
=== mobile run 2 ===
{ "performance": 0.88, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 3944.9226, "lcp_displayValue": "3.9 s",
  "cls_numericValue": 0, "tbt_numericValue": 25, "tbt_displayValue": "30 ms" }
=== mobile run 3 ===
{ "performance": 0.88, "accessibility": 1, "best_practices": 1, "seo": 1,
  "lcp_numericValue": 3877.4686, "lcp_displayValue": "3.9 s",
  "cls_numericValue": 0, "tbt_numericValue": 25, "tbt_displayValue": "30 ms" }
```

### Mediana de 3 execuções

| Categoria | Desktop (mediana de 3) | Mobile (mediana de 3) | Meta |
|---|---|---|---|
| Performance | **100** (1, 1, 1 — sem variação) | **88** (0,88 nas 3) | ≥95 |
| Acessibilidade | **100** | **100** | ≥95 — atingida |
| Boas Práticas | **100** | **100** | ≥95 — atingida |
| SEO | **100** | **100** | ≥95 — atingida |
| LCP | 788 ms (mediana; 782–809 ms) | 3.877 s (mediana; 3.865–3.945 s) | — |
| TBT | 0 ms (as 3) | 25 ms (mediana; 20–30 ms) | — |

**Resultado: Performance desktop atinge a meta (100 ≥ 95); Performance mobile continua abaixo da
meta (88 < 95).** As outras 3 categorias batem a meta nos dois perfis, com folga.

### Divergência em relação à primeira rodada de medição — desktop 85 → 100

A primeira rodada desta tarefa (rodada única, não mediana) registrou **Performance desktop = 85**,
com TBT = 230 ms. Esta segunda rodada, com 3 execuções isoladas, deu **100 nas 3**, com TBT = 0 ms
nas 3. Isso é uma divergência grande (85 → 100), não uma variação de ruído normal, e preciso
explicá-la em vez de simplesmente substituir o número.

**Causa mais provável**: a medição original de desktop foi feita na mesma sessão em que eu já tinha
rodado, minutos antes, um `npm run build` que — por contenção de recursos da máquina com outros
processos `node` daquela sessão (builds e servidores anteriores ainda vivos) — levou **~20 minutos**
para compilar, um valor completamente anômalo para este projeto (a compilação isolada de agora leva
6–7s). Registrei essa anomalia no relatório da tarefa na hora, mas não conectei os pontos até esta
correção: **é muito provável que o Lighthouse original também tenha rodado sob a mesma contenção de
CPU**, o que infla artificialmente o Total Blocking Time (tempo de main thread ocupado é sensível a
quantos outros processos disputam a CPU no momento da medição) e derruba a nota de Performance. A
mediana mobile (88, TBT 20–30 ms) não mudou entre as duas rodadas — mobile já usa throttling
simulado agressivo do próprio Lighthouse, que domina qualquer ruído de CPU do host; desktop, sem
throttling, é o perfil mais exposto a esse tipo de contaminação ambiental.

**Registro 100 como o número oficial de Performance desktop**, por ser reproduzido de forma idêntica
em 3 execuções isoladas nesta rodada, contra 1 execução não isolada na rodada anterior. O 85 original
fica documentado aqui como não confiável, não como "meta não batida" — não é uma correção que
esconde um número ruim; é a troca de uma medição contaminada por uma medição repetida e estável.

### Por que Mobile não bate 95

- LCP mediana 3,877 s é o maior redutor de nota. CLS = 0 e TBT mediana = 25 ms já estão bons; o
  gargalo mobile é majoritariamente o tempo até o maior elemento pintar sob a rede/CPU simulada do
  Lighthouse (perfil "mobile" do `--throttling-method=simulate`, que emula uma condição mais
  pesada que 4G real — ver nota metodológica em §2).
- O JS inicial da home excede o orçamento de 150 KB (§3), o que contribui para o tempo até
  interatividade, mas o `bootup-time` (0,3 s) e o `mainthread-work-breakdown` (1,2 s) do próprio
  relatório mobile pontuam nota máxima — ou seja, no modelo simulado do Lighthouse, o tempo de
  execução de JS em si não é o gargalo dominante do LCP; é o tempo de rede/CPU simulado até o
  elemento poder pintar.

Não desliguei nenhuma auditoria do Lighthouse nem usei modo mais permissivo para inflar o número.

---

## 2. Core Web Vitals (LCP, INP, CLS)

Duas medições, com metodologia explícita para cada uma — os números **não** foram reconciliados
artificialmente, porque metodologias diferentes de "throttled" produzem números diferentes, e forçar
concordância entre eles seria inventar precisão que não existe.

### 2.1 Lighthouse mobile (fonte primária — comando do brief, `--throttling-method=simulate`) — **número oficial**

O Lighthouse mobile usa o modelo "Lantern" de simulação: aplica uma condição de rede e CPU
sintéticas equivalentes a um aparelho de gama média em conexão degradada — mais pesada que um "4G
bom" típico (confirmado nos `audits.network-rtt` / `network-server-latency` do relatório, que
retornam 0 ms de latência real de localhost, ou seja, todo o atraso reportado vem do modelo
simulado, não da rede física).

Mediana de 3 execuções (saída bruta em §1):

| Métrica | Valor medido (mediana de 3) | Meta | Resultado |
|---|---|---|---|
| LCP | **3,877 s** (3,865–3,945 s nas 3 execuções) | ≤1,8 s | **abaixo da meta** |
| CLS | **0** (0 nas 3 execuções, sem variação) | ≤0,05 | atingida |
| INP | não produzido pelo Lighthouse em modo lab sem interação real (ver 2.2) | ≤150 ms | — |

Praticamente idêntico ao valor da rodada anterior (3,9 s single-run) — **sem divergência relevante**
aqui, ao contrário do desktop em §1. O elemento de LCP identificado pelo Lighthouse é o parágrafo de
abertura do hero (`p.lead`, "Seja um embate com o Poder Público…") — texto, não o vídeo/imagem do
hero. `bootup-time` e `mainthread-work-breakdown` pontuam nota máxima nas 3 execuções.

### 2.2 Medição direta via CDP (perfil "Fast 4G" real + interação real) — complementar

Como o Lighthouse não gera INP em modo lab sem uma interação de usuário, fiz uma medição
complementar: uma sessão Playwright com throttling de rede explícito via Chrome DevTools Protocol
(`Network.emulateNetworkConditions`: 4 Mbps down / 3 Mbps up / 20 ms RTT — perfil "Fast 4G" do
Chrome DevTools) e `Emulation.setCPUThrottlingRate(4)`, medindo LCP/CLS/INP via
`PerformanceObserver` nativo do navegador, com uma interação real pós-hidratação (abrir e fechar o
menu mobile). Script completo preservado em
`.superpowers/sdd/2026-08-31-sprints-1-3/evidence/cwv-fast4g.mjs`, saída bruta das 3 execuções em
`cwv-fast4g-run{1,2,3}.log` na mesma pasta.

Saída literal das 3 execuções:

```
=== run 1 ===
Perfil de rede: Fast 4G via CDP (4 Mbps down / 3 Mbps up / 20 ms RTT), CPU 4x slowdown
Tempo de load (evento load, ms): 1173
LCP (ms): 560.0
CLS: 0.0000
INP aproximado (ms): 72.0
=== run 2 ===
Tempo de load (evento load, ms): 1136
LCP (ms): 484.0
CLS: 0.0563
INP aproximado (ms): 64.0
=== run 3 ===
Tempo de load (evento load, ms): 1131
LCP (ms): 484.0
CLS: 0.0563
INP aproximado (ms): 56.0
```

| Métrica | Mediana de 3 | Meta | Resultado |
|---|---|---|---|
| LCP | 484 ms (484–560 ms) | ≤1,8 s | atingida |
| CLS | **0,0563** (0 / 0,0563 / 0,0563) | ≤0,05 | **abaixo da meta em 2 das 3 execuções** |
| INP (aproximado)¹ | 64 ms (56–72 ms) | ≤150 ms | atingida |

¹ Aproximação via maior `duration` de entradas do `PerformanceObserver({type:'event'})` após a
interação — não é o INP de campo (CrUX), que exige o site em produção com tráfego real. O site
ainda não está publicado, então não existe dado de campo a reportar; isto é uma estimativa de
laboratório.

**Divergência em relação à primeira rodada**: a medição original (execução única) tinha dado LCP
608 ms e CLS 0 — dentro da meta nos dois. Com 3 execuções, o LCP variou pouco (484–560 ms, sempre
dentro da meta) mas **o CLS apareceu em 2 das 3 execuções em 0,0563, acima da meta de 0,05** — a
primeira rodada, por sorte de amostragem de 1 execução só, pegou justamente a única das três que deu
0.

**Achado novo, não corrigido nesta rodada**: para isolar se o deslocamento de layout vinha da minha
interação sintética (abrir/fechar o menu mobile) ou do carregamento da página em si, rodei uma
variante do script **sem nenhuma interação** (`cwv-fast4g-noclick.mjs`, mesmo perfil de rede/CPU),
também 3 vezes:

```
=== no-click run 1 ===
CLS sem interação com o menu: 0.0000
Entradas de layout-shift: []
=== no-click run 2 ===
CLS sem interação com o menu: 0.0563
Entradas de layout-shift: [{"value":0.028138881737745192,"startTime":561.2999999523163},
                            {"value":0.028138881737745192,"startTime":676.3999999761581}]
=== no-click run 3 ===
CLS sem interação com o menu: 0.0563
Entradas de layout-shift: [{"value":0.028138881737745192,"startTime":590.1000000238419},
                            {"value":0.028138881737745192,"startTime":695.5}]
```

O CLS de 0,0563 **não** depende da interação com o menu — acontece (2 de 3 vezes) só com o
carregamento da página, sob CPU 4× mais lenta, como duas entradas idênticas de 0,0281 cada, entre
~560 ms e ~700 ms após a navegação. Não investiguei o elemento/causa exata (não haveria tempo de
corrigir nesta rodada de qualquer forma, e não fui autorizado a mexer em código de produção agora).
**Registro isto como uma preocupação para acompanhamento**: sob CPU mais lenta que a de
desenvolvimento, existe um deslocamento de layout intermitente (~2/3 das cargas, neste teste) que o
Lighthouse não capturou (CLS = 0 nas 6 execuções de Lighthouse, §1) porque o perfil "mobile" do
Lighthouse usa seu próprio modelo de CPU/rede simulado, diferente do CPU-throttling físico via CDP
usado aqui. Recomendo investigar antes do lançamento — meu palpite não confirmado é troca de fonte
(`font-display`) ou o vídeo/imagem do hero estabelecendo sua caixa tardiamente, mas isso é
especulação meu, não uma causa verificada, e não deve ser tratado como fato até ser investigado.

### Leitura conjunta

Os dois métodos concordam em LCP dentro da meta sob rede real (CDP) e discordam do Lighthouse
simulado por causa do perfil de rede/CPU: o Lighthouse mobile usa uma condição propositalmente mais
pesada que "4G" comum, e **continua sendo o número que registro como resultado oficial da meta**
(por ser o comando explicitamente pedido no brief e o mais conservador — não invertido por esta
correção). Sob uma condição de 4G mais realista com CPU 4× mais lenta, a home carrega em bem menos
que 1,8 s de LCP. **Registro o número do Lighthouse (mediana 3,877 s) como o resultado real da meta
de LCP, abaixo do alvo**, e a medição CDP como evidência de que a arquitetura não tem um problema
estrutural de LCP fora do pior caso simulado — mas a medição CDP com 3 execuções revelou, por outro
lado, um problema de CLS intermitente que a rodada única anterior (e o próprio Lighthouse) não
haviam capturado. Isso é registrado como achado novo em aberto, não como meta oficial revista — a
meta oficial de CLS continua "atingida" porque o Lighthouse (a fonte oficial) deu 0 nas 6 execuções.

---

## 3. Orçamento de JavaScript (pendência 1 do brief)

Medido com Playwright: todas as respostas de `http://localhost:3100/` após `waitUntil: 'networkidle'`
mais 2 s de espera adicional (para dar tempo a qualquer prefetch de `next/link` que dependa de
`IntersectionObserver`), separando por presença dos headers `purpose: prefetch` /
`next-router-prefetch` (os mesmos que `middleware.ts` usa para isentar prefetch do CSP).

| Medida | Valor | Meta | Resultado |
|---|---|---|---|
| JS inicial da home (sem prefetch) | **180,8 KB** | ≤150 KB gzip | **abaixo da meta** |
| JS de prefetch (`next/link`) observado | **0,0 KB** | — | — |
| JS total (inicial + prefetch) | **180,8 KB** | — | — |

**Nenhum prefetch de JS foi observado** nesta medição. Explicação: todas as rotas do site são
renderizadas dinamicamente no build atual (`ƒ` no relatório de `next build`, nenhuma rota `○`
estática exceto `robots.txt`, `sitemap.xml` e `manifest.webmanifest`), e o prefetch automático do
`next/link` do App Router não busca o payload completo de rotas totalmente dinâmicas ao entrar no
viewport — só faria isso para rotas estáticas ou com casca estática (PPR), que este projeto não usa.
Por isso "JS inicial" e "JS total" coincidem: **o número de 180,8 KB já é o total, não há prefetch
escondido nele**, e o site excede o orçamento de 150 KB mesmo assim.

### Composição do JS (chunks da home, por tamanho, gzip transferido)

| Chunk | Tamanho | Conteúdo identificado |
|---|---|---|
| `3bzhsy_drjsog.js` | 70,0 KB | React + ReactDOM (runtime) |
| `14jhj3w7qw-q3.js` | 39,1 KB | Next.js App Router (runtime de navegação cliente) |
| `3hwp1plgzc228.js` | 17,2 KB | **Lenis** (scroll suave) |
| `16a7n6wkotffx.js` | 13,2 KB | código de app (componentes cliente) |
| `3gr-965dpz9qb.js` | 9,9 KB | código de app |
| `0mbuuvkmhaaav.js` | 9,7 KB | código de app |
| `09seurq9-r7q4.js` | 9,0 KB | código de app |
| demais (5 arquivos) | 12,7 KB | runtime do Turbopack + bootstrap + código de app |

React + Next.js runtime somam **109,1 KB** — piso inevitável para qualquer site interativo em App
Router com os componentes cliente que este projeto já tem (cabeçalho com menu, alternador de tema,
banner de consentimento, reveal on scroll, vídeo do hero). Não há como remover esse piso sem trocar
de framework, fora de escopo aqui.

### `motion` — dependência morta (pista 1 do brief)

Confirmado: `motion` não é importado por nenhum arquivo do projeto (a Tarefa 4 reescreveu o reveal
para depender só de `animation-timeline: view()` + CSS, sem a biblioteca). Removido de
`package.json` via `npm uninstall motion`.

**Efeito na medição: zero.** Uma dependência não importada nunca entra no bundle do cliente — o
bundler (Turbopack) já não a incluía. A remoção é higiene de dependências (instalação mais rápida,
menos superfície de auditoria de segurança/`npm audit`), não uma redução de bytes transferidos.
Confirmei isso comparando o build antes/depois: os chunks da home são os mesmos.

### `lenis` — custo relatado, não removido (pista 2 do brief)

`lenis` (scroll suave) carrega em **todas as páginas** via `components/smooth-scroll.tsx`, no
layout raiz (`app/(site)/layout.tsx`). Custo isolado: **17,2 KB gzip** — o terceiro maior chunk da
home, atrás só de React e do runtime do Next.js.

**Não removido**, conforme instrução explícita: é decisão de produto (a sensação de rolagem suave é
uma escolha de experiência do cliente), não uma decisão de performance. Se o orçamento de 150 KB for
inegociável, remover o Lenis sozinho reduziria o JS inicial de 180,8 KB para ~163,6 KB — ainda acima
da meta, porque o piso de React + Next.js (109,1 KB) mais o restante do código de app (~54,5 KB) já
excede 150 KB sem o Lenis. Ou seja: **mesmo removendo o Lenis, o orçamento de 150 KB não seria
atingido** com a arquitetura atual — fica registrado para a decisão do cliente/Douglas, não decidido
aqui.

---

## 4. Peso da home e maior asset

Medido com a mesma metodologia do teste `tests/e2e/orcamento.spec.ts` (bytes de rede reais —
`responseBodySize + responseHeadersSize`, não o corpo descomprimido).

| Medida | Valor | Meta | Resultado |
|---|---|---|---|
| Peso total da home | **656,2 KB** | ≤900 KB | atingida |
| Maior asset (`hero.webm`) | **172,0 KB** | ≤600 KB | atingida |

Maiores contribuintes depois do vídeo do hero: duas fontes self-hosted (83,8 KB e 47,9 KB, variável
e peso normal), o chunk de React (70,0 KB) e o HTML do documento (29,4 KB). Nenhum asset individual
chega perto do teto de 600 KB.

---

## 5. Navegadores e larguras testados

**Navegadores**: o ambiente de medição só tem o Chromium instalado pelo Playwright ("Chrome for
Testing" 151.0.7922.34) — não há Safari, Firefox, Edge nem um dispositivo iOS/Android real
disponível nesta máquina/sessão. **Testei apenas em Chromium** (desktop e emulação de viewport
mobile). **Safari, Firefox, Edge, iOS Safari e Chrome Android não foram testados nesta rodada** —
registrado como está, sem simular ou presumir compatibilidade. Recomendo um teste manual real nesses
navegadores antes do lançamento; o CSP estrito (Tarefa 9) e o `animation-timeline: view()` do reveal
(Tarefa 4, com fallback JS para navegadores sem suporte) são os pontos de maior risco de divergência
entre engines.

**Larguras testadas** (Chromium, verificação de overflow horizontal na home, banner de
consentimento fechado):

| Largura | `scrollWidth` | `innerWidth` | Overflow horizontal |
|---|---|---|---|
| 360 px | 360 | 360 | não |
| 390 px | 390 | 390 | não |
| 768 px | 768 | 768 | não |
| 1024 px | 1024 | 1024 | não |
| 1440 px | 1440 | 1440 | não |
| 1920 px | 1920 | 1920 | não |

Nenhuma das seis larguras produz rolagem horizontal na home.

---

## 6. Itens abaixo da meta — resumo

Números desta seção são **mediana de 3 execuções** onde aplicável (Lighthouse, CDP) — ver §1 e §2
para a saída bruta e a metodologia completa.

| Item | Medido | Meta | Motivo |
|---|---|---|---|
| Lighthouse Performance (mobile) | 88 (mediana de 3) | ≥95 | LCP 3,877 s no modelo simulado do Lighthouse |
| LCP mobile (Lighthouse simulado) | 3,877 s (mediana de 3) | ≤1,8 s | Modelo de rede/CPU do Lighthouse mobile é mais pesado que 4G real; ver §2.2 para medição sob perfil Fast 4G real (mediana 484 ms, dentro da meta) |
| JS inicial da home | 180,8 KB | ≤150 KB | Piso de React+Next.js (109,1 KB) + Lenis (17,2 KB, mantido por decisão de produto) + código de app (~54,5 KB); `motion` removido mas já não pesava nada |
| CLS sob CPU 4× throttled (CDP, complementar) | 0,0563 em 2 de 3 execuções | ≤0,05 | **Achado novo desta rodada** (§2.2) — intermitente, não capturado pelo Lighthouse (CLS oficial = 0 nas 6 execuções); não investigado a fundo nem corrigido nesta tarefa, registrado para acompanhamento |

**Corrigido nesta rodada**: Lighthouse Performance desktop, que na primeira medição (execução única)
tinha dado 85, agora mede **100 de forma estável em 3 execuções isoladas** — divergência explicada em
§1 (provável contaminação de CPU por processos concorrentes na sessão da primeira medição). Bate a
meta.

Itens que **bateram** a meta: Acessibilidade (100/100), Boas Práticas (100/100), SEO (100/100) nos
dois perfis, estáveis nas 6 execuções; Performance desktop (100, mediana de 3); CLS oficial via
Lighthouse (0 nas 6 execuções); INP (mediana 64 ms na medição direta); LCP sob perfil Fast 4G real
(mediana 484 ms); peso total da home (656,2 KB); maior asset (172,0 KB); nenhuma rolagem horizontal
nas 6 larguras testadas; zero violações de axe-core (todos os níveis de impacto, não só
sério/crítico) nas 10 rotas auditadas.

---

## 7. Não-regressão de conteúdo (Step 5 do brief)

```
git diff --stat 56fd87d..HEAD -- content/
```

14 arquivos `.mdoc` alterados, **45 inserções, 0 remoções** (`+45 -0` de fato — todo o diff é
aditivo). As únicas mudanças são os campos novos e opcionais introduzidos na Tarefa 15:
`areaKey` (14 arquivos) e, em `mandado-de-seguranca.mdoc`, os blocos `deadlinesTitle`/`deadlines`
(o bloco "O prazo") e `decisiveTitle`/`decisive` (o bloco "O que costuma decidir o caso"). Nenhuma
linha de copy existente foi alterada ou removida em nenhum dos 14 arquivos.

```
git diff 56fd87d..HEAD -- components/site-footer.tsx | grep -E '^[-+].*(Provimento|8\.906|205/2021|OAB)'
```

Este grep, isolado, mostra linhas `-` removidas contendo esses termos — mas é um falso positivo
estrutural: o texto do aviso da OAB foi extraído para `lib/legal-notice.ts` (constante
`OAB_NOTICE`) em um commit anterior a esta tarefa (`5f83f1b`, Tarefa 15), e o rodapé passou a
renderizar `{OAB_NOTICE}` em vez do texto inline. **Conferi que o texto da constante é idêntico,
byte a byte, ao texto antes embutido no componente** — a extração não alterou uma palavra. O
`lib/legal-notice.ts` documenta isso explicitamente: "O parágrafo abaixo é copiado literalmente de
`components/site-footer.tsx`". Além disso, o teste `tests/e2e/acessibilidade.spec.ts` ("os avisos
da OAB estão em todas as páginas") passa nas 10 rotas auditadas, confirmando que o aviso continua
visível em produção, não só presente no código-fonte.

**Conclusão do Step 5: sem regressão de conteúdo.** Nenhum texto institucional, aviso legal ou copy
de área foi alterado ou removido; os avisos da OAB permanecem literalmente intactos e presentes em
todas as páginas.
