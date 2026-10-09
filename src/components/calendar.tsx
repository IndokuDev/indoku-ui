import * as React from "react"
import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker"
import { indoku } from "../primitives/indoku"

const RootElement = indoku(ArkDatePicker.Root)
const LabelElement = indoku(ArkDatePicker.Label)
const ControlElement = indoku(ArkDatePicker.Control)
const InputElement = indoku(ArkDatePicker.Input)
const TriggerElement = indoku(ArkDatePicker.Trigger)
const PositionerElement = indoku(ArkDatePicker.Positioner)
const ContentElement = indoku(ArkDatePicker.Content)
const ViewElement = indoku(ArkDatePicker.View)
const ViewControlElement = indoku(ArkDatePicker.ViewControl)
const ViewTriggerElement = indoku(ArkDatePicker.ViewTrigger)
const PrevTriggerElement = indoku(ArkDatePicker.PrevTrigger)
const NextTriggerElement = indoku(ArkDatePicker.NextTrigger)
const RangeTextElement = indoku(ArkDatePicker.RangeText)
const TableElement = indoku(ArkDatePicker.Table)
const TableHeaderElement = indoku(ArkDatePicker.TableHeader)
const TableBodyElement = indoku(ArkDatePicker.TableBody)
const TableRowElement = indoku(ArkDatePicker.TableRow)
const TableCellElement = indoku(ArkDatePicker.TableCell)
const TableCellTriggerElement = indoku(ArkDatePicker.TableCellTrigger)
const MonthSelectElement = indoku(ArkDatePicker.MonthSelect)
const YearSelectElement = indoku(ArkDatePicker.YearSelect)
const ClearTriggerElement = indoku(ArkDatePicker.ClearTrigger)
const HeaderCellElement = indoku("th")

