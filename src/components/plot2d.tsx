import * as React from "react"
import { indoku } from "../primitives/indoku"
import { PlayerBar, usePlayer } from "../lib/player"
import { StatsRow } from "../lib/stats"
import type { Item2DLike, Scene2DLike } from "../lib/scene-types"

export interface Plot2DProps {
  scene: Scene2DLike
  t?: number
  controls?: boolean
  aspect?: number
  grid?: boolean
  renderLatex?: (latex: string) => React.ReactNode
}
const W = 800
const Root = indoku("div")
const LatexRow = indoku("div")
const colors: Record<string, string> = { accent: "var(--indoku-colors-accent-default)", muted: "var(--indoku-colors-fg-muted)", ok: "var(--indoku-colors-status-success)", warn: "var(--indoku-colors-status-warning)", danger: "var(--indoku-colors-status-danger)" }
const color = (value?: string) => value ? colors[value] ?? value : colors.accent
function ticks(a: number, b: number) {
  const raw = (b - a) / 8
  if (raw <= 0 || !Number.isFinite(raw)) return []
  const power = 10 ** Math.floor(Math.log10(raw)), magnitude = raw / power
  const step = (magnitude < 1.5 ? 1 : magnitude < 3.5 ? 2 : magnitude < 7.5 ? 5 : 10) * power
  const result: number[] = []
  for (let value = Math.ceil(a / step) * step; value <= b + 1e-9; value += step) result.push(+value.toFixed(10))
  return result
}
export function Plot2D({ scene, t, controls = true, aspect = 16 / 9, grid = true, renderLatex }: Plot2DProps) {
  const height = Math.max(1, Math.round(W / Math.max(0.1, aspect)))
  const player = usePlayer({ duration: scene.duration, loop: scene.loop, autoPlay: t === undefined })
  const now = t ?? player.t
  const { xMin, xMax, yMin, yMax } = scene.bounds
  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const sy = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height
  const items = React.useMemo(() => scene.frame(now), [scene, now])
  const path = (points: [number, number][]) => points.map(([x, y], index) => `${index ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("")
  const draw = (item: Item2DLike, index: number) => {
    const stroke = color("color" in item ? item.color : undefined)
    if (item.t === "line") return <path key={index} d={path(item.pts)} fill="none" stroke={stroke} strokeWidth={item.width ?? 1.5} strokeDasharray={item.dash ? "6 5" : undefined} vectorEffect="non-scaling-stroke" />
    if (item.t === "point") return <g key={index}><circle cx={sx(item.x)} cy={sy(item.y)} r={item.r ?? 4} fill={stroke} />{item.label && <text x={sx(item.x) + 8} y={sy(item.y) - 8} fontSize="13" fill="currentColor">{item.label}</text>}</g>
    if (item.t === "vector") {
      const x1 = sx(item.x), y1 = sy(item.y), x2 = sx(item.x + item.dx), y2 = sy(item.y + item.dy)
      const angle = Math.atan2(y2 - y1, x2 - x1), length = 10
      const head = `${x2},${y2} ${x2 - length * Math.cos(angle - 0.4)},${y2 - length * Math.sin(angle - 0.4)} ${x2 - length * Math.cos(angle + 0.4)},${y2 - length * Math.sin(angle + 0.4)}`
      return <g key={index}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={2} /><polygon points={head} fill={stroke} />{item.label && <text x={x2 + 6} y={y2 - 6} fontSize="13" fill="currentColor">{item.label}</text>}</g>
    }
    return <text key={index} x={sx(item.x)} y={sy(item.y)} fontSize="13" fill={stroke}>{item.text}</text>
  }
  return <Root border="1px solid" borderColor="border.subtle" borderRadius="lg" overflow="hidden" bg="bg.surface" color="fg.default">
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={scene.title ?? "Plot"}>
      {grid && <g stroke="currentColor" opacity={0.12}>{ticks(xMin, xMax).map((value) => <line key={`x${value}`} x1={sx(value)} x2={sx(value)} y1={0} y2={height} />)}{ticks(yMin, yMax).map((value) => <line key={`y${value}`} y1={sy(value)} y2={sy(value)} x1={0} x2={W} />)}</g>}
      {items.map(draw)}
    </svg>
    {renderLatex && scene.latex?.length ? <LatexRow px="3" py="2" borderTop="1px solid" borderColor="border.subtle" display="flex" flexWrap="wrap" gap="4" fontSize="sm">{scene.latex.map((latex, index) => <span key={index}>{renderLatex(latex)}</span>)}</LatexRow> : null}
    {scene.stats && <StatsRow stats={scene.stats(now)} />}
    {controls && t === undefined && scene.duration > 0 && <PlayerBar player={player} />}
  </Root>
}
