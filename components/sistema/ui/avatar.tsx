import { cn } from '@/lib/utils';

const TONS = [
  'bg-[#8e8bff]/20 text-[#c9c7ff]',
  'bg-[#d39a5b]/20 text-[#e8c39a]',
  'bg-[#5b58e6]/30 text-[#d6d5ff]',
  'bg-[#62d2a2]/18 text-[#a9e9cd]',
  'bg-[#f0776c]/18 text-[#f6b2ab]',
];
const TONS_CLARO = [
  '[[data-tema=papel]_&]:bg-[#e6e5fb] [[data-tema=papel]_&]:text-[#15146f]',
  '[[data-tema=papel]_&]:bg-[#f6e7d6] [[data-tema=papel]_&]:text-[#7a4a1c]',
  '[[data-tema=papel]_&]:bg-[#dcdbfa] [[data-tema=papel]_&]:text-[#1d1b9a]',
  '[[data-tema=papel]_&]:bg-[#d8f1e6] [[data-tema=papel]_&]:text-[#16603f]',
  '[[data-tema=papel]_&]:bg-[#f7dcd9] [[data-tema=papel]_&]:text-[#8a2a21]',
];

function indice(nome: string) {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
  return h % TONS.length;
}

export function Avatar({ nome, iniciais, tamanho = 'md', className }: { nome: string; iniciais: string; tamanho?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  const i = indice(nome);
  return (
    <span
      title={nome}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold ring-1 ring-inset ring-white/10',
        TONS[i],
        TONS_CLARO[i],
        tamanho === 'xs' && 'size-5 text-[9px]',
        tamanho === 'sm' && 'size-7 text-[10.5px]',
        tamanho === 'md' && 'size-8 text-[11px]',
        tamanho === 'lg' && 'size-11 text-[14px]',
        className,
      )}
    >
      <span aria-hidden>{iniciais}</span>
      <span className="sr-only">{nome}</span>
    </span>
  );
}
