'use client';

import * as React from 'react';
import { BellRing, CheckCheck, Mail, MessageCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../demo-provider';
import { CabecalhoTela } from '../shell';
import { Cartao, CabecalhoCartao } from '../ui/cartao';
import { Botao } from '../ui/botao';
import { Interruptor } from '../ui/interruptor';
import { Selo } from '../ui/selo';
import { EsqueletoTela } from '../ui/vazio';
import { hora } from '@/lib/demo/formato';

/** Mensagens que a Iris mandaria (prévia; nada é enviado). */
function previas(hojeDia: Date) {
  const h = (hh: number, mm: number) => {
    const d = new Date(hojeDia);
    d.setHours(hh, mm, 0, 0);
    return d;
  };
  return [
    { id: 'w1', para: 'Marina Exemplo', quando: h(8, 0), texto: '⏰ Prazo vence HOJE (23:59)\nRéplica à contestação — Construtora Modelo S.A.\nProc. 9000104-00.2026.8.12.0031 (TJMS)', regra: 'Prazo vence hoje' },
    { id: 'w2', para: 'Douglas Senturião', quando: h(8, 13), texto: '📰 Nova publicação no DJEN\nEmpresa Exemplo Ltda. — intimação para manifestação (15 dias)\nProc. 9000101-00.2026.8.12.0001', regra: 'Nova publicação no DJEN' },
    { id: 'w3', para: 'Douglas Senturião', quando: h(8, 48), texto: '🟡 Lead novo no site\nCarlos Fictício — Padaria Exemplo Ltda.\nInteresse: tributário · origem /tributario (instagram)', regra: 'Lead novo no site' },
  ];
}

export function TelaAlertas() {
  const d = useDemo();
  const [ativos, setAtivos] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    if (d) setAtivos(Object.fromEntries(d.regras.map((r) => [r.id, r.ativo])));
  }, [d]);
  if (!d) return <EsqueletoTela />;
  const msgs = previas(d.hoje);

  return (
    <>
      <CabecalhoTela
        titulo="Alertas"
        subtitulo="Regras que disparam avisos no WhatsApp (pela Iris) e por e-mail. Na demonstração, ligar e desligar não envia nada."
        acoes={
          <Botao variante="secundario" disabled title="Desativado na demonstração">
            <Plus /> Nova regra
          </Botao>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px] [&>*]:min-w-0">
        <Cartao className="overflow-hidden">
          <CabecalhoCartao titulo="Regras de aviso" subtitulo={`${Object.values(ativos).filter(Boolean).length} de ${d.regras.length} ligadas`} icone={<BellRing />} />
          <ul className="mt-3 divide-y divide-(--s-border) border-t border-(--s-border)">
            {d.regras.map((r) => {
              const on = !!ativos[r.id];
              const Canal = r.canal === 'WhatsApp' ? MessageCircle : Mail;
              return (
                <li key={r.id} className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-opacity sm:flex-nowrap', !on && 'opacity-60')}>
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset', r.canal === 'WhatsApp' ? 'bg-(--s-ok)/12 text-(--s-ok) ring-(--s-ok)/25' : 'bg-(--s-primary)/12 text-(--s-primary) ring-(--s-primary)/25')}>
                    <Canal className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 basis-[220px]">
                    <p className="flex flex-wrap items-center gap-x-2 text-[13.5px] font-medium">
                      {r.gatilho}
                      <span className="text-(--s-faint)" aria-hidden>→</span>
                      <span className="text-(--s-fg-2)">{r.canal} do {r.destino.toLowerCase()}</span>
                    </p>
                    <p className="mt-0.5 text-[12px] text-(--s-muted)">{r.condicao}</p>
                  </div>
                  <Selo tom="neutro" className="f-mono tabular-nums">{r.disparos7d} em 7 dias</Selo>
                  <Interruptor ligado={on} aoMudar={(v) => setAtivos((a) => ({ ...a, [r.id]: v }))} rotulo={`${on ? 'Desligar' : 'Ligar'} regra: ${r.gatilho}`} />
                </li>
              );
            })}
          </ul>
          <p className="border-t border-(--s-border) px-5 py-3 text-[12px] text-(--s-faint)">
            Horários: avisos de prazo saem às 8h em dias úteis; publicações e leads, na hora. Sábado e domingo só “vence hoje”.
          </p>
        </Cartao>

        <Cartao className="overflow-hidden">
          <CabecalhoCartao titulo="Últimos avisos (prévia)" subtitulo="Como chegam no WhatsApp da equipe" icone={<MessageCircle />} />
          <div className="mt-3 grid gap-3 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--s-ok)_6%,transparent),transparent)] px-4 pt-2 pb-5">
            {msgs.map((m) => (
              <div key={m.id} className="grid gap-1">
                <p className="text-[11px] text-(--s-faint)">
                  Iris → <span className="text-(--s-fg-2)">{m.para}</span> · regra “{m.regra}”
                </p>
                <div className="relative max-w-[92%] rounded-2xl rounded-tl-sm bg-(--s-card-2) px-3.5 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-line text-(--s-fg-2) ring-1 ring-inset ring-(--s-border)">
                  {m.texto}
                  <span className="f-mono mt-1 flex items-center justify-end gap-1 text-[10px] text-(--s-faint)">
                    {hora(m.quando)} <CheckCheck className="size-3 text-(--s-primary)" aria-label="entregue" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Cartao>
      </div>
    </>
  );
}
