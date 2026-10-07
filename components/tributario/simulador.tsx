'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  ATIVIDADES,
  CENARIO_DEMO,
  FATOR_R_LIMITE,
  SUBLIMITE,
  pct,
  reais,
  simular,
  type Ano,
  type Atividade,
  type EntradaSimulacao,
  type LadoFatura,
  type Repasse,
  type ResultadoSimulacao,
} from '@/lib/tributario/simulador';
import { NumeroAnimado } from './numero-animado';

/**
 * Simulador interativo: Simples puro × Simples híbrido, lado a lado, para uma fatura
 * e para o ano. Os números vêm de `lib/tributario/simulador.ts` (porta do motor de
 * diagnóstico do escritório). Simulação ilustrativa: o texto nunca promete resultado.
 */

export interface SimuladorTributarioProps {
  className?: string;
  /** Valores iniciais (padrão: o cenário da fatura de R$ 100 mil). */
  inicial?: Partial<EntradaSimulacao>;
  /** Chamado pelo botão de diagnóstico, com o resultado da simulação atual. */
  onDiagnostico?: (resultado: ResultadoSimulacao) => void;
  /** Texto do botão. */
  rotuloCta?: string;
}

const mi = (v: number) =>
  v >= 1_000_000
    ? `R$\u00a0${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}\u00a0mi`
    : `R$\u00a0${Math.round(v / 1000).toLocaleString('pt-BR')}\u00a0mil`;

/** "+ R$ 1,00" / "− R$ 1,00" (híbrido − puro). */
const assinado = (v: number) => (Math.abs(v) < 0.005 ? 'igual' : `${v > 0 ? '+' : '−'} ${reais(Math.abs(v))}`);

