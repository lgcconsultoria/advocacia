/**
 * Testes do robots.txt (app/robots.ts): política de bots de IA declarada.
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import robots from '../../app/robots.ts';

const regras = robots().rules as { userAgent: string; allow: string; disallow: string[] }[];
const porBot = new Map(regras.map((r) => [r.userAgent, r]));

test('bots de IA ficam declarados e permitidos', () => {
  for (const bot of [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
  ]) {
    assert.equal(porBot.get(bot)?.allow, '/', bot);
  }
});

test('todo grupo repete os bloqueios (admin, api, propostas, portal)', () => {
  for (const r of regras) {
    for (const caminho of ['/keystatic', '/api/', '/clientes/']) {
      assert.ok(r.disallow.includes(caminho), `${r.userAgent} sem ${caminho}`);
    }
  }
});

test('nenhum grupo bloqueia a raiz e o sitemap está declarado', () => {
  for (const r of regras) assert.ok(!r.disallow.includes('/'), r.userAgent);
  assert.equal(robots().sitemap, 'https://www.senturiaoadv.com.br/sitemap.xml');
});
