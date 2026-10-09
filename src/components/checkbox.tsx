import * as React from "react"
import { indoku } from "../primitives/indoku"
import { type ControlSize } from "./control-size"

const Root = indoku("label")
const Input = indoku("input")
const Control = indoku("span")

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
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

export function Checkbox({ size = "md", checked, defaultChecked = false, indeterminate = false, onCheckedChange, disabled, required, invalid, name, value, children, className, id }: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked)
  const isChecked = checked ?? uncontrolledChecked
  const boxSize = size === "xs" ? "14px" : size === "lg" ? "20px" : "16px"
  const gap = size === "xs" ? "6px" : "8px"
  return <Root className={className} display="inline-flex" position="relative" alignItems="center" gap={gap} cursor={disabled ? "not-allowed" : "pointer"} opacity={disabled ? 0.5 : 1}>
    <Input ref={(element: HTMLInputElement | null) => { if (element) element.indeterminate = indeterminate }} type="checkbox" id={id} aria-checked={indeterminate ? "mixed" : undefined} name={name} value={value} checked={isChecked} disabled={disabled} required={required} aria-invalid={invalid || undefined} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { const next = event.currentTarget.checked; if (checked === undefined) setUncontrolledChecked(next); onCheckedChange?.(next) }} position="absolute" inset="0" width="100%" height="100%" margin="0" opacity="0" cursor={disabled ? "not-allowed" : "pointer"} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} />
    <Control aria-hidden="true" width={boxSize} height={boxSize} flexShrink={0} display="inline-flex" alignItems="center" justifyContent="center" border="1px solid" borderColor={invalid ? "status.danger" : isChecked ? "accent.default" : "border.subtle"} borderRadius="sm" bg={isChecked ? "accent.default" : "bg.surface"} color="primary.foreground" transition="all 150ms ease" fontSize="12px" lineHeight="1" boxSizing="border-box">{indeterminate ? "−" : isChecked ? "✓" : null}</Control>
    {children != null && <span style={{ fontSize: size === "xs" ? "12px" : "14px", lineHeight: 1.25 }}>{children}</span>}
  </Root>
}
