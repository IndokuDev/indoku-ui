import * as React from "react"
import { GripVertical, GripHorizontal } from "lucide-react"
import { indoku } from "../primitives/indoku"

type Direction = "horizontal" | "vertical"
interface PanelConfig { defaultSize?: number; minSize?: number; maxSize?: number }
interface ResizableContextValue { direction: Direction; sizes: number[]; resize: (index: number, delta: number) => void; startDrag: (index: number, event: React.PointerEvent<HTMLDivElement>) => void }
const ResizableContext = React.createContext<ResizableContextValue | null>(null)
function useResizable() { const context = React.useContext(ResizableContext); if (!context) throw new Error("Resizable panels must be inside PanelGroup"); return context }
const GroupElement = indoku("div")
const PanelElement = indoku("div")
const HandleElement = indoku("div")
export interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> { direction?: Direction; onLayout?: (sizes: number[]) => void }
export function PanelGroup({ direction = "horizontal", onLayout, children, ...props }: PanelGroupProps) {
  const childArray = React.Children.toArray(children)
  const panels = childArray.filter((child) => React.isValidElement(child) && (child.type as { displayName?: string }).displayName === "Panel") as React.ReactElement<PanelConfig>[]
  const initial = panels.map((panel) => panel.props.defaultSize ?? 100 / Math.max(1, panels.length))
  const total = initial.reduce((sum, size) => sum + size, 0) || 100
  const [sizes, setSizes] = React.useState(() => initial.map((size) => size * 100 / total))
  const groupRef = React.useRef<HTMLDivElement>(null)
  const dragRef = React.useRef<{ index: number; start: number; sizes: number[] } | null>(null)
  const limits = panels.map((panel) => ({ min: panel.props.minSize ?? 0, max: panel.props.maxSize ?? 100 }))
  const resize = React.useCallback((index: number, delta: number) => {
    setSizes((current) => {
      const next = [...current]
      const left = index
      const right = index + 1
      if (right >= next.length) return current
      const minLeft = limits[left]?.min ?? 0, maxLeft = limits[left]?.max ?? 100
      const minRight = limits[right]?.min ?? 0, maxRight = limits[right]?.max ?? 100
      const currentLeft = next[left]
      const currentRight = next[right]
      if (currentLeft === undefined || currentRight === undefined) return current
      const adjusted = Math.max(minLeft, Math.min(maxLeft, currentLeft + delta))
      const actual = adjusted - currentLeft
      if (currentRight - actual < minRight || currentRight - actual > maxRight) return current
      next[left] = adjusted; next[right] = currentRight - actual
      onLayout?.(next)
      return next
    })
  }, [limits.map((limit) => `${limit.min}:${limit.max}`).join("|"), onLayout])
  const startDrag = (index: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (!groupRef.current) return
    event.preventDefault()
    const rect = groupRef.current.getBoundingClientRect()
    dragRef.current = { index, start: direction === "horizontal" ? event.clientX : event.clientY, sizes: [...sizes] }
    const length = direction === "horizontal" ? rect.width : rect.height
    const onMove = (move: PointerEvent) => { if (!dragRef.current || !length) return; const position = direction === "horizontal" ? move.clientX : move.clientY; const delta = (position - dragRef.current.start) / length * 100; dragRef.current.start = position; resize(index, delta) }
    const onUp = () => { dragRef.current = null; document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerup", onUp) }
    document.addEventListener("pointermove", onMove); document.addEventListener("pointerup", onUp, { once: true })
  }
  const context = React.useMemo(() => ({ direction, sizes, resize, startDrag }), [direction, sizes, resize])
  let panelIndex = 0, handleIndex = 0
  const composed = childArray.map((child) => {
    if (!React.isValidElement(child)) return child
    const name = (child.type as { displayName?: string }).displayName
    if (name === "Panel") { const index = panelIndex++; return React.cloneElement(child as React.ReactElement<any>, { __index: index, __size: sizes[index] ?? 0, key: child.key ?? `panel-${index}` }) }
    if (name === "Handle") { const index = handleIndex++; return React.cloneElement(child as React.ReactElement<any>, { __index: index, key: child.key ?? `handle-${index}` }) }
    return child
  })
  return <ResizableContext.Provider value={context}><GroupElement ref={groupRef} display="flex" flexDirection={direction === "horizontal" ? "row" : "column"} alignItems="stretch" width="100%" height="100%" minW="0" minH="0" data-direction={direction} {...props}>{composed}</GroupElement></ResizableContext.Provider>
}
PanelGroup.displayName = "PanelGroup"
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement>, PanelConfig { collapsible?: boolean; collapsedSize?: number; __index?: number; __size?: number }
export function Panel({ defaultSize: _defaultSize, minSize: _minSize, maxSize: _maxSize, collapsible: _collapsible, collapsedSize: _collapsedSize, __index = 0, __size = 50, style, ...props }: PanelProps) { const { direction } = useResizable(); return <PanelElement data-panel-index={__index} data-size={__size} flex={`0 0 ${__size}%`} minW={direction === "horizontal" ? "0" : undefined} minH={direction === "vertical" ? "0" : undefined} overflow="auto" style={style} {...props} /> }
Panel.displayName = "Panel"
export interface HandleProps extends React.HTMLAttributes<HTMLDivElement> { withHandle?: boolean; step?: number; __index?: number }
export function Handle({ withHandle = false, step = 5, __index = 0, onPointerDown, onKeyDown, ...props }: HandleProps) {
  const { direction, resize, startDrag } = useResizable()
  return <HandleElement role="separator" aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"} aria-label="Resize panels" tabIndex={0} data-direction={direction} onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => { onPointerDown?.(event); if (!event.defaultPrevented) startDrag(__index, event) }} onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => { onKeyDown?.(event); if (event.defaultPrevented) return; const negative = direction === "horizontal" ? "ArrowLeft" : "ArrowUp"; const positive = direction === "horizontal" ? "ArrowRight" : "ArrowDown"; if (event.key === negative || event.key === positive) { event.preventDefault(); resize(__index, (event.key === positive ? 1 : -1) * step) } }} flex="0 0 8px" position="relative" display="flex" alignItems="center" justifyContent="center" cursor={direction === "horizontal" ? "col-resize" : "row-resize"} touchAction="none" bg="transparent" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }} {...props}>{withHandle && (direction === "horizontal" ? <GripVertical size={14} aria-hidden="true" /> : <GripHorizontal size={14} aria-hidden="true" />)}</HandleElement>
}
Handle.displayName = "Handle"
export const Resizable = Object.assign(PanelGroup, { Root: PanelGroup, PanelGroup, Panel, Handle })
