'use client';

import * as React from 'react';
import { gerarDadosDemo, type DadosDemo } from '@/lib/demo/dados';

type Ctx = (DadosDemo & { agora: Date }) | null;
const DemoContext = React.createContext<Ctx>(null);

/**
 * Gera os dados fictícios no navegador, a partir da data de hoje do visitante.
 * Antes de montar (no HTML do servidor) o valor é null e as telas mostram um
 * esqueleto — assim servidor e navegador nunca discordam sobre "hoje".
 */
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = React.useState<Ctx>(null);
  React.useEffect(() => {
    const d = gerarDadosDemo(new Date());
    // "Agora" fixo da demonstração: hoje às 9h50, para os horários relativos fazerem sentido.
    const agora = new Date(d.hoje);
    agora.setHours(9, 50, 0, 0);
    setDados({ ...d, agora });
  }, []);
  return <DemoContext.Provider value={dados}>{children}</DemoContext.Provider>;
}

export const useDemo = () => React.useContext(DemoContext);
