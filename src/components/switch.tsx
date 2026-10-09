import * as React from "react"
import { indoku } from "../primitives/indoku"
import type { ControlSize } from "./control-size"

const Root = indoku("label")
const Input = indoku("input")
const Track = indoku("span")
const Thumb = indoku("span")

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  value?: string
  size?: ControlSize
  children?: React.ReactNode
  className?: string
  id?: string
}

export function Switch({ size = "md", checked, defaultChecked = false, onCheckedChange, disabled, required, invalid, name, value, children, className, id }: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked)
  const isChecked = checked ?? uncontrolledChecked
  const dimensions = size === "xs" ? { w: "28px", h: "16px", thumb: "12px" } : size === "sm" ? { w: "32px", h: "18px", thumb: "14px" } : size === "lg" ? { w: "40px", h: "22px", thumb: "18px" } : { w: "36px", h: "20px", thumb: "16px" }
  return <Root className={className} display="inline-flex" position="relative" alignItems="center" gap="8px" cursor={disabled ? "not-allowed" : "pointer"} opacity={disabled ? 0.5 : 1}>
    <Input type="checkbox" role="switch" id={id} name={name} value={value} checked={isChecked} disabled={disabled} required={required} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { const next = event.currentTarget.checked; if (checked === undefined) setUncontrolledChecked(next); onCheckedChange?.(next) }} position="absolute" inset="0" width="100%" height="100%" margin="0" opacity="0" aria-invalid={invalid || undefined} cursor={disabled ? "not-allowed" : "pointer"} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} />
    <Track aria-hidden="true" width={dimensions.w} height={dimensions.h} p="2px" boxSizing="border-box" flexShrink={0} display="flex" alignItems="center" borderRadius="full" bg={isChecked ? "accent.default" : "border.subtle"} border={invalid ? "1px solid" : "0"} borderColor={invalid ? "status.danger" : "transparent"} transition="background-color 150ms ease">
      <Thumb width={dimensions.thumb} height={dimensions.thumb} display="block" borderRadius="full" bg="bg.surface" boxShadow="sm" transition="transform 150ms ease" transform={isChecked ? "translateX(calc(100% + 2px))" : "translateX(0)"} />
    </Track>
    {children != null && <span style={{ fontSize: size === "xs" ? "12px" : "14px", lineHeight: 1.25 }}>{children}</span>}
  </Root>
}
