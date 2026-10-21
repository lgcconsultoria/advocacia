/**
 * Páginas por dor do Departamento de Licitações e Contratos Públicos
 * (/licitacoes/<slug>). Textos jurídicos validados em 21/10/2026 (validador
 * jurídico); vieram das páginas da LGC, trocando só quem faz: aqui são os
 * advogados do departamento de licitações do escritório.
 *
 * Gerado por portar_dores.mjs a partir de lgc-site/src/paginas.mjs; ao mudar
 * um texto aqui, passe de novo pelo validador.
 *
 * Fontes: Lei 14.133/2021 — arts. 9º, I, "a" e "c"; 17, § 1º; 55, § 1º; 59;
 * 62 a 70; 64; 164; 165; 166 e 167; 168; 170, § 4º; 183, III. Lei 13.303/2016.
 * Lei 12.016/2009, art. 23. TCU, Acórdão 465/2024-Plenário.
 */

import type { FaqItem } from '@/components/faq-accordion';

export type Dor = {
  slug: string;
  /** código da dor: vai na mensagem do WhatsApp e no Lead do Pixel */
  ref: string;
  titulo: string;
  descricao: string;
  selo: string;
  h1: string;
  lead: string;
  prazo: { titulo: string; texto: string };
  passosTitulo: string;
  passos: { titulo: string; texto: string }[];
  blocos: { titulo: string; itens: string[] }[];
  ressalva: string;
  faq: FaqItem[];
  cta: { titulo: string; texto: string };
};

/** Escopo da lei: vai no quadro de prazo de cada página (validação, OBRIG.). */
export const ESCOPO_LEI = "Vale para licitações regidas pela Lei 14.133/2021. Em empresa pública e sociedade de economia mista (Lei 13.303/2016), os prazos são outros, por exemplo 5 dias úteis para recurso e impugnação até 5 dias úteis antes do certame, e o regulamento da estatal também conta.";

