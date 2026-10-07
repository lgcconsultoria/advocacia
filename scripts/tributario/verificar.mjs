// Testes do simulador puro × híbrido (lib/tributario/simulador.ts).
//
//   node --test scripts/tributario/verificar.mjs
//
// Os números esperados saíram do motor de diagnóstico do escritório (Sistema-Juridico,
// `juridico.diagnostico.motor.regimes.calcular_regime`, regras v2026.09, premissas
// padrão: alíquota estimada, preço mantido, base do híbrido sem o ISS do DAS). Se o
// motor estiver na máquina (MOTOR_DIR ou ~/Sistema-Juridico), o último teste roda o
// Python de novo e compara ao vivo. FGTS fica de fora: é igual nos dois regimes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  simular,
  simularDemo,
  simularAnos,
  aliquotaEfetiva,
  aliquotasDoAno,
  centavos,
  CENARIO_DEMO,
} from '../../lib/tributario/simulador.ts';

const quase = (real, esperado, tol = 0.02, rotulo = '') =>
  assert.ok(Math.abs(real - esperado) <= tol, `${rotulo}: ${real} ≠ ${esperado} (±${tol})`);

/** Cenários do motor: entrada do simulador + saída anual do Python. */
const CENARIOS = [
  {
    nome: 'demo 2027 — Anexo III (fator R), 4ª faixa, B2B 100%, compras 20%',
    entrada: { ...CENARIO_DEMO, faturaValor: 100000, ano: 2027 },
    motor: { linha: 'outra', receita: 1800000, b2b: 1, compras: 360000, ano: 2027 },
    esperado: {
      puro: { das: 252360.0, credito: 41891.76, pj100: 97.67 },
      hibrido: { das: 190212.14, ibsCbs: 114612.66, credito: 144972.52, pj100: 91.95 },
    },
  },
  {
    nome: 'demo 2033 — regime pleno',
    entrada: { ...CENARIO_DEMO, ano: 2033 },
    motor: { linha: 'outra', receita: 1800000, b2b: 1, compras: 360000, ano: 2033 },
    esperado: {
      puro: { das: 252360.0, credito: 123908.76, pj100: 93.12 },
      hibrido: { das: 96464.82, ibsCbs: 314208.42, credito: 392760.53, pj100: 78.18 },
    },
  },
  {
    nome: 'Anexo V (fator R 15%), 3ª faixa, B2B 60%, compras 10%, 2027',
    entrada: { faturamento12m: 900000, faturaValor: 30000, atividade: 'servicos_fator_r', fatorR: 0.15, percentualB2B: 0.6, comprasCreditaveis: 90000, ano: 2027 },
    motor: { linha: 'pesquisa', receita: 900000, b2b: 0.6, compras: 90000, ano: 2027, folha: 135000 },
    esperado: {
      puro: { das: 167400.0, credito: 19234.26, pj100: 96.44 },
      hibrido: { das: 122763.1, ibsCbs: 65372.93, credito: 43777.74, pj100: 91.89 },
    },
  },
  {
    nome: 'Anexo III, 5ª faixa com teto de ISS, B2B 80%, compras 30%, 2029',
    entrada: { faturamento12m: 3200000, faturaValor: 50000, atividade: 'servicos_iii', percentualB2B: 0.8, comprasCreditaveisPct: 0.3, ano: 2029 },
    motor: { linha: 'outra', receita: 3200000, b2b: 0.8, compras: 960000, ano: 2029 },
    esperado: {
      puro: { das: 546360.0, credito: 87328.22, pj100: 96.59 },
      hibrido: { das: 384457.66, ibsCbs: 209071.66, credito: 243863.74, pj100: 90.47 },
    },
  },
  {
    nome: 'imposto por cima, 2033',
    entrada: { ...CENARIO_DEMO, ano: 2033, repasse: 'por_cima' },
    motor: { linha: 'outra', receita: 1800000, b2b: 1, compras: 360000, ano: 2033, repasse: 'por_cima' },
    esperado: {
      puro: { das: 252360.0, credito: 123908.76, pj100: 93.12 },
      hibrido: { das: 128451.24, ibsCbs: 423827.89, credito: 502380.0, pj100: 100.0 },
    },
  },
  {
    nome: 'varejo de serviços B2C (B2B 10%), 2027',
    entrada: { faturamento12m: 500000, faturaValor: 5000, atividade: 'servicos_iii', percentualB2B: 0.1, comprasCreditaveisPct: 0.05, ano: 2027 },
    motor: { linha: 'outra', receita: 500000, b2b: 0.1, compras: 25000, ano: 2027 },
    esperado: {
      puro: { das: 49860.0, credito: 827.68, pj100: 98.34 },
      hibrido: { das: 36835.72, ibsCbs: 38736.1, credito: 4084.44, pj100: 91.83 },
    },
  },
  {
    nome: 'Anexo V com fator R 30% → Anexo III, B2B 90%, compras 40%, 2031',
    entrada: { faturamento12m: 1000000, faturaValor: 20000, atividade: 'servicos_fator_r', fatorR: 0.3, percentualB2B: 0.9, comprasCreditaveis: 400000, ano: 2031 },
    motor: { linha: 'pesquisa', receita: 1000000, b2b: 0.9, compras: 400000, ano: 2031, folha: 300000 },
    esperado: {
      puro: { das: 124360.0, credito: 29491.97, pj100: 96.72 },
      hibrido: { das: 76381.34, ibsCbs: 73946.36, credito: 113017.5, pj100: 87.44 },
    },
  },
];

