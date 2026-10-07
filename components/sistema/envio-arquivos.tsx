'use client';

/* Envio de documentos — porte enxuto do File Upload (21st.dev 27137, @uvain):
   arrastar e soltar ou escolher, recusa tipo errado e arquivo grande com
   mensagem clara, barra de progresso. SÓ INTERFACE: o arquivo nunca sai do
   navegador; o "envio" é simulado. */

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, FileText, TriangleAlert, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = { id: string; nome: string; tamanho: number; progresso: number; erro?: string };

const TIPOS = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX = 20 * 1024 * 1024;
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export function EnvioArquivos({ rotulo = 'Enviar documentos', className }: { rotulo?: string; className?: string }) {
  const [itens, setItens] = React.useState<Item[]>([]);
  const [sobre, setSobre] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const timers = React.useRef<ReturnType<typeof setInterval>[]>([]);
  const id = React.useId();

  React.useEffect(() => () => timers.current.forEach(clearInterval), []);

  const adicionar = (lista: FileList | null) => {
    if (!lista) return;
    const novos: Item[] = Array.from(lista).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      nome: f.name,
      tamanho: f.size,
      progresso: 0,
      erro: !TIPOS.includes(f.type) ? 'Formato não aceito. Envie PDF, JPG ou PNG.' : f.size > MAX ? 'Arquivo acima de 20 MB. Divida em partes ou comprima.' : undefined,
    }));
    setItens((s) => [...novos, ...s]);
    novos
      .filter((n) => !n.erro)
      .forEach((n) => {
        const t = setInterval(() => {
          setItens((s) => s.map((x) => (x.id === n.id ? { ...x, progresso: Math.min(100, x.progresso + 9 + Math.random() * 18) } : x)));
        }, 160);
        timers.current.push(t);
        setTimeout(() => clearInterval(t), 2600);
      });
  };

  return (
    <div className={cn('grid gap-3', className)}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSobre(false);
          adicionar(e.dataTransfer.files);
        }}
        className={cn(
          'group relative grid cursor-pointer place-items-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-(--s-ring)',
          sobre ? 'border-(--s-primary) bg-(--s-primary)/10' : 'border-(--s-border-2) bg-(--s-card-2) hover:border-(--s-primary)/60',
        )}
      >
        <motion.span animate={sobre ? { y: -4, scale: 1.06 } : { y: 0, scale: 1 }} className="grid size-11 place-items-center rounded-xl bg-(--s-accent) text-(--s-primary)">
          <UploadCloud className="size-5" aria-hidden />
        </motion.span>
        <span className="text-[13.5px] font-medium">{sobre ? 'Solte para anexar' : rotulo}</span>
        <span className="text-[12px] text-(--s-muted)">Arraste aqui ou toque para escolher · PDF, JPG ou PNG até 20 MB</span>
        <input ref={input} id={id} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { adicionar(e.target.files); e.target.value = ''; }} />
      </label>

      <ul className="grid gap-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {itens.map((it) => {
            const pronto = !it.erro && it.progresso >= 100;
            return (
              <motion.li key={it.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-inset', it.erro ? 'bg-(--s-danger)/8 ring-(--s-danger)/30' : 'bg-(--s-card) ring-(--s-border)')}>
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', it.erro ? 'text-(--s-danger)' : pronto ? 'text-(--s-ok)' : 'text-(--s-primary)')}>
                    {it.erro ? <TriangleAlert className="size-4" /> : pronto ? <CheckCircle2 className="size-4" /> : <FileText className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{it.nome}</p>
                    {it.erro ? (
                      <p className="text-[11.5px] text-(--s-danger)">{it.erro}</p>
                    ) : pronto ? (
                      <p className="text-[11.5px] text-(--s-muted)">{kb(it.tamanho)} · pronto — demonstração: nada foi enviado</p>
                    ) : (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-(--s-elev)" role="progressbar" aria-valuenow={Math.round(it.progresso)} aria-valuemin={0} aria-valuemax={100} aria-label={`Preparando ${it.nome}`}>
                        <motion.div className="h-full rounded-full bg-(--s-primary)" animate={{ width: `${it.progresso}%` }} transition={{ ease: 'linear', duration: 0.15 }} />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setItens((s) => s.filter((x) => x.id !== it.id))} aria-label={`Remover ${it.nome}`} className="grid size-7 place-items-center rounded-md text-(--s-faint) hover:bg-(--s-accent) hover:text-(--s-fg)">
                    <X className="size-3.5" />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
