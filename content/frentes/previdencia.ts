import type { ConteudoFrente } from './tipos';

/**
 * Fontes: Lei 8.213/1991 (art. 103, prazo para revisão), Lei 8.742/1993 (BPC/LOAS).
 */
export const PREVIDENCIA: ConteudoFrente = {
  frente: 'previdencia',
  meta: {
    titulo: 'Benefício negado pelo INSS: aposentadoria, BPC/LOAS e revisão',
    descricao:
      'O INSS negou seu benefício? Envie o caso: analisamos o motivo da negativa e os documentos para indicar o caminho, seja novo pedido, recurso ou ação.',
  },
  rotulo: 'INSS · Previdência',
  titulo: 'Benefício negado pelo INSS? Entenda o que ainda pode ser feito.',
  subtitulo:
    'Analisamos o motivo da negativa e os seus documentos para indicar o caminho: novo pedido, recurso ou ação. Aposentadoria, BPC/LOAS e revisão de benefício. O escritório retorna em até 1 dia útil.',
  dorTitulo: 'Isto está acontecendo com você ou com alguém da sua família?',
  dor: [
    'O INSS negou a aposentadoria, o auxílio ou o BPC/LOAS e a resposta não deixa claro o motivo.',
    'Você acha que o benefício que recebe saiu menor do que deveria e quer saber se há o que revisar.',
    'Você não sabe se já pode se aposentar nem qual regra vale no seu caso.',
  ],
  como: [
    {
      titulo: 'Você conta o que aconteceu',
      texto:
        'Pelo formulário ou pelo WhatsApp, com a resposta do INSS e os documentos que tiver, como o extrato de contribuições (CNIS) e laudos.',
    },
    {
      titulo: 'Analisamos o caso',
      texto:
        'Verificamos o motivo da negativa, os requisitos do benefício e se falta algum documento. Dizemos o caminho: novo pedido, recurso, ação judicial ou nenhuma medida.',
    },
    {
      titulo: 'Você decide',
      texto:
        'Mostramos as alternativas e os riscos com clareza. A decisão de seguir é sua, e nenhum resultado é prometido.',
    },
  ],
  credenciais: [
    'Douglas Senturião, advogado, OAB/SC nº 73.764.',
    'Cada caso é analisado do zero, sem modelos prontos.',
    'Apresentamos cenários, riscos e alternativas: a decisão final é sempre do cliente.',
    'Atuação em todo o Brasil.',
  ],
  pergunta: {
    rotulo: 'O que o INSS respondeu e quando?',
    exemplo: 'Ex.: BPC negado há um mês; ou aposentadoria negada por falta de tempo de contribuição.',
  },
  mostrarEmpresa: false,
  interesse: 'outro',
  perguntasFrequentes: [
    {
      question: 'O INSS negou. Acabou?',
      answer:
        'Não necessariamente. A negativa pode ser contestada por recurso administrativo e, se for o caso, por ação judicial. Às vezes falta só um documento ou uma comprovação. A análise diz qual caminho faz sentido, sem garantia de resultado.',
    },
    {
      question: 'O que é o BPC/LOAS?',
      answer:
        'É um benefício assistencial pago à pessoa idosa ou com deficiência em situação de baixa renda. Não depende de contribuições anteriores ao INSS, mas exige a comprovação dos requisitos previstos em lei, e cada um deles é analisado no seu caso.',
    },
    {
      question: 'Dá para revisar um benefício que já recebo?',
      answer:
        'Em alguns casos, sim, por exemplo quando há erro de cálculo ou documentos que não foram considerados. A revisão tem prazo-limite previsto em lei, por isso quanto antes a análise, melhor. Cada situação precisa ser verificada.',
    },
    {
      question: 'Que documentos devo reunir?',
      answer:
        'Documento de identidade e CPF, a resposta ou carta do INSS, o extrato de contribuições (CNIS), a carteira de trabalho e, quando o benefício envolve saúde, laudos e receitas. Se não tiver tudo, envie o que tiver.',
    },
  ],
  textoWhatsapp:
    'Olá! O INSS negou meu benefício (ou quero revisar minha aposentadoria) e gostaria de analisar o meu caso.',
  titulosPorTermo: {
    'beneficio-negado': 'Benefício negado pelo INSS? Veja o que fazer',
    aposentadoria: 'Aposentadoria: veja se você já tem direito',
    bpc: 'BPC/LOAS negado? Entenda o que ainda pode ser feito',
    revisao: 'Revisão de benefício do INSS: veja se há o que rever',
    'auxilio-doenca': 'Auxílio-doença negado? Veja o que fazer',
  },
};
