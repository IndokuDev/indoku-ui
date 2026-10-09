import * as React from "react"
/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Accordion, AspectRatio, Attachment, Avatar, Badge, Bubble, ButtonGroup, Card, CardContent, Calendar, Carousel, Checkbox, CodeBlock, ColorSwatch, DataList, DateInputField, DatePickerField, Dialog, Direction, Empty, Field, Flash, Form, InputOTP, Item, Kbd, KbdGroup, Label, Marker, Menu, Menubar, Message, MessageScroller, NavigationMenu, PasswordInput, Questionnaire, MathRenderer, PasswordStrengthMeter, passwordStrength, Pagination, Popover, Prose, FormulaBlock, QrCode, useQrMatrix, RichTextEditor, sanitizeHtml, Progress, Provider, Tooltip, useForm, RadioGroup, Resizable, ScrollArea, Skeleton, Stat, Status, Switch, Textarea, Time, Toaster, toast, Toggle, ToggleGroup, FileTree, Graph2D, Plot2D, Plot3D, PeriodicTable, ModelLab, LineChart, BarChart, Histogram, BarSegment, ScatterChart, RadarChart, RangeBarChart, CandlestickChart, Command, commandScore, DataTable, Sidebar, PieChart, Sparkline, niceDomain, sortChartData } from "./index"

afterEach(() => cleanup())

