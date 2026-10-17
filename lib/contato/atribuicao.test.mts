/**
 * Testes da atribuição de anúncio do lead (lib/contato/atribuicao.ts).
 * Rodam com o executor nativo do Node (que tira os tipos do TypeScript sozinho):
 *   npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  atribuicaoDaVisita,
  lerCookie,
  montarFbc,
  novoEventId,
  parametrosDaUrl,
} from './atribuicao.ts';

function memoria(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    key: (i: number) => [...m.keys()][i] ?? null,
    removeItem: (k: string) => void m.delete(k),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
  };
}

const ACEITO = { v: 1 as const, medicao: true, ts: Date.UTC(2026, 9, 17, 12, 0, 0) };
const RECUSADO = { v: 1 as const, medicao: false, ts: Date.UTC(2026, 9, 17, 12, 0, 0) };
const AGORA = Date.UTC(2026, 9, 17, 13, 0, 0);

test('lê fbclid, ad_id e campaign_id da URL', () => {
  const p = parametrosDaUrl('?fbclid=IwAR1abc-_9&ad_id=120200000001&campaign_id=120200000002');
  assert.deepEqual(p, { fbclid: 'IwAR1abc-_9', ad_id: '120200000001', campaign_id: '120200000002' });
});

test('utm_id vale como campaign_id quando campaign_id não veio', () => {
  assert.deepEqual(parametrosDaUrl('?utm_id=555'), { campaign_id: '555' });
  assert.deepEqual(parametrosDaUrl('?utm_id=555&campaign_id=777'), { campaign_id: '777' });
});

test('descarta valores fora do formato (macro não substituída, lixo, tamanho)', () => {
  assert.deepEqual(parametrosDaUrl('?ad_id={{ad.id}}&campaign_id=abc&fbclid=a%20b'), {});
  assert.deepEqual(parametrosDaUrl(`?fbclid=${'x'.repeat(600)}`), {});
});

test('lerCookie acha o cookie certo', () => {
  const c = 'a=1; _fbp=fb.1.1700000000000.123456789; _fbc=fb.1.1700000000000.IwAR1';
  assert.equal(lerCookie(c, '_fbp'), 'fb.1.1700000000000.123456789');
  assert.equal(lerCookie(c, '_fbc'), 'fb.1.1700000000000.IwAR1');
  assert.equal(lerCookie(c, '_ga'), null);
});

test('montarFbc segue o formato da Meta', () => {
  assert.equal(montarFbc('IwAR1', 1760700000000), 'fb.1.1760700000000.IwAR1');
});

test('com consentimento: guarda os parâmetros e lê os cookies', () => {
  const s = memoria();
  const a = atribuicaoDaVisita({
    search: '?fbclid=IwAR1&ad_id=1',
    armazenamento: s,
    cookies: '_fbp=fb.1.1.2; _fbc=fb.1.1760000000000.IwAR1',
    consentimento: ACEITO,
    agora: AGORA,
  });
  assert.equal(a.fbclid, 'IwAR1');
  assert.equal(a.ad_id, '1');
  assert.equal(a.fbc, 'fb.1.1760000000000.IwAR1');
  assert.equal(a.fbp, 'fb.1.1.2');
  assert.equal(a.consentimento_marketing, true);
  assert.equal(a.consentimento_marketing_em, '2026-10-17T12:00:00.000Z');
});

test('com consentimento e sem _fbc: monta o fbc pelo fbclid, com a hora em que ele chegou', () => {
  const s = memoria();
  // 1ª página: chegou do anúncio
  atribuicaoDaVisita({ search: '?fbclid=IwAR9', armazenamento: s, cookies: '', consentimento: null, agora: 1000 });
  // depois navegou e aceitou os cookies; o formulário é enviado em outra página
  const a = atribuicaoDaVisita({ search: '', armazenamento: s, cookies: '', consentimento: ACEITO, agora: 9000 });
  assert.equal(a.fbclid, 'IwAR9');
  assert.equal(a.fbc, 'fb.1.1000.IwAR9');
  assert.equal(a.fbp, undefined);
});

test('sem consentimento: não lê cookie nem monta fbc, mas leva os parâmetros da URL', () => {
  const a = atribuicaoDaVisita({
    search: '?fbclid=IwAR1&campaign_id=9',
    armazenamento: memoria(),
    cookies: '_fbp=fb.1.1.2; _fbc=fb.1.1.IwAR1',
    consentimento: RECUSADO,
    agora: AGORA,
  });
  assert.equal(a.fbclid, 'IwAR1');
  assert.equal(a.campaign_id, '9');
  assert.equal(a.fbc, undefined);
  assert.equal(a.fbp, undefined);
  assert.equal(a.consentimento_marketing, false);
  assert.equal(a.consentimento_marketing_em, '2026-10-17T12:00:00.000Z');
});

test('sem escolha registrada: consentimento falso e sem data', () => {
  const a = atribuicaoDaVisita({ search: '', armazenamento: null, cookies: '', consentimento: null, agora: AGORA });
  assert.deepEqual(a, { consentimento_marketing: false, consentimento_marketing_em: null });
});

test('cookie fora do formato é ignorado', () => {
  const a = atribuicaoDaVisita({
    search: '',
    armazenamento: memoria(),
    cookies: '_fbp=<script>; _fbc=qualquer',
    consentimento: ACEITO,
    agora: AGORA,
  });
  assert.equal(a.fbp, undefined);
  assert.equal(a.fbc, undefined);
});

test('armazenamento que lança não derruba a leitura', () => {
  const quebrado = {
    getItem() {
      throw new Error('bloqueado');
    },
    setItem() {
      throw new Error('bloqueado');
    },
  } as unknown as Storage;
  const a = atribuicaoDaVisita({ search: '?ad_id=3', armazenamento: quebrado, cookies: '', consentimento: null, agora: AGORA });
  assert.equal(a.ad_id, '3');
});

test('novoEventId gera uuid diferente a cada envio', () => {
  const a = novoEventId();
  const b = novoEventId();
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.notEqual(a, b);
});

test('novoEventId funciona sem crypto.randomUUID', () => {
  const id = novoEventId({ getRandomValues: (v: Uint8Array) => v.fill(7) } as unknown as Crypto);
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
