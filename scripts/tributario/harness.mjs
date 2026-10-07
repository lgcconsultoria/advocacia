// Monta (ou atualiza) um app Next mínimo, fora do repositório, para ver e gravar os
// componentes tributários isolados — sem criar rotas no site.
//
//   node scripts/tributario/harness.mjs <pasta-de-rascunho>
//   cd <pasta-de-rascunho> && npx next dev -p 3123
//
// Páginas: /filme?formato=paisagem|retrato (filme controlado por window.__irPara(ms),
// usado por exportar-filme.mjs), /vitrine (simulador, fatura 3D e filme, para capturas).
// Copia lib/utils.ts, lib/tributario, components/tributario, app/globals.css e o layout
// (fontes); node_modules vira link simbólico para o do repositório.
import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const destino = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  console.error('uso: node scripts/tributario/harness.mjs <pasta-de-rascunho>');
  process.exit(1);
}

mkdirSync(destino, { recursive: true });
for (const p of ['lib/tributario', 'components/tributario', 'app']) rmSync(join(destino, p), { recursive: true, force: true });
for (const p of ['lib/utils.ts', 'lib/tributario', 'components/tributario', 'app/globals.css', 'app/layout.tsx', 'tsconfig.json', 'postcss.config.mjs']) {
  mkdirSync(dirname(join(destino, p)), { recursive: true });
  cpSync(join(raiz, p), join(destino, p), { recursive: true });
}
if (!existsSync(join(destino, 'node_modules'))) symlinkSync(join(raiz, 'node_modules'), join(destino, 'node_modules'));
if (!existsSync(join(destino, 'public'))) symlinkSync(join(raiz, 'public'), join(destino, 'public'));
writeFileSync(join(destino, 'package.json'), JSON.stringify({ name: 'harness-tributario', private: true }, null, 2));
writeFileSync(join(destino, 'next.config.mjs'), 'export default { reactStrictMode: true, devIndicators: false };\n');

const pagina = (rota, codigo) => {
  mkdirSync(join(destino, 'app', rota), { recursive: true });
  writeFileSync(join(destino, 'app', rota, 'page.tsx'), codigo);
};

pagina(
  'filme',
  `'use client';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { FaturaFilme } from '@/components/tributario/fatura-filme';

declare global {
  interface Window { __irPara?: (ms: number) => Promise<void>; __pronto?: boolean }
}

export default function Pagina() {
  const [t, setT] = useState(0);
  const [formato, setFormato] = useState<'paisagem' | 'retrato'>('paisagem');
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('formato') === 'retrato') setFormato('retrato');
    if (q.get('t')) setT(Number(q.get('t')));
    window.__irPara = (ms) => {
      flushSync(() => setT(ms));
      return new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok())));
    };
    document.fonts.ready.then(() => { window.__pronto = true; });
  }, []);
  return (
    <main style={{ margin: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: '#0b0a2e' }}>
      <FaturaFilme tempo={t} formato={formato} semControles moldura={false} />
    </main>
  );
}
`
);

pagina(
  'vitrine',
  `'use client';
import { FaturaFilme } from '@/components/tributario/fatura-filme';
import { Fatura3D } from '@/components/tributario/fatura-3d';
import { SimuladorTributario } from '@/components/tributario/simulador';

export default function Pagina() {
  return (
    <main>
      <section className="container py-16" id="simulador">
        <p className="rotulo text-marca">Simulador</p>
        <SimuladorTributario className="mt-6" onDiagnostico={(r) => alert(r.veredito.titulo)} />
      </section>
      <section className="py-16" id="fatura3d">
        <div className="container">
          <Fatura3D />
        </div>
      </section>
      <section className="planta py-16" id="filme">
        <div className="container">
          <FaturaFilme />
        </div>
      </section>
      <div style={{ height: '60vh' }} />
    </main>
  );
}
`
);

console.log(`harness pronto em ${destino}`);
