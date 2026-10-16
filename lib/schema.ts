import { SITE } from '@/lib/seo';

/**
 * Dados estruturados (schema.org) do escritório e do advogado, usados na home,
 * em /sobre e como autor dos artigos. Os `@id` ligam os nós entre páginas.
 */

export const ID_ESCRITORIO = `${SITE}/#escritorio`;
export const ID_PESSOA = `${SITE}/sobre#douglas-senturiao`;

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
