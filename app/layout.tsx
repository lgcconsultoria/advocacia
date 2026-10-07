import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Archivo com o eixo de largura (wdth): a classe .expandida usa font-stretch 125%,
// o mais perto da Britanica expandida da identidade.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--fonte-archivo',
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
  variable: '--fonte-serif',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonte-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.senturiaoadv.com.br'),
  title: {
    default:
      'Douglas Senturião Advocacia — Direito Administrativo, Cível e Empresarial',
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
  themeColor: '#0b0a2e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
