# Termômetro de contratações públicas (PNCP)

Camada de dados da página de Licitações: números do Portal Nacional de
Contratações Públicas (Lei 14.133/2021) consultados no servidor, com cache
na CDN da Vercel e reserva em snapshot versionado. Pesquisa e medições
feitas em 07/10/2026; amostras de requisição/resposta em `amostras/`.

## Arquivos

| Arquivo | Papel |
|---|---|
| `lib/pncp/cliente.ts` | fetch com prazo (12 s), 2 novas tentativas com recuo (20 s em 429), concorrência máxima 10, User-Agent do site |
| `lib/pncp/valores.ts` | soma de valores sem baixar tudo: topo exato + faixas de valor (ver Método) |
| `lib/pncp/agregados.ts` | `termometro()`, `porUf()`, `serieDiaria()` |
| `lib/pncp/tipos.ts` | tipos públicos (o que a UI consome) |
| `lib/pncp/ufs.ts` | 27 UFs com capital e coordenadas; modalidades; esferas |
| `lib/pncp/datas.ts` | datas no fuso de Brasília (o PNCP grava e filtra nesse fuso) |
| `lib/pncp/rota.ts` | Cache-Control, último resultado bom em memória, reserva no snapshot |
| `lib/pncp/snapshot.ts` + `snapshot/*.json` | último retrato bom (versionado) |
| `lib/pncp/animacao.ts` | projeção entre atualizações, "atualizado há X min", formatação, textos de fonte para a UI |
| `lib/pncp/usarTermometro.ts` | hook cliente: busca a cada 60 s e projeta os contadores |
| `app/api/pncp/{termometro,uf,serie}/route.ts` | rotas JSON |
| `scripts/pncp/snapshot.mjs` | regenera os snapshots com o mesmo código das rotas |
| `scripts/pncp/verificar.mjs` | testes (node:test), offline; `--vivo` também chama o PNCP |
| `scripts/pncp/carregador.mjs` | permite ao Node puro importar os .ts do projeto (sem dependências) |

```bash
node scripts/pncp/snapshot.mjs            # ~2 min; grava lib/pncp/snapshot/*.json
node scripts/pncp/snapshot.mjs termometro # só uma parte
node scripts/pncp/verificar.mjs           # testes offline
node scripts/pncp/verificar.mjs --vivo    # + termômetro ao vivo
```

## As duas APIs do PNCP

### 1. Busca do portal — `https://pncp.gov.br/api/search/` (a que usamos)

É a API que o próprio site pncp.gov.br usa. Não está no Swagger, mas é
pública, rápida (0,1–0,5 s), devolve **`total` exato** e aceita filtros:

| Parâmetro | Valores / formato |
|---|---|
| `tipos_documento` (obrig.) | `edital` (contratações: editais, avisos e atos de contratação direta), `contrato`, `ata` |
| `status` (obrig.) | `recebendo_proposta`, `propostas_encerradas`, `encerradas`, `todos`; contratos/atas: `vigente`, `nao_vigente` |
| `ufs`, `modalidades`, `esferas`, `tipos`, `municipios`… | listas separadas por `\|` (vírgula devolve 0) |
| `data_publicacao_inicio/_fim`, `data_assinatura_inicio/_fim`, `data_inicio_vigencia_inicio/_fim` | `YYYY-MM-DD` **ou** `YYYY-MM-DDTHH:mm:ss` (Brasília); com espaço → 204 |
| `valor_total_estimado_min/_max`, `valor_global_min/_max` | inclusivos, aceitam centavos |
| `ordenacao` | `-data` (padrão), `data`, `-valor_total_estimado`, `-valor_global`… |
| `pagina`, `tam_pagina` | `pagina × tam_pagina ≤ 10.000`, senão 400 "Janela de resultados muito grande" |

Itens trazem `uf`, `modalidade_licitacao_id/nome`, `esfera_id`,
`valor_total_estimado` (editais), `valor_global` (contratos),
`data_publicacao_pncp`, `data_fim_vigencia` (= fim do recebimento de
propostas em editais), `numero_controle_pncp`. Cada item tem ~3,7 KB.

Peculiaridades medidas:

