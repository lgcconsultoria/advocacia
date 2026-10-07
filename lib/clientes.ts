/**
 * Páginas reservadas a clientes, servidas em /clientes/<código>.
 *
 * Cada página é um HTML cifrado por scripts/cifrar-pagina.mjs e só é decifrada no
 * navegador de quem tem a senha. O código é aleatório e não identifica o cliente:
 * o repositório é público, então nada aqui pode dizer de quem é a página.
 */
import uhctbggktw from '@/content/clientes/uhctbggktw.json';
import kzvdeeavrl from '@/content/clientes/kzvdeeavrl.json';

import oqofnhztdb from '@/content/clientes/oqofnhztdb.json';
export type PaginaCifrada = {
  v: 1;
  iteracoes: number;
  sal: string;
  iv: string;
  dados: string;
};

export const PAGINAS_RESERVADAS: Record<string, PaginaCifrada> = {
  uhctbggktw: uhctbggktw as PaginaCifrada,
  kzvdeeavrl: kzvdeeavrl as PaginaCifrada,
  oqofnhztdb: oqofnhztdb as PaginaCifrada,
};
