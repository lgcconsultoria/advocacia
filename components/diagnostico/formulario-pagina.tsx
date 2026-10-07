'use client';

import { useSearchParams } from 'next/navigation';
import type { Interesse } from '@/lib/contato/enviar-lead';
import { FormularioDiagnostico } from './formulario';

const VALIDOS: Interesse[] = ['tributario', 'licitacoes', 'outro'];

/** O formulário da página /diagnostico: lê o assunto de ?interesse= (vindo de um botão sem JavaScript). */
export function FormularioPagina({ whatsapp }: { whatsapp: string }) {
  const p = useSearchParams();
  const i = p.get('interesse') as Interesse | null;
  return (
    <FormularioDiagnostico
      whatsapp={whatsapp}
      escuro
      interesse={i && VALIDOS.includes(i) ? i : null}
      titulo="Conte quem é a sua empresa"
    />
  );
}
