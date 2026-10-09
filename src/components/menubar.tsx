import * as React from "react"
import { useId } from "react"
import { indoku } from "../primitives/indoku"
import { Menu } from "./menu"

interface MenubarContextValue { openId: string | null; setOpenId: (id: string | null) => void; order: string[]; register: (id: string) => () => void }
const MenubarContext = React.createContext<MenubarContextValue | null>(null)
function useMenubar() { const context = React.useContext(MenubarContext); if (!context) throw new Error("Menubar.MenuItem must be used inside Menubar.Root"); return context }
const RootElement = indoku("div")
export interface MenubarRootProps extends React.HTMLAttributes<HTMLDivElement> {}
export function MenubarRoot({ children, ...props }: MenubarRootProps) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const order = React.useRef<string[]>([]).current
  const register = React.useCallback((id: string) => { if (!order.includes(id)) order.push(id); return () => { const index = order.indexOf(id); if (index >= 0) order.splice(index, 1) } }, [order])
  return <MenubarContext.Provider value={{ openId, setOpenId, order, register }}><RootElement role="menubar" display="inline-flex" alignItems="center" gap="4px" p="4px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" {...props}>{children}</RootElement></MenubarContext.Provider>
}
export interface MenubarMenuProps { label: React.ReactNode; children: React.ReactNode; disabled?: boolean }
export function MenubarMenuItem({ label, children, disabled = false }: MenubarMenuProps) {
  const id = useId()
  const context = useMenubar()
  const isOpen = context.openId === id
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => context.register(id), [context.register, id])
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const index = context.order.indexOf(id)
    if (index < 0 || !context.order.length) return
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % context.order.length : (index - 1 + context.order.length) % context.order.length
    const nextId = context.order[nextIndex]
    if (!nextId) return
    context.setOpenId(nextId)
    document.querySelector<HTMLButtonElement>(`[data-menubar-trigger="${nextId}"]`)?.focus()
  }
  return <Menu.Root open={isOpen} onOpenChange={(details) => context.setOpenId(details.open ? id : null)} onSelect={() => context.setOpenId(null)}><Menu.Trigger asChild disabled={disabled}><button ref={triggerRef} type="button" role="menuitem" disabled={disabled} data-menubar-trigger={id} onPointerEnter={() => { if (context.openId && context.openId !== id) context.setOpenId(id) }} onKeyDown={onKeyDown} style={{ height: 32, paddingInline: 12, border: 0, borderRadius: 4, background: isOpen ? "var(--indoku-colors-bg-subtle)" : "transparent", color: "var(--indoku-colors-fg-default)", fontSize: 14, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>{label}</button></Menu.Trigger><Menu.Positioner><Menu.Content style={{ minWidth: 192 }}>{children}</Menu.Content></Menu.Positioner></Menu.Root>
}
export const Menubar = Object.assign(MenubarRoot, { Root: MenubarRoot, MenuItem: MenubarMenuItem, Menu: MenubarMenuItem, Item: Menu.Item, CheckboxItem: Menu.CheckboxItem, RadioItemGroup: Menu.RadioItemGroup, RadioItem: Menu.RadioItem, ItemGroup: Menu.ItemGroup, ItemGroupLabel: Menu.ItemGroupLabel, Separator: Menu.Separator, ItemCommand: Menu.ItemText, ItemIndicator: Menu.ItemIndicator })
