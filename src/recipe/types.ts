export type RecipeStyle = Record<string, unknown>
export type RecipeSlots = readonly string[]
export type VariantValue = string | number | boolean | null | undefined
export type VariantSelection = Record<string, VariantValue>
export type VariantStyles = Record<string, Record<string, RecipeStyle>>

export interface CompoundVariant<V extends VariantSelection = VariantSelection> {
  css: RecipeStyle | Record<string, RecipeStyle>
  [key: string]: unknown
}

export interface RecipeConfig<V extends VariantSelection = VariantSelection> {
  className?: string
  base?: RecipeStyle
  variants?: {
    [K in keyof V]?: Record<string, RecipeStyle>
  } & Record<string, Record<string, RecipeStyle>>
  defaultVariants?: Partial<V>
  compoundVariants?: CompoundVariant<V>[]
}

export interface SlotRecipeConfig<
  S extends RecipeSlots = RecipeSlots,
  V extends VariantSelection = VariantSelection,
> {
  className?: string
  slots: S
  base?: Partial<Record<S[number], RecipeStyle>>
  variants?: Record<string, Record<string, Partial<Record<S[number], RecipeStyle>>>>
  defaultVariants?: Partial<V>
  compoundVariants?: Array<{
    css: Partial<Record<S[number], RecipeStyle>>
    [key: string]: unknown
  }>
}

export interface RecipeResult {
  className: string
  css: RecipeStyle
}

export type SlotRecipeResult<S extends RecipeSlots> = Record<S[number], RecipeResult>
export type RecipeFunction = (props?: VariantSelection) => RecipeResult
export type SlotRecipeFunction<S extends RecipeSlots = RecipeSlots> = (
  props?: VariantSelection,
) => SlotRecipeResult<S>
