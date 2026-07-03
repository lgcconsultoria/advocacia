import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.senturiaoadv.com.br'),
  title: {
    default:
      'Douglas Senturião Advocacia — Direito Administrativo estratégico em São Paulo',
    template: '%s — Douglas Senturião Advocacia',
  },
  description:
    'Escritório de Direito Administrativo com atuação em todo o Brasil. Mandado de segurança, licitações, contratos públicos, servidores, concursos, defesa de agentes públicos, habeas data e execuções — e contencioso cível e empresarial: família, dívidas e obrigações, direito empresarial e crimes licitatórios.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Douglas Senturião Advocacia',
    images: ['/assets/img/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/assets/img/favicon.png',
    apple: '/assets/img/apple-touch-icon.png',
  },
  // Código de verificação do Google Search Console: defina a variável de
  // ambiente GOOGLE_SITE_VERIFICATION na Vercel (Settings → Environment
  // Variables) e faça redeploy — sem precisar alterar o código.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: '#1d1b9a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
