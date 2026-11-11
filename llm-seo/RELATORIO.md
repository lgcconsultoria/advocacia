# Relatório — LLM SEO/GEO do site (27/10/2026)

Branch `llm-seo` (a partir de `origin/claude/law-firm-website-Kdo2d`). **Nada foi publicado**: não houve merge nem
deploy. Build (`npm run build`) e testes (`npm test`, 23 de 23) passam.

## Nota antes e depois

| Item | Antes | Depois |
| --- | --- | --- |
| HTML sem depender de JS (respostas do FAQ) | 6 | 9 |
| robots.txt (política de bots de IA) | 6 | 9 |
| sitemap | 8 | 8 |
| metadados | 8 | 8 |
| JSON-LD | 6 | 9 |
| HTML semântico | 7 | 8 |
| links internos | 4 | 7 |
| /llms.txt e /llms-full.txt | 0 | 9 |
| **Média técnica** | **5,6** | **8,4** |

Conteúdo (só o ganho técnico; reescrever as páginas é a próxima rodada): páginas de dor 7,5 → 8,5; mandado de
segurança 7,5 → 8; hub `/licitacoes` 6,5 → 7,5; áreas 5,5 → 6,5. Detalhes: `02-AUDITORIA-TECNICA.md` e
`03-AUDITORIA-CONTEUDO.md`.

## O que mudou

**Técnico** (commit 748d261)
- FAQ: as respostas estavam fora do HTML (92 respostas vazias em 21 páginas); agora todas estão (0 vazias), sem mudar
  o visual nem o abrir e fechar.
- `/llms.txt` e `/llms-full.txt` gerados do conteúdo real.
- `robots.txt` com política declarada para os bots de IA (todos permitidos; decisão provisória, ver TODO).
- JSON-LD: sem `priceRange` (risco OAB), sem JSON inválido, `dateModified`, autoria; `/keystatic` com noindex.
- Autoria e "Última revisão" (21/10/2026, só nas 4 páginas de dor) e "Leia também" nos posts.

**Conteúdo** (commit e8cabec)
- 6 artigos novos: documento faltante na habilitação (art. 64), sanções e reabilitação, reajuste × repactuação ×
  reequilíbrio, atraso de pagamento da Administração, nomeação e cadastro de reserva, improbidade após a Lei 14.230.
- 5 posts reforçados (abertura com resposta direta, lei no corpo, links internos, "Em resumo", `updatedDate`):
  impugnação, eliminação em concurso, PAD, reequilíbrio, mandado de segurança. Antes e depois das aberturas em
  `antes-depois.md`.
- Revisão jurídica por fonte primária em duas rodadas. Erro de fato corrigido: o post de mandado de segurança afirmava
  vigente o art. 7º, § 2º, da Lei 12.016, declarado inconstitucional na ADI 4296 (2021). Registro em
  `correcoes-aplicadas.md`.

**Cobertura das 20 perguntas:** de 11 adequadas, 6 parciais e 3 lacunas, as 3 lacunas (#10, #12, #13) e 3 parciais (#5,
#17, #19) ganharam artigo próprio. Teste real nas IAs fica para depois do deploy (`PERGUNTAS-20.md`).

## O que falta (TODO)

Ver `TODO-DOUGLAS.md`: política de bots, posicionamento e fatos da equipe, menção à LGC, datas de revisão das áreas,
acórdãos de julho/2026 da improbidade, TCU 1211/2021, Súmula 271/STF.

## Roadmap de 90 dias

- **Semana 1:** merge do `llm-seo` e deploy; reenviar o sitemap no Search Console; conferir `/llms.txt`, robots e
  JSON-LD em produção; rodar a linha de base das 20 perguntas.
- **Dias 8 a 30:** decidir os TODOs do Douglas (posicionamento, LGC, equipe); reescrever as aberturas de áreas e do hub
  de licitações no formato answer-first; novos artigos a cada 3 dias a partir da fila de lacunas (a esteira do
  marketing autônomo assume: pauteiro, redator, revisor, publicador, verificador).
- **Dias 31 a 60:** presença fora do site (`04-FORA-DO-SITE-E-MEDICAO.md`): perfil OAB, Google Perfil, LinkedIn,
  artigos de opinião informativos; sem review, sem ranking pago.
- **Dias 61 a 90:** reteste mensal das 20 perguntas e comparação com a linha de base; atualizar artigos com
  `updatedDate`; revisar o que as IAs citam e criar conteúdo para o que não citam.
