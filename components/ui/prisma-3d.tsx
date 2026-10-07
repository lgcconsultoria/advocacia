'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';

/**
 * Cristal 3D — adaptado do 21st.dev `@bevelui/prism-hero` (id 25977).
 *
 * Só a cena (o texto da página fica no DOM, para leitura e SEO): um cristal
 * facetado com transmissão e dispersão reais que refrata uma palavra desenhada
 * dentro da cena, mais poeira de luz. Cores da marca. O componente é pesado
 * (three + R3F + drei): entra por next/dynamic com ssr:false, só no desktop com
 * WebGL e sem prefers-reduced-motion (ver components/home/hero-fundo.tsx).
 * O laço para quando o hero sai da tela.
 */

type Qualidade = { samples: number; resolution: number; motes: number; backside: boolean; maxDpr: number };
const MEDIA: Qualidade = { samples: 4, resolution: 256, motes: 55, backside: true, maxDpr: 1.5 };
const ALTA: Qualidade = { samples: 6, resolution: 512, motes: 80, backside: true, maxDpr: 1.75 };

function resolverFonte(stack: string): string {
  const raiz = getComputedStyle(document.documentElement);
  return stack.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_m, nome: string) => raiz.getPropertyValue(nome).trim() || 'sans-serif');
}

function desenharPalavra(texto: string, cor: string, fonte: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const W = 2048;
  const H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const stack = resolverFonte(fonte);
  let tam = 420;
  do {
    ctx.font = `800 ${tam}px ${stack}`;
    // largura expandida (Archivo wdth 125) quando o navegador suporta
    (ctx as CanvasRenderingContext2D & { fontStretch?: string }).fontStretch = 'expanded';
    tam -= 8;
  } while (ctx.measureText(texto).width > W * 0.94 && tam > 40);
  ctx.fillStyle = cor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, W / 2, H / 2);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function Palavra({ texto, cor, fonte, fracao }: { texto: string; cor: string; fonte: string; fracao: number }) {
  const [tex, setTex] = React.useState(() => desenharPalavra(texto, cor, fonte));
  const { viewport } = useThree();
  React.useEffect(() => {
    let vivo = true;
    const refazer = () => vivo && setTex(desenharPalavra(texto, cor, fonte));
    if (document.fonts?.ready) document.fonts.ready.then(refazer).catch(refazer);
    return () => {
      vivo = false;
    };
  }, [texto, cor, fonte]);
  React.useEffect(() => () => tex?.dispose(), [tex]);
  if (!tex) return null;
  const largura = Math.min(viewport.width * fracao, 15);
  return (
    <mesh position={[0, 0, -2.2]} renderOrder={-1}>
      <planeGeometry args={[largura, largura * (640 / 2048)]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Cristal({ progresso, q }: { progresso: React.RefObject<number>; q: Qualidade }) {
  const ref = React.useRef<THREE.Mesh>(null);
  const ponteiro = React.useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const escala = THREE.MathUtils.clamp(Math.min(viewport.width, viewport.height) / 5.1, 0.42, 1);

  React.useEffect(() => {
    const mover = (e: PointerEvent) => {
      ponteiro.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      ponteiro.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, []);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const p = progresso.current ?? 0;
    const t = state.clock.elapsedTime;
    m.rotation.y = t * 0.13 + p * Math.PI * 1.1;
    m.rotation.x = Math.sin(t * 0.21) * 0.14 + p * 0.4;
    m.rotation.z = Math.cos(t * 0.17) * 0.08;
    m.position.x += (ponteiro.current.x * 0.35 - m.position.x) * Math.min(1, delta * 2.2);
    m.position.y += (-ponteiro.current.y * 0.28 - m.position.y) * Math.min(1, delta * 2.2);
    m.scale.setScalar(escala * (1 + p * 0.18));
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.32, 0]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={1.35}
        roughness={0.03}
        ior={1.92}
        chromaticAberration={0.28}
        anisotropy={0.25}
        distortion={0.18}
        distortionScale={0.35}
        temporalDistortion={0.06}
        backside={q.backside}
        backsideThickness={0.5}
        samples={q.samples}
        resolution={q.resolution}
        color="#ffffff"
        attenuationColor="#c9c7ff"
        attenuationDistance={8}
      />
    </mesh>
  );
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Poeira({ n, cor }: { n: number; cor: string }) {
  const ref = React.useRef<THREE.Points>(null);
  const { pos, vel } = React.useMemo(() => {
    const r = mulberry32(1337);
    const pos = new Float32Array(n * 3);
    const vel = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (r() - 0.5) * 18;
      pos[i * 3 + 1] = (r() - 0.5) * 11;
      pos[i * 3 + 2] = (r() - 0.5) * 6 - 1;
      vel[i] = 0.02 + r() * 0.05;
    }
    return { pos, vel };
  }, [n]);
  useFrame((_, d) => {
    const pts = ref.current;
    if (!pts) return;
    const a = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = a.array as Float32Array;
    for (let i = 0; i < n; i++) {
      arr[i * 3 + 1] += vel[i] * d;
      if (arr[i * 3 + 1] > 5.5) arr[i * 3 + 1] = -5.5;
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} count={n} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={cor} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Posiciona cristal e palavra: `deslocamento` é a fração da largura visível (0 = centro). */
function Composicao({ deslocamento, altura, children }: { deslocamento: number; altura: number; children: React.ReactNode }) {
  const { viewport } = useThree();
  return <group position={[viewport.width * deslocamento, altura, 0]}>{children}</group>;
}

export interface Prisma3DProps {
  /** Fração da largura visível para deslocar o conjunto (ex.: 0.22 = à direita). */
  deslocamento?: number;
  /** Altura do conjunto, em unidades da cena. */
  altura?: number;
  /** Largura da palavra, em fração da largura visível. */
  larguraPalavra?: number;
  /** Palavra desenhada atrás do cristal (é ela que o cristal refrata). */
  palavra?: string;
  fundo?: string;
  /** Elemento cujo scroll gira o cristal (0 → 1 enquanto ele sai da tela). */
  alvoScroll?: React.RefObject<HTMLElement | null>;
  className?: string;
  onPronto?: () => void;
}

export default function Prisma3D({
  palavra = 'SENTURIÃO',
  fundo = '#0b0a2e',
  alvoScroll,
  className,
  onPronto,
  deslocamento = 0,
  altura = 0.55,
  larguraPalavra = 0.94,
}: Prisma3DProps) {
  const palco = React.useRef<HTMLDivElement>(null);
  const progresso = React.useRef(0);
  const [naTela, setNaTela] = React.useState(true);
  const q = React.useMemo(
    () => (typeof window !== 'undefined' && window.innerWidth >= 1440 && (navigator.hardwareConcurrency ?? 4) > 8 ? ALTA : MEDIA),
    [],
  );

  React.useEffect(() => {
    const el = palco.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    let raf = 0;
    const atualizar = () => {
      raf = 0;
      const el = alvoScroll?.current ?? palco.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      progresso.current = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [alvoScroll]);

  return (
    <div ref={palco} className={className} aria-hidden="true">
      <Canvas
        frameloop={naTela ? 'always' : 'never'}
        dpr={[1, q.maxDpr]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ fov: 40, near: 0.1, far: 60, position: [0, 0, 7] }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(fundo), 1);
          onPronto?.();
        }}
      >
        <Environment resolution={256}>
          <Lightformer intensity={5} position={[0, 5, 4]} scale={[12, 4, 1]} color="#f4f2ff" />
          <Lightformer intensity={3.2} position={[-6, 1, 3]} scale={[4, 9, 1]} color="#8e8bff" />
          <Lightformer intensity={2.4} position={[6, -2, 2]} scale={[5, 6, 1]} color="#d39a5b" />
          <Lightformer intensity={1.8} position={[0, -4, -3]} scale={[9, 3, 1]} color="#ffffff" />
        </Environment>
        <Composicao deslocamento={deslocamento} altura={altura}>
          <Palavra texto={palavra} cor="#e9e8ff" fonte="var(--fonte-archivo), Archivo, sans-serif" fracao={larguraPalavra} />
          <Cristal progresso={progresso} q={q} />
        </Composicao>
        <Poeira n={q.motes} cor="#8e8bff" />
      </Canvas>
    </div>
  );
}
