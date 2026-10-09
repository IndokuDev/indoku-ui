import type { System } from "../system"
import type {
  ResponsiveValue,
  StyleEngineResult,
  StyleProps,
} from "./types"

type CSSValue = string | number
type CSSObject = Record<string, unknown>

const aliases: Record<string, string | string[]> = {
  m: ["margin"],
  mt: ["marginTop"],
  mr: ["marginRight"],
  me: ["marginInlineEnd"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  ms: ["marginInlineStart"],
  mx: ["marginInline"],
  my: ["marginBlock"],
  p: ["padding"],
  pt: ["paddingTop"],
  pr: ["paddingRight"],
  pe: ["paddingInlineEnd"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  ps: ["paddingInlineStart"],
  px: ["paddingInline"],
  py: ["paddingBlock"],
  gap: ["gap"],
  rowGap: ["rowGap"],
  columnGap: ["columnGap"],
  w: ["width"],
  width: ["width"],
  minW: ["minWidth"],
  maxW: ["maxWidth"],
  h: ["height"],
  height: ["height"],
  minH: ["minHeight"],
  maxH: ["maxHeight"],
  display: ["display"],
  pos: ["position"],
  position: ["position"],
  inset: ["inset"],
  top: ["top"],
  right: ["right"],
  bottom: ["bottom"],
  left: ["left"],
  zIndex: ["zIndex"],
  overflow: ["overflow"],
  overflowX: ["overflowX"],
  overflowY: ["overflowY"],
  color: ["color"],
  bg: ["background"],
  background: ["background"],
  bgColor: ["backgroundColor"],
  opacity: ["opacity"],
  fontFamily: ["fontFamily"],
  fontSize: ["fontSize"],
  fontWeight: ["fontWeight"],
  lineHeight: ["lineHeight"],
  letterSpacing: ["letterSpacing"],
  textAlign: ["textAlign"],
  textTransform: ["textTransform"],
  textDecoration: ["textDecoration"],
  border: ["border"],
  borderWidth: ["borderWidth"],
  borderStyle: ["borderStyle"],
  borderColor: ["borderColor"],
  borderTop: ["borderTop"],
  borderRight: ["borderRight"],
  borderBottom: ["borderBottom"],
  borderLeft: ["borderLeft"],
  rounded: ["borderRadius"],
  borderRadius: ["borderRadius"],
  shadow: ["boxShadow"],
  boxShadow: ["boxShadow"],
  flex: ["flex"],
  flexDirection: ["flexDirection"],
  flexWrap: ["flexWrap"],
  wrap: ["flexWrap"],
  alignItems: ["alignItems"],
  alignContent: ["alignContent"],
  justifyContent: ["justifyContent"],
  alignSelf: ["alignSelf"],
  order: ["order"],
  columns: ["gridTemplateColumns"],
  templateColumns: ["gridTemplateColumns"],
  gridTemplateColumns: ["gridTemplateColumns"],
  gridTemplateRows: ["gridTemplateRows"],
  gridColumn: ["gridColumn"],
  gridRow: ["gridRow"],
  cursor: ["cursor"],
  pointerEvents: ["pointerEvents"],
  userSelect: ["userSelect"],
  transition: ["transition"],
  transform: ["transform"],
  animation: ["animation"],
}

const tokenGroups: Record<string, string> = {
  m: "spacing",
  mt: "spacing",
  mr: "spacing",
  me: "spacing",
  mb: "spacing",
  ml: "spacing",
  ms: "spacing",
  mx: "spacing",
  my: "spacing",
  p: "spacing",
  pt: "spacing",
  pr: "spacing",
  pe: "spacing",
  pb: "spacing",
  pl: "spacing",
  ps: "spacing",
  px: "spacing",
  py: "spacing",
  gap: "spacing",
  rowGap: "spacing",
  columnGap: "spacing",
  w: "sizes",
  width: "sizes",
  minW: "sizes",
  maxW: "sizes",
  h: "sizes",
  height: "sizes",
  minH: "sizes",
  maxH: "sizes",
  fontSize: "fontSizes",
  fontWeight: "fontWeights",
  lineHeight: "lineHeights",
  letterSpacing: "letterSpacings",
  color: "colors",
  bg: "colors",
  bgColor: "colors",
  background: "colors",
  borderColor: "colors",
  outlineColor: "colors",
  rounded: "radii",
  borderRadius: "radii",
  shadow: "shadows",
  boxShadow: "shadows",
  zIndex: "zIndices",
}

const unitless = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "order",
  "flex",
])