export const DORES: Dor[] = [
  {
    "slug": "fui-inabilitado",
    "ref": "fui-inabilitado",
    "titulo": "Fui inabilitado na licitação, e agora? Prazo e recurso",
    "descricao": "Empresa inabilitada em licitação: manifeste a intenção de recorrer na hora e apresente as razões em 3 dias úteis (Lei 14.133/2021, art. 165). Veja o que fazer agora e o que reunir.",
    "selo": "Inabilitação · Lei 14.133/2021",
    "h1": "Fui inabilitado na licitação. E agora?",
    "lead": "A inabilitação pode ser revista por recurso administrativo, mas o tempo é curto: a intenção de recorrer deve ser manifestada imediatamente e as razões, apresentadas em 3 dias úteis. Veja o que fazer hoje.",
    "prazo": {
      "titulo": "Prazo: intenção de recorrer imediata e razões em 3 dias úteis.",
      "texto": "Lei 14.133/2021, art. 165, I, \"c\", e § 1º, I. O prazo das razões conta da intimação ou da lavratura da ata de habilitação ou inabilitação (ou da ata de julgamento, se o edital adotou a inversão de fases, art. 17, § 1º). Nos prazos em dias úteis, contam só os dias de expediente no órgão (art. 183, III). Confira hoje a ata e o edital: é ali que estão o momento e o meio de registrar a intenção."
    },
    "passosTitulo": "O que fazer agora",
    "passos": [
      {
        "titulo": "Registre a intenção de recorrer",
        "texto": "Sem a manifestação imediata, o direito de recorrer se perde (preclusão, art. 165, § 1º, I). Faça pelo meio que o edital e o sistema da disputa indicarem."
      },
      {
        "titulo": "Leia o motivo e compare com o edital",
        "texto": "A exigência que levou à inabilitação estava no edital? O documento apresentado atendia ao que foi pedido? É falha formal que não altera a substância do documento?"
      },
      {
        "titulo": "Veja o que a lei permite corrigir",
        "texto": "Na análise da habilitação, erros ou falhas que não alterem a substância dos documentos e sua validade jurídica podem ser sanados por despacho fundamentado (art. 64, § 1º). Em diligência, cabem complementação de informações sobre documentos já apresentados, para apurar fatos que já existiam na abertura do certame, e atualização de documento que venceu depois do recebimento das propostas (art. 64, I e II)."
      },
      {
        "titulo": "Apresente as razões em 3 dias úteis",
        "texto": "Com edital, ata, decisão e documentos em mãos. O recurso tem efeito suspensivo até a decisão final (art. 168), e o licitante tem direito de vista dos elementos indispensáveis à defesa (art. 165, § 5º)."
      }
    ],
    "blocos": [
      {
        "titulo": "Motivos de inabilitação que valem uma segunda leitura",
        "itens": [
          "Exigência que não consta do edital.",
          "Falha formal que não altera a substância nem a validade do documento (art. 64, § 1º).",
          "Informação que poderia ter sido complementada em diligência (art. 64, I).",
          "Certidão vencida depois da data de recebimento das propostas (art. 64, II)."
        ]
      },
      {
        "titulo": "O que reunir agora",
        "itens": [
          "Edital e anexos.",
          "Ata da sessão e a decisão de inabilitação com os fundamentos.",
          "Os documentos de habilitação que a empresa enviou.",
          "Certidões atualizadas e qualquer prova de que a exigência foi atendida."
        ]
      }
    ],
    "ressalva": "Nem toda inabilitação tem reversão, e o escritório não promete resultado. Os advogados do departamento de licitações analisam a ata, o edital e os documentos e dizem se há fundamento para recorrer, qual é o risco e qual é a alternativa.",
    "faq": [
      {
        "question": "Qual é o prazo para recorrer da inabilitação?",
        "answer": "A intenção de recorrer deve ser manifestada imediatamente, sob pena de preclusão, e as razões apresentadas em 3 dias úteis, contados da intimação ou da lavratura da ata de habilitação ou inabilitação (ou da ata de julgamento, se houve inversão de fases) (Lei 14.133/2021, art. 165, I, \"c\", e § 1º, I)."
      },
      {
        "question": "Posso juntar documento novo no recurso?",
        "answer": "Depois da entrega dos documentos de habilitação, a lei não permite substituir nem apresentar documentos novos, salvo em diligência, para complementar informações sobre documentos já apresentados (desde que sobre fatos existentes à época da abertura do certame) ou atualizar documentos cuja validade expirou depois do recebimento das propostas (art. 64, I e II)."
      },
      {
        "question": "Qual é a diferença entre inabilitação e desclassificação?",
        "answer": "A inabilitação atinge os documentos de habilitação da empresa (arts. 62 a 70 da Lei 14.133/2021). A desclassificação atinge a proposta, por exemplo por vício insanável, desconformidade com o edital ou preço inexequível (art. 59)."
      },
      {
        "question": "E se o recurso for negado?",
        "answer": "O recurso é dirigido à autoridade que praticou o ato; se ela não reconsiderar em 3 dias úteis, encaminha à autoridade superior, que decide em até 10 dias úteis contados do recebimento dos autos (art. 165, § 2º). Também é possível representar ao tribunal de contas ou ao controle interno (art. 170, § 4º), mas a representação não é recurso: o órgão de controle fiscaliza e não está obrigado a rever a decisão no seu caso. Se a ilegalidade persistir, o escritório avalia o mandado de segurança, dentro dos 120 dias da ciência da decisão (Lei 12.016/2009, art. 23)."
      },
      {
        "question": "Outra empresa recorreu contra a minha habilitação. E agora?",
        "answer": "Você pode apresentar contrarrazões em 3 dias úteis, contados da intimação pessoal ou da divulgação da interposição do recurso (art. 165, § 4º)."
      }
    ],
    "cta": {
      "titulo": "A ata saiu hoje? O prazo já começou.",
      "texto": "Envie o edital, a ata e a decisão. O departamento de licitações do escritório analisa o fundamento do recurso e retorna a triagem em até 1 dia útil."
    }
  },
  {
    "slug": "desclassificada-no-pregao",
    "ref": "desclassificada-pregao",
    "titulo": "Proposta desclassificada no pregão: motivos, prazo e recurso",
    "descricao": "Sua proposta foi desclassificada no pregão? Veja os motivos da Lei 14.133/2021 (art. 59), a exequibilidade, o prazo do recurso (art. 165) e o que fazer agora.",
    "selo": "Desclassificação · Pregão",
    "h1": "Sua proposta foi desclassificada no pregão?",
    "lead": "Desclassificação atinge a proposta, não os documentos da empresa. Ela pode ser contestada por recurso administrativo, mas a intenção de recorrer precisa ser manifestada na hora.",
    "prazo": {
      "titulo": "Prazo: manifeste a intenção de recorrer imediatamente.",
      "texto": "Lei 14.133/2021, art. 165, I, \"b\", e § 1º. As razões, em 3 dias úteis, começam a contar da intimação ou da lavratura da ata de habilitação ou inabilitação (ou da ata de julgamento, se houve inversão de fases, art. 17, § 1º), e os recursos são apreciados em fase única."
    },
    "passosTitulo": "O que fazer agora",
    "passos": [
      {
        "titulo": "Registre a intenção de recorrer",
        "texto": "Pelo meio que o edital e o sistema indicarem. Sem a manifestação imediata, há preclusão (art. 165, § 1º, I)."
      },
      {
        "titulo": "Identifique o motivo exato",
        "texto": "A lei lista as hipóteses de desclassificação (art. 59): vício insanável; descumprimento das especificações técnicas do edital; preço inexequível ou acima do orçamento estimado; exequibilidade não demonstrada quando exigida; outra desconformidade insanável com o edital."
      },
      {
        "titulo": "Se o motivo foi preço, reúna a prova da exequibilidade",
        "texto": "A Administração pode fazer diligências para aferir a exequibilidade ou exigir que o licitante a demonstre (art. 59, § 2º). Planilha de custos, notas fiscais, contratos semelhantes e cotações sustentam a defesa."
      },
      {
        "titulo": "Apresente as razões no prazo",
        "texto": "Com edital, ata, decisão e a prova. O recurso tem efeito suspensivo até a decisão final (art. 168)."
      }
    ],
    "blocos": [
      {
        "titulo": "Motivos de desclassificação (Lei 14.133/2021, art. 59)",
        "itens": [
          "Vícios insanáveis (I).",
          "Não atender às especificações técnicas pormenorizadas no edital (II).",
          "Preço inexequível ou acima do orçamento estimado para a contratação (III).",
          "Não demonstrar a exequibilidade, quando exigido pela Administração (IV).",
          "Desconformidade com outras exigências do edital, desde que insanável (V)."
        ]
      },
      {
        "titulo": "Obras e serviços de engenharia",
        "itens": [
          "A lei considera inexequíveis as propostas abaixo de 75% do valor orçado pela Administração (art. 59, § 4º).",
          "O TCU tem entendido que essa presunção é relativa e que a Administração deve dar ao licitante a chance de demonstrar a exequibilidade (Acórdão 465/2024-Plenário). O tema não é pacífico: vale analisar caso a caso."
        ]
      }
    ],
    "ressalva": "Cada desclassificação depende do edital e da prova disponível, e o escritório não promete resultado. Os advogados do departamento de licitações analisam a ata, o edital e a proposta e dizem se há fundamento para recorrer.",
    "faq": [
      {
        "question": "Qual é o prazo para recorrer da desclassificação?",
        "answer": "A intenção de recorrer deve ser manifestada imediatamente. As razões são apresentadas em 3 dias úteis, contados da intimação ou da lavratura da ata de habilitação ou inabilitação (ou da ata de julgamento, se houve inversão de fases), e o julgamento das propostas e a habilitação são apreciados em fase única (Lei 14.133/2021, art. 165, § 1º)."
      },
      {
        "question": "Qual é a diferença entre desclassificação e inabilitação?",
        "answer": "A desclassificação atinge a proposta (art. 59). A inabilitação atinge os documentos de habilitação da empresa (arts. 62 a 70)."
      },
      {
        "question": "A Administração pode desclassificar por preço sem me ouvir?",
        "answer": "A lei permite que a Administração faça diligências para aferir a exequibilidade ou exija que o licitante a demonstre (art. 59, § 2º). Se a decisão não abriu essa oportunidade, isso pode ser discutido no recurso, conforme o edital e o caso."
      },
      {
        "question": "O recurso suspende a licitação?",
        "answer": "O recurso e o pedido de reconsideração têm efeito suspensivo do ato ou da decisão recorrida até a decisão final da autoridade competente (art. 168)."
      }
    ],
    "cta": {
      "titulo": "Desclassificada hoje? Não deixe o prazo correr.",
      "texto": "Envie o edital, a ata e a decisão. O departamento de licitações do escritório analisa o motivo e retorna a triagem em até 1 dia útil."
    }
  },
  {
    "slug": "recurso-administrativo",
    "ref": "recurso-administrativo",
    "titulo": "Recurso administrativo em licitação: prazos e como funciona",
    "descricao": "Recurso administrativo na Lei 14.133/2021: quando cabe, prazo de 3 dias úteis (art. 165), efeito suspensivo, contrarrazões e quem decide. Recurso feito pelo departamento de licitações do escritório.",
    "selo": "Recurso · Lei 14.133/2021, art. 165",
    "h1": "Recurso administrativo em licitação: prazo curto, efeito suspensivo.",
    "lead": "O recurso administrativo é o caminho para pedir à própria Administração que reveja uma decisão da licitação. Contra as decisões da licitação, o prazo é de 3 dias úteis e, contra o julgamento das propostas e a habilitação, a intenção de recorrer deve ser manifestada na hora.",
    "prazo": {
      "titulo": "Prazo: 3 dias úteis.",
      "texto": "Lei 14.133/2021, art. 165, I. Contados da intimação ou da lavratura da ata. Contra o julgamento das propostas e a habilitação ou inabilitação, a intenção de recorrer deve ser manifestada imediatamente (art. 165, § 1º, I). Contra o julgamento das propostas e a habilitação, as razões contam da ata de habilitação ou inabilitação (ou da ata de julgamento, se houve inversão de fases)."
    },
    "passosTitulo": "Como funciona",
    "passos": [
      {
        "titulo": "Contra o que cabe",
        "texto": "Pré-qualificação e registro cadastral; julgamento das propostas; habilitação ou inabilitação; anulação ou revogação da licitação; extinção do contrato por ato unilateral da Administração (art. 165, I, \"a\" a \"e\")."
      },
      {
        "titulo": "Para quem vai",
        "texto": "É dirigido à autoridade que praticou o ato. Se ela não reconsiderar em 3 dias úteis, encaminha à autoridade superior, que decide em até 10 dias úteis (art. 165, § 2º)."
      },
      {
        "titulo": "O que acontece com a licitação",
        "texto": "O recurso tem efeito suspensivo do ato ou da decisão recorrida até a decisão final (art. 168)."
      },
      {
        "titulo": "E os outros licitantes",
        "texto": "Podem apresentar contrarrazões em 3 dias úteis, contados da intimação pessoal ou da divulgação da interposição do recurso (art. 165, § 4º)."
      }
    ],
    "blocos": [
      {
        "titulo": "O que torna um recurso forte",
        "itens": [
          "Apontar o item do edital ou o artigo da lei que a decisão contrariou.",
          "Provar com documentos o que se alega.",
          "Pedir com clareza o que se quer (reforma da decisão, habilitação, classificação).",
          "Pedir vista dos elementos indispensáveis à defesa, se precisar (art. 165, § 5º)."
        ]
      },
      {
        "titulo": "Quando não cabe recurso hierárquico",
        "itens": [
          "Cabe pedido de reconsideração, também em 3 dias úteis contados da intimação (art. 165, II)."
        ]
      }
    ],
    "ressalva": "O departamento de licitações do escritório atua na via administrativa e, se a ilegalidade persistir, avalia o mandado de segurança. Não há promessa de resultado.",
    "faq": [
      {
        "question": "Qual é o prazo do recurso administrativo na Lei 14.133/2021?",
        "answer": "Contra os atos do art. 165, I (pré-qualificação e registro cadastral, julgamento das propostas, habilitação ou inabilitação, anulação ou revogação e extinção unilateral do contrato), o prazo é de 3 dias úteis, contados da intimação ou da lavratura da ata. Contra o julgamento das propostas e a habilitação, as razões contam da ata de habilitação ou inabilitação (ou da de julgamento, se houve inversão de fases) (art. 165, § 1º, I). Contra sanções o prazo é outro: 15 dias úteis (arts. 166 e 167). Nos prazos em dias úteis, contam só os dias de expediente no órgão ou entidade (art. 183, III)."
      },
      {
        "question": "O recurso suspende a licitação?",
        "answer": "O recurso e o pedido de reconsideração têm efeito suspensivo do ato ou da decisão recorrida até a decisão final da autoridade competente (art. 168)."
      },
      {
        "question": "Quem decide o recurso?",
        "answer": "A autoridade que praticou o ato pode reconsiderar em 3 dias úteis; se não reconsiderar, a autoridade superior decide em até 10 dias úteis (art. 165, § 2º)."
      },
      {
        "question": "Perdi o momento de manifestar a intenção de recorrer. Ainda dá?",
        "answer": "Contra o julgamento das propostas e a habilitação, a falta de manifestação imediata leva à preclusão (art. 165, § 1º, I). Ainda assim, vale olhar o caso: qualquer pessoa pode representar ao tribunal de contas ou ao controle interno contra irregularidades (art. 170, § 4º). A representação não depende desse prazo, mas não é recurso e não garante a revisão da decisão."
      }
    ],
    "cta": {
      "titulo": "Tem uma decisão para contestar?",
      "texto": "Envie a ata e a decisão. O departamento de licitações do escritório confere o prazo e o fundamento e retorna a triagem em até 1 dia útil."
    }
  },
  {
    "slug": "impugnacao-de-edital",
    "ref": "impugnacao-edital",
    "titulo": "Impugnação de edital: prazo (até 3 dias úteis antes da abertura) e como fazer",
    "descricao": "Edital com exigência restritiva ou irregular? Qualquer pessoa pode impugnar até 3 dias úteis antes da abertura (Lei 14.133/2021, art. 164). Veja como fazer e o que acontece depois.",
    "selo": "Impugnação · Lei 14.133/2021, art. 164",
    "h1": "O edital tem uma exigência que tira sua empresa da disputa?",
    "lead": "A impugnação é o pedido para corrigir o edital antes da sessão. O prazo conta da data de abertura para trás: quem deixa para a última semana pode perder a chance.",
    "prazo": {
      "titulo": "Prazo: até 3 dias úteis antes da data de abertura do certame.",
      "texto": "Lei 14.133/2021, art. 164. A resposta deve ser divulgada em sítio eletrônico oficial em até 3 dias úteis, limitada ao último dia útil anterior à abertura (art. 164, parágrafo único). O mesmo prazo vale para o pedido de esclarecimento."
    },
    "passosTitulo": "O que fazer agora",
    "passos": [
      {
        "titulo": "Leia o edital assim que sair",
        "texto": "Habilitação, especificações, prazos, garantias e penalidades. Anote o que a sua empresa não consegue cumprir e por quê."
      },
      {
        "titulo": "Separe dúvida de irregularidade",
        "texto": "Dúvida vira pedido de esclarecimento. Irregularidade na aplicação da lei vira impugnação. Os dois têm o mesmo prazo (art. 164)."
      },
      {
        "titulo": "Fundamente",
        "texto": "A lei proíbe o agente público de prever no edital situações que comprometam, restrinjam ou frustrem o caráter competitivo da licitação, ou que sejam impertinentes ou irrelevantes para o objeto do contrato (art. 9º, I, \"a\" e \"c\"). Aponte o item do edital e a regra violada."
      },
      {
        "titulo": "Protocole no canal do edital",
        "texto": "Pelo meio que o edital indicar, e guarde o comprovante. Se a resposta mudar o edital de forma que afete as propostas, a lei manda nova divulgação e reabertura dos prazos (art. 55, § 1º)."
      }
    ],
    "blocos": [
      {
        "titulo": "Exigências que costumam ser impugnadas",
        "itens": [
          "Requisitos de habilitação além do que a lei permite para o objeto (arts. 62 a 70).",
          "Especificação técnica que direciona para um fornecedor.",
          "Prazos de entrega ou de execução incompatíveis com o objeto.",
          "Critérios de julgamento obscuros ou contraditórios."
        ]
      },
      {
        "titulo": "Quem pode impugnar",
        "itens": [
          "Qualquer pessoa é parte legítima para impugnar o edital por irregularidade na aplicação da Lei 14.133/2021 (art. 164)."
        ]
      }
    ],
    "ressalva": "Nem toda exigência difícil é ilegal, e o escritório não promete resultado. Os advogados do departamento de licitações separam o que vale impugnar do que se resolve com o preparo da documentação.",
    "faq": [
      {
        "question": "Qual é o prazo para impugnar o edital?",
        "answer": "Até 3 dias úteis antes da data de abertura do certame (Lei 14.133/2021, art. 164). A resposta deve ser divulgada em sítio eletrônico oficial em até 3 dias úteis, limitada ao último dia útil anterior à abertura (parágrafo único)."
      },
      {
        "question": "Quem pode impugnar?",
        "answer": "Qualquer pessoa é parte legítima para impugnar o edital por irregularidade na aplicação da lei ou para pedir esclarecimento (art. 164)."
      },
      {
        "question": "A impugnação suspende a licitação?",
        "answer": "O art. 164 não prevê efeito suspensivo automático para a impugnação. Se a resposta alterar o edital de forma que afete a formulação das propostas, a lei exige nova divulgação e o cumprimento dos mesmos prazos (art. 55, § 1º)."
      },
      {
        "question": "Impugnar atrapalha a minha empresa na disputa?",
        "answer": "A impugnação é um direito previsto em lei (art. 164), e a lei não prevê exclusão de quem impugna. O que ela pede é a correção do edital."
      }
    ],
    "cta": {
      "titulo": "O edital saiu e a abertura está próxima?",
      "texto": "Envie o edital e a data de abertura. O departamento de licitações do escritório confere o prazo e o que vale impugnar e retorna a triagem em até 1 dia útil."
    }
  }
];

export function getDor(slug: string): Dor | undefined {
  return DORES.find((d) => d.slug === slug);
}
