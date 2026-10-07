import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TelaClientes } from '@/components/sistema/telas/clientes';
import { EsqueletoTela } from '@/components/sistema/ui/vazio';

export const metadata: Metadata = { title: 'Clientes' };

export default function Pagina() {
  return (
    <Suspense fallback={<EsqueletoTela />}>
      <TelaClientes />
    </Suspense>
  );
}
