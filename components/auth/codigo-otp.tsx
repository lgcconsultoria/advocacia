'use client';

/* Porte do OTP Input (21st.dev 34833, @uvain) sobre input-otp: um input real
   por baixo — colar o código em qualquer caixa, autofill do SMS
   (autocomplete="one-time-code") e Backspace voltando. */

import * as React from 'react';
import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from 'input-otp';
import { cn } from '@/lib/utils';

function Caixa({ char, hasFakeCaret, isActive }: SlotProps) {
  return (
    <div
      className={cn(
        'f-mono relative grid aspect-square max-w-12 min-w-0 flex-1 place-items-center rounded-xl bg-(--s-card-2) text-[18px] font-semibold tabular-nums ring-1 ring-inset ring-(--s-border-2) transition-shadow',
        isActive && 'ring-2 ring-(--s-ring)',
      )}
    >
      {char}
      {hasFakeCaret && (
        <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="pulso h-5 w-px bg-(--s-fg)" />
        </span>
      )}
    </div>
  );
}

export function CodigoOtp({
  valor,
  aoMudar,
  aoCompletar,
  id,
  rotulo = 'Código de 6 dígitos',
  autoFocus,
}: {
  valor: string;
  aoMudar: (v: string) => void;
  aoCompletar?: (v: string) => void;
  id?: string;
  rotulo?: string;
  autoFocus?: boolean;
}) {
  return (
    <OTPInput
      id={id}
      maxLength={6}
      value={valor}
      onChange={aoMudar}
      onComplete={aoCompletar}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      aria-label={rotulo}
      containerClassName="flex w-full max-w-[340px] items-center gap-2"
      render={({ slots }) => (
        <>
          {slots.map((s, i) => (
            <React.Fragment key={i}>
              {i === 3 && <span aria-hidden className="h-0.5 w-2.5 shrink-0 rounded-full bg-(--s-border-2)" />}
              <Caixa {...s} />
            </React.Fragment>
          ))}
        </>
      )}
    />
  );
}