for (const c of CENARIOS) {
  test(`reproduz o motor: ${c.nome}`, () => {
    const r = simular(c.entrada);
    const { puro: p, hibrido: h } = r.anual;
    quase(p.das, c.esperado.puro.das, 0.02, 'DAS puro');
    quase(p.creditoClientes, c.esperado.puro.credito, 0.02, 'crédito puro');
    quase(p.custoLiquidoPjPor100, c.esperado.puro.pj100, 0.011, 'custo PJ/100 puro');
    quase(h.das, c.esperado.hibrido.das, 0.02, 'DAS híbrido');
    quase(h.ibsCbsRecolher, c.esperado.hibrido.ibsCbs, 0.02, 'IBS/CBS híbrido');
    quase(h.creditoClientes, c.esperado.hibrido.credito, 0.02, 'crédito híbrido');
    quase(h.custoLiquidoPjPor100, c.esperado.hibrido.pj100, 0.011, 'custo PJ/100 híbrido');
    quase(h.impostoEmpresa, c.esperado.hibrido.das + c.esperado.hibrido.ibsCbs, 0.02, 'carga híbrido');
  });
}

test('alíquota efetiva: Anexo III, 4ª faixa, RBT12 R$ 1,8 mi = 14,02%', () => {
  quase(aliquotaEfetiva('III', 2027, 1800000), 0.1402, 1e-12, 'ef');
});

test('alíquotas do ano: 2027 = 9,11% + 0,10%; 2029 = 9,21% + 1,87%; 2033 = 27,91%', () => {
  const a27 = aliquotasDoAno(2027);
  quase(a27.cbs, 0.0911, 1e-12, 'cbs27');
  quase(a27.ibs, 0.001, 1e-12, 'ibs27');
  quase(aliquotasDoAno(2029).ibs, 0.0187, 1e-12, 'ibs29');
  quase(aliquotasDoAno(2033).soma, 0.2791, 1e-12, 'soma33');
});

test('centavos arredonda meia unidade para cima', () => {
  assert.equal(centavos(1.005), 1.01);
  assert.equal(centavos(2.344999), 2.34);
  assert.equal(centavos(-1.005), -1.01);
});

test('fatura de R$ 100 mil (demo 2027): números da página', () => {
  const { fatura: f } = simularDemo(2027);
  assert.equal(f.puro.das, 14020);
  assert.equal(f.puro.creditoCliente, 2327.32);
  assert.equal(f.puro.custoLiquidoCliente, 97672.68);
  quase(f.hibrido.das, 10567.34, 0.01, 'DAS h');
  quase(f.hibrido.ibsCbsDestacado, 8054.03, 0.01, 'destacado');
  quase(f.hibrido.creditoCompras, 1686.66, 0.01, 'crédito compras');
  quase(f.hibrido.ibsCbsRecolher, 6367.37, 0.01, 'recolher');
  quase(f.hibrido.impostoEmpresa, 16934.71, 0.01, 'imposto h');
  quase(f.hibrido.custoLiquidoCliente, 91945.97, 0.01, 'custo cliente h');
  quase(f.diferencas.custoCliente, -5726.71, 0.02, 'economia cliente');
  quase(f.diferencas.impostoEmpresa, 2914.71, 0.02, 'extra empresa');
  quase(f.diferencas.ganhoCadeia, 2812.0, 0.02, 'ganho cadeia');
});

test('a fatura é a escala do ano (sem efeito de faixa)', () => {
  const r = simularDemo(2027);
  quase(r.fatura.hibrido.ibsCbsRecolher * 18, r.anual.hibrido.ibsCbsRecolher, 0.2, 'escala');
});

