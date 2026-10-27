# 03 — Auditoria de conteúdo (Fase 4) — LLM SEO / GEO

Escopo: páginas de dor e de licitações, áreas de atuação. Os artigos do blog são tratados por outra frente. Nenhuma página foi reescrita nesta fase além do que a parte técnica exige (autoria e data, FAQ no HTML).
Critérios (nota 0-10 por grupo): (a) resposta direta nas 2 primeiras frases; (b) trechos citáveis de 40 a 80 palavras; (c) quem, o quê e para quem; (d) fatos verificáveis (lei, artigo, prazo); (e) autor e data visíveis.
Método: leitura dos arquivos-fonte e contagem de palavras das respostas do FAQ sobre o texto de `/llms-full.txt` gerado do build (as respostas contadas são as que as IAs passam a ver agora).

## Resumo

| Grupo | Arquivos | Nota antes | Nota depois (só técnica) | Principal lacuna |
| --- | --- | :-: | :-: | --- |
| Páginas de dor (4) | `lib/licitacoes/dores.ts` | 7,5 | 8,5 | FAQ com respostas curtas demais em 5 de 17; sem data no texto visível |
| Mandado de segurança em licitação | `app/(site)/licitacoes/mandado-de-seguranca/conteudo.ts` | 7,5 | 8 | Sem data de validação registrada |
| `/licitacoes` (hub) | `app/(site)/licitacoes/page.tsx` | 6,5 | 7,5 | Resposta direta só no FAQ; sem data |
| Áreas (12 visíveis) | `content/areas/*.mdoc` | 5,5 | 6,5 | Lead descreve o que o escritório faz, não responde; corpo sem artigo de lei nas áreas de direito público |

Ganho "depois": o FAQ vazio no HTML era o maior defeito (a metade dos trechos citáveis estava invisível) e a autoria agora aparece. A nota do conteúdo em si só sobe com reescrita, que é decisão do Douglas (ver pendências).

## 1. Páginas de dor (`lib/licitacoes/dores.ts`) — 7,5

Páginas: `fui-inabilitado`, `desclassificada-no-pregao`, `recurso-administrativo`, `impugnacao-de-edital`.

- **Resposta direta: sim.** O `lead` e o quadro "Prazo" abrem com a resposta. Exemplo (`fui-inabilitado`): "A inabilitação pode ser revista por recurso administrativo, mas o tempo é curto: a intenção de recorrer deve ser manifestada imediatamente e as razões, apresentadas em 3 dias úteis." Título já em forma de pergunta/consulta.
- **Trechos citáveis (40-80 palavras): metade.** Respostas de FAQ: `fui-inabilitado` [52, 53, 35, 115, 23] palavras (2 de 5 dentro); `desclassificada` [57, 20, 42, 25] (2 de 4); `recurso-administrativo` [102, 25, 28, 62] (1 de 4); `impugnacao` [39, 21, 40, 28] (1 de 4). Total: 6 de 17. As respostas de 20 a 30 palavras são corretas, mas curtas para ser lidas isoladas; as de 100+ passam do ponto de citação.
- **Quem/o quê/para quem: bom.** `ESCOPO_LEI` diz que vale para a Lei 14.133/2021 e que estatais (Lei 13.303/2016) têm outros prazos; o público é a empresa licitante. Falta uma frase que diga quem responde (agora a linha "Advogado responsável" cobre).
- **Fatos: forte.** 12 a 19 citações "art." por página (arts. 59, 164, 165, 166, 167, 168, 17 § 1º, 183, III). Texto validado em 21/10/2026 (comentário do cabeçalho de `dores.ts`).
- **Autor e data: faltava.** A validação só existia em comentário. Agora a página mostra "Advogado responsável: Douglas Senturião · OAB/SC nº 73.764 · Última revisão: 21/10/2026" e o `WebPage` JSON-LD leva `dateModified`/`lastReviewed` (constante `REVISADO_EM` em `dores.ts`).

## 2. Mandado de segurança em licitação (`conteudo.ts`) — 7,5

- **Resposta direta: sim.** O lead define o instrumento (Lei 12.016/2009, art. 1º), dá o prazo de 120 dias (art. 23) e diz que, havendo recurso administrativo com efeito suspensivo, em regra ele vem primeiro.
- **Trechos citáveis:** 7 perguntas, [72, 91, 60, 57, 38, 45, 23] palavras; 4 de 7 dentro da faixa.
- **Quem/para quem:** claro (decisão ilegal em licitação; empresa que disputa). Seção "Pode caber / Não cabe" boa para citação.
- **Fatos:** 21 citações "art."; Súmulas 429 e 430 do STF e 333 do STJ no cabeçalho do arquivo.
- **Autor e data:** autor agora visível. **Data de revisão não exibida:** o arquivo não registra validação (o `lastmod` de 21/10/2026 do sitemap é data de mudança, não de validação). Ver pendência.

