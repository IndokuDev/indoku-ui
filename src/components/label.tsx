import * as React from "react"
import { indoku } from "../primitives/indoku"

const LabelView = indoku("label")
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean
  required?: boolean
}
export function Label({ disabled = false, required = false, children, ...props }: LabelProps) {
  return <LabelView fontSize="14px" fontWeight="medium" color={disabled ? "fg.muted" : "fg.default"} opacity={disabled ? 0.6 : 1} cursor={disabled ? "not-allowed" : "default"} {...props}>{children}{required && <span aria-hidden="true" style={{ color: "var(--indoku-colors-status-danger)", marginInlineStart: 4 }}>*</span>}</LabelView>
}
