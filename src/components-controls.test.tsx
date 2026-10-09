/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Checkbox, Provider, Switch, Textarea, Toggle } from "./index"

afterEach(() => cleanup())

test("Checkbox toggles with pointer input and reports the updated checked state", () => {
  const onCheckedChange = vi.fn()
  render(<Provider><Checkbox onCheckedChange={onCheckedChange}>Accept terms</Checkbox></Provider>)
  const checkbox = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement
  expect(checkbox.checked).toBe(false)
  fireEvent.click(checkbox)
  expect(checkbox.checked).toBe(true)
  expect(onCheckedChange).toHaveBeenCalledWith(true)
  fireEvent.click(checkbox)
  expect(checkbox.checked).toBe(false)
  expect(onCheckedChange).toHaveBeenLastCalledWith(false)
})

test("Switch toggles with pointer input and reports the updated checked state", () => {
  const onCheckedChange = vi.fn()
  render(<Provider><Switch onCheckedChange={onCheckedChange}>Enable alerts</Switch></Provider>)
  const toggle = screen.getByRole("switch", { name: "Enable alerts" }) as HTMLInputElement
  expect(toggle.checked).toBe(false)
  fireEvent.click(toggle)
  expect(toggle.checked).toBe(true)
  expect(onCheckedChange).toHaveBeenCalledWith(true)
  fireEvent.click(toggle)
  expect(toggle.checked).toBe(false)
  expect(onCheckedChange).toHaveBeenLastCalledWith(false)
})

test("Checkbox and Switch respect controlled values and disabled state", () => {
  const onCheckedChange = vi.fn()
  render(<Provider><Checkbox checked={false} onCheckedChange={onCheckedChange}>Controlled checkbox</Checkbox><Switch disabled>Disabled switch</Switch></Provider>)
  const checkbox = screen.getByRole("checkbox", { name: "Controlled checkbox" }) as HTMLInputElement
  fireEvent.click(checkbox)
  expect(checkbox.checked).toBe(false)
  expect(onCheckedChange).toHaveBeenCalledWith(true)
  expect((screen.getByRole("switch", { name: "Disabled switch" }) as HTMLInputElement).disabled).toBe(true)
})

test("Toggle supports uncontrolled pressed state and Textarea native props", () => {
  render(<Provider><Toggle>Bold</Toggle><Textarea placeholder="Write something" /></Provider>)
  const toggle = screen.getByRole("button", { name: "Bold" })
  expect(toggle.getAttribute("aria-pressed")).toBe("false")
  fireEvent.click(toggle)
  expect(toggle.getAttribute("aria-pressed")).toBe("true")
  expect(screen.getByPlaceholderText("Write something").tagName).toBe("TEXTAREA")
})
