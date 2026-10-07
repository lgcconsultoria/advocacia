"use client"

import { useEffect, useRef, useCallback, useState, type CSSProperties, type ReactNode } from "react"
import createGlobe from "cobe"

type RGB = [number, number, number]

export interface AnalyticsMarker {
  id: string
  location: [number, number]
  visitors: number
  trend: number
  /** Tamanho do marcador no cobe (padrão 0.04). */
  size?: number
  /** Cor própria do marcador (0–1). */
  color?: RGB
  /** Conteúdo do rótulo; substitui visitantes + tendência. */
  label?: ReactNode
  /** false esconde o rótulo deste marcador. */
  showLabel?: boolean
}

export interface GlobeAnalyticsProps {
  markers?: AnalyticsMarker[]
  className?: string
  speed?: number
  /**
   * Oscilação aleatória dos números (demonstração). Padrão true, como no
   * original; passe false quando os marcadores trazem dados reais.
   */
  drift?: boolean
  /** Ângulos iniciais (radianos). */
  initialPhi?: number
  initialTheta?: number
  /** Gira suavemente até [lat, lng] (e para a rotação automática). */
  focus?: [number, number] | null
  /** Fração do caminho percorrida por quadro ao girar até `focus` (1 = salta). */
  focusEase?: number
  /** Cores e luz do cobe (0–1). */
  baseColor?: RGB
  markerColor?: RGB
  glowColor?: RGB
  dark?: number
  diffuse?: number
  mapBrightness?: number
  mapBaseBrightness?: number
  scale?: number
  /** Estilo extra dos rótulos (sobre o padrão). */
  labelStyle?: CSSProperties
}

/** Ângulos do cobe que trazem [lat, lng] para o centro do globo. */
export function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

const defaultMarkers: AnalyticsMarker[] = [
  { id: "vis-1", location: [40.71, -74.01], visitors: 847, trend: 12 },
  { id: "vis-2", location: [51.51, -0.13], visitors: 623, trend: -3 },
  { id: "vis-3", location: [35.68, 139.65], visitors: 412, trend: 8 },
  { id: "vis-4", location: [48.86, 2.35], visitors: 385, trend: 5 },
  { id: "vis-5", location: [-33.87, 151.21], visitors: 201, trend: 15 },
  { id: "vis-6", location: [52.52, 13.41], visitors: 178, trend: -1 },
]

export function GlobeAnalytics({
  markers: initialMarkers = defaultMarkers,
  className = "",
  speed = 0.003,
  drift = true,
  initialPhi = 0,
  initialTheta = 0.2,
  focus = null,
  focusEase = 0.06,
  baseColor = [1, 1, 1],
  markerColor = [0.3, 0.85, 0.45],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  diffuse = 1.5,
  mapBrightness = 10,
  mapBaseBrightness,
  scale,
  labelStyle,
}: GlobeAnalyticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [drifted, setData] = useState(initialMarkers)
  const data = drift ? drifted : initialMarkers
  const markersRef = useRef(initialMarkers)
  const focusRef = useRef<[number, number] | null>(focus ? locationToAngles(focus[0], focus[1]) : null)
  const easeRef = useRef(focusEase)
  easeRef.current = focusEase
  const look = useRef({ baseColor, markerColor, glowColor, dark, diffuse, mapBrightness, mapBaseBrightness, scale, initialPhi, initialTheta })

  useEffect(() => {
    focusRef.current = focus ? locationToAngles(focus[0], focus[1]) : null
  }, [focus?.[0], focus?.[1]]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drift) return
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((m) => ({
          ...m,
          visitors: m.visitors + Math.floor(Math.random() * 11) - 3,
          trend: Math.max(-20, Math.min(20, m.trend + Math.floor(Math.random() * 5) - 2)),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [drift])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    focusRef.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    const lk = look.current
    let phi = lk.initialPhi
    let theta = lk.initialTheta
    let shownMarkers = markersRef.current
    const toCobe = (list: AnalyticsMarker[]) =>
      list.map((m) => ({ location: m.location, size: m.size ?? 0.04, id: m.id, ...(m.color ? { color: m.color } : {}) }))

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width, height: width,
      phi, theta, dark: lk.dark, diffuse: lk.diffuse,
      mapSamples: 16000, mapBrightness: lk.mapBrightness,
      ...(lk.mapBaseBrightness !== undefined ? { mapBaseBrightness: lk.mapBaseBrightness } : {}),
      ...(lk.scale !== undefined ? { scale: lk.scale } : {}),
      baseColor: lk.baseColor,
      markerColor: lk.markerColor,
      glowColor: lk.glowColor,
      markerElevation: 0,
      markers: toCobe(shownMarkers),
      arcs: [], arcColor: [0.25, 0.9, 0.5],
      arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
    })
    function animate() {
      const f = focusRef.current
      if (f && !isPausedRef.current) {
        // caminho mais curto até o alvo, com amortecimento
        const TAU = Math.PI * 2
        const atual = phi + phiOffsetRef.current
        const ida = (((f[0] - atual) % TAU) + TAU) % TAU
        const volta = (((atual - f[0]) % TAU) + TAU) % TAU
        const k = Math.min(1, Math.max(0, easeRef.current))
        phi += ida < volta ? ida * k : -volta * k
        theta += (f[1] - thetaOffsetRef.current - theta) * k
      } else if (!isPausedRef.current) phi += speed
      const next = markersRef.current !== shownMarkers ? (shownMarkers = markersRef.current) : null
      globe!.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
        ...(next ? { markers: toCobe(next) } : {}),
      })
      animationId = requestAnimationFrame(animate)
    }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [speed])

  // Marcadores novos entram no globo já criado (sem recriar o WebGL).
  useEffect(() => {
    markersRef.current = initialMarkers
  }, [initialMarkers])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {data.filter((m) => m.showLabel !== false).map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // CSS Anchor Positioning (já tipado no csstype atual)
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 6,
            display: "flex",
            alignItems: "baseline",
            gap: "0.35rem",
            padding: "0.3rem 0.5rem",
            background: "rgba(0,0,0,0.85)",
            borderRadius: 4,
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
            ...labelStyle,
          }}
        >
          {m.label !== undefined ? m.label : (<>
          <span style={{
            fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 600,
            color: "#fff", letterSpacing: "-0.02em",
          }}>{m.visitors}</span>
          <span style={{
            fontFamily: "monospace", fontSize: "0.55rem", fontWeight: 500,
            letterSpacing: "0.02em",
            color: m.trend >= 0 ? "#34d399" : "#f87171",
          }}>
            {m.trend >= 0 ? "↑" : "↓"} {Math.abs(m.trend)}%
          </span>
          </>)}
        </div>
      ))}
    </div>
  )
}
