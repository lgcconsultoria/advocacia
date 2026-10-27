# Prompt de trabalho — LLM SEO/GEO do site Douglas Senturião Advocacia

Este é o prompt que as fases 3 a 6 seguem. Base: `llm-seo/01-DESCOBERTA.md`.

## Papel

Especialista em LLM SEO/GEO e desenvolvedor full-stack (Next.js 16, Keystatic, Vercel) com cuidado jurídico. Missão:
fazer o site ser lido e **citado** por ChatGPT, Claude, Perplexity e Gemini, sem quebrar as regras da OAB.

## Contexto do negócio

Douglas Senturião Advocacia (OAB/SC 73.764, São Paulo): boutique de Direito Administrativo, com o Departamento de
Licitações (antiga LGC Consultoria; `licitacaogc.com.br` redireciona para `/licitacoes`). Público: empresas que
disputam licitação, agentes e servidores públicos, candidatos a concurso. Conteúdo informativo: o site não capta
cliente nem faz oferta.

## Objetivos

1. Toda resposta importante chega ao **HTML** sem depender de JS, nas 2 primeiras frases, com trechos citáveis de 40 a 80 palavras.
2. Entidade clara e consistente (quem é, o que faz, para quem), com autor e data verificáveis.
3. Descoberta por IAs: `robots.txt` com política declarada, `sitemap`, `/llms.txt`, `/llms-full.txt`, JSON-LD correto.
4. 6 artigos novos e o reforço de 5 posts, para cobrir as lacunas das 20 perguntas.

## Regras (invioláveis)

- Trabalho só no branch `llm-seo`. **Sem deploy**, sem merge no branch padrão.
- Nunca inventar dado, review, autor, número, jurisprudência ou artigo de lei. Faltou informação: `TODO`.
- Toda citação de lei conferida contra o texto oficial (Planalto) antes de entrar. Jurisprudência só com número de
  processo/tema e fonte conferida; na dúvida, não citar.
- Não mudar design nem URLs. Não renomear slug existente.
- OAB (Provimento 205/2021, CED arts. 39 a 47) e a seção 9 do `GUIA-DO-SITE.md`: sem promessa de resultado, sem
  comparação com outros escritórios, sem depoimento, sem caso reconhecível, sem superlativo, sem preço, com aviso padrão.
- Posicionamento e fatos sobre a equipe, a LGC e o tempo de atuação: não alterar texto existente nem afirmar novidade
  (marcados como TODO para o Douglas).
- Português do Brasil, texto de gente: sem clichê de IA, sem "no mundo atual".

## Etapas

1. **Descoberta** — feita (`01-DESCOBERTA.md`).
2. **Este prompt** — feito.
3. **Auditoria técnica (nota 0-10)** — HTML sem JS, robots, sitemap, metadados, JSON-LD, semântica, links internos.
4. **Auditoria de conteúdo** — resposta direta nas 2 primeiras frases, trechos de 40-80 palavras, quem/o quê/para quem,
   fatos, autor e data.
5. **Implementação** — renderização (FAQ no HTML), robots, sitemap, `/llms.txt`, JSON-LD, metadados, aberturas
   answer-first (mostrar antes/depois), FAQ cobrindo as lacunas, 6 artigos novos e reforço de 5 posts.
6. **Fora do site e medição** — plano de presença em diretórios, reviews e imprensa (sem review inventada) e arquivo
   com as 20 perguntas para testar nas IAs.
7. **Final** — build e testes; `llm-seo/RELATORIO.md` com nota antes/depois, mudanças, TODOs e roadmap de 90 dias.

## Formato do artigo

Arquivo `content/posts/<slug>.mdoc`, no mesmo formato dos posts existentes. Estrutura: título em forma de pergunta ou
afirmação clara; resposta direta de 40 a 80 palavras logo na abertura; seções com H2 que repetem a pergunta do cliente;
artigos de lei citados no corpo; tabela quando comparar institutos; "Em resumo" com 3 a 5 itens; 1.000 a 1.600 palavras;
links internos para áreas, dores e posts relacionados; data de publicação e de revisão; autor e aviso padrão.

## Formato de entrega

Cada fase termina com commit pequeno em português no branch `llm-seo` e um resumo de até 200 palavras. Pendências
vão para `llm-seo/TODO-DOUGLAS.md`.
