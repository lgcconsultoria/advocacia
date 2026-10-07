# lib/contato — envio do formulário "diagnóstico"

`enviar-lead.ts` manda o formulário curto (nome, e-mail, telefone/WhatsApp,
empresa e, opcionalmente, interesse) para a porta do escritório, em
`https://propostas.senturiaoadv.com.br/p/contato/lead`. A porta grava o lead
e avisa o Douglas na hora, pelo WhatsApp (com o link para responder em um
toque) e por e-mail. O código da porta mora no repo `agente-pessoal`
(`apps/porta/leads.py`; formato do lead em `deploy/README.md`, seção "Leads do
site").

## Assinatura

```ts
enviarLead(dados: DadosLead, opcoes?: OpcoesEnvioLead): Promise<RespostaLead>

type DadosLead = {
  nome: string;
  email: string;
  telefone: string;            // como foi digitado; a porta normaliza
  empresa: string;
  interesse?: 'tributario' | 'licitacoes' | 'outro' | null;
  website?: string;            // valor do campo-isca escondido
};
type OpcoesEnvioLead = {
  inicio?: number;             // Date.now() de quando o formulário apareceu
  pagina?: string;             // padrão: window.location.href
  endpoint?: string;           // padrão: ENDPOINT_LEAD
  signal?: AbortSignal;
  timeoutMs?: number;          // padrão: 15000
};
type RespostaLead = { ok: true; protocolo: string } | { ok: false; erro: string };
```

A função **nunca lança**: sempre resolve com `ok`. Em `ok: false`, `erro` já
vem em português, pronto para aparecer embaixo do botão (ex.: "Informe um
e-mail válido.", "Envio rápido demais. Confira os dados e clique em enviar de
novo.", "Muitos envios em pouco tempo…"). Os `utm_*` da visita e a página de
origem vão sozinhos.

## Como o formulário deve chamar

O componente é cliente (`'use client'`). Três cuidados:

1. **Campo-isca.** Um `<input name="website">` que humano não vê. Nada de
   `display: none` nem `type="hidden"` (alguns robôs pulam esses): tire da
   tela com CSS, tire do Tab e do autocompletar, e esconda do leitor de tela.
   Se vier preenchido, a porta responde `ok` mas não grava nem avisa.
2. **Tempo.** Guarde `Date.now()` quando o formulário montar e passe em
   `opcoes.inicio`. Envio com menos de 2 s é recusado (robô). Sem `inicio`,
   a função conta desde o carregamento da página.
3. **Validação no navegador** só para ajudar quem digita (`required`,
   `type="email"`, `inputMode="tel"`, `autoComplete`); quem decide é a porta.

```tsx
'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { enviarLead, type Interesse } from '@/lib/contato/enviar-lead';

export function FormularioDiagnostico() {
  const inicio = useRef(0);
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'feito'>('livre');
  const [erro, setErro] = useState('');

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (estado === 'enviando') return;
    const f = new FormData(evento.currentTarget);
    setEstado('enviando');
    setErro('');
    const r = await enviarLead(
      {
        nome: String(f.get('nome') ?? ''),
        email: String(f.get('email') ?? ''),
        telefone: String(f.get('telefone') ?? ''),
        empresa: String(f.get('empresa') ?? ''),
        interesse: (f.get('interesse') as Interesse | null) || null,
        website: String(f.get('website') ?? ''),
      },
      { inicio: inicio.current || undefined },
    );
    if (r.ok) {
      setEstado('feito'); // ex.: "Recebemos seu pedido. Protocolo r.protocolo."
    } else {
      setEstado('livre');
      setErro(r.erro);
    }
  }

  // ...
  // <form onSubmit={enviar}>
  //   <input name="nome" required maxLength={120} autoComplete="name" />
  //   <input name="email" type="email" required autoComplete="email" />
  //   <input name="telefone" inputMode="tel" required autoComplete="tel" />
  //   <input name="empresa" required maxLength={160} autoComplete="organization" />
  //   <select name="interesse">
  //     <option value="">Selecione</option>
  //     <option value="tributario">Tributário</option>
  //     <option value="licitacoes">Licitações</option>
  //     <option value="outro">Outro</option>
  //   </select>
  //   {/* campo-isca: fora da tela, fora do Tab, fora do leitor de tela */}
  //   <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto',
  //        width: 1, height: 1, overflow: 'hidden' }}>
  //     <label>Site <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
  //   </div>
  //   <button disabled={estado === 'enviando'}>Quero meu diagnóstico</button>
  //   {erro && <p role="alert">{erro}</p>}
  // </form>
}
```

Opcional: chame `lembrarUtms()` cedo (num componente cliente do layout) para
guardar os `utm_*` da página de entrada na sessão — assim um visitante que
chegou por anúncio e navegou até o formulário ainda leva a campanha junto.

## Limites e origem

- A porta só aceita envio de `https://www.senturiaoadv.com.br` e
  `https://senturiaoadv.com.br`. Prévias da Vercel (`*.vercel.app`) recebem
  "Envio não permitido a partir desta página." — é esperado.
- Em `next dev` (`http://localhost:3000`) só funciona se a porta estiver com
  `LEADS_CORS_DEV=true`, o que não acontece em produção. Para testar o
  componente localmente, passe `opcoes.endpoint` apontando para um mock.
- 10 envios por hora por IP; o 11º recebe a mensagem de "muitos envios".