- **Firewall por User-Agent**: com UA de robô (`curl`, `node`, `Mozilla/5.0 Bot/1.0`) 60–80% das conexões levam *ECONNRESET*. Com UA de navegador seguido da identificação do site, 0%. Por isso `USER_AGENT` em `cliente.ts`.
- **Sem limite de taxa observado**: 90 requisições em 2,6 s com 10 simultâneas, todas 200.
- `cache-control: max-age=120` na resposta: o índice é servido com até 2 min de atraso; o atraso de indexação (publicação → busca) medido foi de ~1 min.
- `/api/search/filters` (facetas) **ignora os filtros**: devolve sempre as facetas globais de todo o índice (1,3 MB). Não serve para "abertas por UF".
- Editais não trazem `valor_global` (é `null`); o valor está em `valor_total_estimado`. ~13% das abertas têm valor 0 (sigiloso ou não informado) e há negativos isolados.
- **Valores atípicos**: entre as abertas há 6 registros ≥ R$ 10 bi que somam R$ 218 bi — metade do total bruto (ex.: R$ 121,9 bi num credenciamento de consórcio de saúde; R$ 26,9 bi num credenciamento de um município pequeno). Nas publicadas em 30 dias, 3 registros somam R$ 1,06 tri. Por isso a UI deve exibir `valorSemAtipicos` (limite R$ 10 bi); o bruto continua no JSON.

### 2. API de Consultas oficial — `https://pncp.gov.br/api/consulta/v1` (só conferência)

Swagger: `https://pncp.gov.br/api/consulta/swagger-ui/index.html` (spec em `/api/consulta/v3/api-docs`).

| Endpoint | Obrigatórios | `tamanhoPagina` |
|---|---|---|
| `/contratacoes/publicacao` | `dataInicial`, `dataFinal` (yyyyMMdd), **`codigoModalidadeContratacao`**, `pagina` | 10–50 |
| `/contratacoes/proposta` | `dataFinal` (= limite superior do **encerramento** das propostas; use `20991231` para "todas abertas"), `pagina`; modalidade e `uf` opcionais | 10–50 |
| `/contratacoes/atualizacao` | como `/publicacao` | 10–50 |
| `/contratos`, `/contratos/atualizacao` | `dataInicial`, `dataFinal`, `pagina` | 10–500 |
| `/atas`, `/atas/atualizacao` | `dataInicial`, `dataFinal` (período de **vigência**), `pagina` | 10–500 |
| `/pca/`, `/pca/usuario`, `/pca/atualizacao` | ano/classificação ou datas (`dataInicio`/`dataFim`) | 10–500 |

Resposta: `{data[], totalRegistros, totalPaginas, numeroPagina, paginasRestantes, empty}`.
Itens: `valorTotalEstimado`, `valorTotalHomologado`, `unidadeOrgao.ufSigla`, `modalidadeId/Nome`, `dataEncerramentoProposta`, `dataPublicacaoPncp`, `orgaoEntidade.esferaId`.

Peculiaridades:

- **Limite de taxa agressivo**: ~20 requisições em poucos segundos → HTTP 429 com página HTML ("Limite de requisições excedido", sem `Retry-After`); libera em 20–60 s.
- Latência muito irregular: a mesma consulta leva 0,1 s ou 21 s (`/proposta?uf=MS`).
- Sem registros → **204 sem corpo**. Erros: 400 (`tamanhoPagina` fora de 10–50/500), 422 (data fora de `yyyyMMdd`).
- Para somar o valor das ~37 mil abertas seriam ~740 páginas de 50 — inviável com esse limite de taxa.
- Números batem com a busca (07/10, 05:16): abertas 38.170 × 38.269; contratos publicados em 06/10: 8.496 × 8.494.

### CORS

Ambas respondem `Access-Control-Allow-Origin: *` (a busca também a `OPTIONS`, com `max-age` de 20 dias). O navegador **poderia** chamar direto, mas não deve: o UA do navegador do visitante funciona, porém cada visita viraria ~200 chamadas ao PNCP e não haveria reserva. Tudo passa pelas rotas do site.

### Outras fontes avaliadas

- **Compras.gov.br Dados Abertos** (`dadosabertos.compras.gov.br/modulo-contratacoes/1_consultarContratacoes_PNCP_14133`): responde 200, mas devolveu 0 registros para todas as datas testadas (2024–2026) em 07/10/2026; descartada.
- **Portal da Transparência**: exige chave e cobre só o Executivo federal; descartado.
- Não há painel/endpoint oficial de estatísticas agregadas por período ou UF; os totais vêm da busca.

