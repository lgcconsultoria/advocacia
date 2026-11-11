# Fase 6 — Fora do site e medição

Princípio: IAs citam o que outras fontes confiáveis dizem sobre a entidade. Mas advocacia tem limite: o Provimento
205/2021 e o CED (arts. 39 a 47) proíbem captação, promessa de resultado, mercantilização e depoimento de cliente
como publicidade. Tudo abaixo é presença **informativa**. Cada ação passa antes pelo `validador-juridico-roteiro` e
pelo Douglas. Nenhum review, nota ou número é inventado, e a equipe não pede avaliação a cliente.

## 1. Presença que ajuda a IA a reconhecer a entidade

| Onde | O que fazer | Cuidado OAB | Responsável |
| --- | --- | --- | --- |
| Perfil da OAB/SC (CNA) | Conferir nome, número 73.764, área e endereço iguais ao do site | Só dado oficial | Douglas |
| Google Perfil da Empresa | Nome, categoria "Escritório de advocacia", endereço, site, horário, descrição informativa | Sem slogan, preço ou promessa. **Não solicitar avaliação** a clientes; responder a avaliação espontânea só com o que o sigilo permite, sem confirmar que a pessoa é cliente | Douglas (TODO: confirmar endereço de São Paulo) |
| LinkedIn (pessoal e página) | Mesma frase de posicionamento do site, link do site, artigos do blog como publicação | Conteúdo informativo | Douglas |
| Instagram @douglassenturiao e @douglassadvogado | Link do site na bio; carrossel que remete ao artigo | Já segue o checklist de publicidade | Marketing |
| Wikidata / base de entidades | Só se houver fonte independente que sustente (ex.: o próprio perfil OAB). Sem fonte, não criar | Autopromoção sem fonte é recusada | TODO |
| Diretórios jurídicos | Escolher poucos, de reputação, que aceitem só dados cadastrais; evitar os que vendem posição, ranking ou "selo" | Ranking pago e "melhor advogado" são proibidos | Douglas decide |

## 2. Imprensa e autoria

- Artigos de opinião de caráter informativo em veículos de licitação/contratos públicos e em portais jurídicos, assinados
  pelo Douglas, remetendo ao artigo do blog como fonte. Pauta nasce das lacunas das 20 perguntas.
- Entrevista como fonte técnica: só em tema geral, sem caso identificável e sem prometer resultado.
- Citações do termômetro de licitações (dado próprio do site, fonte PNCP): oferecer a dado agregado a jornalistas
  sempre com a ressalva "estimado pelos próprios órgãos".
- Nada de "advertorial" pago apresentado como notícia.

## 3. Reddit, fóruns e comunidades

- Não criar contas falsas, nem responder em massa. Participação só com identidade real, em comunidades de
  licitação/concurso que permitam, respondendo dúvida concreta com a norma e **sem** captação.
- Perguntas reais de fórum são insumo de pauta: anotar e transformar em artigo, sem citar o autor.
- TODO Douglas: decidir se quer presença pessoal nesses canais. Sem decisão, só monitorar.

## 4. Reviews

- Regra: **não pedir, não incentivar, não exibir** depoimento ou nota de cliente (nem em JSON-LD `Review`/`aggregateRating`).
- Avaliação espontânea em plataformas de terceiros: acompanhar e, se necessário, responder com cuidado de sigilo.

## 5. Medição

1. **Teste das 20 perguntas** (`llm-seo/PERGUNTAS-20.md`): mensal e a cada artigo novo; ChatGPT, Claude, Perplexity e
   Gemini; registrar C/M/N e URL citada. Linha de base: antes de publicar o branch (todas em branco).
2. **Search Console:** impressões e cliques por página e consulta; inspeção de URL nos 6 artigos novos; cobertura do sitemap.
3. **Logs/analytics:** visitas vindas de `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai` e tráfego de
   `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot` (Vercel logs); acompanhar o crescimento.
4. **Saúde técnica semanal:** `/llms.txt` 200, `robots.txt` com política, `sitemap.xml` com os novos posts, JSON-LD
   válido nas páginas novas (validador de dados estruturados do Google).
5. **Integração com o 360:** as 20 perguntas são a semente do `geo.medidor` do marketing autônomo (hoje desenhado para 25
   perguntas, 2 motores, 3 repetições por mês). Quando o medidor entrar, passa a rodar sozinho.

## 6. O que não fazer

Comprar menções, reviews, backlinks ou posição; criar página só para robô; esconder texto; copiar conteúdo de terceiros;
usar jurisprudência sem conferência; prometer resultado ou prazo de decisão.
