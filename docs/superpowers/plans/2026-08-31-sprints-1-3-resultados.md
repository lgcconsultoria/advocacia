# Resultados de verificação — Sprints 1–3 (Tarefa 16)

Data da medição: 2026-09-01 (ambiente local, build de produção `npm run build && npm run start`, porta 3100).
Commit medido: HEAD desta branch, após as tarefas 1–16 (`feat/sprints-1-3`).

Este documento registra os critérios do §11 do spec que não são automatizáveis por teste.
**Todo número abaixo é o resultado real medido — inclui os que ficaram abaixo da meta.**

---

## 1. Lighthouse

Comandos exatamente como no brief da Tarefa 16 (§ Step 4), contra o build de produção local:

```
npx lighthouse http://localhost:3100 --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=/tmp/dsa/lh-desktop.json
npx lighthouse http://localhost:3100 --form-factor=mobile --throttling-method=simulate --quiet --chrome-flags="--headless" --output=json --output-path=/tmp/dsa/lh-mobile.json
```

Chrome usado: "Chrome for Testing" 151.0.7922.34 (o Chromium instalado pelo Playwright — não
havia Chrome/Chromium do sistema no ambiente de medição). Lighthouse 13.4.1.

| Categoria | Desktop | Mobile | Meta |
|---|---|---|---|
| Performance | **85** | **88** | ≥95 — **abaixo da meta** |
| Acessibilidade | **100** | **100** | ≥95 — atingida |
| Boas Práticas | **100** | **100** | ≥95 — atingida |
| SEO | **100** | **100** | ≥95 — atingida |

3 das 4 categorias batem a meta em ambos os perfis, com folga. **Performance fica abaixo do alvo
nos dois perfis** (85 desktop, 88 mobile).

### Por que Performance não bateu 95

- **Desktop**: LCP 1,0 s e FCP 0,4 s são bons; o que pesa é *Total Blocking Time* = 230 ms — tempo de
  main thread ocupado durante o carregamento, correlacionado ao JS transferido na home (ver §3, JS
  acima do orçamento de 150 KB).
- **Mobile**: LCP 3,9 s é o maior redutor de nota (ver §2). CLS = 0 e TBT = 80 ms já estão bons; o
  gargalo mobile é majoritariamente o tempo até o maior elemento pintar sob a rede/CPU simulada do
  Lighthouse (perfil "mobile" do `--throttling-method=simulate`, que emula uma condição mais
  pesada que 4G real — ver nota metodológica em §2).
- Causa raiz comum às duas: **o JS inicial da home excede o orçamento de 150 KB** (§3). Reduzi-lo
  exigiria mover mais componentes interativos (cabeçalho, tema, consentimento, reveal, Lenis) para
  menos JS no cliente — mudança arquitetural fora do escopo desta tarefa de medição e portão.

Não desliguei nenhuma auditoria do Lighthouse nem usei modo mais permissivo para inflar o número.

---

## 2. Core Web Vitals (LCP, INP, CLS)

Duas medições, com metodologia explícita para cada uma — os números **não** foram reconciliados
artificialmente, porque metodologias diferentes de "throttled" produzem números diferentes, e forçar
concordância entre eles seria inventar precisão que não existe.

### 2.1 Lighthouse mobile (fonte primária — comando do brief, `--throttling-method=simulate`)

O Lighthouse mobile usa o modelo "Lantern" de simulação: aplica uma condição de rede e CPU
sintéticas equivalentes a um aparelho de gama média em conexão degradada — mais pesada que um "4G
bom" típico (confirmado nos `audits.network-rtt` / `network-server-latency` do relatório, que
retornam 0 ms de latência real de localhost, ou seja, todo o atraso reportado vem do modelo
simulado, não da rede física).

