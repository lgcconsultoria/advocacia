import type { Metadata } from 'next';
import { ShellPortal } from '@/components/sistema/portal/shell';

export const metadata: Metadata = {
  title: { default: 'Portal do cliente (demonstração)', template: '%s · Portal do cliente (demonstração)' },
  description: 'Protótipo do portal do cliente, com dados fictícios.',
};

export default function LayoutPortalDemo({ children }: { children: React.ReactNode }) {
  return <ShellPortal>{children}</ShellPortal>;
}
