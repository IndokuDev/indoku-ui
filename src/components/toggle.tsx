import * as React from "react"
import { indoku } from "../primitives/indoku"
import { controlHeights, type ControlSize } from "./control-size"

const Root = indoku("button")
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size" | "onChange"> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: ControlSize
  variant?: "default" | "outline"
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ pressed, defaultPressed = false, onPressedChange, size = "md", variant = "default", type = "button", children, disabled, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultPressed)
  const isPressed = pressed ?? uncontrolled
  const height = controlHeights[size]
  const padding = size === "xs" ? "6px" : size === "sm" ? "8px" : size === "lg" ? "12px" : "10px"
  const change = () => {
    if (disabled) return
    const next = !isPressed
    if (pressed === undefined) setUncontrolled(next)
    onPressedChange?.(next)
  }
  return <Root {...props} ref={ref} type={type} disabled={disabled} aria-pressed={isPressed} onClick={(event: React.MouseEvent<HTMLButtonElement>) => { props.onClick?.(event); if (!event.defaultPrevented) change() }} h={height} px={padding} display="inline-flex" alignItems="center" justifyContent="center" gap="6px" border="1px solid" borderColor={variant === "outline" ? "border.subtle" : "transparent"} borderRadius="md" bg={isPressed ? "bg.subtle" : "transparent"} color="fg.default" fontSize={size === "xs" ? "12px" : "14px"} fontWeight="medium" cursor={disabled ? "not-allowed" : "pointer"} opacity={disabled ? 0.5 : 1} transition="background-color 150ms ease, border-color 150ms ease" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "none", boxShadow: "0 0 0 3px rgb(0 0 0 / 0.15)" }} _active={{ transform: "translateY(1px)" }}>{children}</Root>
})
Toggle.displayName = "Toggle"
