'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const DUR = 6200; // ms por cena

/**
 * Roteiro genérico: nenhum cliente, nenhum caso real. Mostra como uma demanda
 * percorre o escritório, da mensagem ao acompanhamento diário de publicações.
 */
export const CENAS = [
  {
    id: 'chega',
    titulo: 'A dúvida chega',
    texto: 'Pelo WhatsApp, por e-mail ou pelo formulário de diagnóstico: o ato, a decisão ou o edital, com o que aconteceu.',
  },
  {
    id: 'triagem',
    titulo: 'Triagem com prazo',
    texto: 'Identificamos a frente, o instrumento cabível e o prazo que ainda corre. O prazo orienta a prioridade.',
  },
  {
    id: 'minuta',
    titulo: 'Tese e peça',
    texto: 'A tese vem antes da peça: pesquisa de norma e jurisprudência, redação própria e nada de modelo pronto.',
  },
  {
    id: 'revisao',
    titulo: 'Segunda leitura',
    texto: 'Toda peça passa por revisão: prazo, fundamentos, citações e pedidos conferidos antes do protocolo.',
  },
  {
    id: 'protocolo',
    titulo: 'Assinatura e protocolo',
    texto: 'Assinatura digital ICP-Brasil e protocolo no sistema do órgão ou do tribunal, com o comprovante arquivado.',
  },
  {
    id: 'acompanhamento',
    titulo: 'Acompanhamento diário',
    texto: 'As publicações do Diário de Justiça Eletrônico Nacional são conferidas todos os dias; cada intimação vira prazo no calendário.',
  },
] as const;

/** O filme da operação: seis cenas animadas em código. Toca quando entra na tela. */
export function Filme() {
  const [cena, setCena] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [prog, setProg] = useState(0);
  const caixa = useRef<HTMLDivElement>(null);
  const pausadoPeloLeitor = useRef(false);
  const progRef = useRef(0);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (pausadoPeloLeitor.current) return;
        setTocando(en.isIntersecting);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!tocando) return;
    let raf = 0;
    let antes = performance.now();
    const passo = (agora: number) => {
      const dt = agora - antes;
      antes = agora;
      progRef.current += dt / DUR;
      if (progRef.current >= 1) {
        progRef.current = 0;
        setCena((c) => (c + 1) % CENAS.length);
      }
      setProg(progRef.current);
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [tocando]);

  const vai = (i: number) => {
    setCena(i);
    progRef.current = 0;
    setProg(0);
  };

  const telas: ReactNode[] = [<Chega key="0" />, <Triagem key="1" />, <Minuta key="2" />, <Revisao key="3" />, <Protocolo key="4" />, <Acompanhamento key="5" />];

  return (
    <MotionConfig reducedMotion="user">
    <div ref={caixa} className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-12">
      <ol className="order-2 m-0 grid list-none gap-1 p-0 lg:order-1">
        {CENAS.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => vai(i)}
              aria-current={i === cena ? 'step' : undefined}
              className={cn(
                'relative w-full cursor-pointer overflow-hidden rounded-xl border-0 bg-transparent px-4 py-3.5 text-left transition',
                i === cena ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
              )}
            >
              <span className="flex items-baseline gap-3">
                <span className={cn('rotulo num text-[10.5px]', i === cena ? 'text-sinal' : 'text-cinza-escuro')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cn('expandida text-[15px] font-[650]', i === cena ? 'text-white' : 'text-white/60')}>
                  {c.titulo}
                </span>
              </span>
              <AnimatePresence initial={false}>
                {i === cena && (
                  <motion.span
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="m-0 block overflow-hidden pl-[2.1rem] text-[0.93rem] leading-snug text-cinza-escuro"
                  >
                    <span className="block pt-1.5">{c.texto}</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {i === cena && (
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] bg-sinal" style={{ width: `${prog * 100}%` }} />
              )}
            </button>
          </li>
        ))}
      </ol>

      <div className="order-1 min-w-0 lg:order-2">
        <div
          className="relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-[22px] border border-sinal/20 bg-[radial-gradient(120%_90%_at_70%_10%,#24228a_0%,#100f3d_55%,#0b0a2e_100%)] min-[480px]:aspect-[16/12] sm:aspect-[16/11] lg:aspect-[16/10]"
          role="img"
          aria-label={`Cena ${cena + 1} de ${CENAS.length}: ${CENAS[cena].titulo}. ${CENAS[cena].texto}`}
        >
          <div className="absolute left-4 right-4 top-4 z-10 flex gap-1.5" aria-hidden="true">
            {CENAS.map((c, i) => (
              <span key={c.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                <span
                  className="block h-full bg-white"
                  style={{ width: i < cena ? '100%' : i === cena ? `${prog * 100}%` : '0%' }}
                />
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cena}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 grid place-items-center px-4 pb-12 pt-12 sm:px-10"
              aria-hidden="true"
            >
              <div className="grid w-full place-items-center max-sm:scale-[0.9]">{telas[cena]}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="rotulo truncate text-[10px] text-white/70">
            {String(cena + 1).padStart(2, '0')} · {CENAS[cena].titulo}
          </span>
          <button
            type="button"
            onClick={() => {
              pausadoPeloLeitor.current = tocando;
              setTocando(!tocando);
            }}
            aria-label={tocando ? 'Pausar a demonstração' : 'Tocar a demonstração'}
            className="rotulo cursor-pointer rounded-full border border-white/25 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white transition hover:border-sinal"
          >
            {tocando ? '❚❚ Pausar' : '▶ Tocar'}
          </button>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}

// ── Cenas ──────────────────────────────────────────────────────────────────────
const entra = (d: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const },
});

