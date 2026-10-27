# TODO — Douglas (LLM SEO/GEO)

## Técnico

Decisões provisórias do controlador (27/10/2026, na ausência do Douglas) e pendências das fases 3, 4 e 5 (parte técnica). Detalhes em `02-AUDITORIA-TECNICA.md` e `03-AUDITORIA-CONTEUDO.md`.

### Confirmar (decisões provisórias aplicadas no código)

- [ ] **Política de bots de IA** (`app/robots.ts`): todos permitidos e declarados (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended). CCBot fica de fora, herdando `*` (permitido). Se o Douglas não quiser treino de modelos, trocar `allow: '/'` por `disallow: '/'` nos bots de treino (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) e manter os de busca.
- [ ] **`priceRange` removido** do JSON-LD (risco OAB, Provimento 205/2021). Não recolocar.
- [ ] **Autoria visível** nas páginas de dor, mandado de segurança e áreas: "Advogado responsável: Douglas Senturião · OAB/SC nº 73.764" (mesmo dado do rodapé dos artigos). No JSON-LD, essas páginas têm `author` = pessoa do Douglas. Confirmar que ele aceita ser exibido como responsável por todas.
- [ ] **"Última revisão: 21/10/2026"** só nas 4 páginas de dor, porque o cabeçalho de `lib/licitacoes/dores.ts` registra validação jurídica nessa data (feita pelo "validador jurídico" do processo). Confirmar que a data pode ser publicada como "última revisão". `reviewedBy` não foi incluído no JSON-LD de propósito.

### Datas de revisão que faltam (informar para exibir "Última revisão")

- [ ] Áreas (`content/areas/*.mdoc`): nenhuma data de validação jurídica registrada (a data 01/09/2026 do sitemap é só `lastmod`).
- [ ] Mandado de segurança em licitação (`conteudo.ts`) e hub `/licitacoes`: sem validação registrada.
- [ ] Artigos: `updatedDate` vazio nos 15 posts antigos; sem ele, o `dateModified` repete a data de publicação.

### Posicionamento e fatos da equipe (não alterados; só o Douglas decide)

- [ ] Título/descrição inconsistentes: home "Tributário e Licitações", `/areas` "Direito Administrativo e Contencioso", `/sobre` "raiz no Direito Administrativo", artigos "Advogado dedicado ao Direito Administrativo", `TEMAS` em `lib/schema.ts` com tributário primeiro. Escolher um posicionamento.
- [ ] Menção à LGC no JSON-LD (`alternateName`/`sameAs`) e no `llms.txt`: não incluída. Informar a redação aprovada e quais perfis/URLs podem constar.
- [ ] "Os advogados" (texto das páginas de dor) e tempo de atuação: sem alteração; revisar se a equipe e os anos de atuação podem ser afirmados.
- [ ] Texto dos leads das áreas de direito público: trocar a primeira frase por resposta direta (precisa de conferência da lei no Planalto; ver recomendações em `03-AUDITORIA-CONTEUDO.md`).

### Depois do deploy

- [ ] Conferir em produção: `/llms.txt`, `/llms-full.txt` (hoje ~200 KB, cresce com os artigos novos), `/robots.txt`, respostas do FAQ no HTML (`curl -s <url> | grep faq-content-inner`).
- [ ] Rodar o Teste de Resultados Avançados do Google e o validador do schema.org em home, uma área, uma dor e um artigo.
- [ ] Reenviar o sitemap no Search Console e no Bing Webmaster (agora com os artigos novos).
- [ ] Imagem OG única para todas as páginas; `Article.image` genérica. Criar imagens por artigo (decisão de design).
- [ ] Fragilidade herdada: a API `senturiao-os` fora do ar tira os modelos do sitemap e do `/llms.txt` até o próximo ISR.

## Editorial (artigos e reforços)

- **Publicar:** nada foi mergeado nem publicado. O deploy acontece quando o branch `llm-seo` entrar no branch padrão
  (Vercel). Os 6 artigos novos têm `publishedDate: 2026-10-27`; ajuste a data se for publicar em outro dia.
- **Improbidade (ADIs 7156/7236, julgadas em 28/05, 24/06 e 01/07/2026):** o artigo cita as decisões a partir das
  notícias oficiais do STF e avisa que falta o acórdão. Conferir o acórdão quando sair e atualizar o texto.
- **TCU, Acórdão 1211/2021-Plenário:** o validador lembrou que o TCU admitiu juntar documento em diligência em
  situação específica. Não foi citado porque o inteiro teor não foi conferido. Se quiser, conferir e incluir no artigo
  sobre documento faltante.
- **Súmula 271/STF** (post de mandado de segurança): enunciado conferido só em fonte secundária; conferir no portal do STF.
- **Tema 485/STF** (post de eliminação em concurso): tese conferida em notícia do STF; ok, mas vale conferir o acórdão.
- **Revisão independente de peça** (`revisao-peca`): esta rodada usou o validador jurídico por fonte primária, duas
  vezes (versão inicial e versão corrigida). Quem publica pode pedir a revisão do Douglas por amostra antes do merge.
- **Aviso e autor:** vêm do template do blog; conferir se o aviso padrão do template atende ao CED (art. 39 a 47).
