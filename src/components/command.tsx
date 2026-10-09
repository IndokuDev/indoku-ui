import * as React from "react"
import { Dialog as DialogUI } from "./dialog"
import { indoku } from "../primitives/indoku"

export function commandScore(text: string, query: string, keywords: string[] = []): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return 1
  const targets = [text, ...keywords].map((value) => value.toLowerCase())
  let total = 0
  for (const term of terms) {
    let best = 0
    for (const target of targets) {
      if (target === term) best = Math.max(best, 1)
      else if (target.startsWith(term)) best = Math.max(best, 0.9)
      else { const at = target.indexOf(term); if (at > 0) best = Math.max(best, /[\s\-_/.]/.test(target[at - 1]!) ? 0.8 : 0.7); else { let cursor = 0, found = true; for (const char of term) { const index = target.indexOf(char, cursor); if (index < 0) { found = false; break }; cursor = index + 1 }; if (found) best = Math.max(best, 0.1 + 0.3 * term.length / Math.max(1, target.length)) } }
    }
    if (!best) return 0
    total += best
  }
  return total / terms.length
}
export interface RootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onKeyDown"> { shouldFilter?: boolean; search?: string; onSearchChange?: (search: string) => void; loop?: boolean }
interface ItemMeta { value: string; keywords: string[]; group: string | null }
interface CommandContextValue { search: string; setSearch(value: string): void; selected: string | null; setSelected(value: string | null): void; register(id: string, meta: ItemMeta): () => void; isVisible(id: string): boolean; isGroupVisible(id: string): boolean; visibleCount: number; registeredCount: number; listId: string }
const CommandContext = React.createContext<CommandContextValue | null>(null), GroupContext = React.createContext<string | null>(null)
function useCommand() { const value = React.useContext(CommandContext); if (!value) throw new Error("Command parts must be nested inside Command.Root"); return value }
const RootElement = indoku("div"), InputElement = indoku("input"), ListElement = indoku("ul"), EmptyElement = indoku("li"), GroupElement = indoku("li"), GroupTitle = indoku("span"), ItemElement = indoku("li"), SeparatorElement = indoku("li"), ShortcutElement = indoku("kbd")
export function Root({ shouldFilter = true, search: controlledSearch, onSearchChange, loop = true, children, ...props }: RootProps) {
  const [internalSearch, setInternalSearch] = React.useState(""), search = controlledSearch ?? internalSearch
  const setSearch = React.useCallback((value: string) => { if (controlledSearch === undefined) setInternalSearch(value); onSearchChange?.(value) }, [controlledSearch, onSearchChange])
  const [items, setItems] = React.useState<Record<string, ItemMeta>>({}), [selected, setSelected] = React.useState<string | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null), listId = React.useId()
  const register = React.useCallback((id: string, meta: ItemMeta) => { setItems((current) => ({ ...current, [id]: meta })); return () => setItems((current) => { const next = { ...current }; delete next[id]; return next }) }, [])
  const visible = React.useMemo(() => new Set(Object.entries(items).filter(([, meta]) => !shouldFilter || commandScore(meta.value, search, meta.keywords) > 0).map(([id]) => id)), [items, search, shouldFilter])
  const visibleGroups = React.useMemo(() => new Set(Object.entries(items).filter(([id, meta]) => visible.has(id) && meta.group).map(([, meta]) => meta.group!)), [items, visible])
  const isVisible = React.useCallback((id: string) => !(id in items) || visible.has(id), [items, visible])
  const isGroupVisible = React.useCallback((id: string) => !Object.values(items).some((meta) => meta.group === id) || visibleGroups.has(id), [items, visibleGroups])
  const getItems = React.useCallback(() => Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-command-item]:not([data-disabled])") ?? []), [])
  React.useEffect(() => { setSelected(getItems()[0]?.id ?? null) }, [search, getItems])
  React.useEffect(() => { const enabled = getItems(); if (!enabled.some((element) => element.id === selected)) setSelected(enabled[0]?.id ?? null) }, [visible, selected, getItems])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = getItems(); if (!enabled.length) return
    const index = enabled.findIndex((element) => element.id === selected)
    const move = (next: number) => { event.preventDefault(); const element = enabled[next]!; setSelected(element.id); element.scrollIntoView?.({ block: "nearest" }) }
    if (event.key === "ArrowDown") move(index + 1 >= enabled.length ? (loop ? 0 : enabled.length - 1) : Math.max(0, index + 1))
    else if (event.key === "ArrowUp") move(index <= 0 ? (loop ? enabled.length - 1 : 0) : index - 1)
    else if (event.key === "Home") move(0)
    else if (event.key === "End") move(enabled.length - 1)
    else if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); enabled[index]?.click() }
  }
  const context = React.useMemo(() => ({ search, setSearch, selected, setSelected, register, isVisible, isGroupVisible, visibleCount: visible.size, registeredCount: Object.keys(items).length, listId }), [search, setSearch, selected, register, isVisible, isGroupVisible, visible.size, items, listId])
  return <CommandContext.Provider value={context}><RootElement ref={rootRef} onKeyDown={handleKeyDown} display="flex" flexDirection="column" overflow="hidden" border="1px solid" borderColor="border.subtle" borderRadius="xl" bg="bg.surface" color="fg.default" {...props}>{children}</RootElement></CommandContext.Provider>
}
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {}
export function Input(props: InputProps) { const command = useCommand(); return <InputElement type="text" role="combobox" aria-expanded="true" aria-controls={command.listId} aria-activedescendant={command.selected ?? undefined} aria-autocomplete="list" autoComplete="off" autoCorrect="off" spellCheck={false} value={command.search} onChange={(event: React.ChangeEvent<HTMLInputElement>) => command.setSearch(event.target.value)} h="44px" px="16px" fontSize="sm" bg="transparent" borderBottom="1px solid" borderColor="border.subtle" outline="none" {...props} /> }
export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {}
export function List(props: ListProps) { const command = useCommand(); return <ListElement id={command.listId} role="listbox" maxHeight="288px" overflowY="auto" m="0" p="4px" listStyleType="none" {...props} /> }
export interface EmptyProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export function Empty({ children = "No results found.", ...props }: EmptyProps) { const command = useCommand(); if (command.registeredCount === 0 || command.visibleCount > 0) return null; return <EmptyElement role="presentation" py="24px" textAlign="center" fontSize="sm" color="fg.muted" listStyleType="none" {...props}>{children}</EmptyElement> }
export interface GroupProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> { heading?: React.ReactNode }
export function Group({ heading, children, ...props }: GroupProps) { const command = useCommand(), id = React.useId(), headingId = `${id}-heading`; return <GroupContext.Provider value={id}><GroupElement role="presentation" hidden={!command.isGroupVisible(id)} listStyleType="none" {...props}>{heading && <GroupTitle id={headingId} display="block" px="8px" py="6px" fontSize="xs" fontWeight="medium" color="fg.muted">{heading}</GroupTitle>}<ul role="group" aria-labelledby={heading ? headingId : undefined} style={{ margin: 0, padding: 0, listStyle: "none" }}>{children}</ul></GroupElement></GroupContext.Provider> }
export interface ItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onSelect" | "value"> { value?: string; keywords?: string[]; disabled?: boolean; onSelect?: (value: string) => void }
export function Item({ value: givenValue, keywords = [], disabled, onSelect, children, onPointerMove, onClick, ...props }: ItemProps) { const command = useCommand(), group = React.useContext(GroupContext), id = React.useId(), value = givenValue ?? (typeof children === "string" ? children : ""); React.useEffect(() => command.register(id, { value, keywords, group }), [command.register, id, value, keywords.join("\u0000"), group]); if (!command.isVisible(id)) return null; const active = command.selected === id; return <ItemElement id={id} role="option" aria-selected={active} aria-disabled={disabled || undefined} data-command-item="" data-selected={active ? "" : undefined} data-disabled={disabled ? "" : undefined} onPointerMove={(event: React.PointerEvent<HTMLLIElement>) => { onPointerMove?.(event); if (!disabled) command.setSelected(id) }} onClick={(event: React.MouseEvent<HTMLLIElement>) => { onClick?.(event); if (!disabled) onSelect?.(value) }} display="flex" alignItems="center" gap="8px" px="8px" py="6px" borderRadius="md" fontSize="sm" cursor="default" userSelect="none" listStyleType="none" bg={active ? "bg.subtle" : "transparent"} opacity={disabled ? 0.5 : 1} {...props}>{children}</ItemElement> }
export interface SeparatorProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export function Separator(props: SeparatorProps) { return <SeparatorElement role="separator" h="1px" my="4px" mx="-4px" bg="border.subtle" listStyleType="none" {...props} /> }
export interface ShortcutProps extends React.HTMLAttributes<HTMLElement> {}
export function Shortcut(props: ShortcutProps) { return <ShortcutElement marginInlineStart="auto" fontFamily="inherit" fontSize="xs" letterSpacing="wide" color="fg.muted" {...props} /> }
export interface DialogProps extends RootProps { open: boolean; onOpenChange: (open: boolean) => void; hotkey?: string; title?: string }
export function CommandDialog({ open, onOpenChange, hotkey, title = "Command palette", children, ...props }: DialogProps) { React.useEffect(() => { if (!hotkey || typeof document === "undefined") return; const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) { event.preventDefault(); onOpenChange(!open) } }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler) }, [hotkey, open, onOpenChange]); return <DialogUI.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}><DialogUI.Backdrop /><DialogUI.Positioner style={{ alignItems: "flex-start", paddingTop: "10vh" }}><DialogUI.Content style={{ padding: 0 }}><DialogUI.Title style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{title}</DialogUI.Title><Root {...props}>{children}</Root></DialogUI.Content></DialogUI.Positioner></DialogUI.Root> }
export const Command = Object.assign(Root, { Root, Input, List, Empty, Group, Item, Separator, Shortcut, Dialog: CommandDialog })
