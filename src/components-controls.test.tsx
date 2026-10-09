/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Checkbox, Provider, RadioGroup, Switch, Textarea, Toggle } from "./index"

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

test("RadioGroup selects one option and reports the selected value", async () => {
  const onValueChange = vi.fn()
  render(
    <Provider>
      <RadioGroup
        aria-label="Plan"
        name="plan"
        defaultValue="basic"
        onValueChange={onValueChange}
        items={[{ label: "Basic", value: "basic" }, { label: "Pro", value: "pro" }]}
      />
    </Provider>,
  )
  const basic = screen.getByRole("radio", { name: "Basic" }) as HTMLInputElement
  const pro = screen.getByRole("radio", { name: "Pro" }) as HTMLInputElement
  expect(basic.checked).toBe(true)
  expect(pro.checked).toBe(false)
  fireEvent.click(pro)
  expect(onValueChange).toHaveBeenCalledWith("pro")
  expect(pro.checked).toBe(true)
  expect(basic.checked).toBe(false)
})

test("RadioGroup supports controlled and disabled options", () => {
  render(
    <Provider>
      <RadioGroup aria-label="Size" value="medium" disabled items={[{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }]} />
    </Provider>,
  )
  expect((screen.getByRole("radio", { name: "Medium" }) as HTMLInputElement).checked).toBe(true)
  expect((screen.getByRole("radio", { name: "Small" }) as HTMLInputElement).disabled).toBe(true)
})
