/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import { Box, Grid, Provider, createSystem, defaultSystem, defineRecipe } from "./index"

const system = createSystem({
  theme: {
    tokens: {
      spacing: { 4: { value: "1rem" } },
      colors: { brand: { 500: { value: "#6750a4" } } },
    },
    semanticTokens: {
      colors: {
        fg: { muted: { value: { base: "#555555", _dark: "#dddddd" } } },
        border: { subtle: { value: { base: "#eeeeee", _dark: "#444444" } } },
      },
    },
  },
})

afterEach(() => {
  cleanup()
  document.documentElement.className = ""
  document.documentElement.removeAttribute("data-theme")
})

test("Provider injects token variables and dark semantic overrides", () => {
  const { container } = render(
    <Provider value={system} defaultColorMode="light">
      <Box color="fg.muted" borderColor="border.subtle">tokenized</Box>
    </Provider>,
  )
  const style = container.querySelector("style[data-indoku-theme]")
  expect(style?.textContent).toContain("--indoku-spacing-4:1rem")
  expect(style?.textContent).toContain("--indoku-colors-fg-muted:#555555")
  expect(style?.textContent).toContain('[data-theme="dark"]')
  expect(style?.textContent).toContain("--indoku-colors-fg-muted:#dddddd")
  expect(container.querySelector("div")?.getAttribute("style") ?? "").not.toContain("fg.muted")
})

test("rendered Emotion CSS uses indoku class keys and real hover selectors", () => {
  const recipe = defineRecipe({
    base: {
      color: "fg.muted",
      _hover: { color: "brand.500", borderColor: "border.subtle" },
      _dark: { _hover: { color: "brand.500" } },
    },
  }, system)
  const result = recipe()
  const { container } = render(
    <Provider value={system} defaultColorMode="light">
      <Box css={result.css} data-testid="styled" />
    </Provider>,
  )
  const element = container.querySelector('[data-testid="styled"]')!
  expect(element.className).toMatch(/indoku-/)
  const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(emotionStyles).toContain(":hover")
  expect(emotionStyles).toContain("var(--indoku-colors-brand-500)")
  expect(emotionStyles).toContain("var(--indoku-colors-border-subtle)")
  expect(emotionStyles).toContain('[data-theme="dark"]')
})

test("unknown props do not leak onto intrinsic DOM elements", () => {
  const { container } = render(
    <Provider value={system} defaultColorMode="light">
      <Grid columns={{ base: 1, md: 2 }} mysteryProp="nope" data-testid="grid" />
    </Provider>,
  )
  const element = container.querySelector('[data-testid="grid"]')!
  expect(element.hasAttribute("columns")).toBe(false)
  expect(element.hasAttribute("mysteryprop")).toBe(false)
  expect(element.className).toMatch(/indoku-/)
  const gridStyles = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]')).map((node) => node.textContent ?? "").join("\n")
  expect(gridStyles).toContain("grid-template-columns:repeat(1, minmax(0, 1fr))")
})

test("default Provider supplies the base theme and CSS reset", () => {
  const { container } = render(
    <Provider defaultColorMode="light">
      <Box color="fg.default" bg="bg.surface">default theme</Box>
    </Provider>,
  )
  const reset = container.querySelector("style[data-indoku-reset]")
  const theme = container.querySelector("style[data-indoku-theme]")
  expect(reset?.textContent).toContain("body{margin:0;line-height:inherit}")
  expect(reset?.textContent).toContain(":where(button,[type=button],[type=reset],[type=submit]){appearance:button;background-color:transparent;background-image:none}")
  expect(reset?.textContent).not.toMatch(/(?:^|\})button,\[type=button\],\[type=reset\],\[type=submit\]\{/)
  expect(reset?.textContent).toContain("@keyframes indoku-skeleton-shimmer")
  expect(reset?.textContent).toContain("@media(prefers-reduced-motion:reduce)")
  expect(theme?.textContent).toContain("--indoku-colors-brand-500:#737373")
  expect(theme?.textContent).toContain("--indoku-colors-fg-default:var(--indoku-colors-gray-900)")
  expect(theme?.textContent).toContain("--indoku-colors-fg-default:var(--indoku-colors-gray-50)")
})

test("rendered style props resolve shorthand tokens inside hover and Flex wrap", () => {
  const { container } = render(
    <Provider defaultColorMode="light">
      <Box _hover={{ bg: "bg.subtle" }} data-testid="hover-box" />
      <Box display="flex" wrap="wrap" data-testid="flex-box" />
    </Provider>,
  )
  const hover = container.querySelector('[data-testid="hover-box"]')!
  const flex = container.querySelector('[data-testid="flex-box"]')!
  expect(flex.hasAttribute("wrap")).toBe(false)
  const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(emotionStyles).toContain("background:var(--indoku-colors-bg-subtle)")
  expect(emotionStyles).toContain("flex-wrap:wrap")
  expect(hover.className).toMatch(/indoku-/)
  expect(container.querySelector("p.indoku-0")).toBeNull()
})


test("accent hover semantic token resolves through CSS variables for light and dark themes", () => {
  const { container } = render(
    <Provider defaultColorMode="light">
      <Box bg="accent.default" _hover={{ bg: "accent.hover" }} data-testid="accent-hover" />
    </Provider>,
  )
  const theme = container.querySelector("style[data-indoku-theme]")?.textContent ?? ""
  const styles = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(styles).toContain("background:var(--indoku-colors-accent-hover)")
  expect(theme).toContain("--indoku-colors-accent-hover:var(--indoku-colors-gray-800)")
  expect(theme).toContain("--indoku-colors-accent-hover:var(--indoku-colors-gray-200)")
  expect(defaultSystem.tokenVar("colors.accent.hover")).toBe("var(--indoku-colors-accent-hover)")
})
