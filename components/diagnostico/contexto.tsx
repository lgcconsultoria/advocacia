'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { lembrarUtms, type Interesse } from '@/lib/contato/enviar-lead';
import { Dialogo } from '@/components/ui/dialogo';
import { FormularioDiagnostico } from './formulario';

/**
 * O modal do diagnóstico, um só para o site inteiro: qualquer botão chama
 * `abrir('tributario' | 'licitacoes' | 'outro')`. Fica no layout do (site),
 * que passa o WhatsApp das configurações do CMS.
 */

type Ctx = { abrir: (interesse?: Interesse | null) => void; whatsapp: string };
const Contexto = createContext<Ctx | null>(null);

export function useDiagnostico() {
  return useContext(Contexto);
}

export function ProvedorDiagnostico({ whatsapp, children }: { whatsapp: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [interesse, setInteresse] = useState<Interesse | null>(null);
  const [chave, setChave] = useState(0);

  useEffect(() => {
    lembrarUtms();
  }, []);

  const abrir = useCallback((i?: Interesse | null) => {
    setInteresse(i ?? null);
    setChave((k) => k + 1);
    setAberto(true);
  }, []);

  const valor = useMemo(() => ({ abrir, whatsapp }), [abrir, whatsapp]);

  return (
    <Contexto.Provider value={valor}>
      {children}
      <Dialogo
        aberto={aberto}
        onAbertoChange={setAberto}
        titulo="Diagnóstico inicial"
        descricao="Formulário curto: nome, empresa, e-mail e WhatsApp."
      >
        <div className="relative overflow-hidden px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(142_139_255/0.35),transparent_65%)]"
          />
          <p className="rotulo relative m-0 text-[10.5px] text-marca">Douglas Senturião Advocacia</p>
          <FormularioDiagnostico key={chave} whatsapp={whatsapp} interesse={interesse} className="relative mt-2" autoFocus={false} />
        </div>
      </Dialogo>
    </Contexto.Provider>
  );
}
