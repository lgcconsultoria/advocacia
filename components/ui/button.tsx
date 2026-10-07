import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Botão-pílula da marca. As classes visuais vivem em app/globals.css (.btn-*),
 * para valerem também nos formulários; aqui fica só a API no padrão shadcn.
 *  - marca: azul sobre o papel (CTA principal)
 *  - contorno: secundário sobre o papel
 *  - claro: branco sobre a tinta (CTA principal nas plantas escuras)
 *  - contorno-claro: secundário sobre a tinta
 */
export type ButtonVariant = 'marca' | 'contorno' | 'claro' | 'contorno-claro';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function buttonVariants({
  variant = 'marca',
  size = 'md',
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}) {
  return cn(
    'btn',
    `btn-${variant}`,
    size === 'lg' && 'btn-lg',
    size === 'sm' && 'btn-sm',
    block && 'btn-block',
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, block, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, block, className })}
      {...props}
    />
  )
);
Button.displayName = 'Button';
