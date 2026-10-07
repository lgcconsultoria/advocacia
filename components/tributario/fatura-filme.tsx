'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  CENARIO_DEMO,
  PRAZOS_OPCAO,
  pct,
  reais,
  simular,
  simularAnos,
  type EntradaSimulacao,
  type ResultadoSimulacao,
} from '@/lib/tributario/simulador';
import { aparece, conta, fase, lim, mistura, suave2, vidaDaCena } from './linha-do-tempo';

/**
 * "A fatura de R$ 100 mil": filme roteirizado em código (≈ 44 s) que conta, com os
 * números do simulador, a diferença entre o Simples puro e o Simples híbrido.
 *
 * O palco tem tamanho fixo (1600 × 900 na horizontal, 900 × 1600 na vertical) e é
 * escalado para caber no espaço; cada quadro é função pura do tempo. Toca sozinho
 * quando entra na tela; respeita prefers-reduced-motion (quadros-chave, sem movimento).
 * Com `tempo`, o filme vira controlado (exportação para MP4).
 */

export interface FaturaFilmeProps {
  className?: string;
  /** Entrada da simulação. Padrão: o cenário de demonstração (fatura de R$ 100 mil). */
  entrada?: EntradaSimulacao;
  /** 'auto' escolhe pela proporção do espaço (vertical abaixo de 640 px de largura). */
  formato?: 'auto' | 'paisagem' | 'retrato';
  /** Tempo controlado, em ms (exportação). Desliga relógio e controles automáticos. */
  tempo?: number;
  /** Esconde os controles abaixo do palco (exportação). */
  semControles?: boolean;
  /** Começa a tocar quando entra na tela. Padrão: true. */
  autoPlay?: boolean;
  /** Borda e cantos arredondados no palco. Padrão: true (false na exportação). */
  moldura?: boolean;
}

export const CAPITULOS = [
  { id: 'fatura', titulo: 'A fatura', ini: 0, dur: 7000 },
  { id: 'puro', titulo: 'Simples puro', ini: 7000, dur: 8500 },
  { id: 'hibrido', titulo: 'Simples híbrido', ini: 15500, dur: 10000 },
  { id: 'conta', titulo: 'A conta', ini: 25500, dur: 9000 },
  { id: 'estudo', titulo: 'O estudo tributário', ini: 34500, dur: 10000 },
] as const;

export const DURACAO_FILME = 44500;

const PALCO = { paisagem: { w: 1600, h: 900 }, retrato: { w: 900, h: 1600 } } as const;

type Formato = keyof typeof PALCO;

interface Dados {
  r: ResultadoSimulacao;
  serie: ResultadoSimulacao[];
}

/** "R$ 5,7 mil". */
function mil(v: number) {
  const x = Math.abs(v) / 1000;
  return `R$\u00a0${x.toLocaleString('pt-BR', { maximumFractionDigits: x >= 100 ? 0 : 1 })}\u00a0mil`;
}

function capitulos(d: Dados) {
  const f = d.r.fatura;
  const dif = f.diferencas;
  const conta4 =
    dif.custoCliente < 0
      ? dif.impostoEmpresa > 0
        ? `O cliente paga ${mil(-dif.custoCliente)} a menos. Com o preço mantido, a empresa recolhe ${mil(dif.impostoEmpresa)} a mais. A diferença, ${mil(dif.ganhoCadeia)}, é espaço para negociar preço.`
        : `O cliente paga ${mil(-dif.custoCliente)} a menos — e a empresa também recolhe ${mil(-dif.impostoEmpresa)} a menos, graças aos créditos das compras.`
      : `Neste cenário, o híbrido não reduz o custo do cliente. O Simples puro segue melhor.`;
  return [
    {
      titulo: `Uma fatura de ${mil(f.puro.valorCobrado)}`,
      texto: 'Uma empresa de serviços do Simples emite a nota para um cliente do regime regular.',
    },
    {
      titulo: 'No Simples puro',
      texto: `O IBS e a CBS vão dentro do DAS. O cliente só credita o que o DAS cobrou deles: ${mil(f.puro.creditoCliente)}.`,
    },
    {
      titulo: 'No Simples híbrido',
      texto: 'O IBS e a CBS saem do DAS e vêm destacados na nota. No pagamento, o split payment separa o imposto. O cliente credita tudo; a empresa credita as compras.',
    },
    { titulo: 'A conta, dos dois lados', texto: conta4 },
    {
      titulo: 'O estudo tributário',
      texto: 'Cada empresa tem a sua conta. O escritório faz o diagnóstico, simula 2027 a 2033, decide com você no prazo e ajusta os contratos.',
    },
  ];
}

// ── Componente ──────────────────────────────────────────────────────────────────

