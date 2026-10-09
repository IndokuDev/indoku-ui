/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Accordion, AspectRatio, Avatar, Badge, ButtonGroup, Card, CardContent, Carousel, Checkbox, CodeBlock, ColorSwatch, DataList, Item, Progress, Provider, RadioGroup, Skeleton, Stat, Status, Switch, Textarea, Toggle, ToggleGroup } from "./index"

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


test("display components render accessible content and basic states", () => {
  render(<Provider><Badge>New</Badge><Card aria-label="Summary"><CardContent>Card body</CardContent></Card><Avatar name="Ada Lovelace" /><AspectRatio ratio={16 / 9}><div>Video</div></AspectRatio><Skeleton data-testid="skeleton" /><Progress value={40} label="Upload" /><Status>Online</Status><Stat label="Users" value="1,024" /><DataList items={[{ label: "Email", value: "hello@example.com" }]} /><Item title="Settings" description="Manage preferences" /><ColorSwatch value="#ff0000" /><CodeBlock code="const x = 1" /></Provider>)
  expect(screen.getByText("New")).toBeTruthy()
  expect(screen.getByText("Card body")).toBeTruthy()
  expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeTruthy()
  expect(screen.getByRole("progressbar", { name: "Upload" }).getAttribute("aria-valuenow")).toBe("40")
  expect(screen.getByText("hello@example.com")).toBeTruthy()
  expect(screen.getByText("const x = 1")).toBeTruthy()
})

test("CodeBlock supports line numbers, highlighted lines, and collapsible content", () => {
  render(<Provider><CodeBlock code={"const a = 1\nconst b = 2\nconst c = 3"} language="ts" showLineNumbers highlightLines={[2]} maxLines={1} /></Provider>)
  expect(screen.getByRole("button", { name: "Show all 3 lines" })).toBeTruthy()
  expect(document.querySelector('[data-line="2"][data-state="highlighted"]')).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Show all 3 lines" }))
  expect(screen.getByRole("button", { name: "Show less" })).toBeTruthy()
})

test("Accordion supports opening an item", () => {
  render(<Provider><Accordion items={[{ value: "faq", title: "Question", content: "Answer" }]} /></Provider>)
  fireEvent.click(screen.getByRole("button", { name: /Question/ }))
  expect(screen.getByText("Answer")).toBeTruthy()
})

test("ButtonGroup renders as a grouped set of actions", () => {
  render(<Provider><ButtonGroup aria-label="Formatting"><button>Bold</button><button>Italic</button></ButtonGroup></Provider>)
  expect(screen.getByRole("group", { name: "Formatting" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Italic" })).toBeTruthy()
})


test("Carousel renders slide content and accessible navigation", () => {
  render(<Provider><Carousel items={[<div key="one">Slide one</div>, <div key="two">Slide two</div>]} /></Provider>)
  expect(screen.getByText("Slide one")).toBeTruthy()
  expect(screen.getByText("Slide two")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Next slide" })).toBeTruthy()
})


test("ToggleGroup supports single and multiple selection through compound items", () => {
  const onValueChange = vi.fn()
  render(<Provider><ToggleGroup.Root defaultValue={["bold"]} onValueChange={onValueChange} aria-label="Text style"><ToggleGroup.Item value="bold">Bold</ToggleGroup.Item><ToggleGroup.Item value="italic">Italic</ToggleGroup.Item></ToggleGroup.Root></Provider>)
  const bold = screen.getByRole("button", { name: "Bold" })
  const italic = screen.getByRole("button", { name: "Italic" })
  expect(bold.getAttribute("aria-pressed")).toBe("true")
  expect(italic.getAttribute("aria-pressed")).toBe("false")
  fireEvent.click(italic)
  expect(italic.getAttribute("aria-pressed")).toBe("true")
  expect(bold.getAttribute("aria-pressed")).toBe("false")
  expect(onValueChange).toHaveBeenCalledWith(["italic"])
})

test("ToggleGroup supports multiple values and disabled state", () => {
  const onValueChange = vi.fn()
  render(<Provider><ToggleGroup.Root type="multiple" defaultValue={["bold"]} onValueChange={onValueChange}><ToggleGroup.Item value="bold">Bold</ToggleGroup.Item><ToggleGroup.Item value="italic" disabled>Italic</ToggleGroup.Item></ToggleGroup.Root></Provider>)
  fireEvent.click(screen.getByRole("button", { name: "Bold" }))
  expect(onValueChange).toHaveBeenCalledWith([])
  expect((screen.getByRole("button", { name: "Italic" }) as HTMLButtonElement).disabled).toBe(true)
})
