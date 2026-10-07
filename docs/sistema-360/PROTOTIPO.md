# Sistema 360 e portal do cliente — protótipo de interface

Protótipo **só de interface**, feito em 07/10/2026 no branch `site-v2`. Não há login de verdade, nenhuma chamada de API, e nada do que se digita sai do navegador. Os dados são fictícios e vêm de `lib/demo/dados.ts`. O objetivo é fixar telas, componentes e o modelo de dados antes de ligar o backend.

## Rotas

Todas ficam no grupo `app/(app)/`, que tem layout próprio, sem o cabeçalho e o rodapé do site. Elas recebem `robots: noindex, nofollow` (inclusive para o googleBot) pela metadata do layout.

| Rota | O que é |
|---|---|
| `/entrar` | Login em tela dividida. À esquerda, o vídeo `sistema-paineis.mp4` com a mensagem "Jurídico 360". À direita, o formulário com a escolha "Sou cliente" / "Sou da equipe", e-mail e senha, entrada por código de 6 dígitos (OTP) e "esqueci a senha". Qualquer envio mostra o aviso "O acesso está em implantação — em breve você receberá seu convite". Embaixo ficam os links para as duas demonstrações. |
| `/sistema`, `/cliente` | Redirecionam para `/entrar`. |
| `/sistema/demo` | Painel: KPIs, andamentos por semana, processos por fase, próximos prazos, último andamento (linha do tempo), agentes na VPS e carteira por área. |
| `/sistema/demo/processos` | Tabela de processos com busca, filtros, ordenação, paginação e linha expansível que mostra as movimentações. Tem também o trilho de fases como filtro. `?p=<id>` abre um processo já expandido; é o que a busca ⌘K usa. |
| `/sistema/demo/prazos` | Calendário do mês com a lista de prazos e audiências: selo D-x, cor por urgência, "Avisar no WhatsApp" por prazo e "Cumprido". |
| `/sistema/demo/comercial` | Kanban de leads (Novo lead → Diagnóstico agendado → Proposta enviada → Fechado → Perdido) com gaveta de detalhe. |
| `/sistema/demo/clientes` | Lista de clientes e ficha com abas: processos, financeiro e histórico. `?c=<id>` escolhe o cliente. |
| `/sistema/demo/publicacoes` | Publicações do DJEN: lida/não lida, teor expansível, "Criar prazo". |
| `/sistema/demo/alertas` | Regras de aviso com interruptores e prévia das mensagens da Iris. |
| `/sistema/demo/configuracoes` | Equipe e papéis (matriz de permissões), horários de aviso, integrações e segurança. |
| `/cliente/demo` | Portal da "Empresa Exemplo Ltda.": meus processos, próximos passos, documentos pendentes, mensagens e próxima fatura. |
| `/cliente/demo/processos` e `/processos/[id]` | Processo em linguagem simples: etapa X de 7, "O que aconteceu", "O que vem agora", linha do tempo amigável e detalhes técnicos recolhidos. |
| `/cliente/demo/documentos` | Envio de documentos (só interface: valida tipo e tamanho e simula o progresso) e lista do que foi pedido e recebido. |
| `/cliente/demo/financeiro` | Contrato e faturas. |

Os dois protótipos têm a faixa âmbar "Demonstração com dados fictícios". O tema padrão é o escuro (tinta), há um botão para o claro (papel), e a escolha fica salva no `localStorage`. As animações respeitam "reduzir movimento" (`MotionConfig reducedMotion="user"` mais CSS). No celular a barra lateral vira gaveta, as tabelas viram cartões e o portal ganha abas no rodapé.

**Pendências fora do meu escopo:**
- **robots.ts** (é do site): incluir `disallow: ['/entrar', '/sistema', '/cliente']`.
- **Cabeçalho `X-Robots-Tag`**: metadata não define cabeçalho HTTP. Quando houver login de verdade, adicionar em `next.config.mjs`:
  ```js
  async headers() {
    return ['/entrar', '/sistema/:path*', '/cliente/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  }
  ```

## Componentes (21st.dev → código)

