'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

/**
 * Alterna o tema e persiste a escolha. O estado inicial é lido do DOM
 * (que o /bootstrap.js já resolveu antes do paint), nunca do localStorage
 * durante a renderização — isso evita divergência de hidratação.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') {
      setTheme(attr);
      return;
    }
    setTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('dsa-theme', next);
    } catch {
      /* sem persistência em modo privado — o tema vale para esta sessão */
    }
    setTheme(next);
  }

  const label =
    theme === 'dark' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? (
        <Sun size={20} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
