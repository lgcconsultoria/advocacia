'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { reais, simularDemo, type Ano, type LadoFatura } from '@/lib/tributario/simulador';
import { cn } from '@/lib/utils';

/**
 * "Quem ganha o quê": as duas notas da fatura de R$ 100 mil, impressas como
 * cupom térmico — no espírito do 21st `@n1m4mz/receipt-pricing` (id 26309):
 * razão em mono com pontilhado e reimpressão animada ao trocar o ano.
 * Números do simulador (lib/tributario), cenário de demonstração.
 */

const BRL = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 } as const;

function Linha({ rotulo, valor, forte, destaque }: { rotulo: string; valor: number | null; forte?: boolean; destaque?: 'bom' | 'ruim' }) {
  return (
    <div className={cn('flex items-baseline gap-2 py-1', forte && 'font-[700]')}>
      <span className="shrink-0">{rotulo}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-current opacity-30" />
      <span
        className={cn(
          'num shrink-0 text-right',
          destaque === 'bom' && 'text-[#1f7a4d]',
          destaque === 'ruim' && 'text-[var(--perigo)]',
        )}
      >
        {valor === null ? '—' : reais(valor)}
      </span>
    </div>
  );
}

function Cupom({ titulo, sub, lado, ano, chave }: { titulo: string; sub: string; lado: LadoFatura; ano: Ano; chave: string }) {
  const reduzir = useReducedMotion();
  return (
    <div className="relative">
      {/* boca da impressora */}
      <div aria-hidden="true" className="relative z-10 mx-auto h-3 w-[92%] rounded-full bg-tinta shadow-[0_6px_14px_-6px_rgb(0_0_0/0.6)]" />
      <div className="-mt-1.5 overflow-hidden px-[5%] pb-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={chave}
            initial={reduzir ? { opacity: 0 } : { y: '-100%' }}
            animate={reduzir ? { opacity: 1 } : { y: 0 }}
            exit={reduzir ? { opacity: 0 } : { y: '-100%' }}
            transition={{ duration: reduzir ? 0.15 : 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative bg-[#fbfbfd] px-5 pb-8 pt-6 font-mono text-[12.5px] leading-[1.5] text-grafite shadow-[0_30px_60px_-30px_rgb(11_10_46/0.45)]sm:px-6"
          >
            <p className="m-0 text-center text-[11px] tracking-[0.2em]">NOTA DE SERVIÇO · {ano}</p>
            <p className="m-0 mt-1 text-center text-[15px] font-[700] tracking-[0.06em]">{titulo}</p>
            <p className="m-0 text-center text-[11px] text-cinza">{sub}</p>
            <div className="my-3 border-t border-dashed border-grafite/30" />
            <Linha rotulo="Valor da fatura" valor={lado.valorCobrado} />
            <Linha rotulo="DAS" valor={lado.das} />
            {lado.regime === 'puro' ? (
              <Linha rotulo="IBS/CBS dentro do DAS" valor={lado.ibsCbsNoDas} />
            ) : (
              <>
                <Linha rotulo="IBS/CBS destacados" valor={lado.ibsCbsDestacado} />
                <Linha rotulo="(−) crédito das compras" valor={lado.creditoCompras} />
                <Linha rotulo="IBS/CBS a recolher" valor={lado.ibsCbsRecolher} />
              </>
            )}
            <div className="my-3 border-t border-dashed border-grafite/30" />
            <Linha rotulo="IMPOSTO DA EMPRESA" valor={lado.impostoEmpresa} forte />
            <Linha rotulo="Crédito do cliente" valor={lado.creditoCliente} />
            <Linha rotulo="CUSTO DO CLIENTE" valor={lado.custoLiquidoCliente} forte />
            <div className="my-3 border-t border-dashed border-grafite/30" />
            <p className="m-0 text-center text-[10.5px] tracking-[0.12em] text-cinza">SIMULAÇÃO ILUSTRATIVA</p>
            <div aria-hidden="true" className="mx-auto mt-3 h-8 w-[70%] bg-[repeating-linear-gradient(90deg,#1a1a2b_0_2px,transparent_2px_4px,#1a1a2b_4px_5px,transparent_5px_8px)] opacity-70" />
            <div aria-hidden="true" className="absolute inset-x-0 -bottom-[7px] h-2 bg-[radial-gradient(circle_at_7px_8px,transparent_6px,#fbfbfd_6.5px)] bg-[length:14px_8px] bg-repeat-x" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Recibos() {
  const [ano, setAno] = useState<Ano>(2027);
  const r = useMemo(() => simularDemo(ano), [ano]);
  const { puro, hibrido, diferencas } = r.fatura;

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="radiogroup" aria-label="Ano da simulação" className="inline-flex rounded-full border border-papel-2 bg-white p-1">
          {([2027, 2033] as Ano[]).map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={ano === a}
              onClick={() => setAno(a)}
              className={cn(
                'rounded-full px-4 py-2 text-[0.86rem] font-[650] transition-colors',
                ano === a ? 'bg-tinta text-white' : 'text-cinza hover:text-marca',
              )}
            >
              {a === 2027 ? '2027 · transição' : '2033 · regime pleno'}
            </button>
          ))}
        </div>
        <p className="m-0 max-w-[52ch] text-[0.88rem] text-cinza">
          Serviço B2B no Simples (Anexo III), faturamento de R$ 1,8 milhão, compras com crédito de 20% da receita,
          preço mantido.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.05fr)]">
        <Cupom titulo="SIMPLES PURO" sub="IBS e CBS dentro do DAS" lado={puro} ano={ano} chave={`p${ano}`} />
        <Cupom titulo="SIMPLES HÍBRIDO" sub="IBS e CBS por fora, destacados" lado={hibrido} ano={ano} chave={`h${ano}`} />

        <div className="grid gap-4" aria-live="polite">
          <div className="rounded-[24px] border border-[#bfe3cf] bg-[#effaf4] p-6">
            <p className="rotulo m-0 text-[10px] text-[#1f7a4d]">Quem ganha · o cliente empresa</p>
            <p className="expandida num m-0 mt-2 text-[2rem] font-[800] tracking-[-0.03em] text-[#14593a]">
              <NumberFlow value={diferencas.custoCliente} locales="pt-BR" format={BRL} />
            </p>
            <p className="m-0 mt-1 text-[0.92rem] leading-snug text-[#2c5a44]">
              no custo líquido de cada fatura, porque ele credita todo o IBS/CBS destacado.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ecc9c4] bg-[#fcf1ef] p-6">
            <p className="rotulo m-0 text-[10px] text-[var(--perigo)]">Quem paga · a sua empresa, se o preço não mudar</p>
            <p className="expandida num m-0 mt-2 text-[2rem] font-[800] tracking-[-0.03em] text-[#8c2f26]">
              <NumberFlow value={diferencas.impostoEmpresa} locales="pt-BR" format={BRL} prefix={diferencas.impostoEmpresa > 0 ? '+' : ''} />
            </p>
            <p className="m-0 mt-1 text-[0.92rem] leading-snug text-[#7a3a33]">de imposto por fatura no híbrido.</p>
          </div>
          <div className="planta rounded-[24px] p-6">
            <p className="rotulo m-0 text-[10px] text-sinal">O espaço para renegociar</p>
            <p className="expandida num m-0 mt-2 text-[2rem] font-[800] tracking-[-0.03em] text-madeira">
              <NumberFlow value={diferencas.ganhoCadeia} locales="pt-BR" format={BRL} />
            </p>
            <p className="m-0 mt-1 text-[0.92rem] leading-snug text-cinza-escuro">
              de imposto que sai da cadeia por fatura. Sem renegociar o preço, o Simples puro segue melhor para o
              caixa da empresa; o estudo mostra quando e quanto ajustar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
