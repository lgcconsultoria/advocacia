#!/usr/bin/env node
/**
 * Cifra uma página HTML para a área reservada de clientes (/clientes/<código>).
 *
 * O repositório é público: só o texto cifrado entra nele. A página é decifrada no
 * navegador de quem digita a senha (PBKDF2-SHA-256 + AES-GCM, via Web Crypto).
 *
 * Uso:
 *   CIFRA_SENHA='...' node scripts/cifrar-pagina.mjs <pagina.html> <codigo>
 *
 * Gera content/clientes/<codigo>.json. Registre o código em lib/clientes.ts.
 * A senha nunca é gravada; guarde-a fora do repositório.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const ITERACOES = 600_000;
const [arquivo, codigo] = process.argv.slice(2);
const senha = process.env.CIFRA_SENHA;

if (!arquivo || !codigo || !/^[a-z0-9-]{8,64}$/.test(codigo)) {
  console.error('uso: CIFRA_SENHA=... node scripts/cifrar-pagina.mjs <pagina.html> <codigo: 8-64 de a-z, 0-9, ->');
  process.exit(1);
}
if (!senha || senha.length < 16) {
  console.error('CIFRA_SENHA ausente ou curta: use 16 caracteres ou mais (o texto cifrado fica público).');
  process.exit(1);
}

const b64 = (buf) => Buffer.from(buf).toString('base64');
const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveKey']);
const chave = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt: sal, iterations: ITERACOES, hash: 'SHA-256' },
  base,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const html = readFileSync(arquivo);
const cifra = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, chave, html);

mkdirSync('content/clientes', { recursive: true });
const destino = `content/clientes/${codigo}.json`;
writeFileSync(destino, JSON.stringify({ v: 1, iteracoes: ITERACOES, sal: b64(sal), iv: b64(iv), dados: b64(cifra) }) + '\n');
console.log(`${destino}: ${html.length} bytes de HTML cifrados`);
