import * as React from "react"
import { indoku } from "../primitives/indoku"

const RootView = indoku("div")
const TrackView = indoku("div")
const RangeView = indoku("div")
const LabelView = indoku("span")
const ValueTextView = indoku("span")

type ProgressSize = "sm" | "md" | "lg"
type ProgressVariant = "default" | "success" | "warning" | "danger"
interface ProgressContextValue { value: number | null; min: number; max: number; size: ProgressSize; variant: ProgressVariant; indeterminate: boolean; label: string; percent: number }
const ProgressContext = React.createContext<ProgressContextValue | null>(null)
function useProgressContext() {
  const value = React.useContext(ProgressContext)
  if (!value) throw new Error("Progress subcomponents must be used within Progress.Root")
  return value
}

export interface ProgressRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  value?: number | null
  min?: number
  max?: number
  size?: ProgressSize
  variant?: ProgressVariant
  indeterminate?: boolean
  label?: string
}
export function ProgressRoot({ value = 0, min = 0, max = 100, size = "md", variant = "default", indeterminate = value === null, label = "Progress", children, ...props }: ProgressRootProps) {
  const percent = indeterminate ? 35 : Math.max(0, Math.min(100, (((value ?? min) - min) / (max - min || 1)) * 100))
  const context = React.useMemo(() => ({ value, min, max, size, variant, indeterminate, label, percent }), [value, min, max, size, variant, indeterminate, label, percent])
  return <ProgressContext.Provider value={context}><RootView role="progressbar" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : Math.max(min, Math.min(max, value ?? min))} aria-valuetext={indeterminate ? "In progress" : undefined} data-state={indeterminate ? "indeterminate" : percent >= 100 ? "complete" : "loading"} data-value={value ?? undefined} data-max={max} w="100%" {...props}>{children ?? <><ProgressTrack><ProgressRange /></ProgressTrack></>}</RootView></ProgressContext.Provider>
}
export type ProgressTrackProps = React.HTMLAttributes<HTMLDivElement>
export function ProgressTrack(props: ProgressTrackProps) {
  const { size } = useProgressContext()
  const height = size === "sm" ? "4px" : size === "lg" ? "10px" : "6px"
  return <TrackView w="100%" h={height} overflow="hidden" borderRadius="full" bg="bg.subtle" {...props} />
}
export type ProgressRangeProps = React.HTMLAttributes<HTMLDivElement>
export function ProgressRange(props: ProgressRangeProps) {
  const { percent, variant, indeterminate } = useProgressContext()
  const color = variant === "warning" ? "fg.muted" : "accent.default"
  return <RangeView h="100%" borderRadius="full" bg={color} transition="width 200ms ease" w={indeterminate ? "35%" : `${percent}%`} data-state={indeterminate ? "indeterminate" : "loading"} {...props} />
}
export type ProgressLabelProps = React.HTMLAttributes<HTMLSpanElement>
export function ProgressLabel(props: ProgressLabelProps) { return <LabelView as="span" {...props} /> }
export type ProgressValueTextProps = React.HTMLAttributes<HTMLSpanElement> & { formatOptions?: Intl.NumberFormatOptions }
export function ProgressValueText({ formatOptions, children, ...props }: ProgressValueTextProps) {
  const { value, min, max, indeterminate, percent } = useProgressContext()
  const text = indeterminate ? "In progress" : `${new Intl.NumberFormat(undefined, formatOptions).format(value ?? min)}${max === 100 && min === 0 ? "%" : ""}`
  return <ValueTextView as="span" {...props}>{children ?? text}</ValueTextView>
}

export interface ProgressProps extends ProgressRootProps {}
export const Progress = Object.assign(ProgressRoot, { Root: ProgressRoot, Track: ProgressTrack, Range: ProgressRange, Label: ProgressLabel, ValueText: ProgressValueText })
