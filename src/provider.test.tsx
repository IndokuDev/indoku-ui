/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test } from "vitest"
import { Provider, useColorMode, createColorModeScript, createSystem, useSystem } from "./index"

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.className = ""
  document.documentElement.removeAttribute("data-theme")
  document.documentElement.style.colorScheme = ""
})

function ColorModeProbe() {
  const { colorMode, preference, setColorMode, toggleColorMode } = useColorMode()
  const system = useSystem()

  return (
    <div>
      <span data-testid="mode">{colorMode ?? "unresolved"}</span>
      <span data-testid="preference">{preference}</span>
      <span data-testid="token">{system.token("colors.brand.500") ?? "missing"}</span>
      <button onClick={toggleColorMode}>toggle</button>
      <button onClick={() => setColorMode("dark")}>set-dark</button>
      <button onClick={() => setColorMode("light")}>set-light</button>
    </div>
  )
}

test("Provider resolves the initial mode and toggles between light and dark", async () => {
  render(
    <Provider defaultColorMode="light">
      <ColorModeProbe />
    </Provider>,
  )

  expect((await screen.findByTestId("mode")).textContent).toBe("light")
  expect(document.documentElement.style.colorScheme).toBe("light")
  fireEvent.click(screen.getByText("toggle"))
  expect((await screen.findByTestId("mode")).textContent).toBe("dark")
  expect(document.documentElement.dataset.theme).toBe("dark")
  expect(document.documentElement.style.colorScheme).toBe("dark")
  fireEvent.click(screen.getByText("toggle"))
  expect((await screen.findByTestId("mode")).textContent).toBe("light")
  expect(document.documentElement.style.colorScheme).toBe("light")
})

test("color mode preference is saved and restored from localStorage", async () => {
  localStorage.setItem("indoku-color-mode", "dark")

  render(
    <Provider defaultColorMode="light">
      <ColorModeProbe />
    </Provider>,
  )

  expect((await screen.findByTestId("mode")).textContent).toBe("dark")
  expect(screen.getByTestId("preference").textContent).toBe("dark")

  fireEvent.click(screen.getByText("set-light"))
  expect(localStorage.getItem("indoku-color-mode")).toBe("light")
  expect((await screen.findByTestId("mode")).textContent).toBe("light")
})

test("Provider passes its system to descendants", async () => {
  const system = createSystem({ theme: { tokens: { colors: { brand: { 500: "#123456" } } } } })

  render(
    <Provider value={system} defaultColorMode="light">
      <ColorModeProbe />
    </Provider>,
  )

  expect((await screen.findByTestId("token")).textContent).toBe("#123456")
})

test("server markup hydrates without a color-mode mismatch", async () => {
  const element = (
    <Provider defaultColorMode="dark">
      <ColorModeProbe />
    </Provider>
  )
  const markup = renderToString(element)
  const container = document.createElement("div")
  container.innerHTML = markup
  document.body.append(container)

  const recoverableErrors: unknown[] = []
  let root: Root | undefined

  await act(async () => {
    root = hydrateRoot(container, element, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    })
  })

  expect(recoverableErrors).toEqual([])
  expect(container.querySelector('[data-testid="mode"]')?.textContent).toBe("dark")

  await act(async () => root?.unmount())
  container.remove()
})

test("createColorModeScript includes a custom storage key and theme application", () => {
  const script = createColorModeScript("custom-mode")
  expect(script).toContain('"custom-mode"')
  expect(script).toContain('e.dataset.theme=m')
})

test("Provider starts from saved light preference without first using system mode", async () => {
  localStorage.setItem("indoku-color-mode", "light")
  const originalMatchMedia = window.matchMedia
  window.matchMedia = (() => ({
    matches: true,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia

  try {
    render(<Provider defaultColorMode="system"><ColorModeProbe /></Provider>)
    expect(screen.getByTestId("preference").textContent).toBe("light")
    expect((await screen.findByTestId("mode")).textContent).toBe("light")
    expect(document.documentElement.dataset.theme).toBe("light")
  } finally {
    window.matchMedia = originalMatchMedia
  }
})
