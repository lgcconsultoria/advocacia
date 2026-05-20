# Guia do site — Bastos Camargo Advocacia

Site institucional de escritório-boutique de Direito Administrativo. Documento de
referência para o escritório, o web designer, o(a) social media e o(a) copywriter.

> O nome **Bastos Camargo Advocacia** é um *placeholder de exemplo*. Veja a
> seção "Placeholders a substituir" antes de publicar.

---

## 1. Arquitetura do site

Site **estático** (HTML + CSS + JavaScript), sem build e sem dependências —
abre direto no navegador e pode ser hospedado em qualquer serviço de arquivos
estáticos (Netlify, Vercel, GitHub Pages, Cloudflare Pages, hospedagem comum).

```
advocacia/
├── index.html                  Home
├── sobre.html                  Sobre o escritório
├── diagnostico.html            Diagnóstico jurídico + formulário estratégico
├── contato.html                Contato institucional
├── politica-de-privacidade.html  LGPD
├── aviso-publicidade.html      Aviso de publicidade (OAB)
├── areas/
│   ├── index.html              Índice das 8 áreas
│   ├── mandado-de-seguranca.html
│   ├── licitacoes.html
│   ├── contratos-publicos.html
│   ├── concursos.html
│   ├── servidores.html
│   ├── defesa-agentes.html
│   ├── habeas-data.html
│   └── execucoes.html
├── blog/
│   ├── index.html              Índice + filtro por área + agenda editorial
│   ├── mandado-de-seguranca-analise-de-cabimento.html   (artigo modelo)
│   └── reequilibrio-economico-financeiro-14133.html     (artigo modelo)
├── assets/
│   ├── css/styles.css          Folha de estilos única (design system)
│   ├── js/main.js              Menu, filtro do blog, validação do formulário
│   └── img/favicon.svg · og-image.svg
├── robots.txt
└── sitemap.xml
```

Cada página tem a mesma estrutura: **header fixo** (logo + menu + CTA
"Diagnóstico inicial") → **hero** → **blocos de conteúdo** → **CTA final** →
**footer** (identificação OAB + contato + aviso ético + links institucionais).

---

## 2. Mapa de páginas

| Página | Caminho | Função |
| --- | --- | --- |
| Home | `/` | Posicionamento, áreas, método, conversão |
| Sobre | `/sobre.html` | Identidade, princípios, equipe |
| Áreas (índice) | `/areas/` | Grade das 8 áreas |
| Mandado de Segurança | `/areas/mandado-de-seguranca.html` | Área de atuação |
| Licitações Públicas | `/areas/licitacoes.html` | Área de atuação |
| Contratos Públicos | `/areas/contratos-publicos.html` | Área de atuação |
| Concursos Públicos | `/areas/concursos.html` | Área de atuação |
| Servidores Públicos | `/areas/servidores.html` | Área de atuação |
| Defesa de Agentes Públicos | `/areas/defesa-agentes.html` | Área de atuação |
| Habeas Data | `/areas/habeas-data.html` | Área de atuação |
| Execuções e Cobranças | `/areas/execucoes.html` | Área de atuação |
| Diagnóstico | `/diagnostico.html` | Página de conversão + formulário |
| Contato | `/contato.html` | Dados institucionais e localização |
| Blog | `/blog/` | Índice de artigos |
| Artigo | `/blog/[slug].html` | Conteúdo técnico |
| Política de Privacidade | `/politica-de-privacidade.html` | LGPD |
| Aviso de Publicidade | `/aviso-publicidade.html` | Enquadramento ético OAB |

---

## 3. Placeholders a substituir antes de publicar

Procure e substitua em todos os arquivos (`.html`, `robots.txt`, `sitemap.xml`):

