# Guia do site — Douglas Senturião Advocacia

Site institucional de escritório-boutique de Direito Administrativo, em
São Paulo/SP. Documento de referência para o escritório, o web designer,
o(a) social media e o(a) copywriter.

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
├── areas/  (índice + 8 áreas de atuação)
├── blog/   (índice + 2 artigos modelo)
├── assets/
│   ├── css/styles.css          Folha de estilos única (design system)
│   ├── js/main.js              Menu, filtro do blog, validação do formulário
│   └── img/
│       ├── logo-horizontal.png        logo principal (azul) — cabeçalho
│       ├── logo-horizontal-light.png  logo claro — rodapé / fundos escuros
│       ├── logo-mark.png / logo-mark-light.png   monograma DS
│       ├── favicon.png · apple-touch-icon.png
│       ├── og-image.png               imagem de compartilhamento
│       ├── douglas-retrato.jpg        foto — hero da Home
│       ├── douglas-poltrona.jpg       foto — página Sobre
│       └── douglas-perfil.jpg         foto — perfil do advogado
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
| Sobre | `/sobre.html` | Identidade, princípios, advogado responsável |
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

## 3. Identidade visual aplicada

**Logo.** São usadas as artes oficiais da identidade: o monograma circular "DS"
e o lockup horizontal "Douglas Senturião · Advocacia". Versão azul no cabeçalho
(fundo claro) e versão clara no rodapé (fundo escuro).

**Paleta de cores** (variáveis CSS em `:root`, `assets/css/styles.css`):

| Cor | Hex | Uso |
| --- | --- | --- |
| Azul royal (Pantone 2746 C) | `#1d1b9a` | Cor da marca: botões, links, CTA, destaques |
| Preto neutro | `#292929` / `#26262e` | Hero, cabeçalhos internos, rodapé, texto |
| Cinza claro (Pantone 2330 C) | `#dbdbdb` | Linhas, faixas neutras, fundos alternados |
| Branco | `#ffffff` | Fundo principal |

**Tipografia.** A identidade usa a fonte Britanica (expandida). Como ela é
comercial, o site adota substitutas equivalentes via Google Fonts: **Archivo**
(títulos — geométrica e institucional) e **Inter** (corpo de texto). Rótulos e
"olhos" usam caixa-alta com espaçamento, ecoando o estilo expandido da marca.

**Fotografia.** As três fotos do advogado são apresentadas em molduras com
cantos arredondados, sombra suave e um bloco de acento azul deslocado atrás —
tratamento que dá profundidade e integra as imagens à identidade.

---

## 4. Dados do escritório e placeholders

**Dados aplicados no site:** Douglas Senturião Advocacia · Advogado
responsável: Douglas Senturião, Bacharel em Direito, OAB/SC nº 73.764 ·
Av. Brigadeiro Faria Lima, 1768 — São Paulo/SP — CEP 01451-001 ·
Telefone/WhatsApp (67) 99167-5629 · contato@douglassenturiao.adv.br ·
privacidade@douglassenturiao.adv.br · domínio `douglassenturiao.adv.br` ·
Instagram @douglassadvogado · mapa do Google embutido na página de Contato.

**Ajustes finais recomendados antes de publicar:**

- Criar as caixas de e-mail `contato@` e `privacidade@` no domínio.
- Revisar o item de cookies da Política de Privacidade conforme as
  ferramentas de medição efetivamente utilizadas no site.
- Conferir todo o conteúdo jurídico com o advogado responsável.

---

## 5. Formulário de diagnóstico — integração

Ao enviar, o formulário (`diagnostico.html`) valida os campos e envia **todo o
conteúdo** — inclusive os arquivos PDF — por `POST` em `multipart/form-data`
para o webhook do N8N:

`https://webhook.licitacaogc.com.br/webhook/advocacia`

O envio usa `fetch` em modo `no-cors`, o que garante a entrega
independentemente da configuração de CORS no N8N. Os campos chegam ao N8N com
os nomes dos atributos `name` do formulário (`nome`, `email`, `telefone`,
`cidade`, `perfil`, `frente`, `prazo`, `data_limite`, `processo`,
`numero_processo`, `descricao`, `objetivo`, `documento_principal`,
`documentos_extra`, `origem`, `aceite_privacidade`, `aceite_termo`). As saídas
(e-mail, planilha, CRM) são configuradas no próprio N8N. Em caso de falha de
rede, o site exibe uma mensagem de erro com o e-mail de contato como
alternativa. O tratamento dos dados deve observar a LGPD.

---

## 6. Chamadas éticas para contato (CTAs)

