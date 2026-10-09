import * as React from "react"
import { defineRecipe } from "../recipe"
import { indoku } from "../primitives/indoku"
import { useSystem } from "../system/provider"
import type { StyleProps } from "../styled"

const ButtonRoot = indoku("button")
const LoadingIndicator = indoku("span")

const buttonRecipe = {
  className: "button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
    border: "1px solid transparent",
    borderRadius: "lg",
    fontSize: "14px",
    userSelect: "none",
    backgroundClip: "padding-box",
    fontWeight: "medium",
    transition: "background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
    cursor: "pointer",
    outline: "none",
    _focusVisible: { outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px", borderColor: "accent.default" },
    _active: { transform: "translateY(1px)" },
    _disabled: { opacity: 0.5, pointerEvents: "none", cursor: "not-allowed" },
  },
  variants: {
    variant: {
      solid: { bg: "accent.default", color: "primary.foreground", _hover: { bg: "accent.hover" } },
      subtle: { bg: "bg.subtle", color: "fg.default", _hover: { bg: "border.subtle" } },
      outline: { bg: "bg.surface", color: "fg.default", borderColor: "border.subtle", _hover: { bg: "bg.subtle" } },
      ghost: { bg: "transparent", color: "fg.default", _hover: { bg: "bg.subtle" } },
      plain: { bg: "transparent", color: "fg.default", _hover: { bg: "bg.subtle" } },
      surface: { bg: "bg.surface", color: "fg.default", borderColor: "border.subtle", _hover: { bg: "bg.subtle" } },
    },
    size: {
      xs: { h: "24px", px: "10px", fontSize: "12px", borderRadius: "md" },
      sm: { h: "28px", px: "12px", fontSize: "14px" },
      md: { h: "32px", px: "10px", fontSize: "14px" },
      lg: { h: "36px", px: "16px", fontSize: "14px" },
      xl: { h: "40px", px: "20px", fontSize: "14px" },
      "icon-xs": { w: "24px", h: "24px", px: "0px", fontSize: "12px", borderRadius: "md" },
      "icon-sm": { w: "28px", h: "28px", px: "0px", fontSize: "14px" },
      icon: { w: "32px", h: "32px", px: "0px", fontSize: "14px" },
      "icon-lg": { w: "36px", h: "36px", px: "0px", fontSize: "14px" },
    },
  },
  defaultVariants: { variant: "solid", size: "md" },
} as const

export type ButtonVariant = keyof typeof buttonRecipe.variants.variant
export type ButtonSize = keyof typeof buttonRecipe.variants.size

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">, Omit<StyleProps, "size"> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  loadingText?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, disabled, loading = false, loadingText, children, type = "button", ...props },
  ref,
) {
  const system = useSystem()
  const result = defineRecipe(buttonRecipe as any, system)(Object.fromEntries(Object.entries({ variant, size }).filter(([, value]) => value !== undefined)) as any)
  const isDisabled = Boolean(disabled || loading)

  return (
    <ButtonRoot
      {...props}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      css={result.css}
      className={[result.className, props.className].filter(Boolean).join(" ")}
    >
      {loading && <LoadingIndicator aria-hidden="true" display="inline-block" w="1em" h="1em" border="2px solid currentColor" borderTopColor="transparent" borderRadius="full" flexShrink={0} />}
      {loading && loadingText !== undefined ? loadingText : children}
    </ButtonRoot>
  )
})

Button.displayName = "Button"
