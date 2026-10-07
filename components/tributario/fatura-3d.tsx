'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { cn } from '@/lib/utils';
import { CENARIO_DEMO, pct, reais, simular, type EntradaSimulacao, type Regime } from '@/lib/tributario/simulador';

/**
 * A fatura em 3D (CSS, preserve-3d): um cartão com espessura que inclina com o mouse,
 * gira quando arrastado e se separa em duas camadas — o custo líquido do cliente e o
 * IBS/CBS que ele credita. Separa ao rolar a página (quando o cartão chega ao meio
 * da tela) ou pelo botão. Com movimento reduzido: sem inclinação, sem giro, troca seca.
 */

export interface Fatura3DProps {
  className?: string;
  /** Padrão: o cenário de demonstração (fatura de R$ 100 mil, 2027). */
  entrada?: EntradaSimulacao;
  /** Regime mostrado de início. Padrão: híbrido. */
  regimeInicial?: Regime;
  /** Separa as camadas conforme a rolagem. Padrão: true. */
  separarAoRolar?: boolean;
}

const ESPESSURA = 6; // folhas da borda do papel

export function Fatura3D({ className, entrada = CENARIO_DEMO, regimeInicial = 'hibrido', separarAoRolar = true }: Fatura3DProps) {
  const r = useMemo(() => simular(entrada), [entrada]);
  const [regime, setRegime] = useState<Regime>(regimeInicial);
  const [manual, setManual] = useState<boolean | null>(null);
  const reduzido = useReducedMotion();
  const lado = r.fatura[regime];
  const fracao = lado.creditoCliente / lado.valorCobrado;

  const caixa = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: caixa, offset: ['start end', 'center center'] });
  const pelaRolagem = useTransform(scrollYProgress, [0.55, 1], [0, 1], { clamp: true });
  const alvoManual = useMotionValue(manual ? 1 : 0);
  useEffect(() => {
    alvoManual.set(manual ? 1 : 0);
  }, [manual, alvoManual]);
  const usarRolagem = separarAoRolar && manual === null && !reduzido;
  const modo = useMotionValue(usarRolagem ? 1 : 0);
  useEffect(() => {
    modo.set(usarRolagem ? 1 : 0);
  }, [usarRolagem, modo]);
  const bruto = useTransform([pelaRolagem, alvoManual, modo], ([a, b, m]: number[]) => (m ? a : b));
  const [aberto, setAberto] = useState(false);
  useMotionValueEvent(bruto, 'change', (v) => setAberto(v > 0.5));
  const separacao = useSpring(bruto, reduzido ? { duration: 0 } : { stiffness: 120, damping: 22, mass: 0.6 });

  // Inclinação (mouse) e giro (arrasto).
  // Em repouso o cartão fica levemente girado, para a espessura e as camadas aparecerem.
  const REPOUSO = { rx: 7, ry: -12 };
  const rx = useMotionValue(REPOUSO.rx);
  const ry = useMotionValue(REPOUSO.ry);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const brilho = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)`;
  const arrasto = useRef<{ x: number; base: number } | null>(null);

  const mover = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduzido) return;
    const el = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - el.left) / el.width;
    const y = (e.clientY - el.top) / el.height;
    gx.set(x * 100);
    gy.set(y * 100);
    if (arrasto.current) {
      ry.set(Math.max(-55, Math.min(55, arrasto.current.base + (e.clientX - arrasto.current.x) * 0.4)));
      return;
    }
    rx.set(REPOUSO.rx * 0.4 + (0.5 - y) * 16);
    ry.set(REPOUSO.ry * 0.4 + (x - 0.5) * 22);
  };
  const soltar = () => {
    arrasto.current = null;
  };
  const sair = () => {
    arrasto.current = null;
    rx.set(REPOUSO.rx);
    ry.set(REPOUSO.ry);
    gx.set(50);
    gy.set(30);
  };

  // Camadas: a de cima (custo líquido) sobe e vem para a frente; a de baixo (IBS/CBS) desce.
  const topoY = useTransform(separacao, [0, 1], ['0%', '-14%']);
  const topoZ = useTransform(separacao, [0, 1], [0, 70]);
  const topoRx = useTransform(separacao, [0, 1], [0, 7]);
  const baseY = useTransform(separacao, [0, 1], ['0%', '20%']);
  const baseZ = useTransform(separacao, [0, 1], [-ESPESSURA * 1.2, -40]);
  const rotulosSeparados = useTransform(separacao, [0.35, 0.8], [0, 1]);
  const rotuloJunto = useTransform(separacao, [0, 0.35], [1, 0]);
  const sombra = useTransform(separacao, [0, 1], [0.45, 0.25]);
  // Sombra no "chão", fora do cartão: filter no pai achataria o preserve-3d.
  const sombraChao = useMotionTemplate`radial-gradient(closest-side, rgba(11,10,46,${sombra}), rgba(11,10,46,0))`;

  const separado = manual ?? aberto;

  return (
    <div className={cn('w-full', className)} role="group" aria-label="A fatura em camadas">
      <div
        ref={caixa}
        className="relative mx-auto flex h-[580px] w-full max-w-[520px] cursor-grab touch-pan-y select-none items-center justify-center active:cursor-grabbing sm:h-[640px]"
        style={{ perspective: 1400 }}
        onPointerMove={mover}
        onPointerDown={(e) => {
          if (reduzido) return;
          arrasto.current = { x: e.clientX, base: ry.get() };
        }}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={sair}
        aria-hidden="true"
      >
        <motion.div
          className="pointer-events-none absolute bottom-[4%] left-1/2 h-[70px] w-[340px] -translate-x-1/2 blur-md"
          style={{ background: sombraChao }}
        />
        <motion.div
          className="relative h-[400px] w-[300px] sm:h-[440px] sm:w-[330px]"
          style={{
            transformStyle: 'preserve-3d',
            rotateX: reduzido ? 8 : srx,
            rotateY: reduzido ? -14 : sry,
          }}
        >
          {/* Camada de baixo: IBS/CBS que o cliente credita */}
          <motion.div
            className="absolute inset-0 rounded-[22px] border border-sinal/40 p-6 text-white"
            style={{
              transformStyle: 'preserve-3d',
              y: baseY,
              z: baseZ,
              background: 'linear-gradient(160deg, #2b28b8 0%, #1d1b9a 55%, #15146f 100%)',
            }}
          >
            <div className="flex h-full flex-col justify-end">
              <motion.div style={{ opacity: rotulosSeparados }}>
                <p className="rotulo m-0 text-[10.5px] text-sinal">
                  {regime === 'hibrido' ? 'IBS/CBS destacados' : 'CBS + IBS dentro do DAS'}
                </p>
                <p className="expandida num m-0 mt-1 text-[1.9rem] font-[760] leading-none tracking-[-0.02em]">
                  {reais(lado.creditoCliente)}
                </p>
                <p className="m-0 mt-2 text-[0.85rem] leading-snug text-[#d9d8f5]">
                  crédito do cliente · {pct(fracao, 1)} da fatura
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-sinal"
                    animate={{ width: `${Math.min(fracao / 0.3, 1) * 100}%` }}
                    transition={{ duration: reduzido ? 0 : 0.5 }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Espessura do papel */}
          {Array.from({ length: ESPESSURA }, (_, i) => (
            <Folha key={i} y={topoY} z={topoZ} rotateX={topoRx} recuo={-(i + 1) * 1.1} ultima={i === ESPESSURA - 1} />
          ))}

          {/* Camada de cima: a nota e o custo líquido */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[22px] border border-white/60 bg-[#f6f6fa] p-6 text-grafite"
            style={{ y: topoY, z: topoZ, rotateX: topoRx, transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="expandida m-0 text-[1.45rem] font-[800] leading-none text-marca">NFS-e</p>
                <p className="rotulo m-0 mt-1.5 text-[9.5px] text-cinza">Nota fiscal de serviço</p>
              </div>
              <span className="rotulo rounded-full bg-marca/10 px-2 py-1 text-[9.5px] text-marca">
                {regime === 'hibrido' ? 'Simples híbrido' : 'Simples puro'}
              </span>
            </div>
            <div className="my-4 h-px bg-papel-2" />
            <div className="grid gap-2.5 text-[0.83rem]">
              <Linha rotulo="Prestador" valor="Sua Empresa Serviços Ltda." />
              <Linha rotulo="Tomador" valor="Cliente Indústria S.A." />
              <Linha rotulo="Serviço" valor="Consultoria de gestão" />
            </div>
            <div className="my-4 h-px bg-papel-2" />
            <p className="rotulo m-0 text-[10px] text-cinza">Valor da fatura</p>
            <p className="expandida num m-0 mt-1 text-[1.75rem] font-[760] leading-none tracking-[-0.02em]">
              {reais(lado.valorCobrado)}
            </p>
            <div className="relative mt-5 h-[64px]">
              <motion.div className="absolute inset-0" style={{ opacity: rotuloJunto }}>
                <p className="m-0 text-[0.82rem] leading-snug text-cinza">
                  Separe a fatura para ver quanto dela volta ao cliente como crédito.
                </p>
              </motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: rotulosSeparados }}>
                <p className="rotulo m-0 text-[10px] text-marca">Custo líquido do cliente</p>
                <p className="expandida num m-0 mt-1 text-[1.35rem] font-[740] leading-none text-marca">
                  {reais(lado.custoLiquidoCliente)}
                </p>
              </motion.div>
            </div>
            {/* brilho */}
            {!reduzido && (
              <motion.div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: brilho }}
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      <p className="sr-only">
        No {regime === 'hibrido' ? 'Simples híbrido' : 'Simples puro'}, a fatura de {reais(lado.valorCobrado)} dá ao cliente{' '}
        {reais(lado.creditoCliente)} de crédito de IBS e CBS; o custo líquido dele fica em {reais(lado.custoLiquidoCliente)}.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <div role="radiogroup" aria-label="Regime" className="inline-grid grid-cols-2 gap-1 rounded-full border border-papel-2 bg-white p-1">
          {(['puro', 'hibrido'] as const).map((g) => (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={regime === g}
              onClick={() => setRegime(g)}
              className={cn(
                'cursor-pointer rounded-full border-0 px-4 py-2 text-[12.5px] font-[600] transition',
                regime === g ? 'bg-marca text-white' : 'bg-transparent text-grafite hover:text-marca'
              )}
            >
              {g === 'puro' ? 'Simples puro' : 'Simples híbrido'}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={separado}
          onClick={() => setManual(!separado)}
          className="btn btn-contorno btn-sm"
        >
          {separado ? 'Juntar as camadas' : 'Separar a fatura'}
        </button>
      </div>
    </div>
  );
}

/** Uma folha da borda do papel: acompanha a camada de cima com um recuo fixo em z. */
function Folha(props: {
  y: MotionValue<string>;
  z: MotionValue<number>;
  rotateX: MotionValue<number>;
  recuo: number;
  ultima: boolean;
}) {
  const z = useTransform(props.z, (v) => v + props.recuo);
  return (
    <motion.div
      className="absolute inset-0 rounded-[22px]"
      style={{ y: props.y, z, rotateX: props.rotateX, background: props.ultima ? '#b9b8cf' : '#d9d8e6' }}
    />
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="grid grid-cols-[76px_1fr] items-baseline gap-2">
      <span className="rotulo text-[9.5px] text-cinza">{rotulo}</span>
      <span className="font-[600] leading-tight">{valor}</span>
    </div>
  );
}
