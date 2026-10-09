import {
  createContext,
  useContext,
  type ReactNode,
} from "react"
import { createSystem } from "./create-system"
import { defaultTheme } from "./default-theme"
import type { System } from "./types"

export const defaultSystem = createSystem({ theme: defaultTheme })

export const SystemContext = createContext<System>(defaultSystem)

export interface SystemProviderProps {
  value?: System
  children?: ReactNode
}

export function SystemProvider({ value = defaultSystem, children }: SystemProviderProps) {
  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  return useContext(SystemContext)
}
