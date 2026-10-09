import * as React from "react"
import { indoku } from "../primitives/indoku"
import { Button } from "./button"
import { PlayerBar, usePlayer } from "../lib/player"
import { StatsRow } from "../lib/stats"
import type { Obj3DLike, Scene3DLike, Vec3 } from "../lib/scene-types"

export interface Plot3DProps { scene: Scene3DLike; t?: number; controls?: boolean; height?: number; autoRotate?: boolean; renderLatex?: (latex: string) => React.ReactNode }
const Root = indoku("div")
const LatexRow = indoku("div")
const colors: Record<string, string> = { accent: "var(--indoku-colors-accent-default)", muted: "var(--indoku-colors-fg-muted)", ok: "var(--indoku-colors-status-success)", warn: "var(--indoku-colors-status-warning)", danger: "var(--indoku-colors-status-danger)" }
const color = (value?: string): string => value ? colors[value] ?? value : colors.accent!
interface Camera { yaw: number; pitch: number; zoom: number }
interface DrawPrimitive { depth: number; draw(context: CanvasRenderingContext2D): void }
export function Plot3D({ scene, t, controls = true, height = 360, autoRotate = false, renderLatex }: Plot3DProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = React.useState(640)
  const [camera, setCamera] = React.useState<Camera>({ yaw: 0.6, pitch: 0.35, zoom: 1 })
  const drag = React.useRef<{ x: number; y: number } | null>(null)
  const player = usePlayer({ duration: scene.duration, loop: scene.loop, autoPlay: t === undefined })
  const now = t ?? player.t
  const objects = React.useMemo(() => scene.frame(now), [scene, now])
  React.useEffect(() => {
    const parent = canvasRef.current?.parentElement
    if (!parent || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, Math.round(entry?.contentRect.width ?? 640))))
    observer.observe(parent)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    if (!autoRotate || drag.current) return
    let frame = 0
    const tick = () => { if (!drag.current) setCamera((value) => ({ ...value, yaw: value.yaw + 0.004 })); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [autoRotate])
  React.useEffect(() => {
    const canvas = canvasRef.current, context = canvas?.getContext("2d")
    if (!canvas || !context) return
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1
    canvas.width = width * dpr; canvas.height = height * dpr
    context.setTransform(dpr, 0, 0, dpr, 0, 0); context.clearRect(0, 0, width, height)
    const fg = typeof getComputedStyle === "undefined" ? "#888" : getComputedStyle(canvas).color || "#888"
    const { yaw, pitch, zoom } = camera, radius = Math.max(0.1, scene.radius), distance = radius * 4
    const scale = Math.min(width, height) / 2 / radius * 0.85 * zoom
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
    const view = (point: Vec3): Vec3 => { const x = point[0] * cy + point[2] * sy, z = -point[0] * sy + point[2] * cy; return [x, point[1] * cp - z * sp, point[1] * sp + z * cp] }
    const project = (point: Vec3) => { const v = view(point), k = distance / Math.max(0.1, distance - v[2]); return { x: width / 2 + v[0] * scale * k, y: height / 2 - v[1] * scale * k, z: v[2], k } }
    const primitives: DrawPrimitive[] = []
    const rotate = (point: Vec3, rotation?: Vec3): Vec3 => {
      if (!rotation) return point
      let [x, y, z] = point; const [a, b, c] = rotation
      ;[y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
      ;[x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)]
      ;[x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)]
      return [x, y, z]
    }
    for (const object of objects) {
      if (object.t === "sphere") {
        const point = project(object.pos), r = Math.max(1.5, object.r * scale * point.k), fill = color(object.color)
        primitives.push({ depth: point.z, draw: (ctx) => { ctx.beginPath(); ctx.arc(point.x, point.y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (object.label) { ctx.fillStyle = fg; ctx.font = "12px system-ui"; ctx.fillText(object.label, point.x + r + 4, point.y - r) } } })
      } else if (object.t === "line" || object.t === "arrow") {
        const points = (object.t === "line" ? object.pts : [object.from, object.to]).map(project)
        if (points.length < 2) continue
        const stroke = color(object.color)
        primitives.push({ depth: points.reduce((sum, point) => sum + point.z, 0) / points.length, draw: (ctx) => { ctx.beginPath(); ctx.moveTo(points[0]!.x, points[0]!.y); points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y)); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); if (object.t === "arrow") { const a = points[points.length - 2]!, b = points[points.length - 1]!, angle = Math.atan2(b.y - a.y, b.x - a.x); ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - 9 * Math.cos(angle - 0.45), b.y - 9 * Math.sin(angle - 0.45)); ctx.lineTo(b.x - 9 * Math.cos(angle + 0.45), b.y - 9 * Math.sin(angle + 0.45)); ctx.closePath(); ctx.fillStyle = stroke; ctx.fill() } } })
      } else if (object.t === "mesh") {
        const offset = object.position ?? [0, 0, 0], positions = object.mesh.positions, indices = object.mesh.indices, stroke = color(object.color)
        const pointAt = (index: number) => { const rotated = rotate([positions[index * 3]!, positions[index * 3 + 1]!, positions[index * 3 + 2]!], object.rotation); return project([rotated[0] + offset[0], rotated[1] + offset[1], rotated[2] + offset[2]]) }
        for (let i = 0; i + 2 < indices.length; i += 3) { const a = pointAt(indices[i]!), b = pointAt(indices[i + 1]!), c = pointAt(indices[i + 2]!); primitives.push({ depth: (a.z + b.z + c.z) / 3, draw: (ctx) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath(); ctx.fillStyle = stroke; ctx.globalAlpha = object.wire ? 0 : 0.45; ctx.fill(); ctx.globalAlpha = 0.65; ctx.strokeStyle = stroke; ctx.lineWidth = 0.6; ctx.stroke(); ctx.globalAlpha = 1 } }) }
      }
    }
    primitives.sort((a, b) => b.depth - a.depth).forEach((primitive) => primitive.draw(context))
  }, [objects, camera, width, height, scene.radius])
  const zoom = (factor: number) => setCamera((value) => ({ ...value, zoom: Math.min(4, Math.max(0.3, value.zoom * factor)) }))
  const onWheel = (event: React.WheelEvent<HTMLCanvasElement>) => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.1 : 0.9) }
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => { const previous = drag.current; if (!previous) return; setCamera((value) => ({ ...value, yaw: value.yaw + (event.clientX - previous.x) * 0.008, pitch: Math.max(-1.45, Math.min(1.45, value.pitch + (event.clientY - previous.y) * 0.008)) })); drag.current = { x: event.clientX, y: event.clientY } }
  return <Root border="1px solid" borderColor="border.subtle" borderRadius="lg" overflow="hidden" bg="bg.surface" color="fg.default">
    <canvas ref={canvasRef} role="img" aria-label={scene.title ?? "3D plot"} style={{ display: "block", width: "100%", height, touchAction: "none", cursor: "grab" }} onWheel={onWheel} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY } }} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onPointerLeave={() => { drag.current = null }} />
    {renderLatex && scene.latex?.length ? <LatexRow px="3" py="2" borderTop="1px solid" borderColor="border.subtle" display="flex" flexWrap="wrap" gap="4" fontSize="sm">{scene.latex.map((latex, index) => <span key={index}>{renderLatex(latex)}</span>)}</LatexRow> : null}
    {scene.stats && <StatsRow stats={scene.stats(now)} />}
    {controls && t === undefined && scene.duration > 0 && <PlayerBar player={player} />}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: 8 }}><Button size="xs" variant="outline" onClick={() => zoom(1.2)} aria-label="Zoom in">+</Button><Button size="xs" variant="outline" onClick={() => zoom(1 / 1.2)} aria-label="Zoom out">−</Button><Button size="xs" variant="ghost" onClick={() => setCamera({ yaw: 0.6, pitch: 0.35, zoom: 1 })}>Reset view</Button></div>
  </Root>
}
