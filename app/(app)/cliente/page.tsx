import { redirect } from 'next/navigation';

/** Enquanto não há login de verdade, /cliente leva à tela de entrada. */
export default function PaginaCliente() {
  redirect('/entrar');
}
