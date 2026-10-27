import type { Metadata } from 'next';

// Admin do CMS: nunca indexar (o robots.txt já bloqueia o rastreio; isto cobre
// o caso de alguém chegar à página por link).
export const metadata: Metadata = {
  title: 'Keystatic',
  robots: { index: false, follow: false, nocache: true },
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
