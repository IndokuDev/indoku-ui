import * as React from "react"
import { indoku } from "../primitives/indoku"
import type { StatLike } from "./scene-types"
const Root = indoku("div")
const Label = indoku("span")
const Value = indoku("span")
const format = (value: number | string) => {
  if (typeof value === "string") return value
  if (!Number.isFinite(value)) return "–"
  const abs = Math.abs(value)
  return abs !== 0 && (abs < 1e-3 || abs >= 1e6) ? value.toExponential(2) : String(+value.toPrecision(4))
}
export function StatsRow({ stats }: { stats: StatLike[] }) {
  if (!stats.length) return null
  return <Root display="flex" flexWrap="wrap" columnGap="4" rowGap="1" px="3" py="2" borderTop="1px solid" borderColor="border.subtle" fontSize="xs">{stats.map((stat) => <span key={stat.label}><Label color="fg.muted">{stat.label} </Label><Value fontWeight="medium" style={{ fontVariantNumeric: "tabular-nums" }}>{format(stat.value)}</Value>{stat.unit && <Label color="fg.muted"> {stat.unit}</Label>}</span>)}</Root>
}
