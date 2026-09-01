import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Douglas Senturião Advocacia',
    short_name: 'Senturião Adv.',
    description:
      'Estratégia jurídica para quem tem um conflito e um prazo. Direito Administrativo, cível e empresarial.',
    start_url: '/',
    display: 'standalone',
    lang: 'pt-BR',
    background_color: '#ffffff',
    theme_color: '#1d1b9a',
    icons: [
      // Dimensões reais dos arquivos (conferidas com `file`) — um `sizes`
      // incorreto quebra a instalação do PWA no Android.
      { src: '/assets/img/favicon.png', sizes: '64x64', type: 'image/png', purpose: 'any' },
      { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
      // Ícone maskable dedicado: a marca (logo-mark.png, 591x591) foi
      // reduzida e centralizada em um quadro 512x512 com fundo sólido
      // branco, mantendo o desenho dentro da zona segura circular
      // (~80% central) exigida pela spec de ícones maskable — sem isso
      // o launcher do Android corta a marca ao aplicar sua própria máscara.
      { src: '/assets/img/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
