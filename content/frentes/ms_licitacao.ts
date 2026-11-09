import type { ConteudoFrente } from './tipos';

/**
 * Fontes: Lei 14.133/2021 (arts. 164, 165, I e § 1º, 168 e 183), Lei 13.303/2016 (art. 59, § 1º),
 * Lei 12.016/2009 (arts. 1º, 5º, I, e 23). Conferidas no Planalto em 09/11/2026.
 * Os mesmos fundamentos já estão na página /licitacoes/mandado-de-seguranca.
 */
export const MS_LICITACAO: ConteudoFrente = {
  frente: 'ms_licitacao',
  meta: {
    titulo: 'Inabilitado ou desclassificado em licitação: recurso e mandado de segurança',
    descricao:
      'Sua empresa foi inabilitada ou desclassificada? Envie a decisão e o edital: analisamos se cabe recurso, impugnação ou mandado de segurança e quais são os prazos.',
  },
  rotulo: 'Licitações · Recurso e mandado de segurança',
  titulo: 'Inabilitado ou desclassificado na licitação? Os prazos são curtos.',
  subtitulo:
    'Analisamos a decisão, o edital e a ata para dizer se cabe recurso, impugnação ou mandado de segurança, e o que fazer primeiro. O escritório retorna em até 1 dia útil.',
  dorTitulo: 'Isto está acontecendo com a sua empresa?',
  dor: [
    'A empresa foi inabilitada ou desclassificada e a decisão não parece estar de acordo com o edital.',
    'O prazo do recurso está correndo e ninguém na empresa sabe ao certo como contá-lo.',
    'O edital traz uma exigência que restringe a disputa e a sessão está próxima.',
  ],
  como: [
    {
      titulo: 'Você envia o caso',
      texto:
        'Pelo formulário ou pelo WhatsApp, com a decisão, o edital e a data em que a empresa soube do resultado.',
    },
    {
      titulo: 'Analisamos o que cabe',
      texto:
        'Lemos edital, ata e decisão e dizemos se o caminho é recurso, impugnação, mandado de segurança ou nenhuma medida, e qual é o prazo que resta.',
    },
    {
      titulo: 'Você decide com o quadro completo',
      texto:
        'Apresentamos cenários, riscos e alternativas. A decisão de seguir é da empresa, e nenhum resultado é prometido.',
    },
  ],
  credenciais: [
    'Douglas Senturião, advogado, OAB/SC nº 73.764.',
    'Direito Administrativo na raiz da atuação: licitações, contratos públicos e mandado de segurança.',
    'Cada caso é analisado do zero, sem modelos prontos.',
    'Atuação em todo o Brasil. Escritório em São Paulo/SP.',
  ],
  pergunta: {
    rotulo: 'Qual foi a decisão e quando a empresa tomou ciência dela?',
    exemplo: 'Ex.: inabilitada por falta de atestado; resultado publicado na semana passada.',
  },
  mostrarEmpresa: true,
  interesse: 'licitacoes',
  perguntasFrequentes: [
    {
      question: 'Qual é o prazo para recorrer de uma inabilitação?',
      answer:
        'Na Lei 14.133/2021, o recurso contra a habilitação, a inabilitação ou o julgamento das propostas tem prazo de 3 dias úteis; a intenção de recorrer deve ser manifestada imediatamente, sob pena de preclusão, e o prazo das razões começa na intimação ou na lavratura da ata (art. 165, I, b e c, e § 1º, I). Licitações regidas por outra lei têm outros prazos: nas estatais (Lei 13.303/2016), por exemplo, o recurso é de 5 dias úteis após a habilitação (art. 59, § 1º). Por isso é importante enviar o edital junto com a decisão.',
    },
    {
      question: 'Cabe mandado de segurança contra a decisão?',
      answer:
        'Pode caber quando há ilegalidade ou abuso de poder que viole direito líquido e certo, provado por documentos, dentro de 120 dias da ciência do ato (Lei 12.016/2009, arts. 1º e 23). A lei não admite mandado de segurança contra ato do qual caiba recurso administrativo com efeito suspensivo (art. 5º, I), e o recurso da Lei 14.133/2021 tem esse efeito (art. 168); por isso o recurso costuma vir primeiro, sem esquecer o prazo de 120 dias. Só a análise do caso diz qual é a via.',
    },
    {
      question: 'Vocês garantem a liminar ou a reversão da decisão?',
      answer:
        'Não. Ninguém pode garantir resultado em processo. A análise mostra o que cabe, qual é o risco e quais são as alternativas. A liminar depende dos requisitos da lei e da decisão do juiz.',
    },
    {
      question: 'O que devo enviar?',
      answer:
        'O edital e os anexos, a ata da sessão, a decisão, os documentos que a empresa apresentou e a data em que teve ciência. Se ainda não tiver tudo, envie o que tem: o prazo corre desde a ciência, e cada dia conta.',
    },
  ],
  textoWhatsapp:
    'Olá! Minha empresa foi inabilitada ou desclassificada numa licitação e quero analisar o recurso ou o mandado de segurança.',
  titulosPorTermo: {
    inabilitacao: 'Inabilitado na licitação? Veja o recurso e os prazos',
    desclassificacao: 'Proposta desclassificada? Veja o recurso e os prazos',
    recurso: 'Recurso em licitação: o prazo é curto. Envie o caso',
    impugnacao: 'Edital com exigência ilegal? Veja a impugnação',
    'mandado-de-seguranca': 'Mandado de segurança em licitação: veja se cabe',
  },
};
