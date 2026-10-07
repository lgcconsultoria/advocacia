'use client';

// Filme de 6 cenas do Departamento de Licitações, na mesma moldura do filme
// da home (components/home/filme.tsx): cenas genéricas, sem cliente, órgão ou
// caso real.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const DUR = 6200; // ms por cena

export const CENAS = [
  {
    id: 'captacao',
    titulo: 'O edital é captado',
    texto: 'Os editais do segmento da empresa são monitorados no PNCP e nos portais de compras; o que interessa entra na fila com a data da sessão.',
  },
  {
    id: 'parecer',
    titulo: 'Parecer de viabilidade',
    texto: 'Leitura jurídica do edital e matriz de riscos: exigências, prazos e cláusulas sensíveis. A recomendação sai por escrito: participar, impugnar ou não participar.',
  },
  {
    id: 'habilitacao',
    titulo: 'Documentação conferida',
    texto: 'Certidões, balanço, atestados e declarações conferidos contra o edital, com validade controlada e revisão jurídica antes do envio.',
  },
  {
    id: 'sessao',
    titulo: 'Sessão com suporte jurídico',
    texto: 'Durante a disputa e o julgamento: respostas a diligências, defesa da exequibilidade da proposta e registro da intenção de recorrer no momento certo.',
  },
  {
    id: 'recurso',
    titulo: 'Recurso ou contrarrazões no prazo',
    texto: 'Razões ou contrarrazões em 3 dias úteis (Lei 14.133, art. 165), com tese própria; se a via administrativa se esgotar, mandado de segurança.',
  },
  {
    id: 'contrato',
    titulo: 'Contrato e gestão',
    texto: 'Depois da assinatura: aditivos, reajuste, repactuação, reequilíbrio econômico-financeiro (inclusive pelo IBS e pela CBS) e defesa em processos de sanção.',
  },
] as const;

/** O filme do departamento: seis cenas animadas em código. Toca quando entra na tela. */
export function FilmeLicitacoes() {
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

  const telas: ReactNode[] = [<Captacao key="0" />, <Parecer key="1" />, <Habilitacao key="2" />, <Sessao key="3" />, <Recurso key="4" />, <Contrato key="5" />];

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

function Captacao() {
  const editais: [string, string, string, boolean][] = [
    ['Pregão eletrônico', 'Serviços de manutenção predial', 'sessão em 12 dias', true],
    ['Concorrência eletrônica', 'Obra de pavimentação urbana', 'sessão em 21 dias', false],
    ['Pregão eletrônico', 'Locação de equipamentos', 'sessão em 9 dias', true],
    ['Dispensa eletrônica', 'Material de consumo', 'propostas em 3 dias', false],
  ];
  return (
    <div className="w-full max-w-[470px]">
      <motion.div {...entra(0.1)} className="flex flex-wrap items-center gap-2">
        {['segmento da empresa', 'UF e região', 'valor estimado'].map((f) => (
          <span key={f} className="rotulo rounded-full border border-sinal/40 px-2.5 py-1 text-[9px] text-sinal">{f}</span>
        ))}
      </motion.div>
      <div className="mt-4 grid gap-2.5">
        {editais.map(([mod, obj, prazo, ok], i) => (
          <motion.div
            key={obj}
            {...entra(0.5 + i * 0.55)}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px]',
              ok ? 'border-sinal/50 bg-white/[0.09] text-white' : 'border-white/10 bg-white/[0.03] text-white/55'
            )}
          >
            <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold', ok ? 'bg-sinal text-tinta' : 'bg-white/10 text-white/60')}>
              {ok ? '✓' : '–'}
            </span>
            <span className="min-w-0 flex-1 leading-snug">
              <span className="rotulo block text-[8.5px] text-cinza-escuro">{mod}</span>
              <span className="block truncate">{obj}</span>
            </span>
            <span className="num shrink-0 text-[11px] text-cinza-escuro max-[420px]:hidden">{prazo}</span>
          </motion.div>
        ))}
      </div>
      <motion.p {...entra(3.1)} className="rotulo m-0 mt-4 text-center text-[9.5px] text-white/70">
        2 editais aderentes · seguem para parecer
      </motion.p>
    </div>
  );
}

