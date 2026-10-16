'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Só monta `children` quando o lugar dele chega perto da tela. Até lá, ocupa o
 * espaço com uma caixa vazia (`className`, com a mesma altura) para não pular
 * o layout. Junto com next/dynamic, o JavaScript pesado (globo, skyline) só é
 * baixado quando a pessoa rola até ele.
 */
export function SobDemanda({
  children,
  className,
  margem = '600px',
}: {
  children: ReactNode;
  className?: string;
  margem?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ver, setVer] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVer(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVer(true);
          io.disconnect();
        }
      },
      { rootMargin: margem },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);

  if (ver) return <>{children}</>;
  return <div ref={ref} className={className} aria-hidden="true" />;
}
