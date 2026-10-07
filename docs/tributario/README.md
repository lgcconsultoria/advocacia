# Assessoria Tributária — simulação Simples puro × Simples híbrido

Núcleo técnico da página de Assessoria Tributária: um simulador correto e explicável, um filme
em código ("a fatura de R$ 100 mil"), uma fatura em 3D e um simulador interativo. Tudo em
`lib/tributario/`, `components/tributario/` e `scripts/tributario/`.

> **Simulação ilustrativa.** O resultado depende do estudo com os dados da empresa. Nenhum
> texto desta página promete resultado (Provimento OAB 205/2021).

## Arquivos

| Arquivo | O que é |
|---|---|
| `lib/tributario/simulador.ts` | Funções puras: `simular`, `simularAnos`, `simularDemo`, `aliquotaEfetiva`, `aliquotasDoAno`, `aliquotasNoDas`, `reais`, `pct`, `CENARIO_DEMO`, `PRAZOS_OPCAO`. Sem dependências. |
| `components/tributario/fatura-filme.tsx` | `FaturaFilme` — filme roteirizado (44,5 s, 5 capítulos), função pura do tempo. |
| `components/tributario/fatura-3d.tsx` | `Fatura3D` — a nota em CSS 3D (preserve-3d), inclina com o mouse, gira ao arrastar e se separa em duas camadas (custo líquido / IBS+CBS). |
| `components/tributario/simulador.tsx` | `SimuladorTributario` — controles, puro × híbrido lado a lado, veredito, passo a passo, premissas e fontes, CTA. |
| `components/tributario/numero-animado.tsx` | Número que desliza até o novo valor. |
| `components/tributario/linha-do-tempo.ts` | Curvas e utilitários de tempo do filme. |
| `scripts/tributario/verificar.mjs` | Testes (`node:test`) contra o motor em Python. |
| `scripts/tributario/harness.mjs` | Monta um app Next isolado, fora do repositório, para ver e gravar os componentes. |
| `scripts/tributario/exportar-filme.mjs` | Exporta o filme em MP4 quadro a quadro (Chrome + ffmpeg). |
| `public/assets/video/fatura-simples-hibrido.mp4` (+ `.jpg`, `-vertical.mp4`) | O filme exportado: 1920×1080, pôster e 1080×1920. |

### Props exportadas

```ts
<SimuladorTributario
  inicial?: Partial<EntradaSimulacao>          // padrão: CENARIO_DEMO
  onDiagnostico?: (r: ResultadoSimulacao) => void  // o botão só aparece se for passado
  rotuloCta?: string                            // "Quero o estudo com os números da minha empresa"
  className?: string
/>

<FaturaFilme
  entrada?: EntradaSimulacao      // padrão: CENARIO_DEMO
  formato?: 'auto' | 'paisagem' | 'retrato'   // auto: vertical abaixo de 640 px de largura
  autoPlay?: boolean              // padrão true: toca ao entrar na tela (45% visível)
  tempo?: number                  // ms; modo controlado (exportação)
  semControles?: boolean          // esconde play/pausa, barra e capítulos
  moldura?: boolean               // borda e cantos (padrão true)
  className?: string
/>

<Fatura3D
  entrada?: EntradaSimulacao      // padrão: CENARIO_DEMO
  regimeInicial?: 'puro' | 'hibrido'  // padrão 'hibrido'
  separarAoRolar?: boolean        // padrão true
  className?: string
/>
```

O filme e o simulador são componentes de cliente (`'use client'`). O filme já é escuro (palco
tinta); os controles abaixo dele usam texto branco, então devem ficar dentro de uma seção
`.planta`. O simulador e a fatura 3D foram desenhados sobre o papel.

## O modelo

O simulador é a porta, em escala de uma empresa e de uma fatura, do motor de diagnóstico do
escritório (`Sistema-Juridico/packages/juridico/diagnostico`, regras `v2026.09`, dossiê
`docs/superpowers/specs/2026-09-23-diagnostico-lc214-regras.md`). As tabelas foram exportadas do
YAML do motor e as fórmulas seguem `motor/simples.py` e `motor/regimes.py`. Os testes conferem
7 cenários contra o motor (DAS, IBS/CBS, crédito entregue e custo do cliente por R$ 100, com
tolerância de R$ 0,02) e, se o motor estiver na máquina, rodam o Python ao vivo.

Notação: `R` receita (ou valor da fatura), `ef` alíquota efetiva do Simples, `%CBS`, `%IBS`,
`%ISS` a partilha da faixa no ano, `a` = CBS + IBS do ano no regime regular.

