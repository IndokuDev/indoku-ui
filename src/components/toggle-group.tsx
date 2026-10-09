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
function ToggleGroupRoot({ type = "single", value: controlledValue, defaultValue = [], onValueChange, variant = "outline", size = "md", disabled = false, spacing = 8, orientation = "horizontal", children, style, ...props }: ToggleGroupRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = controlledValue ?? internalValue
  const toggle = React.useCallback((item: string) => {
    if (disabled) return
    const isActive = value.includes(item)
    const next = type === "single" ? (isActive ? [] : [item]) : isActive ? value.filter((entry) => entry !== item) : [...value, item]
    if (controlledValue === undefined) setInternalValue(next)
    onValueChange?.(next)
  }, [controlledValue, disabled, onValueChange, type, value])
  const context = React.useMemo(() => ({ type, value, toggle, variant, size, disabled }), [type, value, toggle, variant, size, disabled])
  return <ToggleGroupContext.Provider value={context}><RootElement {...props} role="group" aria-orientation={orientation} data-orientation={orientation} style={{ display: "inline-flex", flexDirection: orientation === "vertical" ? "column" : "row", gap: `${spacing}px`, ...style }}>{children}</RootElement></ToggleGroupContext.Provider>
}
export interface ToggleGroupItemProps extends Omit<ButtonProps, "value" | "onClick"> { value: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
function ToggleGroupItem({ value, onClick, disabled, variant, size, ...props }: ToggleGroupItemProps) {
  const group = useToggleGroup()
  const pressed = group.value.includes(value)
  return <Button {...props} type="button" variant={variant ?? (group.variant === "subtle" ? "subtle" : group.variant === "ghost" ? "ghost" : "outline")} size={size ?? group.size as ButtonProps["size"]} disabled={group.disabled || disabled} aria-pressed={pressed} data-state={pressed ? "on" : "off"} onClick={(event: React.MouseEvent<HTMLButtonElement>) => { onClick?.(event); if (!event.defaultPrevented) group.toggle(value) }} />
}
export const ToggleGroup = Object.assign(ToggleGroupRoot, { Root: ToggleGroupRoot, Item: ToggleGroupItem })
