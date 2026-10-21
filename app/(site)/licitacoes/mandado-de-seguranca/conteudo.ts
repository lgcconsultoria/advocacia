import type { FaqItem } from '@/components/faq-accordion';

/**
 * Textos jurídicos da landing "Mandado de segurança em licitação".
 * Ficam aqui, num lugar só, para passarem pelo validador jurídico antes de
 * publicar (Provimento 205/2021 da OAB: informativo, sem promessa de
 * resultado, sem preço, sem captação indevida).
 *
 * Fontes citadas: Lei 12.016/2009 (arts. 1º, caput e § 2º; 5º, I; 6º, § 1º; 7º, III; 23),
 * Lei 13.303/2016 (art. 59, § 1º),
 * Lei 14.133/2021 (arts. 59; 62 a 70; 165, I e § 1º; 168; 170, § 4º),
 * Súmulas 429 e 430 do STF e 333 do STJ.
 */

export const CAMINHO = '/licitacoes/mandado-de-seguranca';
export const REF = 'ms-licitacao';

export const META = {
  titulo: 'Mandado de segurança em licitação: cabimento e prazo',
  descricao:
    'Inabilitado ou desclassificado por decisão ilegal? Veja quando o mandado de segurança cabe em licitação, o prazo de 120 dias (Lei 12.016/2009, art. 23), a relação com o recurso administrativo e o que reunir agora.',
};

export const HERO = {
  rotulo: 'Licitações · Lei 12.016/2009',
  titulo: 'Decisão ilegal na licitação? Veja se cabe mandado de segurança.',
  lead:
    'O mandado de segurança é a ação judicial contra ato ilegal ou abusivo de autoridade que viola, ou ameaça violar, direito líquido e certo, isto é, comprovável de plano por documentos (Lei 12.016/2009, art. 1º). O prazo é de 120 dias contados da ciência do ato (art. 23). Se ainda cabe recurso administrativo com efeito suspensivo, em regra o caminho começa por ele.',
};

export const PASSOS: { titulo: string; texto: string }[] = [
  {
    titulo: 'Anote a data em que você soube da decisão',
    texto:
      'Ata da sessão, publicação, mensagem do sistema: a data da ciência é o marco dos 120 dias do mandado de segurança (Lei 12.016/2009, art. 23). Pedido de reconsideração sem efeito suspensivo não interrompe esse prazo (Súmula 430 do STF). Por segurança, conte os 120 dias da primeira ciência da decisão.',
  },
  {
    titulo: 'Veja se ainda dá para recorrer na via administrativa',
    texto:
      'Contra a habilitação, a inabilitação ou o julgamento das propostas, a Lei 14.133/2021 exige que a intenção de recorrer seja manifestada imediatamente e que as razões sejam apresentadas em 3 dias úteis (art. 165, I, e § 1º). Esse recurso tem efeito suspensivo (art. 168), e a Lei 12.016/2009 não admite mandado de segurança contra ato do qual caiba recurso administrativo com efeito suspensivo, independentemente de caução (art. 5º, I). Em empresa pública e sociedade de economia mista vale a Lei 13.303/2016 (recurso em 5 dias úteis, art. 59, § 1º). Vale para licitações regidas pela Lei 14.133/2021. Em empresa pública e sociedade de economia mista (Lei 13.303/2016), os prazos são outros, por exemplo 5 dias úteis para recurso e impugnação até 5 dias úteis antes do certame, e o regulamento da estatal também conta.',
  },
  {
    titulo: 'Reúna a prova agora',
    texto:
      'Edital e anexos, ata, decisão com os fundamentos, os documentos que a empresa apresentou e, se houver, o recurso e a resposta. No mandado de segurança a prova é documental e vai com a petição inicial; não há fase para produzir prova depois (se o documento estiver em poder da autoridade que se recusa a fornecê-lo, o juiz pode requisitá-lo, art. 6º, § 1º).',
  },
  {
    titulo: 'Envie para análise',
    texto:
      'A análise diz se o mandado de segurança cabe, qual é o prazo que resta e qual é a alternativa (recurso, representação ao tribunal de contas). Liminar depende dos requisitos da lei e da decisão do juiz.',
  },
];

export const CABE: string[] = [
  'Decisão de autoridade da licitação (agente de contratação, pregoeiro, comissão ou autoridade superior) que contraria o edital ou a lei, demonstrável por documentos.',
  'Decisão contra a qual já não cabe recurso administrativo com efeito suspensivo, ou cujo recurso já foi decidido, dentro dos 120 dias da ciência.',
  'Omissão da autoridade em decidir: a existência de recurso administrativo com efeito suspensivo não impede o mandado de segurança contra omissão (Súmula 429 do STF).',
  'Licitação de empresa pública ou sociedade de economia mista (Súmula 333 do STJ).',
];

