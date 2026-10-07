# Catálogo 21st.dev — Senturião (site v2 e Sistema 360)

Curadoria feita em 07/10/2026 no catálogo do [21st.dev](https://21st.dev) (conta paga, via MCP). Foram 92 buscas (83 de componentes, 9 de temas), cerca de 1.000 resultados lidos, 133 componentes baixados para avaliação e **55 escolhidos e salvos** aqui: 36 para o site (A 25 · B 7 · C 4) e 19 para o Sistema 360 (D). Também ficaram registrados 2 temas shadcn e um mapeamento de tokens para a marca.

**Como ver tudo com os próprios olhos:** no 21st.dev, em *Bookmarks*, estão as listas **"Senturião · Site v2"** (45 itens: 36 escolhidos, 7 alternativas e 1 tema) e **"Senturião · Sistema 360"** (21 itens: 19 escolhidos e 2 temas). Cada linha das tabelas abaixo tem o link da página do componente, com prévia e vídeo.

**Onde está o código:** `docs/21st/componentes/<categoria>/<slug>/` com `component.tsx`, `demo.tsx`, `meta.json` (id, autor, url, installCommand, prévia e vídeo, dependências npm e de registry, notas de adaptação) e, quando a API entregou, `registry/` com os arquivos auxiliares (button, card…). Nada foi ligado ao app e nada foi instalado.

**Critérios usados:**
- **Marca:** tinta ultramar #0b0a2e, azul #1d1b9a, sinal #8e8bff, papel #f1f1f6, âmbar #d39a5b só em destaques; Archivo expandida, Instrument Serif itálico, JetBrains Mono. Ficaram de fora o neon e o visual "gamer", o glitch, o 8-bit, os efeitos "de vendas" e qualquer bloco de depoimento (Provimento 205/2021 da OAB: nada de depoimento inventado nem promessa de resultado).
- **Stack:** Next 16, React 19, Tailwind v4 e `motion` 12. Componentes em `framer-motion` funcionam, mas o certo é trocar o import por `motion/react`, porque é a mesma API e evita pacote duplicado. Ficaram de fora GSAP pago e Remotion.
- **Peso:** *leve* = só CSS/motion/canvas; *médio* = shader pequeno, recharts ou ~30 KB de código; *pesado* = three/R3F/Spline (carregar com `next/dynamic` e `ssr:false`, com imagem de fallback no mobile).
- **Acessibilidade:** preferência por quem trata `prefers-reduced-motion`, teclado e ARIA. As notas dizem onde falta.
- **Licença:** o 21st é um registry comunitário e cada autor publica para uso livre via shadcn. Vários declaram MIT no código (Hirael/mohammadshehadeh, rmahammad, wensity, halaska, diceui, Aceternity e Magic UI são MIT). Nenhum dos escolhidos tem licença restritiva no código. O Spline (alternativa) exige conta Spline para editar a cena.

> Legenda da coluna **Pick 1**: ★ = a recomendação para aquela necessidade. "Deps novas" = pacotes que o `package.json` do site ainda não tem.

## A. Site v2 — seções e efeitos

| Pick 1 | Componente (id) | O que dá | Onde vai | Deps novas · peso | Adaptação à marca | Pasta |
|---|---|---|---|---|---|---|
| ★ Fundo de hero leve | [Mesh Gradient](https://21st.dev/@adrielzimbril/components/mesh-gradient) · `33527` · @adrielzimbril | Gradiente de malha WebGL animado (carrega @paper-design/shaders-react sob demanda, import dinâmico), 4 cores configuráveis e forma (edge/wave/circle). | Fundo do hero da home e das 'plantas escuras'. | @paper-design/shaders-react · *leve* | Trocar as cores padrão (#0a1a4a/#1f4fd8/#4c9bff) por tinta #0b0a2e, marca #1d1b9a, sinal #8e8bff e um toque de #14134a; speed baixo (0.15–0.25) para ficar sóbrio; pausar com prefers-reduced-motion (o componente não trata); carregar com next/dynamic ssr:false. | `componentes/hero-fundos/mesh-gradient/` |
| ★ Hero 3D | [Prism Hero](https://21st.dev/@bevelui/components/prism-hero) · `25977` · @bevelui | Hero 3D com cristal facetado que refrata de verdade o título (R3F + drei), scroll-driven, respeita reduced-motion. | Hero da home ('muito mais moderno' com 3D real). | @react-three/drei, @react-three/fiber, three · *pesado* | Props já aceitam background/foreground/accent/displayFont/italicHeadline: background #0b0a2e, accent #8e8bff, displayFont Archivo expandida ou Instrument Serif itálico; dispersion 0.25; carregar com next/dynamic ssr:false e fallback estático (imagem) para mobile fraco. Pesado: three + @react-three/fiber + drei (~250 KB gz). | `componentes/hero-fundos/prism-hero-3d/` |
| ★ Fundo de planta com grade | [Grid Beam](https://21st.dev/@cult-ui/components/grid-beam) · `18024` · @cult-ui | Fundo canvas com feixes de luz correndo pelas linhas da grade; paletas configuráveis; sem dependências (next-themes só no demo). | Fundo das 'plantas escuras com grade' (seções numeradas) e da área de licitações. | next-themes · *leve* | Combina 1:1 com a linguagem 'planta' do globals.css: paleta própria (RGB de #8e8bff e #1d1b9a, op baixa); remover next-themes do demo; parar o loop fora da viewport. | `componentes/hero-fundos/grid-beam/` |
| ★ Mostrar o sistema ao rolar | [Container Scroll Animation](https://21st.dev/@manuarora700/components/container-scroll-animation) · `1081` · @manuarora700 | Contêiner que gira em 3D conforme o scroll (Aceternity) revelando uma tela. | Home: revelar a tela do 'Jurídico 360' / painel do cliente ao rolar. | framer-motion · *leve* | Trocar framer-motion por motion/react; moldura em tinta-2 com borda papel-2; imagem real do sistema (sem dados de cliente). | `componentes/scroll/container-scroll-3d/` |
| ★ Storytelling com scroll fixo | [Sticky Scroll Reveal](https://21st.dev/@manuarora700/components/sticky-scroll-reveal) · `952` · @manuarora700 | Coluna de texto rola enquanto o painel lateral fica fixo e troca o conteúdo. | Página Licitações: etapas (edital → impugnação → habilitação → recurso). | framer-motion · *leve* | Trocar os gradientes de fundo do original por tinta/tinta-2; framer-motion → motion/react. | `componentes/scroll/sticky-scroll-reveal/` |
| ★ Pilares empilhados | [Stacking Cards](https://21st.dev/@danielpetho/components/stacking-cards) · `25275` · @danielpetho | Cartões que fixam e encolhem uns sobre os outros ao rolar (motion). | Home: 3–4 pilares (Consultivo, Contencioso, Tributário, Licitações). | — (nada novo) · *leve* | Cartões alternando papel/tinta; números de seção em mono. | `componentes/scroll/stacking-cards/` |
| ★ Headline animada | [Text Morphing](https://21st.dev/@wensity/components/text-morphing) · `27533` · @wensity | Título que faz crossfade com blur entre frases (sem dependências, respeita reduced-motion). | Headline da home: 'Licitações · Tributário · Direito Público'. | — (nada novo) · *leve* | Usar Archivo expandida no className; 3 frases no máximo; morphDuration ~1.2s para não ficar 'vendedor'. | `componentes/texto/text-morphing/` |
| ★ Revelação de texto | [Text Reveal (Mask)](https://21st.dev/@soralabs/components/text-reveal-mask) · `19257` · @soralabs | Revelação de texto com máscara linha a linha/palavra/letra ao entrar na viewport (motion). | Títulos de seção e manifesto do escritório. | — (nada novo) · *leve* | Já usa motion e trata reduced-motion; aplicar a variante 'line' em Instrument Serif itálico para citações. | `componentes/texto/text-reveal-mask/` |
| ★ Bento / áreas | [Feature Grid Spotlight Cards](https://21st.dev/@mohammadshehadeh/components/feature-08) · `26797` · @mohammadshehadeh | Grade de 6 cartões em 'trilhos' finos com spotlight no hover (MIT, Hirael). | Áreas de atuação (home) e serviços de licitações. | class-variance-authority, lucide-react · *leve* | Estética de linhas finas casa com a planta; trocar ícones lucide por area-icon.tsx; badge em JetBrains Mono. | `componentes/bento-features/feature-grid-spotlight/` |
| ★ Números que se movem | [Rolling Digits](https://21st.dev/@edwinvakayil/components/rolling-digits) · `19158` · @edwinvakayil | Odômetro: cada dígito rola com mola; Intl.NumberFormat e startOnView. | Faixa de números da home (anos, processos acompanhados, órgãos atendidos). | @radix-ui/react-slot, class-variance-authority · *leve* | locale 'pt-BR'; Archivo expandida tabular-nums. Complementa o counting-number.tsx existente (que só conta). | `componentes/numeros/rolling-digits/` |
| ★ Tabela comparativa | [Blueprint Tiers](https://21st.dev/@arihantcodes_1f7b8c4d/components/blueprint-tiers) · `28887` · @arihantcodes_1f7b8c4d | Tabela de planos estilo 'blueprint suíço' (marcas de corte, rótulos mono, azul royal). | Comparar formatos de atendimento (avulso × consultoria mensal × Jurídico 360). | lucide-react · *leve* | É a peça mais alinhada à identidade: trocar #1f33d6/#2941ff por #1d1b9a/#8e8bff. ATENÇÃO: importa ./blueprint-tiers-utils/* (price-figure, reveal, types) que a API não entregou — instalar pelo installCommand para obter os utils. | `componentes/comparacao/blueprint-tiers/` |
| ★ Slider / range | [Slider](https://21st.dev/@halaska-studio/components/slider) · `34777` · @halaska-studio | Slider numérico com leitura ao vivo; input range nativo ou thumb com mola; MIT, sem dependências. | Calculadoras (faturamento, alíquota, valor do contrato). | — (nada novo) · *leve* | Acessível por ser input nativo; thumb em marca, trilha papel-2; valor em JetBrains Mono. | `componentes/calculadoras/slider-halaska/` |
| ★ Gráfico do site | [Animated Chart](https://21st.dev/@abui/components/animated-chart) · `29358` · @abui | Barras que sobem com mola ao entrar na viewport, rótulos por coluna; só motion (sem recharts). | Site: 'carga tributária antes/depois', prazos médios etc. | — (nada novo) · *leve* | Leve e sem biblioteca de gráfico — preferir no site; barras em marca, destaque em âmbar. | `componentes/graficos/animated-bar-chart/` |
| ★ Timeline | [Timeline](https://21st.dev/@manuarora700/components/timeline) · `857` · @manuarora700 | Linha do tempo com cabeçalho fixo e feixe que acompanha o scroll (Aceternity). | Página Sobre/Escritório e 'Reforma tributária: cronograma 2026–2033'. | framer-motion · *leve* | Feixe em gradiente sinal→âmbar; datas em mono. | `componentes/timeline/scroll-beam-timeline/` |
| ★ Abas | [Animated Tabs](https://21st.dev/@educalvolpz/components/animated-tabs) · `24930` · @educalvolpz | Abas com indicador deslizante (underline, pill e outras variantes). | Tributário: alternar 'Lucro Real / Presumido / Simples'; áreas. | — (nada novo) · *leve* | Variante underline em marca; motion já é dependência do site. | `componentes/navegacao/animated-tabs/` |
| ★ Navbar | [Morphing Scroll Navbar](https://21st.dev/@laziekiki/components/morphing-scroll-navbar) · `27428` · @laziekiki | Header que vira cápsula flutuante com blur ao rolar; sem dependências. | Header global do site v2 (substituir site-header.tsx). | — (nada novo) · *leve* | Cápsula em tinta/80 com backdrop-blur; CTA 'Diagnóstico' em âmbar só no estado flutuante. | `componentes/navegacao/morphing-scroll-navbar/` |
| ★ Rodapé | [Footer Section 5](https://21st.dev/@solaceui/components/footer-section-5) · `19358` · @solaceui | Rodapé com marca gigante vazada e fundo de shader 'flutes' (paper shaders). | Rodapé global: 'SENTURIÃO' em Archivo expandida. | @paper-design/shaders-react · *médio* | Shader azul combina; trocar next/link mantendo; OAB/inscrição e endereço obrigatórios no rodapé. | `componentes/navegacao/footer-oversized-wordmark/` |
| ★ Faixa de normas/instituições | [Logo Marquee](https://21st.dev/@ddoemonn/components/logo-marquee) · `23537` · @ddoemonn | Marquee infinito acessível (pausa no hover/foco, reduced-motion). | Faixa de 'normas e instituições' (Lei 14.133, LC 214, TCU, TCE-MS…) — sem depoimentos. | — (nada novo) · *leve* | Usar nomes/brasões neutros em texto mono, nunca logos de clientes sem autorização. | `componentes/marquee-confianca/logo-marquee-a11y/` |
| ★ Modal | [Animated Dialog](https://21st.dev/@rmahammad/components/animated-dialog) · `26905` · @rmahammad | Dialog Radix com coreografia motion (escala/slide) e acessibilidade completa. | Modal de contato/diagnóstico. | @radix-ui/react-dialog · *leve* | Requer @radix-ui/react-dialog (não instalado). Overlay tinta/70 com blur. | `componentes/overlays/animated-dialog/` |
| ★ Formulário de contato | [Centered Contact Form](https://21st.dev/@ln-dev7/components/contact-16) · `26911` · @ln-dev7 | Form enxuto (nome, e-mail, mensagem) que troca para estado de sucesso. | Dentro do modal de contato/diagnóstico. | @radix-ui/react-slot, class-variance-authority, lucide-react · *leve* | Adicionar campo WhatsApp e assunto (select); ligar ao /api existente (diagnostico-form.tsx). | `componentes/formularios/centered-contact-form/` |
| ★ Tilt 3D | [Tilt Card](https://21st.dev/@tom_ui/components/tilt-card) · `12245` · @tom_ui | Cartão com tilt 3D e spotlight; sem dependências. | Cartões de artigos/blog e de áreas. | — (nada novo) · *leve* | Tilt máximo 6–8°; desligar em touch e reduced-motion. | `componentes/cartoes-efeitos/tilt-card/` |
| ★ Cartão em destaque | [Border Beam](https://21st.dev/@dillionverma/components/border-beam) · `1268` · @dillionverma | Feixe de luz percorrendo a borda do contêiner (Magic UI); só CSS. | Cartão do plano recomendado / CTA do diagnóstico. | — (nada novo) · *leve* | colorFrom #8e8bff → colorTo #d39a5b; duration lenta (8–10s). | `componentes/cartoes-efeitos/border-beam/` |
| ★ Diagrama de fluxo | [Animated Beam](https://21st.dev/@dillionverma/components/animated-beam) · `919` · @dillionverma | Feixes animados ligando nós (diagrama de integração). | Seção 'como o monitoramento funciona': Diário Oficial → Sistema → WhatsApp do cliente. | framer-motion · *leve* | Ícones próprios; framer-motion → motion/react. | `componentes/cartoes-efeitos/animated-beam/` |
| ★ Vídeo | [Scroll-Linked Video Scrubber](https://21st.dev/@pulkitxm/components/scroll-linked-video-scrubber) · `19344` · @pulkitxm | Vídeo fixado cujo tempo avança com o scroll; sem dependências. | Home: vídeo institucional curto / tour do Jurídico 360. | — (nada novo) · *médio* | Exportar vídeo com keyframes densos (ffmpeg -g 1) para o scrub ficar liso; poster obrigatório. | `componentes/video/scroll-video-scrubber/` |
| ★ CTA | [CTA Section with Noise Shader](https://21st.dev/@shadcnui-blocks/components/cta-06) · `27553` · @shadcnui-blocks | CTA com shader de ruído/grão animado ao fundo (paper shaders). | CTA final de todas as páginas ('Agende um diagnóstico'). | @paper-design/shaders-react, @radix-ui/react-slot, class-variance-authority, lucide-react, next-themes · *médio* | Remover next-themes; cores tinta/marca; botão âmbar. | `componentes/cta/cta-noise-shader/` |

**Alternativas avaliadas (no bookmark, código não baixado):** 5649 Hero — Hero com MeshGradient + PulsingBorder do @paper-design/shaders-react e texto animado.; 1166 Spline Scene — Wrapper lazy do @splinetool/react-spline com Spotlight (cena 3D do Spline).; 1567 Glowing Effect — Borda que acende seguindo o cursor (estilo Cursor) para qualquer cartão.; 19861 How It Works — Seção 'como funciona' com cartões fixados e conectados (motion).; 26827 Comparison Table — Matriz de 3 colunas com coluna central destacada e ticks/textos.; 32922 Aurora Flow Chart — Gráfico de área cujo preenchimento é uma 'cortina de aurora' animada; sem dependências.; 28279 Logo Cloud 3 — Faixa única de marcas que acende no hover + citação..

## B. Páginas de tributário

| Pick 1 | Componente (id) | O que dá | Onde vai | Deps novas · peso | Adaptação à marca | Pasta |
|---|---|---|---|---|---|---|
| ★ Recibo/cupom | [Receipt Pricing](https://21st.dev/@n1m4mz/components/receipt-pricing) · `26309` · @n1m4mz | Planos 'impressos' como cupom térmico: razão em mono com pontilhado, reimpressão animada ao trocar período. | Mockup de 'nota/recibo' mostrando tributo antes × depois da revisão. | — (nada novo) · *médio* | Reaproveitar o visual de cupom com linhas 'ICMS / PIS / COFINS / IBS / CBS'; já trata reduced-motion; JetBrains Mono. | `componentes/tributario/receipt-ledger/` |
| ★ Nota/fatura | [Invoice Line Items Table](https://21st.dev/@olewandowski1/components/table-3) · `25157` · @olewandowski1 | Tabela de itens de fatura (qtd, unidade, preço) com totais. | Mockup de NF-e/fatura nas páginas de tributário. | — (nada novo) · *leve* | Requer @/components/ui/table (shadcn). Totais animados com o currency counter. | `componentes/tributario/invoice-line-items/` |
| ★ Antes/depois | [Compare Slider](https://21st.dev/@diceui/components/compare-slider) · `20282` · @diceui | Slider antes/depois com alça arrastável, orientação e rótulos; aceita qualquer conteúdo (DiceUI). | 'Antes da reforma × depois' / 'regime atual × regime proposto'. | lucide-react, radix-ui · *leve* | Usar com dois cartões (não imagens). Precisa do pacote radix-ui e dos utils compose-refs etc. (vêm pelo installCommand). | `componentes/tributario/compare-slider/` |
| ★ Calculadora de economia | [ROI Pricing Calculator](https://21st.dev/@diarmuradi/components/pricing-12) · `27098` · @diarmuradi | Calculadora interativa com slider e valor por unidade que recalcula ao vivo. | Calculadora de economia tributária (faturamento × alíquota efetiva). | @radix-ui/react-dropdown-menu, @radix-ui/react-label, @radix-ui/react-popover, @radix-ui/react-separator, @radix-ui/react-slider, @radix-ui/react-slot, @radix-ui/react-tooltip, class-variance-authority, lucide-react · *médio* | Base de UX; trocar a lógica por fórmula nossa e aviso 'estimativa, não é parecer'. Depende de fancy-button/input-group/slider shadcn. | `componentes/tributario/roi-savings-calculator/` |
| ★ Contador em R$ | [Number Ticker Currency Counter](https://21st.dev/@shadcnspace/components/number-ticker-02) · `21513` · @shadcnspace | Contador de moeda que rola entre valores (@number-flow/react). | Valor economizado / tributo devido animado. | @number-flow/react · *leve* | currency 'BRL', locale pt-BR; número em Archivo expandida. | `componentes/tributario/currency-counter/` |
| ★ Barra dividida | [Partition Bar](https://21st.dev/@8starlabs/components/partition-bar) · `26545` · @8starlabs | Barra horizontal dividida em segmentos proporcionais com legenda. | Composição da carga: tributos sobre faturamento (split bar). | class-variance-authority · *leve* | Segmentos em escala marca→sinal; âmbar para a parte 'recuperável'. | `componentes/tributario/partition-bar/` |
| ★ Resultado ao vivo | [Value Flash](https://21st.dev/@ddoemonn/components/value-flash) · `23574` · @ddoemonn | Leitura numérica que pisca verde/vermelho e rola dígitos ao mudar; anuncia a leitores de tela. | Resultado da calculadora quando o usuário mexe no slider. | — (nada novo) · *leve* | Trocar verde/vermelho por sinal/âmbar (evitar cara de corretora). | `componentes/tributario/value-flash/` |

## C. Área de login (cliente / equipe)

| Pick 1 | Componente (id) | O que dá | Onde vai | Deps novas · peso | Adaptação à marca | Pasta |
|---|---|---|---|---|---|---|
| ★ Página de login | [Split Login](https://21st.dev/@mohammadshehadeh/components/login-03) · `28369` · @mohammadshehadeh | Login em tela dividida: lado decorativo com caminhos animados + marca, lado com formulário. | /entrar (área do cliente e da equipe). | @radix-ui/react-slot, class-variance-authority, lucide-react · *leve* | Lado esquerdo em tinta com caminhos em sinal; trocar logo; form com e-mail + link mágico. | `componentes/auth/split-login/` |
| ★ Link mágico | [Login with Magic Link and SSO](https://21st.dev/@ephraimduncan/components/login-06) · `21493` · @ephraimduncan | Card de login com link mágico, senha de reserva e SSO. | Fluxo principal de /entrar (cliente recebe link por e-mail). | @radix-ui/react-separator, @radix-ui/react-slot, class-variance-authority · *leve* | Remover SSO genérico; manter só e-mail + Google (se houver). | `componentes/auth/magic-link-login/` |
| ★ Código OTP | [OTP Input](https://21st.dev/@uvain/components/otp-input-verification) · `34833` · @uvain | OTP sobre input-otp: colar em qualquer caixa, autofill de SMS, Backspace volta. | Confirmação por código (e-mail/WhatsApp). | @radix-ui/react-label, input-otp, lucide-react · *leve* | Requer input-otp e @radix-ui/react-label. Caixas em papel com foco em marca. | `componentes/auth/otp-input/` |
| ★ Cliente / equipe | [Segmented Control](https://21st.dev/@ddoemonn/components/segmented-control) · `23552` · @ddoemonn | Controle segmentado acessível (radio group) com thumb deslizante. | Alternar 'Sou cliente' / 'Sou da equipe' no login. | — (nada novo) · *leve* | Thumb em marca, texto mono; só motion. | `componentes/auth/segmented-role-switch/` |

## D. Sistema 360 (interno)

| Pick 1 | Componente (id) | O que dá | Onde vai | Deps novas · peso | Adaptação à marca | Pasta |
|---|---|---|---|---|---|---|
| ★ Shell do sistema | [Dashboard Sidebar](https://21st.dev/@arunjdass/components/dashboard-sidebar) · `14941` · @arunjdass | Shell de dashboard + sidebar com dois temas (Charcoal Ink escuro e claro); só lucide. | Layout base do Sistema 360. | lucide-react · *médio* | Trocar Charcoal por tinta #0b0a2e e superfície #14134a; itens: Painel, Processos, Prazos, Comercial, Clientes, Alertas. | `componentes/sistema-layout/dashboard-sidebar-charcoal/` |
| ★ Sidebar alternativa | [Sidebar](https://21st.dev/@wensity/components/sidebar) · `31454` · @wensity | Sidebar que recolhe para trilho de ícones, com seções, badges e usuário (MIT, Base UI). | Alternativa de sidebar (mais completa, badges de prazos). | @base-ui/react, @tabler/icons-react, framer-motion · *médio* | Usa @base-ui/react e @tabler/icons-react (padronizar ícones numa só lib). | `componentes/sistema-layout/collapsible-sidebar/` |
| ★ Tela Painel | [App Dashboard Layout](https://21st.dev/@hello_a52e1bda/components/app-1) · `28770` · @hello_a52e1bda | Página de dashboard: sidebar recolhível, KPIs, gráfico de área, tabelas (recharts). | Tela 'Painel' do 360. | @radix-ui/react-avatar, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-progress, @radix-ui/react-separator, @radix-ui/react-slot, @radix-ui/react-tooltip, class-variance-authority, lucide-react, recharts · *médio* | Traz button/sidebar/chart shadcn no registry; recharts como dependência. | `componentes/sistema-layout/app-dashboard-layout/` |
| ★ Lista de processos | [Data Table](https://21st.dev/@wensity/components/data-table) · `31861` · @wensity | Tabela com busca, ordenação, filtros, seleção, paginação e expansão (MIT). | Lista de processos (nº CNJ, cliente, última movimentação, prazo). | @tabler/icons-react, framer-motion · *médio* | Sem TanStack: mais simples de manter; coluna 'Última movimentação' com data relativa. | `componentes/sistema-dados/data-table-full/` |
| ★ Filtros avançados | [Advanced Data Table Filter Builder](https://21st.dev/@laziekiki/components/advanced-data-table-filter-builder) · `27325` · @laziekiki | Construtor de filtros com E/OU, multiseleção e busca. | Filtros avançados de processos (tribunal, fase, responsável, prazo < 5 dias). | @radix-ui/react-icons, cn, radix-ui · *médio* | Depende de radix-ui + motion; importa 'cn' como pacote (ajustar para @/lib/utils). | `componentes/sistema-dados/filter-builder/` |
| ★ Clientes/leads | [Records Table](https://21st.dev/@theshanelevine/components/records-table) · `23604` · @theshanelevine | Tabela compacta estilo CRM com chips coloridos, 1ª coluna fixa e seleção; sem dependências. | Clientes e leads (CRM). | — (nada novo) · *leve* | Chips em escala da marca; âmbar para 'proposta enviada'. | `componentes/sistema-dados/crm-records-table/` |
| ★ Pipeline comercial | [Kanban Board](https://21st.dev/@uvain/components/kanban-board) · `26936` · @uvain | Kanban robusto (títulos longos, muitos responsáveis, coluna com 40 cards) com drag. | Pipeline comercial (Lead → Diagnóstico → Proposta → Fechado) e prazos por fase. | framer-motion, lucide-react · *médio* | framer-motion → motion/react; testar teclado. | `componentes/sistema-crm/kanban-board/` |
| ★ Agenda | [Calendar](https://21st.dev/@wensity/components/calendar) · `31350` · @wensity | Calendário mensal com seleção, pontos de evento e navegação animada (MIT). | Agenda de prazos e audiências. | @tabler/icons-react, framer-motion · *médio* | Pontos: âmbar = prazo, sinal = audiência, perigo = vence hoje. | `componentes/sistema-agenda/calendar-wensity/` |
| ★ Prazos da semana | [Inbox Calendar](https://21st.dev/@ruixen.ui/components/inbox-calendar) · `8088` · @ruixen.ui | Calendário em lista estilo inbox, agrupando compromissos por dia. | Visão 'Prazos da semana'. | @radix-ui/react-popover, @radix-ui/react-scroll-area, @radix-ui/react-separator, @radix-ui/react-slot, class-variance-authority, date-fns, lucide-react, react-day-picker, uuid · *médio* | Requer date-fns, uuid e vários shadcn (calendar, popover, scroll-area). | `componentes/sistema-agenda/inbox-calendar/` |
| ★ Movimentações | [Timeline](https://21st.dev/@kuratlielia/components/timeline) · `35051` · @kuratlielia | Feed vertical agrupado por dia, linhas expansíveis e linha que se desenha. | Movimentações do processo e histórico do cliente. | lucide-react · *médio* | Importa ./timeline-utils (motion-tokens, CSS module) — instalar via installCommand. | `componentes/sistema-feed/activity-timeline/` |
| ★ Central de alertas | [Notification Panel](https://21st.dev/@uvain/components/notification-panel) · `27135` · @uvain | Painel de notificações (sino), agrupado por dia, filtro por tipo, Esc fecha. | Central de alertas (publicações DJEN, prazos, WhatsApp enviado). | framer-motion, lucide-react · *médio* | Tipos: Publicação, Prazo, WhatsApp, Sistema; framer-motion → motion/react. | `componentes/sistema-feed/notification-panel/` |
| ★ WhatsApp/atendimento | [What Saa SChat Inbox](https://21st.dev/@jasonmohab-ali/components/whatsaas-chat-inbox) · `14827` · @jasonmohab-ali | Inbox estilo WhatsApp com lista de conversas, conversa e lateral de CRM. | Tela 'Alertas/Atendimento' (mensagens disparadas ao cliente). | lucide-react · *leve* | Só lucide; ligar ao canal Meta (W1/W2) no futuro. | `componentes/sistema-feed/whatsapp-inbox-crm/` |
| ★ KPIs + gráficos | [Charts & KPI Cards](https://21st.dev/@uvain/components/revenue-charts-kpi) · `33507` · @uvain | Kit de KPI que sabe se 'subir é bom', área, barras e donut (recharts). | Topo do Painel (prazos vencendo, processos ativos, propostas, honorários). | lucide-react, recharts · *médio* | Paleta de gráficos da marca (chart-1..5). | `componentes/sistema-kpi/charts-kpi-kit/` |
| ★ Cards de métrica | [Insight Cards](https://21st.dev/@arihantcodes_1f7b8c4d/components/insight-cards) · `29167` · @arihantcodes_1f7b8c4d | Cartões de métrica com mini barras, delta e tendência. | Cards compactos em Processos/Comercial. | lucide-react · *leve* | Leve; só lucide. | `componentes/sistema-kpi/insight-cards/` |
| ★ Sparkline em tabela | [Sparkline](https://21st.dev/@appica-dev/components/sparkline) · `34511` · @appica-dev | Gráfico inline (linha/área/coluna) sem dependência. | Dentro de tabelas (movimentações/mês por cliente). | — (nada novo) · *leve* | Utils cn/use-direction vêm pelo installCommand. | `componentes/sistema-kpi/sparkline/` |
| ★ Busca global ⌘K | [Command Menu](https://21st.dev/@uvain/components/command-menu-palette) · `33510` · @uvain | Paleta ⌘K com cmdk: busca fuzzy, grupos, atalhos. | Busca global (processo, cliente, CNJ) e ações rápidas. | @radix-ui/react-dialog, cmdk, lucide-react · *leve* | Requer cmdk + @radix-ui/react-dialog. | `componentes/sistema-utilitarios/command-menu/` |
| ★ Estados vazios | [Empty State Kit](https://21st.dev/@laziekiki/components/empty-state-kit) · `27024` · @laziekiki | Seis estados vazios (inbox, busca, acesso restrito, 404…). | Telas sem dados (sem prazos hoje, sem publicações). | lucide-react · *leve* | Ilustrações em linha sinal; textos em PT-BR. | `componentes/sistema-utilitarios/empty-state-kit/` |
| ★ Configurações | [Settings Sidebar Layout](https://21st.dev/@felipemenezes098/components/settings-2) · `28366` · @felipemenezes098 | Configurações com menu lateral (perfil, segurança, notificações, cobrança). | Configurações do 360 (horários de alerta, WhatsApp, equipe). | @radix-ui/react-checkbox, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-separator, @radix-ui/react-slot, @radix-ui/react-switch, @radix-ui/react-tooltip, class-variance-authority, lucide-react · *leve* | Usa shadcn sidebar/switch/card. | `componentes/sistema-utilitarios/settings-sidebar/` |
| ★ Upload de peças | [File Upload](https://21st.dev/@uvain/components/file-upload) · `27137` · @uvain | Upload que lida com tipo errado, arquivo grande e falha de rede. | Anexar peças e documentos ao processo/cliente. | framer-motion, lucide-react · *médio* | framer-motion → motion/react. | `componentes/sistema-utilitarios/file-upload/` |

## Dependências que o site ainda não tem

O site hoje tem: react 19, next 16, motion 12, clsx, tailwind-merge, cobe, lenis, @radix-ui/react-accordion. Cada componente abaixo puxa algo novo:

| Pacote | Quem pede |
|---|---|
| `lucide-react` | Feature Grid Spotlight Cards (26797), Blueprint Tiers (28887), Centered Contact Form (26911), CTA Section with Noise Shader (27553), Compare Slider (20282), ROI Pricing Calculator (27098), Split Login (28369), OTP Input (34833), Dashboard Sidebar (14941), App Dashboard Layout (28770), Kanban Board (26936), Inbox Calendar (8088), Timeline (35051), Notification Panel (27135), What Saa SChat Inbox (14827), Charts & KPI Cards (33507), Insight Cards (29167), Command Menu (33510), Empty State Kit (27024), Settings Sidebar Layout (28366), File Upload (27137) |
| `class-variance-authority` | Feature Grid Spotlight Cards (26797), Rolling Digits (19158), Centered Contact Form (26911), CTA Section with Noise Shader (27553), ROI Pricing Calculator (27098), Partition Bar (26545), Split Login (28369), Login with Magic Link and SSO (21493), App Dashboard Layout (28770), Inbox Calendar (8088), Settings Sidebar Layout (28366) |
| `framer-motion` | Container Scroll Animation (1081), Sticky Scroll Reveal (952), Timeline (857), Animated Beam (919), Sidebar (31454), Data Table (31861), Kanban Board (26936), Calendar (31350), Notification Panel (27135), File Upload (27137) |
| `@radix-ui/react-slot` | Rolling Digits (19158), Centered Contact Form (26911), CTA Section with Noise Shader (27553), ROI Pricing Calculator (27098), Split Login (28369), Login with Magic Link and SSO (21493), App Dashboard Layout (28770), Inbox Calendar (8088), Settings Sidebar Layout (28366) |
| `@radix-ui/react-separator` | ROI Pricing Calculator (27098), Login with Magic Link and SSO (21493), App Dashboard Layout (28770), Inbox Calendar (8088), Settings Sidebar Layout (28366) |
| `@radix-ui/react-dialog` | Animated Dialog (26905), App Dashboard Layout (28770), Command Menu (33510), Settings Sidebar Layout (28366) |
| `@radix-ui/react-label` | ROI Pricing Calculator (27098), OTP Input (34833), App Dashboard Layout (28770), Settings Sidebar Layout (28366) |
| `@paper-design/shaders-react` | Mesh Gradient (33527), Footer Section 5 (19358), CTA Section with Noise Shader (27553) |
| `@radix-ui/react-tooltip` | ROI Pricing Calculator (27098), App Dashboard Layout (28770), Settings Sidebar Layout (28366) |
| `@tabler/icons-react` | Sidebar (31454), Data Table (31861), Calendar (31350) |
| `@radix-ui/react-popover` | ROI Pricing Calculator (27098), Inbox Calendar (8088) |
| `next-themes` | Grid Beam (18024), CTA Section with Noise Shader (27553) |
| `radix-ui` | Compare Slider (20282), Advanced Data Table Filter Builder (27325) |
| `recharts` | App Dashboard Layout (28770), Charts & KPI Cards (33507) |
| `@base-ui/react` | Sidebar (31454) |
| `@number-flow/react` | Number Ticker Currency Counter (21513) |
| `@radix-ui/react-avatar` | App Dashboard Layout (28770) |
| `@radix-ui/react-checkbox` | Settings Sidebar Layout (28366) |
| `@radix-ui/react-dropdown-menu` | ROI Pricing Calculator (27098) |
| `@radix-ui/react-icons` | Advanced Data Table Filter Builder (27325) |
| `@radix-ui/react-progress` | App Dashboard Layout (28770) |
| `@radix-ui/react-scroll-area` | Inbox Calendar (8088) |
| `@radix-ui/react-slider` | ROI Pricing Calculator (27098) |
| `@radix-ui/react-switch` | Settings Sidebar Layout (28366) |
| `@react-three/drei` | Prism Hero (25977) |
| `@react-three/fiber` | Prism Hero (25977) |
| `cmdk` | Command Menu (33510) |
| `cn` | Advanced Data Table Filter Builder (27325) |
| `date-fns` | Inbox Calendar (8088) |
| `input-otp` | OTP Input (34833) |
| `react-day-picker` | Inbox Calendar (8088) |
| `three` | Prism Hero (25977) |
| `uuid` | Inbox Calendar (8088) |

**Arquivos auxiliares que a API não entregou** (instalar pelo `installCommand` do meta.json, que baixa os utils junto): Blueprint Tiers (28887): `./blueprint-tiers-utils/price-figure`, `./blueprint-tiers-utils/reveal`, `./blueprint-tiers-utils/types`; Compare Slider (20282): `@/components/ui/compare-slider-utils/compose-refs`, `@/components/ui/compare-slider-utils/use-as-ref`, `@/components/ui/compare-slider-utils/use-isomorphic-layout-effect`, `@/components/ui/compare-slider-utils/use-lazy-ref`; ROI Pricing Calculator (27098): `@/components/fancy-button`; App Dashboard Layout (28770): `@/components/ui/app-1-utils/app-1-data`, `@/components/ui/app-1-utils/app-1-sidebar`, `@/components/ui/app-1-utils/sidebar`; Timeline (35051): `./timeline-utils/motion-tokens`, `./timeline-utils/timeline.module.css`; Sparkline (34511): `@/components/ui/sparkline-utils/cn`, `@/components/ui/sparkline-utils/use-direction`.
## Temas shadcn (type "theme")

Buscas: dark blue, indigo, midnight, navy, professional dark, blue, ultramarine, ocean, slate. Comparei os tokens de 6 temas (Indigo Mono, Indigo Harbor, Cosmic Indigo, Midnight Bloom, Meridian Blue, Cumulant Navy).

| Tema | Por que | Arquivo |
|---|---|---|
| ★ **Indigo Harbor** (`88bd75fa-3a09-41da-843b-4ed1e5dc4849`, @serafimcloud) | Claro com fundo #f3f5fb (quase o nosso papel) e primária #19398d (vizinha do #1d1b9a). O escuro é sóbrio (#050505/#0a0a0a) com primária #6a8dd8. É a melhor base de estrutura para o site. | `temas/indigo-harbor.css` |
| **Cosmic Indigo** (`2335e3c7-627d-4f50-9747-b22f8a509375`, @serafimcloud) | Primária #6b5fca no claro e #9690f1 no escuro, praticamente o nosso sinal #8e8bff. Serve de base para o Sistema 360 escuro. | `temas/cosmic-indigo.css` |
| (menção) Meridian Blue (`12b00883-…`) | Já usa Instrument Serif como `--font-serif`, mas o azul é acinzentado demais (#3b608f). | não salvo |

**Recomendação:** não usar nenhum dos dois tal como veio. `temas/senturiao-shadcn.css` mapeia os tokens shadcn (`--primary`, `--card`, `--chart-1..5`, `--sidebar-*`) para as cores do `globals.css`: claro = papel, escuro = tinta. Quem integrar só precisa colar esse bloco, e todos os componentes do 21st que usam `bg-primary`, `text-muted-foreground` etc. já nascem na marca.

## Recomendação para o site v2

Regra geral: **um efeito "uau" por dobra**. O 3D fica no hero da home e o resto das páginas usa movimento leve (reveal, números, feixes). Todo efeito pesado entra com `next/dynamic` e respeita `prefers-reduced-motion`. O `cobe` (globo) e o `contribution-skyline` atuais continuam como estão.

**Global**
- Header: **Morphing Scroll Navbar** (27428). Começa como faixa cheia e, ao rolar, vira cápsula de tinta com blur; o botão "Diagnóstico" em âmbar aparece só na cápsula.
- Rodapé: **Footer oversized wordmark** (19358) com "SENTURIÃO" em Archivo expandida sobre o shader azul, mais OAB, endereço e links legais.
- Tokens: `temas/senturiao-shadcn.css`. Toasts: `sonner` (padrão shadcn) com a cor da marca.

**Home**
1. Hero: **Prism Hero** (25977). O cristal refrata o título "Direito Público, Licitações e Tributário". Fundo tinta, acento sinal, título em Archivo e a palavra-chave em Instrument Serif itálico. No mobile e com reduced-motion entra o **Mesh Gradient** (33527) com o título em **Text Morphing** (27533).
2. Faixa de números: **Rolling Digits** (19158) sobre **Grid Beam** (18024): anos de atuação, órgãos atendidos, processos monitorados.
3. Pilares: **Stacking Cards** (25275) com 4 pilares que se empilham, alternando papel e tinta.
4. Áreas: **Feature Grid Spotlight** (26797) com os ícones de `area-icon.tsx` e um **Border Beam** (1268) só no cartão "Diagnóstico gratuito".
5. "Jurídico 360": **Container Scroll Animation** (1081) gira a tela do painel do cliente ao rolar, e logo abaixo o **Animated Beam** (919) mostra Diário Oficial → Sistema → WhatsApp.
6. Faixa de normas e instituições: **Logo Marquee** acessível (23537) com Lei 14.133 · LC 214 · TCU · TCE-MS · STJ · STF, em mono. Nenhum depoimento.
7. CTA final: **CTA com Noise Shader** (27553), "Agende um diagnóstico", que abre o modal.

**Tributário (reforma, recuperação, planejamento)**
1. Hero com **Mesh Gradient** (33527) mais suave e o título em **Text Reveal (Mask)** (19257).
2. "Sua nota antes e depois": **Compare Slider** (20282) com dois mockups lado a lado, o **Receipt Ledger** (26309) no regime atual e no proposto (linhas ICMS/PIS/COFINS → IBS/CBS), e a **Invoice Line Items** (25157) para a versão em NF-e.
3. Calculadora: **ROI Savings Calculator** (27098) como base de UX, com **Slider halaska** (34777) para faturamento e alíquota, resultado em **Currency Counter** (21513, BRL) e **Value Flash** (23574) quando o valor muda. Aviso fixo: "estimativa ilustrativa, não substitui análise".
4. Composição da carga: **Partition Bar** (26545), com o âmbar marcando o que é recuperável. Evolução no tempo: **Animated Bar Chart** (29358).
5. Cronograma da reforma (2026–2033): **Timeline** com feixe de scroll (857).
6. Regimes (Real, Presumido, Simples): **Animated Tabs** (24930).
7. Formatos de atendimento: **Blueprint Tiers** (28887).

**Licitações**
1. Hero em "planta": **Grid Beam** (18024) com título estático forte (sem 3D, para variar o ritmo da home).
2. Jornada do certame (edital → impugnação → habilitação → recurso → contrato): **Sticky Scroll Reveal** (952). O painel fixo mostra cada documento e o texto rola ao lado.
3. Monitoramento PNCP: **Animated Beam** (919) e números com **Rolling Digits**.
4. FAQ: manter o `faq-accordion.tsx` atual (Radix, já acessível). Se quiser mola, a alternativa 23530 (ddoemonn) está no bookmark.

**Áreas (cada página de área)**
- Topo com **Text Reveal (Mask)** sobre papel. Serviços em **Feature Grid Spotlight** (26797). Cartões de artigos relacionados com **Tilt Card** (12245, tilt de no máximo 6°). Processo de trabalho com **Timeline** (857) curta. CTA (27553).

**Contato / diagnóstico (modal)**
- **Animated Dialog** (26905, Radix, foco preso, Esc fecha) com o **Centered Contact Form** (26911) dentro: nome, e-mail, WhatsApp, assunto e mensagem, que vira estado de sucesso. Toast de confirmação. O modal abre a partir do CTA, do header e do WhatsApp float.

**Entrar / login**
- **Split Login** (28369): à esquerda, tinta com caminhos animados em sinal e a marca; à direita, o formulário.
- No topo do formulário, **Segmented Control** (23552): "Sou cliente" / "Sou da equipe".
- Cliente: **Magic Link** (21493) por e-mail e depois **OTP Input** (34833) com código de 6 dígitos (e-mail ou WhatsApp).
- Equipe: e-mail e senha mais OTP. A senha fica de reserva no próprio card 21493.

## Recomendação para o Sistema 360

**Layout:** **Dashboard Sidebar "Charcoal Ink"** (14941) recolorido para tinta #0b0a2e com superfície #14134a. Os dois temas dele viram papel (claro) e tinta (escuro). A **Sidebar wensity** (31454) é a alternativa se precisar de trilho de ícones e badges de contagem. No header, a busca global **Command Menu ⌘K** (33510, cmdk), que encontra processo por número CNJ, cliente ou ação, e o sino da **Notification Panel** (27135). Ícones: padronizar em `lucide-react` e trocar os `@tabler/icons-react` dos componentes wensity. Tema: `temas/senturiao-shadcn.css` (escuro por padrão).

**Telas**
- **Painel:** estrutura do **App Dashboard Layout** (28770). No topo, o **Charts & KPI kit** (33507): prazos vencendo em 5 dias, publicações novas, processos ativos, propostas abertas e honorários do mês, com "subir é bom/ruim" já tratado. Embaixo, "Prazos de hoje" (lista do 8088), "Últimas movimentações" (35051) e o funil comercial resumido.
- **Processos:** **Data Table wensity** (31861) com as colunas nº CNJ, cliente, tribunal, fase, última movimentação (data relativa), próximo prazo (badge âmbar/perigo) e responsável. Filtros avançados pelo **Filter Builder** (27325, corrigir o import `cn`). **Sparkline** (34511) de movimentações por mês na linha. Detalhe do processo com movimentações em **Activity Timeline** (35051) e anexos em **File Upload** (27137).
- **Prazos:** **Calendar wensity** (31350) no mês, com pontos (âmbar = prazo, sinal = audiência, perigo = vence hoje), e ao lado o **Inbox Calendar** (8088) como lista "Esta semana". **Empty State Kit** (27024) para "Nenhum prazo hoje".
- **Comercial / CRM:** **Kanban** (26936) com as colunas Lead → Diagnóstico → Proposta enviada → Negociação → Fechado. Visão em tabela pela **Records Table** (23604) e métricas do funil em **Insight Cards** (29167).
- **Clientes:** **Records Table** (23604) com chips de área (Licitações, Tributário…), 1ª coluna fixa e seleção. A ficha do cliente tem abas (24930) para processos, documentos, financeiro e histórico (35051).
- **Alertas:** **Notification Panel** (27135) com os tipos Publicação DJEN, Prazo, WhatsApp enviado e Sistema, mais o **WhatsApp Inbox CRM** (14827) para ver o que foi disparado a cada cliente e a resposta. Quando o canal Meta (W1/W2) estiver ligado, a lista vem dele.
- **Configurações:** **Settings Sidebar Layout** (28366) com perfil, equipe, horários de alerta, canais (WhatsApp/e-mail) e integrações (DJEN, PNCP).

## Top picks

**Site (10):** Prism Hero 25977 · Mesh Gradient 33527 · Grid Beam 18024 · Container Scroll 1081 · Text Morphing 27533 · Rolling Digits 19158 · Blueprint Tiers 28887 · Receipt Ledger 26309 · Compare Slider 20282 · Morphing Scroll Navbar 27428.

**Sistema (8):** Dashboard Sidebar 14941 · Data Table 31861 · Kanban 26936 · Calendar 31350 · Notification Panel 27135 · Charts & KPI 33507 · Command Menu 33510 · Activity Timeline 35051.
