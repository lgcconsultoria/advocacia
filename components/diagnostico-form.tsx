'use client';

import { useRef, useState, type FormEvent } from 'react';

const WEBHOOK = 'https://webhook.licitacaogc.com.br/webhook/advocacia';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_TEXT = ['nome', 'email', 'telefone', 'cidade', 'descricao'];
const REQUIRED_RADIO = ['perfil', 'prazo', 'processo'];
const REQUIRED_CONSENT = ['aceite_privacidade', 'aceite_termo'];
const FILE_FIELDS = ['documento_principal', 'documentos_extra'];
const MAX_FILE_MB = 10;

export function DiagnosticoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );

  const cls = (name: string, base = 'field') =>
    errors.has(name) ? `${base} has-error` : base;

  const clearError = (name: string) => {
    setErrors((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const invalid = new Set<string>();

    for (const name of REQUIRED_TEXT) {
      const value = String(data.get(name) ?? '').trim();
      if (name === 'email' ? !EMAIL_RE.test(value) : value === '') {
        invalid.add(name);
      }
    }
    for (const name of REQUIRED_RADIO) {
      if (!data.get(name)) invalid.add(name);
    }
    let consentMissing = false;
    for (const name of REQUIRED_CONSENT) {
      if (!data.get(name)) consentMissing = true;
    }

    for (const name of FILE_FIELDS) {
      const files = data.getAll(name);
      const tooBig = files.some(
        (f) => f instanceof File && f.size > MAX_FILE_MB * 1024 * 1024
      );
      if (tooBig) invalid.add(name);
    }

    setErrors(invalid);
    setConsentError(consentMissing);

    if (invalid.size > 0 || consentMissing) {
      const first = form.querySelector('.has-error input, .has-error select, .has-error textarea') as
        | HTMLElement
        | null;
      first?.focus();
      return;
    }

    // Campos ocultos de automação (data/hora, origem, referência, UTMs).
    const params = new URLSearchParams(window.location.search);
    data.set('formulario', 'Diagnóstico jurídico inicial');
    data.set('enviado_em', new Date().toISOString());
    data.set('pagina_origem', window.location.href);
    data.set('referencia', document.referrer || 'acesso direto');
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
      data.set(k, params.get(k) || '');
    }

    setStatus('sending');
    try {
      await fetch(WEBHOOK, { method: 'POST', mode: 'no-cors', body: data });
      setStatus('sent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-feedback is-visible" role="status" aria-live="polite" tabIndex={-1}>
        <h3 style={{ marginBottom: '.3rem' }}>Recebemos a sua mensagem.</h3>
        <p className="mb-0">
          Em até 1 dia útil retornaremos com a triagem técnica inicial e os
          próximos passos. Se o seu caso envolver prazo em curso, ele orientará a
          prioridade do atendimento.
        </p>
      </div>
    );
  }

  return (
    <>
      {status === 'error' && (
        <div className="form-error is-visible" role="alert">
          Não foi possível enviar o formulário agora. Verifique a conexão e tente
          novamente em instantes — ou escreva para{' '}
          <a href="mailto:douglas@senturiaoadv.com.br">
            douglas@senturiaoadv.com.br
          </a>
          .
        </div>
      )}

      <form
        ref={formRef}
        id="form-diagnostico"
        className="form"
        noValidate
        onSubmit={onSubmit}
        onInput={(e) => {
          const el = e.target as HTMLInputElement;
          if (el.name) clearError(el.name);
          if (REQUIRED_CONSENT.includes(el.name)) setConsentError(false);
        }}
        aria-label="Formulário de diagnóstico jurídico inicial"
      >
        <fieldset>
          <legend>1. Identificação</legend>
          <div className="field-row">
            <div className={cls('nome')}>
              <label htmlFor="nome">
                Nome completo ou razão social{' '}
                <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" id="nome" name="nome" autoComplete="name" required />
              <span className="field-error">Informe o seu nome ou a razão social.</span>
            </div>
            <div className="field">
              <label htmlFor="documento">CPF ou CNPJ</label>
              <input type="text" id="documento" name="documento" inputMode="numeric" />
              <span className="hint">Opcional.</span>
            </div>
          </div>
          <div className="field-row">
            <div className={cls('email')}>
              <label htmlFor="email">
                E-mail <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="email" id="email" name="email" autoComplete="email" required />
              <span className="field-error">Informe um e-mail válido.</span>
            </div>
            <div className={cls('telefone')}>
              <label htmlFor="telefone">
                Telefone / WhatsApp <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                autoComplete="tel"
                placeholder="(11) 90000-0000"
                required
              />
              <span className="field-error">Informe um telefone para contato.</span>
            </div>
          </div>
          <div className={cls('cidade')}>
            <label htmlFor="cidade">
              Cidade / UF <span className="req" aria-hidden="true">*</span>
            </label>
            <input type="text" id="cidade" name="cidade" placeholder="São Paulo / SP" required />
            <span className="field-error">Informe a cidade e a UF.</span>
          </div>
          <div className={cls('perfil')}>
            <span className="label">
              Você é: <span className="req" aria-hidden="true">*</span>
            </span>
            <div className="choice-group">
              <label className="choice"><input type="radio" name="perfil" value="pessoa-fisica" /> Pessoa física</label>
              <label className="choice"><input type="radio" name="perfil" value="empresa" /> Empresa</label>
              <label className="choice"><input type="radio" name="perfil" value="servidor" /> Servidor público</label>
              <label className="choice"><input type="radio" name="perfil" value="candidato" /> Candidato a concurso</label>
              <label className="choice"><input type="radio" name="perfil" value="agente" /> Agente público</label>
              <label className="choice"><input type="radio" name="perfil" value="outro" /> Outro</label>
            </div>
            <span className="field-error">Selecione uma opção.</span>
          </div>
        </fieldset>

        <fieldset>
          <legend>2. Natureza da demanda</legend>
          <div className={cls('frente')}>
            <label htmlFor="frente">
              Qual frente melhor descreve o seu caso?{' '}
              <span className="req" aria-hidden="true">*</span>
            </label>
            <select id="frente" name="frente" required defaultValue="">
              <option value="" disabled>Selecione uma frente</option>
              <optgroup label="Direito Público">
                <option value="mandado-de-seguranca">Mandado de Segurança</option>
                <option value="licitacoes">Licitações Públicas</option>
                <option value="contratos">Contratos Públicos</option>
                <option value="servidores">Servidores Públicos</option>
                <option value="concursos">Concursos Públicos</option>
                <option value="improbidade">Defesa em Improbidade / TCU / TCE / CGU</option>
                <option value="habeas-data">Habeas Data</option>
                <option value="execucoes">Execução contra a Fazenda Pública</option>
              </optgroup>
              <optgroup label="Contencioso Cível e Empresarial">
                <option value="familia">Direito de Família</option>
                <option value="violencia-domestica">Violência Doméstica (Maria da Penha)</option>
                <option value="dividas-obrigacoes">Dívidas, Cobrança e Obrigações</option>
                <option value="empresarial">Direito Empresarial</option>
                <option value="crimes-licitatorios">Crimes Licitatórios</option>
                <option value="tributario">Reforma Tributária (IBS/CBS)</option>
              </optgroup>
              <option value="outro">Outro / não tenho certeza</option>
            </select>
            <span className="field-error">Selecione a frente do seu caso.</span>
          </div>
          <div className={cls('prazo')}>
            <span className="label">
              Há prazo em curso? <span className="req" aria-hidden="true">*</span>
            </span>
            <div className="choice-group">
              <label className="choice"><input type="radio" name="prazo" value="sim" /> Sim</label>
              <label className="choice"><input type="radio" name="prazo" value="nao" /> Não</label>
              <label className="choice"><input type="radio" name="prazo" value="nao-sei" /> Não sei</label>
            </div>
            <span className="field-error">Selecione uma opção.</span>
          </div>
          <div className="field">
            <label htmlFor="data-limite">Se há prazo, qual a data-limite?</label>
            <input type="date" id="data-limite" name="data_limite" />
            <span className="hint">
              Preencha apenas se souber a data. Casos com prazo têm tratativa
              prioritária.
            </span>
          </div>
          <div className={cls('processo')}>
            <span className="label">
              Já existe processo administrativo ou judicial em andamento?{' '}
              <span className="req" aria-hidden="true">*</span>
            </span>
            <div className="choice-group">
              <label className="choice"><input type="radio" name="processo" value="nao" /> Não</label>
              <label className="choice"><input type="radio" name="processo" value="administrativo" /> Administrativo</label>
              <label className="choice"><input type="radio" name="processo" value="judicial" /> Judicial</label>
              <label className="choice"><input type="radio" name="processo" value="ambos" /> Ambos</label>
            </div>
            <span className="field-error">Selecione uma opção.</span>
          </div>
          <div className="field">
            <label htmlFor="numero-processo">Número do processo</label>
            <input type="text" id="numero-processo" name="numero_processo" />
            <span className="hint">Opcional, se houver processo em andamento.</span>
          </div>
        </fieldset>

        <fieldset>
          <legend>3. Descrição do caso</legend>
          <div className={cls('descricao')}>
            <label htmlFor="descricao">
              Descreva objetivamente o que aconteceu{' '}
              <span className="req" aria-hidden="true">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              maxLength={2000}
              required
              placeholder="Relate os fatos na ordem em que ocorreram, com datas e o ato ou decisão envolvido."
            />
            <span className="hint">Até 2.000 caracteres.</span>
            <span className="field-error">
              Descreva o seu caso para que possamos fazer a triagem.
            </span>
          </div>
          <div className="field">
            <label htmlFor="objetivo">Qual o resultado que você busca?</label>
            <textarea
              id="objetivo"
              name="objetivo"
              maxLength={600}
              style={{ minHeight: '90px' }}
              placeholder="Ex.: suspender os efeitos de uma decisão, recorrer de um julgamento, receber um crédito."
            />
            <span className="hint">Opcional, mas ajuda na triagem.</span>
          </div>
        </fieldset>

        <fieldset>
          <legend>4. Documentos</legend>
          <div className={cls('documento_principal')}>
            <label htmlFor="documento-principal">
              Anexar ato, decisão, edital ou contrato pertinente
            </label>
            <input type="file" id="documento-principal" name="documento_principal" accept=".pdf" />
            <span className="hint">Formato PDF, até 10 MB.</span>
            <span className="field-error">
              O arquivo excede o limite de 10 MB. Reduza o PDF ou envie por e-mail.
            </span>
          </div>
          <div className={cls('documentos_extra')}>
            <label htmlFor="documentos-extra">Outros documentos relevantes</label>
            <input type="file" id="documentos-extra" name="documentos_extra" accept=".pdf" multiple />
            <span className="hint">Opcional. Formato PDF, até 10 MB por arquivo.</span>
            <span className="field-error">
              Um dos arquivos excede o limite de 10 MB. Reduza o PDF ou envie por e-mail.
            </span>
          </div>
        </fieldset>

        <fieldset>
          <legend>5. Origem</legend>
          <div className="field">
            <label htmlFor="origem">Como conheceu o escritório?</label>
            <select id="origem" name="origem" defaultValue="">
              <option value="">Prefiro não informar</option>
              <option value="busca">Busca na internet</option>
              <option value="indicacao">Indicação</option>
              <option value="redes">Redes sociais</option>
              <option value="conteudo">Blog ou conteúdo do escritório</option>
              <option value="outro">Outro</option>
            </select>
            <span className="hint">Opcional.</span>
          </div>
        </fieldset>

        <fieldset>
          <legend>6. Privacidade e termo de não constituição</legend>
          <div className={consentError ? 'consent has-error' : 'consent'}>
            <label className="choice">
              <input type="checkbox" name="aceite_privacidade" value="sim" required />
              <span>
                Li e concordo com a{' '}
                <a href="/politica-de-privacidade">Política de Privacidade</a> do
                escritório.
              </span>
            </label>
            <label className="choice">
              <input type="checkbox" name="aceite_termo" value="sim" required />
              <span>
                Estou ciente de que o envio deste formulário{' '}
                <strong>
                  não constitui mandato profissional, não estabelece relação
                  advogado-cliente e não gera honorários
                </strong>
                . As informações servirão apenas para triagem técnica e serão
                tratadas com sigilo profissional, em conformidade com a LGPD (Lei
                13.709/2018).
              </span>
            </label>
            <span className="field-error" style={{ marginTop: '.4rem' }}>
              É necessário concordar com os dois itens para enviar.
            </span>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar para triagem'}
          </button>
          <span className="hint">Retorno em até 1 dia útil.</span>
        </div>
      </form>
    </>
  );
}
