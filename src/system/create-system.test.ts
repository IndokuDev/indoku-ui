import { describe, expect, test } from "vitest"
import { createSystem } from "./create-system"

describe("createSystem", () => {
  test("creates token scales and resolves token values", () => {
    const system = createSystem({
      theme: {
        tokens: {
          colors: {
            red: {
              500: { value: "#e53e3e" },
            },
            blue: {
              500: { value: "#3182ce" },
            },
          },
          spacing: {
            4: { value: "1rem" },
          },
        },
      },
    })

    expect(system.resolve("colors.red.500")).toBe("#e53e3e")
    expect(system.token("spacing.4")).toBe("1rem")
    expect(system.tokenVar("colors.blue.500")).toBe(
      "var(--indoku-colors-blue-500)",
    )
  })

  test("resolves semantic token references", () => {
    const system = createSystem({
      theme: {
        tokens: {
          colors: {
            red: { value: "#e53e3e" },
          },
        },
        semanticTokens: {
          colors: {
            danger: { value: "{colors.red}" },
          },
        },
      },
    })

    expect(system.token("colors.danger")).toBe(
      "var(--indoku-colors-red)",
    )
    expect(system.tokenVar("colors.danger")).toBe(
      "var(--indoku-colors-danger)",
    )
  })

  test("supports conditional semantic token values", () => {
    const system = createSystem({
      theme: {
        semanticTokens: {
          colors: {
            danger: {
              value: {
                base: "{colors.red}",
                _dark: "{colors.darkred}",
              },
            },
          },
        },
      },
    })

    expect(system.resolve("colors.danger")).toEqual({
      base: "{colors.red}",
      _dark: "{colors.darkred}",
    })
  })

  test("merges custom conditions with defaults", () => {
    const system = createSystem({
      theme: {
        conditions: {
          _mobile: "@media (max-width: 47.999rem)",
        },
      },
    })

    expect(system.condition("_hover")).toBe("&:is(:hover, [data-hover])")
    expect(system.condition("_mobile")).toBe(
      "@media (max-width: 47.999rem)",
    )
  })

  test("merges custom breakpoints with defaults", () => {
    const system = createSystem({
      theme: {
        breakpoints: {
          md: "50rem",
          tablet: "40rem",
        },
      },
    })

    expect(system.breakpoint("md")).toBe("50rem")
    expect(system.breakpoint("tablet")).toBe("40rem")
    expect(system.breakpoint("lg")).toBe("62rem")
  })

  test("supports a custom CSS variable prefix", () => {
    const system = createSystem({
      cssVarsPrefix: "test",
      theme: {
        tokens: {
          colors: {
            red: { value: "#e53e3e" },
          },
        },
      },
    })

    expect(system.tokenVar("colors.red")).toBe(
      "var(--test-colors-red)",
    )
  })

  test("returns undefined for unknown paths", () => {
    const system = createSystem()

    expect(system.token("colors.unknown")).toBeUndefined()
    expect(system.tokenVar("colors.unknown")).toBeUndefined()
    expect(system.condition("_unknown")).toBeUndefined()
    expect(system.breakpoint("unknown")).toBeUndefined()
  })
})
