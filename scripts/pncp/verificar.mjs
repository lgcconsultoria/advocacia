#!/usr/bin/env node
// Verificação do módulo PNCP sem dependências (node:test + node:assert).
//
//   node scripts/pncp/verificar.mjs          # offline: rotas em modo snapshot + funções puras
//   node scripts/pncp/verificar.mjs --vivo   # também chama o PNCP de verdade (termômetro)
//
// As rotas são chamadas como o Next as chama: GET(new Request(url)).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carregar } from './carregador.mjs';

const VIVO = process.argv.includes('--vivo');
process.env.PNCP_MODO = 'snapshot';

const rotaTermometro = await carregar('app/api/pncp/termometro/route.ts');
const rotaUf = await carregar('app/api/pncp/uf/route.ts');
const rotaSerie = await carregar('app/api/pncp/serie/route.ts');
const datas = await carregar('lib/pncp/datas.ts');
const valores = await carregar('lib/pncp/valores.ts');
const animacao = await carregar('lib/pncp/animacao.ts');

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const DIA = /^\d{4}-\d{2}-\d{2}$/;

function conferirProcedencia(p, onde) {
  assert.ok(p, `${onde}: sem procedência`);
  assert.ok(['pncp-ao-vivo', 'snapshot'].includes(p.fonte), `${onde}: fonte`);
  assert.ok(['exato-api', 'soma-exata', 'topo-exato+faixas'].includes(p.metodo), `${onde}: método ${p.metodo}`);
  assert.match(p.consultadoEm, ISO, `${onde}: consultadoEm`);
  assert.ok(p.requisicoes >= 0 && typeof p.endpoint === 'string', `${onde}: endpoint/requisições`);
}

function conferirMedida(m, onde, comValor) {
  assert.ok(Number.isInteger(m.quantidade) && m.quantidade >= 0, `${onde}: quantidade`);
  conferirProcedencia(m.procedencia, onde);
  if (comValor) {
    const v = m.valor;
    assert.ok(v, `${onde}: sem valor`);
    assert.ok(v.intervalo[0] <= v.valor + 1e-6 && v.valor <= v.intervalo[1] + 1e-6, `${onde}: valor fora do intervalo`);
    assert.ok(v.valorSemAtipicos <= v.valor + 1e-6, `${onde}: sem atípicos > bruto`);
    const [a, b] = v.intervaloSemAtipicos;
    assert.ok(a <= v.valorSemAtipicos + 1e-6 && v.valorSemAtipicos <= b + 1e-6, `${onde}: sem atípicos fora do intervalo`);
    assert.equal(v.atipicos.limite, 10_000_000_000);
    conferirProcedencia(v.procedencia, `${onde}.valor`);
  }
}

function conferirTermometro(t) {
  conferirMedida(t.abertas, 'abertas', true);
  assert.ok(t.abertas.valorEstimado === null || t.abertas.valorEstimado > 0);
  conferirMedida(t.publicadasHoje, 'publicadasHoje', true);
  assert.ok(t.publicadasHoje.ritmoPorMinuto >= 0);
  conferirMedida(t.publicadas24h, 'publicadas24h', false);
  conferirMedida(t.publicadas30d, 'publicadas30d', true);
  conferirMedida(t.contratosMes, 'contratosMes', true);
  conferirMedida(t.contratosPublicadosHoje, 'contratosPublicadosHoje', true);
  assert.ok(t.porModalidade.length > 0 && t.porModalidade.every((m) => m.abertas > 0));
  assert.equal(t.porEsfera.length, 4);
  assert.match(t.hoje, DIA);
  assert.match(t.atualizadoEm, ISO);
  assert.ok(Array.isArray(t.avisos));
}

async function chamar(rota, url) {
  const r = await rota.GET(new Request(url));
  assert.equal(r.status, 200);
  const cc = r.headers.get('cache-control');
  assert.match(cc, /s-maxage=\d+/);
  assert.match(cc, /stale-while-revalidate=\d+/);
  return r.json();
}

test('rota /api/pncp/termometro (snapshot)', async () => {
  const t = await chamar(rotaTermometro, 'http://x/api/pncp/termometro');
  conferirTermometro(t);
  assert.equal(t.fonte, 'snapshot');
});

