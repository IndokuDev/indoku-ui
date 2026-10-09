import { ClassNames } from "@emotion/react"
import isPropValid from "@emotion/is-prop-valid"
import * as React from "react"
import { useSystem } from "../system/provider"
import { styleProps } from "../styled"
import type { StyleProps } from "../styled"
import type { System } from "../system"

type ElementType = React.ElementType

type IndokuProps<T extends ElementType> = StyleProps & {
  as?: T
  system?: System
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, keyof StyleProps | "as" | "system">

export const indoku = <T extends ElementType = "div">(
  component: T = "div" as T,
  options: { system?: System; defaultProps?: Record<string, unknown> } = {},
) => {
  const StyledElement = React.forwardRef<any, IndokuProps<T>>(
    function IndokuElement(props, ref) {
      const contextSystem = useSystem()
      const {
        as,
        system: suppliedSystem,
        className,
        children,
        ...inputProps
      } = { ...options.defaultProps, ...props }
      const system = suppliedSystem ?? options.system ?? contextSystem
      const element = as ?? component
      const { style, rest } = styleProps(
        inputProps as StyleProps & Record<string, unknown>,
        system,
      )
      const suppliedStyle = rest.style
      delete rest.style
      const mergedStyle = {
        ...(suppliedStyle && typeof suppliedStyle === "object" ? suppliedStyle : {}),
      }
      const forwardedProps = typeof element === "string"
        ? Object.fromEntries(Object.entries(rest).filter(([key]) => isPropValid(key)))
        : rest

      return (
        <ClassNames>
          {({ css, cx }) =>
            React.createElement(
              element,
              {
                ...forwardedProps,
                ref,
                className: cx(Object.keys(style).length ? css(style as any) : undefined, className),
                style: mergedStyle,
              },
              children,
            )
          }
        </ClassNames>
      )
    },
  )

  StyledElement.displayName = `indoku(${typeof component === "string" ? component : component.displayName ?? component.name ?? "Component"})`
  return StyledElement
}
