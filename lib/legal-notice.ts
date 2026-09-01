/**
 * Fonte única para texto de conformidade regulatória exigido em toda
 * página pública do site (Provimento CFOAB nº 205/2021) e para a
 * identidade mínima do escritório usada fora do fluxo normal de dados
 * (Server Components com getSettings()).
 *
 * Este módulo não importa `lib/reader.ts` nem usa `'use server'`: é só
 * texto estático, por isso pode ser importado tanto por Server
 * Components quanto por Client Components (ex.: app/error.tsx, que é
 * obrigatoriamente client e não pode `await` o keystatic reader).
 *
 * O parágrafo abaixo é copiado literalmente de components/site-footer.tsx
 * (que antes o continha embutido) — qualquer alteração de redação deve
 * ser feita aqui, uma única vez, para valer em todos os lugares que o
 * consomem.
 */

export const OAB_NOTICE =
  'Conteúdo institucional de caráter informativo, em conformidade com o ' +
  'Código de Ética e Disciplina da OAB, o Estatuto da Advocacia (Lei ' +
  '8.906/94) e o Provimento CFOAB nº 205/2021. Não constitui oferta de ' +
  'serviços nem aconselhamento jurídico individualizado.';

// Mesmos valores usados como fallback em getSettings() (lib/reader.ts).
// Duplicados aqui apenas porque lib/reader.ts não pode ser importado por
// Client Components (usa o keystatic reader, que depende do filesystem).
export const FIRM_NAME = 'Douglas Senturião Advocacia';
export const LAWYER_NAME = 'Douglas Senturião';
export const OAB = 'OAB/SC nº 73.764';
