import type { Metadata } from 'next';
import { PortalProcessos } from '@/components/sistema/portal/telas';

export const metadata: Metadata = { title: 'Meus processos' };

export default function Pagina() {
  return <PortalProcessos />;
}