const negative = (value: string | number) => {
  if (typeof value === "number") return -value
  if (!value.startsWith("-")) return value
  return value
}

const resolveValue = (prop: string, value: CSSValue, system: System): CSSValue => {
  if (typeof value === "number") {
    if (prop === "columns") return `repeat(${value}, minmax(0, 1fr))`
    const group = tokenGroups[prop]
    const token = group && system.tokenVar(group + "." + value)
    if (token) return token
    return unitless.has(String(aliases[prop] ?? "")) ? value : value
  }

  if (value === "auto" || value === "inherit" || value === "initial" || value === "unset") {
    return value
  }

  const raw = value
  const isNegative = raw.startsWith("-")
  const key = isNegative ? raw.slice(1) : raw
  const group = tokenGroups[prop]

  if (group) {
    const alphaIndex = key.lastIndexOf("/")
    const tokenKey = alphaIndex >= 0 ? key.slice(0, alphaIndex) : key
    const alpha = alphaIndex >= 0 ? key.slice(alphaIndex + 1) : undefined
    const variable = system.tokenVar(group + "." + tokenKey)

    if (variable) {
      const resolved = alpha ? "color-mix(in srgb, " + variable + " " + alpha + "%, transparent)" : variable
      return isNegative ? "calc(" + resolved + " * -1)" : resolved
    }
  }

  if (isNegative) {
    return "calc(" + key + " * -1)"
  }

  if (/^-?\d+(\.\d+)?$/.test(raw) && !unitless.has(String(aliases[prop] ?? ""))) {
    return raw + "px"
  }

  return raw
}

const cssPropertyTokenGroups: Record<string, string> = {
  margin: "spacing", marginTop: "spacing", marginRight: "spacing", marginBottom: "spacing", marginLeft: "spacing",
  marginInline: "spacing", marginBlock: "spacing", marginInlineStart: "spacing", marginInlineEnd: "spacing",
  padding: "spacing", paddingTop: "spacing", paddingRight: "spacing", paddingBottom: "spacing", paddingLeft: "spacing",
  paddingInline: "spacing", paddingBlock: "spacing", paddingInlineStart: "spacing", paddingInlineEnd: "spacing",
  gap: "spacing", rowGap: "spacing", columnGap: "spacing",
  width: "sizes", minWidth: "sizes", maxWidth: "sizes", height: "sizes", minHeight: "sizes", maxHeight: "sizes",
  columns: "sizes",
  templateColumns: "sizes",
  gridTemplateColumns: "sizes", gridTemplateRows: "sizes",
  color: "colors", background: "colors", backgroundColor: "colors", borderColor: "colors", outlineColor: "colors",
  fontSize: "fontSizes", fontWeight: "fontWeights", lineHeight: "lineHeights", letterSpacing: "letterSpacings",
  borderRadius: "radii", boxShadow: "shadows", zIndex: "zIndices",
}

const breakpointNames = new Set(["base", "sm", "md", "lg", "xl", "2xl"])

const isResponsiveObject = (value: Record<string, unknown>) =>
  Object.keys(value).length > 0 && Object.keys(value).every((key) => breakpointNames.has(key))

const resolveDeclaration = (key: string, value: unknown, system: System): Record<string, unknown> => {
  const target = aliases[key]
  const properties = Array.isArray(target) ? target : target ? [target] : [key]
  const output: Record<string, unknown> = {}
  const resolved = typeof value === "string" || typeof value === "number"
    ? resolveValue(key, value, system)
    : value

  if (typeof value === "string" && value.includes(".")) {
    const group = tokenGroups[key] ?? cssPropertyTokenGroups[key]
    const candidate = value.startsWith("-") ? value.slice(1) : value
    const tokenCandidate = candidate.split("/")[0] ?? candidate
    const known = group && (
      system.tokenVar(group + "." + tokenCandidate) !== undefined ||
      system.tokenVar(tokenCandidate.startsWith("colors.") ? tokenCandidate : "colors." + tokenCandidate) !== undefined
    )
    if (group && !known && isDevelopment()) {
      console.warn(`[Indoku UI] Unknown token \"${tokenCandidate}\" used by style prop \"${key}\". Check the theme token scale.`)
    }
  }

  for (const property of properties) output[property] = resolved
  return output
}

