'use client';

/* Quadro kanban — porte do Kanban Board (21st.dev 26936, @uvain):
   arrastar com o ponteiro (o cartão "flutua" e um espaço marca onde vai cair),
   teclado (Espaço/Enter pega, setas movem, Esc cancela) com anúncio para
   leitor de tela. Clique sem arrastar abre o detalhe. */

import * as React from 'react';
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type ColunaKanban<T> = { id: string; nome: string; tom: 'marca' | 'ambar' | 'ok' | 'perigo' | 'neutro'; itens: T[] };

type Arrasto = { id: string; deCol: string; largura: number; altura: number; dx: number; dy: number; x0: number; y0: number; ativo: boolean };
type Vaga = { col: string; indice: number };

const PONTO = { marca: 'bg-(--s-primary)', ambar: 'bg-(--s-amber)', ok: 'bg-(--s-ok)', perigo: 'bg-(--s-danger)', neutro: 'bg-(--s-faint)' };
const LIMIAR = 5;

export function Kanban<T extends { id: string }>({
  colunas,
  aoMudar,
  renderCartao,
  rodapeColuna,
  aoAbrir,
  titulo,
  rotuloItem,
}: {
  colunas: ColunaKanban<T>[];
  aoMudar: (c: ColunaKanban<T>[]) => void;
  renderCartao: (item: T, flutuando?: boolean) => React.ReactNode;
  rodapeColuna?: (c: ColunaKanban<T>) => React.ReactNode;
  aoAbrir: (item: T) => void;
  titulo: string;
  rotuloItem: (item: T) => string;
}) {
  const reduzido = useReducedMotion();
  const [arrasto, setArrasto] = React.useState<Arrasto | null>(null);
  const [vaga, setVaga] = React.useState<Vaga | null>(null);
  const [pego, setPego] = React.useState<string | null>(null);
  const [anuncio, setAnuncio] = React.useState('');
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const refArrasto = React.useRef<Arrasto | null>(null);
  const refVaga = React.useRef<Vaga | null>(null);
  const colRefs = React.useRef(new Map<string, HTMLDivElement>());
  const listaRefs = React.useRef(new Map<string, HTMLDivElement>());
  const cartaoRefs = React.useRef(new Map<string, HTMLDivElement>());
  const origem = React.useRef<Vaga | null>(null);

  const localizar = React.useCallback(
    (lista: ColunaKanban<T>[], id: string) => {
      for (const c of lista) {
        const i = c.itens.findIndex((t) => t.id === id);
        if (i > -1) return { col: c.id, indice: i, item: c.itens[i] };
      }
      return null;
    },
    [],
  );

  const mover = React.useCallback(
    (id: string, para: Vaga) => {
      const achado = localizar(colunas, id);
      if (!achado) return;
      if (achado.col === para.col && achado.indice === para.indice) return;
      const prox = colunas.map((c) => ({ ...c, itens: [...c.itens] }));
      prox.find((c) => c.id === achado.col)!.itens.splice(achado.indice, 1);
      const dest = prox.find((c) => c.id === para.col)!;
      dest.itens.splice(Math.min(para.indice, dest.itens.length), 0, achado.item);
      aoMudar(prox);
    },
    [colunas, aoMudar, localizar],
  );

  React.useEffect(() => {
    if (!pego) return;
    const el = cartaoRefs.current.get(pego);
    if (el && document.activeElement !== el) el.focus({ preventScroll: false });
  }, [colunas, pego]);

  const vagaEm = (cx: number, cy: number, id: string): Vaga | null => {
    let dentro = '';
    let perto = '';
    let menor = Infinity;
    colRefs.current.forEach((el, cid) => {
      const r = el.getBoundingClientRect();
      if (cx >= r.left && cx <= r.right) dentro = cid;
      const dx = Math.abs(cx - (r.left + r.width / 2));
      if (dx < menor) {
        menor = dx;
        perto = cid;
      }
    });
    const col = dentro || perto;
    const lista = listaRefs.current.get(col);
    if (!lista) return null;
    const cards = Array.from(lista.querySelectorAll<HTMLElement>('[data-cartao]')).filter((el) => el.dataset.cartao !== id);
    let indice = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (cy < r.top + r.height / 2) {
        indice = i;
        break;
      }
    }
    return { col, indice };
  };

  React.useEffect(() => {
    if (!arrasto) return;
    const aoMover = (e: PointerEvent) => {
      const a = refArrasto.current;
      if (!a) return;
      if (!a.ativo) {
        if (Math.hypot(e.clientX - a.x0, e.clientY - a.y0) < LIMIAR) return;
        a.ativo = true;
        setArrasto({ ...a });
      }
      x.set(e.clientX - a.dx);
      y.set(e.clientY - a.dy);
      const v = vagaEm(e.clientX, e.clientY, a.id);
      const atual = refVaga.current;
      if (v && (!atual || atual.col !== v.col || atual.indice !== v.indice)) {
        refVaga.current = v;
        setVaga(v);
      }
    };
    const aoSoltar = () => {
      const a = refArrasto.current;
      const v = refVaga.current;
      if (a?.ativo && v) {
        mover(a.id, v);
        const nome = colunas.find((c) => c.id === v.col)?.nome;
        const it = localizar(colunas, a.id)?.item;
        if (it) setAnuncio(`${rotuloItem(it)} movido para ${nome}.`);
      } else if (a && !a.ativo) {
        const it = localizar(colunas, a.id)?.item;
        if (it) aoAbrir(it);
      }
      refArrasto.current = null;
      refVaga.current = null;
      setArrasto(null);
      setVaga(null);
    };
    window.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);
    window.addEventListener('pointercancel', aoSoltar);
    return () => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
      window.removeEventListener('pointercancel', aoSoltar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrasto, colunas]);

  const iniciar = (e: React.PointerEvent, item: T, col: string) => {
    if (e.button !== 0 || e.pointerType === 'touch') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const a: Arrasto = { id: item.id, deCol: col, largura: r.width, altura: r.height, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, ativo: false };
    x.set(r.left);
    y.set(r.top);
    refArrasto.current = a;
    setArrasto(a);
  };

  const teclar = (e: React.KeyboardEvent, item: T) => {
    const estaPego = pego === item.id;
    const at = localizar(colunas, item.id);
    if (!at) return;
    if (e.key === 'Enter' && !estaPego) {
      e.preventDefault();
      aoAbrir(item);
      return;
    }
    if (e.key === ' ' || (e.key === 'Enter' && estaPego)) {
      e.preventDefault();
      if (estaPego) {
        setPego(null);
        setAnuncio(`${rotuloItem(item)} solto em ${colunas.find((c) => c.id === at.col)?.nome}.`);
      } else {
        origem.current = { col: at.col, indice: at.indice };
        setPego(item.id);
        setAnuncio(`${rotuloItem(item)} selecionado. Use as setas para mover e Espaço para soltar.`);
      }
      return;
    }
    if (e.key === 'Escape' && estaPego) {
      e.preventDefault();
      if (origem.current) mover(item.id, origem.current);
      setPego(null);
      setAnuncio('Movimento cancelado.');
      return;
    }
    if (!estaPego) return;
    const ci = colunas.findIndex((c) => c.id === at.col);
    let para: Vaga | null = null;
    if (e.key === 'ArrowUp') para = { col: at.col, indice: Math.max(0, at.indice - 1) };
    if (e.key === 'ArrowDown') para = { col: at.col, indice: Math.min(colunas[ci].itens.length - 1, at.indice + 1) };
    if (e.key === 'ArrowLeft' && ci > 0) para = { col: colunas[ci - 1].id, indice: Math.min(at.indice, colunas[ci - 1].itens.length) };
    if (e.key === 'ArrowRight' && ci < colunas.length - 1) para = { col: colunas[ci + 1].id, indice: Math.min(at.indice, colunas[ci + 1].itens.length) };
    if (para) {
      e.preventDefault();
      mover(item.id, para);
      setAnuncio(`Movido para ${colunas.find((c) => c.id === para!.col)?.nome}, posição ${para.indice + 1}.`);
    }
  };

  const arrastando = arrasto?.ativo ? arrasto : null;
  const flutuante = arrastando ? localizar(colunas, arrastando.id)?.item : undefined;

  return (
    <div className={cn('w-full', arrastando && 'cursor-grabbing select-none')}>
      <p id="kanban-ajuda" className="sr-only">
        Cartões: Enter abre o detalhe. Espaço pega o cartão; setas movem entre colunas; Espaço solta; Esc cancela.
      </p>
      <div role="group" aria-label={titulo} className="rolagem relative -mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        <LayoutGroup>
          {colunas.map((c) => {
            const alvo = vaga?.col === c.id && !!arrastando;
            const itens = c.itens.filter((t) => t.id !== arrastando?.id);
            return (
              <div
                key={c.id}
                ref={(el) => {
                  if (el) colRefs.current.set(c.id, el);
                  else colRefs.current.delete(c.id);
                }}
                className={cn('w-[82vw] max-w-[300px] shrink-0 snap-start rounded-2xl p-2.5 ring-1 ring-inset transition-colors sm:w-[288px]', alvo ? 'bg-(--s-accent) ring-(--s-primary)/40' : 'bg-(--s-card)/60 ring-(--s-border)')}
              >
                <div className="flex items-center gap-2 px-1.5 pt-1">
                  <span className={cn('size-2 shrink-0 rounded-full', PONTO[c.tom])} />
                  <h3 className="truncate text-[13px] font-medium">{c.nome}</h3>
                  <span className="f-mono rounded-full bg-(--s-elev) px-1.5 text-[10.5px] text-(--s-muted) tabular-nums">
                    {c.itens.length - (arrastando?.deCol === c.id ? 1 : 0) + (alvo ? 1 : 0)}
                  </span>
                </div>
                {rodapeColuna && <div className="px-1.5 pt-1">{rodapeColuna(c)}</div>}
                <div
                  ref={(el) => {
                    if (el) listaRefs.current.set(c.id, el);
                    else listaRefs.current.delete(c.id);
                  }}
                  className="mt-2.5 flex min-h-16 flex-col gap-2"
                >
                  {itens.map((t, i) => (
                    <React.Fragment key={t.id}>
                      {alvo && vaga!.indice === i && <Espaco altura={arrastando!.altura} />}
                      <motion.div
                        layout={!reduzido}
                        layoutId={t.id}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        ref={(el) => {
                          if (el) cartaoRefs.current.set(t.id, el);
                          else cartaoRefs.current.delete(t.id);
                        }}
                        data-cartao={t.id}
                        role="button"
                        tabIndex={0}
                        aria-describedby="kanban-ajuda"
                        aria-pressed={pego === t.id}
                        onPointerDown={(e) => iniciar(e, t, c.id)}
                        onClick={(e) => {
                          // toque (celular) não arrasta: abre direto
                          if ((e.nativeEvent as PointerEvent).pointerType === 'touch') aoAbrir(t);
                        }}
                        onKeyDown={(e) => teclar(e, t)}
                        className={cn('cursor-grab rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-(--s-ring)', pego === t.id && 'ring-2 ring-(--s-amber)')}
                      >
                        {renderCartao(t)}
                      </motion.div>
                    </React.Fragment>
                  ))}
                  {alvo && vaga!.indice >= itens.length && <Espaco altura={arrastando!.altura} />}
                  {itens.length === 0 && !alvo && <p className="rounded-xl border border-dashed border-(--s-border-2) px-3 py-5 text-center text-[12px] text-(--s-faint)">Arraste um cartão para cá</p>}
                </div>
              </div>
            );
          })}
        </LayoutGroup>
      </div>

      <AnimatePresence>
        {arrastando && flutuante && (
          <motion.div
            style={{ x, y, width: arrastando.largura }}
            initial={{ scale: 1, rotate: 0 }}
            animate={{ scale: reduzido ? 1 : 1.03, rotate: reduzido ? 0 : 1.5 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed top-0 left-0 z-[80] origin-top-left shadow-(--s-shadow)"
          >
            {renderCartao(flutuante, true)}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" role="status" aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}

function Espaco({ altura }: { altura: number }) {
  return <div aria-hidden style={{ height: altura }} className="rounded-xl border-2 border-dashed border-(--s-primary)/45 bg-(--s-primary)/6" />;
}
