'use client';

import { useRef, useState, type FormEvent } from 'react';
import { track } from '@/lib/analytics';

const OS = process.env.NEXT_PUBLIC_OS_URL ?? 'https://senturiao-os.vercel.app';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ModeloForm({ slug, documento }: { slug: string; documento: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [erros, setErros] = useState<Set<string>>(new Set());
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'pronto' | 'erro'>('parado');
  const [link, setLink] = useState('');
  const [msgErro, setMsgErro] = useState('');

  const cls = (n: string) => (erros.has(n) ? 'field has-error' : 'field');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const invalidos = new Set<string>();

    const nome = String(d.get('nome') ?? '').trim();
    const email = String(d.get('email') ?? '').trim();
    const telefone = String(d.get('telefone') ?? '').replace(/\D/g, '');
    const empresa = String(d.get('empresa') ?? '').trim();

    if (nome.length < 2) invalidos.add('nome');
    if (!EMAIL_RE.test(email)) invalidos.add('email');
    if (telefone.length < 10) invalidos.add('telefone');
    if (empresa.length < 2) invalidos.add('empresa');

    setErros(invalidos);
    if (invalidos.size) {
      (ref.current?.querySelector('.has-error input') as HTMLElement | null)?.focus();
      return;
    }

    setEstado('enviando');
    const p = new URLSearchParams(window.location.search);
    try {
      const r = await fetch(`${OS}/api/modelo/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelo: slug, nome, email, telefone, empresa,
          pagina: window.location.href,
          criativo: p.get('criativo') ?? p.get('ad') ?? '',
          utm_source: p.get('utm_source') ?? '',
          utm_medium: p.get('utm_medium') ?? '',
          utm_campaign: p.get('utm_campaign') ?? '',
        }),
      });
      const j = (await r.json()) as { url?: string; erro?: string };
      if (!r.ok || !j.url) throw new Error(j.erro || 'Falha ao gerar o material.');
      const url = j.url;

      track('material_download', { slug });
      setLink(url);
      setEstado('pronto');
      window.location.href = url;
    } catch (err) {
      setMsgErro(err instanceof Error ? err.message : 'Não foi possível enviar agora.');
      setEstado('erro');
    }
  }

  if (estado === 'pronto') {
    return (
      <div className="form-feedback is-visible" role="status" aria-live="polite">
        <h3 style={{ marginBottom: '.4rem' }}>O download começou.</h3>
        <p className="mb-0">
          Se o arquivo não baixou automaticamente,{' '}
          <a href={link}>clique aqui para baixar</a>. O link vale por 7 dias.
        </p>
      </div>
    );
  }

  return (
    <form ref={ref} className="form" noValidate onSubmit={onSubmit}
      onInput={(e) => {
        const el = e.target as HTMLInputElement;
        if (el.name) setErros((p) => { if (!p.has(el.name)) return p; const n = new Set(p); n.delete(el.name); return n; });
      }}
      aria-label={`Baixar ${documento}`}>
      {estado === 'erro' && <div className="form-error is-visible" role="alert">{msgErro}</div>}

      <div className={cls('nome')}>
        <label htmlFor="m-nome">Nome completo <span className="req" aria-hidden="true">*</span></label>
        <input type="text" id="m-nome" name="nome" autoComplete="name" required />
        <span className="field-error">Informe o seu nome.</span>
      </div>

      <div className={cls('empresa')}>
        <label htmlFor="m-empresa">Empresa <span className="req" aria-hidden="true">*</span></label>
        <input type="text" id="m-empresa" name="empresa" autoComplete="organization" required />
        <span className="field-error">Informe o nome da empresa.</span>
        <span className="hint">O modelo vem preparado com o nome dela.</span>
      </div>

      <div className="field-row">
        <div className={cls('email')}>
          <label htmlFor="m-email">E-mail <span className="req" aria-hidden="true">*</span></label>
          <input type="email" id="m-email" name="email" autoComplete="email" required />
          <span className="field-error">Informe um e-mail válido.</span>
        </div>
        <div className={cls('telefone')}>
          <label htmlFor="m-telefone">WhatsApp <span className="req" aria-hidden="true">*</span></label>
          <input type="tel" id="m-telefone" name="telefone" autoComplete="tel" placeholder="(11) 90000-0000" required />
          <span className="field-error">Informe um telefone válido.</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Preparando…' : 'Baixar modelo em .docx'}
        </button>
        <span className="hint">
          Material informativo e gratuito. Não constitui consulta jurídica nem
          estabelece relação advogado-cliente.
        </span>
      </div>
    </form>
  );
}
