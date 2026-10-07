'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarClock, Cpu, Gavel, MessageCircle, Newspaper, Server, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao, CabecalhoCartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Ponto, Selo } from '../ui/selo';
import { Avatar } from '../ui/avatar';
import { EsqueletoTela } from '../ui/vazio';
import { BarrasComparadas, CartaoKpi, Rosca, TendenciaArea } from '../graficos';
import { LinhaDoTempo, type EventoLinha } from '../linha-do-tempo';
import { ICONE_ANDAMENTO, ICONE_PRAZO, SeloPrazo, TOM_ANDAMENTO } from '../rotulos';
import { AREAS, FASES, clientePorId, processoPorId, usuarioPorId } from '@/lib/demo/dados';
import { dataCurta, dataLonga, diasAte, hora, moeda } from '@/lib/demo/formato';

export function TelaPainel() {
  const d = useDemo();

  const calc = React.useMemo(() => {
    if (!d) return null;
    const ativos = d.processos.length;
    const prazosSemana = d.prazos.filter((p) => {
      const n = diasAte(p.data, d.hoje);
      return n >= 0 && n <= 7;
    });
    const pubHoje = d.publicacoes.filter((p) => diasAte(p.data, d.hoje) === 0).length;
    const oportunidades = d.leads.filter((l) => l.etapa !== 'fechado' && l.etapa !== 'perdido');
    const receber = d.faturas.filter((f) => f.status !== 'paga').reduce((s, f) => s + f.valor, 0);

    const todos = d.processos.flatMap((p) => p.andamentos);
    const semanas = Array.from({ length: 10 }, (_, k) => {
      const w = 9 - k;
      const fim = new Date(d.hoje);
      fim.setDate(fim.getDate() - 7 * w + 1);
      const ini = new Date(fim);
      ini.setDate(ini.getDate() - 7);
      const doPeriodo = todos.filter((a) => a.data >= ini && a.data < fim);
      return {
        semana: w === 0 ? 'Esta' : dataCurta(ini),
        andamentos: doPeriodo.filter((a) => a.fonte !== 'DJEN').length,
        publicacoes: doPeriodo.filter((a) => a.fonte === 'DJEN').length,
      };
    });
    const porFase = FASES.map((f) => ({ fase: f.curto, processos: d.processos.filter((p) => p.fase === f.id).length }));
    const porArea = AREAS.map((a, i) => ({ rotulo: a, valor: d.processos.filter((p) => p.area === a).length, cor: ([1, 2, 3, 4, 5] as const)[i] }));
    const ultimos: EventoLinha[] = d.processos
      .flatMap((p) => p.andamentos.map((a) => ({ a, p })))
      .sort((x, y) => y.a.data.getTime() - x.a.data.getTime())
      .slice(0, 9)
      .map(({ a, p }) => {
        const Icone = ICONE_ANDAMENTO[a.tipo];
        return {
          id: a.id,
          data: a.data,
          ator: clientePorId(d, p.clienteId)?.nome.replace(/ (Ltda\.|S\.A\.|ME)$/, ''),
          titulo: <>— {a.titulo}</>,
          meta: (
            <>
              <span className="f-mono">{p.cnj}</span> · {a.fonte}
            </>
          ),
          detalhe: a.descricao ?? `${p.titulo}. ${p.tribunal} · ${p.orgao}.`,
          icone: <Icone />,
          tom: TOM_ANDAMENTO[a.tipo],
        };
      });
    return { ativos, prazosSemana, pubHoje, oportunidades, receber, semanas, porFase, porArea, ultimos };
  }, [d]);

  if (!d || !calc) return <EsqueletoTela />;

  const saudacao = d.agora.getHours() < 12 ? 'Bom dia' : d.agora.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const criticos = calc.prazosSemana.filter((p) => diasAte(p.data, d.hoje) <= 2).length;
  const proximos = d.prazos.filter((p) => diasAte(p.data, d.hoje) >= 0).slice(0, 6);
  const hojeTxt = dataLonga(d.hoje);

  return (
    <>
      <CabecalhoTela
        titulo={`${saudacao}, ${d.eu.nome.split(' ')[0]}.`}
        subtitulo={
          <>
            {hojeTxt.charAt(0).toUpperCase() + hojeTxt.slice(1)} · <strong className="font-medium text-(--s-fg)">{criticos} prazos</strong> vencem nos próximos 2 dias e{' '}
            <strong className="font-medium text-(--s-fg)">{calc.pubHoje} publicações</strong> chegaram hoje.
          </>
        }
        acoes={
          <>
            <Botao asChild variante="secundario">
              <Link href="/sistema/demo/publicacoes">
                <Newspaper /> Ler publicações
              </Link>
            </Botao>
            <Botao asChild>
              <Link href="/sistema/demo/prazos">
                <CalendarClock /> Ver prazos
              </Link>
            </Botao>
          </>
        }
      />

      <section aria-label="Indicadores" className="grid grid-cols-2 [&>*]:min-w-0 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <CartaoKpi rotulo="Processos ativos" valor={calc.ativos} delta={0.08} periodo="vs. mês passado" tendencia={[18, 19, 21, 22, 22, 24, 25, 26, 27, calc.ativos]} icone={<Gavel />} />
        <CartaoKpi rotulo="Prazos nesta semana" valor={calc.prazosSemana.length} delta={0.25} bom="desce" periodo="vs. semana passada" icone={<CalendarClock />} destaque="perigo" />
        <CartaoKpi rotulo="Publicações hoje" valor={calc.pubHoje} nota="lidas pelo agente às 08:15" icone={<Newspaper />} />
        <CartaoKpi rotulo="Oportunidades no comercial" valor={calc.oportunidades.length} delta={0.4} periodo="leads em 30 dias" icone={<BriefcaseBusiness />} />
        <CartaoKpi
          rotulo="Honorários a receber"
          valor={calc.receber}
          formato={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
          nota={`${d.faturas.filter((f) => f.status === 'vencida').length} vencidas`}
          icone={<Wallet />}
          destaque="ambar"
          className="col-span-2 md:col-span-1"
        />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <Cartao className="lg:col-span-2">
          <CabecalhoCartao titulo="Andamentos por semana" subtitulo="Movimentações dos tribunais e publicações no DJEN — últimas 10 semanas" />
          <div className="px-3 pt-3 pb-4 sm:px-5">
            <TendenciaArea
              dados={calc.semanas}
              x="semana"
              series={[
                { chave: 'andamentos', rotulo: 'Andamentos (e-SAJ, eproc, PJe)', cor: 1 },
                { chave: 'publicacoes', rotulo: 'Publicações (DJEN)', cor: 4 },
              ]}
              descricao="Andamentos e publicações por semana nas últimas dez semanas"
              altura={230}
            />
          </div>
        </Cartao>
        <Cartao>
          <CabecalhoCartao titulo="Processos por fase" subtitulo="Da petição inicial ao cumprimento" />
          <div className="px-3 pt-3 pb-4 sm:px-5">
            <BarrasComparadas dados={calc.porFase} x="fase" series={[{ chave: 'processos', rotulo: 'Processos', cor: 1 }]} descricao="Quantidade de processos em cada fase" horizontal altura={248} />
          </div>
        </Cartao>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
        <Cartao>
          <CabecalhoCartao
            titulo="Próximos prazos"
            subtitulo="Ordenados por vencimento"
            acoes={
              <Botao asChild variante="fantasma" tamanho="sm">
                <Link href="/sistema/demo/prazos">
                  Todos <ArrowRight />
                </Link>
              </Botao>
            }
          />
          <ul className="mt-2 divide-y divide-(--s-border) px-2 pb-2">
            {proximos.map((z) => {
              const p = processoPorId(d, z.processoId)!;
              const u = usuarioPorId(d, z.responsavelId)!;
              const Icone = ICONE_PRAZO[z.tipo];
              return (
                <li key={z.id} className="flex items-center gap-3 px-3 py-2.5">
                  <SeloPrazo data={z.data} hoje={d.hoje} className="w-[68px] justify-center" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-[13px] font-medium">
                      <Icone className="size-3.5 shrink-0 text-(--s-faint)" aria-hidden />
                      <span className="truncate">{z.titulo}</span>
                    </p>
                    <p className="truncate text-[11.5px] text-(--s-faint)">
                      {clientePorId(d, p.clienteId)?.nome} · {dataCurta(z.data)}
                      {z.tipo !== 'prazo' && ` às ${hora(z.data)}`}
                    </p>
                  </div>
                  {z.avisarWhatsapp && <MessageCircle className="size-3.5 shrink-0 text-(--s-ok)" aria-label="Aviso no WhatsApp ligado" />}
                  <Avatar nome={u.nome} iniciais={u.iniciais} tamanho="xs" />
                </li>
              );
            })}
          </ul>
        </Cartao>

        <Cartao className="flex flex-col">
          <CabecalhoCartao titulo="Último andamento" subtitulo="O que mudou na carteira — clique para ver o teor" />
          <div className="mt-2 min-h-0 flex-1 px-4 pb-3">
            <LinhaDoTempo eventos={calc.ultimos} agora={d.agora} rotulo="Últimos andamentos da carteira" alturaMax={360} compacta />
          </div>
        </Cartao>

        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2 xl:col-span-1 xl:grid-cols-1 [&>*]:min-w-0">
          <Cartao>
            <CabecalhoCartao
              titulo="Agentes na VPS"
              subtitulo="Consulta aos tribunais e ao DJEN"
              icone={<Server />}
              acoes={
                <Selo tom="ok">
                  <Ponto tom="ok" pulsar /> no ar
                </Selo>
              }
            />
            <ul className="mt-3 grid gap-1 px-3 pb-3">
              {d.agentes.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-(--s-accent)/50">
                  <Ponto tom={a.status === 'ok' ? 'ok' : a.status === 'atencao' ? 'ambar' : 'perigo'} rotulo={a.status === 'ok' ? 'funcionando' : 'atenção'} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{a.nome}</p>
                    <p className="f-mono truncate text-[11px] text-(--s-faint)">{a.nota ?? a.alvo}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('f-mono text-[11.5px] tabular-nums', a.ultimaVarreduraMin > a.intervaloMin ? 'text-(--s-amber)' : 'text-(--s-fg-2)')}>há {a.ultimaVarreduraMin} min</p>
                    <p className="text-[10.5px] text-(--s-faint)">{a.monitorados} monit.</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 border-t border-(--s-border) px-5 py-2.5 text-[11.5px] text-(--s-faint)">
              <Cpu className="size-3.5" aria-hidden /> Última varredura completa há 4 min · próxima às {hora(new Date(d.agora.getTime() + 26 * 60000))}
            </p>
          </Cartao>
          <Cartao>
            <CabecalhoCartao titulo="Carteira por área" />
            <div className="px-5 pt-3 pb-5">
              <Rosca dados={calc.porArea} rotuloCentro="processos" descricao="Distribuição dos processos por área do direito" tamanho={132} />
            </div>
          </Cartao>
        </div>
      </div>
    </>
  );
}