## 3. `/licitacoes` (hub do departamento) — 6,5

- **Resposta direta:** o hero e a meta descrição descrevem o serviço; a resposta objetiva ("quais são os prazos") só aparece nas seis perguntas do FAQ e no bloco de situações (`SITUACOES`: "Intenção na hora; razões em 3 dias úteis", "Até 3 dias úteis antes da abertura", "120 dias da ciência"). Bom material, mal posicionado para quem lê só o início.
- **Trechos citáveis:** 6 respostas de FAQ com art. 164, 165, 157, 158 etc.: [75, 74, 79, 64, 79, 93] palavras, 5 de 6 dentro da faixa. Antes invisíveis no HTML; agora visíveis.
- **Quem/para quem:** "departamento jurídico de licitações para empresas" está claro. O termômetro PNCP é diferencial citável, mas é número vivo (ISR 120 s).
- **Fatos:** bons; o FAQ cita LC 214/2025, arts. 374 a 376, art. 59 § 4º.
- **Autor e data:** a página não mostra nenhum dos dois (a data seria a de `ATUALIZADO_EM`, que é de alteração, não de validação). Não adicionei.

## 4. Áreas de atuação (`content/areas/*.mdoc`, 12 visíveis) — 5,5

- **Resposta direta: raramente.** O `lead` descreve o que o escritório faz. Exemplos: `concursos` ("Atuamos para candidatos em todas as fases do certame..."), `servidores` ("Atuamos para servidores efetivos..."), `empresarial` ("A rotina de qualquer empresa produz contratos..."). A exceção é `mandado-de-seguranca`, que abre com o conceito. O prazo e o cabimento aparecem no corpo ou no FAQ.
- **Trechos citáveis: bom no FAQ.** 48 respostas (12 áreas): [43,54,47,45], [59,33,40,53], [40,50,57,37], [54,54,53,37], [37,59,46,55], [52,57,57,46], [51,42,49,47], [52,50,58,67], [52,51,48,52], [54,55,61,48], [75,71,68,60], [54,57,46,66]. 44 de 48 dentro de 40-80 (92%): padrão melhor que o das páginas de dor. Todas estavam vazias no HTML antes da correção.
- **Quem/o quê/para quem:** "o que" e "para quem" claros ("para candidatos", "para servidores"); "quem" fica na linha de autoria agora.
- **Fatos: fraco nas áreas de direito público.** Zero citações "art." no texto (corpo e FAQ) de `mandado-de-seguranca`, `contratos-publicos`, `concursos`, `servidores`, `defesa-agentes`, `habeas-data`, `execucoes` (só aparecem nas áreas cíveis: família 4, violência doméstica 6, dívidas 5, empresarial 3, crimes licitatórios 4). Prazo de 120 dias e Lei 12.016 só estão nas descrições curtas.
- **Autor e data: faltavam.** Agora aparece o advogado responsável. **Sem data:** `AREAS_ATUALIZADAS_EM = 2026-09-01` é só `lastmod`, não validação; nada no repositório diz quando foram revisadas juridicamente.

## 5. Padrões de redação que ajudam ou atrapalham a citação

- Ajudam: títulos de dor em forma de pergunta; quadro "Prazo" com artigo; passos numerados; "Uma ressalva honesta" (ressalvas explícitas tornam o trecho mais confiável); FAQ de 40-80 palavras.
- Atrapalham: leads institucionais ("Atuamos para..."); FAQ com respostas de 20 palavras ou de mais de 100; as áreas não trazem lei nem prazo no começo; datas e autor ausentes no texto visível até esta fase.

## 6. Recomendações (não executadas, dependem de decisão e de validação jurídica)

1. Áreas de direito público: trocar a primeira frase do `lead` por uma resposta (o que é, qual prazo, qual lei), mantendo o resto. Cada artigo de lei novo precisa de conferência no Planalto.
2. Padronizar as respostas de FAQ de 20 a 35 e de 100+ palavras para 40-80 (11 respostas nas páginas de dor).
3. Registrar a data de validação jurídica das áreas, do mandado de segurança e de `/licitacoes`; só então exibir "Última revisão".
4. Levar para `/licitacoes` um parágrafo de resposta nas duas primeiras frases ("os prazos principais são..."), reaproveitando o texto de `SITUACOES`.
5. Link no corpo de cada área para a página de dor e para o artigo correspondente (hoje só há links nos blocos de componentes).
