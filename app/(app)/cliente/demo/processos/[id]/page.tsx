import type { Metadata } from 'next';
import { PortalProcesso } from '@/components/sistema/portal/telas';

export const metadata: Metadata = { title: 'Processo' };

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortalProcesso id={id} />;
}
