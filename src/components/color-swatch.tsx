import * as React from "react"
import { indoku } from "../primitives/indoku"

const RootElement = indoku("div")
const SwatchElement = indoku("span")
const LabelElement = indoku("span")
const ValueTextElement = indoku("span")
interface ColorSwatchContextValue { value: string; size: ColorSwatchSize; bordered: boolean; checkerboard: boolean }
const ColorSwatchContext = React.createContext<ColorSwatchContextValue | null>(null)
export type ColorSwatchSize = "xs" | "sm" | "md" | "lg" | "xl"
const dimensions: Record<ColorSwatchSize, string> = { xs: "16px", sm: "24px", md: "32px", lg: "40px", xl: "48px" }
export interface ColorSwatchProps extends React.HTMLAttributes<HTMLSpanElement> { value: string; size?: ColorSwatchSize; bordered?: boolean; checkerboard?: boolean }
export interface ColorSwatchSwatchProps extends Omit<ColorSwatchProps, "value"> { value?: string }
export function ColorSwatchSwatch({ value: explicitValue, size: explicitSize, bordered: explicitBordered, checkerboard: explicitCheckerboard, ...props }: ColorSwatchSwatchProps) { const context = React.useContext(ColorSwatchContext); const value = explicitValue ?? context?.value; if (value === undefined) throw new Error("ColorSwatch.Swatch requires a value or ColorSwatch.Root context"); const size = explicitSize ?? context?.size ?? "md"; const bordered = explicitBordered ?? context?.bordered ?? true; const checkerboard = explicitCheckerboard ?? context?.checkerboard ?? false; return <SwatchElement role="img" aria-label={`Color ${value}`} w={dimensions[size]} h={dimensions[size]} flexShrink={0} display="inline-block" borderRadius="md" bg={value} border={bordered ? "1px solid" : "none"} borderColor="border.subtle" style={{ backgroundColor: value, backgroundImage: checkerboard ? "repeating-conic-gradient(#b8b8b8 0% 25%, #fff 0% 50%) 50% / 8px 8px" : undefined, ...props.style }} {...props} /> }
export interface ColorSwatchRootProps extends React.HTMLAttributes<HTMLDivElement> { value: string; size?: ColorSwatchSize; bordered?: boolean; checkerboard?: boolean }
export function ColorSwatchRoot({ value, size = "md", bordered = true, checkerboard = false, children, ...props }: ColorSwatchRootProps) { const context = React.useMemo(() => ({ value, size, bordered, checkerboard }), [value, size, bordered, checkerboard]); return <ColorSwatchContext.Provider value={context}><RootElement display="inline-flex" alignItems="center" gap="8px" {...props}>{children ?? <ColorSwatchSwatch value={value} size={size} bordered={bordered} checkerboard={checkerboard} />}</RootElement></ColorSwatchContext.Provider> }
function useColorSwatch() { const context = React.useContext(ColorSwatchContext); if (!context) throw new Error("ColorSwatch parts must be used inside ColorSwatch.Root"); return context }
export type ColorSwatchLabelProps = React.HTMLAttributes<HTMLSpanElement>
export function ColorSwatchLabel(props: ColorSwatchLabelProps) { return <LabelElement color="fg.default" fontSize="14px" {...props} /> }
export interface ColorSwatchValueTextProps extends React.HTMLAttributes<HTMLSpanElement> { format?: "hex" | "rgb" | "hsl" | "css" }
export function ColorSwatchValueText({ format = "hex", ...props }: ColorSwatchValueTextProps) { const { value } = useColorSwatch(); let output = value; if (format === "css") output = `color: ${value}`; return <ValueTextElement as="span" fontSize="12px" color="fg.muted" fontFamily="monospace" {...props}>{output}</ValueTextElement> }
export const ColorSwatch = Object.assign(ColorSwatchSwatch, { Root: ColorSwatchRoot, Swatch: ColorSwatchSwatch, Label: ColorSwatchLabel, ValueText: ColorSwatchValueText })
export const ColorSwatchCompound = ColorSwatch
