'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarCheck2, MessageCircle, X } from 'lucide-react';
import { isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Interruptor } from '../ui/interruptor';
import { Avatar } from '../ui/avatar';
import { EsqueletoTela, EstadoVazio } from '../ui/vazio';
import { Calendario, type MarcaDia } from '../calendario';
import { ICONE_PRAZO, SeloPrazo, corUrgencia } from '../rotulos';
import { SeletorPapel } from '@/components/auth/seletor-papel';
import { clientePorId, processoPorId, usuarioPorId, type Prazo, type TipoPrazo } from '@/lib/demo/dados';
import { dataLonga, diasAte, hora, urgencia } from '@/lib/demo/formato';

const ROTULO_TIPO: Record<TipoPrazo, string> = { prazo: 'Prazo processual', audiencia: 'Audiência', reuniao: 'Reunião' };

export function TelaPrazos() {
  const d = useDemo();
  const [dia, setDia] = React.useState<Date | undefined>();
  const [tipo, setTipo] = React.useState<'todos' | TipoPrazo>('todos');
  const [meus, setMeus] = React.useState(false);
  const [avisos, setAvisos] = React.useState<Record<string, boolean>>({});
  const [cumpridos, setCumpridos] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (d) setAvisos(Object.fromEntries(d.prazos.map((p) => [p.id, p.avisarWhatsapp])));
  }, [d]);

  if (!d) return <EsqueletoTela />;

  const marcas: MarcaDia[] = d.prazos.map((p) => ({
    data: p.data,
    tom: urgencia(p.data, d.hoje) === 'critico' || urgencia(p.data, d.hoje) === 'vencido' ? 'perigo' : p.tipo === 'prazo' ? 'ambar' : 'marca',
    rotulo: p.titulo,
  }));

  const lista = d.prazos.filter((p) => (tipo === 'todos' || p.tipo === tipo) && (!meus || p.responsavelId === d.eu.id) && (!dia || isSameDay(p.data, dia)) && diasAte(p.data, d.hoje) >= 0);
  const grupos: { titulo: string; itens: Prazo[] }[] = [];
  for (const p of lista) {
    const n = diasAte(p.data, d.hoje);
    const titulo = n <= 1 ? 'Hoje e amanhã' : n <= 7 ? 'Próximos 7 dias' : 'Mais adiante';
    const g = grupos.find((x) => x.titulo === titulo);
    if (g) g.itens.push(p);
    else grupos.push({ titulo, itens: [p] });
  }
  const ligados = Object.values(avisos).filter(Boolean).length;

  return (
    <>
      <CabecalhoTela
        titulo="Prazos"
        destaque="e audiências"
        subtitulo={`${d.prazos.length} compromissos abertos · aviso no WhatsApp ligado em ${ligados}. Prazos contados em dias úteis.`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] [&>*]:min-w-0">
        <div className="grid h-fit gap-4 lg:sticky lg:top-[108px]">
          <Cartao className="p-4 sm:p-5">
            <Calendario hoje={d.hoje} selecionado={dia} aoSelecionar={setDia} marcas={marcas} />
          </Cartao>
          <Cartao className="grid gap-3 p-4 text-[12.5px] text-(--s-muted)">
            <p className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-(--s-ok)" aria-hidden />
              <span>
                Com o aviso ligado, a <strong className="font-medium text-(--s-fg)">Iris</strong> manda mensagem ao responsável em D-3 e no dia do vencimento, às 8h. Na demonstração nada é enviado.
              </span>
            </p>
          </Cartao>
        </div>

        <Cartao className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-(--s-border) p-3">
            <SeletorPapel
              className="w-full sm:w-auto sm:min-w-[400px]"
              compacto
              rotulo="Tipo de compromisso"
              valor={tipo}
              aoMudar={(v) => setTipo(v as typeof tipo)}
              opcoes={[
                { value: 'todos', label: 'Todos' },
                { value: 'prazo', label: 'Prazos' },
                { value: 'audiencia', label: 'Audiências' },
                { value: 'reuniao', label: 'Reuniões' },
              ]}
            />
            <label className="flex items-center gap-2 text-[12.5px] text-(--s-fg-2)">
              <Interruptor tamanho="sm" ligado={meus} aoMudar={setMeus} rotulo="Mostrar só os meus" />
              Só os meus
            </label>
            {dia && (
              <Botao variante="secundario" tamanho="sm" onClick={() => setDia(undefined)} className="ml-auto">
                {dataLonga(dia)} <X />
              </Botao>
            )}
          </div>

          {grupos.length === 0 ? (
            <EstadoVazio icone={<CalendarCheck2 />} titulo={dia ? 'Nenhum prazo neste dia' : 'Nenhum prazo com esses filtros'} texto="Bom sinal. Escolha outro dia no calendário ou limpe os filtros." />
          ) : (
            grupos.map((g) => (
              <section key={g.titulo} aria-label={g.titulo}>
                <h2 className="f-mono sticky top-[92px] z-10 border-b border-(--s-border) bg-(--s-card-2)/95 px-4 py-2 text-[10.5px] tracking-[0.12em] text-(--s-faint) uppercase backdrop-blur">
                  {g.titulo} · {g.itens.length}
                </h2>
                <ul className="divide-y divide-(--s-border)">
                  <AnimatePresence initial={false}>
                    {g.itens.map((z) => {
                      const p = processoPorId(d, z.processoId)!;
                      const u = usuarioPorId(d, z.responsavelId)!;
                      const Icone = ICONE_PRAZO[z.tipo];
                      const feito = cumpridos.has(z.id);
                      return (
                        <motion.li key={z.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn('relative flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 xl:flex-nowrap', feito && 'opacity-55')}>
                          <span aria-hidden className="absolute top-3 bottom-3 left-0 w-[3px] rounded-r-full" style={{ background: corUrgencia(urgencia(z.data, d.hoje)) }} />
                          <div className="grid w-[74px] shrink-0 justify-items-start gap-1">
                            <SeloPrazo data={z.data} hoje={d.hoje} />
                            <span className="f-mono text-[11px] text-(--s-faint)">{z.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}{z.tipo !== 'prazo' && ` ${hora(z.data)}`}</span>
                          </div>
                          <div className="min-w-0 flex-1 basis-[240px]">
                            <p className={cn('flex items-center gap-1.5 text-[13.5px] font-medium', feito && 'line-through')}>
                              <Icone className="size-3.5 shrink-0 text-(--s-faint)" aria-hidden />
                              <span className="truncate">{z.titulo}</span>
                            </p>
                            <p className="truncate text-[12px] text-(--s-muted)">
                              {clientePorId(d, p.clienteId)?.nome} · <span className="f-mono text-[11px]">{p.cnj}</span>
                            </p>
                            <p className="text-[11px] text-(--s-faint)">{ROTULO_TIPO[z.tipo]} · {p.tribunal} ({p.sistema})</p>
                          </div>
                          <div className="flex w-full items-center gap-4 sm:pl-[90px] xl:w-auto xl:pl-0">
                            <span className="flex items-center gap-1.5 text-[12px] text-(--s-muted)">
                              <Avatar nome={u.nome} iniciais={u.iniciais} tamanho="xs" />
                              <span className="hidden sm:inline">{u.nome.split(' ')[0]}</span>
                            </span>
                            <label className="flex items-center gap-2 text-[12px] whitespace-nowrap text-(--s-fg-2)">
                              <Interruptor tamanho="sm" ligado={!!avisos[z.id]} aoMudar={(v) => setAvisos((a) => ({ ...a, [z.id]: v }))} rotulo={`Avisar no WhatsApp: ${z.titulo}`} />
                              <MessageCircle className={cn('size-3.5', avisos[z.id] ? 'text-(--s-ok)' : 'text-(--s-faint)')} aria-hidden />
                              <span>WhatsApp</span>
                            </label>
                            <Botao
                              variante="fantasma"
                              tamanho="sm"
                              className="ml-auto xl:ml-0"
                              aria-pressed={feito}
                              onClick={() =>
                                setCumpridos((s) => {
                                  const n = new Set(s);
                                  if (n.has(z.id)) n.delete(z.id);
                                  else n.add(z.id);
                                  return n;
                                })
                              }
                            >
                              <CalendarCheck2 /> {feito ? 'Desfazer' : 'Cumprido'}
                            </Botao>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </section>
            ))
          )}
        </Cartao>
      </div>
    </>
  );
}
