'use client';

/* Configurações — inspirada no Settings Sidebar Layout (21st.dev 28366):
   menu lateral de seções; aqui só a interface (nada é salvo). */

import * as React from 'react';
import { Clock, KeyRound, Plug, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao } from '../ui/cartao';
import { Avatar } from '../ui/avatar';
import { Selo, Ponto } from '../ui/selo';
import { Interruptor } from '../ui/interruptor';
import { EsqueletoTela } from '../ui/vazio';

const SECOES = [
  { id: 'equipe', titulo: 'Equipe e papéis', icone: Users },
  { id: 'horarios', titulo: 'Horários de aviso', icone: Clock },
  { id: 'integracoes', titulo: 'Integrações', icone: Plug },
  { id: 'seguranca', titulo: 'Segurança', icone: ShieldCheck },
] as const;

const PERMISSOES = [
  ['Ver todos os processos', true, true, true, false],
  ['Editar prazos', true, true, true, false],
  ['Comercial e honorários', true, false, false, false],
  ['Configurar alertas', true, false, false, false],
  ['Portal: ver os próprios processos e faturas', true, true, false, true],
] as const;

export function TelaConfiguracoes() {
  const d = useDemo();
  const [secao, setSecao] = React.useState<(typeof SECOES)[number]['id']>('equipe');
  const [chk, setChk] = React.useState<Record<string, boolean>>({ fds: false, resumo: true, d3: true, d1: true });
  if (!d) return <EsqueletoTela />;

  return (
    <>
      <CabecalhoTela titulo="Configurações" subtitulo="Equipe, horários de aviso e conexões com tribunais, DJEN e WhatsApp. Somente interface." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Seções de configuração" className="sem-rolagem flex gap-1 overflow-x-auto lg:flex-col">
          {SECOES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSecao(s.id)}
              aria-current={secao === s.id ? 'true' : undefined}
              className={cn('flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors', secao === s.id ? 'bg-(--s-accent) font-medium text-(--s-fg)' : 'text-(--s-muted) hover:bg-(--s-accent)/50 hover:text-(--s-fg)')}
            >
              <s.icone className="size-4" aria-hidden /> {s.titulo}
            </button>
          ))}
        </nav>

        <Cartao className="overflow-hidden">
          {secao === 'equipe' && (
            <div>
              <ul className="divide-y divide-(--s-border)">
                {d.usuarios.map((u) => (
                  <li key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <Avatar nome={u.nome} iniciais={u.iniciais} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium">{u.nome}</p>
                      <p className="truncate text-[12px] text-(--s-muted)">{u.email} · {u.whatsapp}</p>
                    </div>
                    <Selo tom={u.papel === 'socio' ? 'solido' : u.papel === 'advogado' ? 'marca' : 'neutro'}>{u.cargo}</Selo>
                  </li>
                ))}
              </ul>
              <div className="rolagem relative overflow-x-auto border-t border-(--s-border)">
                <table className="w-full min-w-[560px] text-[12.5px]">
                  <caption className="px-5 pt-4 pb-2 text-left text-[13px] font-semibold">Papéis e permissões</caption>
                  <thead className="text-[11.5px] text-(--s-muted)">
                    <tr className="border-b border-(--s-border)">
                      <th scope="col" className="px-5 py-2 text-left font-medium">Permissão</th>
                      {['Sócio', 'Advogado', 'Estagiário', 'Cliente'].map((p) => (
                        <th key={p} scope="col" className="px-3 py-2 text-center font-medium">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSOES.map(([nome, ...v]) => (
                      <tr key={nome} className="border-b border-(--s-border) last:border-0">
                        <th scope="row" className="px-5 py-2.5 text-left font-normal text-(--s-fg-2)">{nome}</th>
                        {v.map((ok, i) => (
                          <td key={i} className="px-3 py-2.5 text-center">
                            {ok ? <span className="text-(--s-ok)">●<span className="sr-only">sim</span></span> : <span className="text-(--s-faint)">—<span className="sr-only">não</span></span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {secao === 'horarios' && (
            <ul className="divide-y divide-(--s-border)">
              {[
                ['d3', 'Aviso em D-3', 'Três dias úteis antes de cada prazo, às 8h.'],
                ['d1', 'Aviso no dia', 'No dia do vencimento, às 8h, para o responsável e o sócio.'],
                ['resumo', 'Resumo diário às 7h30', 'Prazos do dia, publicações da noite e leads novos, numa só mensagem.'],
                ['fds', 'Avisar no fim de semana', 'Fora isso, só o que vence no próprio dia.'],
              ].map(([id, t, s]) => (
                <li key={id} className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{t}</p>
                    <p className="text-[12px] text-(--s-muted)">{s}</p>
                  </div>
                  <Interruptor ligado={!!chk[id]} aoMudar={(v) => setChk((c) => ({ ...c, [id]: v }))} rotulo={t} />
                </li>
              ))}
            </ul>
          )}

          {secao === 'integracoes' && (
            <ul className="divide-y divide-(--s-border)">
              {[
                ['e-SAJ (TJMS, TJSP)', 'Agente na VPS com certificado A1 do escritório', 'ok'],
                ['eproc (TRF4, TJSC)', 'Agente na VPS', 'ok'],
                ['PJe (TRF3, TRT24)', 'Agente na VPS — TRF3 respondendo devagar', 'atencao'],
                ['DJEN', 'Leitura das publicações pelo nº de OAB e pelos processos', 'ok'],
                ['WhatsApp (Iris / Evolution)', 'Avisos à equipe; mensagens a clientes só com revisão', 'ok'],
                ['Formulário do site', 'Leads de /p/contato/lead caem no Comercial', 'ok'],
                ['API do Sistema Jurídico', 'Casos, clientes e documentos (somente leitura)', 'pendente'],
              ].map(([n, s, st]) => (
                <li key={n} className="flex items-center gap-4 px-5 py-4">
                  <Ponto tom={st === 'ok' ? 'ok' : st === 'atencao' ? 'ambar' : 'neutro'} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{n}</p>
                    <p className="text-[12px] text-(--s-muted)">{s}</p>
                  </div>
                  <Selo tom={st === 'ok' ? 'ok' : st === 'atencao' ? 'ambar' : 'contorno'}>{st === 'ok' ? 'Conectado' : st === 'atencao' ? 'Instável' : 'A conectar'}</Selo>
                </li>
              ))}
            </ul>
          )}

          {secao === 'seguranca' && (
            <div className="grid gap-4 p-5 text-[13px] text-(--s-fg-2)">
              <p className="flex items-start gap-2.5">
                <KeyRound className="mt-0.5 size-4 shrink-0 text-(--s-primary)" aria-hidden />
                <span>Entrada por e-mail e senha ou por código de 6 dígitos (e-mail ou WhatsApp). Equipe com verificação em duas etapas obrigatória.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-(--s-primary)" aria-hidden />
                <span>Clientes só veem os próprios processos, documentos e faturas. Toda ação fica registrada (quem, quando, o quê).</span>
              </p>
              <p className="rounded-xl bg-(--s-amber)/10 p-3 text-[12.5px] ring-1 ring-inset ring-(--s-amber)/30">
                Protótipo: ainda não há autenticação. O acesso real chega por convite quando o backend estiver pronto.
              </p>
            </div>
          )}
        </Cartao>
      </div>
    </>
  );
}
