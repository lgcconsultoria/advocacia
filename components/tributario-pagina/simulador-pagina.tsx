'use client';

import { SimuladorTributario } from '@/components/tributario/simulador';
import { useDiagnostico } from '@/components/diagnostico/contexto';

/** O simulador da página: o botão do estudo abre o diagnóstico com o assunto "tributário". */
export function SimuladorPagina() {
  const diagnostico = useDiagnostico();
  return (
    <SimuladorTributario
      onDiagnostico={() => {
        if (diagnostico) diagnostico.abrir('tributario');
        else window.location.href = '/diagnostico?interesse=tributario';
      }}
      rotuloCta="Quero o estudo com os números da minha empresa"
    />
  );
}