| Placeholder | Onde aparece | Substituir por |
| --- | --- | --- |
| `Bastos Camargo` / `Bastos Camargo Advocacia` | todas as páginas | Nome real do escritório |
| `www.bastoscamargo.adv.br` | canonical, OG, sitemap, robots | Domínio real (`.adv.br`) |
| `contato@bastoscamargo.adv.br` | footer, contato | E-mail real |
| `privacidade@bastoscamargo.adv.br` | política de privacidade | E-mail do encarregado (DPO) |
| `(11) 0000-0000` | footer, contato | Telefone real |
| `OAB/SP nº 0.000` | footer | Nº de registro da sociedade |
| `OAB/SP nº 000.000` | sobre, artigos | Nº de inscrição dos advogados |
| `Av. Paulista, 0000 ...` | contato, rodapé, LGPD | Endereço real |
| `[Nome do(a) Advogado(a)]` | sobre.html, artigos do blog | Nomes reais |
| Bloco de mapa | `contato.html` | Mapa estático ou `iframe` do endereço |
| `og-image.svg` | meta OG de todas as páginas | Exportar também `og-image.png` 1200×630 (o WhatsApp e algumas redes não renderizam SVG) |

A logo é um SVG inline (emblema de colunas) repetido no header de cada página
e em `assets/img/favicon.svg`. Para trocar a marca, substitua o `<svg class="brand-mark">`.

---

## 4. Formulário de diagnóstico — integração

O formulário (`diagnostico.html`) tem **validação client-side** e, ao enviar,
exibe a mensagem de confirmação. **Não há back-end** nesta entrega: nada é
enviado a lugar nenhum. Antes de publicar, conecte o `<form id="form-diagnostico">`
a um destino, por exemplo:

- Um serviço de formulário (Formspree, Basin, Web3Forms) — alterar o `action`.
- Um endpoint próprio que receba `multipart/form-data` e dispare e-mail.

Os campos de upload (`type="file"`, PDF até 10 MB) só funcionam com um back-end
que os receba. Garanta que o destino trate os dados em conformidade com a LGPD.

---

## 5. Chamadas éticas para contato (CTAs)

Verbos de **ação técnica e convite**, nunca de promessa. Usadas no site:

- **Solicitar diagnóstico inicial** — CTA primário, leva a `/diagnostico.html`.
- **Enviar caso para análise** / **Enviar [edital/contrato/título] para análise**.
- **Falar com o escritório** — contato institucional.
- **Conhecer as áreas de atuação** — CTA secundário, navegação.
- **Solicitar uma triagem técnica inicial**.

CTAs adicionais aprovados para redes e e-mail: "Saiba como funciona o diagnóstico",
"Tire o caso do papel: envie para triagem", "Conteúdo técnico no nosso blog".

**Nunca usar:** "Garanta seu direito", "Resolva agora", "Contrate já",
"Não perca a chance", "Fale com o melhor", "Vamos ganhar sua causa",
"Recupere seu dinheiro", "Última oportunidade".

---

## 6. Sugestões de SEO por página

Já implementado em cada arquivo: `<title>` único, `meta description`, `canonical`,
Open Graph/Twitter, `lang="pt-BR"`, HTML semântico, `sitemap.xml`, `robots.txt`,
dados estruturados JSON-LD (`LegalService` na Home, `FAQPage` nas áreas,
`Article` nos posts).

| Página | Palavra-chave foco | Title (resumo) |
| --- | --- | --- |
| Home | direito administrativo são paulo | Bastos Camargo Advocacia — Direito Administrativo estratégico em São Paulo |
| Sobre | escritório direito administrativo | Sobre o escritório — Direito Administrativo |
| Mandado de Segurança | mandado de segurança contra ato administrativo | Mandado de Segurança contra atos da Administração Pública |
| Licitações | advogado licitações lei 14.133 | Licitações Públicas: impugnação, recurso e contencioso |
| Contratos | reequilíbrio contrato administrativo | Contratos Públicos: reequilíbrio, sanções e rescisão |
| Concursos | eliminação concurso público advogado | Concursos Públicos: eliminação, preterição e nomeação |
| Servidores | advogado servidor público PAD | Servidores Públicos: PAD, posse e carreira |
| Defesa de Agentes | defesa improbidade administrativa | Defesa de Agentes Públicos: improbidade, TCU e TCE |
| Habeas Data | habeas data dados públicos | Habeas Data: acesso e retificação de dados públicos |
| Execuções | execução contra a fazenda pública precatório | Execuções e Cobranças contra a Fazenda Pública |
| Diagnóstico | — (página de conversão; `noindex` opcional) | Diagnóstico jurídico inicial |
| Blog | direito administrativo blog | Blog — Análise técnica de Direito Administrativo |

