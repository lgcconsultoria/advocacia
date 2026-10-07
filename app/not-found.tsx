import Link from 'next/link';

/** 404 (v2): fora do grupo (site), então traz a própria moldura mínima na linguagem da marca. */
export default function NotFound() {
  return (
    <main className="planta ruido relative isolate grid min-h-[100dvh] place-items-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="grade-planta pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[min(900px,130vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(29_27_154/0.7),transparent)] blur-2xl"
      />
      <p
        aria-hidden="true"
        className="expandida pointer-events-none absolute inset-x-0 top-1/2 -z-10 m-0 -translate-y-1/2 select-none text-center text-[30vw] font-[900] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(142_139_255/0.18)]"
      >
        404
      </p>
      <div className="w-full max-w-[600px]">
        <span aria-hidden="true" className="simbolo-mask inline-block h-12 w-12 text-white" />
        <p className="etiqueta etiqueta--escura m-0 mt-10">Erro 404</p>
        <h1 className="display m-0 mt-5 text-[clamp(2.4rem,7vw,4.2rem)] text-white">
          Página não <em className="text-sinal">encontrada</em>.
        </h1>
        <p className="m-0 mt-6 text-[1.05rem] leading-relaxed text-cinza-escuro">
          O endereço pode ter mudado ou não existir mais. Volte ao início ou conheça as frentes de atuação do
          escritório.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-claro btn-lg">
            Voltar ao início
          </Link>
          <Link href="/tributario" className="btn btn-contorno-claro btn-lg">
            Tributário
          </Link>
          <Link href="/areas" className="btn btn-contorno-claro btn-lg">
            Áreas de atuação
          </Link>
        </div>
      </div>
    </main>
  );
}
