import { Moon, Sun } from "lucide-react"
import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { useColorMode, type ColorModeValue } from "../provider"

export interface ColorModeButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  label?: string
  lightIcon?: React.ReactNode
  darkIcon?: React.ReactNode
}

/** An accessible icon button that toggles between light and dark mode. */
export function ColorModeButton({
  label,
  lightIcon = <Sun aria-hidden="true" size={16} />,
  darkIcon = <Moon aria-hidden="true" size={16} />,
  "aria-label": ariaLabel,
  ...props
}: ColorModeButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const nextMode = colorMode === "dark" ? "light" : "dark"
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleColorMode}
      aria-label={ariaLabel ?? label ?? `Switch to ${nextMode} mode`}
      {...props}
    >
      {colorMode === "dark" ? darkIcon : lightIcon}
    </Button>
  )
}

export interface ColorModeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  value: ColorModeValue
}

/** Forces a subtree to use a light or dark color-scheme context. */
export function ColorMode({ value, children, className, style, ...props }: ColorModeProps) {
  const classes = [className, value].filter(Boolean).join(" ")
  return (
    <div
      {...props}
      className={classes}
      data-theme={value}
      style={{ colorScheme: value, ...style }}
    >
      {children}
    </div>
  )
}

export function LightMode(props: Omit<ColorModeProps, "value">) {
  return <ColorMode value="light" {...props} />
}

export function DarkMode(props: Omit<ColorModeProps, "value">) {
  return <ColorMode value="dark" {...props} />
}

/** Returns a value selected for the active color mode. */
export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}
