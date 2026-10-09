/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import { Button, Provider } from "./index"

afterEach(() => {
  cleanup()
  document.documentElement.className = ""
  document.documentElement.removeAttribute("data-theme")
  document.documentElement.style.colorScheme = ""
})

function renderedCss() {
  return Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
}

for (const mode of ["light", "dark"] as const) {
  test(`Button conformance: variants, sizes, nested conditions, and focus ring in ${mode} mode`, () => {
    render(
      <Provider defaultColorMode={mode}>
        <Button data-testid="solid">Solid</Button>
        <Button variant="outline" size="sm">Outline</Button>
        <Button variant="ghost" size="lg">Ghost</Button>
        <Button variant="subtle" size="xs">Subtle</Button>
      </Provider>,
    )

    const solid = screen.getByTestId("solid")
    expect(solid.getAttribute("type")).toBe("button")
    const css = renderedCss()
    const themeCss = document.querySelector("style[data-indoku-theme]")?.textContent ?? ""
    expect(css).toContain("background:var(--indoku-colors-accent-default)")
    expect(css).toContain("background:var(--indoku-colors-bg-subtle)")
    expect(css).toContain("outline:2px solid")
    expect(css).toContain("outline-offset:2px")
    expect(css).toContain("border-color:var(--indoku-colors-accent-default)")
    expect(css).toContain(":focus-visible")
    expect(themeCss).toContain('[data-theme="dark"]')
    expect(themeCss).toContain("--indoku-colors-accent-hover:var(--indoku-colors-gray-200)")
  })
}

test("Button disabled and loading states prevent interaction and expose accessible state", () => {
  render(
    <Provider defaultColorMode="light">
      <Button disabled>Disabled</Button>
      <Button loading loadingText="Saving">Save</Button>
    </Provider>,
  )

  expect(screen.getByRole("button", { name: "Disabled" }).hasAttribute("disabled")).toBe(true)
  expect(screen.getByRole("button", { name: "Saving" }).hasAttribute("disabled")).toBe(true)
  expect(screen.getByRole("button", { name: "Saving" }).getAttribute("aria-busy")).toBe("true")
})


test("Button hover selectors are emitted and enabled buttons are not accidentally disabled", () => {
  render(<Provider defaultColorMode="light"><Button data-testid="hover-check">Hover me</Button></Provider>)
  const button = screen.getByTestId("hover-check")
  expect(button.hasAttribute("disabled")).toBe(false)
  const css = renderedCss()
  expect(css).toContain(":hover")
  expect(css).toContain("background:var(--indoku-colors-accent-hover)")
})


test("Button icon size is square and has a strict recipe-derived size type", () => {
  render(<Provider defaultColorMode="light"><Button size="icon" data-testid="icon-button">−</Button></Provider>)
  const css = renderedCss()
  expect(css).toContain("width:32px")
  expect(css).toContain("height:32px")
})

// @ts-expect-error Unsupported size values must be rejected by TypeScript.
const invalidButtonSize: import("./components/button").ButtonSize = "giant"
void invalidButtonSize
