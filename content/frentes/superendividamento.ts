import type { ConteudoFrente } from './tipos';

/**
 * Fontes: Lei 14.181/2021, que acrescentou ao CDC (Lei 8.078/1990) os arts. 54-A a 54-G
 * e 104-A a 104-C; Lei 11.101/2005 (recuperação judicial e extrajudicial). Conferidas no Planalto em 09/11/2026.
 */
export const SUPERENDIVIDAMENTO: ConteudoFrente = {
  frente: 'superendividamento',
  meta: {
    titulo: 'Superendividamento: Lei 14.181 para pessoa física e opções para o empresário',
    descricao:
      'Dívidas que passaram do limite? Veja o que a Lei 14.181/2021 prevê para a pessoa física e as opções para o empresário. Envie o caso para análise.',
  },
  rotulo: 'Dívidas · Lei 14.181/2021',
  titulo: 'Dívidas que passaram do limite? A lei prevê um caminho para organizá-las.',
  subtitulo:
    'Para a pessoa física, a Lei 14.181/2021 trata da repactuação das dívidas de consumo, preservando o mínimo existencial. Para o empresário, avaliamos as opções de reestruturação. O escritório retorna em até 1 dia útil.',
  dorTitulo: 'Isto está acontecendo com você?',
  dor: [
    'As parcelas das dívidas consomem a renda e falta dinheiro para despesas básicas, como moradia e alimentação.',
    'Você paga uma dívida com outra, entre cartão, empréstimo e cheque especial, e o total só aumenta.',
    'Você é empresário, a empresa não dá conta das obrigações e quer conhecer as opções antes de uma cobrança ou execução.',
  ],
  como: [
    {
      titulo: 'Você conta a situação',
      texto: 'Pelo formulário ou pelo WhatsApp: quais são as dívidas, os credores e a renda. Valores aproximados bastam.',
    },
    {
      titulo: 'Fazemos o diagnóstico',
      texto:
        'Organizamos dívidas, credores e renda e indicamos o caminho: repactuação pela Lei 14.181/2021 (pessoa física), negociação direta ou, para empresas, os instrumentos da Lei 11.101/2005.',
    },
    {
      titulo: 'Você escolhe o caminho',
      texto: 'Mostramos as alternativas e os riscos de cada uma. A decisão é sua, e nenhum resultado é prometido.',
    },
  ],
  credenciais: [
    'Douglas Senturião, advogado, OAB/SC nº 73.764.',
    'Atuação em dívidas e obrigações, e em direito empresarial.',
    'Cada caso é analisado do zero, sem modelos prontos.',
    'Atuação em todo o Brasil.',
  ],
  pergunta: {
    rotulo: 'Quais dívidas pesam mais hoje e quantos são os credores?',
    exemplo: 'Ex.: cartão de crédito, empréstimo consignado e cheque especial. Valores aproximados bastam.',
  },
  mostrarEmpresa: false,
  interesse: 'outro',
  perguntasFrequentes: [
    {
      question: 'O que é superendividamento?',
      answer:
        'Pela Lei 14.181/2021, que alterou o Código de Defesa do Consumidor, é a impossibilidade manifesta de a pessoa natural, de boa-fé, pagar a totalidade de suas dívidas de consumo, exigíveis e vincendas, sem comprometer o mínimo existencial, nos termos da regulamentação (CDC, art. 54-A, § 1º).',
    },
    {
      question: 'Como a lei ajuda a renegociar as dívidas?',
      answer:
        'A pessoa natural pode pedir ao juiz a repactuação das dívidas, com audiência de conciliação com os credores e proposta de plano de pagamento de até 5 anos (CDC, art. 104-A). Se não houver acordo com algum credor, a lei prevê, a pedido do consumidor, um processo judicial de revisão dos contratos e plano judicial compulsório (art. 104-B). O resultado depende do caso e da decisão do juiz.',
    },
    {
      question: 'Todas as dívidas entram?',
      answer:
        'Não. A lei trata de dívidas de consumo da pessoa natural e não se aplica a dívidas contraídas mediante fraude ou má-fé, a contratos feitos com o propósito de não pagar e a produtos e serviços de luxo de alto valor (art. 54-A, § 3º). Também ficam fora do processo de repactuação os créditos com garantia real, os financiamentos imobiliários e o crédito rural (art. 104-A, § 1º). Por isso o primeiro passo é separar o que entra no plano.',
    },
    {
      question: 'E se eu for empresário?',
      answer:
        'A Lei 14.181/2021 protege o consumidor pessoa natural. Para a empresa e o empresário, a reestruturação das dívidas segue outros caminhos, como a negociação direta e os instrumentos da Lei 11.101/2005 (recuperação judicial e extrajudicial), conforme o caso. A análise indica se algum deles faz sentido.',
    },
  ],
  textoWhatsapp:
    'Olá! Estou com dívidas que não consigo pagar e gostaria de saber se a Lei do Superendividamento se aplica ao meu caso.',
  titulosPorTermo: {
    superendividamento: 'Superendividamento: o que a Lei 14.181 prevê para você',
    'dividas-de-cartao': 'Dívidas de cartão e empréstimo: veja como organizar',
    repactuacao: 'Repactuação de dívidas: como funciona a audiência com os credores',
    'empresario-endividado': 'Empresário endividado: veja as opções antes da execução',
  },
};
