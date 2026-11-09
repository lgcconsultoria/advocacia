'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy, LoaderCircle } from 'lucide-react';
import { enviarLead, novoEventId } from '@/lib/contato/enviar-lead';
import { registrarLead } from '@/lib/medicao';
import { mascaraTelefone } from '@/components/diagnostico/formulario';
import { linkWhatsapp, type FrenteComLanding } from '@/lib/frentes';
import { BotaoWhatsapp } from './botao-whatsapp';

/**
 * Formulário curto das landings de frente: nome, WhatsApp, e-mail, cidade,
 * (empresa, se a frente for de empresa) e uma pergunta aberta da frente.
 * Envia pela porta do escritório (enviarLead) com `frente`, `cidade` e `detalhe`;
 * a porta ainda exige empresa, então vazio vai como "Pessoa física". No sucesso
 * dispara `generate_lead` (GA4), `Lead` (Pixel) e a conversão do Ads (se houver
 * rótulo), todos com a frente, e mostra "Falar agora no WhatsApp", que abre a
 * janela de 24 h pelo próprio lead.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Campo = 'nome' | 'telefone' | 'email' | 'cidade' | 'empresa' | 'detalhe';
type Estado = { fase: 'livre' | 'enviando' } | { fase: 'feito'; protocolo: string };

const CLASSE_TEXTAREA =
  'w-full resize-y rounded-2xl border border-papel-2 bg-white px-4 py-3 text-[16px] leading-snug text-grafite placeholder:text-[#8a8aa4] focus:border-marca focus:outline-none focus:ring-4 focus:ring-marca/10';

export function FormularioFrente({
  frente,
  interesse,
  pergunta,
  mostrarEmpresa,
  textoWhatsapp,
}: {
  frente: FrenteComLanding;
  interesse: 'licitacoes' | 'outro';
  pergunta: { rotulo: string; exemplo: string };
  mostrarEmpresa: boolean;
  textoWhatsapp: string;
}) {
  const uid = useId();
  const inicio = useRef(0);
  const [valores, setValores] = useState<Record<Campo, string>>({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    empresa: '',
    detalhe: '',
  });
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroEnvio, setErroEnvio] = useState('');
  const [estado, setEstado] = useState<Estado>({ fase: 'livre' });
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  function validar(v = valores): Partial<Record<Campo, string>> {
    const e: Partial<Record<Campo, string>> = {};
    if (v.nome.trim().length < 2) e.nome = 'Informe seu nome.';
    if (v.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe o WhatsApp com DDD.';
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'Informe um e-mail válido.';
    if (v.cidade.trim().length < 2) e.cidade = 'Informe a cidade.';
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
      const primeiro = (['nome', 'telefone', 'email', 'cidade'] as Campo[]).find((c) => e[c]);
      if (primeiro) document.getElementById(`${uid}-${primeiro}`)?.focus();
      return;
    }
    const f = new FormData(ev.currentTarget);
    setEstado({ fase: 'enviando' });
    setErroEnvio('');
    const eventId = novoEventId();
    const r = await enviarLead(
      {
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        telefone: valores.telefone,
        empresa: valores.empresa.trim() || 'Pessoa física',
        interesse,
        frente,
        cidade: valores.cidade.trim(),
        detalhe: valores.detalhe.trim(),
        website: String(f.get('website') ?? ''),
      },
      { inicio: inicio.current || undefined, eventId },
    );
    if (r.ok) {
      setEstado({ fase: 'feito', protocolo: r.protocolo });
      registrarLead({ categoria: interesse, nome: `frente:${frente}`, eventId: r.eventId, frente });
    } else {
      setEstado({ fase: 'livre' });
      setErroEnvio(r.erro);
    }
  }

  const campo = (nome: Exclude<Campo, 'detalhe'>, rotulo: string, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="min-w-0">
      <span className="campo">
        <input
          id={`${uid}-${nome}`}
          name={nome}
          value={valores[nome]}
          onChange={(ev) => mudar(nome, ev.target.value)}
          placeholder=" "
          aria-invalid={erros[nome] ? true : undefined}
          aria-describedby={erros[nome] ? `${uid}-${nome}-erro` : undefined}
          {...extra}
        />
        <label htmlFor={`${uid}-${nome}`}>{rotulo}</label>
      </span>
      {erros[nome] && (
        <p id={`${uid}-${nome}-erro`} className="m-0 mt-1.5 pl-1 text-[0.8rem] text-[var(--perigo)]">
          {erros[nome]}
        </p>
      )}
    </div>
  );

  if (estado.fase === 'feito') {
    const primeiroNome = valores.nome.trim().split(/\s+/)[0] ?? '';
    const texto = `${textoWhatsapp} Acabei de enviar o formulário (protocolo ${estado.protocolo}).`;
    return (
      <div className="text-center" role="status" aria-live="polite">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#8e8bff,#1d1b9a)] text-white shadow-[0_18px_40px_-14px_rgb(29_27_154/0.8)]">
          <Check className="h-8 w-8" strokeWidth={2.6} aria-hidden="true" />
        </span>
        <h3 className="expandida m-0 mt-6 text-[1.5rem] font-[780] leading-tight tracking-[-0.025em] text-grafite">
          Pedido recebido{primeiroNome ? `, ${primeiroNome}` : ''}.
        </h3>
        <p className="m-0 mx-auto mt-3 max-w-[38ch] text-[0.98rem] leading-relaxed text-cinza">
          O escritório já foi avisado e retorna em até 1 dia útil. Para adiantar, fale agora pelo WhatsApp.
        </p>
        <BotaoWhatsapp
          frente={frente}
          texto={texto}
          className="btn btn-lg btn-block mt-6 border-[#1f9d55] bg-[#1f9d55] text-white hover:bg-[#178246]"
        >
          Falar agora no WhatsApp <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
        </BotaoWhatsapp>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(estado.protocolo).then(() => setCopiado(true)).catch(() => {});
          }}
          className="rotulo num mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-papel-2 bg-papel px-4 py-2 text-[13px] tracking-[0.12em] text-marca"
          aria-label={`Protocolo ${estado.protocolo}. Copiar`}
        >
          {estado.protocolo}
          {copiado ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      </div>
    );
  }

  const enviando = estado.fase === 'enviando';

  return (
    <form onSubmit={enviar} noValidate className="relative" aria-busy={enviando}>
      <h2 className="expandida m-0 text-[1.35rem] font-[790] leading-[1.1] tracking-[-0.03em] text-grafite">
        Envie o caso para análise
      </h2>
      <p className="m-0 mt-2 text-[0.93rem] leading-relaxed text-cinza">
        Poucos campos. O escritório retorna em até 1 dia útil.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {campo('nome', 'Seu nome', { required: true, autoComplete: 'name', maxLength: 120, enterKeyHint: 'next', autoCapitalize: 'words' })}
        {campo('telefone', 'WhatsApp', { required: true, type: 'tel', autoComplete: 'tel-national', inputMode: 'tel', maxLength: 16, enterKeyHint: 'next' })}
        {campo('email', 'E-mail', { required: true, type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: 160, enterKeyHint: 'next', autoCapitalize: 'off', spellCheck: false })}
        {campo('cidade', 'Cidade', { required: true, autoComplete: 'address-level2', maxLength: 80, enterKeyHint: 'next' })}
        {mostrarEmpresa && (
          <div className="sm:col-span-2">
            {campo('empresa', 'Empresa (se houver)', { autoComplete: 'organization', maxLength: 160, enterKeyHint: 'next' })}
          </div>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor={`${uid}-detalhe`} className="mb-1.5 block text-[0.88rem] font-[600] leading-snug text-grafite">
          {pergunta.rotulo} <span className="font-normal text-cinza">(opcional)</span>
        </label>
        <textarea
          id={`${uid}-detalhe`}
          name="detalhe"
          rows={3}
          maxLength={500}
          value={valores.detalhe}
          onChange={(ev) => mudar('detalhe', ev.target.value)}
          placeholder={pergunta.exemplo}
          className={CLASSE_TEXTAREA}
        />
      </div>

      {/* campo-isca: fora da tela, fora do Tab, fora do leitor de tela */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Site <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {erroEnvio && (
        <div role="alert" className="mt-4 rounded-2xl border border-[#e2b4af] bg-[#fbeceb] p-4 text-[0.9rem] leading-relaxed text-[#8c2f26]">
          <p className="m-0">{erroEnvio}</p>
          <a
            className="mt-2 inline-flex items-center gap-1.5 font-[650] underline underline-offset-2"
            href={linkWhatsapp(frente, textoWhatsapp)}
            target="_blank"
            rel="noopener"
          >
            Falar agora pelo WhatsApp <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}

      <button type="submit" disabled={enviando} className="btn btn-lg btn-block btn-marca mt-5">
        {enviando ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando…
          </>
        ) : (
          <>
            Enviar para análise <ArrowRight className="seta h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="m-0 mt-3 text-[0.78rem] leading-snug text-cinza">
        Ao enviar, você concorda com o uso destes dados para o retorno do escritório, conforme a{' '}
        <Link href="/politica-de-privacidade" className="text-marca underline underline-offset-2">
          Política de Privacidade
        </Link>
        . A triagem técnica inicial não constitui mandato profissional.
      </p>
    </form>
  );
}
