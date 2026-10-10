/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  Attachment,
  Button,
  CodeBlock,
  Command,
  DataTable,
  Empty,
  Item,
  PasswordInput,
  PasswordStrengthMeter,
  Provider,
  Questionnaire,
  QrCode,
  Resizable,
  RichTextEditor,
  ScrollArea,
  Sidebar,
  Toggle,
  ToggleGroup,
  commandScore,
  passwordStrength,
  sanitizeHtml,
  tokenizeLines,
  type DataTableColumn,
} from "../src/index"

afterEach(() => cleanup())

function wrap(ui: React.ReactNode) {
  return render(<Provider>{ui}</Provider>)
}

describe("Command (metode ui-old/test)", () => {
  it("filters items and calls onSelect through keyboard navigation", () => {
    const picked: string[] = []
    wrap(<Command.Root><Command.Input placeholder="Search..." /><Command.List><Command.Empty>No results found.</Command.Empty><Command.Group heading="Fruits"><Command.Item value="Apple" onSelect={(v) => picked.push(v)}>Apple</Command.Item><Command.Item value="Banana" onSelect={(v) => picked.push(v)}>Banana</Command.Item></Command.Group></Command.List></Command.Root>)
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "ban" } })
    expect(screen.queryByText("Apple")).toBeNull()
    expect(screen.getByText("Banana")).toBeTruthy()
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "" } })
    const input = screen.getByPlaceholderText("Search...")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(picked).toEqual(["Banana"])
  })

  it("scores exact, prefix, substring and subsequence matches", () => {
    expect(commandScore("settings", "settings")).toBe(1)
    expect(commandScore("settings", "set")).toBeGreaterThan(0.5)
    expect(commandScore("settings", "ting")).toBeGreaterThan(0)
    expect(commandScore("settings", "stg")).toBeGreaterThan(0)
    expect(commandScore("settings", "xyz")).toBe(0)
  })
})

describe("DataTable", () => {
  type Row = { id: string; name: string; amount: number }
  const data: Row[] = [{ id: "1", name: "Charlie", amount: 30 }, { id: "2", name: "Alice", amount: 10 }, { id: "3", name: "Bob", amount: 20 }]
  const columns: DataTableColumn<Row>[] = [{ id: "name", header: "Name", sortable: true }, { id: "amount", header: "Amount", sortable: true }]

  it("renders, filters and sorts rows", () => {
    wrap(<DataTable.Root data={data} columns={columns} getRowId={(r) => r.id}><DataTable.Toolbar><DataTable.Search /></DataTable.Toolbar><DataTable.Table /><DataTable.Pagination /></DataTable.Root>)
    expect(screen.getByText("Charlie")).toBeTruthy()
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "ali" } })
    expect(screen.queryByText("Charlie")).toBeNull()
    expect(screen.getByText("Alice")).toBeTruthy()
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "" } })
    fireEvent.click(screen.getByRole("button", { name: /Name/ }))
    const rows = screen.getAllByRole("row").slice(1)
    expect(within(rows[0]!).getByText("Alice")).toBeTruthy()
  })

  it("supports select-all and clears selection", () => {
    let selected: Row[] = []
    wrap(<DataTable.Root data={data} columns={columns} getRowId={(r) => r.id} selectable onSelectionChange={(rows) => { selected = rows }}><DataTable.Table /></DataTable.Root>)
    const selectAll = screen.getAllByRole("checkbox")[0]!
    fireEvent.click(selectAll)
    expect(selected).toHaveLength(3)
    fireEvent.click(selectAll)
    expect(selected).toHaveLength(0)
  })
})

