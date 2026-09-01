import { config, collection, singleton, fields } from '@keystatic/core';

const ICON_OPTIONS = [
  { label: 'Escudo (mandado de segurança)', value: 'shield' },
  { label: 'Documento', value: 'doc' },
  { label: 'Contrato', value: 'contract' },
  { label: 'Prova / verificação', value: 'check-doc' },
  { label: 'Servidor / pessoa', value: 'person' },
  { label: 'Defesa (escudo + check)', value: 'shield-check' },
  { label: 'Dados / registros', value: 'database' },
  { label: 'Execução / cobrança', value: 'ledger' },
  { label: 'Família / pessoas', value: 'users' },
  { label: 'Proteção (escudo + coração)', value: 'shield-heart' },
  { label: 'Empresarial (maleta)', value: 'briefcase' },
  { label: 'Penal / defesa em documento', value: 'doc-shield' },
  { label: 'Dívidas / valores', value: 'coins' },
  { label: 'Tributário (percentual)', value: 'percent' },
] as const;

const GROUP_OPTIONS = [
  { label: 'Direito Público', value: 'publico' },
  { label: 'Contencioso Cível e Empresarial', value: 'civel' },
] as const;

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Douglas Senturião Advocacia' },
    navigation: {
      Conteúdo: ['areas', 'posts'],
      Configurações: ['settings'],
    },
  },
  collections: {
    areas: collection({
      label: 'Áreas de atuação',
      slugField: 'title',
      path: 'content/areas/*',
      format: { contentField: 'intro' },
      entryLayout: 'content',
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Título (nome curto)', description: 'Usado em cards e navegação.' },
        }),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 0 }),
        group: fields.select({
          label: 'Grupo de atuação',
          options: GROUP_OPTIONS,
          defaultValue: 'publico',
        }),
        icon: fields.select({
          label: 'Ícone',
          options: ICON_OPTIONS,
          defaultValue: 'shield',
        }),
        summary: fields.text({
          label: 'Resumo (card)',
          description: 'Frase curta exibida na grade de áreas e na home.',
          multiline: true,
        }),
        metaTitle: fields.text({ label: 'SEO — título' }),
        metaDescription: fields.text({ label: 'SEO — descrição', multiline: true }),
        ogTitle: fields.text({ label: 'Open Graph — título' }),
        ogDescription: fields.text({ label: 'Open Graph — descrição', multiline: true }),
        heroTitle: fields.text({ label: 'Título da página (H1)' }),
        lead: fields.text({ label: 'Linha de abertura (lead)', multiline: true }),
        whenEyebrow: fields.text({ label: 'Olho da seção', defaultValue: 'Quando cabe' }),
        whenTitle: fields.text({ label: 'Título da seção principal (H2)' }),
        intro: fields.markdoc({ label: 'Conteúdo principal' }),
        achievesTitle: fields.text({
          label: 'Título da lista de alcance',
          defaultValue: '',
        }),
        achieves: fields.array(fields.text({ label: 'Item' }), {
          label: 'O que pode alcançar',
          itemLabel: (props) => props.value,
        }),
        notice: fields.object(
          {
            title: fields.text({ label: 'Título do aviso' }),
            body: fields.text({ label: 'Texto do aviso', multiline: true }),
          },
          { label: 'Aviso em destaque' }
        ),
        deadlinesTitle: fields.text({
          label: 'Título da seção de prazos',
          defaultValue: 'O prazo',
        }),
        deadlines: fields.array(
          fields.object({
            label: fields.text({ label: 'Situação' }),
            prazo: fields.text({ label: 'Prazo' }),
            base: fields.text({ label: 'Base legal', multiline: true }),
          }),
          {
            label: 'Prazos legais da matéria',
            description:
              'O ativo mais distintivo do site. Cada item vira uma linha do bloco de prazos.',
            itemLabel: (props) => `${props.fields.label.value} — ${props.fields.prazo.value}`,
          }
        ),
        decisiveTitle: fields.text({
          label: 'Título da seção técnica',
          defaultValue: 'O que costuma decidir o caso',
        }),
        decisive: fields.array(
          fields.object({
            title: fields.text({ label: 'Ponto' }),
            body: fields.text({ label: 'Explicação', multiline: true }),
          }),
          {
            label: 'O que costuma decidir o caso',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        areaKey: fields.text({
          label: 'Chave da área (para artigos relacionados)',
          description:
            'Deve bater com o campo "Chave da área" usado nos artigos do blog.',
          defaultValue: '',
        }),
        sidebarTitle: fields.text({
          label: 'Título da barra lateral',
          defaultValue: 'O que enviar para análise',
        }),
        sidebarItems: fields.array(fields.text({ label: 'Item' }), {
          label: 'Itens da barra lateral',
          itemLabel: (props) => props.value,
        }),
        sidebarCta: fields.text({
          label: 'Rótulo do botão lateral',
          defaultValue: 'Enviar caso para análise',
        }),
        sidebarNote: fields.text({ label: 'Nota da barra lateral', multiline: true }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Pergunta' }),
            answer: fields.text({ label: 'Resposta', multiline: true }),
          }),
          { label: 'Perguntas frequentes', itemLabel: (props) => props.fields.question.value }
        ),
        ctaTitle: fields.text({ label: 'CTA final — título' }),
        ctaText: fields.text({ label: 'CTA final — texto', multiline: true }),
      },
    }),
    posts: collection({
      label: 'Artigos do blog',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishedDate'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        area: fields.text({ label: 'Área (rótulo/tag)' }),
        areaKey: fields.text({
          label: 'Chave da área (para filtro)',
          description: 'Ex.: mandado-de-seguranca, licitacoes, concursos.',
        }),
        description: fields.text({ label: 'Resumo / meta description', multiline: true }),
        publishedDate: fields.date({ label: 'Data de publicação' }),
        readingTime: fields.text({ label: 'Tempo de leitura', defaultValue: '10 min' }),
        content: fields.markdoc({ label: 'Conteúdo do artigo' }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Configurações do site',
      path: 'content/settings',
      schema: {
        firmName: fields.text({ label: 'Nome do escritório', defaultValue: 'Douglas Senturião Advocacia' }),
        lawyerName: fields.text({ label: 'Advogado responsável', defaultValue: 'Douglas Senturião' }),
        oab: fields.text({ label: 'OAB', defaultValue: 'OAB/SC nº 73.764' }),
        phone: fields.text({ label: 'Telefone/WhatsApp', defaultValue: '(67) 99167-5629' }),
        whatsapp: fields.text({ label: 'WhatsApp (E.164, só dígitos)', defaultValue: '5567991675629' }),
        email: fields.text({ label: 'E-mail de contato', defaultValue: 'douglas@senturiaoadv.com.br' }),
        instagram: fields.text({ label: 'Instagram (handle)', defaultValue: 'douglassadvogado' }),
        address: fields.text({ label: 'Endereço', multiline: true, defaultValue: 'Av. Brigadeiro Faria Lima, 1768 — São Paulo/SP — CEP 01451-001' }),
      },
    }),
  },
});
