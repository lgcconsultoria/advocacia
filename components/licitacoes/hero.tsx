'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { GradePlanta } from '@/components/site/secao';
import { usePncp } from './contexto';
import { NumeroVivo } from './numero-vivo';
import { PilulaStatus } from './status';
import { MarcaEstimado } from './termometro';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';

/**
 * Abertura do Departamento de Licitações: vídeo do mapa (mudo, em loop; parado
 * no pôster sob movimento reduzido), título, chamadas e a faixa ao vivo.
 */
export function HeroLicitacoes({ whatsapp }: { whatsapp: string }) {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const texto = encodeURIComponent('Olá, gostaria de falar sobre o departamento jurídico de licitações.');

  return (
    <section className="planta relative isolate overflow-hidden" aria-labelledby="licitacoes-titulo">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(90%_120%_at_85%_30%,#2b29a8_0%,#15146f_40%,var(--tinta)_80%)]"
      />
      <video
        ref={v}
        poster="/assets/video/licitacoes-brasil.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[62%_50%] md:object-[70%_50%]"
      >
        <source src="/assets/video/licitacoes-brasil.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_10_46/0.96)_0%,rgb(11_10_46/0.78)_42%,rgb(11_10_46/0.18)_82%)] max-md:bg-[linear-gradient(180deg,rgb(11_10_46/0.62)_0%,rgb(11_10_46/0.92)_62%)]"
      />
      <GradePlanta className="opacity-[0.12]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-tinta to-transparent" />

      <div className="container relative pb-10 pt-10 md:pb-14 md:pt-14">
        <nav className="rotulo flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-cinza-escuro" aria-label="Trilha de navegação">
          <Link href="/" className="no-underline hover:text-white">Início</Link>
          <span aria-hidden="true" className="text-sinal">/</span>
          <span aria-current="page" className="text-white/80">Licitações</span>
        </nav>

        <div className="mt-12 max-w-[760px] md:mt-20">
          <p className="rotulo m-0 text-sinal">Departamento de Licitações</p>
          <h1
            id="licitacoes-titulo"
            className="expandida m-0 mt-5 text-[clamp(2.1rem,5.6vw,4.4rem)] font-[800] leading-[0.98] tracking-[-0.04em] text-white"
          >
            Soluções jurídicas integradas para o departamento de licitações da sua empresa
          </h1>
          <p className="citacao m-0 mt-7 max-w-[34ch] text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.15] text-white/95">
            Do edital ao contrato, cada fase com o seu prazo e a sua tese.
          </p>
          <p className="m-0 mt-5 max-w-[56ch] text-[1.02rem] leading-relaxed text-cinza-escuro">
            Um departamento jurídico dedicado às empresas que disputam e executam
            contratos públicos sob a Lei 14.133/2021: leitura do edital,
            habilitação, sessão, recursos, contratos, reequilíbrio e defesa em
            processos de sanção, com o mesmo time do primeiro ao último ato.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BotaoDiagnostico variant="claro" size="lg" interesse="licitacoes">
              Solicitar diagnóstico
            </BotaoDiagnostico>
            <a
              href={`https://wa.me/${whatsapp}?text=${texto}`}
              target="_blank"
              rel="noopener"
              className={buttonVariants({ variant: 'contorno-claro', size: 'lg' })}
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>

        <FaixaAoVivo />
      </div>
    </section>
  );
}

function FaixaAoVivo() {
  const { dados, montado, valorAbertas, publicadasHoje } = usePncp();
  const valor = montado && valorAbertas ? valorAbertas.valor : dados.abertas.valor?.valorSemAtipicos ?? null;
  const hoje = montado && publicadasHoje ? publicadasHoje.valor : dados.publicadasHoje.quantidade;
  const itens = [
    { rotulo: 'Editais recebendo propostas agora', no: <NumeroVivo valor={dados.abertas.quantidade} /> },
    {
      rotulo: 'Valor estimado em aberto',
      no:
        valor === null ? (
          <span>—</span>
        ) : (
          <>
            <NumeroVivo valor={valor} formato="reais" />
            <MarcaEstimado ativo={montado && !!valorAbertas?.estimado} />
          </>
        ),
    },
    {
      rotulo: 'Publicadas hoje no PNCP',
      no: (
        <>
          <NumeroVivo valor={hoje} duracao={0.8} />
          <MarcaEstimado ativo={montado && !!publicadasHoje?.estimado} />
        </>
      ),
    },
  ];
  return (
    <div className="mt-14 border-t border-sinal/20 pt-6 md:mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rotulo m-0 text-[10.5px] text-sinal">Termômetro das contratações públicas</p>
        <PilulaStatus />
      </div>
      <dl className="m-0 mt-5 grid gap-5 sm:grid-cols-3 sm:gap-8">
        {itens.map((i) => (
          <div key={i.rotulo} className="min-w-0">
            <dt className="text-[0.88rem] text-cinza-escuro">{i.rotulo}</dt>
            <dd className="expandida num m-0 mt-1 text-[clamp(1.7rem,3.2vw,2.5rem)] font-[780] leading-none tracking-[-0.03em] text-white">
              {i.no}
            </dd>
          </div>
        ))}
      </dl>
      <a href="#termometro" className="link-seta mt-6 text-[0.9rem]">
        Ver o termômetro completo <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