| Métrica | Valor medido | Meta | Resultado |
|---|---|---|---|
| LCP | **3,9 s** | ≤1,8 s | **abaixo da meta** |
| CLS | **0** | ≤0,05 | atingida |
| INP | não produzido pelo Lighthouse em modo lab sem interação real (ver 2.2) | ≤150 ms | — |

O elemento de LCP identificado pelo Lighthouse é o parágrafo de abertura do hero
(`p.lead`, "Seja um embate com o Poder Público…") — texto, não o vídeo/imagem do hero. O
`bootup-time` (0,3 s) e o `mainthread-work-breakdown` (1,2 s) pontuam nota máxima, ou seja, o tempo
de execução de JS em si não é o gargalo dominante no modelo simulado; o modelo penaliza sobretudo o
tempo de rede/CPU até o elemento poder pintar.

### 2.2 Medição direta via CDP (perfil "Fast 4G" real + interação real) — complementar

Como o Lighthouse não gera INP em modo lab sem uma interação de usuário, fiz uma medição
complementar: uma sessão Playwright com throttling de rede explícito via Chrome DevTools Protocol
(`Network.emulateNetworkConditions`: 4 Mbps down / 3 Mbps up / 20 ms RTT — perfil "Fast 4G" do
Chrome DevTools) e `Emulation.setCPUThrottlingRate(4)`, medindo LCP/CLS/INP via
`PerformanceObserver` nativo do navegador, com uma interação real pós-hidratação (abrir e fechar o
menu mobile).

| Métrica | Valor medido | Meta | Resultado |
|---|---|---|---|
| LCP | 608 ms | ≤1,8 s | atingida |
| CLS | 0 | ≤0,05 | atingida |
| INP (aproximado)¹ | ≈104 ms | ≤150 ms | atingida |

¹ Aproximação via maior `duration` de entradas do `PerformanceObserver({type:'event'})` após a
interação — não é o INP de campo (CrUX), que exige o site em produção com tráfego real. O site
ainda não está publicado, então não existe dado de campo a reportar; isto é uma estimativa de
laboratório.

### Leitura conjunta

Os dois métodos concordam em CLS (0, sólido) e discordam em LCP por causa do perfil de rede/CPU
simulado: o Lighthouse mobile usa uma condição propositalmente mais pesada que "4G" comum, e é o
número que registro como resultado oficial da meta (por ser o comando explicitamente pedido no
brief e o mais conservador). Sob uma condição de 4G mais realista com CPU 4× mais lenta, a home
carrega em bem menos que 1,8 s. **Registro o número do Lighthouse (3,9 s) como o resultado real da
meta de LCP, abaixo do alvo**, e a medição CDP como evidência de que a arquitetura não tem um
problema estrutural de LCP fora do pior caso simulado.

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

| Item | Medido | Meta | Motivo |
|---|---|---|---|
| Lighthouse Performance (desktop) | 85 | ≥95 | TBT 230 ms, correlacionado ao JS acima do orçamento |
| Lighthouse Performance (mobile) | 88 | ≥95 | LCP 3,9 s no modelo simulado do Lighthouse |
| LCP mobile (Lighthouse simulado) | 3,9 s | ≤1,8 s | Modelo de rede/CPU do Lighthouse mobile é mais pesado que 4G real; ver §2.2 para medição sob perfil Fast 4G real (608 ms, dentro da meta) |
| JS inicial da home | 180,8 KB | ≤150 KB | Piso de React+Next.js (109,1 KB) + Lenis (17,2 KB, mantido por decisão de produto) + código de app (~54,5 KB); `motion` removido mas já não pesava nada |

Itens que **bateram** a meta: Acessibilidade (100/100), Boas Práticas (100/100), SEO (100/100) nos
dois perfis; CLS (0 nas duas medições); INP (~104 ms na medição direta); peso total da home
(656,2 KB); maior asset (172,0 KB); nenhuma rolagem horizontal nas 6 larguras testadas; zero
violações de axe-core (todos os níveis de impacto, não só sério/crítico) nas 10 rotas auditadas.

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
