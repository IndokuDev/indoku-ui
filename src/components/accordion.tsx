import * as React from "react"
import { Accordion as ArkAccordion } from "@ark-ui/react/accordion"
import { indoku } from "../primitives/indoku"
export interface AccordionItemData { value: string; title: React.ReactNode; content: React.ReactNode; disabled?: boolean }
export interface AccordionProps { items: AccordionItemData[]; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; multiple?: boolean; collapsible?: boolean; variant?: "outline" | "subtle" | "plain"; className?: string }
const Item = indoku(ArkAccordion.Item), Trigger = indoku(ArkAccordion.ItemTrigger), Content = indoku(ArkAccordion.ItemContent), Indicator = indoku(ArkAccordion.ItemIndicator)
function AccordionComponent({ items = [], value, defaultValue, onValueChange, multiple = false, collapsible = true, variant = "outline", className }: AccordionProps) {
 return <ArkAccordion.Root className={className} value={value} defaultValue={defaultValue} onValueChange={(details) => onValueChange?.(details.value)} multiple={multiple} collapsible={collapsible} style={{ width: "100%" }}>{items.map((item, index) => <Item key={item.value} value={item.value} disabled={item.disabled} border={variant === "outline" ? "1px solid" : "none"} borderColor="border.subtle" borderBottom={variant === "outline" && index < items.length - 1 ? "0" : "1px solid"} borderRadius={variant === "outline" ? "md" : "0"} bg={variant === "subtle" ? "bg.subtle" : "transparent"} overflow="hidden"><Trigger display="flex" alignItems="center" justifyContent="space-between" gap="12px" w="100%" p="14px" textAlign="left" fontSize="14px" fontWeight="medium" color="fg.default" cursor="pointer" _disabled={{ opacity: 0.5, cursor: "not-allowed" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }}><span>{item.title}</span><Indicator transition="transform 150ms ease" _open={{ transform: "rotate(180deg)" }}>⌄</Indicator></Trigger><Content><div style={{ padding: "0 14px 14px", color: "var(--indoku-colors-fg-muted)", fontSize: 14, lineHeight: 1.6 }}>{item.content}</div></Content></Item>)}</ArkAccordion.Root>
}

const AccordionRootElement = indoku(ArkAccordion.Root)
const AccordionItemElement = indoku(ArkAccordion.Item)
const AccordionTriggerElement = indoku(ArkAccordion.ItemTrigger)
const AccordionContentElement = indoku(ArkAccordion.ItemContent)
const AccordionIndicatorElement = indoku(ArkAccordion.ItemIndicator)

function AccordionRootView(props: React.ComponentProps<typeof ArkAccordion.Root>) {
  return <AccordionRootElement {...props} style={{ width: "100%", ...props.style }} />
}
function AccordionItemView({ children, ...props }: React.ComponentProps<typeof ArkAccordion.Item>) {
  return <AccordionItemElement border="1px solid" borderColor="border.subtle" borderRadius="md" overflow="hidden" {...props}>{children}</AccordionItemElement>
}
function AccordionTriggerView({ children, ...props }: React.ComponentProps<typeof ArkAccordion.ItemTrigger>) {
  return <AccordionTriggerElement display="flex" alignItems="center" justifyContent="space-between" gap="12px" w="100%" p="14px" textAlign="left" fontSize="14px" fontWeight="medium" color="fg.default" cursor="pointer" _disabled={{ opacity: 0.5, cursor: "not-allowed" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }} {...props}>{children}</AccordionTriggerElement>
}
function AccordionContentView({ children, ...props }: React.ComponentProps<typeof ArkAccordion.ItemContent>) {
  return <AccordionContentElement color="fg.muted" fontSize="14px" lineHeight="1.5" {...props}><div style={{ padding: "0 14px 14px" }}>{children}</div></AccordionContentElement>
}
function AccordionIndicatorView(props: React.ComponentProps<typeof ArkAccordion.ItemIndicator>) {
  return <AccordionIndicatorElement transition="transform 150ms ease" _open={{ transform: "rotate(180deg)" }} {...props} />
}
export const Accordion = Object.assign(AccordionComponent, {
  Root: AccordionRootView,
  Item: AccordionItemView,
  ItemTrigger: AccordionTriggerView,
  ItemContent: AccordionContentView,
  ItemIndicator: AccordionIndicatorView,
})
