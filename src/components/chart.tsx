import * as React from "react"
import { indoku } from "../primitives/indoku"

export const chartTokens = { size: { sm: 160, md: 220, lg: 300 }, spacing: { sm: 4, md: 8, lg: 16 }, padding: { top: 14, right: 16, bottom: 26, left: 44 } } as const
export type ChartValue = number | null
export interface ChartSeries { name?: string; color?: string; values: ChartValue[]; axis?: "left" | "right"; dashed?: boolean }
export type ChartFormat = (value: number) => string
export const compactFormat: ChartFormat = (value) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 2 }).format(value)
export function sortChartData<T>(data: T[], by: (item: T) => number, direction: "asc" | "desc" = "desc"): T[] { return [...data].sort((a, b) => direction === "asc" ? by(a) - by(b) : by(b) - by(a)) }
export function niceDomain(min: number, max: number, count = 5): { ticks: number[]; domain: [number, number] } {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { ticks: [0, 1], domain: [0, 1] }
  if (min === max) max = min + 1
  const raw = (max - min) / Math.max(1, count), magnitude = 10 ** Math.floor(Math.log10(raw)), normalized = raw / magnitude
  const step = (normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10) * magnitude
  const start = Math.floor(min / step) * step, end = Math.ceil(max / step) * step, ticks: number[] = []
  for (let value = start; value <= end + step / 2; value += step) ticks.push(Math.round(value / step) * step)
  return { ticks, domain: [start, end] }
}
const Root = indoku("div"), LegendRoot = indoku("div"), LegendButton = indoku("button")
const PALETTE = ["var(--indoku-colors-accent-default)", "var(--indoku-colors-status-success)", "var(--indoku-colors-status-warning)", "var(--indoku-colors-status-danger)", "var(--indoku-colors-status-info)", "var(--indoku-colors-fg-muted)"]
const resolveColor = (value: string | undefined, index: number) => {
  const semantic: Record<string, string> = { accent: "var(--indoku-colors-accent-default)", success: "var(--indoku-colors-status-success)", ok: "var(--indoku-colors-status-success)", warning: "var(--indoku-colors-status-warning)", danger: "var(--indoku-colors-status-danger)", info: "var(--indoku-colors-status-info)", muted: "var(--indoku-colors-fg-muted)" }
  return value ? semantic[value] ?? value : PALETTE[index % PALETTE.length]!
}
export interface UseChartOptions { series?: { name?: string; color?: string }[]; format?: ChartFormat; highlight?: number | null }
export interface ChartApi { colors: string[]; format: ChartFormat; active: number | null; setActive: (index: number | null) => void; opacity: (index: number) => number; legendProps: (index: number) => { onMouseEnter: () => void; onMouseLeave: () => void; onFocus: () => void; onBlur: () => void }; tokens: typeof chartTokens }
export function useChart({ series = [], format = compactFormat, highlight }: UseChartOptions = {}): ChartApi {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const active = hovered ?? highlight ?? null
  const colors = React.useMemo(() => series.map((item, index) => resolveColor(item.color, index)), [series])
  return { colors, format, active, setActive: setHovered, opacity: (index) => active == null || active === index ? 1 : 0.28, legendProps: (index) => ({ onMouseEnter: () => setHovered(index), onMouseLeave: () => setHovered(null), onFocus: () => setHovered(index), onBlur: () => setHovered(null) }), tokens: chartTokens }
}
export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> { items: { name: string; color: string }[]; chart?: ChartApi }
export function ChartLegend({ items, chart, ...props }: ChartLegendProps) {
  return <LegendRoot display="flex" flexWrap="wrap" gap="3" py="2" fontSize="sm" {...props}>{items.map((item, index) => <LegendButton key={`${item.name}-${index}`} type="button" display="inline-flex" alignItems="center" gap="2" color="fg.default" bg="transparent" border="0" cursor="pointer" opacity={chart?.opacity(index) ?? 1} {...(chart?.legendProps(index) ?? {})}><span style={{ width: 12, height: 3, background: item.color }} />{item.name}</LegendButton>)}</LegendRoot>
}
export interface CommonChartProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "height" | "width" | "mode"> { height?: number; showGrid?: boolean; showAxes?: boolean; legend?: boolean; highlight?: number | null; categories?: string[]; xTickFormat?: (label: string, index: number) => string; yTickFormat?: ChartFormat }
export interface LineChartProps extends CommonChartProps { series: ChartSeries[]; area?: boolean; gradient?: boolean; showDots?: boolean; dashed?: boolean; connectNulls?: boolean; seriesLabels?: boolean; rightTickFormat?: ChartFormat }
export interface AreaChartProps extends CommonChartProps { series: ChartSeries[]; mode?: "overlap" | "stacked" | "percent"; gradient?: boolean; showDots?: boolean; referenceArea?: { from: number; to: number; label?: string } }
export interface BarChartProps extends CommonChartProps { series: ChartSeries[]; mode?: "grouped" | "stacked" | "percent"; gap?: number; joined?: boolean }
interface PlotFrameProps { series: ChartSeries[]; categories?: string[]; height: number; showGrid: boolean; showAxes: boolean; highlight?: number | null; legend: boolean; mode: "line" | "area" | "bar"; area?: boolean; showDots?: boolean; dashed?: boolean; xTickFormat?: (label: string, index: number) => string; yTickFormat?: ChartFormat }
function PlotFrame({ series, categories, height, showGrid, showAxes, highlight, legend, mode, area, showDots = true, dashed, xTickFormat, yTickFormat = compactFormat }: PlotFrameProps) {
  const chart = useChart({ series, highlight }), W = 640, pad = { top: 16, right: 16, bottom: 30, left: 48 }, innerW = W - pad.left - pad.right, innerH = height - pad.top - pad.bottom
  const count = Math.max(1, ...series.map((item) => item.values.length)), values = series.flatMap((item) => item.values.filter((value): value is number => value != null && Number.isFinite(value)))
  const domain = niceDomain(Math.min(0, ...values), Math.max(1, ...values), 5).domain
  const x = (index: number) => pad.left + (count === 1 ? innerW / 2 : (index / (count - 1)) * innerW)
  const y = (value: number) => pad.top + innerH - ((value - domain[0]) / (domain[1] - domain[0] || 1)) * innerH
  const names = series.map((item, index) => ({ name: item.name ?? `Series ${index + 1}`, color: chart.colors[index]! }))
  return <Root width="100%"> <svg viewBox={`0 0 ${W} ${height}`} width="100%" role="img" aria-label={`${mode === "bar" ? "Bar" : mode === "area" ? "Area" : "Line"} chart`}>
    {showGrid && <g stroke="currentColor" opacity="0.12">{niceDomain(domain[0], domain[1], 5).ticks.map((value) => <line key={value} x1={pad.left} x2={W - pad.right} y1={y(value)} y2={y(value)} />)}</g>}
    {showAxes && <g fill="currentColor" fontSize="10" opacity="0.8">{niceDomain(domain[0], domain[1], 5).ticks.map((value) => <text key={value} x={pad.left - 7} y={y(value) + 3} textAnchor="end">{yTickFormat(value)}</text>)}{Array.from({ length: count }, (_, index) => <text key={index} x={x(index)} y={height - 8} textAnchor="middle">{xTickFormat?.(categories?.[index] ?? String(index + 1), index) ?? (categories?.[index] ?? String(index + 1))}</text>)}</g>}
    {series.map((item, si) => {
      const points = item.values.map((value, index) => value == null || !Number.isFinite(value) ? null : { x: mode === "bar" ? pad.left + (index + 0.5) * (innerW / count) : x(index), y: y(value), value }).filter((point) => point !== null) as { x: number; y: number; value: number }[]
      if (mode === "bar") { const slot = innerW / count / Math.max(1, series.length), zero = y(0); return <g key={si} opacity={chart.opacity(si)}>{points.map((point, index) => <rect key={index} x={point.x - innerW / count / 2 + si * slot} y={Math.min(point.y, zero)} width={slot * 0.82} height={Math.max(1, Math.abs(zero - point.y))} fill={chart.colors[si]!} rx="2" />)}</g> }
      let pen = false; const d = item.values.map((value, index) => { if (value == null || !Number.isFinite(value)) { pen = false; return null } const command = `${pen ? "L" : "M"}${x(index)},${y(value)}`; pen = true; return command }).filter(Boolean).join(" ")
      const first = points[0], last = points[points.length - 1]
      return <g key={si} opacity={chart.opacity(si)}><path d={d} fill="none" stroke={chart.colors[si]!} strokeWidth="2" strokeDasharray={dashed || item.dashed ? "5 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />{area && first && last && <path d={`${d} L${last.x},${pad.top + innerH} L${first.x},${pad.top + innerH} Z`} fill={chart.colors[si]!} opacity="0.12" />}{showDots && points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3" fill="var(--indoku-colors-bg-surface)" stroke={chart.colors[si]!} strokeWidth="2" />)}</g>
    })}
  </svg>{legend && <ChartLegend items={names} chart={chart} />}</Root>
}
export function LineChart({ series, categories, height = 220, showGrid = true, showAxes = true, legend = false, highlight, area = false, showDots = true, dashed, xTickFormat, yTickFormat, ...props }: LineChartProps) { return <PlotFrame series={series} categories={categories} height={height} showGrid={showGrid} showAxes={showAxes} legend={legend} highlight={highlight} mode="line" area={area} showDots={showDots} dashed={dashed} xTickFormat={xTickFormat} yTickFormat={yTickFormat} {...props} /> }
export function AreaChart({ series, categories, height = 220, showGrid = true, showAxes = true, legend = false, highlight, mode: _mode, gradient: _gradient, showDots = false, xTickFormat, yTickFormat, ...props }: AreaChartProps) { return <PlotFrame series={series} categories={categories} height={height} showGrid={showGrid} showAxes={showAxes} legend={legend} highlight={highlight} mode="area" area showDots={showDots} xTickFormat={xTickFormat} yTickFormat={yTickFormat} {...props} /> }
export function BarChart({ series, categories, height = 220, showGrid = true, showAxes = true, legend = false, highlight, mode: _mode, gap: _gap, joined: _joined, xTickFormat, yTickFormat, ...props }: BarChartProps) { return <PlotFrame series={series} categories={categories} height={height} showGrid={showGrid} showAxes={showAxes} legend={legend} highlight={highlight} mode="bar" xTickFormat={xTickFormat} yTickFormat={yTickFormat} {...props} /> }
export interface PieDatum { name: string; value: number; color?: string }
export interface PieChartProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "height"> { data: PieDatum[]; size?: number; innerRadiusRatio?: number; padAngle?: number; detached?: number[]; detachDistance?: number; radialText?: { label: string; sublabel?: string }; legend?: boolean }
export function PieChart({ data, size = 220, innerRadiusRatio = 0, padAngle = 0, detached = [], detachDistance = 8, radialText, legend = false, ...props }: PieChartProps) {
  const chart = useChart({ series: data }), total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1, center = size / 2, radius = center - detachDistance - 2, inner = radius * innerRadiusRatio, pad = padAngle * Math.PI / 180
  let angle = -Math.PI / 2
  const slices = data.map((item, index) => { const sweep = Math.max(0, item.value) / total * Math.PI * 2, a0 = angle + pad / 2, a1 = angle + sweep - pad / 2, mid = angle + sweep / 2; angle += sweep; const offset = detached.includes(index) ? detachDistance : 0, cx = center + offset * Math.cos(mid), cy = center + offset * Math.sin(mid), point = (r: number, a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`, large = a1 - a0 > Math.PI ? 1 : 0; return { item, index, path: inner ? `M${point(inner, a0)} L${point(radius, a0)} A${radius},${radius} 0 ${large} 1 ${point(radius, a1)} L${point(inner, a1)} A${inner},${inner} 0 ${large} 0 ${point(inner, a0)} Z` : `M${cx},${cy} L${point(radius, a0)} A${radius},${radius} 0 ${large} 1 ${point(radius, a1)} Z` } })
  return <Root display="flex" flexDirection="column" alignItems="center" gap="2"><svg viewBox={`0 0 ${size} ${size}`} width={`${size}px`} height={`${size}px`} role="img" aria-label="Pie chart" {...props}>{slices.map(({ item, index, path }) => <path key={index} d={path} fill={resolveColor(item.color, index)} opacity={chart.opacity(index)} />)}{radialText && <g textAnchor="middle" fill="currentColor"><text x={center} y={center} fontSize="18" fontWeight="600">{radialText.label}</text>{radialText.sublabel && <text x={center} y={center + 18} fontSize="10">{radialText.sublabel}</text>}</g>}</svg>{legend && <ChartLegend items={data.map((item, index) => ({ name: item.name, color: resolveColor(item.color, index) }))} chart={chart} />}</Root>
}
export interface DonutChartProps extends PieChartProps {}
export function DonutChart({ innerRadiusRatio = 0.6, ...props }: DonutChartProps) { return <PieChart innerRadiusRatio={innerRadiusRatio} {...props} /> }
export interface SparklineProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "height" | "width" | "values" | "format"> { values: number[]; width?: number; height?: number; color?: string; area?: boolean; interactive?: boolean; format?: ChartFormat }
export function Sparkline({ values, width = 120, height = 32, color, area = false, interactive = false, format = compactFormat, ...props }: SparklineProps) {
  const [hover, setHover] = React.useState<number | null>(null), stroke = resolveColor(color, 0), low = Math.min(...values, 0), high = Math.max(...values, 1), pad = 3
  const points = values.map((value, index) => [values.length > 1 ? pad + index / (values.length - 1) * (width - 2 * pad) : width / 2, height - pad - (value - low) / (high - low || 1) * (height - 2 * pad)] as const), d = points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" "), active = hover == null ? null : points[hover]
  return <svg viewBox={`0 0 ${width} ${height}`} width={`${width}px`} height={`${height}px`} role="img" aria-label={`Sparkline: ${values.map(format).join(", ")}`} onPointerLeave={interactive ? () => setHover(null) : undefined} onPointerMove={interactive ? (event) => { const rect = event.currentTarget.getBoundingClientRect(); const position = ((event.clientX - rect.left) / Math.max(1, rect.width)) * width; setHover(Math.min(values.length - 1, Math.max(0, Math.round((position - pad) / (width - pad * 2) * (values.length - 1)))))} : undefined} {...props}>{area && <path d={`${d} L${points[points.length - 1]?.[0] ?? 0},${height} L${points[0]?.[0] ?? 0},${height} Z`} fill={stroke} opacity="0.12" />}<path d={d} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />{active && <g><circle cx={active[0]} cy={active[1]} r="3" fill={stroke} /><text x={active[0]} y={active[1] - 6} fontSize="10" fill="currentColor">{format(values[hover!]!)}</text></g>}</svg>
}
export function RadialText({ x, y, label, sublabel }: { x: number; y: number; label: string; sublabel?: string }) { return <g textAnchor="middle" fill="currentColor"><text x={x} y={y} fontSize="18" fontWeight="600">{label}</text>{sublabel && <text x={x} y={y + 18} fontSize="10">{sublabel}</text>}</g> }
