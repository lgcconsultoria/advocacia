/**
 * Regras de texto das landings /f/<frente> (content/frentes): estrutura fechada,
 * títulos por palavra-chave só da lista, e nada do que o GUIA-DO-SITE.md proíbe
 * (promessa, urgência de venda, preço, "100%", caso de cliente).
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chaveDoTermo, FRENTES_COM_LANDING } from './frentes.ts';
import { MS_LICITACAO } from '../content/frentes/ms_licitacao.ts';
import { PREVIDENCIA } from '../content/frentes/previdencia.ts';
import { EXECUCAO } from '../content/frentes/execucao.ts';
import { EMPRESARIAL } from '../content/frentes/empresarial.ts';
import { SUPERENDIVIDAMENTO } from '../content/frentes/superendividamento.ts';

const TODOS = [MS_LICITACAO, PREVIDENCIA, EXECUCAO, EMPRESARIAL, SUPERENDIVIDAMENTO];

// GUIA-DO-SITE.md, seção 6, mais promessas e prova que o escritório não pode fazer.
const PROIBIDO = [
  /garanta seu direito/i,
  /resolva agora/i,
  /contrate j[áa]/i,
  /n[ãa]o perca a chance/i,
  /fale com o melhor/i,
  /vamos ganhar/i,
  /recupere seu dinheiro/i,
  /[úu]ltima oportunidade/i,
  /100\s?%/,
  /\bR\$/,
  /garantimos|(?<!sem )garantia de (êxito|resultado)/i,
  /sucesso garantido|causa ganha/i,
  /nosso(s)? cliente(s)? (já )?(ganh|recuper|receb)/i,
  /o melhor escrit[óo]rio/i,
];

function textos(c: (typeof TODOS)[number]): string[] {
  return [
    c.meta.titulo,
    c.meta.descricao,
    c.rotulo,
    c.titulo,
    c.subtitulo,
    c.dorTitulo,
    ...c.dor,
    ...c.como.flatMap((p) => [p.titulo, p.texto]),
    ...c.credenciais,
    c.pergunta.rotulo,
    c.pergunta.exemplo,
    ...c.perguntasFrequentes.flatMap((f) => [f.question, f.answer]),
    c.textoWhatsapp,
    ...Object.values(c.titulosPorTermo),
  ];
}

test('há uma landing para cada frente com landing, na estrutura fechada', () => {
  assert.deepEqual(TODOS.map((c) => c.frente).sort(), [...FRENTES_COM_LANDING].sort());
  for (const c of TODOS) {
    assert.equal(c.dor.length, 3, c.frente);
    assert.equal(c.como.length, 3, c.frente);
    assert.equal(c.perguntasFrequentes.length, 4, c.frente);
    assert.ok(c.credenciais.length >= 3, c.frente);
    assert.ok(c.credenciais[0].includes('OAB/SC nº 73.764'), c.frente);
  }
});

test('títulos por palavra-chave: chaves já normalizadas e títulos sem HTML', () => {
  for (const c of TODOS) {
    const chaves = Object.keys(c.titulosPorTermo);
    assert.ok(chaves.length >= 4, c.frente);
    for (const k of chaves) {
      assert.equal(chaveDoTermo(k), k, `${c.frente}: chave "${k}" não está normalizada`);
      assert.ok(!/[<>"]/.test(c.titulosPorTermo[k]), `${c.frente}: ${k}`);
    }
  }
});

test('nenhum texto usa fórmula proibida (promessa, preço, caso de cliente)', () => {
  for (const c of TODOS) {
    for (const t of textos(c)) {
      for (const re of PROIBIDO) {
        assert.ok(!re.test(t), `${c.frente}: "${t.slice(0, 70)}" casa ${re}`);
      }
    }
  }
});

test('toda landing deixa claro que não promete resultado ou que a triagem não é mandato', () => {
  for (const c of TODOS) {
    const junto = textos(c).join(' ').toLowerCase();
    assert.ok(/nenhum resultado é prometido|não\. ninguém pode garantir|sem garantia de resultado|não constitui mandato/.test(junto), c.frente);
  }
});

test('o texto do WhatsApp é curto e sem colchetes (o código é acrescentado pelo link)', () => {
  for (const c of TODOS) {
    assert.ok(c.textoWhatsapp.length < 200, c.frente);
    assert.ok(!/[\[\]]/.test(c.textoWhatsapp), c.frente);
  }
});
