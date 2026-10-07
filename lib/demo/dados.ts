/**
 * Dados FICTÍCIOS das demonstrações do Sistema 360 (/sistema/demo) e do
 * portal do cliente (/cliente/demo).
 *
 * Tudo aqui é inventado: empresas ("Empresa Exemplo", "Construtora Modelo"…),
 * pessoas, valores e números de processo. Os números CNJ seguem o formato
 * oficial, mas começam com 900 e têm dígito verificador 00 — não existem.
 * Nenhum nome de cliente real pode entrar neste arquivo.
 *
 * As datas são relativas a "hoje" (quem chama passa a data), para a
 * demonstração parecer viva em qualquer dia. O formato dos tipos é o que a
 * interface espera do backend futuro (ver docs/sistema-360/PROTOTIPO.md).
 */

/* ------------------------------------------------------------------ tipos -- */

export type Papel = 'socio' | 'advogado' | 'estagiario' | 'cliente';

export type Usuario = {
  id: string;
  nome: string;
  iniciais: string;
  papel: Papel;
  cargo: string;
  email: string;
  whatsapp: string;
};

export type Area = 'Licitações' | 'Tributário' | 'Administrativo' | 'Cível' | 'Empresarial';
export const AREAS: Area[] = ['Licitações', 'Tributário', 'Administrativo', 'Cível', 'Empresarial'];

export type SistemaTribunal = 'e-SAJ' | 'eproc' | 'PJe';

export type Fase =
  | 'peticao-inicial'
  | 'citacao'
  | 'contestacao'
  | 'instrucao'
  | 'sentenca'
  | 'recurso'
  | 'cumprimento';

export const FASES: { id: Fase; rotulo: string; curto: string }[] = [
  { id: 'peticao-inicial', rotulo: 'Petição inicial', curto: 'Inicial' },
  { id: 'citacao', rotulo: 'Citação', curto: 'Citação' },
  { id: 'contestacao', rotulo: 'Contestação', curto: 'Contestação' },
  { id: 'instrucao', rotulo: 'Instrução', curto: 'Instrução' },
  { id: 'sentenca', rotulo: 'Sentença', curto: 'Sentença' },
  { id: 'recurso', rotulo: 'Recurso', curto: 'Recurso' },
  { id: 'cumprimento', rotulo: 'Cumprimento', curto: 'Cumprimento' },
];

export const rotuloFase = (f: Fase) => FASES.find((x) => x.id === f)?.rotulo ?? f;

export type FonteAndamento = 'e-SAJ' | 'eproc' | 'PJe' | 'DJEN' | 'Equipe';

export type TipoAndamento = 'movimentacao' | 'publicacao' | 'peticao' | 'decisao' | 'audiencia';

export type Andamento = {
  id: string;
  processoId: string;
  data: Date;
  tipo: TipoAndamento;
  titulo: string;
  descricao?: string;
  fonte: FonteAndamento;
  /** Versão em linguagem simples, para o portal do cliente. */
  paraCliente?: { aconteceu: string; proximo?: string };
};

export type Processo = {
  id: string;
  cnj: string;
  clienteId: string;
  titulo: string;
  parteContraria: string;
  polo: 'ativo' | 'passivo';
  area: Area;
  tribunal: string;
  sistema: SistemaTribunal;
  orgao: string;
  fase: Fase;
  valorCausa: number;
  responsavelId: string;
  distribuidoEm: Date;
  andamentos: Andamento[];
  /** Resumo em linguagem simples para o portal. */
  resumoCliente?: string;
};

export type TipoPrazo = 'prazo' | 'audiencia' | 'reuniao';

export type Prazo = {
  id: string;
  processoId: string;
  titulo: string;
  tipo: TipoPrazo;
  data: Date;
  responsavelId: string;
  avisarWhatsapp: boolean;
  cumprido: boolean;
};

export type Interesse = 'tributario' | 'licitacoes' | 'outro';

export type EtapaLead = 'novo' | 'diagnostico' | 'proposta' | 'fechado' | 'perdido';

export const ETAPAS: { id: EtapaLead; rotulo: string }[] = [
  { id: 'novo', rotulo: 'Novo lead' },
  { id: 'diagnostico', rotulo: 'Diagnóstico agendado' },
  { id: 'proposta', rotulo: 'Proposta enviada' },
  { id: 'fechado', rotulo: 'Fechado' },
  { id: 'perdido', rotulo: 'Perdido' },
];

/** Espelha o que o formulário do site grava hoje (lib/contato/enviar-lead.ts). */
export type Lead = {
  id: string;
  protocolo: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  interesse: Interesse;
  origem: { pagina: string; utm_source?: string; utm_campaign?: string };
  criadoEm: Date;
  etapa: EtapaLead;
  valorEstimado?: number;
  responsavelId?: string;
  proximoContato?: Date;
  notas?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  tipo: 'PJ' | 'PF';
  documento: string;
  cidade: string;
  areas: Area[];
  responsavelId: string;
  clienteDesde: Date;
  contato: { nome: string; email: string; telefone: string };
  plano?: string;
  honorariosMensais?: number;
};

export type Publicacao = {
  id: string;
  processoId: string;
  data: Date;
  diario: 'DJEN';
  orgao: string;
  tipo: 'Intimação' | 'Despacho' | 'Decisão' | 'Sentença' | 'Edital';
  teor: string;
  lida: boolean;
};

export type CanalAlerta = 'WhatsApp' | 'E-mail';

export type RegraAlerta = {
  id: string;
  gatilho: string;
  condicao: string;
  canal: CanalAlerta;
  destino: string;
  ativo: boolean;
  disparos7d: number;
};

export type TipoNotificacao = 'publicacao' | 'prazo' | 'whatsapp' | 'lead' | 'sistema';

export type Notificacao = {
  id: string;
  tipo: TipoNotificacao;
  ator: string;
  /** Frase: textos simples e trechos em destaque. */
  frase: (string | { destaque: string })[];
  quando: Date;
  contexto?: string;
  lida: boolean;
  href?: string;
};

export type StatusAgente = 'ok' | 'atencao' | 'erro';

export type Agente = {
  id: string;
  nome: string;
  alvo: string;
  status: StatusAgente;
  ultimaVarreduraMin: number;
  intervaloMin: number;
  monitorados: number;
  nota?: string;
};

