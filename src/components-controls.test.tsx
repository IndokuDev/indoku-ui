/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Accordion, AspectRatio, Avatar, Badge, ButtonGroup, Card, CardContent, Carousel, Checkbox, CodeBlock, ColorSwatch, DataList, Dialog, Empty, Item, Kbd, KbdGroup, Label, Menu, PasswordInput, PasswordStrengthMeter, passwordStrength, Popover, Progress, Provider, Tooltip, RadioGroup, Skeleton, Stat, Status, Switch, Textarea, Toggle, ToggleGroup } from "./index"

afterEach(() => cleanup())

test("KbdGroup inserts accessible-neutral separators between keyboard keys", () => {
  render(<Provider><KbdGroup separator="+"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup></Provider>)
  expect(screen.getByText("Ctrl").tagName).toBe("KBD")
  expect(screen.getByText("K").tagName).toBe("KBD")
  expect(screen.getByText("+").getAttribute("aria-hidden")).toBe("true")
})

test("Empty compound API composes indicator, messaging, and actions", () => {
  render(<Provider><Empty.Root><Empty.Indicator aria-hidden="true">∅</Empty.Indicator><Empty.Title>No results</Empty.Title><Empty.Description>Try another search.</Empty.Description><Empty.Content><button>Clear filters</button></Empty.Content></Empty.Root></Provider>)
  expect(screen.getByRole("heading", { name: "No results" })).toBeTruthy()
  expect(screen.getByText("Try another search.")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Clear filters" })).toBeTruthy()
})

test("Menu compound API renders menu items with accessible roles", () => {
  render(<Provider><Menu.Root open><Menu.Trigger>Actions</Menu.Trigger><Menu.Positioner><Menu.Content><Menu.Item value="edit">Edit</Menu.Item><Menu.Separator /><Menu.Item value="delete">Delete</Menu.Item></Menu.Content></Menu.Positioner></Menu.Root></Provider>)
  expect(screen.getByRole("menuitem", { name: "Edit" })).toBeTruthy()
  expect(screen.getByRole("menuitem", { name: "Delete" })).toBeTruthy()
})

test("Tooltip compound API provides a non-native accessible description", () => {
  render(<Provider><Tooltip.Root open><Tooltip.Trigger>Hover target</Tooltip.Trigger><Tooltip.Positioner><Tooltip.Content>Extra context</Tooltip.Content></Tooltip.Positioner></Tooltip.Root></Provider>)
  expect(screen.getByText("Extra context")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Hover target" }).getAttribute("title")).toBeNull()
})

test("Popover compound API renders anchored content with a close trigger", () => {
  render(<Provider><Popover.Root defaultOpen><Popover.Trigger>More info</Popover.Trigger><Popover.Positioner><Popover.Content><Popover.Arrow /><span>Helpful details</span><Popover.CloseTrigger>Close</Popover.CloseTrigger></Popover.Content></Popover.Positioner></Popover.Root></Provider>)
  expect(screen.getByText("Helpful details")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Close popover" })).toBeTruthy()
})

test("Dialog compound API renders accessible title and description relationships", () => {
  render(<Provider><Dialog.Root defaultOpen><Dialog.Trigger>Open settings</Dialog.Trigger><Dialog.Backdrop /><Dialog.Positioner><Dialog.Content><Dialog.Header><Dialog.Title>Settings</Dialog.Title><Dialog.Description>Configure preferences</Dialog.Description></Dialog.Header><Dialog.Body>Dialog body</Dialog.Body><Dialog.Footer><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Footer></Dialog.Content></Dialog.Positioner></Dialog.Root></Provider>)
  expect(screen.getByRole("dialog")).toBeTruthy()
  expect(screen.getByText("Configure preferences")).toBeTruthy()
  expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBeTruthy()
  expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBeTruthy()
})

test("PasswordInput toggles visibility and exposes password strength semantics", () => {
  const onVisibleChange = vi.fn()
  render(<Provider><PasswordInput aria-label="Password" onVisibleChange={onVisibleChange} /><PasswordStrengthMeter value={passwordStrength("SecurePass123!")} /></Provider>)
  const input = screen.getByLabelText("Password") as HTMLInputElement
  expect(input.type).toBe("password")
  fireEvent.click(screen.getByRole("button", { name: "Show password" }))
  expect(input.type).toBe("text")
  expect(onVisibleChange).toHaveBeenCalledWith(true)
  expect(screen.getByRole("meter", { name: "Password strength" }).getAttribute("aria-valuenow")).toBe("4")
})

test("Label exposes disabled and required states accessibly", () => {
  render(<Provider><Label htmlFor="email" required>Email</Label><input id="email" /></Provider>)
  expect(document.querySelector('label[for="email"]')).toBeTruthy()
  expect(screen.getByText("*").getAttribute("aria-hidden")).toBe("true")
})

test("Badge status variants use semantic status tokens", () => {
  render(<Provider><Badge variant="success">Saved</Badge><Badge variant="warning">Pending</Badge><Badge variant="destructive">Failed</Badge></Provider>)
  const css = Array.from(document.querySelectorAll('style[data-emotion^="indoku"]')).map((node) => node.textContent ?? "").join("\n")
  expect(css).toContain("var(--indoku-colors-status-success)")
  expect(css).toContain("var(--indoku-colors-status-warning)")
  expect(css).toContain("var(--indoku-colors-status-danger)")
})

test("ToggleGroup roves focus with orientation-aware arrow keys", () => {
  render(<Provider><ToggleGroup.Root orientation="horizontal"><ToggleGroup.Item value="left">Left</ToggleGroup.Item><ToggleGroup.Item value="right">Right</ToggleGroup.Item><ToggleGroup.Item value="third" disabled>Disabled</ToggleGroup.Item></ToggleGroup.Root></Provider>)
  const left = screen.getByRole("button", { name: "Left" })
  const right = screen.getByRole("button", { name: "Right" })
  expect(left.tabIndex).toBe(0)
  expect(right.tabIndex).toBe(-1)
  left.focus()
  fireEvent.keyDown(left.parentElement!, { key: "ArrowRight" })
  expect(document.activeElement).toBe(right)
})

test("Progress exposes compound track, range, label, and value text", () => {
  render(<Provider><Progress.Root value={40} label="Upload"><Progress.Label>Upload</Progress.Label><Progress.Track><Progress.Range data-testid="progress-range" /></Progress.Track><Progress.ValueText data-testid="progress-value" /></Progress.Root></Provider>)
  expect(screen.getByRole("progressbar", { name: "Upload" }).getAttribute("aria-valuenow")).toBe("40")
  expect(screen.getByTestId("progress-value").textContent).toBe("40%")
  expect(screen.getByTestId("progress-range").getAttribute("data-state")).toBe("loading")
})

test("Avatar exposes compound slots and switches from fallback to image", () => {
  render(<Provider><Avatar.Root src="avatar.png" name="Ada Lovelace"><Avatar.Image data-testid="avatar-image" /><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root></Provider>)
  const image = screen.getByTestId("avatar-image")
  const fallback = screen.getByText("AL")
  expect(fallback.hasAttribute("hidden")).toBe(false)
  fireEvent.load(image)
  expect(fallback.hasAttribute("hidden")).toBe(true)
  fireEvent.error(image)
  expect(fallback.hasAttribute("hidden")).toBe(false)
})

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

test("Accordion compound API composes trigger, indicator, and content", () => {
  render(<Provider><Accordion.Root defaultValue={["faq"]}><Accordion.Item value="faq"><Accordion.ItemTrigger>Compound question<Accordion.ItemIndicator>⌄</Accordion.ItemIndicator></Accordion.ItemTrigger><Accordion.ItemContent>Compound answer</Accordion.ItemContent></Accordion.Item></Accordion.Root></Provider>)
  expect(screen.getByText("Compound answer")).toBeTruthy()
  expect(screen.getByRole("button", { name: /Compound question/ }).getAttribute("aria-expanded")).toBe("true")
})

test("Accordion supports opening an item", () => {
  render(<Provider><Accordion items={[{ value: "faq", title: "Question", content: "Answer" }]} /></Provider>)
  fireEvent.click(screen.getByRole("button", { name: /Question/ }))
  expect(screen.getByText("Answer")).toBeTruthy()
})

test("ButtonGroup defaults to attached segments and supports vertical orientation", () => {
  const { rerender } = render(<Provider><ButtonGroup aria-label="Formatting"><button>Bold</button><button>Italic</button></ButtonGroup></Provider>)
  const group = screen.getByRole("group", { name: "Formatting" })
  expect(group).toBeTruthy()
  expect(group.getAttribute("class")).toContain("indoku-")
  expect(screen.getByRole("button", { name: "Italic" })).toBeTruthy()
  rerender(<Provider><ButtonGroup aria-label="Vertical actions" orientation="vertical" attached={false}><button>Up</button><button>Down</button></ButtonGroup></Provider>)
  expect(screen.getByRole("group", { name: "Vertical actions" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Down" })).toBeTruthy()
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
