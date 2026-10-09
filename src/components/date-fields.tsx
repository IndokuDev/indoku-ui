import * as React from "react"
import { DateInput as ArkDateInput } from "@ark-ui/react/date-input"
import { Portal } from "@ark-ui/react/portal"
import { parseDate, type DateValue } from "@internationalized/date"
import { Calendar } from "./calendar"
import { indoku } from "../primitives/indoku"

const DateInputRootElement = indoku(ArkDateInput.Root)
const DateInputLabelElement = indoku(ArkDateInput.Label)
const DateInputControlElement = indoku(ArkDateInput.Control)
const DateInputSegmentGroupElement = indoku(ArkDateInput.SegmentGroup)
const DateInputSegmentElement = indoku(ArkDateInput.Segment)
const DateInputHiddenElement = indoku(ArkDateInput.HiddenInput)
const RangeSeparator = indoku("span")
const calendarIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
const toDates = (values?: string[]) => values?.flatMap((value) => { try { return [parseDate(value)] } catch { return [] } })
const oneDate = (value?: string) => toDates(value ? [value] : undefined)?.[0]
const toIso = (values: DateValue[]) => values.map((value) => value.toString())
type Shared = { label?: React.ReactNode; value?: string[]; defaultValue?: string[]; onValueChange?: (values: string[]) => void; mode?: "single" | "range" | "multiple"; min?: string; max?: string }
export interface DatePickerFieldProps extends Omit<React.ComponentProps<typeof Calendar.Root>, "value" | "defaultValue" | "onValueChange" | "min" | "max" | "selectionMode" | "children">, Shared {}
export function DatePickerField({ label, value, defaultValue, onValueChange, mode = "single", min, max, placeholder, ...props }: DatePickerFieldProps) {
  return <Calendar.Root {...props} selectionMode={mode} value={toDates(value)} defaultValue={toDates(defaultValue)} min={oneDate(min)} max={oneDate(max)} placeholder={placeholder} onValueChange={(event) => onValueChange?.(toIso(event.value))}>
    {label && <Calendar.Label>{label}</Calendar.Label>}
    <Calendar.Control>{mode === "range" ? <><Calendar.Input index={0} /><RangeSeparator aria-hidden="true" px="4px" color="fg.muted">–</RangeSeparator><Calendar.Input index={1} /></> : <Calendar.Input />}<Calendar.Trigger aria-label="Open calendar">{calendarIcon}</Calendar.Trigger></Calendar.Control>
    <Portal><Calendar.Positioner><Calendar.Content><Calendar.View view="day"><Calendar.ViewControl><Calendar.PrevTrigger>‹</Calendar.PrevTrigger><Calendar.RangeText /><Calendar.NextTrigger>›</Calendar.NextTrigger></Calendar.ViewControl><Calendar.DayTable /></Calendar.View></Calendar.Content></Calendar.Positioner></Portal>
  </Calendar.Root>
}
export interface DateInputFieldProps extends Omit<React.ComponentProps<typeof ArkDateInput.Root>, "value" | "defaultValue" | "onValueChange" | "min" | "max" | "selectionMode" | "children">, Omit<Shared, "mode"> { range?: boolean }
export function DateInputField({ label, value, defaultValue, onValueChange, min, max, range = false, ...props }: DateInputFieldProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const values = value ?? internal
  const handleChange = (event: { value: DateValue[] }) => { const next = toIso(event.value); if (value === undefined) setInternal(next); onValueChange?.(next) }
  return <DateInputRootElement {...props} selectionMode={range ? "range" : "single"} value={toDates(values)} defaultValue={toDates(defaultValue)} min={oneDate(min)} max={oneDate(max)} onValueChange={handleChange}>
    {label && <DateInputLabelElement fontSize="14px" fontWeight="medium" color="fg.default" mb="6px">{label}</DateInputLabelElement>}
    <DateInputControlElement display="flex" alignItems="center" gap="4px" border="1px solid" borderColor="border.subtle" borderRadius="md" px="8px" py="6px" flexWrap="wrap"><ArkDateInput.Context>{(context) => <DateInputSegmentGroupElement display="inline-flex" alignItems="center" gap="2px">{context.getSegments().map((segment, index) => <DateInputSegmentElement key={`${segment.type}-${index}`} segment={segment} px="2px" borderRadius="sm" _focus={{ bg: "bg.subtle" }} />)}</DateInputSegmentGroupElement>}</ArkDateInput.Context>{range && <RangeSeparator aria-hidden="true" color="fg.muted">→</RangeSeparator>}</DateInputControlElement>
    {range ? <><DateInputHiddenElement index={0} /><DateInputHiddenElement index={1} /></> : <DateInputHiddenElement />}
  </DateInputRootElement>
}
export { parseDate, today, getLocalTimeZone, type DateValue } from "@internationalized/date"