const isDevelopment = () => typeof process !== "undefined" && process.env.NODE_ENV !== "production"

export const resolveStyleObject = (input: Record<string, unknown>, system: System): Record<string, unknown> => {
  const output: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value) && aliases[key]) {
      const properties = aliases[key]
      const names = Array.isArray(properties) ? properties : [properties]
      const keys = ["base", "sm", "md", "lg", "xl", "2xl"]
      value.forEach((current, index) => {
        if (current === undefined || current === null || !keys[index]) return
        const declarations = resolveDeclaration(key, current, system)
        const declaration = Object.fromEntries(names.map((name) => [name, declarations[name]]))
        if (index === 0) Object.assign(output, declaration)
        else {
          const media = `@media screen and (min-width: ${system.breakpoint(keys[index]) ?? "0px"})`
          output[media] = { ...(output[media] as object ?? {}), ...declaration }
        }
      })
      continue
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const objectValue = value as Record<string, unknown>
      if (key.startsWith("_") || key.startsWith("&") || key.startsWith("@media") || key.startsWith("[") ) {
        const condition = key.startsWith("_") ? system.condition(key) : undefined
        output[condition ?? key] = resolveStyleObject(objectValue, system)
        continue
      }
      const responsiveValue = objectValue
      if (aliases[key] && isResponsiveObject(objectValue)) {
        const properties = aliases[key]
        const names = Array.isArray(properties) ? properties : [properties]
        for (const [breakpoint, current] of Object.entries(responsiveValue)) {
          const declarations = resolveDeclaration(key, current, system)
          const declaration = Object.fromEntries(names.map((name) => [name, declarations[name]]))
          if (breakpoint === "base") Object.assign(output, declaration)
          else {
            const media = `@media screen and (min-width: ${system.breakpoint(breakpoint) ?? "0px"})`
            output[media] = { ...(output[media] as object ?? {}), ...declaration }
          }
        }
        continue
      }
      output[key] = resolveStyleObject(objectValue, system)
      continue
    }

    if (key.startsWith("_") && typeof value !== "object") {
      output[system.condition(key) ?? key] = value
      continue
    }
    Object.assign(output, resolveDeclaration(key, value, system))
  }

  return output
}

const responsive = <T>(
  value: ResponsiveValue<T>,
  apply: (value: T) => CSSObject,
  breakpoints: Record<string, string | number>,
): CSSObject => {
  if (!Array.isArray(value) && typeof value === "object" && value !== null) {
    const result: CSSObject = {}
    for (const [key, current] of Object.entries(value as Record<string, T>)) {
      if (key === "base") Object.assign(result, apply(current))
      else {
        const breakpoint = breakpoints[key]
        if (breakpoint !== undefined) {
          result["@media screen and (min-width: " + breakpoint + ")"] = apply(current)
        }
      }
    }
    return result
  }

  if (!Array.isArray(value)) return apply(value)

  const keys = ["base", "sm", "md", "lg", "xl", "2xl"]
  const result: CSSObject = {}
  value.forEach((current, index) => {
    if (current === undefined || current === null) return
    const key = keys[index]
    if (!key) return
    if (key === "base") Object.assign(result, apply(current))
    else {
      const breakpoint = breakpoints[key]
      if (breakpoint !== undefined) {
        result["@media screen and (min-width: " + breakpoint + ")"] = apply(current)
      }
    }
  })
  return result
}

export const styleProps = (
  props: StyleProps & Record<string, unknown>,
  system: System,
): StyleEngineResult => {
  const style: CSSObject = {}
  const rest: Record<string, unknown> = {}
  const styleKeys = new Set(Object.keys(aliases))

  for (const [prop, value] of Object.entries(props)) {
    if (prop === "css") {
      if (value && typeof value === "object") Object.assign(style, value)
      continue
    }

    if (prop.startsWith("_") && value && typeof value === "object") {
      const condition = system.condition(prop)
      if (condition) {
        style[condition] = value
        continue
      }
    }

    if (!styleKeys.has(prop)) {
      rest[prop] = value
      continue
    }

    const properties = aliases[prop]
    const apply = (current: string | number) => {
      const resolved = resolveValue(prop, current, system)
      return Object.fromEntries((Array.isArray(properties) ? properties : [properties]).map((property) => [property, resolved]))
    }

    Object.assign(style, responsive(value as ResponsiveValue<string | number>, apply, system.breakpoints))
  }

  return { style: resolveStyleObject(style, system), rest }
}