1. **Alíquotas do ano** (regime regular, alíquota cheia): 2027–2028 `CBS = CBSref − 0,1 p.p.`,
   `IBS = 0,1%`; 2029–2032 `CBS = CBSref`, `IBS = IBSref × 10%…40%`; 2033 cheias. Referência
   estimada: CBS 9,21% + IBS 18,70% = 27,91%. Em 2027: 9,11% + 0,10% = **9,21%**.
2. **Alíquota efetiva**: `ef = (RBT12 × nominal − deduzir) ÷ RBT12`. Anexo V vai ao III com
   fator R ≥ 28%. Na 5ª faixa do Anexo III, acima de 14,92537%, vale o teto de ISS da nota (*).
3. **Simples puro**: `DAS = R × ef` (CBS e IBS já estão dentro). Crédito do cliente =
   `R × ef × (%CBS + %IBS)` — só o que o DAS cobrou.
4. **Simples híbrido** (preço mantido, padrão do motor): a base do preço é `R ÷ (1 + a)` (o
   IBS/CBS sai de dentro do valor; o RBT12 também). `DAS = base × (ef − %CBS·ef − %IBS·ef)`.
   IBS/CBS destacado = `base × (1 − ef × %ISS) × a` (base sem o ISS que segue no DAS).
   Crédito das compras = `compras × a ÷ (1 + a)`. A recolher = destacado − crédito (por tributo,
   nunca negativo). Crédito do cliente = todo o destacado.
5. **Os dois lados** (por fatura): custo líquido do cliente = valor pago − crédito; imposto
   líquido da empresa = DAS + IBS/CBS a recolher; imposto da cadeia = imposto da empresa −
   crédito do cliente.
6. **Veredito** (no ano, com o % B2B): se o híbrido não tira imposto da cadeia → "o Simples puro
   segue melhor"; se tira até 2% (empate técnico do motor) → empate; se tira mais e a empresa não
   perde → híbrido; se o cliente ganha e a empresa paga mais → "reduz o custo do seu cliente em
   R$ X por fatura", com o aviso de que a economia só chega à empresa se o preço for renegociado.

## Cenário de demonstração — "a fatura de R$ 100 mil"

Empresa de serviços B2B no Simples (consultoria do Anexo V com fator R de 30% → **Anexo III**),
RBT12 de **R$ 1,8 milhão** (4ª faixa, `ef` 14,02%), compras creditáveis de **20%** da receita,
100% das vendas a empresas do regime regular, preço mantido.

### 2027 (transição)

| Por fatura de R$ 100.000 | Simples puro | Simples híbrido | Diferença |
|---|---:|---:|---:|
| DAS | 14.020,00 | 10.567,34 | |
| CBS + IBS dentro do DAS | 2.327,32 | — | |
| IBS/CBS destacados (9,21%) | — | 8.054,03 | |
| Crédito das compras da empresa | — | 1.686,66 | |
| IBS/CBS a recolher | — | 6.367,37 | |
| **Imposto líquido da empresa** | **14.020,00** | **16.934,71** | **+ 2.914,71** |
| **Crédito do cliente** | 2.327,32 | 8.054,03 | |
| **Custo líquido do cliente** | **97.672,68** | **91.945,97** | **− 5.726,71** |
| Imposto que fica na cadeia | 11.692,68 | 8.880,68 | − 2.812,00 |

No ano (R$ 1,8 mi): DAS puro 252.360,00; híbrido 190.212,14 de DAS + 114.612,66 de IBS/CBS =
304.824,80 (+ 52.464,80); crédito entregue aos clientes 41.891,76 × 144.972,52; imposto da
cadeia 50.615,96 menor no híbrido. Custo do cliente por R$ 100: 97,67 × 91,95 (iguais ao motor).

**Onde aparece a "economia", honestamente:** no **cliente** (R$ 5,7 mil a menos por fatura). Com
o preço mantido, a **empresa paga R$ 2,9 mil a mais**. A diferença (R$ 2,8 mil por fatura) é o
espaço para renegociar o preço; sem renegociação, o puro segue melhor para o caixa da empresa.

### 2033 (regime pleno)

| Por fatura | Puro | Híbrido | Diferença |
|---|---:|---:|---:|
| Imposto líquido da empresa | 14.020,00 | 22.815,18 | + 8.795,18 |
| Crédito do cliente | 6.883,82 | 21.820,03 | |
| Custo líquido do cliente | 93.116,18 | 78.179,97 | − 14.936,21 |
| Imposto da cadeia | 7.136,18 | 995,15 | − 6.141,03 |

Série do imposto a menos na cadeia por fatura (2027 → 2033): 2.812 · 2.812 · 3.274 · 3.704 ·
4.102 · 4.472 · 6.141.