export function SimuladorTributario({
  className,
  inicial,
  onDiagnostico,
  rotuloCta = 'Quero o estudo com os números da minha empresa',
}: SimuladorTributarioProps) {
  const base = { ...CENARIO_DEMO, ...inicial };
  const [faturamento, setFaturamento] = useState(base.faturamento12m);
  const [fatura, setFatura] = useState(base.faturaValor);
  const [atividade, setAtividade] = useState<Atividade>(base.atividade);
  const [fatorR, setFatorR] = useState(base.fatorR ?? 0.3);
  const [b2b, setB2b] = useState(base.percentualB2B);
  const [compras, setCompras] = useState(
    base.comprasCreditaveisPct ?? (base.comprasCreditaveis !== undefined ? base.comprasCreditaveis / base.faturamento12m : 0.2)
  );
  const [ano, setAno] = useState<Ano>(base.ano ?? 2027);
  const [repasse, setRepasse] = useState<Repasse>(base.repasse ?? 'mantido');

  const r = useMemo(
    () =>
      simular({
        faturamento12m: faturamento,
        faturaValor: fatura,
        atividade,
        fatorR,
        percentualB2B: b2b,
        comprasCreditaveisPct: compras,
        ano,
        repasse,
      }),
    [faturamento, fatura, atividade, fatorR, b2b, compras, ano, repasse]
  );

  const { puro: p, hibrido: h, diferencas: dif } = r.fatura;

  return (
    <div className={cn('overflow-hidden rounded-[28px] border border-papel-2 bg-white', className)}>
      <div className="grid lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)]">
        {/* ── Controles ── */}
        <div className="border-b border-papel-2 bg-papel/60 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <p className="rotulo m-0 text-marca">Sua empresa</p>

          <Bloco titulo="Atividade">
            <Segmentado
              rotulo="Atividade"
              valor={atividade}
              opcoes={[
                { valor: 'servicos_iii', rotulo: 'Anexo III' },
                { valor: 'servicos_fator_r', rotulo: 'Anexo V · fator R' },
              ]}
              onChange={(v) => setAtividade(v as Atividade)}
            />
            <p className="hint mb-0 mt-2">{ATIVIDADES[atividade].detalhe}</p>
          </Bloco>

          {atividade === 'servicos_fator_r' && (
            <Deslizante
              rotulo="Folha ÷ receita (fator R)"
              valor={fatorR}
              min={0}
              max={0.6}
              passo={0.01}
              mostrar={pct(fatorR, 0)}
              onChange={setFatorR}
              dica={
                r.anual.puro.anexo === 'III'
                  ? `A partir de ${pct(FATOR_R_LIMITE, 0)}: tributa no Anexo III.`
                  : `Abaixo de ${pct(FATOR_R_LIMITE, 0)}: tributa no Anexo V.`
              }
            />
          )}

          <Deslizante
            rotulo="Faturamento dos últimos 12 meses"
            valor={faturamento}
            min={180_000}
            max={SUBLIMITE}
            passo={10_000}
            mostrar={mi(faturamento)}
            onChange={setFaturamento}
            dica={`${r.anual.puro.faixa}ª faixa · alíquota efetiva ${pct(r.anual.puro.aliquotaEfetiva)}`}
          />
          <Deslizante
            rotulo="Valor de uma fatura"
            valor={fatura}
            min={1_000}
            max={500_000}
            passo={1_000}
            mostrar={reais(fatura, true)}
            onChange={setFatura}
          />
          <Deslizante
            rotulo="Vendas para empresas (B2B)"
            valor={b2b}
            min={0}
            max={1}
            passo={0.05}
            mostrar={pct(b2b, 0)}
            onChange={setB2b}
            dica="Clientes empresas do regime regular, que podem tomar crédito."
          />
          <Deslizante
            rotulo="Compras com crédito"
            valor={compras}
            min={0}
            max={0.8}
            passo={0.01}
            mostrar={pct(compras, 0)}
            onChange={setCompras}
            dica={`${reais(compras * faturamento, true)} por ano, de fornecedores do regime regular.`}
          />

          <Bloco titulo="Ano">
            <Segmentado
              rotulo="Ano da simulação"
              valor={String(ano)}
              opcoes={[
                { valor: '2027', rotulo: '2027 · transição' },
                { valor: '2033', rotulo: '2033 · regime pleno' },
              ]}
              onChange={(v) => setAno(Number(v) as Ano)}
            />
          </Bloco>
          <Bloco titulo="Preço da fatura no híbrido">
            <Segmentado
              rotulo="Preço da fatura no híbrido"
              valor={repasse}
              opcoes={[
                { valor: 'mantido', rotulo: 'Mantido' },
                { valor: 'por_cima', rotulo: 'IBS/CBS por cima' },
              ]}
              onChange={(v) => setRepasse(v as Repasse)}
            />
          </Bloco>

          {/* No celular, o resultado fica longe dos controles: um resumo acompanha a rolagem. */}
          <div
            aria-hidden="true"
            className="sticky bottom-3 z-10 -mx-1 mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-tinta p-3 text-white shadow-[0_18px_40px_-18px_rgba(11,10,46,.7)] lg:hidden"
          >
            <span className="grid gap-0.5">
              <span className="rotulo text-[9.5px] text-sinal">Cliente, por fatura</span>
              <NumeroAnimado valor={dif.custoCliente} formatar={assinado} className="num text-[0.95rem] font-[700]" />
            </span>
            <span className="grid gap-0.5">
              <span className="rotulo text-[9.5px] text-sinal">Sua empresa, por fatura</span>
              <NumeroAnimado valor={dif.receitaEmpresa} formatar={assinado} className="num text-[0.95rem] font-[700]" />
            </span>
          </div>
        </div>

        {/* ── Resultado ── */}
        <div className="min-w-0 p-5 sm:p-7">
          <Veredito r={r} />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Coluna lado={p} titulo="Simples puro" subtitulo="IBS e CBS dentro do DAS" />
            <Coluna lado={h} titulo="Simples híbrido" subtitulo="IBS e CBS pelo regime regular" destaque />
          </div>

          <div className="mt-6 grid gap-3">
            <Comparacao
              titulo="Para o cliente"
              explica="custo líquido da fatura (valor pago − crédito)"
              puro={p.custoLiquidoCliente}
              hibrido={h.custoLiquidoCliente}
              delta={dif.custoCliente}
              menorEhMelhor
            />
            <Comparacao
              titulo="Para a sua empresa"
              explica="o que sobra da fatura depois do imposto líquido"
              puro={p.receitaLiquidaEmpresa}
              hibrido={h.receitaLiquidaEmpresa}
              delta={dif.receitaEmpresa}
            />
          </div>

          <div className="mt-6 grid gap-2">
            <Detalhes titulo="Passo a passo desta conta">
              <ol className="m-0 grid gap-2.5 pl-5 text-[0.93rem] leading-relaxed text-grafite">
                {r.explicacoes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </Detalhes>
            <Detalhes titulo="Premissas e fontes">
              <ul className="m-0 grid list-none gap-3 p-0">
                {r.premissas.map((x) => (
                  <li key={x.id} className="border-t border-papel-2 pt-3 first:border-t-0 first:pt-0">
                    <span
                      className={cn(
                        'rotulo mr-2 inline-block rounded-full px-2 py-0.5 text-[9.5px]',
                        x.natureza === 'lei' && 'bg-marca/10 text-marca',
                        x.natureza === 'premissa' && 'bg-madeira/15 text-madeira-escura',
                        x.natureza === 'estimativa' && 'bg-alerta/10 text-alerta'
                      )}
                    >
                      {x.natureza}
                    </span>
                    <span className="text-[0.93rem] leading-relaxed text-grafite">{x.texto}</span>
                    <span className="mt-1 block font-mono text-[11.5px] text-cinza">{x.fonte}</span>
                  </li>
                ))}
              </ul>
            </Detalhes>
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-papel-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 max-w-[46ch] text-[0.86rem] leading-relaxed text-cinza">
              Simulação ilustrativa, com premissas gerais. O resultado depende do estudo com os dados da sua empresa.
            </p>
            {onDiagnostico && (
              <button type="button" className="btn btn-marca shrink-0" onClick={() => onDiagnostico(r)}>
                {rotuloCta}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Peças ───────────────────────────────────────────────────────────────────────

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-[0.88rem] font-[600] text-grafite">{titulo}</div>
      {children}
    </div>
  );
}

function Segmentado({
  rotulo,
  valor,
  opcoes,
  onChange,
}: {
  rotulo: string;
  valor: string;
  opcoes: { valor: string; rotulo: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="grid grid-cols-2 gap-1 rounded-full border border-papel-2 bg-white p-1">
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(o.valor)}
            className={cn(
              'cursor-pointer rounded-full border-0 px-2 py-2 text-[12.5px] font-[600] leading-tight transition',
              ativo ? 'bg-marca text-white' : 'bg-transparent text-grafite hover:text-marca'
            )}
          >
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}

function Deslizante({
  rotulo,
  valor,
  min,
  max,
  passo,
  mostrar,
  onChange,
  dica,
}: {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  mostrar: string;
  onChange: (v: number) => void;
  dica?: string;
}) {
  const id = useId();
  const cheio = ((valor - min) / (max - min)) * 100;
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.88rem] font-[600] text-grafite">
          {rotulo}
        </label>
        <span className="expandida num whitespace-nowrap text-[0.95rem] font-[700] text-marca">{mostrar}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        aria-valuetext={mostrar}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none',
          '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-marca [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(29,27,154,.4)]',
          '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-marca',
          'focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-marca/25'
        )}
        style={{ background: `linear-gradient(90deg, var(--marca) ${cheio}%, var(--papel-2) ${cheio}%)` }}
      />
      {dica && <p className="hint mb-0 mt-1.5">{dica}</p>}
    </div>
  );
}

