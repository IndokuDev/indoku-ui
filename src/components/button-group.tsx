import * as React from "react"
import { indoku } from "../primitives/indoku"
import type { ControlSize } from "./control-size"

const Root = indoku("div")

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Join neighboring button borders into one segmented control. Defaults to true. */
  attached?: boolean
  orientation?: "horizontal" | "vertical"
  size?: ControlSize
}

function ButtonGroupRoot({ attached = true, orientation = "horizontal", size, children, ...props }: ButtonGroupProps) {
  const horizontal = orientation === "horizontal"
  const items = React.Children.toArray(children)
  return (
    <Root
      role="group"
      display="inline-flex"
      flexDirection={horizontal ? "row" : "column"}
      alignItems="stretch"
      gap={attached ? "0" : "8px"}
      css={attached ? {
        "& > button, & > a": {
          borderRadius: 0,
          ...(horizontal ? { marginInlineStart: "-1px" } : { marginBlockStart: "-1px" }),
        },
        "& > button:first-of-type, & > a:first-of-type": horizontal
          ? { borderStartStartRadius: "var(--indoku-radii-md, 6px)", borderEndStartRadius: "var(--indoku-radii-md, 6px)", ...( { marginInlineStart: 0 } ) }
          : { borderTopStartRadius: "var(--indoku-radii-md, 6px)", borderTopEndRadius: "var(--indoku-radii-md, 6px)", marginBlockStart: 0 },
        "& > button:last-of-type, & > a:last-of-type": horizontal
          ? { borderStartEndRadius: "var(--indoku-radii-md, 6px)", borderEndEndRadius: "var(--indoku-radii-md, 6px)" }
          : { borderEndStartRadius: "var(--indoku-radii-md, 6px)", borderEndEndRadius: "var(--indoku-radii-md, 6px)" },
        "& > button:focus-visible, & > a:focus-visible": { zIndex: 1 },
      } : undefined}
      {...props}
    >
      {items.map((child, index) => React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<any>, {
            key: (child as any).key ?? index,
            size: size ?? (child.props as any).size,
          })
        : child)}
    </Root>
  )
}

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Root: ButtonGroupRoot })
