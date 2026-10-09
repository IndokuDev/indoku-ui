"use client"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, type ReactNode } from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { SystemProvider, defaultSystem } from "./system/provider"
import type { System } from "./system"

export type ColorModeValue = "light" | "dark"
export type ColorModePreference = ColorModeValue | "system"

const DEFAULT_STORAGE_KEY = "indoku-color-mode"
const emotionCache = createCache({ key: "indoku" })

const resetStyles = `*,*::before,*::after{box-sizing:border-box;border-width:0;border-style:solid}
html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:system-ui,sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}
body{margin:0;line-height:inherit}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
a{color:inherit;text-decoration:inherit}
b,strong{font-weight:bolder}
button,input,optgroup,select,textarea{font:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}
button,select{text-transform:none}
:where(button,[type=button],[type=reset],[type=submit]){appearance:button;background-color:transparent;background-image:none}
blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}
fieldset{margin:0;padding:0}
ol,ul,menu{list-style:none;margin:0;padding:0}
textarea{resize:vertical}
button,[role=button]{cursor:pointer}
button:disabled{cursor:default}
img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}
[hidden]:where(:not([hidden=until-found])){display:none!important}
@keyframes indoku-skeleton-shimmer{to{transform:translateX(100%)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}`

interface ColorModeContextValue {
  colorMode: ColorModeValue | undefined
  preference: ColorModePreference
  setColorMode: (preference: ColorModePreference) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

export interface ProviderProps {
  children?: ReactNode
  value?: System
  defaultColorMode?: ColorModePreference
  forcedColorMode?: ColorModeValue
  storageKey?: string
}

export function Provider({
  children,
  value = defaultSystem,
  defaultColorMode = "system",
  forcedColorMode,
  storageKey = DEFAULT_STORAGE_KEY,
}: ProviderProps) {
  return (
    <CacheProvider value={emotionCache}>
      <SystemProvider value={value}>
        <ThemeProvider
          attribute={["class", "data-theme"]}
          defaultTheme={defaultColorMode}
          forcedTheme={forcedColorMode}
          storageKey={storageKey}
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <ColorModeBridge defaultColorMode={defaultColorMode}>
            <style data-indoku-reset="">{resetStyles}</style>
            <style data-indoku-theme="">{value.cssVariables()}</style>
            {children}
          </ColorModeBridge>
        </ThemeProvider>
      </SystemProvider>
    </CacheProvider>
  )
}

function ColorModeBridge({
  children,
  defaultColorMode,
}: {
  children: ReactNode
  defaultColorMode: ColorModePreference
}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const colorMode: ColorModeValue | undefined = resolvedTheme === "light" || resolvedTheme === "dark"
    ? resolvedTheme
    : undefined
  const preference: ColorModePreference = theme === "light" || theme === "dark" || theme === "system"
    ? theme
    : defaultColorMode

  // next-themes' inline script is effective in server-rendered HTML, but a
  // script element rendered by React during a client-only mount does not run
  // early enough to prevent a light frame. Sync the already-resolved theme in
  // a layout effect so the DOM is corrected before the browser paints it.
  useLayoutEffect(() => {
    if (!colorMode) return
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(colorMode)
    root.dataset.theme = colorMode
    root.style.colorScheme = colorMode
  }, [colorMode])

  const setColorMode = useCallback((next: ColorModePreference) => {
    // Apply the resolved mode before React's passive effects run. This avoids
    // a visible light-frame when changing from light to dark (or system-dark).
    const nextMode = next === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : next
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(nextMode)
    root.dataset.theme = nextMode
    root.style.colorScheme = nextMode
    setTheme(next)
  }, [setTheme])

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === "dark" ? "light" : "dark")
  }, [colorMode, setColorMode])

  const contextValue = useMemo(
    () => ({ colorMode, preference, setColorMode, toggleColorMode }),
    [colorMode, preference, setColorMode, toggleColorMode],
  )

  return <ColorModeContext.Provider value={contextValue}>{children}</ColorModeContext.Provider>
}

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) throw new Error("useColorMode must be used within Provider.")
  return context
}

export function createColorModeScript(storageKey: string = DEFAULT_STORAGE_KEY) {
  return `(function(){try{var p=localStorage.getItem(${JSON.stringify(storageKey)})||"system";var m=p==="system"?((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"):p;var e=document.documentElement;e.classList.remove("light","dark");e.classList.add(m);e.dataset.theme=m;e.style.colorScheme=m}catch(_){}})()`
}

export const colorModeScript = createColorModeScript()