function Veredito({ r }: { r: ResultadoSimulacao }) {
  const reduzido = useReducedMotion();
  const tom =
    r.veredito.tipo === 'hibrido' || r.veredito.tipo === 'hibrido_com_preco' ? 'hibrido' : 'puro';
  return (
    <div
      className={cn(
        'planta relative overflow-hidden rounded-2xl px-5 py-5 sm:px-6',
        tom === 'hibrido' ? 'bg-tinta' : 'bg-[#1a1a2b]'
      )}
      aria-live="polite"
    >
      <div className="grade-planta pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <p className="rotulo relative m-0 text-[10.5px] text-sinal">
        Veredito · {r.ano === 2033 ? '2033, regime pleno' : `${r.ano}, transição`}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={r.veredito.tipo + r.veredito.titulo.replace(/[\d.,]/g, '')}
          initial={reduzido ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduzido ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <p className="expandida m-0 mt-2 text-[1.12rem] font-[720] leading-snug tracking-[-0.01em] text-white sm:text-[1.3rem]">
            {r.veredito.titulo}
          </p>
          <p className="m-0 mt-2 text-[0.92rem] leading-relaxed text-cinza-escuro">{r.veredito.texto}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Coluna({ lado, titulo, subtitulo, destaque }: { lado: LadoFatura; titulo: string; subtitulo: string; destaque?: boolean }) {
  const linhas: { rotulo: string; valor: number; sinal?: '−' | '+'; forte?: boolean; credito?: boolean }[] = [
    { rotulo: 'Cliente paga', valor: lado.valorCobrado },
    { rotulo: 'DAS', valor: lado.das },
    ...(lado.regime === 'puro'
      ? [{ rotulo: 'CBS + IBS dentro do DAS', valor: lado.ibsCbsNoDas }]
      : [
          { rotulo: 'IBS/CBS destacados', valor: lado.ibsCbsDestacado },
          { rotulo: 'Crédito das compras', valor: lado.creditoCompras, sinal: '−' as const },
          { rotulo: 'IBS/CBS a recolher', valor: lado.ibsCbsRecolher },
        ]),
    { rotulo: 'Imposto da empresa', valor: lado.impostoEmpresa, forte: true },
    { rotulo: 'Crédito do cliente', valor: lado.creditoCliente, forte: true, credito: true },
    { rotulo: 'Custo líquido do cliente', valor: lado.custoLiquidoCliente, forte: true },
  ];
  return (
    <div className={cn('rounded-2xl border p-4 sm:p-5', destaque ? 'border-marca/30 bg-marca/[0.035]' : 'border-papel-2 bg-white')}>
      <p className={cn('expandida m-0 text-[1.02rem] font-[720]', destaque ? 'text-marca' : 'text-grafite')}>{titulo}</p>
      <p className="rotulo m-0 mt-1 text-[10px] text-cinza">{subtitulo}</p>
      <dl className="m-0 mt-3 grid gap-0">
        {linhas.map((l) => (
          <div key={l.rotulo} className="flex items-baseline justify-between gap-3 border-t border-papel-2 py-2 first:border-t-0">
            <dt className={cn('text-[0.86rem]', l.forte ? 'font-[600] text-grafite' : 'text-cinza')}>{l.rotulo}</dt>
            <dd className={cn('num m-0 text-right text-[0.95rem]', l.forte && 'font-[700]', l.credito && 'text-marca')}>
              {l.sinal && <span aria-hidden="true">{l.sinal} </span>}
              <NumeroAnimado valor={l.valor} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Comparacao({
  titulo,
  explica,
  puro,
  hibrido,
  delta,
  menorEhMelhor,
}: {
  titulo: string;
  explica: string;
  puro: number;
  hibrido: number;
  delta: number;
  menorEhMelhor?: boolean;
}) {
  const reduzido = useReducedMotion();
  const max = Math.max(puro, hibrido, 1);
  const melhor = menorEhMelhor ? delta < 0 : delta > 0;
  const neutro = Math.abs(delta) < 0.005;
  return (
    <div className="rounded-2xl border border-papel-2 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="m-0 text-[0.92rem] font-[650] text-grafite">
          {titulo} <span className="font-[400] text-cinza">· {explica}</span>
        </p>
        <span
          className={cn(
            'num rounded-full px-2.5 py-0.5 text-[0.85rem] font-[700]',
            neutro ? 'bg-papel text-cinza' : melhor ? 'bg-marca text-white' : 'bg-madeira/20 text-madeira-escura'
          )}
        >
          {neutro ? 'igual' : `${delta > 0 ? '+' : '−'} ${reais(Math.abs(delta))}`}
          <span className="sr-only"> no híbrido</span>
        </span>
      </div>
      <div className="mt-3 grid gap-1.5">
        {[
          { rotulo: 'Puro', v: puro, cor: 'bg-[#c9c8dc]' },
          { rotulo: 'Híbrido', v: hibrido, cor: 'bg-marca' },
        ].map((b) => (
          <div key={b.rotulo} className="grid grid-cols-[64px_1fr_auto] items-center gap-3">
            <span className="rotulo text-[10px] text-cinza">{b.rotulo}</span>
            <span className="relative h-2.5 overflow-hidden rounded-full bg-papel">
              <motion.span
                className={cn('absolute inset-y-0 left-0 rounded-full', b.cor)}
                initial={false}
                animate={{ width: `${(b.v / max) * 100}%` }}
                transition={reduzido ? { duration: 0 } : { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </span>
            <NumeroAnimado valor={b.v} className="num text-[0.86rem] text-grafite" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Detalhes({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-papel-2 bg-white px-4 py-3 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.92rem] font-[650] text-grafite">
        {titulo}
        <span aria-hidden="true" className="text-marca transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-1 pt-3">{children}</div>
    </details>
  );
}
