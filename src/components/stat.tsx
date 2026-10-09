import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div"), Label = indoku("div"), Value = indoku("div"), Help = indoku("div"), Change = indoku("div")
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> { label?: React.ReactNode; value?: React.ReactNode; helpText?: React.ReactNode; change?: React.ReactNode; trend?: "up" | "down" | "neutral" }
export function Stat({ label, value, helpText, change, trend = "neutral", children, ...props }: StatProps) { return <Root display="flex" flexDirection="column" gap="6px" {...props}>{label !== undefined && <Label fontSize="14px" color="fg.muted">{label}</Label>}{value !== undefined && <Value fontSize="30px" lineHeight="1.2" fontWeight="semibold" letterSpacing="-0.03em">{value}</Value>}{change !== undefined && <Change fontSize="12px" color={trend === "up" ? "status.success" : trend === "down" ? "status.danger" : "fg.muted"}>{change}</Change>}{helpText !== undefined && <Help fontSize="12px" color="fg.muted">{helpText}</Help>}{children}</Root> }
export function StatLabel(props: React.HTMLAttributes<HTMLDivElement>) { return <Label fontSize="14px" color="fg.muted" {...props} /> }
export function StatValueText(props: React.HTMLAttributes<HTMLDivElement>) { return <Value fontSize="30px" lineHeight="1.2" fontWeight="semibold" letterSpacing="-0.03em" {...props} /> }
export function StatHelpText(props: React.HTMLAttributes<HTMLDivElement>) { return <Help fontSize="12px" color="fg.muted" {...props} /> }
