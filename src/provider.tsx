"use client"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { SystemProvider, defaultSystem } from "./system/provider"
import type { System } from "./system"

export type ColorMode = "light" | "dark"
export type ColorModePreference = ColorMode | "system"

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
[hidden]:where(:not([hidden=until-found])){display:none!important}`

interface ColorModeContextValue {
  colorMode: ColorMode | undefined
  preference: ColorModePreference
  setColorMode: (preference: ColorModePreference) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

function readStored(key: string): ColorModePreference | null {
  try {
    const value = window.localStorage.getItem(key)
    return value === "light" || value === "dark" || value === "system" ? value : null
  } catch {
    return null
  }
}

function applyMode(mode: ColorMode) {
  const element = document.documentElement
  element.classList.remove("light", "dark")
  element.classList.add(mode)
  element.dataset.theme = mode
  element.style.colorScheme = mode
}

export interface ProviderProps {
  children?: ReactNode
  value?: System
  defaultColorMode?: ColorModePreference
  forcedColorMode?: ColorMode
  storageKey?: string
}

export function Provider({
  children,
  value = defaultSystem,
  defaultColorMode = "system",
  forcedColorMode,
  storageKey = DEFAULT_STORAGE_KEY,
}: ProviderProps) {
  // Read the saved preference before the first client render. Loading it in an
  // effect lets the system preference apply for one frame before the saved mode.
  const [preference, setPreference] = useState<ColorModePreference>(() => {
    if (typeof window === "undefined") return defaultColorMode
    return readStored(storageKey) ?? defaultColorMode
  })
  const [colorMode, setResolved] = useState<ColorMode | undefined>(forcedColorMode)

  useEffect(() => {
    if (forcedColorMode) {
      setResolved(forcedColorMode)
      applyMode(forcedColorMode)
      return
    }

    const query = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null

    const update = () => {
      const mode: ColorMode = preference === "system" ? (query?.matches ? "dark" : "light") : preference
      setResolved(mode)
      applyMode(mode)
    }

    update()
    if (preference !== "system" || !query) return
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [preference, forcedColorMode])

  const setColorMode = useCallback((next: ColorModePreference) => {
    setPreference(next)
    try {
      window.localStorage.setItem(storageKey, next)
    } catch {
      return
    }
  }, [storageKey])

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === "dark" ? "light" : "dark")
  }, [colorMode, setColorMode])

  const contextValue = useMemo(
    () => ({ colorMode, preference, setColorMode, toggleColorMode }),
    [colorMode, preference, setColorMode, toggleColorMode],
  )

  return (
    <CacheProvider value={emotionCache}>
      <SystemProvider value={value}>
        <ColorModeContext.Provider value={contextValue}>
          <style data-indoku-reset="">{resetStyles}</style>
          <style data-indoku-theme="">{value.cssVariables()}</style>
          {children}
        </ColorModeContext.Provider>
      </SystemProvider>
    </CacheProvider>
  )
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
