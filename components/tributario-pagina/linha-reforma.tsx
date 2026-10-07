'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Cronograma da Reforma (2026 → 2033) em passos: um ano por vez, com dois
 * medidores — o que sai (PIS/Cofins, ICMS/ISS) e o que entra (CBS, IBS) — que
 * deslizam entre os anos. Toca sozinho quando aparece (pausável); com
 * movimento reduzido, fica parado e troca seco. Feixe de progresso no estilo
 * do Timeline da Aceternity (21st 857).
 *
 * Percentuais = fração da cobrança plena de cada tributo (ICMS/ISS: das
 * alíquotas atuais; IBS: da alíquota de referência). Fontes em cada passo.
 */

type Passo = {
  ano: string;
  titulo: string;
  texto: string;
  fonte: string;
  pisCofins: number;
  icmsIss: number;
  cbs: number;
  ibs: number;
  notaCbs?: string;
  notaIbs?: string;
};

const PASSOS: Passo[] = [
  {
    ano: '2026',
    titulo: 'Ano de teste',
    texto:
      'A nota passa a destacar a CBS (0,9%) e o IBS (0,1%) em caráter de teste, compensáveis com o PIS e a Cofins. É o ano de ajustar sistemas, cadastros, preços e contratos.',
    fonte: 'EC 132/2023 (ADCT, art. 125); LC 214/2025',
    pisCofins: 1,
    icmsIss: 1,
    cbs: 0.1,
    ibs: 0.01,
    notaCbs: 'teste 0,9%',
    notaIbs: 'teste 0,1%',
  },
  {
    ano: '2027',
    titulo: 'A CBS entra em vigor',
    texto:
      'PIS e Cofins deixam de existir e a CBS passa a ser cobrada; o IBS começa em 0,1%. No Simples Nacional, abre-se a opção de recolher IBS e CBS por fora (o “híbrido”).',
    fonte: 'LC 214/2025, arts. 344 e 347; LC 123/2006, art. 13, § 10',
    pisCofins: 0,
    icmsIss: 1,
    cbs: 1,
    ibs: 0.01,
    notaIbs: '0,1%',
  },
  {
    ano: '2028',
    titulo: 'Mesmo desenho de 2027',
    texto: 'CBS integral (com 0,1 ponto a menos, que vai para o IBS de 0,1%). ICMS e ISS seguem cobrados por inteiro.',
    fonte: 'LC 214/2025, arts. 344 e 347',
    pisCofins: 0,
    icmsIss: 1,
    cbs: 1,
    ibs: 0.01,
    notaIbs: '0,1%',
  },
  {
    ano: '2029',
    titulo: 'ICMS e ISS começam a sair',
    texto: 'ICMS e ISS caem para 90% das alíquotas atuais; o IBS sobe para 10% da alíquota de referência.',
    fonte: 'LC 214/2025, arts. 361 a 365; ADCT, arts. 127 a 129',
    pisCofins: 0,
    icmsIss: 0.9,
    cbs: 1,
    ibs: 0.1,
  },
  {
    ano: '2030',
    titulo: 'A troca continua',
    texto: 'ICMS e ISS a 80%; IBS a 20% da referência.',
    fonte: 'LC 214/2025, arts. 361 a 365; ADCT, arts. 127 a 129',
    pisCofins: 0,
    icmsIss: 0.8,
    cbs: 1,
    ibs: 0.2,
  },
  {
    ano: '2031',
    titulo: 'A troca continua',
    texto: 'ICMS e ISS a 70%; IBS a 30% da referência.',
    fonte: 'LC 214/2025, arts. 361 a 365; ADCT, arts. 127 a 129',
    pisCofins: 0,
    icmsIss: 0.7,
    cbs: 1,
    ibs: 0.3,
  },
  {
    ano: '2032',
    titulo: 'Último ano de convivência',
    texto: 'ICMS e ISS a 60%; IBS a 40% da referência.',
    fonte: 'LC 214/2025, arts. 361 a 365; ADCT, arts. 127 a 129',
    pisCofins: 0,
    icmsIss: 0.6,
    cbs: 1,
    ibs: 0.4,
  },
  {
    ano: '2033',
    titulo: 'Regime pleno',
    texto:
      'ICMS e ISS deixam de existir. IBS e CBS passam a valer por inteiro — pela referência estimada hoje, 27,91% somados (estimativa; a alíquota sai de resolução do Senado).',
    fonte: 'ADCT, art. 129; LC 214/2025; Res. CGIBS 14/2026 (estimativa)',
    pisCofins: 0,
    icmsIss: 0,
    cbs: 1,
    ibs: 1,
  },
];

const PCT = { style: 'percent', maximumFractionDigits: 0 } as const;