Recomendações ao publicar: registrar o site no Google Search Console e enviar o
`sitemap.xml`; criar/validar o perfil no Google Empresas (Perfil da Empresa) com
nome, endereço e telefone idênticos aos do site (consistência NAP); manter URLs
curtas e descritivas; usar uma única `<h1>` por página (já feito); preencher
`alt` em qualquer imagem adicionada; produzir os artigos da agenda editorial do
blog com regularidade, fazendo *links internos* entre artigos e áreas.

---

## 7. Sugestões de layout para o web designer

**Direção visual:** sóbria, institucional, sem estereótipos forenses (sem toga,
balança ou martelo). Tipografia como elemento principal; nada de banco de imagens
de "advogado apertando a mão do cliente".

**Paleta** (variáveis CSS em `:root`, `assets/css/styles.css`):

- Escuro `#13212c` (azul-naval/grafite) — header escuro, hero, footer.
- Claro `#f6f4ee` (neutro quente) — fundo padrão.
- Acento `#9c7c4e` (dourado fosco) — detalhes, botões, links. Usar com parcimônia.
- Texto `#282f33`; texto secundário `#5a6166`.

**Tipografia:** títulos em serifada **Lora**; corpo em **Inter** (Google Fonts,
já carregadas). Fallbacks de sistema configurados.

**Componentes prontos** (classes CSS reutilizáveis): cartão de área (`.area-card`),
método em etapas (`.steps`), lista de frentes (`.deflist`), FAQ acordeão nativo
(`.faq` com `<details>`), faixa de CTA (`.cta-band`), aviso (`.notice`),
formulário (`.form`), cartão de artigo (`.post-card`).

**Diretrizes:** mobile-first (ponto de quebra do menu em 880px); muito espaço em
branco; largura de leitura confortável (`.container--narrow`, ~720–760px);
contraste AA; foco visível no teclado; respeitar `prefers-reduced-motion`.
Para fotografia, preferir arquitetura neutra, texturas ou apenas tipografia.

**Sugestão de evolução:** substituir o emblema de colunas por logotipo
profissional definitivo; adicionar foto institucional sóbria da equipe na página
Sobre; produzir o `og-image.png` definitivo.

---

## 8. Avisos éticos e checklist (adequação OAB / LGPD)

O site já incorpora as exigências do Código de Ética e Disciplina da OAB, do
Estatuto da Advocacia (Lei 8.906/94) e do Provimento CFOAB nº 205/2021:

- Aviso ético padronizado no **rodapé de todas as páginas**.
- Página **"Aviso de Publicidade"** com o enquadramento ético completo.
- Página **"Política de Privacidade"** (LGPD) e e-mail do encarregado.
- Formulário com **termo expresso de não constituição de mandato** e
  **consentimento LGPD** (dois checkboxes obrigatórios).
- Aviso informativo no topo do **blog** e no rodapé de cada **artigo**.
- Identificação do **advogado responsável + OAB** em artigos e na página Sobre.
- Linguagem sem promessa de resultado, sem superlativos e sem termos comerciais.

**Checklist editorial — revisar cada nova peça antes de publicar:**

- [ ] Sem promessa de resultado, garantia ou superlativo auto-referente.
- [ ] Sem comparação com outros profissionais ou escritórios.
- [ ] Sem valor de honorário, oferta comercial ou CTA agressivo.
- [ ] Identificação do advogado responsável com OAB/UF.
- [ ] Aviso ético padronizado presente.
- [ ] Sem depoimento identificado, foto de cliente ou caso reconhecível.
- [ ] Tom moderado, técnico e informativo.
- [ ] Conteúdo útil, sem prestar consultoria pública individualizada.
- [ ] Dado pessoal de terceiro só com base legal LGPD.
- [ ] Imagens sem símbolos do Judiciário como atrativo estético.

> Este guia tem caráter de apoio. O conteúdo jurídico e os documentos
> (Política de Privacidade, Aviso de Publicidade, termos do formulário) devem ser
> revisados pelo advogado responsável e adaptados à realidade do escritório
> antes da publicação.