export const NAO_CABE: string[] = [
  'Enquanto cabe recurso administrativo com efeito suspensivo contra o mesmo ato (Lei 12.016/2009, art. 5º, I).',
  'Quando o caso depende de perícia, testemunha ou prova que não está nos documentos.',
  'Depois de 120 dias da ciência do ato (art. 23).',
  'Contra ato de gestão comercial de empresa pública, sociedade de economia mista ou concessionária (art. 1º, § 2º).',
];

export const RESSALVA =
  'Cada caso depende dos documentos, do momento do certame e do entendimento do juízo. O escritório não promete liminar nem resultado: a análise diz se cabe, qual é o risco e qual é a alternativa. Às vezes a resposta honesta é que o recurso administrativo, ou nenhuma medida, é o melhor caminho.';

export const ENVIAR: string[] = [
  'Edital e anexos (termo de referência, minuta do contrato).',
  'Ata da sessão e a decisão com os fundamentos.',
  'Os documentos de habilitação ou a proposta que a empresa apresentou.',
  'Recurso, contrarrazões e resposta, se houver.',
  'A data exata em que a empresa teve ciência da decisão.',
];

export const FAQ: FaqItem[] = [
  {
    question: 'Qual é o prazo para impetrar mandado de segurança em licitação?',
    answer:
      'O direito de pedir mandado de segurança se extingue em 120 dias, contados da ciência do ato pelo interessado (Lei 12.016/2009, art. 23). Pedido de reconsideração sem efeito suspensivo não interrompe esse prazo (Súmula 430 do STF). Por segurança, conte os 120 dias da primeira ciência da decisão.\n\nComo o prazo conta da ciência, guarde a ata, a publicação ou a mensagem do sistema que mostra quando a empresa soube da decisão.',
  },
  {
    question: 'Posso entrar com mandado de segurança se ainda cabe recurso administrativo?',
    answer:
      'A Lei 12.016/2009 não admite mandado de segurança contra ato do qual caiba recurso administrativo com efeito suspensivo, independentemente de caução (art. 5º, I). Na Lei 14.133/2021, o recurso contra habilitação, inabilitação e julgamento das propostas tem efeito suspensivo (art. 168), com razões em 3 dias úteis (art. 165, I).\n\nPor isso, em regra, a primeira medida é o recurso. Decidido o recurso, ou encerrada a via administrativa, o mandado de segurança pode ser avaliado dentro dos 120 dias. Por segurança, a análise conta o prazo da primeira ciência da decisão.',
  },
  {
    question: 'O juiz pode suspender a licitação por liminar?',
    answer:
      'A lei permite suspender o ato impugnado quando houver fundamento relevante e do ato puder resultar a ineficácia da medida, caso seja deferida só no final (Lei 12.016/2009, art. 7º, III). O juiz pode exigir caução, fiança ou depósito (art. 7º, III). É uma decisão do juiz, caso a caso: não há como garantir liminar nem o tempo da decisão.',
  },
  {
    question: 'Qual é a diferença entre inabilitação e desclassificação?',
    answer:
      'A inabilitação atinge os documentos de habilitação da empresa (jurídica, técnica, fiscal, social, trabalhista e econômico-financeira; Lei 14.133/2021, arts. 62 a 70). A desclassificação atinge a proposta, por exemplo por vício insanável, desconformidade com o edital ou preço inexequível (art. 59).\n\nAs duas decisões admitem recurso administrativo em 3 dias úteis (art. 165, I, "b" e "c").',
  },
  {
    question: 'Quais documentos preciso reunir?',
    answer:
      'Edital e anexos, ata da sessão, a decisão com os fundamentos, os documentos ou a proposta que a empresa apresentou e, se houver, recurso, contrarrazões e resposta. E a data em que a empresa teve ciência da decisão.',
  },
  {
    question: 'Além do recurso e do mandado de segurança, há outro caminho?',
    answer:
      'Qualquer licitante, contratado ou pessoa física ou jurídica pode representar aos órgãos de controle interno ou ao tribunal de contas contra irregularidades na aplicação da Lei 14.133/2021 (art. 170, § 4º). A representação não substitui o recurso nem suspende o prazo do mandado de segurança.',
  },
  {
    question: 'Quanto custa?',
    answer:
      'Os honorários dependem do caso e são informados depois da análise, antes de qualquer contratação. A triagem técnica inicial não constitui mandato profissional.',
  },
];