## O que dá para obter, e como

| Número | Endpoint (busca) | Req. por montagem | Frescor | Exato? |
|---|---|---|---|---|
| Abertas (nacional) | `edital` + `recebendo_proposta` | 1 | ~2–3 min | exato |
| Abertas por modalidade / esfera | + `modalidades=` / `esferas=` | 13 + 4 | ~2–3 min | exato |
| Valor estimado em aberto | `-valor_total_estimado` (200) + ~33 faixas | ~35 | 15 min | estimado, erro medido +0,3% (intervalo garantido no JSON) |
| Publicadas hoje (+ valor) | `edital`+`todos`+`data_publicacao` = hoje | 1 + ~27 | ~2–3 min / 15 min | contagem exata; valor exato se ≤ 1.000, senão estimado |
| Ritmo (publicações/min) | mesma busca, janela da última hora | 1 | ~2–3 min | exato (média da última hora) |
| Publicadas 24 h | janela `T-24h … T` com hora | 1 | ~2–3 min | exato |
| Publicadas 30 dias (+ valor) | `data_publicacao` 30 dias | 1 + ~35 | ~2–3 min / 15 min | contagem exata; valor estimado |
| Contratos assinados no mês (+ valor) | `contrato` + `data_assinatura` | 1 + ~28 | ~2–3 min / 15 min | contagem exata; valor estimado. Publicação atrasa dias: o mês "cresce para trás" |
| Contratos publicados hoje (+ valor) | `contrato` + `data_publicacao` = hoje | 1 + ~28 | ~2–3 min / 15 min | idem |
| Por UF: abertas, publicadas 30 d | + `ufs=XX` | 54 | 3 h | exato |
| Por UF: valor em aberto | topo + 2 faixas/década por UF (ou soma exata se ≤ 1.000) | ~170 | 3 h | ~±1% por UF, intervalo no JSON |
| Série diária (365 dias) | 1 contagem por dia | 7 (com snapshot) / 365 (sem) | 1 h | exato |

Termômetro inteiro: ~180 requisições. A frio: 13–17 s de madrugada; ~31 s
em horário comercial (07/10, 11h30: mediana 0,18 s por chamada, p90 5,6 s,
algumas estourando o prazo de 12 s e repetidas). Com o Data Cache quente
(faixas valem 15 min) sobram ~25 contagens. Como a CDN serve o anterior
enquanto revalida, o visitante não espera essa conta. UF: ~225 requisições, ~60 s a frio (medido). Série: ~7 requisições.

## Método da soma de valores (`valores.ts`)

1. **Topo exato**: baixa os 200 maiores valores (`ordenacao=-valor…`, ~0,7 MB) e soma um a um. É onde estão o grosso do dinheiro e os atípicos.
2. **Faixas**: abaixo do 200º valor *T*, conta exatamente quantos registros caem em cada faixa geométrica de R$ 1 a *T* (4 por década; 2 no mapa por UF). Cada faixa entra com contagem × média log-uniforme; os limites `contagem × piso` e `contagem × teto` formam o `intervalo` — a soma verdadeira está garantidamente dentro dele.
3. Até 1.000 registros, baixa tudo e soma exato (`metodo: 'soma-exata'`).

Validação em 07/10/2026 contra a soma completa das 38.269 abertas
(36 páginas de 2.000, 141 MB, 38 s): R$ 421,85 bi brutos; o método deu
R$ 423,2 bi (+0,32%) com ~35 requisições pequenas.

## Estratégia de tempo real na Vercel

Não há banco. O dado mora em quatro camadas (ver `lib/pncp/rota.ts`):

1. **CDN da Vercel** — `Cache-Control: public, max-age=0, s-maxage=N, stale-while-revalidate=M`. Depois da primeira montagem, todo visitante recebe a resposta do cache e a revalidação ocorre em segundo plano: ninguém espera o PNCP.
   - termômetro: `s-maxage=120, swr=3600`
   - uf: `s-maxage=10800, swr=86400`
   - série: `s-maxage=3600, swr=86400`
   - resposta vinda de reserva: `s-maxage=60, swr=600` (tenta de novo logo)
