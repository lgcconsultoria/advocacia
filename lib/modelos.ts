/** Catálogo de materiais gratuitos. Espelha src/modelos.ts do senturiao-os. */
export interface ModeloResumo {
  slug: string;
  titulo: string;
  chamada: string;
  linha: string;
  entrega: string[];
  buscas: string[];
  frente: string;
  documento: string;
  metaTitle: string;
  metaDescription: string;
}

const API = process.env.NEXT_PUBLIC_OS_URL ?? 'https://senturiao-os.vercel.app';

export async function getModelos(): Promise<ModeloResumo[]> {
  try {
    const r = await fetch(`${API}/api/modelos`, { next: { revalidate: 300 } });
    if (!r.ok) return [];
    const j = (await r.json()) as { modelos: ModeloResumo[] };
    return j.modelos ?? [];
  } catch {
    return [];
  }
}

export async function getModelo(slug: string): Promise<ModeloResumo | undefined> {
  return (await getModelos()).find((m) => m.slug === slug);
}
