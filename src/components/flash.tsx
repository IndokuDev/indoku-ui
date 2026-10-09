import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { indoku } from "../primitives/indoku"

export type FlashType = "success" | "error" | "warning" | "info" | "neutral"
export interface FlashProps extends React.HTMLAttributes<HTMLDivElement> { type?: FlashType; icon?: React.ReactNode | false; children?: React.ReactNode }
const Root = indoku("div")
const IconWrap = indoku("span")
const Message = indoku("span")
const colors: Record<FlashType, string> = { success: "status.success", error: "status.danger", warning: "status.warning", info: "status.info", neutral: "fg.muted" }
function iconFor(type: FlashType) {
  if (type === "success") return <CheckCircle2 size={14} aria-hidden="true" />
  if (type === "error") return <AlertCircle size={14} aria-hidden="true" />
  if (type === "warning") return <AlertTriangle size={14} aria-hidden="true" />
  if (type === "info") return <Info size={14} aria-hidden="true" />
  return null
}
export function Flash({ type = "neutral", icon, children, ...props }: FlashProps) {
  const iconContent = icon === false ? null : icon ?? iconFor(type)
  return <Root display="flex" alignItems="center" gap="8px" fontSize="14px" lineHeight={1.3} color={colors[type]} role={type === "error" || type === "warning" ? "alert" : "status"} data-type={type} {...props}>{iconContent && <IconWrap display="inline-flex" flexShrink={0} color={colors[type]}>{iconContent}</IconWrap>}<Message as="span">{children}</Message></Root>
}