test("Bubble and Message compose chat surfaces, metadata, and controlled details", () => {
  function Harness() {
    const [open, setOpen] = React.useState(false)
    return <><Message.Group align="end" header={<span>Me · 12:00</span>}><Bubble.Root align="end"><Bubble.Content>Hello there</Bubble.Content><Bubble.Footer><Bubble.Action aria-label="React">+</Bubble.Action></Bubble.Footer></Bubble.Root></Message.Group><Bubble.Collapsible open={open} label="Show details" onOpenChange={setOpen}>Internal details</Bubble.Collapsible></>
  }
  render(<Provider><Harness /></Provider>)
  expect(screen.getByText("Hello there")).toBeTruthy()
  expect(screen.getByText("Me · 12:00")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Show details" }))
  expect(screen.getByRole("button", { name: "Show details" }).getAttribute("aria-expanded")).toBe("true")
  expect(screen.getByText("Internal details")).toBeTruthy()
})

test("QrCode renders an accessible SVG and supports the raw matrix hook", () => {
  render(<Provider><QrCode.Root value="https://indoku.dev" label="Indoku QR"><QrCode.Frame data-testid="qr-frame" /><QrCode.Overlay><span>Logo</span></QrCode.Overlay></QrCode.Root></Provider>)
  expect(screen.getByRole("img", { name: "Indoku QR" })).toBeTruthy()
  expect(screen.getByTestId("qr-frame").querySelector("path")?.getAttribute("d")).toBeTruthy()
  function MatrixSize() { const matrix = useQrMatrix("hello"); return <span data-testid="matrix-size">{matrix.size}</span> }
  render(<Provider><MatrixSize /></Provider>)
  expect(Number(screen.getByTestId("matrix-size").textContent)).toBeGreaterThanOrEqual(21)
})

test("Prose and Math components provide styled content and safe LaTeX fallback", () => {
  render(<Provider><Prose><h2>Article</h2><p>Rich <strong>content</strong>.</p><blockquote>Quoted text</blockquote></Prose><MathRenderer latex="x^2 + y^2" /><FormulaBlock latex="a^2+b^2=c^2" title="Pythagorean theorem" variables={[{ symbol: "a", meaning: "First side" }]} /></Provider>)
  expect(screen.getByRole("heading", { name: "Article" })).toBeTruthy()
  expect(screen.getByText("Quoted text")).toBeTruthy()
  expect(screen.getByText("x^2 + y^2")).toBeTruthy()
  expect(screen.getByText("Pythagorean theorem")).toBeTruthy()
})

test("MessageScroller preserves scroll context and offers jump-to-latest", () => {
  render(<Provider><MessageScroller.Root><div style={{ height: 800 }}>History</div><MessageScroller.ScrollToBottomButton /></MessageScroller.Root></Provider>)
  const viewport = document.querySelector<HTMLElement>("[data-message-viewport]")!
  Object.defineProperty(viewport, "scrollHeight", { configurable: true, value: 800 })
  Object.defineProperty(viewport, "clientHeight", { configurable: true, value: 200 })
  Object.defineProperty(viewport, "scrollTop", { configurable: true, writable: true, value: 0 })
  Object.defineProperty(viewport, "scrollTo", { configurable: true, value: (options: ScrollToOptions | number) => { viewport.scrollTop = typeof options === "number" ? options : options.top ?? 0 } })
  fireEvent.scroll(viewport)
  const jump = screen.getByRole("button", { name: "New messages" })
  fireEvent.click(jump)
  expect(viewport.scrollTop).toBe(800)
  expect(screen.queryByRole("button", { name: "New messages" })).toBeNull()
})

test("Questionnaire validates required choices and supports letter shortcuts", () => {
  const onSubmit = vi.fn()
  render(<Provider><Questionnaire.Root items={[{ name: "goal", prompt: "Primary goal?", required: true, choices: [{ value: "speed", label: "Speed" }, { value: "quality", label: "Quality" }] }]} onSubmit={onSubmit} /></Provider>)
  fireEvent.click(screen.getByRole("button", { name: "Submit" }))
  expect(screen.getByRole("alert").textContent).toContain("Choose an answer")
  fireEvent.keyDown(screen.getByRole("button", { name: "Submit" }), { key: "b" })
  fireEvent.click(screen.getByRole("button", { name: "Submit" }))
  expect(onSubmit).toHaveBeenCalledWith({ goal: { choices: ["quality"], text: "" } })
})

test("RichTextEditor sanitizes unsafe HTML and exposes a composable toolbar", () => {
  const clean = sanitizeHtml('<p onclick="evil()">Safe <a href="javascript:alert(1)">link</a><script>alert(1)</script></p>')
  expect(clean).not.toContain("onclick")
  expect(clean).not.toContain("javascript:")
  expect(clean).not.toContain("<script")
  render(<Provider><RichTextEditor.Root defaultValue="<p>Existing note</p>"><RichTextEditor.Toolbar><RichTextEditor.ControlGroup><RichTextEditor.Bold /><RichTextEditor.Italic /></RichTextEditor.ControlGroup></RichTextEditor.Toolbar><RichTextEditor.Content placeholder="Write a note" /></RichTextEditor.Root></Provider>)
  expect(screen.getByRole("textbox").innerHTML).toContain("Existing note")
  expect(screen.getByRole("button", { name: "Bold" }).getAttribute("title")).toBeNull()
})

test("Resizable panels update sizes with accessible keyboard handles", () => {
  const onLayout = vi.fn()
  render(<Provider><Resizable.PanelGroup direction="horizontal" onLayout={onLayout}><Resizable.Panel defaultSize={50} minSize={20}><span>Left panel</span></Resizable.Panel><Resizable.Handle withHandle /><Resizable.Panel defaultSize={50} minSize={20}><span>Right panel</span></Resizable.Panel></Resizable.PanelGroup></Provider>)
  const handle = screen.getByRole("separator", { name: "Resize panels" })
  fireEvent.keyDown(handle, { key: "ArrowRight" })
  expect(screen.getByText("Left panel").parentElement?.getAttribute("data-size")).toBe("55")
  expect(screen.getByText("Right panel").parentElement?.getAttribute("data-size")).toBe("45")
  expect(onLayout).toHaveBeenCalledWith([55, 45])
})

test("ScrollArea compound API composes viewport, content, scrollbar, and thumb", () => {
  render(<Provider><ScrollArea.Root orientation="vertical" style={{ height: 120 }}><ScrollArea.Viewport aria-label="Scrollable content"><ScrollArea.Content><div style={{ height: 400 }}>Long content</div></ScrollArea.Content></ScrollArea.Viewport><ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar><ScrollArea.Corner /></ScrollArea.Root></Provider>)
  expect(screen.getByLabelText("Scrollable content")).toBeTruthy()
  expect(screen.getByText("Long content")).toBeTruthy()
})

test("Direction.Root sets the DOM direction", () => {
  render(<Provider><Direction.Root dir="rtl"><span>Arabic content</span></Direction.Root></Provider>)
  expect(screen.getByText("Arabic content").parentElement?.getAttribute("dir")).toBe("rtl")
})

test("Marker exports separator, semantic status, row, and typing patterns", () => {
  render(<Provider><Marker.Separator>Today</Marker.Separator><Marker.Status tone="success">Connected</Marker.Status><Marker.Row>Tool running</Marker.Row><Marker.TypingIndicator /></Provider>)
  expect(screen.getByText("Today")).toBeTruthy()
  expect(screen.getByText("Connected")).toBeTruthy()
  expect(screen.getByText("Tool running")).toBeTruthy()
  expect(screen.getByRole("status", { name: "Typing" })).toBeTruthy()
})

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

test("Menubar moves focus between top-level menus with arrow keys", () => {
  render(<Provider><Menubar.Root><Menubar.MenuItem label="File"><Menubar.Item value="new">New</Menubar.Item></Menubar.MenuItem><Menubar.MenuItem label="Edit"><Menubar.Item value="copy">Copy</Menubar.Item></Menubar.MenuItem></Menubar.Root></Provider>)
  const file = screen.getByRole("menuitem", { name: "File" })
  const edit = screen.getByRole("menuitem", { name: "Edit" })
  file.focus()
  fireEvent.keyDown(file, { key: "ArrowRight" })
  expect(document.activeElement).toBe(edit)
})

test("NavigationMenu compound API exposes navigable triggers and links", () => {
  render(<Provider><NavigationMenu.Root defaultValue="products"><NavigationMenu.List><NavigationMenu.Item value="products"><NavigationMenu.Trigger>Products</NavigationMenu.Trigger><NavigationMenu.Content><NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link></NavigationMenu.Content></NavigationMenu.Item></NavigationMenu.List><NavigationMenu.ViewportPositioner><NavigationMenu.Viewport /></NavigationMenu.ViewportPositioner></NavigationMenu.Root></Provider>)
  expect(screen.getByRole("button", { name: "Products" })).toBeTruthy()
  expect(screen.getByRole("link", { name: "Documentation" })).toBeTruthy()
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

test("Attachment compound API formats metadata and supports keyboard activation", () => {
  const onClick = vi.fn()
  render(<Provider><Attachment.Root onClick={onClick}><Attachment.Media kind="code" /><Attachment.Content><Attachment.Name>app.tsx</Attachment.Name><Attachment.Meta size={12000} format="TSX" /><Attachment.Status status="uploading" progress={64} variant="text" /></Attachment.Content><Attachment.Actions><Attachment.Remove /></Attachment.Actions></Attachment.Root></Provider>)
  expect(screen.getByText("TSX · 11.7 KB")).toBeTruthy()
  expect(screen.getByText("Uploading · 64%")).toBeTruthy()
  fireEvent.keyDown(screen.getByRole("button", { name: /app.tsx/ }), { key: "Enter" })
  expect(onClick).toHaveBeenCalledOnce()
})

test("Flash renders inline status messaging without a floating toast region", () => {
  render(<Provider><Flash type="success">Profile saved</Flash><Flash type="error" icon={false}>Could not save</Flash></Provider>)
  expect(screen.getByRole("status").textContent).toContain("Profile saved")
  expect(screen.getByRole("alert").textContent).toContain("Could not save")
  expect(screen.queryByRole("region", { name: /Notifications/ })).toBeNull()
})

test("Time formats valid dates and preserves semantic datetime", () => {
  render(<Provider><Time value="2026-10-09T12:00:00.000Z" options={{ dateStyle: "short", timeZone: "UTC" }}>Today</Time><Time value="invalid-date" data-testid="invalid-time" /></Provider>)
  expect(screen.getByText("Today").closest("time")?.getAttribute("datetime")).toBe("2026-10-09T12:00:00.000Z")
  expect(screen.getByTestId("invalid-time").getAttribute("datetime")).toBeNull()
})

test("Toast API renders semantic notifications and supports dismissal", async () => {
  render(<Provider><Toaster /></Provider>)
  toast.success("Saved successfully", { description: "Your changes are live", duration: 5000, closable: true })
  await waitFor(() => expect(screen.getByText("Saved successfully")).toBeTruthy())
  expect(screen.getByText("Your changes are live")).toBeTruthy()
  toast.remove()
})

test("Date field adapters accept ISO values without exposing date-library objects", () => {
  render(<Provider><DatePickerField label="Birthday" value={["2026-10-09"]} onValueChange={() => {}} /><DateInputField label="Appointment" defaultValue={["2026-10-10"]} /></Provider>)
  expect(screen.getByText("Birthday")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Open calendar" })).toBeTruthy()
  expect(screen.getByText("Appointment")).toBeTruthy()
})

test("Calendar DayTable renders week headers and selectable date cells", () => {
  render(<Provider><Calendar.Root open><Calendar.Positioner><Calendar.Content><Calendar.View view="day"><Calendar.ViewControl><Calendar.PrevTrigger>Previous</Calendar.PrevTrigger><Calendar.RangeText /><Calendar.NextTrigger>Next</Calendar.NextTrigger></Calendar.ViewControl><Calendar.DayTable /></Calendar.View></Calendar.Content></Calendar.Positioner></Calendar.Root></Provider>)
  expect(screen.getByRole("grid")).toBeTruthy()
  expect(screen.getAllByRole("columnheader").length).toBe(7)
  expect(screen.getAllByRole("button").length).toBeGreaterThan(20)
})

test("Calendar compound API exposes labeled segmented input and trigger", () => {
  render(<Provider><Calendar.Root><Calendar.Label>Choose date</Calendar.Label><Calendar.Control><Calendar.Input /><Calendar.Trigger>Open calendar</Calendar.Trigger></Calendar.Control></Calendar.Root></Provider>)
  expect(screen.getByText("Choose date")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Open calendar" })).toBeTruthy()
})

test("InputOTP filters input, exposes slots, and calls onComplete", () => {
  const onComplete = vi.fn()
  render(<Provider><InputOTP.Root maxLength={4} onComplete={onComplete}><InputOTP.Group>{[0, 1, 2, 3].map((index) => <InputOTP.Slot key={index} index={index} />)}</InputOTP.Group></InputOTP.Root></Provider>)
  const input = screen.getByRole("textbox") as HTMLInputElement
  fireEvent.change(input, { target: { value: "12a34" } })
  expect(input.value).toBe("1234")
  expect(onComplete).toHaveBeenCalledWith("1234")
  expect(screen.getAllByText(/[1-4]/)).toHaveLength(4)
})

test("useForm validates, tracks fields, submits, and resets", async () => {
  const onSubmit = vi.fn()
  function Harness() {
    const form = useForm({ defaultValues: { email: "" }, validators: { email: (value) => value.includes("@") ? undefined : "Invalid email" }, onSubmit })
    return <Form onSubmit={form.handleSubmit}><Field meta={form.getFieldMeta("email")} label="Email" required><input {...form.getInputProps("email")} /></Field><button type="submit">Save</button><button type="button" onClick={() => form.reset()}>Reset</button></Form>
  }
  render(<Provider><Harness /></Provider>)
  fireEvent.click(screen.getByRole("button", { name: "Save" }))
  expect(screen.getByRole("alert").textContent).toBe("Invalid email")
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "a@example.com" } })
  fireEvent.click(screen.getByRole("button", { name: "Save" }))
  expect(onSubmit).toHaveBeenCalledWith({ email: "a@example.com" })
  fireEvent.click(screen.getByRole("button", { name: "Reset" }))
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("")
})

test("Pagination compound API renders page navigation and current page state", () => {
  render(<Provider><Pagination.Root count={100} pageSize={10} defaultPage={2}><Pagination.Content><Pagination.Previous /><Pagination.Pages /><Pagination.Next /></Pagination.Content><Pagination.PageText data-testid="page-text" /></Pagination.Root></Provider>)
  expect(screen.getByRole("button", { name: "Previous page" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Next page" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "page 2" }).getAttribute("aria-current")).toBe("page")
  expect(screen.getByTestId("page-text").textContent).toContain("Page 2 of 10")
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

test("ColorSwatch compound API shares color values with its label and swatch", () => {
  render(<Provider><ColorSwatch.Root value="#ff0000" checkerboard><ColorSwatch.Swatch /><ColorSwatch.Label>Brand red</ColorSwatch.Label><ColorSwatch.ValueText /></ColorSwatch.Root></Provider>)
  expect(screen.getByRole("img", { name: "Color #ff0000" })).toBeTruthy()
  expect(screen.getByText("Brand red")).toBeTruthy()
  expect(screen.getByText("#ff0000")).toBeTruthy()
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

test("FileTree renders nested nodes and expands folders with accessible tree semantics", () => {
  render(<Provider><FileTree label="Project files" items={[{ id: "src", name: "src", children: [{ id: "app", name: "app.tsx" }] }, { id: "package", name: "package.json" }]} defaultExpandedValue={[]} /></Provider>)
  expect(screen.getByRole("tree", { name: "Project files" })).toBeTruthy()
  const folder = screen.getByText("src")
  expect(folder).toBeTruthy()
  fireEvent.click(folder)
  expect(screen.getByText("app.tsx")).toBeTruthy()
  expect(screen.getByText("package.json")).toBeTruthy()
})

test("Graph2D plots functions and points with a labelled legend", () => {
  render(<Provider><Graph2D functions={[{ fn: (x) => x * x, label: "y = x²", color: "accent" }]} points={[{ x: 1, y: 1, label: "P" }]} interactive={false} /></Provider>)
  expect(screen.getByRole("img", { name: "Cartesian graph" })).toBeTruthy()
  expect(screen.getByText("y = x²")).toBeTruthy()
  expect(screen.getByText("P")).toBeTruthy()
  expect(document.querySelector("svg path")?.getAttribute("d")).toContain("M")
})

test("Plot2D renders structural scene primitives and semantic scene colors", () => {
  const scene = { kind: "2d" as const, title: "Motion plot", bounds: { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }, duration: 0, frame: () => [{ t: "line" as const, pts: [[-1, -1] as [number, number], [1, 1] as [number, number]], color: "accent" }, { t: "point" as const, x: 1, y: 1, label: "Object" }], stats: () => [{ label: "Speed", value: 3, unit: "m/s" }] }
  render(<Provider><Plot2D scene={scene} /></Provider>)
  expect(screen.getByRole("img", { name: "Motion plot" })).toBeTruthy()
  expect(screen.getByText("Object")).toBeTruthy()
  expect(screen.getByText("Speed")).toBeTruthy()
  expect(document.querySelector("svg path")?.getAttribute("d")).toContain("M")
})

test("Plot3D exposes an accessible canvas and camera controls", () => {
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
  const scene = { kind: "3d" as const, title: "Molecule", duration: 0, radius: 2, frame: () => [{ t: "sphere" as const, pos: [0, 0, 0] as [number, number, number], r: 0.5, label: "Atom" }] }
  render(<Provider><Plot3D scene={scene} /></Provider>)
  expect(screen.getByRole("img", { name: "Molecule" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Zoom in" })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Reset view" }))
  getContext.mockRestore()
})

test("PeriodicTable selects elements and announces the selected element details", () => {
  const onSelect = vi.fn()
  const elements = [
    { number: 1, symbol: "H", name: "Hydrogen", mass: 1.008, period: 1, group: 1, category: "nonmetal" },
    { number: 2, symbol: "He", name: "Helium", mass: 4.0026, period: 1, group: 18, category: "noble-gas" },
  ]
  render(<Provider><PeriodicTable elements={elements} onSelect={onSelect} /></Provider>)
  fireEvent.click(screen.getByRole("button", { name: "Helium, atomic number 2" }))
  expect(onSelect).toHaveBeenCalledWith(elements[1])
  expect(screen.getByText("Helium")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Helium, atomic number 2" }).getAttribute("aria-pressed")).toBe("true")
})

test("ModelLab builds a catalog model and updates scene parameters", () => {
  const catalog = {
    list: () => [{ id: "line", title: "Linear motion", category: "physics", description: "A simple model", params: [{ key: "speed", label: "Speed", type: "number" as const, default: 2, min: 0, max: 10 }] }],
    build: (_id: string, params: Record<string, number | string | boolean> = {}) => ({ kind: "2d" as const, title: "Model output", bounds: { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }, duration: 0, frame: () => [{ t: "line" as const, pts: [[0, 0] as [number, number], [Number(params.speed ?? 2), 1] as [number, number],], color: "accent" }] }),
  }
  render(<Provider><ModelLab catalog={catalog} /></Provider>)
  expect(screen.getByRole("img", { name: "Model output" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Reset parameters" })).toBeTruthy()
  expect(screen.getByLabelText("Speed")).toBeTruthy()
})

test("Chart primitives render accessible SVGs and expose stable data helpers", () => {
  render(<Provider><LineChart series={[{ name: "Revenue", values: [1, 3, 2], color: "accent" }]} categories={["Jan", "Feb", "Mar"]} legend /><BarChart series={[{ name: "Count", values: [2, 4] }]} categories={["A", "B"]} /><Histogram values={[1, 2, 2, 3, 4]} bins={3} /><BarSegment data={[{ name: "A", value: 2 }, { name: "B", value: 3 }]} /><ScatterChart series={[{ name: "Points", points: [{ x: 1, y: 2 }, { x: 2, y: 3 }] }]} trendLine legend /><RadarChart axes={["A", "B", "C"]} series={[{ name: "Radar", values: [2, 4, 3] }]} legend /><RangeBarChart data={[{ label: "Task", min: 2, max: 5 }]} /><CandlestickChart data={[{ label: "Day 1", open: 2, high: 5, low: 1, close: 4 }]} /><PieChart data={[{ name: "A", value: 2 }, { name: "B", value: 3 }]} legend /><Sparkline values={[1, 2, 1, 4]} area /></Provider>)
  expect(screen.getByRole("img", { name: "Line chart" })).toBeTruthy()
  expect(screen.getAllByRole("img", { name: "Bar chart" }).length).toBeGreaterThanOrEqual(2)
  expect(screen.getByRole("img", { name: "Pie chart" })).toBeTruthy()
  expect(screen.getByRole("img", { name: "Scatter chart" })).toBeTruthy()
  expect(screen.getByRole("img", { name: "Radar chart" })).toBeTruthy()
  expect(screen.getByRole("img", { name: "Range bar chart" })).toBeTruthy()
  expect(screen.getByRole("img", { name: "Candlestick chart" })).toBeTruthy()
  expect(screen.getByRole("img", { name: /A 2, B 3/ })).toBeTruthy()
  expect(screen.getByRole("img", { name: /Sparkline:/ })).toBeTruthy()
  expect(niceDomain(0, 10).domain[0]).toBe(0)
  expect(sortChartData([{ n: 1 }, { n: 3 }], (item) => item.n)[0]?.n).toBe(3)
})

test("Command filters by text and keywords and supports keyboard selection", async () => {
  const onSelect = vi.fn()
  render(<Provider><Command.Root><Command.Input placeholder="Search commands" /><Command.List><Command.Empty>No matches</Command.Empty><Command.Group heading="Actions"><Command.Item value="Open file" keywords={["document"]} onSelect={onSelect}>Open file</Command.Item><Command.Item value="Close window" onSelect={onSelect}>Close window</Command.Item></Command.Group></Command.List></Command.Root></Provider>)
  const input = screen.getByRole("combobox")
  fireEvent.change(input, { target: { value: "doc" } })
  await waitFor(() => expect(screen.getByText("Open file")).toBeTruthy())
  expect(screen.queryByText("Close window")).toBeNull()
  fireEvent.keyDown(input, { key: "Enter" })
  expect(onSelect).toHaveBeenCalledWith("Open file")
  expect(commandScore("Open file", "open")).toBeGreaterThan(0)
})

test("DataTable composes search, sortable columns, row selection, and pagination", async () => {
  const onSelectionChange = vi.fn()
  const data = [{ id: "a", name: "Ada", score: 3 }, { id: "b", name: "Bo", score: 1 }, { id: "c", name: "Cy", score: 2 }]
  const columns = [{ id: "name", header: "Name", accessor: "name" as const, sortable: true }, { id: "score", header: "Score", accessor: "score" as const, sortable: true }]
  render(<Provider><DataTable.Root data={data} columns={columns} pageSize={2} selectable getRowId={(row) => row.id} onSelectionChange={onSelectionChange}><DataTable.Toolbar><DataTable.Search /><DataTable.ColumnToggle /></DataTable.Toolbar><DataTable.Table /><DataTable.Pagination /></DataTable.Root></Provider>)
  expect(screen.getByText("Ada")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: /Score/ }))
  await waitFor(() => expect(screen.getAllByRole("row")[1]?.textContent).toContain("Bo"))
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Cy" } })
  await waitFor(() => expect(screen.getByText("Cy")).toBeTruthy())
  expect(screen.queryByText("Ada")).toBeNull()
})

test("Sidebar provider shares controlled layout state with its trigger", () => {
  render(<Provider><Sidebar.Provider defaultOpen><Sidebar.Root><Sidebar.Header>Workspace</Sidebar.Header><Sidebar.Content><Sidebar.Group><Sidebar.GroupLabel>Projects</Sidebar.GroupLabel><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton href="/alpha" isActive>Alpha</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></Sidebar.Group></Sidebar.Content></Sidebar.Root><Sidebar.Inset><Sidebar.Trigger /><main>Page content</main></Sidebar.Inset></Sidebar.Provider></Provider>)
  expect(screen.getByRole("complementary").getAttribute("data-state")).toBe("expanded")
  expect(screen.getByRole("link", { name: "Alpha" }).getAttribute("aria-current")).toBe("page")
  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }))
  expect(screen.getByRole("button", { name: "Toggle sidebar" }).getAttribute("aria-expanded")).toBe("false")
})

test("Checkbox exposes the indeterminate state through native form semantics", () => {
  render(<Provider><Checkbox indeterminate>Some selected</Checkbox></Provider>)
  const input = document.querySelector<HTMLInputElement>('input[type="checkbox"]')!
  expect(input.indeterminate).toBe(true)
  expect(input.getAttribute("aria-checked")).toBe("mixed")
})

test("Avatar fallback honors delay and appears immediately after image failure", async () => {
  render(<Provider><Avatar.Root src="/avatar.png" name="Ada"><Avatar.Image data-testid="avatar-image" /><Avatar.Fallback delayMs={1000}>AD</Avatar.Fallback></Avatar.Root></Provider>)
  expect(screen.getByText("AD").hasAttribute("hidden")).toBe(true)
  fireEvent.error(screen.getByTestId("avatar-image"))
  await waitFor(() => expect(screen.getByText("AD").hasAttribute("hidden")).toBe(false))
})
