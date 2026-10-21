/**
 * Testes da mensagem do WhatsApp por página (lib/contato/whatsapp.ts).
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assuntoDaPagina,
  limparCaminho,
  linkWhatsappCom,
  mensagemWhatsapp,
  utmsDe,
} from './whatsapp.ts';

test('limparCaminho tira query, âncora e barra final', () => {
  assert.equal(limparCaminho('/licitacoes/?a=1#x'), '/licitacoes');
  assert.equal(limparCaminho(''), '/');
  assert.equal(limparCaminho('/'), '/');
  assert.equal(limparCaminho('tributario'), '/tributario');
});

test('assunto: o mais específico vence e prefixo casa subpáginas', () => {
  assert.equal(assuntoDaPagina('/licitacoes/mandado-de-seguranca').ref, 'ms-licitacao');
  assert.equal(assuntoDaPagina('/licitacoes').ref, 'licitacoes');
  assert.equal(assuntoDaPagina('/licitacoes/fui-inabilitado').ref, 'fui-inabilitado');
  assert.equal(assuntoDaPagina('/licitacoes/desclassificada-no-pregao').ref, 'desclassificada-pregao');
  assert.equal(assuntoDaPagina('/licitacoes/recurso-administrativo').ref, 'recurso-administrativo');
  assert.equal(assuntoDaPagina('/licitacoes/impugnacao-de-edital').ref, 'impugnacao-edital');
  assert.equal(assuntoDaPagina('/modelos/recurso-administrativo-licitacao').ref, 'recurso-inabilitacao');
  assert.equal(assuntoDaPagina('/modelos').ref, 'modelos');
  assert.equal(assuntoDaPagina('/areas/familia').ref, 'areas');
  assert.equal(assuntoDaPagina('/').ref, 'home');
  assert.equal(assuntoDaPagina('/sobre').ref, 'home');
  // prefixo não casa pedaço de palavra
  assert.equal(assuntoDaPagina('/licitacoesx').ref, 'home');
});

test('mensagem leva assunto, página, ref e campanha', () => {
  const m = mensagemWhatsapp({
    caminho: '/licitacoes/mandado-de-seguranca?utm_source=x',
    utms: { utm_source: 'instagram', utm_campaign: 'ms out' },
  });
  assert.equal(
    m,
    'Olá! Quero avaliar se cabe mandado de segurança no meu caso de licitação.\n\n' +
      '[site · /licitacoes/mandado-de-seguranca · ref:ms-licitacao · utm:instagram/ms-out]',
  );
});

test('mensagem sem campanha e com texto próprio', () => {
  const m = mensagemWhatsapp({ caminho: '/', texto: 'Quero um orçamento.', ref: 'botao-x' });
  assert.equal(m, 'Olá! Quero um orçamento.\n\n[site · / · ref:botao-x]');
});

test('link codifica a mensagem e limpa o número', () => {
  assert.equal(linkWhatsappCom('55 (67) 99167-5629', 'Olá! A&B'), 'https://wa.me/5567991675629?text=Ol%C3%A1!%20A%26B');
});

test('utms: da URL primeiro, senão os guardados; lixo vira vazio', () => {
  assert.deepEqual(utmsDe('?utm_source=google&utm_campaign=lc', '{"utm_source":"meta"}'), {
    utm_source: 'google',
    utm_campaign: 'lc',
  });
  assert.deepEqual(utmsDe('', '{"utm_source":"meta","x":1}'), { utm_source: 'meta' });
  assert.deepEqual(utmsDe('', 'não é json'), {});
  assert.deepEqual(utmsDe('', null), {});
});
