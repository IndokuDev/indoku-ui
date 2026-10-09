import * as React from "react"
import { indoku } from "../primitives/indoku"

const RowElement = indoku("div")
const SpanElement = indoku("span")
const LineElement = indoku("div")
export type MarkerTone = "neutral" | "info" | "success" | "warning" | "error"
const toneColors = { neutral: "fg.muted", info: "status.info", success: "status.success", warning: "status.warning", error: "status.danger" } as const
export interface MarkerSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Separator({ children, ...props }: MarkerSeparatorProps) { return <RowElement display="flex" alignItems="center" gap="12px" my="8px" {...props}><LineElement flex="1" h="1px" bg="border.subtle" /><SpanElement as="span" fontSize="12px" color="fg.muted" flexShrink={0}>{children}</SpanElement><LineElement flex="1" h="1px" bg="border.subtle" /></RowElement> }
export interface MarkerStatusProps extends React.HTMLAttributes<HTMLDivElement> { tone?: MarkerTone; icon?: React.ReactNode }
export function Status({ tone = "neutral", icon, children, ...props }: MarkerStatusProps) { return <RowElement display="flex" alignItems="center" gap="6px" px="4px" fontSize="12px" color={toneColors[tone]} {...props}>{icon}{children}</RowElement> }
export type MarkerRowProps = React.HTMLAttributes<HTMLDivElement>
export function Row(props: MarkerRowProps) { return <RowElement display="flex" alignItems="center" gap="8px" px="12px" py="8px" border="1px solid" borderColor="border.subtle" borderRadius="md" fontSize="12px" color="fg.muted" bg="bg.surface" {...props} /> }
export type TypingIndicatorProps = React.HTMLAttributes<HTMLDivElement>
export function TypingIndicator(props: TypingIndicatorProps) { return <RowElement display="inline-flex" gap="4px" alignItems="center" px="4px" aria-label="Typing" role="status" {...props}>{[0, 1, 2].map((index) => <SpanElement key={index} as="span" w="6px" h="6px" borderRadius="full" bg="fg.muted" animation="indoku-typing 1.2s infinite ease-in-out" style={{ animationDelay: `${index * 0.15}s` }} />)}</RowElement> }
export const Marker = Object.assign(Status, { Status, Separator, Row, TypingIndicator })
