import * as React from "react"
import { Button } from "./button"
import { indoku } from "../primitives/indoku"

export interface GraphViewport { xMin: number; xMax: number; yMin: number; yMax: number }
export interface GraphFunction { fn: (x: number) => number; color?: string; label?: string; dashed?: boolean }
export interface GraphPoint { x: number; y: number; label?: string; color?: string }
export interface Graph2DProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  functions?: GraphFunction[]
  points?: GraphPoint[]
  viewport?: GraphViewport
  aspect?: number
  interactive?: boolean
  grid?: boolean
}
const W = 800
const DEFAULT_VP: GraphViewport = { xMin: -10, xMax: 10, yMin: -7, yMax: 7 }
const PALETTE = ["var(--indoku-colors-accent-default)", "var(--indoku-colors-status-danger)", "var(--indoku-colors-status-success)", "var(--indoku-colors-status-warning)"]
const Root = indoku("div")
const Legend = indoku("div")
const LegendItem = indoku("div")
const Label = indoku("span")
const sceneColor = (color: string | undefined, fallback: string) => {
  if (!color) return fallback
  const semantic: Record<string, string> = { accent: "var(--indoku-colors-accent-default)", muted: "var(--indoku-colors-fg-muted)", ok: "var(--indoku-colors-status-success)", warn: "var(--indoku-colors-status-warning)", danger: "var(--indoku-colors-status-danger)" }
  return semantic[color] ?? color
}
function ticks(a: number, b: number) {
  const raw = (b - a) / 8
  if (!Number.isFinite(raw) || raw <= 0) return []
  const power = 10 ** Math.floor(Math.log10(raw)), magnitude = raw / power
  const step = (magnitude < 1.5 ? 1 : magnitude < 3.5 ? 2 : magnitude < 7.5 ? 5 : 10) * power
  const values: number[] = []
  for (let value = Math.ceil(a / step) * step; value <= b + 1e-9; value += step) values.push(+value.toFixed(10))
  return values
}
const fmt = (value: number) => Math.abs(value) < 1e-9 ? "0" : String(+value.toPrecision(4))

