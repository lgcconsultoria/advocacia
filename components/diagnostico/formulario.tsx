'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Copy, LoaderCircle } from 'lucide-react';
import { enviarLead, type Interesse } from '@/lib/contato/enviar-lead';
import { pixelEvento } from '@/components/meta-pixel';
import { cn } from '@/lib/utils';

/**
 * Formulário curto do diagnóstico (v2): nome, e-mail, WhatsApp e empresa.
 * O assunto (`interesse`) vem da página; quando não vem, aparece como três
 * pílulas já com "Outro" marcado. Envia pela porta do escritório (enviarLead,
 * com campo-isca e tempo mínimo) e mostra o protocolo, com o atalho para
 * continuar a conversa no WhatsApp. Em erro (ex.: prévia fora do domínio),
 * a mensagem da porta aparece junto do mesmo atalho.
 */

export const ROTULO_INTERESSE: Record<Interesse, string> = {
  tributario: 'Tributário e Reforma',
  licitacoes: 'Licitações e contratos públicos',
  outro: 'Outro assunto',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** (67) 99167-5629 enquanto digita; aceita colar com +55. */
export function mascaraTelefone(v: string): string {
  let d = v.replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

type Campo = 'nome' | 'email' | 'telefone' | 'empresa';
type Estado = { fase: 'livre' | 'enviando' } | { fase: 'feito'; protocolo: string } ;

export function linkWhatsapp(whatsapp: string, texto: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;
}

export function FormularioDiagnostico({
  whatsapp,
  interesse: interesseFixo,
  escuro = false,
  titulo = 'Diagnóstico inicial',
  subtitulo = 'Quatro campos. O escritório retorna em até 1 dia útil, pelo WhatsApp ou por e-mail.',
  className,
  autoFocus = false,
}: {
  whatsapp: string;
  interesse?: Interesse | null;
  escuro?: boolean;
  titulo?: string | null;
  subtitulo?: string | null;
  className?: string;
  autoFocus?: boolean;
}) {
  const uid = useId();
  const inicio = useRef(0);
  const reduzir = useReducedMotion();
  const [interesse, setInteresse] = useState<Interesse>(interesseFixo ?? 'outro');
  const [valores, setValores] = useState<Record<Campo, string>>({ nome: '', email: '', telefone: '', empresa: '' });
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroEnvio, setErroEnvio] = useState('');
  const [estado, setEstado] = useState<Estado>({ fase: 'livre' });
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  useEffect(() => {
    if (interesseFixo) setInteresse(interesseFixo);
  }, [interesseFixo]);

  const primeiroNome = valores.nome.trim().split(/\s+/)[0] ?? '';
  const apresentacao = `Olá! Sou ${valores.nome.trim() || 'visitante do site'}${valores.empresa.trim() ? `, da ${valores.empresa.trim()}` : ''}.`;

  function validar(v = valores): Partial<Record<Campo, string>> {
    const e: Partial<Record<Campo, string>> = {};
    if (v.nome.trim().length < 2) e.nome = 'Informe seu nome.';
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'Informe um e-mail válido.';
    if (v.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe o WhatsApp com DDD.';
    if (v.empresa.trim().length < 2) e.empresa = 'Informe a empresa.';
    return e;
  }

  function mudar(campo: Campo, valor: string) {
    const novo = { ...valores, [campo]: campo === 'telefone' ? mascaraTelefone(valor) : valor };
    setValores(novo);
    if (erros[campo]) setErros((ant) => ({ ...ant, [campo]: validar(novo)[campo] }));
  }

  async function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (estado.fase === 'enviando') return;
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = (['nome', 'email', 'telefone', 'empresa'] as Campo[]).find((c) => e[c]);
      if (primeiro) document.getElementById(`${uid}-${primeiro}`)?.focus();
      return;
    }
    const f = new FormData(ev.currentTarget);
    setEstado({ fase: 'enviando' });
    setErroEnvio('');
    const r = await enviarLead(
      {
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        telefone: valores.telefone,
        empresa: valores.empresa.trim(),
        interesse,
        website: String(f.get('website') ?? ''),
      },
      { inicio: inicio.current || undefined },
    );
    if (r.ok) {
      setEstado({ fase: 'feito', protocolo: r.protocolo });
      pixelEvento('Lead', { content_category: interesse });
    } else {
      setEstado({ fase: 'livre' });
      setErroEnvio(r.erro);
    }
  }

  const campo = (nome: Campo, rotulo: string, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="min-w-0">
      <span className={cn('campo', escuro && 'campo--escuro')}>
        <input
          id={`${uid}-${nome}`}
          name={nome}
          value={valores[nome]}
          onChange={(e) => mudar(nome, e.target.value)}
          placeholder=" "
          aria-invalid={erros[nome] ? true : undefined}
          aria-describedby={erros[nome] ? `${uid}-${nome}-erro` : undefined}
          required
          {...extra}
        />
        <label htmlFor={`${uid}-${nome}`}>{rotulo}</label>
      </span>
      {erros[nome] && (
        <p id={`${uid}-${nome}-erro`} className={cn('m-0 mt-1.5 pl-1 text-[0.8rem]', escuro ? 'text-[#ff9d94]' : 'text-[var(--perigo)]')}>
          {erros[nome]}
        </p>
      )}
    </div>
  );

  if (estado.fase === 'feito') {
    const msg = `${apresentacao} Acabei de pedir um diagnóstico pelo site (protocolo ${estado.protocolo}), sobre ${ROTULO_INTERESSE[interesse].toLowerCase()}.`;
    return (
      <motion.div
        initial={reduzir ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('text-center', className)}
        role="status"
        aria-live="polite"
      >
        <motion.span
          initial={reduzir ? false : { scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#8e8bff,#1d1b9a)] text-white shadow-[0_18px_40px_-14px_rgb(29_27_154/0.8)]"
        >
          <Check className="h-8 w-8" strokeWidth={2.6} aria-hidden="true" />
        </motion.span>
        <h3 className={cn('expandida m-0 mt-6 text-[1.5rem] font-[780] leading-tight tracking-[-0.025em]', escuro ? 'text-white' : 'text-grafite')}>
          Pedido recebido{primeiroNome ? `, ${primeiroNome}` : ''}.
        </h3>
        <p className={cn('m-0 mx-auto mt-3 max-w-[38ch] text-[0.98rem] leading-relaxed', escuro ? 'text-cinza-escuro' : 'text-cinza')}>
          O escritório já foi avisado e retorna em até 1 dia útil. Guarde o número do seu pedido:
        </p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(estado.protocolo).then(() => setCopiado(true)).catch(() => {});
          }}
          className={cn(
            'rotulo num mx-auto mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] tracking-[0.12em]',
            escuro ? 'border-sinal/40 text-white' : 'border-papel-2 bg-papel text-marca',
          )}
          aria-label={`Protocolo ${estado.protocolo}. Copiar`}
        >
          {estado.protocolo}
          {copiado ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
        <a
          href={linkWhatsapp(whatsapp, msg)}
          target="_blank"
          rel="noopener"
          className="btn btn-lg btn-block mt-7 border-[#1f9d55] bg-[#1f9d55] text-white hover:bg-[#178246]"
        >
          Continuar no WhatsApp <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
        </a>
        <p className={cn('m-0 mt-3 text-[0.8rem]', escuro ? 'text-cinza-escuro' : 'text-cinza')}>
          Opcional: adianta a conversa com o advogado responsável.
        </p>
      </motion.div>
    );
  }

  const enviando = estado.fase === 'enviando';

  return (
    <form onSubmit={enviar} noValidate className={cn('relative', className)} aria-busy={enviando}>
      {titulo && (
        <h3 className={cn('expandida m-0 pr-10 text-[1.45rem] font-[790] leading-[1.08] tracking-[-0.03em]', escuro ? 'text-white' : 'text-grafite')}>
          {titulo}
        </h3>
      )}
      {subtitulo && (
        <p className={cn('m-0 mt-2 text-[0.95rem] leading-relaxed', escuro ? 'text-cinza-escuro' : 'text-cinza')}>{subtitulo}</p>
      )}

      {interesseFixo ? (
        <p className={cn('etiqueta mt-5', escuro && 'etiqueta--escura')}>Assunto: {ROTULO_INTERESSE[interesse]}</p>
      ) : (
        <fieldset className="m-0 mt-5 min-w-0 border-0 p-0">
          <legend className={cn('rotulo mb-2 p-0 text-[10.5px]', escuro ? 'text-cinza-escuro' : 'text-cinza')}>Assunto</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ROTULO_INTERESSE) as Interesse[]).map((k) => (
              <label
                key={k}
                className={cn(
                  'cursor-pointer rounded-full border px-3.5 py-2 text-[0.86rem] font-[560] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
                  interesse === k
                    ? escuro
                      ? 'border-sinal bg-sinal/20 text-white'
                      : 'border-marca bg-marca text-white'
                    : escuro
                      ? 'border-sinal/25 text-cinza-escuro hover:border-sinal/60'
                      : 'border-papel-2 bg-white text-grafite hover:border-marca/40',
                )}
              >
                <input
                  type="radio"
                  name="interesse"
                  value={k}
                  checked={interesse === k}
                  onChange={() => setInteresse(k)}
                  className="sr-only"
                />
                {ROTULO_INTERESSE[k]}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {campo('nome', 'Seu nome', { autoComplete: 'name', maxLength: 120, enterKeyHint: 'next', autoFocus, autoCapitalize: 'words' })}
        {campo('empresa', 'Empresa', { autoComplete: 'organization', maxLength: 160, enterKeyHint: 'next' })}
        {campo('email', 'E-mail', { type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: 160, enterKeyHint: 'next', autoCapitalize: 'off', spellCheck: false })}
        {campo('telefone', 'WhatsApp', { type: 'tel', autoComplete: 'tel-national', inputMode: 'tel', maxLength: 16, enterKeyHint: 'send' })}
      </div>

      {/* campo-isca: fora da tela, fora do Tab, fora do leitor de tela */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Site <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <AnimatePresence>
        {erroEnvio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className={cn(
                'mt-4 rounded-2xl border p-4 text-[0.9rem] leading-relaxed',
                escuro ? 'border-[#e0675c]/40 bg-[#e0675c]/10 text-[#ffd2cd]' : 'border-[#e2b4af] bg-[#fbeceb] text-[#8c2f26]',
              )}
            >
              <p className="m-0">{erroEnvio}</p>
              <a
                className="mt-2 inline-flex items-center gap-1.5 font-[650] underline underline-offset-2"
                href={linkWhatsapp(
                  whatsapp,
                  `${apresentacao} Gostaria de um diagnóstico sobre ${ROTULO_INTERESSE[interesse].toLowerCase()}.${valores.email.trim() ? ` Meu e-mail: ${valores.email.trim()}.` : ''}`,
                )}
                target="_blank"
                rel="noopener"
              >
                Falar agora pelo WhatsApp <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={enviando} className={cn('btn btn-lg btn-block mt-5', escuro ? 'btn-claro' : 'btn-marca')}>
        {enviando ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando…
          </>
        ) : (
          <>
            Quero meu diagnóstico <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
      <p className={cn('m-0 mt-3 text-[0.78rem] leading-snug', escuro ? 'text-cinza-escuro' : 'text-cinza')}>
        Ao enviar, você concorda com o uso destes dados para o retorno do escritório, conforme a{' '}
        <Link href="/politica-de-privacidade" className={cn('underline underline-offset-2', escuro ? 'text-white' : 'text-marca')}>
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
