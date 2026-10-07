import Link from 'next/link';

/** 404: fora do grupo (site), então traz a própria moldura mínima na linguagem da marca. */
export default function NotFound() {
  return (
    <main className="planta relative isolate grid min-h-[100dvh] place-items-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="grade-planta pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]"
      />
      <div className="w-full max-w-[560px]">
        <span aria-hidden="true" className="simbolo-mask inline-block h-12 w-12 text-white" />
        <p className="rotulo m-0 mt-10 text-sinal">Erro 404</p>
        <h1 className="expandida m-0 mt-4 text-[clamp(2.2rem,7vw,3.8rem)] font-[800] leading-[0.98] tracking-[-0.04em] text-white">
          Página não encontrada.
        </h1>
        <p className="m-0 mt-6 text-[1.05rem] leading-relaxed text-cinza-escuro">
          O endereço pode ter mudado ou não existir mais. Volte ao início ou
          conheça as áreas de atuação do escritório.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-claro btn-lg">
            Voltar ao início
          </Link>
          <Link href="/areas" className="btn btn-contorno-claro btn-lg">
            Áreas de atuação
          </Link>
        </div>
      </div>
    </main>
  );
}
