import * as React from "react"
import { indoku } from "../primitives/indoku"

export interface PeriodicElement { number: number; symbol: string; name: string; mass: number; period: number; group: number | null; category: string }
export interface PeriodicTableProps { elements: readonly PeriodicElement[]; onSelect?: (element: PeriodicElement) => void; selected?: number }
const Root = indoku("div"), Grid = indoku("div"), Detail = indoku("div"), Symbol = indoku("div"), Name = indoku("div"), Meta = indoku("div"), Cell = indoku("button")
const CATEGORY_TOKEN: Record<string, string> = {
  "alkali-metal": "status.danger", "alkaline-earth-metal": "status.warning", "transition-metal": "accent.default", "post-transition-metal": "status.info", metalloid: "status.success", nonmetal: "status.success", halogen: "accent.hover", "noble-gas": "status.info", lanthanide: "accent.default", actinide: "status.danger",
}
const labelCategory = (category: string) => category.replace(/-/g, " ")
/** An 18-column periodic table with separate lanthanide/actinide rows and a selected-element summary. */
export function PeriodicTable({ elements, onSelect, selected }: PeriodicTableProps) {
  const [own, setOwn] = React.useState(1)
  const current = selected ?? own
  const element = elements.find((item) => item.number === current)
  const detached = elements.filter((item) => item.group == null)
  const detachedIndex = (item: PeriodicElement) => detached.filter((other) => other.category === item.category).findIndex((other) => other.number === item.number)
  const select = (item: PeriodicElement) => { setOwn(item.number); onSelect?.(item) }
  return <Root color="fg.default" minWidth="0">
    {element && <Detail display="flex" alignItems="center" gap="3" border="1px solid" borderColor="border.subtle" borderRadius="lg" p="3" mb="3">
      <Symbol display="flex" alignItems="center" justifyContent="center" width="56px" height="56px" flexShrink="0" borderRadius="md" bg={CATEGORY_TOKEN[element.category] ?? "bg.subtle"} color="primary.foreground" fontSize="2xl" fontWeight="semibold">{element.symbol}</Symbol>
      <div><Name fontWeight="medium">{element.name} <Meta as="span" color="fg.muted" fontWeight="normal">#{element.number}</Meta></Name><Meta fontSize="sm" color="fg.muted">{element.mass.toFixed(3)} u · {labelCategory(element.category)}</Meta></div>
    </Detail>}
    <Grid display="grid" gap="2px" gridTemplateColumns="repeat(18, minmax(30px, 1fr))" overflowX="auto" pb="2">
      {elements.map((item) => {
        const column = item.group ?? 3 + detachedIndex(item)
        const row = item.group == null ? (item.category === "lanthanide" ? 9 : 10) : item.period
        const active = current === item.number
        return <Cell key={item.number} type="button" aria-label={`${item.name}, atomic number ${item.number}`} aria-pressed={active} onClick={() => select(item)} style={{ gridColumn: column, gridRow: row }} display="flex" flexDirection="column" alignItems="center" justifyContent="center" aspectRatio="1" minWidth="30px" p="2px" border="1px solid" borderColor={active ? "accent.default" : "border.subtle"} borderRadius="sm" bg={active ? CATEGORY_TOKEN[item.category] ?? "accent.default" : "bg.surface"} color={active ? "primary.foreground" : "fg.default"} cursor="pointer" _hover={{ bg: active ? CATEGORY_TOKEN[item.category] ?? "accent.hover" : "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "1px" }}>
          <Meta fontSize="9px" opacity="0.8">{item.number}</Meta><Name fontSize="sm" fontWeight="semibold" lineHeight="1">{item.symbol}</Name>
        </Cell>
      })}
    </Grid>
  </Root>
}
