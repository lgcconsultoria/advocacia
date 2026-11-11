import Markdoc, { type Node } from '@markdoc/markdoc';
import { getAreas, getPosts, getSettings } from '@/lib/reader';
import { getModelos } from '@/lib/modelos';
import { PAGINA_PRINCIPAL } from '@/lib/areas';
import { SITE } from '@/lib/seo';
import { DORES, ESCOPO_LEI } from '@/lib/licitacoes/dores';
import * as MS from '@/app/(site)/licitacoes/mandado-de-seguranca/conteudo';

/**
 * Texto de /llms.txt (índice) e /llms-full.txt (conteúdo integral), no formato
 * de llmstxt.org. Tudo sai do conteúdo que já está no site (Keystatic, dores.ts,
 * conteudo.ts do mandado de segurança): nenhum dado novo é escrito aqui, só
 * montado. O domínio vem de SITE (lib/seo.ts), o mesmo do sitemap.
 */

const AVISO =
  'Conteúdo informativo, em conformidade com o Código de Ética e Disciplina da OAB. Não substitui a análise de um caso concreto nem constitui aconselhamento jurídico individualizado.';

type FaqItem = { question: string; answer: string };
type Link = { titulo: string; caminho: string; descricao: string };

/** Descrições das páginas institucionais: as mesmas meta descriptions das páginas. */
const INSTITUCIONAIS: Link[] = [
  {
    titulo: 'Início',
    caminho: '/',
    descricao:
      'Direito Tributário e Público para empresas: Reforma Tributária (IBS/CBS, LC 214/2025), licitações e contratos públicos. Atuação em todo o Brasil.',
  },
  {
    titulo: 'Sobre o escritório',
    caminho: '/sobre',
    descricao:
      'Escritório-boutique com raiz no Direito Administrativo, em São Paulo, e atuação também no contencioso cível e empresarial.',
  },
  {
    titulo: 'Departamento de Licitações e Contratos Públicos',
    caminho: '/licitacoes',
    descricao:
      'Análise de edital e matriz de riscos, habilitação, impugnações, suporte na sessão, recursos, mandado de segurança, contratos, reequilíbrio (inclusive IBS/CBS) e defesa em sanções, sob a Lei 14.133/2021.',
  },
  {
    titulo: 'Assessoria tributária para empresas',
    caminho: '/tributario',
    descricao:
      'Reforma Tributária (IBS e CBS), Simples puro ou híbrido, split payment, cláusulas de preço e reequilíbrio nos contratos e defesa em autuações; simulador ilustrativo de 2027 a 2033.',
  },
  {
    titulo: 'Áreas de atuação',
    caminho: '/areas',
    descricao: 'Frentes de direito público e de contencioso cível e empresarial, cada uma com regime jurídico e prazos próprios.',
  },
  {
    titulo: 'Contato',
    caminho: '/contato',
    descricao: 'Endereço, e-mail, telefone e horário. Atendimento por agendamento em São Paulo/SP.',
  },
];

const url = (caminho: string) => `${SITE}${caminho}`;

/** Uma linha só: tira quebras e espaços repetidos. */
const linha = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const item = (l: Link) => `- [${linha(l.titulo).replace(/\.$/, '')}](${url(l.caminho)}): ${linha(l.descricao)}`;

function faqTexto(faq: readonly FaqItem[]): string {
  return faq.map((f) => `#### ${linha(f.question)}\n\n${f.answer.trim()}`).join('\n\n');
}

/** Markdown do corpo; `descer` aumenta o nível dos títulos para caberem sob o título do item. */
function nodeParaMarkdown(node: Node, descer = 2): string {
  const walk = (n: Node) => {
    if (n.type === 'heading' && typeof n.attributes.level === 'number') {
      n.attributes.level = Math.min(6, n.attributes.level + descer);
    }
    for (const c of n.children ?? []) walk(c);
  };
  walk(node);
  return Markdoc.format(node).trim();
}

