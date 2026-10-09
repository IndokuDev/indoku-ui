import { describe, expect, test, vi } from "vitest"
import { createSystem } from "../system"
import { styleProps } from "./style-props"

const system = createSystem({
  theme: {
    tokens: {
      spacing: {
        4: { value: "1rem" },
        8: { value: "2rem" },
      },
      colors: {
        red: { value: "#e53e3e" },
      },
      sizes: {
        sm: { value: "24rem" },
      },
    },
  },
})

describe("styleProps", () => {
  test("maps spacing aliases and resolves tokens", () => {
    expect(styleProps({ p: 4, mx: 8 }, system).style).toEqual({
      padding: "var(--indoku-spacing-4)",
      marginInline: "var(--indoku-spacing-8)",
    })
  })

  test("supports responsive object syntax", () => {
    expect(styleProps({ p: { base: 4, md: 8 } }, system).style).toEqual({
      padding: "var(--indoku-spacing-4)",
      "@media screen and (min-width: 48rem)": {
        padding: "var(--indoku-spacing-8)",
      },
    })
  })

  test("supports responsive array syntax", () => {
    expect(styleProps({ display: ["block", "flex", "grid"] }, system).style).toEqual({
      display: "block",
      "@media screen and (min-width: 30rem)": {
        display: "flex",
      },
      "@media screen and (min-width: 48rem)": {
        display: "grid",
      },
    })
  })

  test("supports conditional styles", () => {
    expect(styleProps({ _hover: { color: "red" } }, system).style).toEqual({
      "&:is(:hover, [data-hover])": {
        color: "var(--indoku-colors-red)",
      },
    })
  })

  test("resolves semantic color paths and nested conditions", () => {
    const themed = createSystem({
      theme: {
        semanticTokens: {
          colors: {
            fg: { muted: { value: { base: "#555", _dark: "#ddd" } } },
            border: { subtle: { value: { base: "#eee", _dark: "#444" } } },
          },
        },
      },
    })
    expect(styleProps({ color: "fg.muted", borderColor: "border.subtle", _dark: { _hover: { color: "fg.muted" } } }, themed).style).toEqual({
      color: "var(--indoku-colors-fg-muted)",
      borderColor: "var(--indoku-colors-border-subtle)",
      '[data-theme="dark"] &': {
        "&:is(:hover, [data-hover])": { color: "var(--indoku-colors-fg-muted)" },
      },
    })
  })

  test("maps columns to grid template columns without leaking the prop", () => {
    const result = styleProps({ columns: { base: 1, md: 2 }, id: "grid" }, system)
    expect(result.style).toEqual({
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      "@media screen and (min-width: 48rem)": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
    })
    expect(result.rest).toEqual({ id: "grid" })
  })

  test("keeps DOM props out of the style object", () => {
    const result = styleProps({ p: 4, id: "box", "aria-label": "Box" }, system)
    expect(result.rest).toEqual({ id: "box", "aria-label": "Box" })
  })

  test("supports negative spacing and color alpha modifiers", () => {
    expect(styleProps({ m: "-4", color: "red/50" }, system).style).toEqual({
      margin: "calc(var(--indoku-spacing-4) * -1)",
      color: "color-mix(in srgb, var(--indoku-colors-red) 50%, transparent)",
    })
  })

  test("uses canonical style props regardless of input order", () => {
    expect(styleProps({ px: 8, p: 4 }, system).style).toEqual({
      padding: "var(--indoku-spacing-4)",
      paddingInline: "var(--indoku-spacing-8)",
    })
    expect(styleProps({ p: 4, px: 8 }, system).style).toEqual({
      padding: "var(--indoku-spacing-4)",
      paddingInline: "var(--indoku-spacing-8)",
    })
  })

  test("resolves shorthand props and tokens recursively inside conditions", () => {
    const themed = createSystem({
      theme: {
        tokens: { colors: { brand: { 600: { value: "#111111" } } } },
        semanticTokens: { colors: { bg: { subtle: { value: { base: "#f5f5f5", _dark: "#222222" } } } } },
      },
    })
    expect(styleProps({ _hover: { bg: "bg.subtle", color: "brand.600" } }, themed).style).toEqual({
      "&:is(:hover, [data-hover])": {
        background: "var(--indoku-colors-bg-subtle)",
        color: "var(--indoku-colors-brand-600)",
      },
    })
  })

  test("resolves responsive shorthand props nested inside a condition", () => {
    expect(styleProps({ _hover: { bg: { base: "red", md: "red" } } }, system).style).toEqual({
      "&:is(:hover, [data-hover])": {
        background: "var(--indoku-colors-red)",
        "@media screen and (min-width: 48rem)": { background: "var(--indoku-colors-red)" },
      },
    })
  })

  test("maps wrap to flex-wrap", () => {
    expect(styleProps({ wrap: "wrap" }, system)).toEqual({ style: { flexWrap: "wrap" }, rest: {} })
  })

  test("warns when a token-like style value is absent from the theme", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {})
    styleProps({ bg: "brand.soft" }, system)
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('Unknown token "brand.soft"'))
    warning.mockRestore()
  })

})
