'use client';

import { useEffect } from 'react';
import { EVENTO_CONSENTIMENTO } from '@/lib/consentimento';
import { registrarVisualizacao } from '@/lib/medicao';

/**
 * Dispara `ViewContent` no Pixel uma vez por página de serviço. Respeita o
 * consentimento: sem ele, nada; se a pessoa aceitar com a página aberta, dispara
 * nessa hora. Espera um ciclo para o Pixel ser carregado pelo <Medicao> do layout
 * (o efeito do filho roda antes do efeito do layout).
 */
export function VerConteudo({ categoria, nome }: { categoria: string; nome?: string }) {
  useEffect(() => {
    let feito = false;
    const tentar = () => {
      if (!feito) feito = registrarVisualizacao({ categoria, nome });
    };
    const t = window.setTimeout(tentar, 0);
    window.addEventListener(EVENTO_CONSENTIMENTO, tentar);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(EVENTO_CONSENTIMENTO, tentar);
    };
  }, [categoria, nome]);
  return null;
}
