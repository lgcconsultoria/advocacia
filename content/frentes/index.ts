import type { FrenteComLanding } from '@/lib/frentes';
import type { ConteudoFrente } from './tipos';
import { MS_LICITACAO } from './ms_licitacao';
import { PREVIDENCIA } from './previdencia';
import { EXECUCAO } from './execucao';
import { EMPRESARIAL } from './empresarial';
import { SUPERENDIVIDAMENTO } from './superendividamento';

export type { ConteudoFrente } from './tipos';

export const CONTEUDO_FRENTES: Record<FrenteComLanding, ConteudoFrente> = {
  ms_licitacao: MS_LICITACAO,
  previdencia: PREVIDENCIA,
  execucao: EXECUCAO,
  empresarial: EMPRESARIAL,
  superendividamento: SUPERENDIVIDAMENTO,
};
