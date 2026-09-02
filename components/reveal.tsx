'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ElementType, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  y?: number;
};

/**
 * Discreet, intentional scroll reveal. Fades and lifts content into view once.
 * Fully disabled under prefers-reduced-motion (content renders in its final
 * state), so it never becomes an accessibility barrier.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  y = 18,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as ElementType;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const props: HTMLMotionProps<'div'> = {
    className,
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
  };

  return <MotionTag {...props}>{children}</MotionTag>;
}

/**
 * Reveal a group of children in sequence (stagger). Each direct child should be
 * wrapped by <RevealItem/>.
 */
export function RevealGroup({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as ElementType;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.09 }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as ElementType;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
