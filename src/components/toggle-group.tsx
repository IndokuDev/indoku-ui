import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { indoku } from "../primitives/indoku"
import type { ControlSize } from "./control-size"

export type ToggleGroupType = "single" | "multiple"
export type ToggleGroupVariant = "outline" | "ghost" | "subtle"

interface ToggleGroupContextValue {
  type: ToggleGroupType
  value: string[]
  toggle: (value: string) => void
  variant: ToggleGroupVariant
  size: ControlSize
  disabled: boolean
  orientation: "horizontal" | "vertical"
}
const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null)
function useToggleGroup() {
  const context = React.useContext(ToggleGroupContext)
  if (!context) throw new Error("ToggleGroup.Item must be used within ToggleGroup.Root")
  return context
}
const RootElement = indoku("div")
export interface ToggleGroupRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  type?: ToggleGroupType
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  variant?: ToggleGroupVariant
  size?: ControlSize
  disabled?: boolean
  spacing?: number
  orientation?: "horizontal" | "vertical"
}
function ToggleGroupRoot({ type = "single", value: controlledValue, defaultValue = [], onValueChange, variant = "outline", size = "md", disabled = false, spacing = 8, orientation = "horizontal", children, style, onKeyDown, ...props }: ToggleGroupRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = controlledValue ?? internalValue
  const toggle = React.useCallback((item: string) => {
    if (disabled) return
    const isActive = value.includes(item)
    const next = type === "single" ? (isActive ? [] : [item]) : isActive ? value.filter((entry) => entry !== item) : [...value, item]
    if (controlledValue === undefined) setInternalValue(next)
    onValueChange?.(next)
  }, [controlledValue, disabled, onValueChange, type, value])
  const rootRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const items = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("button[data-toggle-group-item]") ?? [])
    const selected = items.find((item) => item.getAttribute("aria-pressed") === "true" && !item.disabled)
    const firstEnabled = items.find((item) => !item.disabled && item.getAttribute("aria-disabled") !== "true")
    const tabbable = selected ?? firstEnabled
    items.forEach((item) => { item.tabIndex = item === tabbable ? 0 : -1 })
  }, [value, children, disabled])
  const context = React.useMemo(() => ({ type, value, toggle, variant, size, disabled, orientation }), [type, value, toggle, variant, size, disabled, orientation])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
    const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
    if (![forward, backward, "Home", "End"].includes(event.key)) return
    const root = event.currentTarget
    const items = Array.from(root.querySelectorAll<HTMLButtonElement>("button[data-toggle-group-item]:not(:disabled):not([aria-disabled='true'])"))
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    let next = current
    if (event.key === "Home") next = 0
    else if (event.key === "End") next = items.length - 1
    else if (event.key === forward) next = (Math.max(current, -1) + 1) % items.length
    else next = (current <= 0 ? items.length : current) - 1
    event.preventDefault()
    items[next]?.focus()
  }
  const vertical = orientation === "vertical"
  const connectedStyles = spacing === 0 ? {
    "& > button": { borderRadius: 0, ...(vertical ? { marginBlockStart: "-1px" } : { marginInlineStart: "-1px" }) },
    "& > button:first-of-type": vertical
      ? { borderTopStartRadius: "var(--indoku-radii-md, 6px)", borderTopEndRadius: "var(--indoku-radii-md, 6px)", marginBlockStart: 0 }
      : { borderStartStartRadius: "var(--indoku-radii-md, 6px)", borderEndStartRadius: "var(--indoku-radii-md, 6px)", marginInlineStart: 0 },
    "& > button:last-of-type": vertical
      ? { borderEndStartRadius: "var(--indoku-radii-md, 6px)", borderEndEndRadius: "var(--indoku-radii-md, 6px)" }
      : { borderStartEndRadius: "var(--indoku-radii-md, 6px)", borderEndEndRadius: "var(--indoku-radii-md, 6px)" },
    "& > button:focus-visible": { zIndex: 1 },
  } : undefined
  return <ToggleGroupContext.Provider value={context}><RootElement {...props} ref={rootRef} role="group" aria-orientation={orientation} data-orientation={orientation} onKeyDown={handleKeyDown} css={connectedStyles} style={{ display: "inline-flex", flexDirection: vertical ? "column" : "row", gap: `${spacing}px`, ...style }}>{children}</RootElement></ToggleGroupContext.Provider>
}
export interface ToggleGroupItemProps extends Omit<ButtonProps, "value" | "onClick"> { value: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
function ToggleGroupItem({ value, onClick, disabled, variant, size, ...props }: ToggleGroupItemProps) {
  const group = useToggleGroup()
  const pressed = group.value.includes(value)
  return <Button {...props} type="button" variant={variant ?? (group.variant === "subtle" ? "subtle" : group.variant === "ghost" ? "ghost" : "outline")} size={size ?? group.size as ButtonProps["size"]} disabled={group.disabled || disabled} aria-pressed={pressed} data-state={pressed ? "on" : "off"} data-toggle-group-item="" onClick={(event: React.MouseEvent<HTMLButtonElement>) => { onClick?.(event); if (!event.defaultPrevented) group.toggle(value) }} />
}
export const ToggleGroup = Object.assign(ToggleGroupRoot, { Root: ToggleGroupRoot, Item: ToggleGroupItem })
