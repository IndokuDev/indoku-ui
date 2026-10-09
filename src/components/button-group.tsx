import * as React from "react"
import { indoku } from "../primitives/indoku"
import type { ControlSize } from "./control-size"
const Root = indoku("div")
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> { attached?: boolean; orientation?: "horizontal" | "vertical"; size?: ControlSize; }
function ButtonGroupRoot({ attached = false, orientation = "horizontal", size, children, ...props }: ButtonGroupProps) {
 const items = React.Children.toArray(children)
 return <Root role="group" display="inline-flex" flexDirection={orientation === "horizontal" ? "row" : "column"} alignItems="stretch" gap={attached ? "0" : "8px"} {...props}>{items.map((child, i) => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { key: (child as any).key ?? i, size: size ?? (child.props as any).size, ...(attached ? { borderRadius: "0", ...(i === 0 ? { borderStartStartRadius: "md", borderEndStartRadius: "md" } : {}), ...(i === items.length - 1 ? { borderStartEndRadius: "md", borderEndEndRadius: "md" } : {}), ...(orientation === "horizontal" && i > 0 ? { borderLeftWidth: "0" } : {}), ...(orientation === "vertical" && i > 0 ? { borderTopWidth: "0" } : {}) } : {}) }) : child)}</Root>
}

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Root: ButtonGroupRoot })
