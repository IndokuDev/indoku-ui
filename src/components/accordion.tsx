import * as React from "react"
import { Accordion as ArkAccordion } from "@ark-ui/react/accordion"
import { indoku } from "../primitives/indoku"
export interface AccordionItemData { value: string; title: React.ReactNode; content: React.ReactNode; disabled?: boolean }
export interface AccordionProps { items: AccordionItemData[]; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; multiple?: boolean; collapsible?: boolean; variant?: "outline" | "subtle" | "plain"; className?: string }
const Item = indoku(ArkAccordion.Item), Trigger = indoku(ArkAccordion.ItemTrigger), Content = indoku(ArkAccordion.ItemContent), Indicator = indoku(ArkAccordion.ItemIndicator)
function AccordionComponent({ items = [], value, defaultValue, onValueChange, multiple = false, collapsible = true, variant = "outline", className }: AccordionProps) {
 return <ArkAccordion.Root className={className} value={value} defaultValue={defaultValue} onValueChange={(details) => onValueChange?.(details.value)} multiple={multiple} collapsible={collapsible} style={{ width: "100%" }}>{items.map((item, index) => <Item key={item.value} value={item.value} disabled={item.disabled} border={variant === "outline" ? "1px solid" : "none"} borderColor="border.subtle" borderBottom={variant === "outline" && index < items.length - 1 ? "0" : "1px solid"} borderRadius={variant === "outline" ? "md" : "0"} bg={variant === "subtle" ? "bg.subtle" : "transparent"} overflow="hidden"><Trigger display="flex" alignItems="center" justifyContent="space-between" gap="12px" w="100%" p="14px" textAlign="left" fontSize="14px" fontWeight="medium" color="fg.default" cursor="pointer" _disabled={{ opacity: 0.5, cursor: "not-allowed" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }}><span>{item.title}</span><Indicator transition="transform 150ms ease" _open={{ transform: "rotate(180deg)" }}>⌄</Indicator></Trigger><Content><div style={{ padding: "0 14px 14px", color: "var(--indoku-colors-fg-muted)", fontSize: 14, lineHeight: 1.6 }}>{item.content}</div></Content></Item>)}</ArkAccordion.Root>
}

const AccordionRoot = indoku(ArkAccordion.Root)
const AccordionItem = indoku(ArkAccordion.Item)
const AccordionTrigger = indoku(ArkAccordion.ItemTrigger)
const AccordionContent = indoku(ArkAccordion.ItemContent)
const AccordionIndicator = indoku(ArkAccordion.ItemIndicator)
export const Accordion = Object.assign(AccordionComponent, {
  Root: AccordionRoot,
  Item: AccordionItem,
  ItemTrigger: AccordionTrigger,
  ItemContent: AccordionContent,
  ItemIndicator: AccordionIndicator,
})