2. **Data Cache do Next** — cada chamada pequena ao PNCP leva `next.revalidate` (contagens 120 s; faixas de valor 900 s; dias passados da série 86.400 s). Respostas > 2 MB não entram (limite do Next) — por isso o topo é de 200 itens (~0,7 MB) e não 2.000.
3. **Memória da instância** — último resultado bom, se o PNCP cair entre duas montagens.
4. **Snapshot no repositório** — `lib/pncp/snapshot/*.json`; reserva final e histórico da série. Falha parcial vira reserva só daquela parte (`procedencia.fonte = 'snapshot'` + aviso em `avisos[]`). As rotas nunca devolvem erro à UI.

Prazos: termômetro 45 s (somas de valor param aos 36 s: se só a soma falhar, a contagem ao vivo é mantida e o valor vem do retrato), UF 50 s, série 40 s; `maxDuration = 60` nas três rotas.

**Cron (opcional).** Com `stale-while-revalidate` a CDN já mantém tudo
quente enquanto houver visitas. Para garantir o mapa fresco mesmo sem
visitas, o líder pode adicionar ao `vercel.json` (não editado aqui):

```json
{ "crons": [ { "path": "/api/pncp/uf", "schedule": "0 */3 * * *" } ] }
```

O cron só "aquece" a função (e o Data Cache das faixas); a CDN pode não
guardar a resposta dele. Sem banco, o snapshot do repositório é a única
reserva durável — regenere-o de tempos em tempos (`node scripts/pncp/snapshot.mjs` + commit) para a série não depender de 365 chamadas a frio.

**Prós/contras de usar o cache como armazenamento**: zero infraestrutura e
latência de CDN; em troca, cada região da Vercel monta sua própria cópia,
um deploy novo começa com a CDN fria (o snapshot cobre) e não há histórico
além do que estiver no snapshot (a série diária é reconstruível a qualquer
momento pela busca, então isso não é problema).

## Cadência no cliente e animação

- O hook `usarTermometro()` busca `/api/pncp/termometro` a cada **60 s** (pausa com a aba oculta). Como a CDN renova a cada 2 min, o número real muda no máximo a cada ~2 min.
- **Publicadas hoje** avança entre leituras no `ritmoPorMinuto` real da última hora (`projetarContador`), por no máximo 3 min, e zera a projeção à meia-noite de Brasília.
- **Valor em aberto** segue a taxa observada entre as duas últimas leituras reais (`projetarPorTaxa`), também por no máximo 3 min. Na primeira leitura fica parado.
- Ao chegar o valor real, transite com `suavizar()` (ease-out) do número exibido para o real.
- Mostre sempre `rotuloAtualizado(procedencia.consultadoEm)` — a hora real da consulta, não a do relógio da animação.

## Textos para a UI (em `AVISOS_UI`, `lib/pncp/animacao.ts`)

- **Fonte**: "Fonte: PNCP — Portal Nacional de Contratações Públicas (Lei 14.133/2021). Dados públicos consultados automaticamente; contagens atualizadas a cada 2 minutos, valores a cada 15 minutos e o mapa por estado a cada 3 horas."
- **Valores**: "Valores estimados informados pelos próprios órgãos ao publicar a contratação. A soma exclui registros acima de R$ 10 bilhões, em regra erros de cadastro, e pode variar cerca de 1% em relação à soma registro a registro."
- **Animação**: "Entre uma atualização e outra, os contadores avançam no ritmo observado na última hora; é uma projeção, conferida a cada nova consulta."
- **Abertas**: "Contratações com recebimento de propostas aberto ou a abrir, em todo o país."
- **Reserva** (quando `fonte === 'snapshot'`): "O PNCP não respondeu agora; exibindo o último retrato salvo."

Outras ressalvas de redação:

- "Publicadas" inclui dispensas e inexigibilidades (atos e avisos de contratação direta), não só editais de licitação.
- Credenciamentos (~12 mil) ficam "abertos" por meses e pesam nas abertas.
- Contratos "assinados no mês" crescem nos dias seguintes, porque a publicação atrasa.
- Fins de semana têm ~30–150 publicações/dia contra ~6.000 nos dias úteis: o mapa de calor mostra isso, não é falha.