function Medidor({ rotulo, valor, cor, nota }: { rotulo: string; valor: number; cor: string; nota?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[0.9rem]">
        <span className="text-[#d9d8f5]">{rotulo}</span>
        <span className="rotulo num text-[11px] text-white">
          {nota ?? (valor === 0 ? 'extinto' : <NumberFlow value={valor} locales="pt-BR" format={PCT} />)}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: cor }}
          initial={false}
          animate={{ width: `${Math.max(valor, 0.012) * 100}%`, opacity: valor === 0 ? 0.25 : 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}

export function LinhaReforma() {
  const reduzir = useReducedMotion();
  const [i, setI] = useState(0);
  const [tocando, setTocando] = useState(false);
  const pausadoPelaPessoa = useRef(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el || reduzir) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!pausadoPelaPessoa.current) setTocando(e.isIntersecting);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduzir]);

  useEffect(() => {
    if (!tocando) return;
    const t = setInterval(() => setI((v) => (v + 1) % PASSOS.length), 3600);
    return () => clearInterval(t);
  }, [tocando]);

  const p = PASSOS[i];
  const escolher = (k: number) => {
    setI(k);
    pausadoPelaPessoa.current = true;
    setTocando(false);
  };

  return (
    <div ref={caixa} className="mt-14">
      <div className="relative">
        <div aria-hidden="true" className="absolute left-0 right-0 top-[22px] h-px bg-sinal/20" />
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-[21px] h-[3px] rounded-full bg-[linear-gradient(90deg,var(--sinal),#c9c7ff,var(--madeira))]"
          initial={false}
          animate={{ width: `${(i / (PASSOS.length - 1)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
        <ol role="tablist" aria-label="Anos da transição" className="relative m-0 grid list-none grid-cols-4 gap-y-4 p-0 sm:grid-cols-8">
          {PASSOS.map((s, k) => (
            <li key={s.ano} role="presentation" className="flex justify-center">
              <button
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-controls="passo-reforma"
                onClick={() => escolher(k)}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    'grid h-11 w-11 place-items-center rounded-full border text-[11px] font-[700] transition-all duration-300',
                    k === i
                      ? 'scale-110 border-sinal bg-sinal text-tinta shadow-[0_0_0_6px_rgb(142_139_255/0.18)]'
                      : k < i
                        ? 'border-sinal/60 bg-tinta-2 text-white'
                        : 'border-sinal/25 bg-tinta text-cinza-escuro group-hover:border-sinal/70',
                  )}
                >
                  {s.ano.slice(2)}
                </span>
                <span className={cn('rotulo num text-[10px]', k === i ? 'text-white' : 'text-cinza-escuro')}>{s.ano}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div id="passo-reforma" role="tabpanel" aria-live="polite" className="vidro-escuro mt-10 grid gap-8 rounded-[28px] p-6 sm:p-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.ano}
              initial={reduzir ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduzir ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.35 }}
            >
              <p className="expandida num m-0 text-[clamp(3rem,8vw,5.5rem)] font-[850] leading-none tracking-[-0.05em] text-white">{p.ano}</p>
              <h3 className="semi m-0 mt-3 text-[1.4rem] font-[720] text-sinal">{p.titulo}</h3>
              <p className="m-0 mt-3 max-w-[52ch] text-[1.02rem] leading-relaxed text-[#d4d3f3]">{p.texto}</p>
              <p className="rotulo m-0 mt-5 text-[10px] text-cinza-escuro">{p.fonte}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="grid content-center gap-6">
          <div>
            <p className="rotulo m-0 mb-3 text-[10px] text-cinza-escuro">Saem</p>
            <div className="grid gap-4">
              <Medidor rotulo="PIS e Cofins" valor={p.pisCofins} cor="linear-gradient(90deg,#5d5d78,#a3a2c9)" />
              <Medidor rotulo="ICMS e ISS" valor={p.icmsIss} cor="linear-gradient(90deg,#5d5d78,#a3a2c9)" />
            </div>
          </div>
          <div>
            <p className="rotulo m-0 mb-3 text-[10px] text-cinza-escuro">Entram</p>
            <div className="grid gap-4">
              <Medidor rotulo="CBS (federal)" valor={p.cbs} cor="linear-gradient(90deg,#5b58e6,#8e8bff)" nota={p.notaCbs} />
              <Medidor rotulo="IBS (estados e municípios)" valor={p.ibs} cor="linear-gradient(90deg,#8e8bff,#d39a5b)" nota={p.notaIbs} />
            </div>
          </div>
          {!reduzir && (
            <button
              type="button"
              onClick={() => {
                pausadoPelaPessoa.current = tocando;
                setTocando(!tocando);
              }}
              className="rotulo inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white transition hover:border-sinal"
            >
              {tocando ? <Pause className="h-3 w-3" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
              {tocando ? 'Pausar' : 'Tocar a transição'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
