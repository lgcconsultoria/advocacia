import type { Metadata } from 'next';
import { TelaPublicacoes } from '@/components/sistema/telas/publicacoes';

export const metadata: Metadata = { title: 'Publicações' };

export default function Pagina() {
  return <TelaPublicacoes />;
}
