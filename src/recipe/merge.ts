import type { RecipeStyle } from "./types"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export function mergeRecipeStyles(target: RecipeStyle, source?: RecipeStyle) {
  if (!source) return target

  for (const [key, value] of Object.entries(source)) {
    const current = target[key]
    if (isRecord(current) && isRecord(value)) {
      mergeRecipeStyles(current, value)
    } else if (isRecord(value)) {
      target[key] = mergeRecipeStyles({}, value)
    } else {
      target[key] = value
    }
  }

  return target
}
