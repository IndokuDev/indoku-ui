import { expect, test } from "vitest"
import { createSystem } from "../system"
import { defineRecipe, defineSlotRecipe } from "./index"

test("defineRecipe separates className from CSS and applies defaults and caller overrides", () => {
  const recipe = defineRecipe({
    className: "button",
    base: { display: "inline-flex", color: "black" },
    variants: {
      size: {
        sm: { padding: "4px", fontSize: "12px" },
        lg: { padding: "12px", fontSize: "18px" },
      },
      variant: {
        solid: { background: "navy", color: "white" },
        outline: { background: "transparent", border: "1px solid" },
      },
    },
    defaultVariants: { size: "sm", variant: "solid" },
    compoundVariants: [
      { size: "sm", variant: "solid", css: { padding: "6px", textTransform: "uppercase" } },
    ],
  })

  const defaults = recipe()
  expect(defaults.className).toBe("indoku-button")
  expect(defaults.css.display).toBe("inline-flex")
  expect(defaults.css.padding).toBe("6px")
  expect(defaults.css.textTransform).toBe("uppercase")

  const overridden = recipe({ size: "lg", variant: "outline" })
  expect(overridden.css.padding).toBe("12px")
  expect(overridden.css.background).toBe("transparent")
  expect(overridden.css.border).toBe("1px solid")
  expect(overridden.css.textTransform).toBeUndefined()
})

test("compound variants override single variants and merge deterministically", () => {
  const recipe = defineRecipe({
    variants: { tone: { danger: { color: "red", borderColor: "red" } } },
    compoundVariants: [
      { tone: "danger", css: { color: "darkred", outline: "1px solid" } },
    ],
  })

  expect(recipe({ tone: "danger" })).toEqual({
    className: "indoku-recipe",
    css: { color: "darkred", borderColor: "red", outline: "1px solid" },
  })
  expect(Object.keys(recipe({ tone: "danger" }).css)).toEqual([
    "color", "borderColor", "outline",
  ])
})

test("nested condition styles deep-merge between base, variant, and compound styles", () => {
  const recipe = defineRecipe({
    base: {
      _hover: { background: "navy", color: "white" },
      _dark: { _hover: { borderColor: "gray.700", color: "white" } },
    },
    variants: {
      tone: {
        brand: {
          _hover: { color: "cyan.100" },
          _dark: { _hover: { color: "cyan.200" } },
        },
      },
    },
    compoundVariants: [
      { tone: "brand", css: { _hover: { outline: "2px solid" } } },
    ],
  })

  expect(recipe({ tone: "brand" }).css).toEqual({
    "&:is(:hover, [data-hover])": { background: "navy", color: "cyan.100", outline: "2px solid" },
    '[data-theme="dark"] &': {
      "&:is(:hover, [data-hover])": { borderColor: "gray.700", color: "cyan.200" },
    },
  })
})

test("recipes are registered in one system config", () => {
  const button = defineRecipe({ className: "button", base: { display: "flex" } })
  const field = defineSlotRecipe({
    className: "field",
    slots: ["root", "label", "control"] as const,
    base: {
      root: { display: "flex" },
      label: { fontWeight: "bold" },
      control: { borderWidth: "1px" },
    },
  })
  const system = createSystem({ theme: { recipes: { button }, slotRecipes: { field } } })

  expect(system.recipe("button")?.()).toMatchObject({ className: "indoku-button", css: { display: "flex" } })
  expect(system.slotRecipe("field")?.().root).toMatchObject({ className: "indoku-field__root", css: { display: "flex" } })
})

test("defineSlotRecipe creates per-slot classes and applies shared variants", () => {
  const field = defineSlotRecipe({
    className: "field",
    slots: ["root", "label", "control"] as const,
    base: {
      root: { display: "flex" },
      label: { color: "gray" },
      control: { borderWidth: "1px" },
    },
    variants: {
      size: {
        sm: { root: { gap: "4px" }, control: { padding: "4px" } },
        lg: { root: { gap: "12px" }, control: { padding: "12px" } },
      },
    },
    defaultVariants: { size: "sm" },
    compoundVariants: [
      { size: "sm", css: { control: { borderColor: "blue" } } },
    ],
  })

  const result = field()
  expect(result.root.className).toBe("indoku-field__root")
  expect(result.label.className).toBe("indoku-field__label")
  expect(result.root.css.gap).toBe("4px")
  expect(result.control.css.padding).toBe("4px")
  expect(result.control.css.borderColor).toBe("blue")
  expect(field({ size: "lg" }).control.css.padding).toBe("12px")
})

test("system config can register multiple recipes in each registry", () => {
  const system = createSystem({
    theme: {
      recipes: {
        alpha: defineRecipe({ base: { color: "red" } }),
        beta: defineRecipe({ base: { color: "blue" } }),
      },
      slotRecipes: {
        one: defineSlotRecipe({ slots: ["root"] as const, base: { root: { color: "red" } } }),
        two: defineSlotRecipe({ slots: ["root"] as const, base: { root: { color: "blue" } } }),
      },
    },
  })
  expect(system.recipe("alpha")?.().css.color).toBe("red")
  expect(system.recipe("beta")?.().css.color).toBe("blue")
  expect(system.slotRecipe("one")?.().root?.css.color).toBe("red")
  expect(system.slotRecipe("two")?.().root?.css.color).toBe("blue")
})

test("registered recipes resolve tokens against their owning system", () => {
  const recipe = defineRecipe({
    base: { color: "fg.muted", _hover: { borderColor: "border.subtle" } },
  })
  const system = createSystem({
    theme: {
      semanticTokens: {
        colors: {
          fg: { muted: { value: { base: "#555", _dark: "#ddd" } } },
          border: { subtle: { value: { base: "#eee", _dark: "#444" } } },
        },
      },
      recipes: { sample: recipe },
    },
  })
  expect(system.recipe("sample")?.().css).toEqual({
    color: "var(--indoku-colors-fg-muted)",
    "&:is(:hover, [data-hover])": {
      borderColor: "var(--indoku-colors-border-subtle)",
    },
  })
})
