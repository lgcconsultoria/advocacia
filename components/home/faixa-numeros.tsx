'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { ArrowUpRight } from 'lucide-react';
import { GridBeam } from '@/components/ui/grid-beam';
import { cn } from '@/lib/utils';

/**
 * Faixa de números que se movem (v2). Só número com fonte:
 *  - PNCP ao vivo (as mesmas rotas do termômetro de /licitacoes); até a
 *    primeira leitura, o retrato do servidor, marcado com a hora;
 *  - a referência estimada de IBS + CBS (estimativa, não é lei);
 *  - os 7 anos de transição (2027–2033, LC 214/2025);
 *  - a simulação ilustrativa da fatura de R$ 100 mil (lib/tributario).
 * Os dígitos rolam com @number-flow/react (21st 21513 "Currency Counter",
 * no lugar do Rolling Digits 19158) quando a faixa entra na tela.
 */

export type NumerosPncp = { abertas: number; publicadas30d: number; consultadoEm: string; aoVivo: boolean };

function hora(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function FaixaNumeros({
  pncp: inicial,
  economiaCliente,
  custoEmpresa,
  referencia,
}: {
  pncp: NumerosPncp;
  economiaCliente: number;
  custoEmpresa: number;
  referencia: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);
  const [pncp, setPncp] = useState(inicial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visto) return;
    let vivo = true;
    const ler = async () => {
      try {
        const r = await fetch('/api/pncp/termometro');
        if (!r.ok) return;
        const d = await r.json();
        const abertas = d?.abertas?.quantidade;
        const p30 = d?.publicadas30d?.quantidade;
        if (vivo && typeof abertas === 'number' && typeof p30 === 'number') {
          setPncp({
            abertas,
            publicadas30d: p30,
            consultadoEm: d?.abertas?.procedencia?.consultadoEm ?? d?.atualizadoEm ?? new Date().toISOString(),
            aoVivo: d?.fonte === 'pncp-ao-vivo',
          });
        }
      } catch {
        /* fica o retrato do servidor */
      }
    };
    ler();
    const t = setInterval(ler, 120_000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, [visto]);

  const v = (n: number) => (visto ? n : 0);

  const itens: {
    chave: string;
    numero: React.ReactNode;
    rotulo: React.ReactNode;
    fonte: React.ReactNode;
    href: string;
    destaque?: boolean;
    classe?: string;
  }[] = [
    {
      chave: 'abertas',
      numero: <NumberFlow value={v(pncp.abertas)} locales="pt-BR" />,
      rotulo: 'contratações públicas recebendo propostas agora',
      fonte: (
        <>
          <span className={cn('inline-block h-1.5 w-1.5 rounded-full', pncp.aoVivo ? 'animate-brilho bg-[#5ee0a0]' : 'bg-cinza-escuro')} />
          PNCP · {pncp.aoVivo ? 'ao vivo' : 'retrato'} · {hora(pncp.consultadoEm)}
        </>
      ),
      href: '/licitacoes#termometro',
      classe: 'lg:col-span-2',
    },
    {
      chave: 'p30',
      numero: <NumberFlow value={v(pncp.publicadas30d)} locales="pt-BR" />,
      rotulo: 'editais publicados no PNCP nos últimos 30 dias',
      fonte: <>Portal Nacional de Contratações Públicas</>,
      href: '/licitacoes#termometro',
      classe: 'lg:col-span-2',
    },
    {
      chave: 'ref',
      numero: (
        <NumberFlow value={v(referencia)} locales="pt-BR" format={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
      ),
      rotulo: 'referência de IBS + CBS, a soma dos novos tributos sobre o consumo',
      fonte: <>estimativa · Res. CGIBS 14/2026 · não é a alíquota legal</>,
      href: '/tributario#reforma',
      classe: 'lg:col-span-2',
    },
    {
      chave: 'anos',
      numero: (
        <>
          <NumberFlow value={v(7)} locales="pt-BR" /> <span className="text-[0.42em] font-[650] tracking-[-0.01em]">anos</span>
        </>
      ),
      rotulo: 'de transição, de 2027 a 2033, até o novo sistema valer por inteiro',
      fonte: <>EC 132/2023 e LC 214/2025</>,
      href: '/tributario#linha-do-tempo',
      classe: 'lg:col-span-2',
    },
    {
      chave: 'demo',
      numero: (
        <NumberFlow
          value={v(Math.abs(economiaCliente))}
          locales="pt-BR"
          format={{ style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }}
          prefix="− "
        />
      ),
      rotulo: (
        <>
          no custo do seu cliente por fatura de R$ 100 mil, no Simples híbrido em 2027 — enquanto a sua empresa
          recolhe {custoEmpresa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a mais se o preço não mudar.
        </>
      ),
      fonte: <>simulação ilustrativa · o resultado depende dos dados da sua empresa</>,
      href: '/tributario#simulador',
      destaque: true,
      classe: 'lg:col-span-4',
    },
  ];

  return (
    <section className="planta relative isolate overflow-hidden py-16 md:py-24" aria-labelledby="numeros-titulo">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="etiqueta etiqueta--escura m-0">Números com fonte</p>
            <h2 id="numeros-titulo" className="titulo m-0 mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.8rem)] text-white">
              O tamanho do que está em jogo, <em className="text-sinal">agora</em>.
            </h2>
          </div>
          <p className="m-0 max-w-[44ch] text-[0.95rem] leading-relaxed text-cinza-escuro">
            Os do PNCP mudam enquanto você lê. Os da Reforma vêm da lei, de estimativa oficial ou de simulação — e
            cada um diz qual é.
          </p>
        </div>

        <div ref={ref} className="relative mt-10 overflow-hidden rounded-[28px] border border-sinal/15">
          <GridBeam rows={2} cols={4} className="absolute inset-0" linhas="rgb(142 139 255 / 0.0)" />
          <ul className="relative m-0 grid list-none gap-px bg-sinal/15 p-0 sm:grid-cols-2 lg:grid-cols-6">
            {itens.map((it) => (
              <li key={it.chave} className={cn('group relative bg-tinta/85 backdrop-blur-sm', it.classe)}>
                <Link href={it.href} className="flex h-full flex-col p-6 no-underline sm:p-7">
                  <span
                    className={cn(
                      'expandida num block text-[clamp(2.1rem,4.2vw,3.3rem)] font-[800] leading-none tracking-[-0.04em]',
                      it.destaque ? 'text-madeira' : 'text-white',
                    )}
                  >
                    {it.numero}
                  </span>
                  <span className="mt-3 block max-w-[46ch] text-[0.95rem] leading-snug text-[#d9d8f5]">{it.rotulo}</span>
                  <span className="rotulo mt-auto flex items-center gap-2 pt-5 text-[9.5px] text-cinza-escuro">
                    {it.fonte}
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
