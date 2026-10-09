import * as React from "react"
import { indoku } from "../primitives/indoku"

const TimeElement = indoku("time")
export interface TimeProps extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, "children"> { value: Date | string | number; locale?: string; options?: Intl.DateTimeFormatOptions; children?: React.ReactNode }
export function Time({ value, locale, options = { dateStyle: "medium" }, children, ...props }: TimeProps) {
  const date = value instanceof Date ? value : new Date(value)
  const valid = !Number.isNaN(date.getTime())
  return <TimeElement dateTime={valid ? date.toISOString() : undefined} {...props}>{children ?? (valid ? new Intl.DateTimeFormat(locale, options).format(date) : null)}</TimeElement>
}
