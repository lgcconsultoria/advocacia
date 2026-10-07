/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // proposta.senturiaoadv.com.br/<nome> → página reservada (cifrada) em /clientes/<código>.
  async rewrites() {
    const proposta = [{ type: 'host', value: 'proposta.senturiaoadv.com.br' }];
    return {
      beforeFiles: [
        { source: '/renato-barros', has: proposta, destination: '/clientes/kzvdeeavrl' },
        { source: '/parceria-cnp', has: proposta, destination: '/clientes/oqofnhztdb' },
      ],
    };
  },
  async redirects() {
    return [
      { source: '/', has: [{ type: 'host', value: 'proposta.senturiaoadv.com.br' }], destination: 'https://senturiaoadv.com.br', permanent: false },
    ];
  },
};

export default nextConfig;
