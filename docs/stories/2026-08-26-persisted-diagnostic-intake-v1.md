# Story — formulário de diagnóstico com ACK persistido

## Contexto

O formulário atual envia `FormData` ao n8n em `no-cors`, mostra sucesso sem conseguir ler a
resposta e pede documentos antes da primeira conversa. A política confirmada pelo responsável é
conversa diagnóstica primeiro e documentos depois.

## Resultado

Enviar o formulário ao contrato de entrada do Senturião, reutilizar uma chave de idempotência em
retries e mostrar sucesso somente após o backend confirmar `status: persisted`. O formulário deixa
de pedir documentos no primeiro contato.

## Critérios de aceitação

- [x] retry da mesma submissão reutiliza `Idempotency-Key`;
- [x] sucesso exige HTTP válido, `ok: true` e `status: persisted`;
- [x] erro de persistência permanece visível ao usuário;
- [x] formulário não coleta arquivos antes da conversa inicial;
- [x] copy explica que documentos serão solicitados depois, se necessários;
- [x] build passa e nenhuma publicação é executada.

## File List

- `docs/stories/2026-08-26-persisted-diagnostic-intake-v1.md`
- `components/diagnostico-form.tsx`
- `.env.example`

## Verificação

- `npm run build`: aprovado com TypeScript e 47 páginas;
- vocabulário de frentes alinhado ao Senturião (`contratos-publicos`, `defesa-agentes`);
- nenhum push ou deploy executado.
