import type { ConteudoFrente } from './tipos';

/**
 * Área "Direito Empresarial" do site: contratos, conflitos societários e crédito,
 * atuação consultiva e contenciosa.
 */
export const EMPRESARIAL: ConteudoFrente = {
  frente: 'empresarial',
  meta: {
    titulo: 'Acordo de sócios, contrato social e startups: assessoria jurídica empresarial',
    descricao:
      'Sócios, contratos e investimento: acordo de sócios, contrato social, vesting, mútuo conversível e assessoria jurídica mensal para empresários e fundadores.',
  },
  rotulo: 'Empresarial · Sócios, contratos e startups',
  titulo: 'Sociedade, contrato e investimento: deixe tudo escrito antes de virar conflito.',
  subtitulo:
    'Acordo de sócios, contrato social, vesting, mútuo conversível e rodada de investimento. Também assessoria jurídica mensal para o dia a dia da empresa. O escritório retorna em até 1 dia útil.',
  dorTitulo: 'Isto está acontecendo com a sua empresa?',
  dor: [
    'Você vai abrir sociedade, ou já tem sócio, e as regras de entrada, saída e decisão não estão por escrito.',
    'Você é fundador de startup e precisa estruturar vesting, mútuo conversível ou a entrada de um investidor.',
    'A empresa assina contratos o tempo todo e não tem quem os revise antes, nem a quem perguntar no dia a dia.',
  ],
  como: [
    {
      titulo: 'Você conta o momento da empresa',
      texto: 'Pelo formulário ou pelo WhatsApp: quem são os sócios, o que já existe por escrito e o que você precisa resolver.',
    },
    {
      titulo: 'Mapeamos o que falta',
      texto:
        'Lemos o contrato social e os contratos existentes e indicamos o que precisa ser escrito ou revisto: acordo de sócios, instrumento de investimento, contratos com clientes e fornecedores.',
    },
    {
      titulo: 'Você escolhe o formato',
      texto:
        'Um projeto pontual, como um acordo de sócios, ou uma assessoria mensal. O escopo é combinado por escrito antes de começar.',
    },
  ],
  credenciais: [
    'Douglas Senturião, advogado, OAB/SC nº 73.764.',
    'Direito Empresarial: contratos, conflitos societários e recuperação de crédito, em atuação consultiva e contenciosa.',
    'Cada caso é analisado do zero, sem modelos prontos.',
    'Atuação em todo o Brasil.',
  ],
  pergunta: {
    rotulo: 'Qual é a situação da empresa e o que você precisa resolver?',
    exemplo: 'Ex.: dois sócios sem acordo escrito; ou startup preparando a primeira rodada de investimento.',
  },
  mostrarEmpresa: true,
  interesse: 'outro',
  perguntasFrequentes: [
    {
      question: 'O contrato social basta para regular a relação entre os sócios?',
      answer:
        'O contrato social é o documento de constituição da sociedade e traz as regras essenciais. Temas mais detalhados, como direito de voto, entrada e saída de sócios e venda de participação, costumam ser tratados em um acordo de sócios. O que cabe em cada documento depende do tipo societário e do caso.',
    },
    {
      question: 'O que é vesting?',
      answer:
        'É um mecanismo em que o fundador ou colaborador adquire a participação aos poucos, conforme cumpre condições combinadas, como o tempo de permanência. As regras precisam ficar por escrito, com atenção ao que acontece em caso de saída.',
    },
    {
      question: 'O que é mútuo conversível?',
      answer:
        'É um contrato de empréstimo que pode ser convertido em participação na empresa, nas condições combinadas, usado em operações de investimento em startups. Os efeitos jurídicos e tributários dependem do desenho do contrato e são avaliados caso a caso.',
    },
    {
      question: 'Como funciona a assessoria mensal?',
      answer:
        'É um acompanhamento jurídico recorrente para o dia a dia da empresa, como revisão de contratos e consultas. O escopo é combinado por escrito antes de começar. A triagem técnica inicial não constitui mandato profissional nem gera honorários.',
    },
  ],
  textoWhatsapp:
    'Olá! Tenho uma empresa (ou startup) e gostaria de falar sobre acordo de sócios, contrato ou assessoria jurídica mensal.',
  titulosPorTermo: {
    'acordo-de-socios': 'Acordo de sócios: defina as regras antes do conflito',
    'contrato-social': 'Contrato social: revise antes de assinar',
    startup: 'Startup: vesting, mútuo conversível e investimento',
    'assessoria-juridica': 'Assessoria jurídica mensal para a sua empresa',
    vesting: 'Vesting: como estruturar a participação dos fundadores',
  },
};
