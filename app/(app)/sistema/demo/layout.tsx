import type { Metadata } from 'next';
import { ShellSistema } from '@/components/sistema/shell';

export const metadata: Metadata = {
  title: { default: 'Sistema 360 (demonstração)', template: '%s · Sistema 360 (demonstração)' },
  description: 'Protótipo do sistema interno do escritório, com dados fictícios.',
};

export default function LayoutSistemaDemo({ children }: { children: React.ReactNode }) {
  return <ShellSistema>{children}</ShellSistema>;
}
