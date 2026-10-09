import * as React from "react"
import { indoku } from "../primitives/indoku"

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | "success" | "warning"
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: BadgeVariant; size?: "sm" | "md" | "lg" }
const Root = indoku("span")
const styles = {
  default: { bg: "accent.default", color: "primary.foreground", borderColor: "transparent" },
  secondary: { bg: "bg.subtle", color: "fg.default", borderColor: "transparent" },
  outline: { bg: "transparent", color: "fg.default", borderColor: "border.subtle" },
  destructive: { bg: "accent.default", color: "primary.foreground", borderColor: "transparent" },
  success: { bg: "bg.subtle", color: "fg.default", borderColor: "transparent" },
  warning: { bg: "bg.subtle", color: "fg.default", borderColor: "transparent" },
} as const
export function Badge({ variant = "default", size = "md", children, ...props }: BadgeProps) {
  return <Root as="span" display="inline-flex" alignItems="center" justifyContent="center" w="fit-content" whiteSpace="nowrap" border="1px solid" borderRadius="full" fontWeight="medium" lineHeight="1" {...(styles[variant] as any)} px={size === "sm" ? "6px" : size === "lg" ? "12px" : "8px"} py={size === "sm" ? "3px" : "5px"} fontSize={size === "lg" ? "14px" : "12px"} {...props}>{children}</Root>
}
