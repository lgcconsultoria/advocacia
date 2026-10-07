import { redirect } from 'next/navigation';

/** Enquanto não há login de verdade, /sistema leva à tela de entrada. */
export default function PaginaSistema() {
  redirect('/entrar');
}
