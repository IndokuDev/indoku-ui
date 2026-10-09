import type { RecipeResult, RecipeStyle, SlotRecipeConfig, SlotRecipeFunction, RecipeSlots, VariantSelection } from "./types"
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

export const defineSlotRecipe = <S extends RecipeSlots, V extends VariantSelection = VariantSelection>(
  config: SlotRecipeConfig<S, V>,
  system: System = fallbackSystem,
): SlotRecipeFunction<S> => {
  const baseClass = normalizeClassName(config.className)

  return ((props: VariantSelection = {}) => {
    const selected = { ...(config.defaultVariants ?? {}), ...props }
    const result = Object.fromEntries(
      config.slots.map((rawSlot) => {
        const slot = rawSlot as S[number]
        return [
          slot,
          {
            className: `${baseClass}__${slot}`,
            css: mergeRecipeStyles({}, config.base?.[slot]),
          },
        ] as const
      }),
    ) as Record<S[number], RecipeResult>

    for (const [variantName, options] of Object.entries(config.variants ?? {})) {
      const value = selected[variantName]
      if (value === undefined || value === null) continue
      const styles = options[String(value)] as Partial<Record<S[number], RecipeStyle>> | undefined
      if (!styles) continue
      for (const slot of config.slots as readonly S[number][]) {
        const slotStyle = styles[slot]
        if (slotStyle) mergeRecipeStyles(result[slot].css, slotStyle)
      }
    }

    for (const compound of config.compoundVariants ?? []) {
      const { css, ...conditions } = compound
      const matchesAll = Object.entries(conditions).every(([key, expected]) =>
        matches(expected, selected[key]),
      )
      if (!matchesAll || !css) continue
      for (const slot of config.slots as readonly S[number][]) {
        const slotStyle = css[slot]
        if (slotStyle) mergeRecipeStyles(result[slot].css, slotStyle)
      }
    }

    for (const slot of config.slots as readonly S[number][]) {
      result[slot].css = resolveStyleObject(result[slot].css, system)
    }

    return result
  }) as SlotRecipeFunction<S>
}
