import Link from 'next/link';
import { hrefArea } from '@/lib/areas';

export type PostRelacionado = {
  slug: string;
  title: string;
  area: string;
  areaKey: string;
  description: string;
};

/**
 * Máximo de artigos listados em "Leia também".
 */
const LIMITE = 3;

/** Artigos da mesma área (areaKey), do mais recente ao mais antigo, sem o atual. */
export function relacionados(atual: { slug: string; areaKey: string }, posts: PostRelacionado[]) {
  return posts.filter((p) => p.slug !== atual.slug && p.areaKey && p.areaKey === atual.areaKey).slice(0, LIMITE);
}

/**
 * "Leia também": links internos no fim do artigo, para os artigos da mesma área
 * e para a página da área. `posts` já vem ordenado do mais recente ao mais antigo.
 */
export function LeiaTambem({
  atual,
  nomeArea,
  posts,
  areaExiste,
}: {
  atual: { slug: string; areaKey: string };
  nomeArea: string;
  posts: PostRelacionado[];
  areaExiste: boolean;
}) {
  const lista = relacionados(atual, posts);
  if (lista.length === 0 && !areaExiste) return null;

  return (
    <nav aria-labelledby="leia-tambem" className="mt-14">
      <p id="leia-tambem" className="rotulo m-0 text-marca">
        Leia também
      </p>
      <ul className="m-0 mt-4 grid list-none gap-3 p-0">
        {lista.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="font-[650] text-marca underline underline-offset-2">
              {p.title}
            </Link>
            <span className="mt-1 block text-[0.92rem] leading-snug text-cinza">{p.description}</span>
          </li>
        ))}
        {areaExiste && (
          <li>
            <Link href={hrefArea(atual.areaKey)} className="font-[650] text-marca underline underline-offset-2">
              {nomeArea}: a área de atuação
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
