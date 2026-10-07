import Link from 'next/link';

export type LinkFrente = { href: string; label: string };

export type Frente = {
  titulo: string;
  texto: string;
  base: string;
  /** slugs de áreas (/areas/<slug>) e posts (/blog/<slug>) relacionados */
  areas?: string[];
  posts?: string[];
};

/** O que o departamento faz, com base legal e links para áreas e artigos que existem no CMS. */
export const FRENTES: Frente[] = [
  {
    titulo: 'Análise jurídica do edital e matriz de riscos',
    texto:
      'Leitura do edital, do termo de referência e da minuta de contrato antes da decisão de participar: exigências de habilitação, critérios de julgamento, garantias, penalidades e cláusulas sensíveis, com recomendação por escrito (participar, impugnar ou não participar).',
    base: 'Lei 14.133/2021, arts. 18, 25 e 92',
    areas: ['licitacoes'],
  },
  {
    titulo: 'Habilitação e gestão documental',
    texto:
      'Conferência jurídica de certidões, balanço, atestados e declarações contra o que o edital pede, controle de validade e orientação sobre o que pode ser complementado em diligência.',
    base: 'Lei 14.133/2021, arts. 62 a 70 e art. 64',
    areas: ['licitacoes'],
  },
  {
    titulo: 'Pedidos de esclarecimento e impugnações',
    texto:
      'Questionamento de exigências restritivas, ilegais ou ambíguas antes da sessão, dentro do prazo de até 3 dias úteis antes da abertura do certame.',
    base: 'Lei 14.133/2021, art. 164',
    areas: ['licitacoes'],
    posts: ['impugnacao-ao-edital-prazos-e-estrategia'],
  },
  {
    titulo: 'Suporte jurídico na sessão',
    texto:
      'Acompanhamento da disputa e do julgamento: respostas a diligências, demonstração da exequibilidade da proposta, defesa contra desclassificações e registro da intenção de recorrer no momento certo.',
    base: 'Lei 14.133/2021, arts. 59 e 64',
    areas: ['licitacoes'],
  },
  {
    titulo: 'Recursos e contrarrazões',
    texto:
      'Razões de recurso contra o julgamento, a habilitação ou a inabilitação, e contrarrazões quando o recurso é de um concorrente, no prazo de 3 dias úteis e com tese construída para o caso.',
    base: 'Lei 14.133/2021, arts. 165 a 168',
    areas: ['licitacoes'],
  },
  {
    titulo: 'Mandado de segurança e medidas judiciais',
    texto:
      'Quando a via administrativa não corrige a ilegalidade: mandado de segurança com pedido liminar para suspender o certame ou o ato, observado o prazo decadencial de 120 dias, e outras medidas cabíveis.',
    base: 'Lei 12.016/2009',
    areas: ['mandado-de-seguranca'],
    posts: ['mandado-de-seguranca-analise-de-cabimento'],
  },
  {
    titulo: 'Contratos administrativos',
    texto:
      'Execução do contrato: aditivos, reajuste, repactuação e reequilíbrio econômico-financeiro, inclusive o decorrente da Reforma Tributária (substituição de tributos pelo IBS e pela CBS), com pedido instruído por memória de cálculo.',
    base: 'Lei 14.133/2021, arts. 124 a 136 · LC 214/2025, arts. 374 a 376',
    areas: ['contratos-publicos'],
    posts: ['reequilibrio-economico-financeiro-14133'],
  },
  {
    titulo: 'Sanções e processos sancionadores',
    texto:
      'Defesa da empresa em processos de responsabilização (advertência, multa, impedimento de licitar e declaração de inidoneidade), recursos, pedidos de reconsideração e reabilitação.',
    base: 'Lei 14.133/2021, arts. 155 a 163 e 166 a 168',
    areas: ['contratos-publicos'],
  },
  {
    titulo: 'Integridade e crimes em licitações',
    texto:
      'Programa de integridade exigido nas contratações de grande vulto e defesa técnica em investigações e ações penais sobre fatos ligados a licitações e contratos.',
    base: 'Lei 14.133/2021, art. 25, § 4º · Código Penal, arts. 337-E a 337-P',
    areas: ['crimes-licitatorios'],
    posts: ['crimes-licitatorios-lei-14133', 'intimacao-investigacao-licitacao-primeiros-passos'],
  },
];

export function Frentes({
  areas,
  posts,
}: {
  areas: Record<string, string>;
  posts: Record<string, string>;
}) {
  return (
    <ol className="m-0 mt-14 grid list-none gap-x-8 gap-y-0 p-0 md:grid-cols-2 lg:grid-cols-3">
      {FRENTES.map((f, i) => {
        const links: LinkFrente[] = [
          ...(f.areas ?? []).filter((s) => areas[s]).map((s) => ({ href: `/areas/${s}`, label: `Área: ${areas[s]}` })),
          ...(f.posts ?? []).filter((s) => posts[s]).map((s) => ({ href: `/blog/${s}`, label: posts[s] })),
        ];
        return (
          <li key={f.titulo} className="flex min-w-0 flex-col border-t-2 border-grafite py-6">
            <span className="rotulo num text-[10.5px] text-marca">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="expandida m-0 mt-2 text-[1.12rem] font-[720] leading-[1.15] tracking-[-0.01em]">{f.titulo}</h3>
            <p className="m-0 mt-3 text-[0.95rem] leading-relaxed text-cinza">{f.texto}</p>
            <p className="rotulo m-0 mt-4 text-[9.5px] text-grafite/70">{f.base}</p>
            {links.length > 0 && (
              <ul className="m-0 mt-4 grid list-none gap-2 p-0">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-start gap-2 text-[0.9rem] font-[560] leading-snug text-marca no-underline hover:text-tinta">
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                      <span className="underline decoration-marca/30 underline-offset-[3px] group-hover:decoration-tinta">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
