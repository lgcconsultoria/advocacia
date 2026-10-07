import type { Metadata } from 'next';
import { PortalFinanceiro } from '@/components/sistema/portal/telas';

export const metadata: Metadata = { title: 'Contrato e faturas' };

export default function Pagina() {
  return <PortalFinanceiro />;
}
