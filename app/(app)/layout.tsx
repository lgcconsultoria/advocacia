import type { Metadata, Viewport } from 'next';
import { RaizSistema } from '@/components/sistema/tema';
import './sistema.css';

/**
 * Grupo de rotas da área logada (/entrar, /sistema, /cliente).
 * Sem cabeçalho nem rodapé do site público. Nada aqui deve ser indexado.
 *
 * Observação: o cabeçalho HTTP X-Robots-Tag não pode ser definido por
 * metadata; ele precisa de headers() no next.config.mjs (ver
 * docs/sistema-360/PROTOTIPO.md). Aqui fica a meta tag robots.
 */
export const metadata: Metadata = {
  title: { default: 'Jurídico 360', template: '%s — Jurídico 360' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0a2e',
};

export default function LayoutAreaLogada({ children }: { children: React.ReactNode }) {
  return <RaizSistema>{children}</RaizSistema>;
}
