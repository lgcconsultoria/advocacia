/**
 * Apoio visual das áreas (não é conteúdo): o nome curto usado no anel e no
 * mostrador da home. O conteúdo de cada área continua no Keystatic
 * (content/areas). Área nova sem entrada aqui usa a primeira palavra do título.
 */
const CURTO: Record<string, string> = {
  'mandado-de-seguranca': 'Mandado',
  licitacoes: 'Licitações',
  'contratos-publicos': 'Contratos',
  concursos: 'Concursos',
  servidores: 'Servidores',
  'defesa-agentes': 'Agentes',
  'habeas-data': 'Habeas Data',
  execucoes: 'Execuções',
  familia: 'Família',
  'violencia-domestica': 'Proteção',
  'dividas-e-obrigacoes': 'Dívidas',
  empresarial: 'Empresarial',
  'crimes-licitatorios': 'Penal',
  tributario: 'Tributário',
};

export function nomeCurto(slug: string, title: string): string {
  return CURTO[slug] ?? title.split(' ')[0];
}

/** As oito frentes que giram no anel do topo da home, nesta ordem. */
export const DESTAQUE_ANEL = [
  'licitacoes',
  'contratos-publicos',
  'mandado-de-seguranca',
  'servidores',
  'concursos',
  'defesa-agentes',
  'empresarial',
  'tributario',
];