test('veredito honesto: demo pede renegociação de preço; B2C fica no puro', () => {
  assert.equal(simularDemo(2027).veredito.tipo, 'hibrido_com_preco');
  assert.match(simularDemo(2027).veredito.titulo, /reduz o custo do seu cliente em R\$\s5\.726,71 por fatura/);
  const b2c = simular(CENARIOS[5].entrada);
  assert.equal(b2c.veredito.tipo, 'puro');
  assert.equal(simular({ ...CENARIO_DEMO, percentualB2B: 0 }).veredito.tipo, 'puro');
});

test('muitos insumos: o híbrido pode baixar o imposto da própria empresa', () => {
  const r = simular({ ...CENARIO_DEMO, comprasCreditaveisPct: 0.7, ano: 2033 });
  assert.ok(r.anual.diferencas.impostoEmpresa < 0, 'empresa paga menos');
  assert.equal(r.veredito.tipo, 'hibrido');
});

test('invariantes: crédito do híbrido ≥ crédito do puro; imposto ≥ 0; série 2027–2033', () => {
  const serie = simularAnos(CENARIO_DEMO);
  assert.deepEqual(serie.map((r) => r.ano), [2027, 2028, 2029, 2030, 2031, 2032, 2033]);
  for (const r of serie) {
    assert.ok(r.fatura.hibrido.creditoCliente >= r.fatura.puro.creditoCliente);
    assert.ok(r.fatura.hibrido.impostoEmpresa >= 0 && r.fatura.puro.impostoEmpresa >= 0);
    assert.ok(r.explicacoes.length >= 6);
    assert.ok(r.premissas.every((p) => p.fonte.length > 5));
  }
});

test('fora do escopo: acima do sublimite e entradas inválidas', () => {
  assert.throws(() => simular({ ...CENARIO_DEMO, faturamento12m: 4_000_000 }), RangeError);
  assert.throws(() => simular({ ...CENARIO_DEMO, faturaValor: 0 }), RangeError);
});

test('confere ao vivo com o motor em Python (se disponível)', (t) => {
  const dir = process.env.MOTOR_DIR || join(homedir(), 'Sistema-Juridico');
  const py = join(dir, '.venv/bin/python');
  if (!existsSync(py)) return t.skip('motor não encontrado');
  const script = `
import json, sys
from decimal import Decimal as D
from juridico.diagnostico.regras import carregar_regras
from juridico.diagnostico.dominio import Premissas
from juridico.diagnostico.motor.regimes import calcular_regime, BaseCnpj
R = carregar_regras()
out = []
for c in json.loads(sys.argv[1]):
    rec = D(str(c["receita"])); pj = rec * D(str(c["b2b"]))
    base = BaseCnpj(cnpj="x", receitas={c["linha"]: {"pj_regular": pj, "pf": rec - pj}},
        despesas_creditaveis=D(str(c["compras"])), folha12=D(str(c.get("folha", 0))),
        prolabore12=D(0), rbt12_global=rec)
    p = Premissas(repasse=c.get("repasse", "mantido"))
    o = {}
    for reg in ("integral", "hibrido"):
        r = calcular_regime(R, p, base, reg, c["ano"])
        o[reg] = {"das": float(r.tributos["das"]), "ibs_cbs": float(r.tributos.get("ibs_cbs", 0)),
                  "credito": float(r.credito_entregue_pj_regular)}
    out.append(o)
print(json.dumps(out))
`;
  const arq = join(mkdtempSync(join(tmpdir(), 'motor-')), 'motor.py');
  writeFileSync(arq, script);
  let saida;
  try {
    saida = execFileSync(py, [arq, JSON.stringify(CENARIOS.map((c) => c.motor))], { cwd: dir, encoding: 'utf8' });
  } catch (e) {
    return t.skip(`motor não rodou: ${String(e.message).slice(0, 120)}`);
  }
  const vivos = JSON.parse(saida);
  CENARIOS.forEach((c, i) => {
    const r = simular(c.entrada).anual;
    quase(r.puro.das, vivos[i].integral.das, 0.02, `${c.nome} DAS puro`);
    quase(r.puro.creditoClientes, vivos[i].integral.credito, 0.02, `${c.nome} crédito puro`);
    quase(r.hibrido.das, vivos[i].hibrido.das, 0.02, `${c.nome} DAS híbrido`);
    quase(r.hibrido.ibsCbsRecolher, vivos[i].hibrido.ibs_cbs, 0.02, `${c.nome} IBS/CBS`);
    quase(r.hibrido.creditoClientes, vivos[i].hibrido.credito, 0.02, `${c.nome} crédito híbrido`);
  });
});