/** Interactive Cartesian graph with function curves, points, pan, zoom, and coordinate readout. */
export function Graph2D({ functions = [], points = [], viewport = DEFAULT_VP, aspect = 16 / 10, interactive = true, grid = true, style, ...props }: Graph2DProps) {
  const height = Math.max(1, Math.round(W / Math.max(0.1, aspect)))
  const [vp, setVp] = React.useState(viewport)
  const [hover, setHover] = React.useState<number | null>(null)
  const drag = React.useRef<{ x: number; y: number } | null>(null)
  const svg = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => setVp(viewport), [viewport.xMin, viewport.xMax, viewport.yMin, viewport.yMax])
  const { xMin, xMax, yMin, yMax } = vp
  const sx = React.useCallback((x: number) => ((x - xMin) / (xMax - xMin)) * W, [xMin, xMax])
  const sy = React.useCallback((y: number) => height - ((y - yMin) / (yMax - yMin)) * height, [height, yMin, yMax])
  const paths = React.useMemo(() => functions.map((fn) => {
    let path = "", pen = false, previous = NaN
    const jump = (yMax - yMin) * 0.9
    for (let i = 0; i <= 640; i++) {
      const x = xMin + ((xMax - xMin) * i) / 640
      let y: number
      try { y = fn.fn(x) } catch { pen = false; continue }
      if (!Number.isFinite(y) || (pen && Math.abs(y - previous) > jump)) { pen = false; previous = NaN; if (!Number.isFinite(y)) continue }
      path += `${pen ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`
      pen = true; previous = y
    }
    return path
  }), [functions, xMin, xMax, yMin, yMax, sx, sy])
  const axisX = Math.min(Math.max(sx(0), 0), W), axisY = Math.min(Math.max(sy(0), 0), height)
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = xMin + ((event.clientX - rect.left) / rect.width) * (xMax - xMin)
    setHover(x)
    const last = drag.current
    if (!last || !interactive) return
    const dx = ((event.clientX - last.x) / rect.width) * (xMax - xMin)
    const dy = ((event.clientY - last.y) / rect.height) * (yMax - yMin)
    drag.current = { x: event.clientX, y: event.clientY }
    setVp((value) => ({ xMin: value.xMin - dx, xMax: value.xMax - dx, yMin: value.yMin + dy, yMax: value.yMax + dy }))
  }
  const firstY = hover == null || !functions[0] ? NaN : (() => { try { return functions[0].fn(hover) } catch { return NaN } })()
  const zoom = (factor: number) => setVp((value) => {
    const cx = (value.xMin + value.xMax) / 2, cy = (value.yMin + value.yMax) / 2
    return { xMin: cx + (value.xMin - cx) * factor, xMax: cx + (value.xMax - cx) * factor, yMin: cy + (value.yMin - cy) * factor, yMax: cy + (value.yMax - cy) * factor }
  })
  return <Root {...props} style={style} border="1px solid" borderColor="border.subtle" borderRadius="lg" overflow="hidden" bg="bg.surface" color="fg.muted">
    <svg ref={svg} viewBox={`0 0 ${W} ${height}`} role="img" aria-label="Cartesian graph" style={{ width: "100%", height: "auto", display: "block", touchAction: interactive ? "none" : undefined, cursor: interactive ? "crosshair" : undefined }} onWheel={interactive ? (event) => { event.preventDefault(); zoom(event.deltaY < 0 ? 0.88 : 1 / 0.88) } : undefined} onPointerDown={interactive ? (event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY } } : undefined} onPointerMove={interactive ? onPointerMove : undefined} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onPointerLeave={() => { drag.current = null; setHover(null) }}>
      {grid && <g stroke="currentColor" opacity={0.15}>{ticks(xMin, xMax).map((value) => <line key={`gx${value}`} x1={sx(value)} x2={sx(value)} y1={0} y2={height} />)}{ticks(yMin, yMax).map((value) => <line key={`gy${value}`} y1={sy(value)} y2={sy(value)} x1={0} x2={W} />)}</g>}
      <g stroke="currentColor" opacity={0.7} strokeWidth={1.2}><line x1={0} x2={W} y1={axisY} y2={axisY} /><line y1={0} y2={height} x1={axisX} x2={axisX} /></g>
      <g fill="currentColor" fontSize="11">{ticks(xMin, xMax).filter((v) => v !== 0).map((v) => <text key={`tx${v}`} x={sx(v)} y={Math.min(axisY + 14, height - 4)} textAnchor="middle">{fmt(v)}</text>)}{ticks(yMin, yMax).filter((v) => v !== 0).map((v) => <text key={`ty${v}`} x={Math.min(axisX + 6, W - 30)} y={sy(v) + 4}>{fmt(v)}</text>)}</g>
      {paths.map((path, index) => <path key={index} d={path} fill="none" stroke={sceneColor(functions[index]?.color, PALETTE[index % PALETTE.length]!)} strokeWidth={2} strokeDasharray={functions[index]?.dashed ? "6 5" : undefined} strokeLinejoin="round" />)}
      {points.map((point, index) => <g key={index}><circle cx={sx(point.x)} cy={sy(point.y)} r={4.5} fill={sceneColor(point.color, PALETTE[index % PALETTE.length]!)} />{point.label && <text x={sx(point.x) + 8} y={sy(point.y) - 8} fontSize="12" fill="currentColor">{point.label}</text>}</g>)}
      {hover != null && Number.isFinite(firstY) && <g><line x1={sx(hover)} x2={sx(hover)} y1={0} y2={height} stroke="currentColor" opacity={0.3} strokeDasharray="3 3" /><circle cx={sx(hover)} cy={sy(firstY)} r={4} fill={sceneColor(functions[0]?.color, PALETTE[0]!)} /><text x={Math.min(sx(hover) + 8, W - 110)} y={Math.max(sy(firstY) - 10, 14)} fontSize="12" fill="currentColor">({fmt(hover)}, {fmt(firstY)})</text></g>}
    </svg>
    {(functions.some((fn) => fn.label) || interactive) && <Legend px="3" py="2" borderTop="1px solid" borderColor="border.subtle" display="flex" flexWrap="wrap" gap="4" alignItems="center" fontSize="sm">{functions.map((fn, index) => fn.label && <LegendItem key={index} display="inline-flex" alignItems="center" gap="6px"><span style={{ width: 12, height: 2, background: sceneColor(fn.color, PALETTE[index % PALETTE.length]!) }} /><Label color="fg.muted">{fn.label}</Label></LegendItem>)}{interactive && <><Button size="xs" variant="outline" onClick={() => zoom(0.8)}>Zoom in</Button><Button size="xs" variant="outline" onClick={() => zoom(1.25)}>Zoom out</Button><Button size="xs" variant="ghost" onClick={() => setVp(viewport)}>Reset view</Button></>}</Legend>}
  </Root>
}
export const CartesianCanvas = Graph2D
