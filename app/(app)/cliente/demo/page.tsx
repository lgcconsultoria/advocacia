import type { Metadata } from 'next';
import { PortalVisaoGeral } from '@/components/sistema/portal/telas';

export const metadata: Metadata = { title: 'Visão geral' };

export default function Pagina() {
  return <PortalVisaoGeral />;
}