### Quando o híbrido **não** compensa (exemplos do teste)

- Vendas a pessoas físicas (B2B 10%, R$ 500 mil): o puro segue melhor — ninguém aproveita o
  crédito cheio e a empresa só passaria a recolher mais.
- Mesmo a empresa B2B do demo, se só 30% das vendas forem a empresas do regime regular.
- Com o IBS/CBS cobrado **por cima** do preço, o cliente fica com custo líquido **maior** que no
  puro (100,00 × 93,12 por R$ 100 em 2033): a vantagem passa toda para a empresa e o cliente pode
  resistir ao reajuste.
- O híbrido baixa o imposto da **própria** empresa só com muitos insumos creditáveis (ex.: 70% da
  receita em 2033).

## Premissas e fontes

Cada premissa sai em `resultado.premissas` com a fonte e a natureza (`lei`, `premissa`,
`estimativa`); o simulador as mostra em "Premissas e fontes".

| Premissa | Fonte | Natureza |
|---|---|---|
| Referência IBS 18,70% + CBS 9,21% = 27,91% (não é alíquota legal; resolução do Senado pendente) | LC 214/2025, art. 349; art. 353, § 2º; Res. CGIBS 14/2026, Anexo, Quadro 2 | estimativa |
| Cronograma 2027–2033 (CBS − 0,1 p.p. e IBS 0,1% em 2027–28; IBS 10–40% em 2029–32; cheio em 2033) | LC 214/2025, arts. 344, 347, 361 a 365; ADCT, arts. 127 a 129 | lei (2029–32: número é premissa) |
| DAS pela alíquota efetiva; tabelas com CBS e IBS na partilha | LC 123/2006, art. 18, § 1º-A; Anexos III e V (Anexos XX e XXII da LC 214, com a LC 227/2026) | lei |
| Puro: cliente credita só o cobrado no DAS | LC 214/2025, art. 47, § 9º, II; LC 123/2006, art. 23, §§ 1º-A e 2º | lei |
| Híbrido: opção pelo regime regular; parcelas de IBS/CBS saem do DAS (fórmula do DAS é leitura do escritório) | LC 214/2025, art. 41, § 3º; LC 123/2006, art. 13, §§ 9º e 10 | premissa |
| Híbrido: cliente credita todo o destacado; PF e Simples puro não creditam | LC 214/2025, art. 47, caput, §§ 2º, I, 3º e 9º, I | lei |
| Base do IBS/CBS no híbrido sem o ISS que segue no DAS | LC 214/2025, art. 12, § 2º, V | premissa |
| Preço mantido: IBS/CBS sai de dentro do preço; receita do Simples sem IBS/CBS | LC 214/2025, art. 12, § 2º, I; DL 1.598/1977, art. 12, § 4º | premissa |
| Crédito das compras = compras × a ÷ (1 + a), fornecedores do regime regular | LC 214/2025, art. 47, caput, §§ 1º e 10; art. 57 | premissa |
| Cliente no regime regular, uso na própria atividade; IBS e CBS apurados à parte | LC 214/2025, art. 47, § 1º, I; art. 57 | premissa |
| Fator R 28% | LC 123/2006, art. 18, §§ 5º-J e 5º-M | lei |
| Split payment muda o momento, não o valor; sem ele, o crédito não depende do pagamento | LC 214/2025, arts. 31 a 35 e 48 | lei |
| Prazos da opção: 1º semestre de 2027 até 30/10/2026; desistência de 3/11 a 20/12/2026; próxima janela em março de 2027 | Res. CGSN 194/2026; LC 123/2006, art. 13, § 10 | a confirmar no DOU |

## Limitações (o que o simulador não faz)

- Receita acima do sublimite de R$ 3,6 milhões (ISS e IBS fora do DAS) — recusa com `RangeError`.
- Comércio e indústria (Anexos I e II não estão tabelados no motor), Anexo IV.
- Reduções de alíquota de regimes diferenciados (educação, eventos, saúde etc.).
- Compras de fornecedores do Simples puro (dão crédito menor), uso e consumo pessoal.
- Saldo credor e ressarcimento (que travam a volta ao puro — LC 214, art. 41, § 5º).
- FGTS e encargos (iguais nos dois regimes), fluxo de caixa do split payment, custos de
  conformidade do regime regular.
- A fatura usa as taxas do ano da empresa; não recalcula faixa por nota.
- Aritmética em ponto flutuante com arredondamento a centavos (o motor usa `Decimal`):
  diferenças de até R$ 0,02 nos totais anuais.

## Textos para a página (linguagem simples, sóbria)

