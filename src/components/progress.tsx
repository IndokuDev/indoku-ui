import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div"), Track = indoku("div"), Fill = indoku("div")
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> { value?: number | null; min?: number; max?: number; size?: "sm" | "md" | "lg"; variant?: "default" | "success" | "warning" | "danger"; indeterminate?: boolean; label?: string }
export function Progress({ value = 0, min = 0, max = 100, size = "md", variant = "default", indeterminate = value === null, label = "Progress", ...props }: ProgressProps) {
 const pct = indeterminate ? 35 : Math.max(0, Math.min(100, ((value ?? min) - min) / (max - min || 1) * 100))
 const h = size === "sm" ? "4px" : size === "lg" ? "10px" : "6px"
 const color = variant === "success" ? "status.success" : variant === "warning" ? "status.warning" : variant === "danger" ? "status.danger" : "accent.default"
 return <Root role="progressbar" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : value ?? min} w="100%" {...props}><Track w="100%" h={h} overflow="hidden" borderRadius="full" bg="bg.subtle"><Fill h="100%" borderRadius="full" bg={color} transition="width 200ms ease" w={`${pct}%`} /></Track></Root>
}