export type CalendarRootProps = React.ComponentProps<typeof ArkDatePicker.Root>
export function CalendarRoot(props: CalendarRootProps) { return <RootElement {...props} /> }
export type CalendarLabelProps = React.ComponentProps<typeof ArkDatePicker.Label>
export function CalendarLabel(props: CalendarLabelProps) { return <LabelElement fontSize="14px" fontWeight="medium" color="fg.default" mb="6px" {...props} /> }
export type CalendarControlProps = React.ComponentProps<typeof ArkDatePicker.Control>
export function CalendarControl(props: CalendarControlProps) { return <ControlElement display="flex" alignItems="center" gap="6px" border="1px solid" borderColor="border.subtle" borderRadius="md" p="4px" {...props} /> }
export type CalendarInputProps = React.ComponentProps<typeof ArkDatePicker.Input>
export function CalendarInput(props: CalendarInputProps) { return <InputElement minW="0" flex="1" h="32px" px="6px" bg="transparent" color="fg.default" outline="none" {...props} /> }
export type CalendarTriggerProps = React.ComponentProps<typeof ArkDatePicker.Trigger>
export function CalendarTrigger(props: CalendarTriggerProps) { return <TriggerElement type="button" display="inline-flex" alignItems="center" justifyContent="center" w="32px" h="32px" borderRadius="md" color="fg.muted" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type CalendarPositionerProps = React.ComponentProps<typeof ArkDatePicker.Positioner>
export function CalendarPositioner(props: CalendarPositionerProps) { return <PositionerElement zIndex={50} {...props} /> }
export type CalendarContentProps = React.ComponentProps<typeof ArkDatePicker.Content>
export function CalendarContent(props: CalendarContentProps) { return <ContentElement p="12px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" color="fg.default" boxShadow="lg" {...props} /> }
export type CalendarViewProps = React.ComponentProps<typeof ArkDatePicker.View>
export function CalendarView(props: CalendarViewProps) { return <ViewElement {...props} /> }
export type CalendarViewControlProps = React.ComponentProps<typeof ArkDatePicker.ViewControl>
export function CalendarViewControl(props: CalendarViewControlProps) { return <ViewControlElement display="flex" alignItems="center" justifyContent="space-between" gap="8px" mb="8px" {...props} /> }
export type CalendarViewTriggerProps = React.ComponentProps<typeof ArkDatePicker.ViewTrigger>
export function CalendarViewTrigger(props: CalendarViewTriggerProps) { return <ViewTriggerElement type="button" fontSize="14px" fontWeight="medium" borderRadius="md" px="8px" py="4px" _hover={{ bg: "bg.subtle" }} {...props} /> }
export type CalendarPrevTriggerProps = React.ComponentProps<typeof ArkDatePicker.PrevTrigger>
export function CalendarPrevTrigger(props: CalendarPrevTriggerProps) { return <PrevTriggerElement type="button" aria-label="Previous month" w="32px" h="32px" borderRadius="md" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type CalendarNextTriggerProps = React.ComponentProps<typeof ArkDatePicker.NextTrigger>
export function CalendarNextTrigger(props: CalendarNextTriggerProps) { return <NextTriggerElement type="button" aria-label="Next month" w="32px" h="32px" borderRadius="md" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type CalendarRangeTextProps = React.ComponentProps<typeof ArkDatePicker.RangeText>
export function CalendarRangeText(props: CalendarRangeTextProps) { return <RangeTextElement fontSize="14px" fontWeight="medium" {...props} /> }
export type CalendarTableProps = React.ComponentProps<typeof ArkDatePicker.Table>
export function CalendarTable(props: CalendarTableProps) { return <TableElement width="100%" style={{ borderCollapse: "collapse", ...props.style }} {...props} /> }
export type CalendarTableHeaderProps = React.ComponentProps<typeof ArkDatePicker.TableHeader>
export function CalendarTableHeader(props: CalendarTableHeaderProps) { return <TableHeaderElement {...props} /> }
export type CalendarTableBodyProps = React.ComponentProps<typeof ArkDatePicker.TableBody>
export function CalendarTableBody(props: CalendarTableBodyProps) { return <TableBodyElement {...props} /> }
export type CalendarTableRowProps = React.ComponentProps<typeof ArkDatePicker.TableRow>
export function CalendarTableRow(props: CalendarTableRowProps) { return <TableRowElement {...props} /> }
export type CalendarTableCellProps = React.ComponentProps<typeof ArkDatePicker.TableCell>
export function CalendarTableCell(props: CalendarTableCellProps) { return <TableCellElement textAlign="center" p="2px" {...props} /> }
export type CalendarTableCellTriggerProps = React.ComponentProps<typeof ArkDatePicker.TableCellTrigger>
export function CalendarTableCellTrigger(props: CalendarTableCellTriggerProps) { return <TableCellTriggerElement type="button" w="34px" h="34px" borderRadius="md" fontSize="13px" _hover={{ bg: "bg.subtle" }} _selected={{ bg: "accent.default", color: "primary.foreground" }} _disabled={{ opacity: 0.35 }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "1px" }} {...props} /> }
export interface CalendarDayTableProps extends React.HTMLAttributes<HTMLTableElement> {}
export function CalendarDayTable(props: CalendarDayTableProps) {
  return <CalendarTable {...props}><thead><tr><ArkDatePicker.Context>{(context) => context.weekDays.map((day) => <HeaderCellElement scope="col" key={day.short} textAlign="center" color="fg.muted" fontSize="11px" fontWeight="medium" p="2px"><span aria-label={day.long}>{day.narrow}</span></HeaderCellElement>)}</ArkDatePicker.Context></tr></thead><tbody><ArkDatePicker.Context>{(context) => context.weeks.map((week, index) => <tr key={`week-${index}`}>{week.map((date) => <CalendarTableCell key={date.toString()} value={date}><CalendarTableCellTrigger>{date.day}</CalendarTableCellTrigger></CalendarTableCell>)}</tr>)}</ArkDatePicker.Context></tbody></CalendarTable>
}
export type CalendarMonthSelectProps = React.ComponentProps<typeof ArkDatePicker.MonthSelect>
export function CalendarMonthSelect(props: CalendarMonthSelectProps) { return <MonthSelectElement {...props} /> }
export type CalendarYearSelectProps = React.ComponentProps<typeof ArkDatePicker.YearSelect>
export function CalendarYearSelect(props: CalendarYearSelectProps) { return <YearSelectElement {...props} /> }
export type CalendarClearTriggerProps = React.ComponentProps<typeof ArkDatePicker.ClearTrigger>
export function CalendarClearTrigger(props: CalendarClearTriggerProps) { return <ClearTriggerElement type="button" color="fg.muted" fontSize="12px" textDecoration="underline" {...props} /> }
export const Calendar = Object.assign(CalendarRoot, { Root: CalendarRoot, Label: CalendarLabel, Control: CalendarControl, Input: CalendarInput, Trigger: CalendarTrigger, Positioner: CalendarPositioner, Content: CalendarContent, View: CalendarView, ViewControl: CalendarViewControl, ViewTrigger: CalendarViewTrigger, PrevTrigger: CalendarPrevTrigger, NextTrigger: CalendarNextTrigger, RangeText: CalendarRangeText, Table: CalendarTable, TableHeader: CalendarTableHeader, TableBody: CalendarTableBody, TableRow: CalendarTableRow, TableCell: CalendarTableCell, TableCellTrigger: CalendarTableCellTrigger, DayTable: CalendarDayTable, MonthSelect: CalendarMonthSelect, YearSelect: CalendarYearSelect, ClearTrigger: CalendarClearTrigger })