Todos foram portados para `components/sistema/**` e `components/auth/**`, com `framer-motion` trocado por `motion/react`, `@tabler/icons-react` por `lucide-react`, cores fixas por tokens próprios e textos em português.

| 21st | Componente | Arquivo |
|---|---|---|
| 28369 Split Login (@mohammadshehadeh) | Login dividido com caminhos animados | `components/auth/login-dividido.tsx` |
| 23552 Segmented Control (@ddoemonn) | "Sou cliente / Sou da equipe" e filtros segmentados | `components/auth/seletor-papel.tsx` |
| 34833 OTP Input (@uvain) | Código de 6 dígitos sobre `input-otp` | `components/auth/codigo-otp.tsx` |
| 14941 Dashboard Sidebar "Charcoal Ink" (@arunjdass) | Casca: barra lateral recolhível, gaveta no celular, barra superior | `components/sistema/shell.tsx`, `navegacao.ts` |
| 33510 Command Menu (@uvain) | Busca global ⌘K (cmdk + Radix Dialog) por CNJ, cliente ou tela | `components/sistema/comando.tsx` |
| 27135 Notification Panel (@uvain) | Sino: DJEN, prazos, WhatsApp, leads e sistema | `components/sistema/notificacoes.tsx` |
| 33507 Charts & KPI Cards (@uvain) | KPIs (NumberFlow), área, barras, rosca e minilinha (recharts) | `components/sistema/graficos.tsx` |
| 35051 Activity Timeline (@kuratlielia) | Linha do tempo por dia, expansível, com setas ↑↓ | `components/sistema/linha-do-tempo.tsx` |
| 31861 Data Table (@wensity) | Tabela de processos (busca, filtros, ordenação, expansão, paginação) | `components/sistema/telas/processos.tsx` |
| 31350 Calendar (@wensity) | Calendário mensal com pontos e teclado | `components/sistema/calendario.tsx` |
| 26936 Kanban Board (@uvain) | Kanban com arrasto por ponteiro e por teclado | `components/sistema/kanban.tsx` |
| 27137 File Upload (@uvain) | Envio de documentos (simulado) | `components/sistema/envio-arquivos.tsx` |
| 23604 Records Table, 28366 Settings, 27024 Empty State (inspiração) | Clientes, Configurações, estados vazios | `telas/clientes.tsx`, `telas/configuracoes.tsx`, `ui/vazio.tsx` |

Os primitivos próprios ficam em `components/sistema/ui/` (botão, selo, cartão, interruptor, gaveta, campo, select, avatar, vazio). Eles não dependem de `components/ui`. Os tokens (`--s-*`) ficam em `app/(app)/sistema.css`, no escopo `.s360`, mapeados de `docs/21st/temas/senturiao-shadcn.css`.

## Modelo de dados que a interface pressupõe

Os tipos estão em `lib/demo/dados.ts`. Resumo:

