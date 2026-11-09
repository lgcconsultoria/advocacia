/**
 * Testes das frentes do funil (lib/frentes.ts).
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CODIGO,
  FRENTES,
  FRENTES_COM_LANDING,
  WHATSAPP_ADVOCACIA,
  chaveDoTermo,
  ehFrente,
  frenteDoCaminho,
  linkWhatsapp,
  tituloPorTermo,
} from './frentes.ts';

test('linkWhatsapp leva o número oficial e termina com o código da frente', () => {
  const l = linkWhatsapp('ms_licitacao', 'Olá');
  assert.ok(l.startsWith(`https://wa.me/${WHATSAPP_ADVOCACIA}?text=`));
  assert.ok(l.endsWith('%5BMS%5D'));
  assert.equal(WHATSAPP_ADVOCACIA.length, 12);
});

test('cada frente com landing tem seu código e ele aparece no link', () => {
  const esperado = { ms_licitacao: 'MS', previdencia: 'PV', execucao: 'EX', empresarial: 'EM', superendividamento: 'SE' };
  for (const f of FRENTES_COM_LANDING) {
    assert.equal(CODIGO[f], esperado[f]);
    assert.ok(linkWhatsapp(f, 'Quero ajuda').endsWith(`%5B${esperado[f]}%5D`));
  }
});

test('"outro" não leva código no WhatsApp', () => {
  const l = linkWhatsapp('outro', 'Olá! Gostaria de um atendimento.');
  assert.ok(!l.includes('%5B'));
});

test('ehFrente só aceita os seis códigos', () => {
  for (const f of FRENTES) assert.equal(ehFrente(f), true);
  assert.equal(ehFrente('MS'), false);
  assert.equal(ehFrente('<script>'), false);
  assert.equal(ehFrente(undefined), false);
});

test('título dinâmico: só da lista fechada', () => {
  const titulos = { inabilitacao: 'Inabilitado na licitação?', desclassificacao: 'Desclassificado no pregão?' };
  const padrao = 'Padrão';
  assert.equal(tituloPorTermo('inabilitacao', titulos, padrao), 'Inabilitado na licitação?');
  assert.equal(tituloPorTermo('Inabilitação', titulos, padrao), 'Inabilitado na licitação?');
  assert.equal(tituloPorTermo(['desclassificacao', 'x'], titulos, padrao), 'Desclassificado no pregão?');
  assert.equal(tituloPorTermo('outra-coisa', titulos, padrao), padrao);
  assert.equal(tituloPorTermo('', titulos, padrao), padrao);
  assert.equal(tituloPorTermo(undefined, titulos, padrao), padrao);
});

test('?kw=<script> e chaves de protótipo caem no título padrão', () => {
  const titulos = { ok: 'Título ok' };
  assert.equal(tituloPorTermo('<script>alert(1)</script>', titulos, 'P'), 'P');
  assert.equal(tituloPorTermo('__proto__', titulos, 'P'), 'P');
  assert.equal(tituloPorTermo('constructor', titulos, 'P'), 'P');
  assert.equal(tituloPorTermo('toString', titulos, 'P'), 'P');
});

test('chaveDoTermo normaliza acento, caixa e símbolos', () => {
  assert.equal(chaveDoTermo('  Mandado de Segurança!! '), 'mandado-de-seguranca');
  assert.equal(chaveDoTermo('<script>'), 'script');
});

test('frenteDoCaminho: páginas de uma frente levam o código; o resto é "outro"', () => {
  assert.equal(frenteDoCaminho('/f/previdencia'), 'previdencia');
  assert.equal(frenteDoCaminho('/licitacoes/mandado-de-seguranca/'), 'ms_licitacao');
  assert.equal(frenteDoCaminho('/areas/execucoes'), 'execucao');
  assert.equal(frenteDoCaminho('/'), 'outro');
  assert.equal(frenteDoCaminho('/sobre'), 'outro');
  assert.equal(frenteDoCaminho('/tributario'), 'outro');
});
