import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { useColorMode, type ColorMode } from "../provider"

export interface ColorModeButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  label?: string
  lightIcon?: React.ReactNode
  darkIcon?: React.ReactNode
}

/** An accessible icon button that toggles between light and dark mode. */
export function ColorModeButton({
  label,
  lightIcon = <SunIcon />,
  darkIcon = <MoonIcon />,
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
      title={label ?? `Switch to ${nextMode} mode`}
      {...props}
    >
      {colorMode === "dark" ? lightIcon : darkIcon}
    </Button>
  )
}

export interface ColorModeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  value: ColorMode
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

function SunIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
}

function MoonIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>
}
