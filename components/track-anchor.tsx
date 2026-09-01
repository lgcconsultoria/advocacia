'use client';

import type { AnchorHTMLAttributes } from 'react';
import { track, type EventName, type EventParams } from '@/lib/analytics';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: EventName;
  params?: EventParams;
};

/** Âncora comum que registra um evento no clique. A navegação nunca depende do registro. */
export function TrackAnchor({ event, params, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