export type Fatura = {
  id: string;
  clienteId: string;
  descricao: string;
  competencia: string;
  valor: number;
  vencimento: Date;
  status: 'paga' | 'aberta' | 'vencida';
};

export type DocumentoPortal = {
  id: string;
  nome: string;
  descricao: string;
  status: 'pendente' | 'enviado' | 'aprovado';
  prazo?: Date;
  processoId?: string;
  enviadoEm?: Date;
};

export type MensagemPortal = {
  id: string;
  de: 'escritorio' | 'cliente';
  autor: string;
  texto: string;
  quando: Date;
};

export type DadosDemo = {
  hoje: Date;
  usuarios: Usuario[];
  eu: Usuario;
  clientes: Cliente[];
  processos: Processo[];
  prazos: Prazo[];
  publicacoes: Publicacao[];
  leads: Lead[];
  regras: RegraAlerta[];
  notificacoes: Notificacao[];
  agentes: Agente[];
  faturas: Fatura[];
  portal: {
    clienteId: string;
    documentos: DocumentoPortal[];
    mensagens: MensagemPortal[];
    contrato: { numero: string; objeto: string; inicio: Date; renovacao: Date; honorariosMensais: number; exito: string };
  };
};

/* --------------------------------------------------------------- utilitário -- */

/** WhatsApp público do escritório (o mesmo do botão flutuante do site). */
export const WHATSAPP_ESCRITORIO = '5567991675629';

export const linkWhatsapp = (texto: string, numero = WHATSAPP_ESCRITORIO) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

