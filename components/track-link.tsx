'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type EventName, type EventParams } from '@/lib/analytics';

type Props = ComponentProps<typeof Link> & {
  event: EventName;
  params?: EventParams;
};

/** Link que registra um evento no clique. A navegação nunca depende do registro. */
export function TrackLink({ event, params, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
