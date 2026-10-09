import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { indoku } from "../primitives/indoku"
import { Button } from "./button"

const Root = indoku("div")
const Input = indoku("input")
const MeterBar = indoku("span")
const MeterText = indoku("span")

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  visible?: boolean
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ visible: controlled, defaultVisible = false, onVisibleChange, visibilityIcon, id, disabled, ...props }, ref) {
  const [internal, setInternal] = React.useState(defaultVisible)
  const visible = controlled ?? internal
  const toggle = () => {
    const next = !visible
    if (controlled === undefined) setInternal(next)
    onVisibleChange?.(next)
  }
  return <Root display="flex" alignItems="center" gap="4px" width="100%" border="1px solid" borderColor="border.subtle" borderRadius="md" bg="bg.surface" px="8px" _focusWithin={{ borderColor: "accent.default" }}>
    <Input {...props} ref={ref} id={id} type={visible ? "text" : "password"} disabled={disabled} width="100%" minWidth="0" h="36px" px="0" bg="transparent" color="fg.default" outline="none" border="0" _placeholder={{ color: "fg.muted" }} />
    <Button type="button" variant="ghost" size="icon-sm" disabled={disabled} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} onClick={toggle} flexShrink={0}>{visible ? (visibilityIcon?.on ?? <Eye size={16} aria-hidden="true" />) : (visibilityIcon?.off ?? <EyeOff size={16} aria-hidden="true" />)}</Button>
  </Root>
})
PasswordInput.displayName = "PasswordInput"

export function passwordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length
  if (password.length >= 12 && kinds >= 3) return 4
  if (password.length >= 8 && kinds >= 3) return 3
  if (password.length >= 6 && kinds >= 2) return 2
  return 1
}
const labels = ["Empty", "Weak", "Medium", "Strong", "Very strong"] as const
const colors = ["bg.subtle", "status.danger", "status.warning", "status.success", "status.success"] as const
export interface PasswordStrengthMeterProps extends React.HTMLAttributes<HTMLDivElement> { value: number; max?: number }
export function PasswordStrengthMeter({ value, max = 4, ...props }: PasswordStrengthMeterProps) {
  const level = Math.min(max, Math.max(0, Math.round(value)))
  return <Root display="flex" flexDirection="column" gap="6px" {...props}><Root role="meter" aria-label="Password strength" aria-valuemin={0} aria-valuemax={max} aria-valuenow={level} aria-valuetext={labels[level] ?? "Empty"} display="flex" gap="4px">{Array.from({ length: max }, (_, index) => <MeterBar key={index} flex="1" h="4px" borderRadius="full" bg={index < level ? colors[level] : "bg.subtle"} transition="background-color 150ms ease" />)}</Root><MeterText as="span" color="fg.muted" fontSize="12px" minHeight="16px">{level === 0 ? "" : labels[level]}</MeterText></Root>
}
