import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export const Rotulo = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Rotulo({ className, ...props }, ref) {
  return <LabelPrimitive.Root ref={ref} className={cn('text-[12.5px] font-medium text-(--s-fg-2)', className)} {...props} />;
});

export const Entrada = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icone?: React.ReactNode; tamanho?: 'md' | 'lg' }>(
  function Entrada({ className, icone, tamanho = 'md', ...props }, ref) {
    return (
      <div className="relative">
        {icone && (
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--s-faint) [&_svg]:size-4">
            {icone}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg bg-(--s-card-2) text-(--s-fg) ring-1 ring-inset ring-(--s-border-2) transition-shadow placeholder:text-(--s-faint) focus:ring-2 focus:ring-(--s-ring) focus:outline-none focus-visible:outline-none disabled:opacity-50',
            tamanho === 'lg' ? 'h-11 px-3.5 text-[14px]' : 'h-9 px-3 text-[13px]',
            icone && 'pl-9',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn('f-mono inline-grid h-5 min-w-5 place-items-center rounded-[5px] bg-(--s-elev) px-1 text-[10.5px] text-(--s-muted) ring-1 ring-inset ring-(--s-border)', className)}>
      {children}
    </kbd>
  );
}