function Chega() {
  return (
    <div className="w-full max-w-[420px] rounded-[26px] border border-white/10 bg-[#0e0d33] p-4 shadow-2xl sm:p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-sinal/25 text-[13px] font-semibold text-white">EL</div>
        <div className="leading-tight">
          <div className="text-[13.5px] font-semibold text-white">Empresa licitante</div>
          <div className="text-[11px] text-cinza-escuro">online</div>
        </div>
      </div>
      <div className="mt-4 grid gap-2.5 text-[13px] leading-snug">
        <motion.div {...entra(0.3)} className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2.5 text-white">
          Fomos inabilitados no pregão de ontem. Ainda dá tempo de recorrer?
        </motion.div>
        <motion.div {...entra(1.1)} className="flex max-w-[85%] items-center gap-3 rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2.5 text-white">
          <span className="grid h-9 w-8 shrink-0 place-items-center rounded bg-white text-[9px] font-bold text-tinta">PDF</span>
          <span>
            Ata_da_sessao.pdf<span className="block text-[11px] text-cinza-escuro">9 páginas</span>
          </span>
        </motion.div>
        <motion.div {...entra(1.9)} className="flex max-w-[72%] items-center gap-2 rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2.5">
          <span className="text-white">▶</span>
          <span className="flex h-5 flex-1 items-center gap-[2px]">
            {Array.from({ length: 26 }, (_, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-sinal"
                initial={{ height: 3 }}
                animate={{ height: [3, 4 + ((i * 7) % 15), 3] }}
                transition={{ delay: 2.1 + i * 0.03, duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
              />
            ))}
          </span>
          <span className="num text-[11px] text-cinza-escuro">0:38</span>
        </motion.div>
        <motion.div {...entra(3.3)} className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-marca px-3.5 py-2.5 text-white">
          Recebido. A triagem começa agora; o prazo do recurso entra na frente de tudo.
          <span className="mt-1 block text-right text-[10px] text-white/60">✓✓ lida</span>
        </motion.div>
      </div>
    </div>
  );
}

function Triagem() {
  const linhas: [string, ReactNode][] = [
    ['Assunto', 'Inabilitação em pregão eletrônico'],
    ['Frente', 'Licitações · Lei 14.133/2021'],
    ['Prazo', <span key="p" className="rounded-full bg-alerta/15 px-2 py-0.5 font-semibold text-alerta">3 dias úteis</span>],
    ['Caminho', 'Recurso administrativo; mandado de segurança se houver urgência'],
    ['Retorno', 'Diagnóstico por escrito em até 1 dia útil'],
  ];
  return (
    <div className="relative w-full max-w-[460px] rounded-2xl bg-white p-5 text-grafite shadow-2xl sm:p-6">
      <div className="rotulo text-[10px] text-marca">Ficha de triagem</div>
      <div className="mt-4 grid gap-2.5">
        {linhas.map(([k, v], i) => (
          <motion.div
            key={k}
            {...entra(0.25 + i * 0.4)}
            className="grid grid-cols-[4.8rem_minmax(0,1fr)] gap-3 border-t border-papel-2 pt-2.5 text-[13px] leading-snug sm:grid-cols-[5.5rem_minmax(0,1fr)]"
          >
            <span className="rotulo pt-0.5 text-[9.5px] text-cinza">{k}</span>
            <span>{v}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 1.8, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: -9 }}
        transition={{ delay: 2.7, type: 'spring', stiffness: 260, damping: 16 }}
        className="expandida absolute -right-2 -top-4 rounded-md border-2 border-marca bg-white px-3 py-1.5 text-[11.5px] font-[800] tracking-[0.1em] text-marca sm:-right-6"
      >
        PRAZO MAPEADO
      </motion.div>
    </div>
  );
}

function Minuta() {
  const blocos: [string, string][] = [
    ['I · Tempestividade', 'art. 165, I, Lei 14.133/2021'],
    ['II · O vício da decisão', 'exigência que o edital não previa'],
    ['III · O saneamento', 'diligência do art. 64'],
  ];
  return (
    <div className="w-full max-w-[470px] rounded-xl bg-[#fbfbfe] p-5 text-[12.5px] leading-relaxed text-grafite shadow-2xl sm:p-7">
      <div className="rotulo text-[9.5px] text-cinza">Recurso administrativo · minuta</div>
      <div className="mt-3 grid gap-3.5">
        {blocos.map(([titulo, base], i) => (
          <div key={titulo}>
            <motion.div {...entra(0.3 + i * 1.05)} className="semi text-[12.5px] font-[700]">
              {titulo}
            </motion.div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <motion.span
                className="inline-block h-2 rounded bg-papel-2"
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                transition={{ delay: 0.5 + i * 1.05, duration: 0.5 }}
              />
              <motion.span {...entra(0.85 + i * 1.05)} className="inline-block rounded bg-marca/10 px-1.5 font-semibold text-marca">
                {base}
              </motion.span>
            </div>
            <motion.span
              className="mt-1.5 block h-2 rounded bg-papel-2"
              initial={{ width: 0 }}
              animate={{ width: '86%' }}
              transition={{ delay: 0.7 + i * 1.05, duration: 0.6 }}
            />
          </div>
        ))}
      </div>
      <motion.div {...entra(4.2)} className="mt-5 rounded-lg border-l-2 border-marca bg-marca/5 px-3 py-2 text-[12px] text-marca">
        + nota ao cliente explicando a tese, em linguagem direta
      </motion.div>
    </div>
  );
}

function Revisao() {
  const itens = ['Prazo e tempestividade conferidos', 'Leis e julgados citados verificados', 'Pedidos e documentos revisados'];
  return (
    <div className="w-full max-w-[420px]">
      <div className="grid gap-3">
        {itens.map((t, i) => (
          <motion.div
            key={t}
            {...entra(0.3 + i * 0.7)}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[14px] text-white"
          >
            <motion.span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sinal text-[13px] font-bold text-tinta"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.75 + i * 0.7, type: 'spring', stiffness: 400, damping: 15 }}
            >
              ✓
            </motion.span>
            {t}
          </motion.div>
        ))}
      </div>
      <motion.div
        {...entra(2.9)}
        className="expandida mt-6 text-center text-[clamp(1.6rem,4vw,2.4rem)] font-[800] tracking-[-0.02em] text-white"
      >
        Pronta para protocolo<span className="text-sinal">.</span>
      </motion.div>
    </div>
  );
}

function Protocolo() {
  return (
    <div className="w-full max-w-[440px] rounded-xl bg-[#fbfbfe] p-6 text-grafite shadow-2xl sm:p-8">
      <div className="rotulo text-[9.5px] text-cinza">Recurso administrativo · versão final</div>
      <svg viewBox="0 0 300 80" className="mt-4 w-full" aria-hidden="true">
        <motion.path
          d="M10 58 C 30 10, 45 70, 62 40 S 90 20, 100 48 S 128 66, 140 34 C 150 14, 160 60, 176 46 S 205 22, 222 50 C 232 64, 252 30, 290 36"
          fill="none"
          stroke="var(--marca)"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 1.8, ease: 'easeInOut' }}
        />
        <line x1="6" y1="70" x2="294" y2="70" stroke="var(--papel-2)" strokeWidth="1" />
      </svg>
      <div className="text-[12px] text-cinza">Advogado responsável</div>
      <motion.div {...entra(2.2)} className="mt-5 flex items-center gap-3 rounded-lg border border-marca/25 bg-marca/5 px-3.5 py-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marca text-[10px] font-bold text-white">ICP</span>
        <span className="text-[12.5px] leading-snug">
          <b>Assinatura digital ICP-Brasil</b>
          <span className="block text-cinza">Certificado do advogado · documento íntegro</span>
        </span>
      </motion.div>
      <motion.div {...entra(3.2)} className="mt-3 flex items-center gap-3 rounded-lg border border-papel-2 px-3.5 py-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tinta text-[13px] font-bold text-white">✓</span>
        <span className="text-[12.5px] leading-snug">
          <b>Protocolado no sistema do órgão</b>
          <span className="block text-cinza">Comprovante arquivado na pasta do caso</span>
        </span>
      </motion.div>
    </div>
  );
}

function Acompanhamento() {
  const marcados: Record<number, string> = { 9: 'intimação', 14: 'prazo', 22: 'audiência' };
  const ordem = Object.keys(marcados);
  return (
    <div className="grid w-full max-w-[520px] gap-4 sm:grid-cols-[1fr_1fr]">
      <motion.div {...entra(0.2)} className="rounded-xl bg-white p-4 text-grafite shadow-2xl">
        <div className="rotulo text-[9.5px] text-cinza">Calendário de prazos</div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
          {Array.from({ length: 30 }, (_, i) => {
            const d = i + 1;
            const m = marcados[d];
            return (
              <motion.div
                key={d}
                initial={m ? { scale: 0.6, opacity: 0.3 } : false}
                animate={m ? { scale: 1, opacity: 1 } : undefined}
                transition={{ delay: 0.8 + ordem.indexOf(String(d)) * 0.5 }}
                className={cn('num grid aspect-square place-items-center rounded', m ? 'bg-marca font-bold text-white' : 'bg-papel text-cinza')}
                title={m}
              >
                {d}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-3 grid gap-1 text-[11px] text-cinza max-sm:hidden">
          <span>09 · intimação publicada</span>
          <span>14 · prazo para manifestação</span>
          <span>22 · audiência designada</span>
        </div>
      </motion.div>
      <motion.div {...entra(0.6)} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-4 text-white">
        <div className="rotulo text-[9.5px] text-cinza-escuro">Leitura do DJEN</div>
        <div className="expandida mt-2 text-[1.6rem] font-[800] leading-none sm:text-[2rem]">Todo dia</div>
        <div className="text-[12px] text-cinza-escuro">publicações conferidas, intimação vira prazo</div>
        <div className="mt-auto flex h-16 items-end gap-1.5 pt-4 sm:h-20" aria-hidden="true">
          {['seg', 'ter', 'qua', 'qui', 'sex'].map((d, i) => (
            <span key={d} className="flex flex-1 flex-col items-center gap-1">
              <motion.span
                className={cn('w-full rounded-t', i === 4 ? 'bg-sinal' : 'bg-white/25')}
                initial={{ height: 0 }}
                animate={{ height: 34 }}
                transition={{ delay: 1 + i * 0.12, duration: 0.5 }}
              />
              <span className="rotulo text-[8.5px] text-cinza-escuro">{d}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
