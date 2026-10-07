'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TextMorphing } from '@/components/ui/text-morphing';
import { BotaoDiagnostico } from '@/components/diagnostico/botao';
import { HeroFundo } from './hero-fundo';

const FRASES = ['na Reforma Tributária.', 'nas licitações.', 'nos contratos públicos.', 'contra o ato ilegal.'];

/**
 * Hero da home (v2): cristal 3D (desktop) ou malha de gradiente (celular)
 * ao fundo; título para empresários com a frase final em Text Morphing
 * (21st 27533). O H1 de verdade fica para leitores de tela e buscadores; a
 * versão animada é decorativa.
 */
export function HeroV2({ oab }: { oab: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const entrar = (d: number) =>
    reduzir
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { type: 'spring' as const, stiffness: 90, damping: 18, delay: d },
        };

  return (
    <section ref={ref} className="planta ruido relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="hero-titulo">
      <HeroFundo alvo={ref} />

      <div className="container relative z-[1] flex flex-1 flex-col pb-8 pt-[calc(var(--header-h)+2rem)] md:pb-10">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0 py-6 lg:py-10">
            <motion.p {...entrar(0.1)} className="etiqueta etiqueta--escura m-0">
              Direito Tributário e Público · para empresas
            </motion.p>
            <h1 id="hero-titulo" className="sr-only">
              Direito Tributário e Direito Público para empresas: Reforma Tributária, licitações, contratos públicos e
              defesa contra atos ilegais — Douglas Senturião Advocacia
            </h1>
            <motion.div {...entrar(0.2)} aria-hidden="true" className="display mt-7 text-[clamp(2.7rem,7.2vw,6.2rem)] text-white">
              <span className="block">Advocacia</span>
              <span className="block">para empresas</span>
              <TextMorphing
                texts={FRASES}
                morphDuration={1.1}
                cooldownDuration={2.2}
                limiar={false}
                className="citacao mt-1 h-[1.12em] text-[0.8em] font-[400] leading-[1.1] tracking-[-0.015em] text-sinal"
              />
            </motion.div>
            <motion.p {...entrar(0.35)} className="m-0 mt-7 max-w-[54ch] text-[1.08rem] leading-relaxed text-[#cfcef0]">
              Da nota fiscal ao edital: o escritório traduz a lei em números, prazos e cláusulas para quem fatura,
              licita e contrata com o Poder Público. Atuação em todo o Brasil.
            </motion.p>
            <motion.div {...entrar(0.45)} className="mt-9 flex flex-wrap gap-3">
              <BotaoDiagnostico variant="claro" size="lg">
                Fazer diagnóstico <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
              </BotaoDiagnostico>
              <Link href="/tributario#simulador" className="btn btn-lg btn-contorno-claro">
                Simular a Reforma na minha nota
              </Link>
            </motion.div>
          </div>

          <motion.div {...entrar(0.6)} className="min-w-0 self-end lg:justify-self-end lg:pb-4">
            <Link
              href="/tributario"
              className="vidro-escuro group block max-w-[380px] rounded-[24px] p-5 text-white no-underline transition-transform hover:-translate-y-1"
            >
              <span className="rotulo flex items-center gap-2 text-[10px] text-sinal">
                <span className="inline-block h-1.5 w-1.5 animate-brilho rounded-full bg-madeira" />
                Reforma Tributária · em curso
              </span>
              <span className="semi mt-3 block text-[1.08rem] font-[700] leading-snug">
                2026 é o ano de teste. Em 2027 a CBS passa a ser cobrada e o Simples ganha a opção híbrida.
              </span>
              <span className="mt-4 flex items-center justify-between text-[0.88rem] text-cinza-escuro">
                O que muda na sua nota fiscal
                <ArrowUpRight className="h-4 w-4 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="rotulo mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-sinal/15 pt-5 text-[10px] text-cinza-escuro">
          <span>{oab} · Sede em São Paulo · Atuação em todo o Brasil</span>
          <span className="hidden sm:inline">Role para ver os números ↓</span>
        </div>
      </div>
    </section>
  );
}
