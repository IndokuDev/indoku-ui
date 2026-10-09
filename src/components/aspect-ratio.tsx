import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div")
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> { ratio?: number }
export function AspectRatio({ ratio = 4 / 3, children, ...props }: AspectRatioProps) {
  return (
    <Root {...props} position="relative" w="100%" style={{ ...props.style, aspectRatio: String(ratio) }}>
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>{children}</div>
    </Root>
  )
}
