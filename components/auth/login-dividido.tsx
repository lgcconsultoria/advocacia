'use client';

/* Página /entrar — porte do Split Login (21st.dev 28369, @mohammadshehadeh):
   lado visual com caminhos animados + marca, lado com o formulário.
   SÓ INTERFACE: nenhum dado sai do navegador. Todo envio termina no aviso
   "O acesso está em implantação". */

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeletorPapel } from './seletor-papel';
import { CodigoOtp } from './codigo-otp';
import { Botao } from '@/components/sistema/ui/botao';
import { Entrada, Rotulo } from '@/components/sistema/ui/campo';
import { BotaoTema } from '@/components/sistema/tema';

type Papel = 'cliente' | 'equipe';
type Modo = 'senha' | 'codigo' | 'recuperar';

const AVISO = 'O acesso está em implantação — em breve você receberá seu convite.';

/* ---------------------------------------------------------------- visual -- */

const jitter = (i: number) => {
  const v = Math.sin(i + 1) * 10_000;
  return v - Math.floor(v);
};

function CaminhosFlutuantes({ posicao }: { posicao: number }) {
  const reduzido = useReducedMotion();
  const caminhos = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * posicao} -${189 + i * 6}C-${380 - i * 5 * posicao} -${189 + i * 6} -${312 - i * 5 * posicao} ${216 - i * 6} ${152 - i * 5 * posicao} ${343 - i * 6}C${616 - i * 5 * posicao} ${470 - i * 6} ${684 - i * 5 * posicao} ${875 - i * 6} ${684 - i * 5 * posicao} ${875 - i * 6}`,
    largura: 0.5 + i * 0.03,
  }));
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-[#8e8bff]" fill="none" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {caminhos.map((c) => (
        <motion.path
          key={c.id}
          d={c.d}
          stroke="currentColor"
          strokeOpacity={0.06 + c.id * 0.02}
          strokeWidth={c.largura}
          initial={{ pathLength: 0.3 }}
          animate={reduzido ? undefined : { pathLength: 1, pathOffset: [0, 1, 0] }}
          transition={{ duration: 20 + jitter(c.id) * 10, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </svg>
  );
}

function LadoVisual() {
  const reduzido = useReducedMotion();
  const video = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduzido) v.pause();
    else v.play().catch(() => {});
  }, [reduzido]);

  return (
    <aside className="grao relative hidden min-h-dvh flex-col overflow-hidden bg-[#0b0a2e] p-10 text-[#f1f1f6] lg:flex xl:p-14">
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        src="/assets/video/sistema-paineis.mp4"
        poster="/assets/video/sistema-paineis.jpg"
        muted
        loop
        playsInline
        autoPlay={!reduzido}
        preload="metadata"
        aria-hidden
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,46,0.55)_0%,rgba(11,10,46,0.25)_35%,rgba(11,10,46,0.9)_78%,#0b0a2e_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_0%_100%,rgba(29,27,154,0.55),transparent)]" />
      <div aria-hidden className="absolute inset-y-0 right-0 w-1/4 bg-[linear-gradient(90deg,transparent,rgba(11,10,46,0.85))]" />
      <div aria-hidden className="absolute inset-0 opacity-70">
        <CaminhosFlutuantes posicao={1} />
        <CaminhosFlutuantes posicao={-1} />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        <Link href="/" aria-label="Douglas Senturião Advocacia — voltar ao site" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo-horizontal-light.png" alt="Douglas Senturião Advocacia" width={1151} height={399} className="h-11 w-auto" />
        </Link>
      </motion.div>

      <div className="relative z-10 mt-auto max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="f-mono mb-5 inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-[11px] tracking-[0.14em] text-[#c9c7ff] uppercase ring-1 ring-white/12 backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-[#8e8bff] shadow-[0_0_10px_#8e8bff]" />
          Jurídico 360
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="f-exp text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
        >
          Cada processo, <span className="f-serif font-normal tracking-normal text-[#c9c7ff]">à vista</span>
          <br />
          e um passo à frente.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-[#cfcee9]"
        >
          Andamentos, prazos e publicações dos tribunais reunidos num só painel — e o aviso no seu WhatsApp antes que algo vença.
        </motion.p>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="f-mono mt-8 flex flex-wrap gap-2 text-[11px] tracking-[0.08em] text-[#a3a2c9] uppercase"
        >
          {['e-SAJ', 'eproc', 'PJe', 'DJEN', 'WhatsApp'].map((s) => (
            <li key={s} className="rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
              {s}
            </li>
          ))}
        </motion.ul>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ form -- */

function Aviso({ texto }: { texto: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="flex gap-3 rounded-xl bg-(--s-amber)/12 p-3.5 text-[13px] leading-snug text-(--s-fg) ring-1 ring-inset ring-(--s-amber)/35">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-(--s-amber)" aria-hidden />
        <p>
          <strong className="font-semibold">{texto.split(' — ')[0]}</strong>
          {texto.includes(' — ') && <> — {texto.split(' — ')[1]}</>}
        </p>
      </div>
    </motion.div>
  );
}

export function LoginDividido() {
  const [papel, setPapel] = React.useState<Papel>('cliente');
  const [modo, setModo] = React.useState<Modo>('senha');
  const [verSenha, setVerSenha] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [aviso, setAviso] = React.useState(false);
  const [etapaCodigo, setEtapaCodigo] = React.useState<'destino' | 'codigo'>('destino');
  const [codigo, setCodigo] = React.useState('');
  const [segundos, setSegundos] = React.useState(0);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const trocarModo = (m: Modo) => {
    setModo(m);
    setAviso(false);
    setEtapaCodigo('destino');
    setCodigo('');
  };

  /** Simula um envio local (sem rede) e mostra o aviso de implantação. */
  const simular = (depois?: () => void) => {
    setEnviando(true);
    setAviso(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setEnviando(false);
      if (depois) depois();
      else setAviso(true);
    }, 650);
  };

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (modo === 'codigo' && etapaCodigo === 'destino') {
      simular(() => {
        setEtapaCodigo('codigo');
        setSegundos(30);
      });
      return;
    }
    simular();
  };

  const subtitulo =
    papel === 'cliente'
      ? 'Acompanhe seus processos, envie documentos e veja faturas.'
      : 'Painel interno: prazos, publicações, processos e comercial.';

  return (
    <section className="relative min-h-dvh lg:grid lg:grid-cols-[1.08fr_1fr]">
      <LadoVisual />

      <div className="relative flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--s-primary)_14%,transparent),transparent)]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <Botao asChild variante="fantasma" tamanho="sm" className="-ml-2">
            <Link href="/">
              <ArrowLeft /> Voltar ao site
            </Link>
          </Botao>
          <BotaoTema />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <Link href="/" className="mb-8 inline-block lg:hidden" aria-label="Douglas Senturião Advocacia — voltar ao site">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo-horizontal-light.png" alt="Douglas Senturião Advocacia" width={1151} height={399} className="h-9 w-auto [[data-tema=papel]_&]:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo-horizontal.png" alt="" width={1151} height={399} className="hidden h-9 w-auto [[data-tema=papel]_&]:block" />
          </Link>

          <p className="f-mono mb-3 text-[11px] tracking-[0.16em] text-(--s-primary) uppercase">Área reservada</p>
          <h1 className="f-exp text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Entrar no <span className="f-serif font-normal tracking-normal">Jurídico 360</span>
          </h1>
          <p className="mt-3 text-[14px] text-(--s-muted)">{subtitulo}</p>

          <SeletorPapel
            className="mt-7"
            rotulo="Tipo de acesso"
            valor={papel}
            aoMudar={(v) => {
              setPapel(v as Papel);
              setAviso(false);
            }}
            opcoes={[
              { value: 'cliente', label: 'Sou cliente' },
              { value: 'equipe', label: 'Sou da equipe' },
            ]}
          />

          <form onSubmit={aoEnviar} className="mt-6 grid gap-4" aria-describedby="aviso-acesso">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${modo}-${etapaCodigo}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="grid gap-4"
              >
                {modo === 'senha' && (
                  <>
                    <div className="grid gap-1.5">
                      <Rotulo htmlFor="email">E-mail</Rotulo>
                      <Entrada id="email" name="email" type="email" autoComplete="email" required placeholder={papel === 'cliente' ? 'voce@suaempresa.com.br' : 'nome@senturiaoadv.com.br'} icone={<Mail />} tamanho="lg" />
                    </div>
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <Rotulo htmlFor="senha">Senha</Rotulo>
                        <button type="button" onClick={() => trocarModo('recuperar')} className="text-[12.5px] text-(--s-primary) underline-offset-4 hover:underline">
                          Esqueci a senha
                        </button>
                      </div>
                      <div className="relative">
                        <Entrada id="senha" name="senha" type={verSenha ? 'text' : 'password'} autoComplete="current-password" required placeholder="Sua senha" icone={<Lock />} tamanho="lg" className="pr-11" />
                        <button
                          type="button"
                          onClick={() => setVerSenha((v) => !v)}
                          aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                          aria-pressed={verSenha}
                          className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-(--s-faint) hover:text-(--s-fg)"
                        >
                          {verSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {modo === 'codigo' && etapaCodigo === 'destino' && (
                  <div className="grid gap-1.5">
                    <Rotulo htmlFor="destino">E-mail ou WhatsApp</Rotulo>
                    <Entrada id="destino" name="destino" autoComplete="email" required placeholder="voce@empresa.com.br ou (67) 9…" icone={<MessageCircle />} tamanho="lg" />
                    <p className="text-[12px] text-(--s-muted)">Enviaremos um código de 6 dígitos. Sem senha para lembrar.</p>
                  </div>
                )}

                {modo === 'codigo' && etapaCodigo === 'codigo' && (
                  <div className="grid gap-2">
                    <Rotulo htmlFor="otp">Digite o código recebido</Rotulo>
                    <CodigoOtp id="otp" valor={codigo} aoMudar={setCodigo} aoCompletar={() => simular()} autoFocus />
                    <div className="flex items-center justify-between text-[12px] text-(--s-muted)">
                      <button type="button" onClick={() => setEtapaCodigo('destino')} className="underline-offset-4 hover:text-(--s-fg) hover:underline">
                        Trocar destino
                      </button>
                      {segundos > 0 ? (
                        <span className="f-mono tabular-nums">Reenviar em {segundos}s</span>
                      ) : (
                        <button type="button" onClick={() => setSegundos(30)} className="text-(--s-primary) underline-offset-4 hover:underline">
                          Reenviar código
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {modo === 'recuperar' && (
                  <div className="grid gap-1.5">
                    <Rotulo htmlFor="email-rec">E-mail cadastrado</Rotulo>
                    <Entrada id="email-rec" name="email" type="email" autoComplete="email" required placeholder="voce@suaempresa.com.br" icone={<Mail />} tamanho="lg" />
                    <p className="text-[12px] text-(--s-muted)">Você receberá um link para criar uma nova senha.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <Botao type="submit" tamanho="lg" className="mt-1 w-full" disabled={enviando}>
              {enviando ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {modo === 'senha' && 'Entrar'}
              {modo === 'codigo' && (etapaCodigo === 'destino' ? 'Enviar código' : 'Confirmar código')}
              {modo === 'recuperar' && 'Enviar link de recuperação'}
              {!enviando && <ArrowRight aria-hidden />}
            </Botao>

            <div id="aviso-acesso" role="status" aria-live="polite">
              <AnimatePresence>{aviso && <Aviso texto={AVISO} />}</AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px]">
              {modo !== 'senha' && (
                <button type="button" onClick={() => trocarModo('senha')} className="inline-flex items-center gap-1.5 text-(--s-fg-2) hover:text-(--s-fg)">
                  <KeyRound className="size-3.5" aria-hidden /> Entrar com senha
                </button>
              )}
              {modo !== 'codigo' && (
                <button type="button" onClick={() => trocarModo('codigo')} className="inline-flex items-center gap-1.5 text-(--s-fg-2) hover:text-(--s-fg)">
                  <MessageCircle className="size-3.5" aria-hidden /> Entrar com código
                </button>
              )}
            </div>
          </form>

          <div className="my-8 flex items-center gap-3 text-[11px] text-(--s-faint)">
            <span className="h-px flex-1 bg-(--s-border)" />
            <span className="f-mono tracking-[0.14em] uppercase">ou conheça por dentro</span>
            <span className="h-px flex-1 bg-(--s-border)" />
          </div>

          <div className={cn('grid gap-2.5', papel === 'equipe' && '[&>*:first-child]:order-2')}>
            <CartaoDemo href="/cliente/demo" icone={<UserRound />} titulo="Ver demonstração do portal do cliente" texto="Processos em linguagem simples, documentos e faturas." />
            <CartaoDemo href="/sistema/demo" icone={<LayoutDashboard />} titulo="Ver demonstração do sistema" texto="Painel da equipe: prazos, publicações, comercial." />
          </div>
        </div>

        <p className="relative z-10 text-center text-[11.5px] text-(--s-faint)">
          Acesso restrito a clientes e equipe do escritório. As demonstrações usam dados fictícios.
        </p>
      </div>
    </section>
  );
}

function CartaoDemo({ href, icone, titulo, texto }: { href: string; icone: React.ReactNode; titulo: string; texto: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl bg-(--s-card) p-3.5 ring-1 ring-(--s-border) transition-[box-shadow,background-color] hover:bg-(--s-card-2) hover:ring-(--s-border-2)"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--s-accent) text-(--s-primary) [&_svg]:size-[18px]">{icone}</span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="f-mono w-fit rounded bg-(--s-amber)/15 px-1.5 py-px text-[9.5px] font-semibold tracking-[0.14em] text-(--s-amber) uppercase">Demonstração</span>
        <span className="text-[13.5px] font-medium">{titulo}</span>
        <span className="truncate text-[12px] text-(--s-muted)">{texto}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-(--s-faint) transition-transform group-hover:translate-x-0.5 group-hover:text-(--s-fg)" aria-hidden />
    </Link>
  );
}
