import type { CSSProperties, ElementType, ReactNode } from 'react';

/** Stagger de no máximo 6 itens (0..5), conforme §4.1 do briefing. */
const MAX_STAGGER = 5;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Posição no lote. Acima de 5 o atraso satura — 14 cards nunca fazem cascata. */
  index?: number;
};

function revealStyle(index: number): CSSProperties {
  return { '--reveal-i': Math.min(index, MAX_STAGGER) } as CSSProperties;
}

/**
 * Marca um bloco para entrada suave. O estado padrão no CSS é VISÍVEL:
 * a ocultação só existe sob `html.js`, adicionada por /bootstrap.js.
 * Sem JavaScript, nada aqui esconde conteúdo.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  index = 0,
}: RevealProps) {
  return (
    <Tag
      className={className ? `${className} reveal` : 'reveal'}
      style={revealStyle(index)}
    >
      {children}
    </Tag>
  );
}

/** Contêiner de um lote. Não anima por si — apenas agrupa. */
export function RevealGroup({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={className}>{children}</Tag>;
}

/** Item de um lote. O chamador passa o índice para escalonar a entrada. */
export function RevealItem({
  children,
  className,
  as: Tag = 'div',
  index = 0,
}: RevealProps) {
  return (
    <Tag
      className={className ? `${className} reveal` : 'reveal'}
      style={revealStyle(index)}
    >
      {children}
    </Tag>
  );
}
