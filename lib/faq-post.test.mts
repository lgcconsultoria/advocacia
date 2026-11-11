/**
 * Testes da extração de FAQ dos artigos (lib/faq-post.ts).
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import Markdoc from '@markdoc/markdoc';
import { extrairFaq, faqLd } from './faq-post.ts';

function ast(md: string) {
  return Markdoc.parse(md);
}

test('extrai perguntas e respostas, juntando parágrafos e listas', () => {
  const md = [
    '## Introdução',
    '',
    'Texto qualquer.',
    '',
    '## Perguntas frequentes',
    '',
    '### Qual o prazo?',
    '',
    'Quinze dias, em **dias úteis**.',
    '',
    'Segundo parágrafo da resposta.',
    '',
    '### Preciso de advogado?',
    '',
    '- Depende do caso',
    '- Veja o [link](/f/previdencia)',
    '',
    '## Para continuar',
    '',
    'Fim.',
  ].join('\n');
  const faq = extrairFaq(ast(md));
  assert.equal(faq.length, 2);
  assert.equal(faq[0].pergunta, 'Qual o prazo?');
  assert.equal(faq[0].resposta, 'Quinze dias, em dias úteis. Segundo parágrafo da resposta.');
  assert.equal(faq[1].pergunta, 'Preciso de advogado?');
  assert.ok(faq[1].resposta.includes('Depende do caso'));
  assert.ok(faq[1].resposta.includes('Veja o link'));
  assert.ok(!faq[1].resposta.includes('Fim'));
});

test('sem bloco de perguntas frequentes, devolve vazio e não gera JSON-LD', () => {
  const faq = extrairFaq(ast('## Outra seção\n\nTexto.\n\n### Título\n\nCorpo.'));
  assert.deepEqual(faq, []);
  assert.equal(faqLd(faq, 'https://exemplo.com/blog/x'), null);
});

test('faqLd monta FAQPage válido', () => {
  const ld = faqLd([{ pergunta: 'P?', resposta: 'R.' }], 'https://exemplo.com/blog/x');
  assert.ok(ld);
  assert.equal(ld['@type'], 'FAQPage');
  assert.equal(ld.mainEntity[0]['@type'], 'Question');
  assert.equal(ld.mainEntity[0].acceptedAnswer.text, 'R.');
});

test('todo artigo do blog com bloco de perguntas tem entre 6 e 8 perguntas com resposta', () => {
  const dir = new URL('../content/posts/', import.meta.url);
  let comFaq = 0;
  for (const nome of readdirSync(dir).filter((n) => n.endsWith('.mdoc'))) {
    const texto = readFileSync(new URL(nome, dir), 'utf8');
    if (!/^## Perguntas frequentes/m.test(texto)) continue;
    comFaq += 1;
    const faq = extrairFaq(ast(texto));
    assert.ok(faq.length >= 6 && faq.length <= 8, `${nome}: ${faq.length} perguntas`);
    for (const p of faq) assert.ok(p.resposta.length > 20, `${nome}: resposta curta em "${p.pergunta}"`);
  }
  assert.ok(comFaq >= 10, `esperava ao menos 10 artigos com FAQ, achei ${comFaq}`);
});
