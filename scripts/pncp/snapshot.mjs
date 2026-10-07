#!/usr/bin/env node
// Gera o retrato do PNCP em lib/pncp/snapshot/{termometro,uf,serie}.json,
// usando exatamente o código das rotas (lib/pncp/agregados.ts).
// Sem dependências: Node ≥ 22.18 (remove tipos do TypeScript sozinho).
//
//   node scripts/pncp/snapshot.mjs              # tudo
//   node scripts/pncp/snapshot.mjs termometro   # só uma parte (termometro | uf | serie)
//   node scripts/pncp/snapshot.mjs serie --completa   # reconsulta os 365 dias
//
// Uma parte que falhar mantém o arquivo anterior (nunca grava retrato pior).
// Tempo medido em 07/10/2026: termômetro ~15 s, UF ~60 s, série completa ~15 s.

import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { carregar, RAIZ } from './carregador.mjs';

const PASTA = path.join(RAIZ, 'lib/pncp/snapshot');
const args = process.argv.slice(2);
const partes = args.filter((a) => !a.startsWith('--'));
const quer = (p) => partes.length === 0 || partes.includes(p);
const completa = args.includes('--completa');

const { termometro, porUf, serieDiaria } = await carregar('lib/pncp/agregados.ts');
const { definirConcorrencia } = await carregar('lib/pncp/cliente.ts');
definirConcorrencia(6);

function ler(nome) {
  const arq = path.join(PASTA, `${nome}.json`);
  if (!existsSync(arq)) return undefined;
  try {
    return JSON.parse(readFileSync(arq, 'utf8'));
  } catch {
    return undefined;
  }
}

function gravar(nome, dados) {
  const arq = path.join(PASTA, `${nome}.json`);
  writeFileSync(arq + '.tmp', JSON.stringify(dados, null, 1) + '\n');
  renameSync(arq + '.tmp', arq);
  console.log(`✓ ${path.relative(RAIZ, arq)} (${(JSON.stringify(dados).length / 1024).toFixed(1)} KB)`);
}

async function parte(nome, gerar) {
  if (!quer(nome)) return;
  const t0 = Date.now();
  try {
    const dados = await gerar(ler(nome));
    if (dados.fonte !== 'pncp-ao-vivo') {
      console.warn(`! ${nome}: partes vieram da reserva:`, dados.avisos);
    }
    gravar(nome, dados);
    console.log(`  ${nome} em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  } catch (erro) {
    process.exitCode = 1;
    console.error(`✗ ${nome}: ${erro?.message ?? erro} — arquivo anterior mantido.`);
  }
}

await parte('termometro', (reserva) => termometro({ reserva }));
await parte('serie', (reserva) =>
  serieDiaria({ dias: 365, reserva: completa ? undefined : reserva, reconsultarUltimosDias: 7 }),
);
await parte('uf', (reserva) => porUf({ reserva }));