/** PRNG determinístico: a demonstração é a mesma em todo carregamento. */
function semente(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function dia(hoje: Date, deslocamento: number, hora = 9, minuto = 0) {
  const d = new Date(hoje);
  d.setDate(d.getDate() + deslocamento);
  d.setHours(hora, minuto, 0, 0);
  return d;
}

/** Pula sábado e domingo para frente (prazo processual cai em dia útil). */
function diaUtil(hoje: Date, deslocamento: number, hora = 9, minuto = 0) {
  const d = dia(hoje, deslocamento, hora, minuto);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

/** CNJ fictício: NNNNNNN-DD.AAAA.J.TR.OOOO, sempre começando por 900 e com DV 00. */
function cnj(seq: number, ano: number, j: number, tr: number, origem: number) {
  const n = `900${String(seq).padStart(4, '0')}`;
  return `${n}-00.${ano}.${j}.${String(tr).padStart(2, '0')}.${String(origem).padStart(4, '0')}`;
}

/* ------------------------------------------------------------------ equipe -- */

const USUARIOS: Usuario[] = [
  { id: 'u-ds', nome: 'Douglas Senturião', iniciais: 'DS', papel: 'socio', cargo: 'Sócio', email: 'douglas@exemplo.adv.br', whatsapp: '+55 67 90000-0001' },
  { id: 'u-me', nome: 'Marina Exemplo', iniciais: 'ME', papel: 'advogado', cargo: 'Advogada', email: 'marina@exemplo.adv.br', whatsapp: '+55 67 90000-0002' },
  { id: 'u-rm', nome: 'Rafael Modelo', iniciais: 'RM', papel: 'advogado', cargo: 'Advogado', email: 'rafael@exemplo.adv.br', whatsapp: '+55 67 90000-0003' },
  { id: 'u-jd', nome: 'Júlia Demo', iniciais: 'JD', papel: 'estagiario', cargo: 'Estagiária', email: 'julia@exemplo.adv.br', whatsapp: '+55 67 90000-0004' },
];

/* ---------------------------------------------------------------- tribunais -- */

type Foro = { tribunal: string; sistema: SistemaTribunal; j: number; tr: number; orgaos: string[] };

const FOROS: Foro[] = [
  { tribunal: 'TJMS', sistema: 'e-SAJ', j: 8, tr: 12, orgaos: ['1ª Vara de Fazenda Pública de Campo Grande', '2ª Vara Cível de Campo Grande', 'Vara Única de Vila Exemplo'] },
  { tribunal: 'TJSP', sistema: 'e-SAJ', j: 8, tr: 26, orgaos: ['3ª Vara de Fazenda Pública da Capital', '12ª Vara Cível do Foro Central'] },
  { tribunal: 'TRF4', sistema: 'eproc', j: 4, tr: 4, orgaos: ['2ª Vara Federal de Curitiba', '1ª Turma Recursal do PR'] },
  { tribunal: 'TJSC', sistema: 'eproc', j: 8, tr: 24, orgaos: ['Vara da Fazenda de Joinville'] },
  { tribunal: 'TRF3', sistema: 'PJe', j: 4, tr: 3, orgaos: ['1ª Vara Federal de Campo Grande', '4ª Vara Federal de Dourados'] },
  { tribunal: 'TRT24', sistema: 'PJe', j: 5, tr: 24, orgaos: ['3ª Vara do Trabalho de Campo Grande'] },
];

/* ------------------------------------------------------------------ geração -- */

export function gerarDadosDemo(hojeEntrada: Date): DadosDemo {
  const hoje = new Date(hojeEntrada);
  hoje.setHours(0, 0, 0, 0);
  const ano = hoje.getFullYear();
  const rnd = semente(360);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];

  /* clientes */
  const clientes: Cliente[] = [
    { id: 'c-exemplo', nome: 'Empresa Exemplo Ltda.', tipo: 'PJ', documento: '00.000.001/0001-00 (fictício)', cidade: 'Campo Grande/MS', areas: ['Licitações', 'Tributário'], responsavelId: 'u-ds', clienteDesde: dia(hoje, -420), contato: { nome: 'Lúcia Exemplo', email: 'financeiro@empresaexemplo.com.br', telefone: '(67) 90000-1010' }, plano: 'Jurídico 360 — Empresarial', honorariosMensais: 4800 },
    { id: 'c-construtora', nome: 'Construtora Modelo S.A.', tipo: 'PJ', documento: '00.000.002/0001-00 (fictício)', cidade: 'Dourados/MS', areas: ['Licitações', 'Administrativo'], responsavelId: 'u-me', clienteDesde: dia(hoje, -900), contato: { nome: 'Pedro Modelo', email: 'juridico@construtoramodelo.com.br', telefone: '(67) 90000-2020' }, plano: 'Jurídico 360 — Licitações', honorariosMensais: 6500 },
    { id: 'c-transportes', nome: 'Transportes Fictícia Ltda.', tipo: 'PJ', documento: '00.000.003/0001-00 (fictício)', cidade: 'Curitiba/PR', areas: ['Tributário'], responsavelId: 'u-rm', clienteDesde: dia(hoje, -260), contato: { nome: 'Sônia Fictícia', email: 'contato@transportesficticia.com.br', telefone: '(41) 90000-3030' }, plano: 'Recuperação tributária', honorariosMensais: 2900 },
    { id: 'c-industria', nome: 'Indústria Amostra Ltda.', tipo: 'PJ', documento: '00.000.004/0001-00 (fictício)', cidade: 'São Paulo/SP', areas: ['Tributário', 'Empresarial'], responsavelId: 'u-ds', clienteDesde: dia(hoje, -610), contato: { nome: 'Marcos Amostra', email: 'controladoria@industriaamostra.com.br', telefone: '(11) 90000-4040' }, plano: 'Jurídico 360 — Empresarial', honorariosMensais: 7200 },
    { id: 'c-comercio', nome: 'Comércio Demonstração ME', tipo: 'PJ', documento: '00.000.005/0001-00 (fictício)', cidade: 'Joinville/SC', areas: ['Cível'], responsavelId: 'u-rm', clienteDesde: dia(hoje, -150), contato: { nome: 'Rita Demonstração', email: 'rita@comerciodemo.com.br', telefone: '(47) 90000-5050' } },
    { id: 'c-clinica', nome: 'Clínica Ilustrativa Ltda.', tipo: 'PJ', documento: '00.000.006/0001-00 (fictício)', cidade: 'Campo Grande/MS', areas: ['Administrativo', 'Cível'], responsavelId: 'u-me', clienteDesde: dia(hoje, -330), contato: { nome: 'Dra. Helena Ilustrativa', email: 'adm@clinicailustrativa.com.br', telefone: '(67) 90000-6060' }, honorariosMensais: 1900 },
    { id: 'c-cooperativa', nome: 'Cooperativa Protótipo', tipo: 'PJ', documento: '00.000.007/0001-00 (fictício)', cidade: 'Dourados/MS', areas: ['Tributário', 'Licitações'], responsavelId: 'u-ds', clienteDesde: dia(hoje, -720), contato: { nome: 'Ivo Protótipo', email: 'diretoria@cooperativaprototipo.coop.br', telefone: '(67) 90000-7070' }, plano: 'Jurídico 360 — Empresarial', honorariosMensais: 5400 },
    { id: 'c-ana', nome: 'Ana Fictícia de Souza', tipo: 'PF', documento: '000.000.001-00 (fictício)', cidade: 'Campo Grande/MS', areas: ['Administrativo'], responsavelId: 'u-me', clienteDesde: dia(hoje, -95), contato: { nome: 'Ana Fictícia de Souza', email: 'ana.ficticia@email.com', telefone: '(67) 90000-8080' } },
    { id: 'c-joao', nome: 'João Exemplar Lima', tipo: 'PF', documento: '000.000.002-00 (fictício)', cidade: 'Curitiba/PR', areas: ['Cível'], responsavelId: 'u-rm', clienteDesde: dia(hoje, -60), contato: { nome: 'João Exemplar Lima', email: 'joao.exemplar@email.com', telefone: '(41) 90000-9090' } },
  ];

  /* processos feitos à mão (ricos em detalhe) */
  const processos: Processo[] = [];
  let seq = 101;

  const novo = (
    p: Omit<Processo, 'id' | 'cnj' | 'andamentos' | 'tribunal' | 'sistema'> & { foro: number; origem?: number; anoDist?: number },
    andamentos: Omit<Andamento, 'id' | 'processoId'>[],
  ) => {
    const foro = FOROS[p.foro];
    const id = `p-${seq}`;
    const proc: Processo = {
      id,
      cnj: cnj(seq, p.anoDist ?? p.distribuidoEm.getFullYear(), foro.j, foro.tr, p.origem ?? 1),
      clienteId: p.clienteId,
      titulo: p.titulo,
      parteContraria: p.parteContraria,
      polo: p.polo,
      area: p.area,
      tribunal: foro.tribunal,
      sistema: foro.sistema,
      orgao: p.orgao,
      fase: p.fase,
      valorCausa: p.valorCausa,
      responsavelId: p.responsavelId,
      distribuidoEm: p.distribuidoEm,
      resumoCliente: p.resumoCliente,
      andamentos: andamentos
        .map((a, i) => ({ ...a, id: `${id}-a${i}`, processoId: id }))
        .sort((a, b) => b.data.getTime() - a.data.getTime()),
    };
    seq += 1;
    processos.push(proc);
    return proc;
  };

  const ms = novo(
    {
      foro: 0, clienteId: 'c-exemplo', titulo: 'Mandado de segurança — inabilitação no Pregão 41/2026', parteContraria: 'Município de Vila Exemplo', polo: 'ativo', area: 'Licitações',
      orgao: '1ª Vara de Fazenda Pública de Campo Grande', fase: 'instrucao', valorCausa: 380000, responsavelId: 'u-ds', distribuidoEm: dia(hoje, -48),
      resumoCliente: 'Pedimos à Justiça que a empresa volte ao pregão de manutenção predial, do qual foi excluída por um erro na análise dos documentos.',
    },
    [
      { data: dia(hoje, 0, 8, 12), tipo: 'publicacao', fonte: 'DJEN', titulo: 'Intimação: prazo de 15 dias para manifestação sobre as informações', descricao: 'Intimada a impetrante para, querendo, manifestar-se sobre as informações prestadas pela autoridade coatora.', paraCliente: { aconteceu: 'O Município apresentou a versão dele e o juiz abriu prazo para respondermos.', proximo: 'Nossa resposta será protocolada até o fim do prazo, que acompanhamos aqui no portal.' } },
      { data: dia(hoje, -6, 16, 40), tipo: 'movimentacao', fonte: 'e-SAJ', titulo: 'Juntada de informações da autoridade coatora', paraCliente: { aconteceu: 'O Município enviou ao processo as explicações sobre a exclusão da empresa.' } },
      { data: dia(hoje, -19, 11, 5), tipo: 'decisao', fonte: 'e-SAJ', titulo: 'Liminar deferida — suspensão da homologação do certame', descricao: 'Deferida a medida liminar para suspender a homologação até o julgamento do mérito.', paraCliente: { aconteceu: 'Boa notícia: o juiz suspendeu a conclusão do pregão até decidir o caso.', proximo: 'Enquanto isso, o Município não pode assinar contrato com outra empresa.' } },
      { data: dia(hoje, -47, 14, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Petição inicial protocolada com pedido de liminar', paraCliente: { aconteceu: 'Entramos com o mandado de segurança e pedimos uma decisão urgente.' } },
    ],
  );

  const recTrib = novo(
    {
      foro: 4, clienteId: 'c-exemplo', titulo: 'Ação de repetição de indébito — PIS/COFINS sobre ICMS', parteContraria: 'União (Fazenda Nacional)', polo: 'ativo', area: 'Tributário',
      orgao: '1ª Vara Federal de Campo Grande', fase: 'sentenca', valorCausa: 1260000, responsavelId: 'u-rm', distribuidoEm: dia(hoje, -310),
      resumoCliente: 'Buscamos a devolução de tributos pagos a mais nos últimos cinco anos, com correção pela Selic.',
    },
    [
      { data: dia(hoje, -2, 10, 30), tipo: 'movimentacao', fonte: 'PJe', titulo: 'Conclusos para sentença', paraCliente: { aconteceu: 'O processo foi para o juiz decidir.', proximo: 'A sentença costuma sair em algumas semanas. Avisaremos assim que for publicada.' } },
      { data: dia(hoje, -21, 9, 15), tipo: 'peticao', fonte: 'Equipe', titulo: 'Réplica à contestação da União', paraCliente: { aconteceu: 'Respondemos aos argumentos da União, ponto a ponto.' } },
      { data: dia(hoje, -64, 15, 20), tipo: 'movimentacao', fonte: 'PJe', titulo: 'Contestação apresentada pela União', paraCliente: { aconteceu: 'A União apresentou a defesa dela, como já era esperado.' } },
      { data: dia(hoje, -300, 9, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Distribuição da petição inicial', paraCliente: { aconteceu: 'O processo começou.' } },
    ],
  );

  const exec = novo(
    {
      foro: 0, clienteId: 'c-exemplo', titulo: 'Cobrança de medições em atraso — contrato 12/2025', parteContraria: 'Fundação Pública Modelo', polo: 'ativo', area: 'Administrativo',
      orgao: '2ª Vara Cível de Campo Grande', fase: 'citacao', valorCausa: 214500, responsavelId: 'u-me', distribuidoEm: dia(hoje, -20), origem: 2,
      resumoCliente: 'Cobramos três medições do contrato de manutenção que a Fundação não pagou.',
    },
    [
      { data: dia(hoje, -1, 13, 45), tipo: 'movimentacao', fonte: 'e-SAJ', titulo: 'Expedido mandado de citação', paraCliente: { aconteceu: 'A Justiça enviou a citação para a Fundação saber da cobrança.', proximo: 'Depois de citada, ela terá prazo para pagar ou se defender.' } },
      { data: dia(hoje, -18, 10, 0), tipo: 'decisao', fonte: 'e-SAJ', titulo: 'Recebida a inicial; determinada a citação', paraCliente: { aconteceu: 'O juiz aceitou o pedido e mandou chamar a Fundação.' } },
      { data: dia(hoje, -20, 17, 10), tipo: 'peticao', fonte: 'Equipe', titulo: 'Petição inicial protocolada', paraCliente: { aconteceu: 'Entramos com a ação de cobrança.' } },
    ],
  );

  novo(
    { foro: 0, clienteId: 'c-construtora', titulo: 'Anulação de multa contratual — obra da UBS Centro', parteContraria: 'Município de Vila Exemplo', polo: 'ativo', area: 'Administrativo', orgao: 'Vara Única de Vila Exemplo', fase: 'contestacao', valorCausa: 452000, responsavelId: 'u-me', distribuidoEm: dia(hoje, -80), origem: 31 },
    [
      { data: dia(hoje, 0, 7, 58), tipo: 'publicacao', fonte: 'DJEN', titulo: 'Intimação para réplica (15 dias)' },
      { data: dia(hoje, -9, 14, 22), tipo: 'movimentacao', fonte: 'e-SAJ', titulo: 'Juntada de contestação do Município' },
      { data: dia(hoje, -78, 9, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Petição inicial protocolada' },
    ],
  );

  novo(
    { foro: 1, clienteId: 'c-construtora', titulo: 'Recurso de apelação — desclassificação na Concorrência 03/2025', parteContraria: 'Estado Fictício (Secretaria de Obras)', polo: 'ativo', area: 'Licitações', orgao: '3ª Vara de Fazenda Pública da Capital', fase: 'recurso', valorCausa: 2900000, responsavelId: 'u-ds', distribuidoEm: dia(hoje, -400), anoDist: ano - 1, origem: 53 },
    [
      { data: dia(hoje, -3, 18, 2), tipo: 'movimentacao', fonte: 'e-SAJ', titulo: 'Remetidos os autos ao Tribunal' },
      { data: dia(hoje, -25, 11, 30), tipo: 'peticao', fonte: 'Equipe', titulo: 'Apelação protocolada' },
      { data: dia(hoje, -41, 16, 0), tipo: 'decisao', fonte: 'e-SAJ', titulo: 'Sentença de improcedência publicada' },
    ],
  );

  novo(
    { foro: 2, clienteId: 'c-transportes', titulo: 'Mandado de segurança — exclusão do ICMS da base do PIS/COFINS', parteContraria: 'Delegado da Receita Federal em Curitiba', polo: 'ativo', area: 'Tributário', orgao: '2ª Vara Federal de Curitiba', fase: 'sentenca', valorCausa: 870000, responsavelId: 'u-rm', distribuidoEm: dia(hoje, -190), origem: 7000 },
    [
      { data: dia(hoje, 0, 6, 40), tipo: 'publicacao', fonte: 'DJEN', titulo: 'Sentença: segurança concedida em parte' },
      { data: dia(hoje, -14, 15, 0), tipo: 'movimentacao', fonte: 'eproc', titulo: 'Parecer do Ministério Público Federal' },
      { data: dia(hoje, -180, 10, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Petição inicial protocolada' },
    ],
  );

  novo(
    { foro: 1, clienteId: 'c-industria', titulo: 'Embargos à execução fiscal — ICMS-ST', parteContraria: 'Fazenda do Estado Fictício', polo: 'passivo', area: 'Tributário', orgao: '12ª Vara Cível do Foro Central', fase: 'instrucao', valorCausa: 3410000, responsavelId: 'u-ds', distribuidoEm: dia(hoje, -520), anoDist: ano - 1, origem: 100 },
    [
      { data: dia(hoje, -1, 9, 10), tipo: 'audiencia', fonte: 'e-SAJ', titulo: 'Designada perícia contábil — início em 20 dias' },
      { data: dia(hoje, -30, 14, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Quesitos periciais apresentados' },
    ],
  );

  novo(
    { foro: 3, clienteId: 'c-comercio', titulo: 'Ação de cobrança — duplicatas', parteContraria: 'Atacado Hipotético Ltda.', polo: 'ativo', area: 'Cível', orgao: 'Vara da Fazenda de Joinville', fase: 'cumprimento', valorCausa: 96300, responsavelId: 'u-rm', distribuidoEm: dia(hoje, -610), anoDist: ano - 2, origem: 38 },
    [
      { data: dia(hoje, -4, 12, 0), tipo: 'movimentacao', fonte: 'eproc', titulo: 'Bloqueio parcial via Sisbajud (R$ 41.208,10)' },
      { data: dia(hoje, -35, 9, 40), tipo: 'peticao', fonte: 'Equipe', titulo: 'Pedido de penhora on-line' },
    ],
  );

  novo(
    { foro: 5, clienteId: 'c-clinica', titulo: 'Reclamação trabalhista — defesa', parteContraria: 'Ex-colaborador (nome omitido)', polo: 'passivo', area: 'Cível', orgao: '3ª Vara do Trabalho de Campo Grande', fase: 'instrucao', valorCausa: 58000, responsavelId: 'u-me', distribuidoEm: dia(hoje, -120), origem: 3 },
    [
      { data: dia(hoje, -2, 16, 15), tipo: 'audiencia', fonte: 'PJe', titulo: 'Audiência de instrução redesignada' },
      { data: dia(hoje, -60, 10, 0), tipo: 'peticao', fonte: 'Equipe', titulo: 'Contestação protocolada' },
    ],
  );

  novo(
    { foro: 0, clienteId: 'c-ana', titulo: 'Nomeação em concurso — preterição', parteContraria: 'Estado Fictício', polo: 'ativo', area: 'Administrativo', orgao: '1ª Vara de Fazenda Pública de Campo Grande', fase: 'peticao-inicial', valorCausa: 60000, responsavelId: 'u-me', distribuidoEm: dia(hoje, -3), origem: 1 },
    [
      { data: dia(hoje, -3, 17, 30), tipo: 'peticao', fonte: 'Equipe', titulo: 'Petição inicial protocolada com pedido de tutela' },
    ],
  );

  /* processos gerados (carteira) */
  const titulosGerados: { area: Area; titulo: string }[] = [
    { area: 'Licitações', titulo: 'Mandado de segurança — habilitação em pregão eletrônico' },
    { area: 'Licitações', titulo: 'Ação anulatória — sanção de impedimento de licitar' },
    { area: 'Licitações', titulo: 'Reequilíbrio econômico-financeiro de contrato' },
    { area: 'Tributário', titulo: 'Compensação de créditos de PIS/COFINS' },
    { area: 'Tributário', titulo: 'Exceção de pré-executividade — CDA prescrita' },
    { area: 'Tributário', titulo: 'Restituição de ICMS-DIFAL' },
    { area: 'Administrativo', titulo: 'Revisão de penalidade aplicada pela agência' },
    { area: 'Administrativo', titulo: 'Ação de cobrança contra autarquia' },
    { area: 'Cível', titulo: 'Indenização por descumprimento contratual' },
    { area: 'Cível', titulo: 'Busca e apreensão — alienação fiduciária' },
    { area: 'Empresarial', titulo: 'Dissolução parcial de sociedade' },
    { area: 'Empresarial', titulo: 'Execução de título extrajudicial' },
  ];
  const contrarias = ['Município de Vila Exemplo', 'Estado Fictício', 'União (Fazenda Nacional)', 'Autarquia Modelo', 'Fornecedora Hipotética S.A.', 'Banco Ilustrativo S.A.', 'Sócio retirante (nome omitido)'];
  const genAndamentos = [
    { tipo: 'movimentacao' as const, titulo: 'Concluso para decisão' },
    { tipo: 'movimentacao' as const, titulo: 'Juntada de petição' },
    { tipo: 'publicacao' as const, titulo: 'Intimação publicada' },
    { tipo: 'decisao' as const, titulo: 'Despacho: vista à parte contrária' },
    { tipo: 'movimentacao' as const, titulo: 'Certidão de decurso de prazo' },
    { tipo: 'peticao' as const, titulo: 'Manifestação protocolada' },
    { tipo: 'audiencia' as const, titulo: 'Audiência de conciliação designada' },
  ];
  // A carteira gerada não entra no cliente do portal (Empresa Exemplo), que só tem processos escritos à mão.
  const clientesPJ = clientes.filter((c) => c.id !== 'c-exemplo').map((c) => c.id);
  for (let i = 0; i < 18; i++) {
    const t = titulosGerados[i % titulosGerados.length];
    const foroIdx = Math.floor(rnd() * FOROS.length);
    const foro = FOROS[foroIdx];
    const fase = FASES[Math.floor(rnd() * FASES.length)].id;
    const dist = -Math.floor(40 + rnd() * 700);
    const n = 2 + Math.floor(rnd() * 3);
    const ands: Omit<Andamento, 'id' | 'processoId'>[] = [];
    for (let k = 0; k < n; k++) {
      const g = pick(genAndamentos);
      const off = -Math.floor(rnd() * 70) - k * 6;
      ands.push({
        data: dia(hoje, off, 8 + Math.floor(rnd() * 10), Math.floor(rnd() * 60)),
        tipo: g.tipo,
        titulo: g.titulo,
        fonte: g.tipo === 'peticao' ? 'Equipe' : g.tipo === 'publicacao' ? 'DJEN' : foro.sistema,
      });
    }
    const distribuido = dia(hoje, dist);
    novo(
      {
        foro: foroIdx,
        clienteId: clientesPJ[(i + 1) % clientesPJ.length],
        titulo: t.titulo,
        parteContraria: pick(contrarias),
        polo: rnd() > 0.3 ? 'ativo' : 'passivo',
        area: t.area,
        orgao: pick(foro.orgaos),
        fase,
        valorCausa: Math.round((20000 + rnd() * 1500000) / 100) * 100,
        responsavelId: pick(USUARIOS.slice(0, 3)).id,
        distribuidoEm: distribuido,
        origem: 1 + Math.floor(rnd() * 90),
      },
      ands,
    );
  }

  /* prazos */
  const prazos: Prazo[] = [];
  let pz = 1;
  const prazo = (processoId: string, titulo: string, offset: number, tipo: TipoPrazo = 'prazo', responsavelId = 'u-ds', avisar = true, hora = 23, minuto = 59) => {
    prazos.push({ id: `pz-${pz++}`, processoId, titulo, tipo, data: tipo === 'prazo' ? diaUtil(hoje, offset, hora, minuto) : diaUtil(hoje, offset, hora, minuto), responsavelId, avisarWhatsapp: avisar, cumprido: false });
  };
  prazo(processos[3].id, 'Réplica à contestação', 0, 'prazo', 'u-me');
  prazo(ms.id, 'Manifestação sobre as informações', 3, 'prazo', 'u-ds');
  prazo(processos[5].id, 'Embargos de declaração da sentença', 1, 'prazo', 'u-rm');
  prazo(processos[8].id, 'Audiência de instrução', 2, 'audiencia', 'u-me', true, 14, 0);
  prazo(processos[7].id, 'Manifestação sobre o bloqueio Sisbajud', 4, 'prazo', 'u-rm', false);
  prazo(processos[6].id, 'Indicar assistente técnico', 6, 'prazo', 'u-ds');
  prazo(exec.id, 'Acompanhar cumprimento do mandado', 9, 'prazo', 'u-jd', false);
  prazo(recTrib.id, 'Reunião com o cliente — cenário pós-sentença', 5, 'reuniao', 'u-rm', true, 10, 30);
  prazo(processos[4].id, 'Contrarrazões (se houver recurso adverso)', 12, 'prazo', 'u-ds', false);
  prazo(processos[9].id, 'Emenda à inicial (se determinada)', 15, 'prazo', 'u-me', false);
  for (let i = 10; i < processos.length; i += 2) {
    prazo(processos[i].id, pick(['Manifestação', 'Contrarrazões', 'Especificação de provas', 'Memoriais', 'Impugnação ao cumprimento']), 3 + Math.floor(rnd() * 26), 'prazo', processos[i].responsavelId, rnd() > 0.4);
  }
  prazo(processos[12].id, 'Audiência de conciliação', 11, 'audiencia', 'u-rm', true, 15, 30);
  prazo(processos[15].id, 'Audiência una', 18, 'audiencia', 'u-me', true, 9, 0);
  prazos.sort((a, b) => a.data.getTime() - b.data.getTime());

  /* publicações (DJEN) */
  const publicacoes: Publicacao[] = processos
    .flatMap((p) => p.andamentos.filter((a) => a.fonte === 'DJEN').map((a) => ({ p, a })))
    .map(({ p, a }, i) => ({
      id: `pub-${i + 1}`,
      processoId: p.id,
      data: a.data,
      diario: 'DJEN' as const,
      orgao: `${p.tribunal} — ${p.orgao}`,
      tipo: (/sentença/i.test(a.titulo) ? 'Sentença' : /despacho/i.test(a.titulo) ? 'Despacho' : 'Intimação') as Publicacao['tipo'],
      teor: a.descricao ?? `${a.titulo}. Processo ${p.cnj}. Partes: ${clientes.find((c) => c.id === p.clienteId)?.nome} × ${p.parteContraria}.`,
      lida: a.data.getTime() < hoje.getTime(),
    }))
    .sort((a, b) => b.data.getTime() - a.data.getTime());

  /* leads (mesmo formato do formulário do site) */
  const leads: Lead[] = [
    { id: 'l-1', protocolo: 'LD-0000-0101', nome: 'Carlos Fictício', empresa: 'Padaria Exemplo Ltda.', email: 'carlos@padariaexemplo.com.br', telefone: '(67) 90000-1111', interesse: 'tributario', origem: { pagina: '/tributario', utm_source: 'instagram', utm_campaign: 'reforma-tributaria' }, criadoEm: dia(hoje, 0, 8, 47), etapa: 'novo' },
    { id: 'l-2', protocolo: 'LD-0000-0102', nome: 'Beatriz Modelo', empresa: 'Engenharia Amostra Ltda.', email: 'beatriz@engamostra.com.br', telefone: '(67) 90000-2222', interesse: 'licitacoes', origem: { pagina: '/licitacoes', utm_source: 'google', utm_campaign: 'pregao' }, criadoEm: dia(hoje, -1, 19, 12), etapa: 'novo' },
    { id: 'l-3', protocolo: 'LD-0000-0103', nome: 'Rodrigo Demo', empresa: 'Distribuidora Ilustrativa', email: 'rodrigo@distilustrativa.com.br', telefone: '(41) 90000-3333', interesse: 'tributario', origem: { pagina: '/diagnostico' }, criadoEm: dia(hoje, -1, 10, 3), etapa: 'novo' },
    { id: 'l-4', protocolo: 'LD-0000-0097', nome: 'Fernanda Exemplo', empresa: 'Laboratório Hipotético', email: 'fernanda@labhipotetico.com.br', telefone: '(11) 90000-4444', interesse: 'outro', origem: { pagina: '/contato' }, criadoEm: dia(hoje, -3, 14, 30), etapa: 'diagnostico', responsavelId: 'u-me', proximoContato: diaUtil(hoje, 1, 10, 0), notas: 'Quer revisar contratos com fornecedores públicos.' },
    { id: 'l-5', protocolo: 'LD-0000-0095', nome: 'Gustavo Protótipo', empresa: 'Agropecuária Modelo', email: 'gustavo@agromodelo.com.br', telefone: '(67) 90000-5555', interesse: 'tributario', origem: { pagina: '/tributario', utm_source: 'linkedin' }, criadoEm: dia(hoje, -5, 9, 20), etapa: 'diagnostico', responsavelId: 'u-rm', proximoContato: diaUtil(hoje, 2, 15, 0), valorEstimado: 18000 },
    { id: 'l-6', protocolo: 'LD-0000-0090', nome: 'Patrícia Amostra', empresa: 'Serviços Gerais Exemplo', email: 'patricia@sgexemplo.com.br', telefone: '(67) 90000-6666', interesse: 'licitacoes', origem: { pagina: '/licitacoes' }, criadoEm: dia(hoje, -9, 11, 0), etapa: 'proposta', responsavelId: 'u-ds', valorEstimado: 4200, proximoContato: diaUtil(hoje, 1, 11, 0), notas: 'Proposta Jurídico 360 — Licitações enviada; decide com o sócio.' },
    { id: 'l-7', protocolo: 'LD-0000-0088', nome: 'Eduardo Fictício', empresa: 'Metalúrgica Demo', email: 'eduardo@metaldemo.com.br', telefone: '(47) 90000-7777', interesse: 'tributario', origem: { pagina: '/tributario/reforma' }, criadoEm: dia(hoje, -12, 16, 45), etapa: 'proposta', responsavelId: 'u-rm', valorEstimado: 32000 },
    { id: 'l-8', protocolo: 'LD-0000-0081', nome: 'Simone Ilustrativa', empresa: 'Hotel Exemplo', email: 'simone@hotelexemplo.com.br', telefone: '(67) 90000-8888', interesse: 'tributario', origem: { pagina: '/diagnostico', utm_source: 'instagram' }, criadoEm: dia(hoje, -20, 10, 10), etapa: 'fechado', responsavelId: 'u-ds', valorEstimado: 3600 },
    { id: 'l-9', protocolo: 'LD-0000-0077', nome: 'André Modelo', empresa: 'Gráfica Amostra', email: 'andre@graficaamostra.com.br', telefone: '(67) 90000-9999', interesse: 'licitacoes', origem: { pagina: '/licitacoes' }, criadoEm: dia(hoje, -26, 15, 0), etapa: 'fechado', responsavelId: 'u-me', valorEstimado: 2500 },
    { id: 'l-10', protocolo: 'LD-0000-0070', nome: 'Luana Demo', empresa: 'Comércio Hipotético', email: 'luana@comhipotetico.com.br', telefone: '(41) 90000-1212', interesse: 'outro', origem: { pagina: '/contato' }, criadoEm: dia(hoje, -31, 9, 0), etapa: 'perdido', responsavelId: 'u-rm', notas: 'Optou por resolver internamente.' },
    { id: 'l-11', protocolo: 'LD-0000-0104', nome: 'Henrique Exemplo', empresa: 'Transportadora Modelo', email: 'henrique@transpmodelo.com.br', telefone: '(67) 90000-1313', interesse: 'licitacoes', origem: { pagina: '/', utm_source: 'google' }, criadoEm: dia(hoje, 0, 7, 15), etapa: 'novo' },
  ];

  /* regras de alerta */
  const regras: RegraAlerta[] = [
    { id: 'r-1', gatilho: 'Prazo em D-3', condicao: 'Faltam 3 dias úteis para um prazo aberto', canal: 'WhatsApp', destino: 'Responsável pelo processo', ativo: true, disparos7d: 9 },
    { id: 'r-2', gatilho: 'Prazo vence hoje', condicao: 'Prazo aberto com vencimento no dia, às 8h', canal: 'WhatsApp', destino: 'Responsável + sócio', ativo: true, disparos7d: 4 },
    { id: 'r-3', gatilho: 'Nova publicação no DJEN', condicao: 'Publicação encontrada para processo da carteira', canal: 'WhatsApp', destino: 'Responsável pelo processo', ativo: true, disparos7d: 17 },
    { id: 'r-4', gatilho: 'Lead novo no site', condicao: 'Formulário de contato ou diagnóstico enviado', canal: 'WhatsApp', destino: 'Comercial (sócio)', ativo: true, disparos7d: 6 },
    { id: 'r-5', gatilho: 'Andamento relevante', condicao: 'Sentença, liminar ou acórdão em processo do cliente', canal: 'E-mail', destino: 'Cliente (texto revisado pela equipe)', ativo: false, disparos7d: 0 },
    { id: 'r-6', gatilho: 'Varredura falhou', condicao: 'Agente sem resposta do tribunal por mais de 2 horas', canal: 'WhatsApp', destino: 'Sócio', ativo: true, disparos7d: 1 },
  ];

  /* notificações (sino) */
  const nomeCli = (id: string) => clientes.find((c) => c.id === id)?.nome ?? '';
  const notificacoes: Notificacao[] = [
    { id: 'n-1', tipo: 'publicacao', ator: 'DJEN', frase: ['publicou ', { destaque: 'intimação' }, ' no processo de ', { destaque: nomeCli(ms.clienteId) }], quando: dia(hoje, 0, 8, 12), contexto: ms.cnj, lida: false, href: '/sistema/demo/publicacoes' },
    { id: 'n-2', tipo: 'prazo', ator: 'Prazo', frase: [{ destaque: 'Réplica à contestação' }, ' vence ', { destaque: 'hoje às 23:59' }], quando: dia(hoje, 0, 8, 0), contexto: processos[3].cnj, lida: false, href: '/sistema/demo/prazos' },
    { id: 'n-3', tipo: 'publicacao', ator: 'DJEN', frase: ['publicou ', { destaque: 'sentença' }, ' (segurança concedida em parte)'], quando: dia(hoje, 0, 6, 40), contexto: processos[5].cnj, lida: false, href: '/sistema/demo/publicacoes' },
    { id: 'n-4', tipo: 'lead', ator: 'Site', frase: ['novo lead: ', { destaque: 'Carlos Fictício' }, ' (Padaria Exemplo), interesse tributário'], quando: dia(hoje, 0, 8, 47), contexto: 'Formulário /tributario', lida: false, href: '/sistema/demo/comercial' },
    { id: 'n-5', tipo: 'whatsapp', ator: 'Iris', frase: ['enviou aviso de ', { destaque: 'prazo D-3' }, ' para ', { destaque: 'Marina Exemplo' }], quando: dia(hoje, 0, 8, 1), contexto: 'WhatsApp · entregue', lida: true },
    { id: 'n-6', tipo: 'whatsapp', ator: 'Lúcia Exemplo', frase: ['respondeu: ', { destaque: '“Recebido, obrigado! Envio o balanço amanhã.”' }], quando: dia(hoje, -1, 18, 22), contexto: 'WhatsApp · Empresa Exemplo', lida: true },
    { id: 'n-7', tipo: 'sistema', ator: 'Agente PJe', frase: ['concluiu a varredura: ', { destaque: '3 andamentos novos' }], quando: dia(hoje, 0, 7, 30), contexto: 'VPS · consulta PJe', lida: true },
    { id: 'n-8', tipo: 'prazo', ator: 'Prazo', frase: [{ destaque: 'Audiência de instrução' }, ' em 2 dias úteis'], quando: dia(hoje, -1, 8, 0), contexto: processos[8].cnj, lida: true, href: '/sistema/demo/prazos' },
  ];

  /* agentes na VPS */
  const agentes: Agente[] = [
    { id: 'ag-esaj', nome: 'Consulta e-SAJ', alvo: 'TJMS · TJSP', status: 'ok', ultimaVarreduraMin: 12, intervaloMin: 60, monitorados: processos.filter((p) => p.sistema === 'e-SAJ').length },
    { id: 'ag-eproc', nome: 'Consulta eproc', alvo: 'TRF4 · TJSC', status: 'ok', ultimaVarreduraMin: 27, intervaloMin: 60, monitorados: processos.filter((p) => p.sistema === 'eproc').length },
    { id: 'ag-pje', nome: 'Consulta PJe', alvo: 'TRF3 · TRT24', status: 'atencao', ultimaVarreduraMin: 74, intervaloMin: 60, monitorados: processos.filter((p) => p.sistema === 'PJe').length, nota: 'TRF3 lento; nova tentativa em 5 min' },
    { id: 'ag-djen', nome: 'Leitura do DJEN', alvo: 'Diário de Justiça Eletrônico Nacional', status: 'ok', ultimaVarreduraMin: 4, intervaloMin: 30, monitorados: processos.length },
    { id: 'ag-wpp', nome: 'Avisos no WhatsApp', alvo: 'Iris (Evolution)', status: 'ok', ultimaVarreduraMin: 1, intervaloMin: 5, monitorados: regras.filter((r) => r.ativo && r.canal === 'WhatsApp').length },
  ];

  /* faturas */
  const faturas: Fatura[] = [];
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  clientes.filter((c) => c.honorariosMensais).forEach((c, ci) => {
    for (let m = 3; m >= 0; m--) {
      const venc = dia(hoje, -m * 30 + 5 + ci);
      const comp = new Date(venc);
      comp.setMonth(comp.getMonth() - 1);
      const status: Fatura['status'] = m >= 2 ? 'paga' : m === 1 ? (ci % 3 === 0 ? 'vencida' : 'paga') : 'aberta';
      faturas.push({ id: `f-${c.id}-${m}`, clienteId: c.id, descricao: `Honorários mensais — ${c.plano ?? 'assessoria'}`, competencia: `${meses[comp.getMonth()]}/${comp.getFullYear()}`, valor: c.honorariosMensais!, vencimento: venc, status });
    }
  });
  faturas.push({ id: 'f-exito-1', clienteId: 'c-exemplo', descricao: 'Honorários de êxito — liminar no Pregão 41/2026 (parcela 1/2)', competencia: `${meses[hoje.getMonth()]}/${hoje.getFullYear()}`, valor: 3800, vencimento: dia(hoje, 12), status: 'aberta' });

  /* portal: Empresa Exemplo */
  const documentos: DocumentoPortal[] = [
    { id: 'd-1', nome: 'Balanço patrimonial 2025', descricao: 'Para o cálculo dos créditos de PIS/COFINS.', status: 'pendente', prazo: diaUtil(hoje, 2), processoId: recTrib.id },
    { id: 'd-2', nome: 'Comprovantes das medições 7, 8 e 9', descricao: 'Notas fiscais e atestados de execução do contrato 12/2025.', status: 'pendente', prazo: diaUtil(hoje, 5), processoId: exec.id },
    { id: 'd-3', nome: 'Atestado de capacidade técnica', descricao: 'Usado na resposta sobre as informações do Município.', status: 'enviado', processoId: ms.id, enviadoEm: dia(hoje, -2, 15, 10) },
    { id: 'd-4', nome: 'Procuração assinada', descricao: 'Poderes para o mandado de segurança.', status: 'aprovado', processoId: ms.id, enviadoEm: dia(hoje, -50, 11, 0) },
    { id: 'd-5', nome: 'Contrato social consolidado', descricao: 'Cadastro do cliente.', status: 'aprovado', enviadoEm: dia(hoje, -400, 9, 0) },
  ];
  const mensagens: MensagemPortal[] = [
    { id: 'm-1', de: 'escritorio', autor: 'Douglas Senturião', texto: 'Bom dia, Lúcia! O Município apresentou as informações no mandado de segurança. Já estamos preparando a resposta; nada muda na liminar, que continua valendo.', quando: dia(hoje, 0, 9, 5) },
    { id: 'm-2', de: 'cliente', autor: 'Lúcia Exemplo', texto: 'Ótimo, obrigada. Precisam de mais algum documento nosso?', quando: dia(hoje, 0, 9, 31) },
    { id: 'm-3', de: 'escritorio', autor: 'Rafael Modelo', texto: 'Só o balanço de 2025 para fecharmos o cálculo da restituição. Pode enviar pela área de documentos.', quando: dia(hoje, 0, 9, 44) },
  ];

  return {
    hoje,
    usuarios: USUARIOS,
    eu: USUARIOS[0],
    clientes,
    processos,
    prazos,
    publicacoes,
    leads,
    regras,
    notificacoes,
    agentes,
    faturas,
    portal: {
      clienteId: 'c-exemplo',
      documentos,
      mensagens,
      contrato: { numero: 'CT-0000/2025 (fictício)', objeto: 'Assessoria jurídica contínua — Jurídico 360 Empresarial (licitações e tributário)', inicio: dia(hoje, -420), renovacao: dia(hoje, 310), honorariosMensais: 4800, exito: '10% sobre o proveito econômico em ações tributárias; parcela fixa por liminar em licitações' },
    },
  };
}

/* ------------------------------------------------------------- consultas -- */

export const usuarioPorId = (d: DadosDemo, id?: string) => d.usuarios.find((u) => u.id === id);
export const clientePorId = (d: DadosDemo, id?: string) => d.clientes.find((c) => c.id === id);
export const processoPorId = (d: DadosDemo, id?: string) => d.processos.find((p) => p.id === id);
export const ultimoAndamento = (p: Processo) => p.andamentos[0];
export const proximoPrazo = (d: DadosDemo, processoId: string) =>
  d.prazos.find((z) => z.processoId === processoId && !z.cumprido && z.data.getTime() >= d.hoje.getTime());
