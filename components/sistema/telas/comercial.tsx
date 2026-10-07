'use client';

import * as React from 'react';
import { CalendarPlus, Globe, Mail, MessageCircle, Phone, Target, TrendingUp, UserPlus, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Botao } from '../ui/botao';
import { Selo } from '../ui/selo';
import { Avatar } from '../ui/avatar';
import { Gaveta } from '../ui/gaveta';
import { Selecao } from '../ui/selecao';
import { Rotulo } from '../ui/campo';
import { EsqueletoTela } from '../ui/vazio';
import { CartaoKpi } from '../graficos';
import { Kanban, type ColunaKanban } from '../kanban';
import { ETAPAS, usuarioPorId, type EtapaLead, type Interesse, type Lead } from '@/lib/demo/dados';
import { dataCompleta, hora, moeda, relativo } from '@/lib/demo/formato';

const INTERESSE: Record<Interesse, { rotulo: string; tom: 'marca' | 'ambar' | 'neutro' }> = {
  tributario: { rotulo: 'Tributário', tom: 'ambar' },
  licitacoes: { rotulo: 'Licitações', tom: 'marca' },
  outro: { rotulo: 'Outro assunto', tom: 'neutro' },
};
const TOM_ETAPA: Record<EtapaLead, ColunaKanban<Lead>['tom']> = { novo: 'marca', diagnostico: 'ambar', proposta: 'ambar', fechado: 'ok', perdido: 'perigo' };

