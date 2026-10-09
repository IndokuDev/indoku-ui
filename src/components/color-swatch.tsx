import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div")
export interface ColorSwatchProps extends React.HTMLAttributes<HTMLDivElement> { value: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; bordered?: boolean }
export function ColorSwatch({ value, size = "md", bordered = true, ...props }: ColorSwatchProps) {
 const d = ({ xs: "16px", sm: "24px", md: "32px", lg: "40px", xl: "48px" } as const)[size]
 return <Root role="img" aria-label={`Color ${value}`} w={d} h={d} flexShrink={0} borderRadius="md" bg={value} border={bordered ? "1px solid" : "none"} borderColor="border.subtle" {...props} />
}
