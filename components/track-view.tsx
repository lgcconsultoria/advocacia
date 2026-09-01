'use client';

import { useEffect, useRef } from 'react';
import { track, type EventName, type EventParams } from '@/lib/analytics';

/** Registra um evento de visualização uma vez por montagem. Não renderiza nada. */
export function TrackView({
  event,
  params,
}: {
  event: EventName;
  params?: EventParams;
}) {
  const chave = JSON.stringify(params ?? {});
  const jaEnviou = useRef('');

  useEffect(() => {
    if (jaEnviou.current === chave) return;
    jaEnviou.current = chave;
    track(event, params);
    // `chave` já representa `params`; incluir o objeto causaria reenvio a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, chave]);

  return null;
}
