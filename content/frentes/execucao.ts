import type { ConteudoFrente } from './tipos';

/**
 * Fontes: CPC (títulos executivos, art. 784; ação monitória, art. 700; impenhorabilidades,
 * art. 833), Lei 8.009/1990 (bem de família). Atuação contra a Fazenda Pública: área
 * "Execuções e Cobranças" do site.
 */
export const EXECUCAO: ConteudoFrente = {
  frente: 'execucao',
  meta: {
    titulo: 'Cobrança e execução de dívidas: credor e executado',
    descricao:
      'Dívida a receber ou execução contra você? Envie o documento: analisamos o título, o devedor ou a defesa possível e os prazos.',
  },
  rotulo: 'Cobrança e execução',
  titulo: 'Dívida a cobrar ou execução contra você? Comece pela análise do documento.',
  subtitulo:
    'Se você é credor, vemos como cobrar com o que tem em mãos: contrato, cheque, nota promissória ou sentença. Se foi executado, vemos como se defender, dentro de prazos curtos. O escritório retorna em até 1 dia útil.',
  dorTitulo: 'Qual é a sua situação?',
  dor: [
    'Você tem um contrato, cheque ou nota promissória não pago e não sabe se vale a pena cobrar na Justiça.',
    'Você recebeu uma citação ou intimação de execução e os prazos para reagir já estão correndo.',
    'A empresa tem valores a receber de cliente inadimplente, ou do poder público, e precisa decidir o caminho.',
  ],
  como: [
    {
      titulo: 'Você envia o documento e a história',
      texto: 'Pelo formulário ou pelo WhatsApp: o título ou a citação, o valor e o que já foi tentado.',
    },
    {
      titulo: 'Analisamos o caminho',
      texto:
        'Credor: vemos se o documento permite execução direta e que medidas fazem sentido. Executado: conferimos a citação, o valor cobrado e as defesas possíveis.',
    },
    {
      titulo: 'Você decide',
      texto:
        'Apresentamos o cenário, os riscos e as alternativas, inclusive a de não ajuizar. Nenhum resultado é prometido.',
    },
  ],
  credenciais: [
    'Douglas Senturião, advogado, OAB/SC nº 73.764.',
    'Atuação em execuções e cobranças, contra particulares e contra a Fazenda Pública.',
    'Cada caso é analisado do zero, sem modelos prontos.',
    'Atuação em todo o Brasil.',
  ],
  pergunta: {
    rotulo: 'Você é credor ou foi executado? Qual é o documento da dívida?',
    exemplo: 'Ex.: sou credor de um contrato não pago; ou recebi a citação de uma execução.',
  },
  mostrarEmpresa: true,
  interesse: 'outro',
  perguntasFrequentes: [
    {
      question: 'Todo documento permite cobrar por execução?',
      answer:
        'Não. A execução direta exige um título executivo, como uma sentença ou certos documentos previstos em lei (por exemplo cheque, nota promissória e contrato assinado nas formas exigidas). Sem título, o caminho pode ser outro, como a ação monitória ou a ação de cobrança. A análise do documento diz qual.',
    },
    {
      question: 'Fui citado em uma execução. O que fazer primeiro?',
      answer:
        'Não ignore: os prazos para pagar ou se defender são curtos e contam da citação. Envie a citação e os documentos o quanto antes para que a defesa possível seja avaliada.',
    },
    {
      question: 'Meu salário ou minha casa podem ser penhorados?',
      answer:
        'A lei protege certos bens da penhora, como o imóvel de moradia da família (Lei 8.009/1990) e, em regra, os salários, com exceções. O que vale no seu caso depende dos fatos e precisa ser analisado.',
    },
    {
      question: 'Vocês atuam em cobrança contra órgão público?',
      answer:
        'Sim. O escritório atua em cobranças e execuções contra particulares e contra a Fazenda Pública, incluindo cumprimento de sentença, precatórios e requisições de pequeno valor (RPV).',
    },
  ],
  textoWhatsapp: 'Olá! Tenho uma dívida a cobrar (ou fui executado) e gostaria de analisar o caso.',
  titulosPorTermo: {
    cobranca: 'Dívida a receber? Veja como cobrar na Justiça',
    'execucao-de-titulo': 'Execução de título: cheque, nota promissória e contrato',
    'defesa-em-execucao': 'Citado em execução? Veja a defesa possível e os prazos',
    'cobranca-empresarial': 'Cliente não pagou? Veja o caminho da cobrança',
    precatorio: 'Crédito contra o poder público: veja o caminho',
  },
};
