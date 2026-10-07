import type { Metadata } from 'next';
import { PortalDocumentos } from '@/components/sistema/portal/telas';

export const metadata: Metadata = { title: 'Documentos' };

export default function Pagina() {
  return <PortalDocumentos />;
}
