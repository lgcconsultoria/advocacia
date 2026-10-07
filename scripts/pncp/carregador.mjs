// Permite que scripts Node puros (sem dependências) importem os módulos
// TypeScript de lib/pncp e app/api/pncp, os mesmos que o Next usa.
//
// O Node 24 já remove tipos de arquivos .ts sozinho; faltam três coisas que
// o Next resolve e o Node não:
//   1. imports relativos sem extensão ('./cliente' → './cliente.ts');
//   2. o apelido '@/' do tsconfig (→ raiz do projeto);
//   3. importar .json sem `with { type: 'json' }`.
// Uso: import { carregar } from './carregador.mjs'; const m = await carregar('lib/pncp/agregados.ts');

import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const ganchos = `
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const RAIZ = ${JSON.stringify(RAIZ)};
export async function resolve(especificador, contexto, proximo) {
  let alvo = especificador;
  if (alvo.startsWith('@/')) alvo = pathToFileURL(RAIZ + '/' + alvo.slice(2)).href;
  const relativo = alvo.startsWith('./') || alvo.startsWith('../') || alvo.startsWith('file:');
  if (relativo && !/\\.(ts|tsx|mjs|js|json)$/.test(alvo)) {
    const base = new URL(alvo, contexto.parentURL);
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      const tentativa = new URL(base.href + ext);
      if (existsSync(fileURLToPath(tentativa))) return proximo(tentativa.href, contexto);
    }
  }
  return proximo(alvo, contexto);
}
export async function load(url, contexto, proximo) {
  if (url.endsWith('.json') && url.startsWith('file:')) {
    const { readFileSync } = await import('node:fs');
    const texto = readFileSync(fileURLToPath(url), 'utf8');
    return { format: 'module', source: 'export default ' + texto + ';', shortCircuit: true };
  }
  if (url.endsWith('.ts') && url.startsWith('file:')) {
    return proximo(url, { ...contexto, format: 'module-typescript' });
  }
  return proximo(url, contexto);
}
`;

register('data:text/javascript,' + encodeURIComponent(ganchos), import.meta.url);

/** Importa um módulo do projeto pelo caminho relativo à raiz. */
export function carregar(relativo) {
  return import(pathToFileURL(path.join(RAIZ, relativo)).href);
}