function formatarData(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

async function coletar() {
  const [settings, areas, posts, modelos] = await Promise.all([getSettings(), getAreas(), getPosts(), getModelos()]);
  const areasVisiveis = areas.filter((a) => !PAGINA_PRINCIPAL[a.slug]);

  const dores: Link[] = [
    ...DORES.map((d) => ({ titulo: d.h1, caminho: `/licitacoes/${d.slug}`, descricao: d.descricao })),
    { titulo: MS.HERO.titulo, caminho: MS.CAMINHO, descricao: MS.META.descricao },
  ];
  const linksAreas: Link[] = areasVisiveis.map((a) => ({
    titulo: a.heroTitle || a.title,
    caminho: `/areas/${a.slug}`,
    descricao: a.metaDescription || a.summary,
  }));
  const linksPosts: Link[] = posts.map((p) => ({
    titulo: p.title,
    caminho: `/blog/${p.slug}`,
    descricao: p.description,
  }));
  const linksModelos: Link[] = modelos.map((m) => ({
    titulo: m.titulo,
    caminho: `/modelos/${m.slug}`,
    descricao: m.metaDescription || m.chamada,
  }));
  return { settings, areasVisiveis, posts, dores, linksAreas, linksPosts, linksModelos };
}

function cabecalho(settings: { firmName: string; lawyerName: string; oab: string; address: string; email: string }) {
  return [
    `# ${settings.firmName}`,
    '',
    `> Escritório de advocacia com sede em São Paulo/SP e atuação em todo o Brasil, em Direito Tributário e Público para empresas: Reforma Tributária (IBS/CBS, LC 214/2025), licitações e contratos públicos, direito administrativo e contencioso cível e empresarial. Advogado responsável: ${settings.lawyerName}, ${settings.oab}.`,
    '',
    `O site é informativo. Os textos explicam prazos, leis e procedimentos e não prometem resultado nem substituem a análise de um caso concreto. Endereço: ${linha(settings.address)}. E-mail: ${settings.email}.`,
    '',
  ];
}

/** /llms.txt: índice curto, com URL absoluta e descrição de uma linha. */
export async function textoLlms(): Promise<string> {
  const { settings, dores, linksAreas, linksPosts, linksModelos } = await coletar();
  const out = [
    ...cabecalho(settings),
    '## O escritório e as frentes principais',
    '',
    ...INSTITUCIONAIS.map(item),
    '',
    '## Situações em licitação (prazos e primeiros passos)',
    '',
    ...dores.map(item),
    '',
    '## Áreas de atuação',
    '',
    ...linksAreas.map(item),
    '',
    '## Artigos',
    '',
    ...linksPosts.map(item),
    '',
  ];
  if (linksModelos.length) {
    out.push('## Modelos e materiais gratuitos', '', ...linksModelos.map(item), '');
  }
  out.push(
    '## Opcional',
    '',
    `- [Conteúdo integral em texto](${SITE}/llms-full.txt): as páginas de situação, as áreas e os artigos acima, com o texto completo.`,
    `- [Mapa do site](${SITE}/sitemap.xml)`,
    `- [Aviso de publicidade](${SITE}/aviso-publicidade): enquadramento ético (Provimento 205/2021 da OAB).`,
    ''
  );
  return out.join('\n');
}

/** /llms-full.txt: o texto das páginas de situação, das áreas e dos artigos. */
export async function textoLlmsFull(): Promise<string> {
  const { settings, areasVisiveis, posts } = await coletar();
  const partes: string[] = [...cabecalho(settings), AVISO, ''];

  partes.push('# Situações em licitação', '');
  for (const d of DORES) {
    partes.push(
      `## ${d.h1}`,
      '',
      `URL: ${url(`/licitacoes/${d.slug}`)}`,
      '',
      d.lead,
      '',
      `**${d.prazo.titulo}** ${d.prazo.texto}`,
      '',
      ESCOPO_LEI,
      '',
      `### ${d.passosTitulo}`,
      '',
      ...d.passos.map((p) => `- **${p.titulo}.** ${p.texto}`),
      ''
    );
    for (const b of d.blocos) {
      partes.push(`### ${b.titulo}`, '', ...b.itens.map((t) => `- ${t}`), '');
    }
    partes.push(`### Uma ressalva`, '', d.ressalva, '', '### Perguntas frequentes', '', faqTexto(d.faq), '');
  }

  partes.push(
    `## ${MS.HERO.titulo}`,
    '',
    `URL: ${url(MS.CAMINHO)}`,
    '',
    MS.HERO.lead,
    '',
    '### O que fazer agora',
    '',
    ...MS.PASSOS.map((p) => `- **${p.titulo}.** ${p.texto}`),
    '',
    '### Quando pode caber',
    '',
    ...MS.CABE.map((t) => `- ${t}`),
    '',
    '### Quando não cabe',
    '',
    ...MS.NAO_CABE.map((t) => `- ${t}`),
    '',
    '### Uma ressalva',
    '',
    MS.RESSALVA,
    '',
    '### Perguntas frequentes',
    '',
    faqTexto(MS.FAQ),
    ''
  );

  partes.push('# Áreas de atuação', '');
  for (const a of areasVisiveis) {
    const intro = await a.intro();
    partes.push(
      `## ${a.heroTitle || a.title}`,
      '',
      `URL: ${url(`/areas/${a.slug}`)}`,
      '',
      a.lead ?? '',
      '',
      a.whenTitle ? `### ${a.whenTitle}` : '',
      '',
      nodeParaMarkdown(intro.node),
      ''
    );
    if (a.achieves.length) {
      partes.push(a.achievesTitle ? `### ${a.achievesTitle}` : '', '', ...a.achieves.map((t) => `- ${t}`), '');
    }
    if (a.notice.title || a.notice.body) {
      partes.push(`${a.notice.title ? `**${a.notice.title}** ` : ''}${a.notice.body}`.trim(), '');
    }
    if (a.faq.length) partes.push('### Perguntas frequentes', '', faqTexto(a.faq), '');
  }

  partes.push('# Artigos', '');
  for (const p of posts) {
    const corpo = await p.content();
    const datas = [
      p.publishedDate ? `Publicado em ${formatarData(p.publishedDate)}` : '',
      p.updatedDate ? `revisado em ${formatarData(p.updatedDate)}` : '',
    ]
      .filter(Boolean)
      .join('; ');
    partes.push(
      `## ${p.title}`,
      '',
      `URL: ${url(`/blog/${p.slug}`)}`,
      '',
      `Autor: ${settings.lawyerName}, ${settings.oab}. ${datas}.`,
      '',
      nodeParaMarkdown(corpo.node),
      ''
    );
  }

  return partes.filter((s, i, arr) => !(s === '' && arr[i - 1] === '')).join('\n');
}