function Parecer() {
  const linhas: [string, string, 'ok' | 'alerta' | 'risco'][] = [
    ['Habilitação técnica', 'atestados compatíveis', 'ok'],
    ['Qualificação econômica', 'índices dentro do exigido', 'ok'],
    ['Exigência restritiva', 'marca específica sem justificativa', 'risco'],
    ['Prazo de impugnação', 'até 3 dias úteis antes da sessão', 'alerta'],
  ];
  const cor = { ok: 'bg-[#5ee0a0]', alerta: 'bg-madeira', risco: 'bg-alerta' };
  return (
    <div className="relative w-full max-w-[460px] rounded-2xl bg-white p-5 text-grafite shadow-2xl sm:p-6">
      <div className="rotulo text-[10px] text-marca">Matriz de riscos do edital</div>
      <div className="mt-4 grid gap-2.5">
        {linhas.map(([k, v, s], i) => (
          <motion.div
            key={k}
            {...entra(0.25 + i * 0.45)}
            className="grid grid-cols-[0.6rem_minmax(0,1fr)] items-start gap-3 border-t border-papel-2 pt-2.5 text-[13px] leading-snug"
          >
            <span className={cn('mt-1.5 h-2 w-2 rounded-full', cor[s])} />
            <span>
              <b className="font-semibold">{k}</b>
              <span className="block text-cinza">{v}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div {...entra(2.4)} className="mt-4 rounded-lg border-l-2 border-marca bg-marca/5 px-3 py-2 text-[12px] text-marca">
        Recomendação: impugnar a exigência restritiva e participar.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 1.8, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: -9 }}
        transition={{ delay: 3.2, type: 'spring', stiffness: 260, damping: 16 }}
        className="expandida absolute -right-2 -top-4 rounded-md border-2 border-marca bg-white px-3 py-1.5 text-[11.5px] font-[800] tracking-[0.1em] text-marca sm:-right-6"
      >
        GO · COM RESSALVA
      </motion.div>
    </div>
  );
}

function Habilitacao() {
  const docs: [string, string][] = [
    ['Certidões fiscais e trabalhistas', 'válidas até a sessão'],
    ['Balanço e índices contábeis', 'conferidos com o edital'],
    ['Atestados de capacidade técnica', 'parcelas relevantes'],
    ['Declarações exigidas', 'assinadas e datadas'],
  ];
  return (
    <div className="w-full max-w-[440px]">
      <div className="grid gap-2.5">
        {docs.map(([t, d], i) => (
          <motion.div
            key={t}
            {...entra(0.3 + i * 0.6)}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[13.5px] text-white"
          >
            <motion.span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sinal text-[13px] font-bold text-tinta"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.6, type: 'spring', stiffness: 400, damping: 15 }}
            >
              ✓
            </motion.span>
            <span className="leading-snug">
              {t}
              <span className="block text-[11.5px] text-cinza-escuro">{d}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        {...entra(3.1)}
        className="expandida mt-6 text-center text-[clamp(1.5rem,4vw,2.2rem)] font-[800] tracking-[-0.02em] text-white"
      >
        Pronta para a sessão<span className="text-sinal">.</span>
      </motion.div>
    </div>
  );
}

function Sessao() {
  const log: [string, string, boolean][] = [
    ['10:02', 'Fase de lances encerrada', false],
    ['10:41', 'Pregoeiro pede demonstração da exequibilidade', false],
    ['11:30', 'Planilha de custos e justificativa jurídica enviadas', true],
    ['14:15', 'Proposta aceita · habilitação em análise', true],
  ];
  return (
    <div className="w-full max-w-[470px] rounded-[22px] border border-white/10 bg-[#0e0d33] p-4 shadow-2xl sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="rotulo text-[9.5px] text-cinza-escuro">Sala da disputa · registro</span>
        <span className="rotulo flex items-center gap-1.5 text-[9.5px] text-[#5ee0a0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5ee0a0]" /> em sessão
        </span>
      </div>
      <div className="mt-3 grid gap-2.5">
        {log.map(([h, t, nosso], i) => (
          <motion.div key={h} {...entra(0.3 + i * 0.75)} className="grid grid-cols-[2.8rem_minmax(0,1fr)] gap-3 text-[13px] leading-snug">
            <span className="num pt-0.5 text-[11px] text-cinza-escuro">{h}</span>
            <span className={cn('rounded-lg px-3 py-2', nosso ? 'bg-marca text-white' : 'bg-white/10 text-white')}>{t}</span>
          </motion.div>
        ))}
      </div>
      <motion.div {...entra(3.6)} className="mt-3 rounded-lg border border-sinal/30 px-3 py-2 text-[12px] text-sinal">
        Base: art. 59, § 2º, da Lei 14.133/2021 (diligência sobre exequibilidade)
      </motion.div>
    </div>
  );
}

function Recurso() {
  const dias = ['Ata', '1º dia útil', '2º dia útil', '3º dia útil'];
  return (
    <div className="w-full max-w-[470px] rounded-xl bg-[#fbfbfe] p-5 text-grafite shadow-2xl sm:p-7">
      <div className="rotulo text-[9.5px] text-cinza">Prazo recursal · art. 165, I</div>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {dias.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.4 }}
            className={cn(
              'rounded-md px-1.5 py-2 text-center text-[10.5px] font-semibold leading-tight',
              i === 0 ? 'bg-papel text-cinza' : i === 3 ? 'bg-alerta/15 text-alerta' : 'bg-marca/10 text-marca'
            )}
          >
            {d}
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid gap-3">
        {[
          ['Intenção de recorrer', 'manifestada na sessão (art. 165, § 1º, I)'],
          ['Razões do recurso', 'protocoladas no 2º dia útil'],
          ['Contrarrazões', 'mesmo prazo, a contar da divulgação (§ 4º)'],
        ].map(([t, d], i) => (
          <motion.div key={t} {...entra(1.6 + i * 0.6)} className="flex items-start gap-3 text-[12.5px] leading-snug">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-marca text-[10px] font-bold text-white">✓</span>
            <span>
              <b className="font-semibold">{t}</b>
              <span className="block text-cinza">{d}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div {...entra(3.7)} className="mt-4 rounded-lg border-l-2 border-marca bg-marca/5 px-3 py-2 text-[12px] text-marca">
        Se a ilegalidade persistir: mandado de segurança, com pedido liminar.
      </motion.div>
    </div>
  );
}

function Contrato() {
  const marcos: [string, string][] = [
    ['Assinatura', 'contrato e garantia'],
    ['1º aditivo', 'acréscimo de quantitativos'],
    ['Repactuação', 'convenção coletiva nova'],
    ['Reequilíbrio', 'IBS e CBS · LC 214/2025'],
  ];
  return (
    <div className="grid w-full max-w-[520px] gap-4 sm:grid-cols-[1.1fr_0.9fr]">
      <motion.div {...entra(0.2)} className="rounded-xl bg-white p-4 text-grafite shadow-2xl">
        <div className="rotulo text-[9.5px] text-cinza">Vida do contrato</div>
        <ol className="m-0 mt-3 grid list-none gap-0 p-0">
          {marcos.map(([t, d], i) => (
            <motion.li key={t} {...entra(0.5 + i * 0.5)} className="relative border-l-2 border-marca/25 pb-3 pl-4 last:pb-0">
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-marca" />
              <b className="block text-[12.5px] font-semibold leading-tight">{t}</b>
              <span className="block text-[11.5px] text-cinza">{d}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
      <motion.div {...entra(1.2)} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-4 text-white">
        <div className="rotulo text-[9.5px] text-cinza-escuro">Equação do contrato</div>
        <div className="expandida mt-2 text-[1.5rem] font-[800] leading-none sm:text-[1.8rem]">Preservada</div>
        <div className="mt-1 text-[12px] text-cinza-escuro">pedido instruído com memória de cálculo</div>
        <div className="mt-auto flex h-16 items-end gap-1.5 pt-4 sm:h-20" aria-hidden="true">
          {[34, 34, 22, 34, 34].map((h, i) => (
            <span key={i} className="flex flex-1 flex-col items-center gap-1">
              <motion.span
                className={cn('w-full rounded-t', i === 2 ? 'bg-madeira' : i > 2 ? 'bg-sinal' : 'bg-white/25')}
                initial={{ height: 0 }}
                animate={{ height: i === 2 ? [0, 22, 34] : h }}
                transition={{ delay: 1.5 + i * 0.15, duration: i === 2 ? 1.6 : 0.5 }}
              />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