describe("Toggle, ToggleGroup, Sidebar and Item", () => {
  it("toggles pressed state and supports single/multiple groups", () => {
    wrap(<><Toggle aria-label="Bold">B</Toggle><ToggleGroup.Root type="single" defaultValue={["center"]}><ToggleGroup.Item value="left">Left</ToggleGroup.Item><ToggleGroup.Item value="center">Center</ToggleGroup.Item></ToggleGroup.Root><ToggleGroup.Root type="multiple"><ToggleGroup.Item value="italic">Italic</ToggleGroup.Item><ToggleGroup.Item value="underline">Underline</ToggleGroup.Item></ToggleGroup.Root></>)
    const bold = screen.getByRole("button", { name: "Bold" })
    fireEvent.click(bold)
    expect(bold.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(screen.getByText("Left"))
    expect(screen.getByText("Left").getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(screen.getByText("Italic"))
    fireEvent.click(screen.getByText("Underline"))
    expect(screen.getByText("Italic").getAttribute("aria-pressed")).toBe("true")
    expect(screen.getByText("Underline").getAttribute("aria-pressed")).toBe("true")
  })

  it("sidebar trigger changes aria-expanded and Item renders content", () => {
    wrap(<><Sidebar.Provider defaultOpen><Sidebar.Root><Sidebar.Content><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton href="#">Home</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></Sidebar.Content></Sidebar.Root><Sidebar.Inset><Sidebar.Trigger /></Sidebar.Inset></Sidebar.Provider><Item.Root><Item.Content><Item.Title>Hello</Item.Title><Item.Description>World</Item.Description></Item.Content></Item.Root></>)
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(screen.getByText("Hello")).toBeTruthy()
    expect(screen.getByText("World")).toBeTruthy()
  })
})

describe("PasswordInput, CodeBlock and RichTextEditor", () => {
  it("toggles password visibility and calculates strength", () => {
    wrap(<><PasswordInput placeholder="pw" /><PasswordStrengthMeter value={3} /></>)
    const input = screen.getByPlaceholderText("pw")
    expect(input.getAttribute("type")).toBe("password")
    fireEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(input.getAttribute("type")).toBe("text")
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("3")
    expect(passwordStrength("")).toBe(0)
    expect(passwordStrength("abc")).toBe(1)
    expect(passwordStrength("abc123")).toBe(2)
    expect(passwordStrength("Abcdef12")).toBe(3)
    expect(passwordStrength("Abcdefgh1234!")).toBe(4)
  })

  it("tokenizes code and renders a copyable code block", () => {
    const [line] = tokenizeLines('const a = "x" // hi', "ts")
    const types = Object.fromEntries(line.map((token) => [token.value, token.type]))
    expect(types.const).toBe("keyword")
    expect(types['"x"']).toBe("string")
    expect(types["// hi"]).toBe("comment")
    wrap(<CodeBlock.Root code={"a\nb\nc"} language="ts" title="x.ts" showLineNumbers />)
    expect(screen.getByText("x.ts")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
  })

  it("sanitizes unsafe HTML and emits editor changes", () => {
    const clean = sanitizeHtml('<p onclick="x()">hi<script>alert(1)</script><a href="javascript:alert(1)">link</a></p>')
    expect(clean).not.toContain("script")
    expect(clean).not.toContain("onclick")
    expect(clean).not.toContain("javascript:")
    const onChange = vi.fn()
    wrap(<RichTextEditor.Basic defaultValue="<p>hello</p>" onChange={onChange} />)
    const editor = document.querySelector("[contenteditable=\"true\"]") as HTMLElement
    expect(editor.innerHTML).toBe("<p>hello</p>")
    editor.innerHTML = "<p>updated</p>"
    fireEvent.input(editor)
    expect(onChange).toHaveBeenCalledWith("<p>updated</p>")
  })
})

describe("QR, Resizable and Questionnaire", () => {
  it("renders accessible QR SVG and overlay", () => {
    wrap(<QrCode.Root value="https://indoku.id" level="H"><QrCode.Frame /><QrCode.Overlay>logo</QrCode.Overlay></QrCode.Root>)
    expect(screen.getByRole("img", { name: "QR code" })).toBeTruthy()
    expect(screen.getByText("logo")).toBeTruthy()
  })

  it("updates resizable panel sizes using keyboard controls", () => {
    const onLayout = vi.fn()
    wrap(<Resizable.Root direction="horizontal" onLayout={onLayout}><Resizable.Panel defaultSize={40} minSize={20}>A</Resizable.Panel><Resizable.Handle withHandle /><Resizable.Panel defaultSize={60} minSize={20}>B</Resizable.Panel></Resizable.Root>)
    const handle = screen.getByRole("separator", { name: "Resize panels" })
    handle.focus()
    fireEvent.keyDown(handle, { key: "ArrowRight" })
    expect(handle).toBeTruthy()
    expect(onLayout).toHaveBeenCalled()
  })

  it("validates required answers and submits the selected response", () => {
    const onSubmit = vi.fn()
    wrap(<Questionnaire.Root onSubmit={onSubmit} items={[{ name: "goal", prompt: "Main goal?", required: true, choices: [{ value: "speed", label: "Speed" }, { value: "quality", label: "Quality" }] }]} />)
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    expect(screen.getByRole("alert").textContent).toContain("Choose an answer")
    fireEvent.click(screen.getByText("Quality"))
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    expect(onSubmit).toHaveBeenCalledWith({ goal: { choices: ["quality"], text: "" } })
  })
})

describe("Empty, ScrollArea, Attachment and Button", () => {
  it("renders empty state, scrollable content and attachment metadata", () => {
    wrap(<><Empty.Root><Empty.Header><Empty.Title>No Projects Yet</Empty.Title><Empty.Description>Start creating.</Empty.Description></Empty.Header></Empty.Root><ScrollArea.Root h="20" orientation="both"><p>scroll content</p></ScrollArea.Root><Attachment.Group><Attachment.Root orientation="vertical"><Attachment.Media kind="code" /><Attachment.Content><Attachment.Name>app.tsx</Attachment.Name><Attachment.Meta format="TSX" size={12000} /><Attachment.Status status="uploading" progress={64} variant="text" /></Attachment.Content><Attachment.Remove /></Attachment.Root></Attachment.Group><Button>Click me</Button></>)
    expect(screen.getByText("No Projects Yet")).toBeTruthy()
    expect(screen.getByText("Start creating.")).toBeTruthy()
    expect(screen.getByText("TSX · 11.7 KB")).toBeTruthy()
    expect(screen.getByText("Uploading · 64%")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy()
  })
})