**Títulos (candidatos)**

1. Simples puro ou híbrido? A resposta está nos números da sua empresa.
2. Uma fatura de R$ 100 mil, dois regimes, dois resultados.
3. Seu cliente vai querer crédito de IBS e CBS. Quanto isso pesa na sua nota?
4. A Reforma Tributária mudou a conta do Simples. Antes de decidir, faça a conta.

**Abertura**

A partir de 2027, a empresa do Simples Nacional pode continuar no regime único ou recolher o IBS
e a CBS por fora, pelo regime regular — o chamado "Simples híbrido". A escolha muda duas coisas
ao mesmo tempo: quanto imposto a sua empresa recolhe e quanto crédito o seu cliente pode tomar.

**Como funciona (três parágrafos)**

*No Simples puro*, o IBS e a CBS vêm dentro do DAS. O cliente que é empresa do regime regular só
pode creditar a parcela que o DAS cobrou desses tributos — em geral, uma fração pequena da nota.

*No Simples híbrido*, o IBS e a CBS saem do DAS e são destacados na nota. A sua empresa passa a
creditar o imposto das compras, e o cliente credita todo o valor destacado. Para quem vende a
outras empresas, isso pode baratear a fatura para o cliente.

*O outro lado da conta*: com o preço mantido, a empresa pode passar a recolher mais. Quando a
maior parte das vendas é para pessoas físicas, ou quando há poucas compras com crédito, o
Simples puro tende a continuar melhor. Por isso a decisão pede um estudo com os dados reais.

**O estudo tributário**

- Diagnóstico com os números da empresa: faturamento, folha, compras e perfil dos clientes.
- Simulação ano a ano, de 2027 a 2033, nos dois regimes.
- Decisão e opção dentro do prazo: para o 1º semestre de 2027, até 30/10/2026 (desistência de
  3/11 a 20/12/2026); a próxima janela é em março de 2027.
- Contratos: cláusulas de preço líquido de IBS/CBS e de reequilíbrio com os clientes.

**Microtextos**

- Veredito: gerado pelo simulador ("Neste cenário, …").
- Rodapé do simulador e do filme: "Simulação ilustrativa. O resultado depende do estudo com os
  dados da sua empresa."
- CTA: "Quero o estudo com os números da minha empresa".

**Evitar**: "economize", "pague menos imposto", "garantido", "o melhor regime", percentuais de
economia sem cenário. Sempre "pode", "depende", "neste cenário".

## Como rodar

```bash
# testes (Node 24, remoção de tipos nativa)
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test scripts/tributario/verificar.mjs

# app isolado para ver os componentes (fora do repositório; webpack, porque o Turbopack
# recusa node_modules em link simbólico)
node scripts/tributario/harness.mjs /tmp/harness-tributario
(cd /tmp/harness-tributario && npx next dev --webpack -p 3123)   # /vitrine e /filme

# exportar o filme (com o harness no ar)
node scripts/tributario/exportar-filme.mjs --url http://localhost:3123   # [--so paisagem|retrato]
```

## O que o tributarista precisa confirmar

1. **Fórmula do DAS no híbrido** — `R × ef × (1 − %CBS − %IBS)`: o texto diz que as parcelas
   "não serão cobradas pelo regime único" (LC 123, art. 13, § 9º), não como calcular; aguardar a
   regulamentação do CGSN.
2. **Base do IBS/CBS sem o ISS que fica no DAS** (art. 12, § 2º, V) — a alternativa
   conservadora (`baseHibridoDeduzIss: false`) aumenta o IBS/CBS destacado em cerca de 4,7%
   (no demo de 2027, de R$ 8.054,03 para cerca de R$ 8.433,29).
3. **Alíquota de referência** de 27,91% (estimativa orçamentária; a resolução do Senado sai até
   15/12/2026) e os números de 2029–2032 (o IBS por fração da referência é premissa).
4. **Prazos da opção** atribuídos à Res. CGSN 194/2026 (até 30/10/2026; desistência de 3/11 a
   20/12/2026; janela de março de 2027) — o dossiê do motor cita as Res. CGSN 186 e 190 (opção em
   setembro, cancelamento até 30/11). Conferir no DOU antes de publicar.
5. **Crédito do cliente** igual ao destacado, condicionado à extinção do débito quando o split
   payment estiver implantado (art. 47, caput; art. 48).
6. **Fator R** no híbrido: o motor mede a folha contra a receita sem IBS/CBS; uma empresa perto
   de 28% pode mudar de anexo ao optar.
7. **Enquadramento de exemplo** (consultoria → Anexo V, com fator R → III) e os exemplos de
   atividades exibidos no simulador.
