import type { Metadata } from 'next';
import { TelaAlertas } from '@/components/sistema/telas/alertas';

export const metadata: Metadata = { title: 'Alertas' };

export default function Pagina() {
  return <TelaAlertas />;
}
