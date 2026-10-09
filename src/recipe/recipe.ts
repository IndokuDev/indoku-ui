import type { RecipeConfig, RecipeFunction, RecipeResult, RecipeStyle, VariantSelection } from "./types"
import { mergeRecipeStyles } from "./merge"
import { createSystem } from "../system/create-system"
import { resolveStyleObject } from "../styled/style-props"
import type { System } from "../system/types"

const fallbackSystem = createSystem()

const normalizeClassName = (name?: string) => {
  const normalized = (name ?? "recipe").replace(/^indoku-/, "")
  return `indoku-${normalized}`
}

const matches = (condition: unknown, selected: unknown) =>
  Array.isArray(condition) ? condition.includes(selected) : condition === selected

export const defineRecipe = <V extends VariantSelection = VariantSelection>(
  config: RecipeConfig<V>,
  system: System = fallbackSystem,
): RecipeFunction => {
  const className = normalizeClassName(config.className)

  return ((props: VariantSelection = {}): RecipeResult => {
    const selected = { ...(config.defaultVariants ?? {}), ...props }
    const css: RecipeStyle = {}
    mergeRecipeStyles(css, config.base)

    for (const [variantName, options] of Object.entries(config.variants ?? {})) {
      const value = selected[variantName]
      if (value === undefined || value === null) continue
      const styles = options[String(value)]
      if (styles) mergeRecipeStyles(css, styles)
    }

    for (const compound of config.compoundVariants ?? []) {
      const { css: compoundCss, ...conditions } = compound
      const matchesAll = Object.entries(conditions).every(([key, expected]) =>
        matches(expected, selected[key]),
      )
      if (matchesAll && compoundCss && !Array.isArray(compoundCss)) {
        mergeRecipeStyles(css, compoundCss as RecipeStyle)
      }
    }

    return { className, css: resolveStyleObject(css, system) }
  }) as RecipeFunction
}
