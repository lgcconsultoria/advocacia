import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { archivo, inter } from '@/lib/fonts';
import './globals.css';

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
  themeColor: '#1d1b9a',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O middleware grava o nonce da requisição em `x-nonce`. Sob
  // script-src com 'strict-dynamic', um <script> escrito à mão no HTML
  // (diferente dos scripts que o próprio Next injeta) só executa se
  // carregar esse nonce — sem ele o bootstrap.js seria bloqueado e o
  // tema/reveal quebrariam silenciosamente.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        <script src="/bootstrap.js" nonce={nonce} />
      </head>
      <body>{children}</body>
    </html>
  );
}
