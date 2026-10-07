"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextMorphingProps {
  /** Phrases to cycle through. Needs at least two for a morph. */
  texts: string[];
  /** Outer layout class (size, weight, tracking, color). */
  className?: string;
  /** Length of each morph crossfade, in seconds. */
  morphDuration?: number;
  /** Hold time on the settled phrase before the next morph, in seconds. */
  cooldownDuration?: number;
  /** Pause the loop. */
  paused?: boolean;
}

const DEFAULT_MORPH = 1.5;
const DEFAULT_COOLDOWN = 0.5;

/**
 * TextMorphing
 *
 * Blur + opacity crossfade between phrases, with an SVG threshold filter for
 * the gooey dissolve. Same animation model as the classic morphing-text demo,
 * cleaned up for production use.
 */
export function TextMorphing({
  texts,
  className,
  morphDuration = DEFAULT_MORPH,
  cooldownDuration = DEFAULT_COOLDOWN,
  paused = false,
}: TextMorphingProps) {
  const reactId = React.useId().replace(/:/g, "");
  const filterId = `wensity-text-morph-${reactId}`;

  const text1Ref = React.useRef<HTMLSpanElement | null>(null);
  const text2Ref = React.useRef<HTMLSpanElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const textIndexRef = React.useRef(0);
  const morphRef = React.useRef(0);
  const cooldownRef = React.useRef(0);
  const timeRef = React.useRef(0);
  const inViewRef = React.useRef(true);
  const pausedPropRef = React.useRef(paused);
  pausedPropRef.current = paused;

  const phrases = React.useMemo(() => {
    const cleaned = texts.map((t) => t.trim()).filter(Boolean);
    return cleaned.length >= 2
      ? cleaned
      : ["Wensity", "presents", "text", "morphing", "animation"];
  }, [texts]);

  const morphTime = Math.max(0.2, morphDuration);
  const cooldownTime = Math.max(0, cooldownDuration);

  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    textIndexRef.current = 0;
    morphRef.current = 0;
    cooldownRef.current = 0;
  }, [phrases]);

  React.useEffect(() => {
    if (reduceMotion) return;

    const setStyles = (fraction: number) => {
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (!el1 || !el2) return;

      // Match reference curves exactly (including the 8/f singularity clamp).
      const f = Math.max(fraction, 0.0001);
      const inv = Math.max(1 - fraction, 0.0001);

      el2.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
      el2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      el1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      el1.style.opacity = `${Math.pow(1 - fraction, 0.4) * 100}%`;

      el1.textContent = phrases[textIndexRef.current % phrases.length] ?? "";
      el2.textContent =
        phrases[(textIndexRef.current + 1) % phrases.length] ?? "";
    };

    const doCooldown = () => {
      morphRef.current = 0;
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (!el1 || !el2) return;
      el2.style.filter = "none";
      el2.style.opacity = "100%";
      el1.style.filter = "none";
      el1.style.opacity = "0%";
    };

    /**
     * Reference timing trick: while morphing, `cooldown` stays ≤ 0 and drifts
     * negative by `dt` each frame. `morph -= cooldown` therefore advances morph
     * by `dt`. When morph completes, cooldown is set positive for the hold.
     */
    const doMorph = () => {
      morphRef.current -= cooldownRef.current;
      cooldownRef.current = 0;

      let fraction = morphRef.current / morphTime;

      if (fraction > 1) {
        cooldownRef.current = cooldownTime;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current += 1;
      }
    };

    let raf = 0;
    timeRef.current = performance.now();
    setStyles(0);

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);

      if (
        pausedPropRef.current ||
        !inViewRef.current ||
        (typeof document !== "undefined" &&
          document.visibilityState === "hidden")
      ) {
        timeRef.current = now;
        return;
      }

      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [cooldownTime, morphTime, phrases, reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "relative mx-auto flex h-16 w-full max-w-3xl items-center justify-center text-center text-[40pt] font-bold leading-none md:h-24 lg:text-[6rem]",
          "text-zinc-900 dark:text-white",
          className,
        )}
      >
        {phrases[0]}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative mx-auto h-16 w-full max-w-3xl text-center text-[40pt] font-bold leading-none md:h-24 lg:text-[6rem]",
        "text-zinc-900 dark:text-white",
        className,
      )}
      style={{ filter: `url(#${filterId}) blur(0.6px)` }}
    >
      <span
        ref={text1Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
      />
      <span
        ref={text2Ref}
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
      />

      {/* Inline SVG — required for the threshold dissolve (do not hoist off-DOM). */}
      <svg
        className="fixed h-0 w-0"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default TextMorphing;