- **Usuário** `{ id, nome, iniciais, papel: socio | advogado | estagiario | cliente, cargo, email, whatsapp }`. O papel decide o que cada um vê (matriz em Configurações). Um usuário cliente fica ligado a um `clienteId`.
- **Cliente** `{ id, nome, tipo: PJ | PF, documento, cidade, areas[], responsavelId, clienteDesde, contato{nome,email,telefone}, plano?, honorariosMensais? }`.
- **Processo** `{ id, cnj, clienteId, titulo, parteContraria, polo, area, tribunal, sistema: e-SAJ | eproc | PJe, orgao, fase, valorCausa, responsavelId, distribuidoEm, resumoCliente?, andamentos[] }`. As fases são `peticao-inicial → citacao → contestacao → instrucao → sentenca → recurso → cumprimento`.
- **Andamento** `{ id, processoId, data, tipo: movimentacao | publicacao | peticao | decisao | audiencia, titulo, descricao?, fonte: e-SAJ | eproc | PJe | DJEN | Equipe, paraCliente?{ aconteceu, proximo? } }`. O campo `paraCliente` é o texto em linguagem simples, escrito ou revisado pela equipe, e só o que o tem aparece no portal.
- **Prazo** `{ id, processoId, titulo, tipo: prazo | audiencia | reuniao, data, responsavelId, avisarWhatsapp, cumprido }`. A urgência e o D-x são calculados na hora, contra a data de hoje.
- **Publicação** `{ id, processoId, data, diario: DJEN, orgao, tipo, teor, lida }`.
- **Lead** `{ id, protocolo, nome, empresa, email, telefone, interesse: tributario | licitacoes | outro, origem{ pagina, utm_* }, criadoEm, etapa, valorEstimado?, responsavelId?, proximoContato?, notas? }`. É o mesmo formato que o site já grava (`lib/contato/enviar-lead.ts`).
- **Regra de alerta** `{ id, gatilho, condicao, canal: WhatsApp | E-mail, destino, ativo, disparos7d }`.
- **Notificação** `{ id, tipo: publicacao | prazo | whatsapp | lead | sistema, ator, frase[], quando, contexto?, lida, href? }`.
- **Agente** `{ id, nome, alvo, status: ok | atencao | erro, ultimaVarreduraMin, intervaloMin, monitorados, nota? }`.
- **Fatura** `{ id, clienteId, descricao, competencia, valor, vencimento, status: paga | aberta | vencida }`. Também existem **DocumentoPortal** `{ nome, descricao, status: pendente | enviado | aprovado, prazo?, processoId? }`, **MensagemPortal** e **Contrato**.

Os números CNJ fictícios começam com `900` e têm dígito verificador `00`, então não existem.

## O que o backend precisa entregar

1. **Autenticação e papéis.** Convite por e-mail, login por senha ou código de 6 dígitos (e-mail/WhatsApp), segunda etapa obrigatória para a equipe e sessão por papel. O cliente só enxerga o próprio `clienteId`. O `/entrar` hoje só simula; o formulário já tem os campos e os estados (enviando, código, recuperar).
2. **Andamentos dos tribunais.** Os agentes que já rodam na VPS (consulta e-SAJ TJMS/TJSP, eproc, PJe) gravam `Andamento` por processo e expõem o status de cada agente (última varredura, intervalo, monitorados, falha) para o cartão "Agentes na VPS".
3. **DJEN.** A leitura do monitor de publicações (o mesmo do Sistema-Juridico) vira `Publicacao` e `Andamento{ fonte: DJEN }`, com marcação de lida por usuário e o botão "Criar prazo".
4. **Prazos.** Cadastro e cálculo em dias úteis, `avisarWhatsapp` por prazo e "cumprido" com registro de quem marcou.
5. **WhatsApp.** As regras de `RegraAlerta` disparam pela Evolution/Iris que já existe (prazo D-3, vence hoje, nova publicação no DJEN, lead novo, varredura falhou). As respostas viram `Notificacao{ tipo: whatsapp }`. Mensagem para cliente só sai com revisão humana.
6. **Leads.** O Comercial lê o que a porta `/p/contato/lead` já grava em `/opt/dexter/leads` (protocolo, nome, empresa, e-mail, telefone, interesse, página e UTMs) e guarda a etapa do funil, o responsável, o valor estimado e as anotações.
7. **Sistema-Juridico.** A API existente (token só-leitura do Dexter: clientes, casos, árvore, vault, busca e arquivos) alimenta Clientes, processos e documentos. Os documentos enviados pelo portal entram na pasta do caso.
8. **Financeiro.** Faturas e contrato por cliente, com 2ª via (boleto/Pix) quando houver integração de cobrança.
9. **Texto para o cliente.** Fluxo para a equipe escrever ou aprovar `paraCliente` (aconteceu / vem agora) antes de aparecer no portal. Pode haver sugestão automática, mas a publicação depende de revisão.

## Como trocar os dados fictícios pelos reais

As telas leem tudo de `useDemo()` (`components/sistema/demo-provider.tsx`). O caminho mais curto é manter os mesmos tipos e trocar o provedor por um que busque na API, com SWR ou React Query e o mesmo formato. Assim, as telas não mudam.
