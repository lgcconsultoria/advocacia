import type { Metadata } from 'next';
import { TelaPrazos } from '@/components/sistema/telas/prazos';

export const metadata: Metadata = { title: 'Prazos' };

export default function Pagina() {
  return <TelaPrazos />;
}
