import * as React from "react"
import { AlignCenter, AlignLeft, AlignRight, Bold as BoldIcon, Code, Heading1, Heading2, Heading3, Italic as ItalicIcon, Link as LinkIcon, List, ListOrdered, Minus, Redo2, Strikethrough, Underline as UnderlineIcon, Undo2, Quote } from "lucide-react"
import { indoku } from "../primitives/indoku"
import { Button } from "./button"

const BLOCKED = "script,style,iframe,object,embed,link,meta,base,form"
export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === "undefined") return html
  const documentValue = new DOMParser().parseFromString(html, "text/html")
  documentValue.body.querySelectorAll(BLOCKED).forEach((element) => element.remove())
  documentValue.body.querySelectorAll("*").forEach((element) => { for (const attribute of Array.from(element.attributes)) { const name = attribute.name.toLowerCase(); const value = attribute.value.trim().toLowerCase(); if (name.startsWith("on") || ((name === "href" || name === "src" || name === "xlink:href") && /^(javascript|data:text\/html|vbscript):/.test(value))) element.removeAttribute(attribute.name) } })
  return documentValue.body.innerHTML
}
interface EditorContextValue { editable: boolean; contentRef: React.RefObject<HTMLDivElement | null>; tick: number; run: (command: string, argument?: string) => void; isOn: (command: string) => boolean; block: () => string; emit: () => void }
const EditorContext = React.createContext<EditorContextValue | null>(null)
function useEditor() { const context = React.useContext(EditorContext); if (!context) throw new Error("RichTextEditor parts must be used inside RichTextEditor.Root"); return context }
const RootElement = indoku("div")
const ToolbarElement = indoku("div")
const GroupElement = indoku("div")
const ContentElement = indoku("div")
export interface RichTextEditorRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> { value?: string; defaultValue?: string; onChange?: (html: string) => void; placeholder?: string; editable?: boolean; sanitize?: boolean }
export function RichTextEditorRoot({ value, defaultValue = "", onChange, editable = true, sanitize = true, children, ...props }: RichTextEditorRootProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [tick, setTick] = React.useState(0)
  const clean = React.useCallback((html: string) => sanitize ? sanitizeHtml(html) : html, [sanitize])
  React.useEffect(() => { const element = contentRef.current; if (!element) return; const next = clean(value ?? defaultValue); if (value !== undefined ? element.innerHTML !== next : element.innerHTML === "" && next) element.innerHTML = next }, [value, defaultValue, clean])
  React.useEffect(() => { const onSelection = () => { const element = contentRef.current; const selection = document.getSelection(); if (element && selection?.anchorNode && element.contains(selection.anchorNode)) setTick((current) => current + 1) }; document.addEventListener("selectionchange", onSelection); return () => document.removeEventListener("selectionchange", onSelection) }, [])
  const emit = React.useCallback(() => { const element = contentRef.current; if (!element) return; if (element.innerHTML === "<br>") element.innerHTML = ""; const html = clean(element.innerHTML); if (element.innerHTML !== html) element.innerHTML = html; onChange?.(html); setTick((current) => current + 1) }, [clean, onChange])
  const run = React.useCallback((command: string, argument?: string) => { const element = contentRef.current; if (!element || !editable) return; element.focus(); if (typeof document.execCommand === "function") document.execCommand(command, false, argument); emit() }, [editable, emit])
  const isOn = (command: string) => { try { return typeof document.queryCommandState === "function" && document.queryCommandState(command) } catch { return false } }
  const block = () => { try { return typeof document.queryCommandValue === "function" ? String(document.queryCommandValue("formatBlock")).toLowerCase().replace(/[<>]/g, "") : "" } catch { return "" } }
  const context = React.useMemo(() => ({ editable, contentRef, tick, run, isOn, block, emit }), [editable, tick, run, emit])
  return <EditorContext.Provider value={context}><RootElement display="flex" flexDirection="column" overflow="hidden" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" {...props}>{children}</RootElement></EditorContext.Provider>
}
export type RichTextEditorToolbarProps = React.HTMLAttributes<HTMLDivElement>
export function RichTextEditorToolbar(props: RichTextEditorToolbarProps) { return <ToolbarElement role="toolbar" aria-label="Formatting" display="flex" flexWrap="wrap" alignItems="center" gap="4px" p="6px" borderBottom="1px solid" borderColor="border.subtle" bg="bg.subtle" {...props} /> }
export type RichTextEditorControlGroupProps = React.HTMLAttributes<HTMLDivElement>
export function RichTextEditorControlGroup(props: RichTextEditorControlGroupProps) { return <GroupElement role="group" display="flex" alignItems="center" gap="2px" px="6px" borderInlineEnd="1px solid" borderColor="border.subtle" {...props} /> }
export interface RichTextEditorControlProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> { label: string; active?: boolean; onRun: () => void }
export function RichTextEditorControl({ label, active, onRun, children, ...props }: RichTextEditorControlProps) { const { editable } = useEditor(); return <Button type="button" variant={active ? "subtle" : "ghost"} size="sm" aria-label={label} aria-pressed={active} disabled={!editable} onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()} onClick={onRun} {...props}>{children}</Button> }
function Command({ command, label, children }: { command: string; label: string; children: React.ReactNode }) { const { run, isOn, tick } = useEditor(); void tick; return <RichTextEditorControl label={label} active={isOn(command)} onRun={() => run(command)}>{children}</RichTextEditorControl> }
export function Bold() { return <Command command="bold" label="Bold"><BoldIcon size={14} /></Command> }
export function Italic() { return <Command command="italic" label="Italic"><ItalicIcon size={14} /></Command> }
export function Underline() { return <Command command="underline" label="Underline"><UnderlineIcon size={14} /></Command> }
export function StrikethroughControl() { return <Command command="strikeThrough" label="Strikethrough"><Strikethrough size={14} /></Command> }
function Block({ tag, label, children }: { tag: string; label: string; children: React.ReactNode }) { const { run, block, tick } = useEditor(); void tick; return <RichTextEditorControl label={label} active={block() === tag} onRun={() => run("formatBlock", tag)}>{children}</RichTextEditorControl> }
export function H1() { return <Block tag="h1" label="Heading 1"><Heading1 size={14} /></Block> }
export function H2() { return <Block tag="h2" label="Heading 2"><Heading2 size={14} /></Block> }
export function H3() { return <Block tag="h3" label="Heading 3"><Heading3 size={14} /></Block> }
export function Blockquote() { return <Block tag="blockquote" label="Quote"><Quote size={14} /></Block> }
export function BulletList() { return <Command command="insertUnorderedList" label="Bullet list"><List size={14} /></Command> }
export function OrderedList() { return <Command command="insertOrderedList" label="Numbered list"><ListOrdered size={14} /></Command> }
export function AlignLeftControl() { return <Command command="justifyLeft" label="Align left"><AlignLeft size={14} /></Command> }
export function AlignCenterControl() { return <Command command="justifyCenter" label="Align center"><AlignCenter size={14} /></Command> }
export function AlignRightControl() { return <Command command="justifyRight" label="Align right"><AlignRight size={14} /></Command> }
export function CodeControl() { return <Command command="formatBlock" label="Code block"><Code size={14} /></Command> }
export function LinkControl() { const { run } = useEditor(); return <RichTextEditorControl label="Insert link" onRun={() => { const url = window.prompt("Link URL"); if (url && !/^(javascript|data|vbscript):/i.test(url.trim())) run("createLink", url) }}><LinkIcon size={14} /></RichTextEditorControl> }
export function HorizontalRule() { return <Command command="insertHorizontalRule" label="Divider"><Minus size={14} /></Command> }
export function Undo() { return <Command command="undo" label="Undo"><Undo2 size={14} /></Command> }
export function Redo() { return <Command command="redo" label="Redo"><Redo2 size={14} /></Command> }
export interface RichTextEditorContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onInput"> { placeholder?: string; onInput?: React.FormEventHandler<HTMLDivElement> }
export function RichTextEditorContent({ placeholder, onInput, onPaste, ...props }: RichTextEditorContentProps) { const { contentRef, editable, emit } = useEditor(); return <ContentElement ref={contentRef} contentEditable={editable} suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder={placeholder} onInput={(event: React.FormEvent<HTMLDivElement>) => { onInput?.(event); emit() }} onPaste={(event: React.ClipboardEvent<HTMLDivElement>) => { onPaste?.(event); if (event.defaultPrevented || !event.clipboardData) return; if (event.clipboardData.getData("text/html")) { event.preventDefault(); const html = sanitizeHtml(event.clipboardData.getData("text/html")); if (document.queryCommandSupported?.("insertHTML")) document.execCommand("insertHTML", false, html); else document.execCommand("insertText", false, event.clipboardData.getData("text/plain")); emit() } }} minH="140px" p="12px" outline="none" fontSize="14px" lineHeight={1.5} css={{ "&:empty::before": { content: "attr(data-placeholder)", color: "var(--indoku-colors-fg-muted)", pointerEvents: "none" }, "& p": { marginBlock: "0.5em" }, "&:focus-visible": { outline: "2px solid var(--indoku-colors-accent-default)", outlineOffset: "-2px" } }} {...props} /> }
export function Basic(props: RichTextEditorRootProps) { return <RichTextEditorRoot {...props}><RichTextEditorToolbar><RichTextEditorControlGroup><Bold /><Italic /><Underline /><StrikethroughControl /></RichTextEditorControlGroup><RichTextEditorControlGroup><H1 /><H2 /><H3 /><Blockquote /></RichTextEditorControlGroup><RichTextEditorControlGroup><BulletList /><OrderedList /><LinkControl /></RichTextEditorControlGroup><RichTextEditorControlGroup><Undo /><Redo /></RichTextEditorControlGroup></RichTextEditorToolbar><RichTextEditorContent placeholder={props.placeholder} /></RichTextEditorRoot> }
export const RichTextEditor = Object.assign(RichTextEditorRoot, { Root: RichTextEditorRoot, Toolbar: RichTextEditorToolbar, ControlGroup: RichTextEditorControlGroup, Control: RichTextEditorControl, Bold, Italic, Underline, Strikethrough: StrikethroughControl, H1, H2, H3, Blockquote, BulletList, OrderedList, AlignLeft: AlignLeftControl, AlignCenter: AlignCenterControl, AlignRight: AlignRightControl, Code: CodeControl, Link: LinkControl, Hr: HorizontalRule, Undo, Redo, Content: RichTextEditorContent, Basic })