test('rota /api/pncp/uf (snapshot)', async () => {
  const u = await chamar(rotaUf, 'http://x/api/pncp/uf');
  assert.equal(u.ufs.length, 27);
  const siglas = new Set(u.ufs.map((x) => x.uf));
  assert.equal(siglas.size, 27);
  for (const x of u.ufs) {
    assert.ok(x.lat > -34 && x.lat < 6 && x.lng > -74 && x.lng < -34, `${x.uf}: coordenadas`);
    assert.ok(Number.isInteger(x.abertas) && Number.isInteger(x.publicadas30d));
    assert.ok(x.valorEstimado >= 0 && x.valorEstimado <= x.valorEstimadoBruto + 1e-6);
    assert.ok(x.valorIntervalo[0] <= x.valorEstimado + 1e-6 && x.valorEstimado <= x.valorIntervalo[1] + 1e-6, `${x.uf}: intervalo`);
    conferirProcedencia(x.procedencia, `uf ${x.uf}`);
  }
});

test('rota /api/pncp/serie (snapshot, recorte por ?dias=)', async () => {
  const s = await chamar(rotaSerie, 'http://x/api/pncp/serie?dias=30');
  assert.equal(s.pontos.length, 30);
  for (const p of s.pontos) {
    assert.match(p.date, DIA);
    assert.ok(Number.isInteger(p.count) && p.count >= 0);
  }
  const datasOrdenadas = s.pontos.map((p) => p.date);
  assert.deepEqual(datasOrdenadas, [...datasOrdenadas].sort());
  const cheia = await chamar(rotaSerie, 'http://x/api/pncp/serie');
  assert.equal(cheia.pontos.length, 365);
});

test('datas no fuso de Brasília', () => {
  assert.equal(datas.diaBrasilia(new Date('2026-10-07T02:59:59Z')), '2026-10-06');
  assert.equal(datas.diaBrasilia(new Date('2026-10-07T03:00:00Z')), '2026-10-07');
  assert.equal(datas.dataHoraBrasilia(new Date('2026-10-07T14:05:09Z')), '2026-10-07T11:05:09');
  assert.equal(datas.somarDias('2026-03-01', -1), '2026-02-28');
  assert.equal(datas.intervaloDeDias('2026-12-30', '2027-01-02').length, 4);
});

test('faixas de valor: geométricas, de R$ 1 até o teto', () => {
  const b = valores.bordasDasFaixas(1e8, 4);
  assert.equal(b[0], 1);
  assert.equal(b.at(-1), 1e8);
  for (let i = 1; i < b.length; i++) assert.ok(b[i] > b[i - 1]);
  assert.equal(b.length, 33);
});

test('animação: projeta só dentro do horizonte e no mesmo dia', () => {
  const t0 = '2026-10-07T14:00:00.000Z';
  const p = animacao.projetarContador(1000, t0, 10, new Date('2026-10-07T14:01:00Z'));
  assert.deepEqual(p, { valor: 1010, estimado: true });
  const longe = animacao.projetarContador(1000, t0, 10, new Date('2026-10-07T15:00:00Z'));
  assert.equal(longe.valor, 1030); // horizonte padrão de 3 min
  const virou = animacao.projetarContador(1000, '2026-10-08T02:59:00.000Z', 10, new Date('2026-10-08T03:01:00Z'));
  assert.deepEqual(virou, { valor: 1000, estimado: false });
  const semAnterior = animacao.projetarPorTaxa(null, { valor: 5, em: t0 });
  assert.deepEqual(semAnterior, { valor: 5, estimado: false });
  assert.equal(animacao.rotuloAtualizado(t0, new Date('2026-10-07T14:07:30Z')), 'atualizado há 7 min');
  assert.equal(animacao.formatarReais(201_594_569_710), 'R$ 201,6 bi');
});

if (VIVO) {
  test('PNCP ao vivo: termômetro completo', { timeout: 90_000 }, async () => {
    const { termometro } = await carregar('lib/pncp/agregados.ts');
    const t = await termometro({ prazoTotalMs: 60_000 });
    conferirTermometro(t);
    assert.equal(t.fonte, 'pncp-ao-vivo', JSON.stringify(t.avisos));
    console.log(`  abertas=${t.abertas.quantidade} valor≈R$ ${(t.abertas.valorEstimado / 1e9).toFixed(1)} bi`);
  });
}
