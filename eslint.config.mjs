import nextConfig from 'eslint-config-next';

// next lint foi removido no Next 16 (ver package.json). Este é o
// equivalente direto em flat config — o mesmo preset
// (next/core-web-vitals + next/typescript) que `next lint` usava, sem a
// CLI descontinuada.
const eslintConfig = [
  ...nextConfig,
  {
    ignores: ['playwright-report/**', 'test-results/**'],
  },
  {
    rules: {
      // react-hooks/set-state-in-effect é regra nova do eslint-plugin-
      // react-hooks 7 (trazido pelo eslint-config-next 16). Ela pega dois
      // padrões pré-existentes — ConsentBanner e ThemeToggle sincronizando
      // estado do React com localStorage/atributo do DOM num efeito
      // client-only, depois da hidratação, justamente para EVITAR
      // divergência de SSR — que predatam a regra e cuja reescrita exigiria
      // mudar a estratégia de hidratação dos dois componentes. Fora do
      // escopo desta onda de correções; mantido como aviso para revisão
      // futura, não como erro que quebraria `npm run lint` por um motivo
      // não relacionado às 8 correções desta rodada.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;