export function TelaComercial() {
  const d = useDemo();
  const [colunas, setColunas] = React.useState<ColunaKanban<Lead>[]>([]);
  const [aberto, setAberto] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    if (!d) return;
    setColunas(ETAPAS.map((e) => ({ id: e.id, nome: e.rotulo, tom: TOM_ETAPA[e.id], itens: d.leads.filter((l) => l.etapa === e.id).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()) })));
  }, [d]);

  if (!d || colunas.length === 0) return <EsqueletoTela />;

  const todos = colunas.flatMap((c) => c.itens.map((l) => ({ ...l, etapa: c.id as EtapaLead })));
  const fechados = todos.filter((l) => l.etapa === 'fechado').length;
  const decididos = fechados + todos.filter((l) => l.etapa === 'perdido').length;
  const pipeline = todos.filter((l) => l.etapa === 'diagnostico' || l.etapa === 'proposta').reduce((s, l) => s + (l.valorEstimado ?? 0), 0);
  const etapaDe = (id: string) => (colunas.find((c) => c.itens.some((l) => l.id === id))?.id ?? 'novo') as EtapaLead;
  const moverPara = (lead: Lead, etapa: EtapaLead) => {
    const prox = colunas.map((c) => ({ ...c, itens: c.itens.filter((l) => l.id !== lead.id) }));
    prox.find((c) => c.id === etapa)!.itens.unshift(lead);
    setColunas(prox);
  };

  const cartao = (l: Lead, flutuando?: boolean) => {
    const u = usuarioPorId(d, l.responsavelId);
    const novo = etapaDe(l.id) === 'novo';
    return (
      <div className={cn('grid gap-2.5 rounded-xl bg-(--s-bg-2) p-3 ring-1 ring-(--s-border) transition-[box-shadow] hover:ring-(--s-border-2)', flutuando && 'ring-(--s-primary)/60')}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium">{l.nome}</p>
            <p className="truncate text-[12px] text-(--s-muted)">{l.empresa}</p>
          </div>
          {novo && <span className="f-mono shrink-0 rounded bg-(--s-primary)/15 px-1.5 py-px text-[9.5px] tracking-[0.1em] text-(--s-primary) uppercase">novo</span>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Selo tom={INTERESSE[l.interesse].tom}>{INTERESSE[l.interesse].rotulo}</Selo>
          <span className="f-mono inline-flex items-center gap-1 truncate text-[10.5px] text-(--s-faint)">
            <Globe className="size-3" aria-hidden /> {l.origem.pagina}
            {l.origem.utm_source && ` · ${l.origem.utm_source}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-(--s-border) pt-2 text-[11.5px] text-(--s-faint)">
          <span className="flex items-center gap-1.5">
            <Phone className="size-3" aria-hidden />
            <span className="f-mono">{l.telefone}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {l.valorEstimado ? <span className="f-mono text-(--s-fg-2)">{moeda(l.valorEstimado, { compacto: true })}</span> : <span>{relativo(l.criadoEm, d.agora)}</span>}
            {u && <Avatar nome={u.nome} iniciais={u.iniciais} tamanho="xs" />}
          </span>
        </div>
      </div>
    );
  };

  const u = aberto ? usuarioPorId(d, aberto.responsavelId) : undefined;
  const etapaAberto = aberto ? etapaDe(aberto.id) : 'novo';

  return (
    <>
      <CabecalhoTela
        titulo="Comercial"
        subtitulo="Leads do site (formulário de contato e diagnóstico) até o contrato fechado. Arraste os cartões entre as etapas."
        acoes={
          <Botao variante="secundario" disabled title="Na versão final, leads chegam sozinhos do site">
            <UserPlus /> Novo lead
          </Botao>
        }
      />

      <section aria-label="Indicadores do funil" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 [&>*]:min-w-0">
        <CartaoKpi rotulo="Leads em 30 dias" valor={todos.length} delta={0.38} periodo="vs. 30 dias anteriores" icone={<Target />} tendencia={[2, 3, 2, 4, 3, 5, 4, 6, 5, 7]} />
        <CartaoKpi rotulo="Novos sem resposta" valor={colunas[0].itens.length} nota="meta: responder em 2 h" icone={<MessageCircle />} destaque="ambar" />
        <CartaoKpi rotulo="Em negociação" valor={pipeline} formato={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }} nota="diagnóstico + proposta" icone={<Wallet />} />
        <CartaoKpi rotulo="Conversão" valor={decididos ? fechados / decididos : 0} formato={{ style: 'percent', maximumFractionDigits: 0 }} nota={`${fechados} de ${decididos} decididos`} icone={<TrendingUp />} />
      </section>

      <Kanban
        titulo="Funil comercial"
        colunas={colunas}
        aoMudar={setColunas}
        renderCartao={cartao}
        aoAbrir={setAberto}
        rotuloItem={(l) => `${l.nome}, ${l.empresa}`}
        rodapeColuna={(c) => {
          const v = c.itens.reduce((s, l) => s + (l.valorEstimado ?? 0), 0);
          return v ? <p className="f-mono text-[11px] text-(--s-faint)">{moeda(v)} estimados</p> : null;
        }}
      />

      <Gaveta
        aberta={!!aberto}
        aoMudar={(v) => !v && setAberto(null)}
        titulo={aberto?.nome ?? ''}
        descricao={aberto ? `${aberto.empresa} · protocolo ${aberto.protocolo}` : undefined}
        rodape={
          <div className="flex flex-wrap gap-2">
            <Botao variante="secundario" disabled title="Desativado na demonstração">
              <MessageCircle /> Abrir WhatsApp
            </Botao>
            <Botao
              onClick={() => {
                if (aberto) moverPara(aberto, 'diagnostico');
                setAberto(null);
              }}
              disabled={etapaAberto !== 'novo'}
            >
              <CalendarPlus /> Agendar diagnóstico
            </Botao>
          </div>
        }
      >
        {aberto && (
          <div className="grid gap-5 p-5">
            <div className="grid gap-1.5">
              <p className="text-[12.5px] font-medium text-(--s-fg-2)">Etapa</p>
              <Selecao rotulo="Etapa do lead" valor={etapaAberto} aoMudar={(v) => moverPara(aberto, v as EtapaLead)} opcoes={ETAPAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))} className="w-full" />
            </div>
            <dl className="grid grid-cols-1 gap-3 rounded-xl bg-(--s-card) p-4 text-[13px] ring-1 ring-(--s-border) sm:grid-cols-2">
              {[
                ['Interesse', INTERESSE[aberto.interesse].rotulo],
                ['Recebido', `${dataCompleta(aberto.criadoEm)} às ${hora(aberto.criadoEm)}`],
                ['E-mail', aberto.email],
                ['Telefone', aberto.telefone],
                ['Página de origem', aberto.origem.pagina],
                ['Campanha', [aberto.origem.utm_source, aberto.origem.utm_campaign].filter(Boolean).join(' / ') || '—'],
                ['Valor estimado', aberto.valorEstimado ? moeda(aberto.valorEstimado) : 'a definir'],
                ['Responsável', u?.nome ?? 'sem responsável'],
              ].map(([k, v]) => (
                <div key={k} className="grid min-w-0 gap-0.5">
                  <dt className="text-[11px] text-(--s-faint)">{k}</dt>
                  <dd className="truncate text-(--s-fg-2)">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid gap-1.5">
              <Rotulo htmlFor="notas-lead">Anotações</Rotulo>
              <textarea
                id="notas-lead"
                defaultValue={aberto.notas}
                placeholder="O que o lead contou, próximos passos…"
                rows={4}
                className="w-full resize-none rounded-lg bg-(--s-card-2) p-3 text-[13px] ring-1 ring-inset ring-(--s-border-2) placeholder:text-(--s-faint) focus:ring-2 focus:ring-(--s-ring) focus:outline-none"
              />
              <p className="text-[11.5px] text-(--s-faint)">Demonstração: as anotações não são salvas.</p>
            </div>
            <div className="grid gap-2 rounded-xl bg-(--s-primary)/8 p-4 text-[12.5px] text-(--s-fg-2) ring-1 ring-inset ring-(--s-primary)/25">
              <p className="flex items-center gap-2 font-medium text-(--s-fg)">
                <Mail className="size-4 text-(--s-primary)" aria-hidden /> Como este lead chegou
              </p>
              <p>
                Formulário do site em <span className="f-mono">{aberto.origem.pagina}</span>, gravado pela porta <span className="f-mono">/p/contato/lead</span> com o protocolo{' '}
                <span className="f-mono">{aberto.protocolo}</span>. O aviso foi enviado ao WhatsApp do escritório na hora.
              </p>
            </div>
          </div>
        )}
      </Gaveta>
    </>
  );
}
