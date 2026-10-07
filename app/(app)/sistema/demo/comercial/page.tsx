import type { Metadata } from 'next';
import { TelaComercial } from '@/components/sistema/telas/comercial';

export const metadata: Metadata = { title: 'Comercial' };

export default function Pagina() {
  return <TelaComercial />;
}
