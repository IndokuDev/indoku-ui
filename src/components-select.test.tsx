/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Provider, Select } from "./index"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
Element.prototype.scrollTo = () => {}

afterEach(() => {
  cleanup()
  document.documentElement.className = ""
  document.documentElement.removeAttribute("data-theme")
})

test("Select uses a custom Ark UI popup instead of a visible native select", async () => {
  const onValueChange = vi.fn()
  render(
    <Provider defaultColorMode="light">
      <Select
        aria-label="Color mode"
        placeholder="Choose mode"
        items={[{ label: "System", value: "system" }, { label: "Light", value: "light" }, { label: "Dark", value: "dark" }]}
        onValueChange={onValueChange}
      />
    </Provider>,
  )

  const trigger = screen.getByRole("combobox", { name: "Color mode" })
  expect(trigger.tagName).toBe("BUTTON")
  expect(trigger.textContent).toContain("Choose mode")
  fireEvent.click(trigger)
  expect(await screen.findByRole("listbox")).toBeTruthy()
  fireEvent.click(screen.getByRole("option", { name: "Dark" }))
  await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("dark"))
})

test("Select popup and trigger styles use semantic tokens", async () => {
  render(
    <Provider defaultColorMode="dark">
      <Select items={[{ label: "One", value: "one" }]} placeholder="Pick one" />
    </Provider>,
  )

  fireEvent.click(screen.getByRole("combobox"))
  await screen.findByRole("listbox")
  const css = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(css).toContain("var(--indoku-colors-bg-surface)")
  expect(css).toContain("var(--indoku-colors-border-subtle)")
})


test("Select trigger defaults to the same 32px height and radius as the default Button", () => {
  render(
    <Provider defaultColorMode="light">
      <Select aria-label="Theme" items={[{ label: "Light", value: "light" }]} />
    </Provider>,
  )
  const trigger = screen.getByRole("combobox", { name: "Theme" })
  const css = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(css).toContain("32px")
  expect(css).toContain("height:32px")
  expect(css).toContain("border-radius:var(--indoku-radii-lg)")
  expect(css).toContain("font-size:14px")
  expect(css).toContain("font-weight:var(--indoku-fontWeights-medium)")
})

test("Select supports boolean rtl prop and shared control sizes", () => {
  render(
    <Provider defaultColorMode="light">
      <Select rtl size="lg" aria-label="RTL theme" items={[{ label: "Light", value: "light" }]} />
    </Provider>,
  )
  const trigger = screen.getByRole("combobox", { name: "RTL theme" })
  expect(trigger.getAttribute("dir")).toBe("rtl")
  expect(trigger.parentElement?.getAttribute("dir")).toBe("rtl")
  const css = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]'))
    .map((node) => node.textContent ?? "")
    .join("\n")
  expect(css).toContain("height:36px")
})
