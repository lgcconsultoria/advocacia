import type { Metadata } from 'next';
import { LoginDividido } from '@/components/auth/login-dividido';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Área reservada para clientes e equipe do escritório Douglas Senturião Advocacia.',
};

export default function PaginaEntrar() {
  return <LoginDividido />;
}
