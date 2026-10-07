import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TelaProcessos } from '@/components/sistema/telas/processos';
import { EsqueletoTela } from '@/components/sistema/ui/vazio';

export const metadata: Metadata = { title: 'Processos' };

export default function Pagina() {
  return (
    <Suspense fallback={<EsqueletoTela />}>
      <TelaProcessos />
    </Suspense>
  );
}
