"use client";

/*!
 * Halaska UI — Slider
 * (c) Halaska Studio · https://ui.halaska.com · MIT License
 * Extracted from the single-file kit (halaska-kit/halaska-kit-v1.0.jsx):
 * Slider, SpringSlider, and the shared primitives they rely on
 * (tokens, motion, ThemeContext/usePal, Label, Text, Stack, labelText).
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";

// ─── TOKENS ─────────────────────────────────────────────────

const tokens = {
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 40,
    xxl: 80,
    xxxl: 160,
    xxxxl: 240,
  },
  radius: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, pill: 999 },
  type: {
    xxs: { fontSize: 9, lineHeight: 1.3 },
    xs: { fontSize: 10, lineHeight: 1.45 },
    sm: { fontSize: 12, lineHeight: 1.55, letterSpacing: "0.01em" },
    base: { fontSize: 13, lineHeight: 1.6, letterSpacing: "0.01em" },
    md: { fontSize: 14, lineHeight: 1.6, letterSpacing: "0.005em" },
    lg: { fontSize: 16, lineHeight: 1.5 },
    xl: { fontSize: 20, lineHeight: 1.35 },
    xxl: { fontSize: 24, lineHeight: 1.3 },
    xxxl: { fontSize: 32, lineHeight: 1.2 },
    display: { fontSize: 40, lineHeight: 1.15 },
  },
  font: {
    sans: "var(--halaska-sans, 'Geist'), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "var(--halaska-mono, 'Geist Mono'), 'SF Mono', 'Fira Code', monospace",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  light: {
    bg: "#fafafa",
    bgElevated: "#ffffff",
    bgSubtle: "#f3f3f3",
    bgMuted: "#eeeeee",
    bgHover: "#e8e8e8",
    bgInput: "#f0f0f0",
    border: "#e5e5e5",
    borderSubtle: "#eeeeee",
    borderInput: "rgba(0,0,0,0.06)",
    borderFocus: "#444444",
    text: "#3d3d3d",
    textSecondary: "#888888",
    textTertiary: "#aaaaaa",
    textMuted: "#cccccc",
    textInverse: "#ffffff",
    shadow: "rgba(0,0,0,0.04)",
    shadowMd: "rgba(0,0,0,0.06)",
    shadowLg: "rgba(0,0,0,0.1)",
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
    accentBg: "#f5f3ff",
    accentText: "#8b5cf6",
    success: "#22c55e",
    successHover: "#16a34a",
    successBg: "#f0fdf4",
    warning: "#f59e0b",
    warningHover: "#d97706",
    warningBg: "#fffbeb",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    dangerBg: "#fef2f2",
  },
  dark: {
    bg: "#1a1a1a",
    bgElevated: "#2a2a2a",
    bgSubtle: "#222222",
    bgMuted: "#333333",
    bgHover: "#3d3d3d",
    bgInput: "#252525",
    border: "#3a3a3a",
    borderSubtle: "#2f2f2f",
    borderInput: "rgba(255,255,255,0.06)",
    borderFocus: "#cccccc",
    text: "#d8d8d8",
    textSecondary: "#999999",
    textTertiary: "#6a6a6a",
    textMuted: "#4a4a4a",
    textInverse: "#1a1a1a",
    shadow: "rgba(0,0,0,0.2)",
    shadowMd: "rgba(0,0,0,0.3)",
    shadowLg: "rgba(0,0,0,0.4)",
    accent: "#a78bfa",
    accentHover: "#8b5cf6",
    accentBg: "rgba(167,139,250,0.12)",
    accentText: "#a78bfa",
    success: "#4ade80",
    successHover: "#22c55e",
    successBg: "rgba(74,222,128,0.1)",
    warning: "#fbbf24",
    warningHover: "#f59e0b",
    warningBg: "rgba(251,191,36,0.1)",
    danger: "#f87171",
    dangerHover: "#ef4444",
    dangerBg: "rgba(248,113,113,0.1)",
  },
};

// Durations (Material Design 3 aligned) and easings, exposed as CSS variables
// so the whole kit can switch motion mode at runtime.
const motion = {
  fast: "var(--halaska-t-fast, 0.15s)",
  normal: "var(--halaska-t-normal, 0.25s)",
  smooth: "var(--halaska-t-smooth, 0.35s)",
  spring: "var(--halaska-t-spring, 0.4s)",
  slow: "var(--halaska-t-slow, 0.5s)",

  easeInOut: "var(--halaska-e-inout, cubic-bezier(0.4, 0, 0.2, 1))",
  easeOut: "var(--halaska-e-out, cubic-bezier(0.0, 0, 0.2, 1))",
  easeIn: "var(--halaska-e-in, cubic-bezier(0.4, 0, 1, 1))",
  emphasized: "var(--halaska-e-emph, cubic-bezier(0.2, 0, 0, 1))",
  springCurve: "var(--halaska-e-spring, cubic-bezier(0.34, 1.56, 0.64, 1))",
};

const ThemeContext = createContext("light");
function useThemeContext() {
  return useContext(ThemeContext);
}

// Accent color context: allows live accent swapping
const AccentContext = createContext(null);
function useAccent() {
  return useContext(AccentContext);
}

function p(theme) {
  const base = theme === "dark" ? tokens.dark : tokens.light;
  return base;
}

// Hook that returns palette with accent overrides applied
function usePal(themeProp) {
  const ctxTheme = useThemeContext();
  const theme = themeProp || ctxTheme;
  const accent = useAccent();
  const base = p(theme);
  if (!accent || accent === base.accent) return base;
  // Generate variants from the accent hex
  const hex = accent;
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  const hR = Math.max(0, r - 30),
    hG = Math.max(0, g - 30),
    hB = Math.max(0, b - 30);
  const hoverHex = `#${hR.toString(16).padStart(2, "0")}${hG.toString(16).padStart(2, "0")}${hB.toString(16).padStart(2, "0")}`;
  const bgAlpha = theme === "dark" ? 0.12 : 0.08;
  return {
    ...base,
    accent: hex,
    accentText: hex,
    accentHover: hoverHex,
    accentBg: `rgba(${r},${g},${b},${bgAlpha})`,
  };
}

// A plain-text label can name a control for assistive tech.
const labelText = (label) => (typeof label === "string" ? label : undefined);

// ─── SHARED PRIMITIVES ─────────────────────────────────────

function Label({ children, required, htmlFor, theme: tp, style: sp }) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);
  return (
    <label
      htmlFor={htmlFor}
      style={{
        ...tokens.type.sm,
        fontWeight: tokens.weight.medium,
        fontFamily: tokens.font.sans,
        color: pal.textSecondary,
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
        ...sp,
      }}
    >
      {children}
      {required && (
        <span aria-hidden="true" style={{ color: pal.danger }}>
          *
        </span>
      )}
    </label>
  );
}

function Text({
  children,
  size = "base",
  weight = "regular",
  color,
  mono,
  muted,
  secondary,
  align,
  truncate,
  theme: tp,
  style: sp,
  as: C = "span",
}) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);
  let c = pal.text;
  if (color) c = color;
  else if (muted) c = pal.textMuted;
  else if (secondary) c = pal.textSecondary;

  return (
    <C
      style={{
        ...tokens.type[size],
        fontWeight: tokens.weight[weight],
        fontFamily: mono ? tokens.font.mono : tokens.font.sans,
        color: c,
        textAlign: align,
        transition: `color ${motion.smooth} ${motion.easeInOut}`,
        ...(truncate && {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }),
        ...sp,
      }}
    >
      {children}
    </C>
  );
}

function Stack({
  children,
  gap = "md",
  direction = "column",
  align,
  justify,
  wrap,
  style: sp,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "row" ? "row" : "column",
        gap: tokens.space[gap] ?? gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        ...sp,
      }}
    >
      {children}
    </div>
  );
}

// ─── SLIDER ─────────────────────────────────────────────────
// A native range input with the current value shown on the right.

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  theme: tp,
  "aria-label": ariaLabel,
}) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          aria-label={ariaLabel || labelText(label) || "Value"}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            height: 4,
            appearance: "none",
            background: `linear-gradient(to right, ${pal.accent} ${pct}%, ${pal.bgMuted} ${pct}%)`,
            borderRadius: 2,
            outline: "none",
            cursor: "pointer",
          }}
        />
        <span
          style={{
            ...tokens.type.sm,
            color: pal.textTertiary,
            fontFamily: tokens.font.mono,
            fontVariantNumeric: "tabular-nums",
            minWidth: 32,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── SPRING SLIDER ──────────────────────────────────────────
// A draggable track whose thumb grows while dragged and settles with a
// spring curve. Mouse/touch only (plus arrow-key support).

function SpringSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  theme: tp,
}) {
  const ctx = useThemeContext();
  const theme = tp || ctx;
  const pal = usePal(theme);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const trackRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const applyEvent = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange?.(Math.round(min + x * (max - min)));
  };

  useEffect(() => {
    if (!dragging) return;
    const m = (e) => applyEvent(e.clientX);
    const tm = (e) => {
      if (e.touches[0]) applyEvent(e.touches[0].clientX);
    };
    const u = () => setDragging(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mouseup", u);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", u);
    return () => {
      window.removeEventListener("mousemove", m);
      window.removeEventListener("mouseup", u);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", u);
    };
  }, [dragging]);

  const thumbScale = dragging ? 1.3 : hover ? 1.12 : 1;
  const thumbTrans = dragging
    ? `transform ${motion.fast} ${motion.easeOut}, box-shadow ${motion.normal} ${motion.easeOut}`
    : `transform ${motion.spring} ${motion.springCurve}, box-shadow ${motion.normal} ${motion.easeOut}, left ${motion.spring} ${motion.springCurve}`;
  const fillTrans = dragging
    ? "none"
    : `width ${motion.spring} ${motion.springCurve}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Label theme={theme}>{label}</Label>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={labelText(label) || "Value"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={(e) => {
            const step = e.shiftKey
              ? Math.max(1, Math.round((max - min) / 10))
              : 1;
            const to =
              e.key === "ArrowRight" || e.key === "ArrowUp"
                ? value + step
                : e.key === "ArrowLeft" || e.key === "ArrowDown"
                  ? value - step
                  : e.key === "Home"
                    ? min
                    : e.key === "End"
                      ? max
                      : null;
            if (to == null) return;
            e.preventDefault();
            onChange?.(Math.max(min, Math.min(max, to)));
          }}
          onTouchStart={(e) => {
            setDragging(true);
            if (e.touches[0]) applyEvent(e.touches[0].clientX);
          }}
          onMouseDown={(e) => {
            setDragging(true);
            applyEvent(e.clientX);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            position: "relative",
            flex: 1,
            height: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            touchAction: "none",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 4,
              borderRadius: 2,
              background: pal.bgMuted,
              transition: `background ${motion.smooth} ${motion.easeInOut}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              height: 4,
              width: `${pct}%`,
              borderRadius: 2,
              background: pal.accent,
              transition: fillTrans,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              transform: `translate(-50%, 0) scale(${thumbScale})`,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#fff",
              border: `1.5px solid ${pal.accent}`,
              boxShadow: dragging
                ? `0 0 0 6px ${pal.accent}22, 0 1px 3px rgba(0,0,0,0.18)`
                : "0 1px 3px rgba(0,0,0,0.15)",
              transition: thumbTrans,
            }}
          />
        </div>
        <span
          style={{
            ...tokens.type.sm,
            color: pal.textTertiary,
            fontFamily: tokens.font.mono,
            fontVariantNumeric: "tabular-nums",
            minWidth: 32,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export { SpringSlider, Stack, Text, Label, ThemeContext };
export default Slider;