Verbos de **ação técnica e convite**, nunca de promessa. Usadas no site:

- **Solicitar diagnóstico inicial** — CTA primário, leva a `/diagnostico.html`.
- **Enviar caso para análise** / **Enviar [edital/contrato/título] para análise**.
- **Falar com o escritório** — contato institucional.
- **Conhecer as áreas de atuação** — CTA secundário, navegação.

**Nunca usar:** "Garanta seu direito", "Resolva agora", "Contrate já",
"Não perca a chance", "Fale com o melhor", "Vamos ganhar sua causa",
"Recupere seu dinheiro", "Última oportunidade".

---

## 7. Sugestões de SEO por página

Já implementado em cada arquivo: `<title>` único, `meta description`, `canonical`,
Open Graph/Twitter, `lang="pt-BR"`, HTML semântico, `sitemap.xml`, `robots.txt`,
dados estruturados JSON-LD (`LegalService` na Home, `FAQPage` nas áreas,
`Article` nos posts).

| Página | Palavra-chave foco |
| --- | --- |
| Home | direito administrativo florianópolis |
| Mandado de Segurança | mandado de segurança contra ato administrativo |
| Licitações | advogado licitações lei 14.133 |
| Contratos | reequilíbrio contrato administrativo |
| Concursos | eliminação concurso público advogado |
| Servidores | advogado servidor público PAD |
| Defesa de Agentes | defesa improbidade administrativa |
| Habeas Data | habeas data dados públicos |
| Execuções | execução contra a fazenda pública precatório |

Ao publicar: registrar o site no Google Search Console e enviar o `sitemap.xml`;
criar/validar o Perfil da Empresa (Google) com nome, endereço e telefone
idênticos aos do site; produzir os artigos da agenda editorial do blog com
regularidade, com links internos entre artigos e áreas.

---

## 8. Layout — orientações ao web designer

**Direção visual:** sóbria, institucional e moderna, sem estereótipos forenses
(sem toga, balança ou martelo). Cor da marca (azul `#1d1b9a`) usada com
intenção — botões, CTA, destaques —, preto e branco na maior parte da página.

**Componentes prontos** (classes CSS): cartão de área (`.area-card`), método em
etapas (`.steps`), lista de frentes (`.deflist`), FAQ acordeão (`.faq`), faixa
de CTA azul (`.cta-band`), aviso (`.notice`), formulário (`.form`), cartão de
artigo (`.post-card`), moldura de imagem (`.framed`), perfil (`.founder`).

**Diretrizes:** mobile-first (menu colapsa em 880px); muito espaço em branco;
largura de leitura confortável (~720px); contraste AA; foco visível no teclado;
respeitar `prefers-reduced-motion`.

**Evolução sugerida:** produzir versão definitiva da arte de compartilhamento;
adicionar foto institucional em outras páginas, se desejado; revisar o conjunto
de fotos para manter coerência de luz e enquadramento.

---

## 9. Avisos éticos e checklist (OAB / LGPD)

O site incorpora as exigências do Código de Ética e Disciplina da OAB, do
Estatuto da Advocacia (Lei 8.906/94) e do Provimento CFOAB nº 205/2021:

- Aviso ético padronizado no **rodapé de todas as páginas**.
- Página **"Aviso de Publicidade"** com o enquadramento ético completo.
- Página **"Política de Privacidade"** (LGPD) e e-mail do encarregado.
- Formulário com **termo de não constituição de mandato** e **consentimento LGPD**.
- Aviso informativo no **blog** e no rodapé de cada **artigo**.
- Identificação do advogado responsável + OAB em artigos e na página Sobre.
- Linguagem sem promessa de resultado, sem superlativos, sem termos comerciais.

**Checklist editorial — revisar cada nova peça antes de publicar:**

- [ ] Sem promessa de resultado, garantia ou superlativo auto-referente.
- [ ] Sem comparação com outros profissionais ou escritórios.
- [ ] Sem valor de honorário, oferta comercial ou CTA agressivo.
- [ ] Identificação do advogado responsável com OAB/UF.
- [ ] Aviso ético padronizado presente.
- [ ] Sem depoimento identificado, foto de cliente ou caso reconhecível.
- [ ] Tom moderado, técnico e informativo.
- [ ] Imagens sem símbolos do Judiciário como atrativo estético.

> Este guia tem caráter de apoio. O conteúdo jurídico e os documentos
> (Política de Privacidade, Aviso de Publicidade, termos do formulário) devem
> ser revisados pelo advogado responsável e adaptados à realidade do escritório
> antes da publicação.
