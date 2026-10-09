import type {
  Breakpoints,
  Conditions,
  SemanticTokenValue,
  SemanticTokens,
  System,
  SystemConfig,
  TokenDefinition,
  TokenPrimitive,
  Tokens,
} from "./types"
import { resolveStyleObject } from "../styled/style-props"

const defaultBreakpoints: Breakpoints = {
  sm: "30rem",
  md: "48rem",
  lg: "62rem",
  xl: "80rem",
  "2xl": "96rem",
}

const defaultConditions: Conditions = {
  base: "",
  _hover: "&:is(:hover, [data-hover])",
  _focus: "&:is(:focus, [data-focus])",
  _focusVisible: "&:is(:focus-visible, [data-focus-visible])",
  _disabled: "&:is(:disabled, [disabled], [data-disabled])",
  _checked: "&:is(:checked, [data-checked])",
  _active: "&:is(:active, [data-active])",
  _dark: '[data-theme="dark"] &',
  _light: '[data-theme="light"] &',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isTokenDefinition = (value: unknown): value is TokenDefinition =>
  isRecord(value) && "value" in value

const flatten = (
  value: Record<string, unknown>,
  prefix = "",
): Record<string, TokenPrimitive | SemanticTokenValue> => {
  const result: Record<string, TokenPrimitive | SemanticTokenValue> = {}

  for (const [key, current] of Object.entries(value)) {
    const path = prefix ? prefix + "." + key : key

    if (isTokenDefinition(current)) {
      result[path] = current.value as TokenPrimitive | SemanticTokenValue
      continue
    }

    if (isRecord(current)) {
      Object.assign(result, flatten(current, path))
      continue
    }

    if (typeof current === "string" || typeof current === "number") {
      result[path] = current
    }
  }

  return result
}

const clone = <T extends Record<string, unknown> | undefined>(value: T): T => {
  if (!value) return {} as T
  return structuredClone(value)
}

const escapeCssName = (value: string) =>
  value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^{|}~ ])/g, "\\$1")

const createVariable = (prefix: string, path: string) =>
  "--" + prefix + "-" + path.split(".").map(escapeCssName).join("-")

const tokenReference = (prefix: string, path: string) =>
  "var(" + createVariable(prefix, path) + ")"

const resolveReference = (
  value: TokenPrimitive | SemanticTokenValue,
  prefix: string,
) => {
  if (typeof value !== "string") return value
  return value.replace(/\{([^}]+)\}/g, (_, path: string) => tokenReference(prefix, path))
}

const flattenScales = (
  tokens: Tokens | SemanticTokens,
): Record<string, TokenPrimitive | SemanticTokenValue> =>
  flatten(tokens as Record<string, unknown>)

const semanticModeValue = (
  value: TokenPrimitive | SemanticTokenValue,
  mode: "light" | "dark",
  prefix: string,
): TokenPrimitive | SemanticTokenValue => {
  if (!isRecord(value)) return resolveReference(value, prefix)
  const selected = value[mode === "dark" ? "_dark" : "_light"] ?? value[mode] ?? value.base
  if (selected === undefined) return ""
  return resolveReference(selected as TokenPrimitive | SemanticTokenValue, prefix)
}

export const createSystem = (config: SystemConfig = {}): System => {
  const tokens = clone(config.theme?.tokens as Record<string, unknown>) as Tokens
  const semanticTokens = clone(config.theme?.semanticTokens as Record<string, unknown>) as SemanticTokens
  const conditions = { ...defaultConditions, ...(config.theme?.conditions ?? {}) }
  const breakpoints = { ...defaultBreakpoints, ...(config.theme?.breakpoints ?? {}) }
  const prefix = config.cssVarsPrefix ?? "indoku"
  let system: System
  const sourceRecipes = config.theme?.recipes ?? {}
  const sourceSlotRecipes = config.theme?.slotRecipes ?? {}
  const recipes = Object.fromEntries(Object.entries(sourceRecipes).map(([name, recipe]) => [
    name,
    (props: Parameters<typeof recipe>[0]) => {
      const result = recipe(props)
      return { ...result, css: resolveStyleObject(result.css, system) }
    },
  ]))
  const slotRecipes = Object.fromEntries(Object.entries(sourceSlotRecipes).map(([name, recipe]) => [
    name,
    (props: Parameters<typeof recipe>[0]) => {
      const result = recipe(props)
      return Object.fromEntries(Object.entries(result).map(([slot, item]) => [
        slot,
        { ...item, css: resolveStyleObject(item.css, system) },
      ]))
    },
  ]))
  const flatTokens = flattenScales(tokens)
  const flatSemanticTokens = flattenScales(semanticTokens)

  const lookup = (path: string) => {
    const tokenValue = flatTokens[path]
    if (tokenValue !== undefined) return tokenValue
    const semanticValue = flatSemanticTokens[path]
    if (semanticValue !== undefined) return resolveReference(semanticValue, prefix)
    return undefined
  }

  const cssVariables = () => {
    const light: string[] = []
    const dark: string[] = []

    for (const [path, value] of Object.entries(flatTokens)) {
      if (isRecord(value)) continue
      light.push(createVariable(prefix, path) + ":" + String(value))
    }

    for (const [path, value] of Object.entries(flatSemanticTokens)) {
      const variable = createVariable(prefix, path)
      if (isRecord(value)) {
        const lightValue = semanticModeValue(value, "light", prefix)
        const darkValue = semanticModeValue(value, "dark", prefix)
        if (lightValue !== "") light.push(variable + ":" + String(lightValue))
        if (darkValue !== "") dark.push(variable + ":" + String(darkValue))
      } else {
        light.push(variable + ":" + String(resolveReference(value, prefix)))
      }
    }

    const blocks: string[] = []
    if (light.length) blocks.push(":root{" + light.join(";") + "}")
    if (dark.length) blocks.push('[data-theme="dark"]{' + dark.join(";") + "}")
    return blocks.join("\n")
  }

  system = {
    tokens,
    semanticTokens,
    conditions,
    breakpoints,
    token: (path) => {
      const value = lookup(path)
      if (value === undefined) return undefined
      return isRecord(value) ? tokenReference(prefix, path) : String(value)
    },
    tokenVar: (path) => lookup(path) === undefined ? undefined : tokenReference(prefix, path),
    resolve: lookup,
    condition: (name) => conditions[name],
    breakpoint: (name) => breakpoints[name],
    cssVariables,
    recipes,
    slotRecipes,
    recipe: (name) => recipes[name],
    slotRecipe: (name) => slotRecipes[name],
  }
  return system
}
