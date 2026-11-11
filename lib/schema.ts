import { SITE } from '@/lib/seo';

/**
 * Dados estruturados (schema.org) do escritório e do advogado, usados na home,
 * em /sobre e como autor dos artigos. Os `@id` ligam os nós entre páginas.
 */

export const ID_ESCRITORIO = `${SITE}/#escritorio`;
export const ID_PESSOA = `${SITE}/sobre#douglas-senturiao`;
export const ID_SITE = `${SITE}/#website`;

/** Perfis oficiais (os mesmos no escritório e na pessoa). */
export const PERFIS = [
  'https://www.instagram.com/douglassenturiao/',
  'https://www.instagram.com/douglassadvogado/',
  'https://www.linkedin.com/in/douglasaleff/',
];

/** Foco do escritório (home e pessoa). As páginas de área seguem com o seu próprio tema. */
export const TEMAS = [
  'Direito Tributário',
  'Reforma Tributária (IBS e CBS, LC 214/2025)',
  'Simples Nacional',
  'Licitações públicas (Lei 14.133/2021)',
  'Contratos administrativos',
  'Direito Público',
  'Direito Administrativo',
  'Mandado de segurança',
];

type Settings = { lawyerName: string; firmName: string; oab: string };
type SettingsContato = Settings & { whatsapp: string; email: string };

export function pessoaLd(settings: Settings, contexto = true) {
  return {
    ...(contexto ? { '@context': 'https://schema.org' } : {}),
    '@type': 'Person',
    '@id': ID_PESSOA,
    name: settings.lawyerName,
    jobTitle: 'Advogado',
    url: `${SITE}/sobre`,
    image: `${SITE}/assets/img/douglas-estudio.jpg`,
    worksFor: { '@id': ID_ESCRITORIO },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Inscrição na Ordem dos Advogados do Brasil',
      name: settings.oab,
      recognizedBy: { '@type': 'Organization', name: 'Ordem dos Advogados do Brasil' },
    },
    knowsAbout: TEMAS,
    sameAs: PERFIS,
  };
}

/** Referência curta ao escritório como publicador (com logo). */
export function publicadorLd(settings: Settings) {
  return {
    '@type': 'Organization',
    '@id': ID_ESCRITORIO,
    name: settings.firmName,
    url: `${SITE}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/assets/img/logo-horizontal.png`,
    },
  };
}

/**
 * Escritório (LegalService + Attorney): nó global, emitido em todas as páginas
 * públicas pelo layout do site. Sem `priceRange` de propósito (Provimento
 * 205/2021 da OAB: nada que sugira preço ou oferta).
 */
export function escritorioLd(settings: SettingsContato) {
  const telefone = `+55${settings.whatsapp.replace(/^55/, '').replace(/\D/g, '')}`;
  return {
    '@type': ['LegalService', 'Attorney'],
    '@id': ID_ESCRITORIO,
    name: settings.firmName,
    alternateName: 'Douglas Senturião — Direito Tributário e Público para empresas',
    description:
      'Escritório de advocacia para empresas em Direito Tributário (Reforma Tributária: IBS e CBS, LC 214/2025), licitações e contratos públicos e direito público. Sede em São Paulo e atuação em todo o Brasil.',
    url: `${SITE}/`,
    image: `${SITE}/assets/img/og-image.png`,
    logo: `${SITE}/assets/img/logo-horizontal.png`,
    telephone: telefone,
    email: settings.email,
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Brigadeiro Faria Lima, 1768',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '01451-001',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Atendimento',
      telephone: telefone,
      email: settings.email,
      availableLanguage: 'Portuguese',
    },
    founder: { '@id': ID_PESSOA },
    knowsAbout: TEMAS,
    sameAs: PERFIS,
  };
}

/** Site (WebSite), ligado ao escritório como publicador. */
export function siteLd(settings: Settings) {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: `${SITE}/`,
    name: settings.firmName,
    inLanguage: 'pt-BR',
    publisher: { '@id': ID_ESCRITORIO },
  };
}

/** Grafo global (WebSite + escritório), emitido uma vez por página pelo layout. */
export function grafoGlobalLd(settings: SettingsContato) {
  return {
    '@context': 'https://schema.org',
    '@graph': [siteLd(settings), escritorioLd(settings)],
  };
}

/** Trilha (BreadcrumbList) a partir de pares nome/caminho; o caminho '/x' vira URL absoluta. */
export function trilhaLd(itens: { nome: string; caminho: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: `${SITE}${it.caminho}`,
    })),
  };
}

/** Lista de páginas (CollectionPage + ItemList) para índices como /areas e /blog. */
export function colecaoLd({
  caminho,
  nome,
  descricao,
  itens,
}: {
  caminho: string;
  nome: string;
  descricao: string;
  itens: { nome: string; caminho: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE}${caminho}#pagina`,
    url: `${SITE}${caminho}`,
    name: nome,
    description: descricao,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': ID_SITE },
    publisher: { '@id': ID_ESCRITORIO },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: itens.length,
      itemListElement: itens.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.nome,
        url: `${SITE}${it.caminho}`,
      })),
    },
  };
}

/**
 * Página de conteúdo jurídico (WebPage) com o advogado responsável. `revisadoEm`
 * só entra quando existe data real de validação do texto.
 */
export function paginaLd({
  caminho,
  nome,
  descricao,
  revisadoEm,
}: {
  caminho: string;
  nome: string;
  descricao: string;
  revisadoEm?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE}${caminho}#pagina`,
    url: `${SITE}${caminho}`,
    name: nome,
    description: descricao,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': ID_SITE },
    author: { '@id': ID_PESSOA },
    publisher: { '@id': ID_ESCRITORIO },
    ...(revisadoEm ? { dateModified: revisadoEm, lastReviewed: revisadoEm } : {}),
  };
}
