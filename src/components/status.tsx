import * as React from "react"
import { indoku } from "../primitives/indoku"
export type StatusColor = "info" | "success" | "warning" | "danger" | "neutral"
export interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> { color?: StatusColor; size?: "sm" | "md" | "lg"; pulse?: boolean }
const Root = indoku("span"), Dot = indoku("span")
const colors = { info: "status.info", success: "status.success", warning: "status.warning", danger: "status.danger", neutral: "fg.muted" } as const
export function Status({ color = "success", size = "md", pulse = false, children, ...props }: StatusProps) {
 const d = size === "sm" ? "6px" : size === "lg" ? "10px" : "8px"
 return <Root display="inline-flex" alignItems="center" gap="8px" fontSize={size === "sm" ? "12px" : size === "lg" ? "16px" : "14px"} color="fg.default" {...props}><Dot as="span" aria-hidden="true" w={d} h={d} flexShrink={0} borderRadius="full" bg={colors[color]} opacity={pulse ? 0.8 : 1} />{children}</Root>
}
