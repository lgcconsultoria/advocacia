import type { Metadata } from 'next';
import { TelaPainel } from '@/components/sistema/telas/painel';

export const metadata: Metadata = { title: 'Painel' };

export default function Pagina() {
  return <TelaPainel />;
}