export function FaturaFilme({
  className,
  entrada = CENARIO_DEMO,
  formato = 'auto',
  tempo,
  semControles = false,
  autoPlay = true,
  moldura = true,
}: FaturaFilmeProps) {
  const dados = useMemo<Dados>(
    () => ({ r: simular(entrada), serie: simularAnos(entrada) }),
    [entrada]
  );
  const textos = useMemo(() => capitulos(dados), [dados]);
  const controlado = tempo !== undefined;

  const caixa = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);
  const [reduzido, setReduzido] = useState(false);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [tocando, setTocando] = useState(false);
  const pausadoPeloLeitor = useRef(false);

  // Medida do espaço (escala do palco e formato automático).
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setLargura(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const muda = () => setReduzido(mq.matches);
    muda();
    mq.addEventListener('change', muda);
    return () => mq.removeEventListener('change', muda);
  }, []);

  // Com movimento reduzido, o filme abre no quadro-chave do primeiro capítulo.
  useEffect(() => {
    if (reduzido && !controlado) irPara(quadroChave(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzido, controlado]);

  // Toca quando entra na tela.
  useEffect(() => {
    const el = caixa.current;
    if (!el || controlado || !autoPlay || reduzido) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (pausadoPeloLeitor.current) return;
        if (tRef.current >= DURACAO_FILME) return;
        setTocando(en.isIntersecting);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controlado, autoPlay, reduzido]);

  // Relógio.
  useEffect(() => {
    if (!tocando || controlado) return;
    if (reduzido) {
      // Sem movimento: avança de quadro-chave em quadro-chave.
      const id = window.setInterval(() => {
        const atual = capituloDe(tRef.current);
        if (atual >= CAPITULOS.length - 1) {
          setTocando(false);
          return;
        }
        irPara(quadroChave(atual + 1));
      }, 7000);
      return () => window.clearInterval(id);
    }
    let raf = 0;
    let antes = performance.now();
    const passo = (agora: number) => {
      tRef.current = Math.min(DURACAO_FILME, tRef.current + (agora - antes));
      antes = agora;
      setT(tRef.current);
      if (tRef.current >= DURACAO_FILME) {
        setTocando(false);
        return;
      }
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [tocando, controlado, reduzido]);

  const irPara = useCallback((ms: number) => {
    tRef.current = Math.max(0, Math.min(DURACAO_FILME, ms));
    setT(tRef.current);
  }, []);

  const agora = controlado ? Math.max(0, Math.min(DURACAO_FILME, tempo)) : t;
  const cap = capituloDe(agora);
  const fmt: Formato = formato === 'auto' ? (largura > 0 && largura < 640 ? 'retrato' : 'paisagem') : formato;
  const palco = PALCO[fmt];
  const escala = largura > 0 ? largura / palco.w : 0;
  const terminou = agora >= DURACAO_FILME;

  const alternar = () => {
    if (terminou) {
      irPara(reduzido ? quadroChave(0) : 0);
      pausadoPeloLeitor.current = false;
      setTocando(true);
      return;
    }
    pausadoPeloLeitor.current = tocando;
    setTocando(!tocando);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={caixa}
        className={cn('relative w-full overflow-hidden bg-tinta', moldura && 'rounded-[22px] border border-sinal/20')}
        style={{ aspectRatio: `${palco.w} / ${palco.h}` }}
        role="img"
        aria-label={`Filme: a fatura de ${reais(dados.r.fatura.puro.valorCobrado, true)} no Simples puro e no Simples híbrido. Capítulo ${cap + 1} de ${CAPITULOS.length}: ${textos[cap].titulo}. ${textos[cap].texto}`}
      >
        {escala > 0 && (
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: palco.w, height: palco.h, transform: `scale(${escala})` }}
          >
            <Palco t={agora} formato={fmt} dados={dados} textos={textos} />
          </div>
        )}
      </div>

      {!semControles && (
        <Controles
          t={agora}
          cap={cap}
          tocando={tocando}
          terminou={terminou}
          reduzido={reduzido}
          alternar={alternar}
          ir={(ms) => {
            pausadoPeloLeitor.current = !tocando;
            irPara(ms);
          }}
        />
      )}
    </div>
  );
}

function capituloDe(t: number) {
  for (let i = CAPITULOS.length - 1; i >= 0; i--) if (t >= CAPITULOS[i].ini) return i;
  return 0;
}

/** Quadro em que o capítulo está completo (usado com movimento reduzido). */
function quadroChave(i: number) {
  const c = CAPITULOS[i];
  return i === CAPITULOS.length - 1 ? c.ini + c.dur - 4400 : c.ini + c.dur - 700;
}

const mmss = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function Controles(props: {
  t: number;
  cap: number;
  tocando: boolean;
  terminou: boolean;
  reduzido: boolean;
  alternar: () => void;
  ir: (ms: number) => void;
}) {
  const { t, cap, tocando, terminou, reduzido, alternar, ir } = props;
  const barra = useRef<HTMLDivElement>(null);
  const procurar = (x: number) => {
    const el = barra.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ms = lim((x - r.left) / r.width) * DURACAO_FILME;
    ir(reduzido ? quadroChave(capituloDe(ms)) : ms);
  };
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={alternar}
          aria-label={terminou ? 'Ver o filme de novo' : tocando ? 'Pausar o filme' : 'Tocar o filme'}
          className="rotulo inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/[0.05] px-3.5 py-2 text-[10.5px] text-white transition hover:border-sinal"
        >
          <span aria-hidden="true">{terminou ? '↺' : tocando ? '❚❚' : '▶'}</span>
          {terminou ? 'Ver de novo' : tocando ? 'Pausar' : 'Tocar'}
        </button>
        <div
          ref={barra}
          role="slider"
          tabIndex={0}
          aria-label="Posição do filme"
          aria-valuemin={0}
          aria-valuemax={Math.round(DURACAO_FILME / 1000)}
          aria-valuenow={Math.round(t / 1000)}
          aria-valuetext={`${mmss(t)} de ${mmss(DURACAO_FILME)}`}
          onPointerDown={(e) => procurar(e.clientX)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') ir(reduzido ? quadroChave(Math.min(cap + 1, CAPITULOS.length - 1)) : t + 5000);
            if (e.key === 'ArrowLeft') ir(reduzido ? quadroChave(Math.max(cap - 1, 0)) : t - 5000);
          }}
          className="group relative h-6 flex-1 cursor-pointer"
        >
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/15" />
          {CAPITULOS.slice(1).map((c) => (
            <span
              key={c.id}
              className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-white/35"
              style={{ left: `${(c.ini / DURACAO_FILME) * 100}%` }}
            />
          ))}
          <span
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-sinal"
            style={{ width: `${(t / DURACAO_FILME) * 100}%` }}
          />
        </div>
        <span className="rotulo num shrink-0 text-[10.5px] text-white/60">
          {mmss(t)} / {mmss(DURACAO_FILME)}
        </span>
      </div>
      <ol className="m-0 mt-3 grid list-none grid-cols-2 gap-1.5 p-0 sm:grid-cols-5">
        {CAPITULOS.map((c, i) => {
          const p = lim((t - c.ini) / c.dur);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => ir(reduzido ? quadroChave(i) : c.ini)}
                aria-current={i === cap ? 'step' : undefined}
                className={cn(
                  'relative w-full cursor-pointer overflow-hidden rounded-lg border-0 px-3 py-2.5 text-left transition',
                  i === cap ? 'bg-white/[0.08]' : 'bg-white/[0.02] hover:bg-white/[0.05]'
                )}
              >
                <span className={cn('rotulo num block text-[10px]', i === cap ? 'text-sinal' : 'text-cinza-escuro')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cn('expandida block text-[13px] font-[620] leading-tight', i === cap ? 'text-white' : 'text-white/60')}>
                  {c.titulo}
                </span>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] bg-sinal/80" style={{ width: `${p * 100}%` }} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Palco ───────────────────────────────────────────────────────────────────────

const COR = {
  tinta: '#0b0a2e',
  tinta2: '#14134a',
  marca: '#1d1b9a',
  sinal: '#8e8bff',
  papel: '#f1f1f6',
  madeira: '#d39a5b',
  cinzaEscuro: '#a3a2c9',
};

interface CenaProps {
  t: number;
  dur: number;
  v: boolean;
  d: Dados;
}

function Palco({ t, formato, dados, textos }: { t: number; formato: Formato; dados: Dados; textos: { titulo: string; texto: string }[] }) {
  const v = formato === 'retrato';
  const { w, h } = PALCO[formato];
  const cap = capituloDe(t);
  const c = CAPITULOS[cap];
  const local = t - c.ini;
  const vida = vidaDaCena(local, c.dur, cap === 0 ? 1 : 450, cap === CAPITULOS.length - 1 ? 1 : 450);
  const cenas = [CenaFatura, CenaPuro, CenaHibrido, CenaConta, CenaEstudo];
  const Cena = cenas[cap];
  const legenda = textos[cap];
  const pad = v ? 64 : 72;

  return (
    <div
      className="relative overflow-hidden text-white"
      style={{
        width: w,
        height: h,
        background: `radial-gradient(120% 90% at 75% 8%, #24228a 0%, #100f3d 52%, ${COR.tinta} 100%)`,
      }}
    >
      {/* grade de planta que deriva devagar */}
      <div
        className="grade-planta absolute inset-0 opacity-60"
        style={{ backgroundPosition: `${-(t / 90) % 48}px ${-(t / 140) % 48}px`, maskImage: 'radial-gradient(90% 80% at 60% 40%, #000 30%, transparent 100%)' }}
      />

      {/* cabeçalho */}
      <div className="absolute flex items-center justify-between" style={{ left: pad, right: pad, top: v ? 60 : 52 }}>
        <span className="rotulo flex items-center gap-3 text-[17px] text-sinal" style={{ letterSpacing: '0.16em' }}>
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sinal" style={{ opacity: 0.5 + 0.5 * Math.abs(Math.sin(t / 600)) }} />
          Assessoria tributária
        </span>
        <span className="rotulo num text-[17px] text-white/55">
          {String(cap + 1).padStart(2, '0')} / {String(CAPITULOS.length).padStart(2, '0')}
        </span>
      </div>

      {/* legenda do capítulo */}
      <div
        className="absolute"
        style={{
          left: pad,
          top: v ? 150 : 176,
          width: v ? w - pad * 2 : 520,
          opacity: vida,
        }}
      >
        <h3
          className="expandida m-0 font-[760] leading-[1.02] tracking-[-0.025em] text-white"
          style={{ fontSize: v ? 64 : 58, ...aparece(local, 120, 700, 22) }}
        >
          {legenda.titulo}
        </h3>
        <p
          className="citacao m-0 mt-6 text-[#d9d8f5]"
          style={{ fontSize: v ? 36 : 31, lineHeight: 1.28, ...aparece(local, 420, 800, 16) }}
        >
          {legenda.texto}
        </p>
      </div>

      {/* visual */}
      <div
        className="absolute"
        style={
          v
            ? { left: 40, right: 40, top: 560, height: 900, opacity: vida }
            : { left: 650, right: 60, top: 120, height: 680, opacity: vida }
        }
      >
        {v ? (
          // Na vertical, o visual é desenhado em 656 × 720 e ampliado 1,25×: textos maiores no celular.
          <div style={{ width: 656, height: 720, transform: 'scale(1.25)', transformOrigin: 'top left' }}>
            <Cena t={local} dur={c.dur} v={v} d={dados} />
          </div>
        ) : (
          <Cena t={local} dur={c.dur} v={v} d={dados} />
        )}
      </div>

      {/* segmentos de progresso */}
      <div className="absolute flex gap-2" style={{ left: pad, right: pad, bottom: v ? 64 : 48 }}>
        {CAPITULOS.map((k, i) => (
          <span key={k.id} className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/12">
            <span className="block h-full bg-white/85" style={{ width: `${lim((t - k.ini) / k.dur) * 100}%` }} />
          </span>
        ))}
      </div>

      <Encerramento t={t} v={v} />
    </div>
  );
}

// ── A nota fiscal ─────────────────────────────────────────────────────────────────

function Nota({
  t,
  valor,
  desenhar = false,
  tributos,
  largura = 520,
}: {
  t: number;
  valor: number;
  desenhar?: boolean;
  tributos?: ReactNode;
  largura?: number;
}) {
  // No capítulo 1 a nota é desenhada; nos outros já entra pronta.
  const tt = desenhar ? t : 99999;
  const borda = fase(tt, 150, 1300, suave2);
  const linha = (i: number): CSSProperties => {
    const p = fase(tt, 1200 + i * 330, 520);
    return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, opacity: p > 0 ? 1 : 0 };
  };
  const valorAgora = desenhar ? conta(tt, 3300, 1700, valor) : valor;
  const carimbo = fase(tt, 5200, 500);
  return (
    <div className="relative" style={{ width: largura }}>
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="20"
          fill="none"
          stroke={COR.sinal}
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - borda}
          opacity={desenhar ? 1 - fase(tt, 2600, 900) * 0.7 : 0.3}
        />
      </svg>
      <div
        className="relative rounded-[20px] px-9 pb-8 pt-8 text-[#1a1a2b]"
        style={{
          background: `rgba(241,241,246,${desenhar ? fase(tt, 900, 900) : 1})`,
          boxShadow: `0 40px 90px -40px rgba(0,0,0,${0.75 * (desenhar ? fase(tt, 900, 900) : 1)})`,
        }}
      >
        <div className="flex items-start justify-between" style={linha(0)}>
          <div>
            <div className="expandida text-[34px] font-[800] leading-none tracking-[-0.02em] text-[#1d1b9a]">NFS-e</div>
            <div className="rotulo mt-2 text-[12.5px] text-[#5d5d78]">Nota fiscal de serviço eletrônica</div>
          </div>
          <div className="rotulo num text-right text-[12.5px] text-[#5d5d78]">
            Nº 0001
            <br />
            série 2027
          </div>
        </div>
        <div className="my-5 h-px bg-[#e2e2ec]" />
        <Campo rotulo="Prestador" estilo={linha(1)} principal="Sua Empresa Serviços Ltda." detalhe="Simples Nacional" />
        <Campo rotulo="Tomador" estilo={linha(2)} principal="Cliente Indústria S.A." detalhe="regime regular de IBS e CBS" />
        <Campo rotulo="Serviço" estilo={linha(3)} principal="Consultoria de gestão" detalhe="projeto mensal" />
        <div className="my-5 h-px bg-[#e2e2ec]" />
        <div style={linha(4)}>
          <div className="rotulo text-[13px] text-[#5d5d78]">Valor do serviço</div>
          <div className="expandida num mt-1 whitespace-nowrap text-[40px] font-[760] leading-none tracking-[-0.02em]">
            {reais(valorAgora)}
          </div>
        </div>
        <div className="mt-4 min-h-[64px]" style={linha(5)}>
          {tributos}
        </div>
        {desenhar && (
          <div
            className="rotulo absolute right-8 top-[60%] rounded-md border-2 px-3 py-1.5 text-[15px]"
            style={{
              color: COR.marca,
              borderColor: COR.marca,
              opacity: carimbo * 0.9,
              transform: `rotate(-9deg) scale(${mistura(1.6, 1, carimbo)})`,
            }}
          >
            Emitida
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({ rotulo, principal, detalhe, estilo }: { rotulo: string; principal: string; detalhe: string; estilo: CSSProperties }) {
  return (
    <div className="mb-3.5 grid grid-cols-[120px_1fr] items-baseline gap-3" style={estilo}>
      <span className="rotulo text-[12.5px] text-[#5d5d78]">{rotulo}</span>
      <span>
        <span className="block text-[21px] font-[600] leading-tight">{principal}</span>
        <span className="block text-[16px] text-[#5d5d78]">{detalhe}</span>
      </span>
    </div>
  );
}

function LinhaTributo({ rotulo, valor, cor, estilo }: { rotulo: string; valor: string; cor: string; estilo?: CSSProperties }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${cor}1f`, ...estilo }}>
      <span className="rotulo text-[12.5px]" style={{ color: cor === COR.sinal ? COR.marca : '#8a5a22' }}>
        {rotulo}
      </span>
      <span className="expandida num text-[20px] font-[700]" style={{ color: cor === COR.sinal ? COR.marca : '#8a5a22' }}>
        {valor}
      </span>
    </div>
  );
}

// ── Cenas ───────────────────────────────────────────────────────────────────────

/** Altura natural da nota (520 px de largura), para encolhê-la sem sobrar espaço. */
const NOTA_ALTURA = 590;

/** Encolhe o conteúdo e reserva só o espaço encolhido no layout. */
function Escala({ s, w, h, children, className }: { s: number; w: number; h: number; children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: w * s, height: h * s }}>
      <div className="absolute left-0 top-0" style={{ width: w, transform: `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

function CenaFatura({ t, v, d }: CenaProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div style={{ transform: `translateY(${(1 - fase(t, 0, 1400)) * 30}px)` }}>
        <Escala s={v ? 1.12 : 1.05} w={520} h={NOTA_ALTURA}>
          <Nota
            t={t}
            valor={d.r.fatura.puro.valorCobrado}
            desenhar
            tributos={
              <div className="rotulo pt-3 text-[13px] text-[#5d5d78]" style={{ opacity: fase(t, 3000, 600) }}>
                Tributos: ?
              </div>
            }
          />
        </Escala>
      </div>
    </div>
  );
}

function CenaPuro({ t, v, d }: CenaProps) {
  const f = d.r.fatura.puro;
  const outros = f.das - f.ibsCbsNoDas;
  const fatiaIbs = f.ibsCbsNoDas / f.das;
  const barra = fase(t, 1700, 1300, suave2);
  const destaque = fase(t, 3300, 700);
  const seta = fase(t, 4300, 900, suave2);
  return (
    <div className={cn('flex h-full w-full', v ? 'flex-col items-center gap-6' : 'flex-row items-center gap-10')}>
      <Escala s={v ? 0.55 : 0.78} w={520} h={NOTA_ALTURA}>
        <Nota
          t={t}
          valor={f.valorCobrado}
          tributos={
            <LinhaTributo rotulo="Tributos dentro do DAS" valor="Simples Nacional" cor={COR.madeira} estilo={aparece(t, 500, 600)} />
          }
        />
      </Escala>
      <div className="w-full min-w-0 flex-1">
        <div style={aparece(t, 900, 700)}>
          <div className="rotulo text-[15px] text-cinza-escuro">DAS desta fatura</div>
          <div className="expandida num mt-1 whitespace-nowrap text-[52px] font-[780] leading-none tracking-[-0.03em]">
            {reais(conta(t, 1000, 1600, f.das))}
          </div>
          <div className="rotulo mt-2 text-[14px] text-white/50">alíquota efetiva {pct(d.r.anual.puro.aliquotaEfetiva)}</div>
        </div>
        <div className="relative mt-7 h-[70px] w-full overflow-hidden rounded-2xl bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 flex items-center px-5"
            style={{ width: `${(1 - fatiaIbs) * 100 * barra}%`, background: COR.tinta2, borderRight: `2px solid ${COR.tinta}` }}
          >
            <span className="rotulo whitespace-nowrap text-[13px] text-white/75" style={{ opacity: fase(t, 2600, 500) }}>
              IRPJ · CSLL · CPP · ISS
            </span>
          </div>
          <div
            className="absolute inset-y-0"
            style={{
              left: `${(1 - fatiaIbs) * 100 * barra}%`,
              width: `${fatiaIbs * 100 * barra}%`,
              background: COR.sinal,
              boxShadow: `0 0 ${40 * destaque}px ${8 * destaque}px rgba(142,139,255,${0.55 * destaque})`,
            }}
          />
        </div>
        <div className="mt-3 flex justify-between gap-4" style={aparece(t, 2500, 600, 8)}>
          <span className="num whitespace-nowrap text-[18px] text-white/70">{reais(outros)}</span>
          <span className="num whitespace-nowrap text-[18px] font-[650] text-sinal">CBS + IBS {reais(f.ibsCbsNoDas)}</span>
        </div>
        {!v && (
          <div className="relative mt-2 flex justify-end pr-[3%]">
            <svg width="40" height="70" aria-hidden="true">
              <line x1="20" y1="0" x2="20" y2={66 * seta} stroke={COR.sinal} strokeWidth="3" strokeLinecap="round" />
              <path d="M8 54 L20 68 L32 54" fill="none" stroke={COR.sinal} strokeWidth="3" opacity={seta > 0.95 ? 1 : 0} />
            </svg>
          </div>
        )}
        <div
          className={cn('ml-auto w-fit rounded-2xl border px-6 py-4', v ? 'mt-6' : 'mt-2')}
          style={{ borderColor: 'rgba(142,139,255,.45)', background: 'rgba(142,139,255,.10)', ...aparece(t, 4900, 700) }}
        >
          <div className="rotulo text-[13px] text-sinal">Crédito do cliente</div>
          <div className="expandida num mt-1 whitespace-nowrap text-[40px] font-[760] leading-none">
            {reais(conta(t, 5000, 1200, f.creditoCliente))}
          </div>
          <div className="mt-2 text-[16px] text-white/60">só o que o DAS cobrou de CBS e IBS</div>
        </div>
      </div>
    </div>
  );
}

type Pt = { x: number; y: number };
/** Ponto de uma curva de Bézier cúbica. */
function bezier(p: number, a: Pt, c1: Pt, c2: Pt, b: Pt): Pt {
  const q = 1 - p;
  return {
    x: q * q * q * a.x + 3 * q * q * p * c1.x + 3 * q * p * p * c2.x + p * p * p * b.x,
    y: q * q * q * a.y + 3 * q * q * p * c1.y + 3 * q * p * p * c2.y + p * p * p * b.y,
  };
}

function CenaHibrido({ t, v, d }: CenaProps) {
  const f = d.r.fatura.hibrido;
  const a = d.r.aliquotasAno.soma;
  const fluxo = fase(t, 2400, 1500, suave2);
  const divide = fase(t, 3700, 1600, suave2);
  const W = v ? 656 : 540;
  const H = 250;
  const cliente = { x: 40, y: H / 2 };
  const no = { x: W * 0.42, y: H / 2 };
  const fisco = { x: W - 70, y: 46 };
  const empresa = { x: W - 70, y: H - 46 };
  const ramo = (fim: Pt): [Pt, Pt, Pt, Pt] => [no, { x: no.x + 110, y: no.y }, { x: fim.x - 140, y: fim.y }, fim];
  const ramoFisco = ramo(fisco);
  const ramoEmpresa = ramo(empresa);
  const caminho = ([p0, c1, c2, p3]: [Pt, Pt, Pt, Pt]) => `M${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`;
  // Moedas: atravessam até o nó e seguem, alternando, para o Fisco (IBS/CBS) e para a empresa.
  const moedas = [0, 0.25, 0.5, 0.75].map((off, i) => {
    const p = ((t / 2200 + off) % 1) * 2;
    const paraFisco = i % 2 === 0;
    const pos = p <= 1 ? { x: mistura(cliente.x, no.x, p), y: no.y } : bezier(p - 1, ...(paraFisco ? ramoFisco : ramoEmpresa));
    return { pos, cor: p > 1 && paraFisco ? COR.sinal : '#fff' };
  });

  const nota = v ? (
    <div
      className="flex items-center justify-between rounded-2xl bg-[#f1f1f6] px-5 py-4 text-[#1a1a2b]"
      style={aparece(t, 300, 600)}
    >
      <div>
        <div className="expandida text-[20px] font-[800] leading-none text-[#1d1b9a]">NFS-e</div>
        <div className="rotulo mt-1.5 text-[11.5px] text-[#5d5d78]">IBS/CBS destacados ({pct(a)})</div>
      </div>
      <div className="expandida num whitespace-nowrap text-[28px] font-[760] text-[#1d1b9a]">
        {reais(conta(t, 900, 1100, f.ibsCbsDestacado))}
      </div>
    </div>
  ) : (
    <Escala s={0.6} w={520} h={NOTA_ALTURA}>
      <Nota
        t={t}
        valor={f.valorCobrado}
        tributos={
          <LinhaTributo
            rotulo={`IBS/CBS destacados (${pct(a)})`}
            valor={reais(conta(t, 900, 1100, f.ibsCbsDestacado))}
            cor={COR.sinal}
            estilo={aparece(t, 600, 600)}
          />
        }
      />
    </Escala>
  );

  const fluxoSvg = (
    <div className="relative" style={{ width: W }}>
      <div
        className="rotulo absolute text-center text-[13px] leading-tight text-cinza-escuro"
        style={{ left: no.x - 110, top: 40 + no.y - 78, width: 220, ...aparece(t, 1800, 600) }}
      >
        split payment
        <br />
        no pagamento
      </div>
      <svg width={W} height={H} className="mt-10 overflow-visible" aria-hidden="true">
        <g opacity={fase(t, 2000, 600)}>
          <line x1={cliente.x} y1={cliente.y} x2={mistura(cliente.x, no.x, fluxo)} y2={no.y} stroke="rgba(255,255,255,.55)" strokeWidth="4" strokeLinecap="round" />
          <path d={caminho(ramoFisco)} fill="none" stroke={COR.sinal} strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - divide} />
          <path d={caminho(ramoEmpresa)} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - divide} />
          {divide > 0.98 && moedas.map((m, i) => <circle key={i} cx={m.pos.x} cy={m.pos.y} r={7} fill={m.cor} opacity={0.92} />)}
          <circle cx={no.x} cy={no.y} r={16 + 4 * Math.sin(t / 300) * divide} fill={COR.tinta} stroke={COR.sinal} strokeWidth="3" />
        </g>
      </svg>
      <Rotulado x={0} y={cliente.y + 22} estilo={aparece(t, 2100, 600)} titulo="Cliente paga" valor={reais(f.valorCobrado)} />
      <Rotulado x={W - 260} y={fisco.y - 96} estilo={aparece(t, 4500, 600)} titulo="Fisco · IBS/CBS" valor={reais(f.ibsCbsDestacado)} cor={COR.sinal} alinhar="end" />
      <Rotulado x={W - 260} y={empresa.y + 18} estilo={aparece(t, 4800, 600)} titulo="Empresa recebe" valor={reais(f.valorCobrado - f.ibsCbsDestacado)} alinhar="end" />
    </div>
  );

  const stats = (
    <div className="grid grid-cols-3 gap-3">
      <Stat t={t} ini={6000} compacto={v} titulo="DAS sem IBS/CBS" valor={reais(f.das)} />
      <Stat t={t} ini={6500} compacto={v} titulo="Crédito das compras" valor={`− ${reais(f.creditoCompras)}`} detalhe="a empresa credita" />
      <Stat t={t} ini={7000} compacto={v} titulo="Crédito do cliente" valor={reais(f.creditoCliente)} detalhe="todo o destacado" destaque />
    </div>
  );

  return v ? (
    <div className="flex h-full w-full flex-col gap-7 pt-2">
      {nota}
      {fluxoSvg}
      <div className="mt-8">{stats}</div>
    </div>
  ) : (
    <div className="flex h-full w-full flex-col justify-center gap-10">
      <div className="flex items-center gap-8">
        {nota}
        {fluxoSvg}
      </div>
      {stats}
    </div>
  );
}

function Rotulado(props: { x: number; y: number; titulo: string; valor: string; estilo: CSSProperties; cor?: string; alinhar?: 'start' | 'end' }) {
  return (
    <div
      className="absolute"
      style={{ left: props.x, top: props.y + 40, width: 260, textAlign: props.alinhar === 'end' ? 'right' : 'left', ...props.estilo }}
    >
      <div className="rotulo text-[13px] text-cinza-escuro">{props.titulo}</div>
      <div className="expandida num whitespace-nowrap text-[26px] font-[740] leading-tight" style={{ color: props.cor ?? '#fff' }}>
        {props.valor}
      </div>
    </div>
  );
}

function Stat({
  t,
  ini,
  titulo,
  valor,
  detalhe,
  destaque,
  compacto,
}: {
  t: number;
  ini: number;
  titulo: string;
  valor: string;
  detalhe?: string;
  destaque?: boolean;
  compacto?: boolean;
}) {
  return (
    <div
      className={cn('rounded-2xl border', compacto ? 'px-3.5 py-3' : 'px-5 py-4')}
      style={{
        borderColor: destaque ? 'rgba(142,139,255,.5)' : 'rgba(255,255,255,.14)',
        background: destaque ? 'rgba(142,139,255,.12)' : 'rgba(255,255,255,.04)',
        ...aparece(t, ini, 600),
      }}
    >
      <div className={cn('rotulo', compacto ? 'text-[10.5px]' : 'text-[12.5px]', destaque ? 'text-sinal' : 'text-cinza-escuro')}>{titulo}</div>
      <div className={cn('expandida num mt-1 whitespace-nowrap font-[740] leading-tight', compacto ? 'text-[19px]' : 'text-[26px]')}>{valor}</div>
      {detalhe && <div className={cn('mt-1 text-white/55', compacto ? 'text-[13px]' : 'text-[15px]')}>{detalhe}</div>}
    </div>
  );
}

function CenaConta({ t, v, d }: CenaProps) {
  const { puro: p, hibrido: h, diferencas: dif } = d.r.fatura;
  const maxCliente = Math.max(p.custoLiquidoCliente, h.custoLiquidoCliente);
  const maxImposto = Math.max(p.impostoEmpresa, h.impostoEmpresa);
  const economia = -dif.custoCliente;
  const extra = Math.max(dif.impostoEmpresa, 0);
  const sobra = economia - extra;
  const mostrarDivisao = economia > 0;
  return (
    <div className={cn('flex h-full w-full flex-col', v ? 'gap-9 pt-2' : 'justify-center gap-9')}>
      <Grupo
        t={t}
        ini={300}
        titulo="Custo líquido da fatura para o cliente"
        linhas={[
          { rotulo: 'Puro', valor: p.custoLiquidoCliente, max: maxCliente },
          { rotulo: 'Híbrido', valor: h.custoLiquidoCliente, max: maxCliente, destaque: true },
        ]}
        delta={dif.custoCliente}
      />
      <Grupo
        t={t}
        ini={1900}
        titulo="Imposto líquido da empresa"
        linhas={[
          { rotulo: 'Puro', valor: p.impostoEmpresa, max: maxImposto },
          { rotulo: 'Híbrido', valor: h.impostoEmpresa, max: maxImposto, destaque: true },
        ]}
        delta={dif.impostoEmpresa}
      />
      {mostrarDivisao && (
        <div style={aparece(t, 3900, 700)}>
          <div className="rotulo text-[14px] text-cinza-escuro">Para onde vai a economia do cliente · {reais(economia)} por fatura</div>
          <div className="mt-3 flex h-[60px] w-full overflow-hidden rounded-2xl bg-white/[0.06]">
            {extra > 0 && (
              <div
                className="flex h-full items-center px-4"
                style={{ width: `${(extra / economia) * 100 * fase(t, 4300, 1200, suave2)}%`, background: COR.madeira }}
              >
                <span className="rotulo whitespace-nowrap text-[12.5px] text-[#2a1a05]" style={{ opacity: fase(t, 5200, 500) }}>
                  imposto a mais da empresa
                </span>
              </div>
            )}
            <div
              className="flex h-full items-center justify-end px-4"
              style={{ width: `${(sobra / economia) * 100 * fase(t, 4900, 1200, suave2)}%`, background: COR.sinal }}
            >
              <span className="rotulo whitespace-nowrap text-[12.5px] text-[#0b0a2e]" style={{ opacity: fase(t, 5800, 500) }}>
                {extra > 0 ? 'espaço para negociar' : 'ganho dos dois lados'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-between gap-6">
            {extra > 0 ? (
              <span className="num text-[20px] font-[650]" style={{ color: COR.madeira, opacity: fase(t, 5200, 500) }}>
                {reais(extra)}
              </span>
            ) : (
              <span />
            )}
            <span className="num text-[20px] font-[650] text-sinal" style={{ opacity: fase(t, 5800, 500) }}>
              {reais(sobra)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Grupo(props: {
  t: number;
  ini: number;
  titulo: string;
  linhas: { rotulo: string; valor: number; max: number; destaque?: boolean }[];
  delta: number;
}) {
  const { t, ini, titulo, linhas, delta } = props;
  const bom = delta < 0;
  return (
    <div style={aparece(t, ini, 650)}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="rotulo text-[14px] text-cinza-escuro">{titulo}</div>
        <div
          className="expandida num rounded-full px-4 py-1.5 text-[20px] font-[720]"
          style={{
            color: bom ? COR.tinta : '#2a1a05',
            background: bom ? COR.sinal : COR.madeira,
            opacity: fase(t, ini + 1500, 500),
            transform: `scale(${mistura(0.8, 1, fase(t, ini + 1500, 500))})`,
          }}
        >
          {delta > 0 ? '+ ' : delta < 0 ? '− ' : ''}
          {reais(Math.abs(delta))}
        </div>
      </div>
      <div className="mt-3 grid gap-2.5">
        {linhas.map((l, i) => {
          const p = fase(t, ini + 250 + i * 250, 1200, suave2);
          return (
            <div key={l.rotulo} className="grid grid-cols-[110px_1fr_200px] items-center gap-4">
              <span className={cn('rotulo text-[13px]', l.destaque ? 'text-sinal' : 'text-white/60')}>{l.rotulo}</span>
              <span className="relative h-[34px] overflow-hidden rounded-lg bg-white/[0.05]">
                <span
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ width: `${(l.valor / l.max) * 100 * p}%`, background: l.destaque ? COR.sinal : 'rgba(255,255,255,.35)' }}
                />
              </span>
              <span className="expandida num text-right text-[24px] font-[700]">{reais(l.valor * p)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CenaEstudo({ t, v, d }: CenaProps) {
  const ganhos = d.serie.map((r) => ({ ano: r.ano, v: r.fatura.diferencas.ganhoCadeia }));
  const max = Math.max(...ganhos.map((g) => Math.abs(g.v)), 1);
  const passos: { titulo: string; texto: ReactNode }[] = [
    { titulo: 'Diagnóstico', texto: 'Com os números reais da empresa: faturamento, folha, compras e quem são os clientes.' },
    {
      titulo: 'Simulação 2027–2033',
      texto: (
        <div className="mt-3 flex h-[92px] items-end gap-2">
          {ganhos.map((g, i) => {
            const p = fase(t, 2000 + i * 120, 700, suave2);
            return (
              <div key={g.ano} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className="w-full rounded-t-md"
                  style={{ height: `${(Math.abs(g.v) / max) * 64 * p}px`, background: g.v >= 0 ? COR.sinal : COR.madeira }}
                />
                <span className="rotulo num text-[10.5px] text-white/55">{String(g.ano).slice(2)}</span>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      titulo: 'Decisão no prazo',
      texto: `Opção para o 1º semestre de 2027 até ${PRAZOS_OPCAO.opcao1oSemestre2027}; desistência ${PRAZOS_OPCAO.desistencia}; nova janela em março de 2027.`,
    },
    { titulo: 'Cláusulas de preço', texto: 'Preço líquido de IBS/CBS e reequilíbrio nos contratos com os clientes.' },
  ];
  return (
    <div className={cn('grid h-full w-full content-center gap-4', v ? 'grid-cols-1 content-start' : 'grid-cols-2')}>
      {passos.map((s, i) => (
        <div
          key={s.titulo}
          className="rounded-2xl border border-white/14 bg-white/[0.04] px-6 py-5"
          style={{ ...aparece(t, 500 + i * 650, 700), minHeight: v ? 0 : 200 }}
        >
          <div className="flex items-baseline gap-3">
            <span className="rotulo num text-[14px] text-sinal">{String(i + 1).padStart(2, '0')}</span>
            <span className="expandida text-[25px] font-[720] tracking-[-0.01em]">{s.titulo}</span>
          </div>
          <div className="mt-2 text-[18px] leading-snug text-white/70">{s.texto}</div>
          {i === 1 && <div className="rotulo mt-1 text-[11px] text-white/45">imposto a menos na cadeia, por fatura</div>}
        </div>
      ))}
    </div>
  );
}

function Encerramento({ t, v }: { t: number; v: boolean }) {
  const ini = DURACAO_FILME - 3800;
  const p = fase(t, ini, 900, suave2);
  if (p <= 0) return null;
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center"
      style={{ background: `rgba(11,10,46,${p})` }}
    >
      <div className="rotulo text-[18px] text-sinal" style={aparece(t, ini + 300, 700)}>
        Simulação ilustrativa
      </div>
      <p
        className="citacao m-0 mt-6 max-w-[1100px] text-white"
        style={{ fontSize: v ? 52 : 58, lineHeight: 1.18, ...aparece(t, ini + 600, 800) }}
      >
        O resultado depende do estudo com os dados da sua empresa.
      </p>
      <div className="expandida mt-10 text-[22px] font-[650] text-white/80" style={aparece(t, ini + 1100, 700)}>
        Douglas Senturião Advocacia · Assessoria Tributária
      </div>
    </div>
  );
}
