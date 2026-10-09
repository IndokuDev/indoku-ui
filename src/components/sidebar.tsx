import * as React from "react"
import { indoku } from "../primitives/indoku"

interface SidebarContextValue { open: boolean; setOpen(open: boolean): void; mobileOpen: boolean; setMobileOpen(open: boolean): void; toggle(): void }
const SidebarContext = React.createContext<SidebarContextValue | null>(null)
export function useSidebar() { const value = React.useContext(SidebarContext); if (!value) throw new Error("Sidebar parts must be nested inside Sidebar.Provider"); return value }
const Layout = indoku("div"), Aside = indoku("aside"), HeaderElement = indoku("header"), ContentElement = indoku("nav"), FooterElement = indoku("footer"), GroupElement = indoku("section"), GroupLabelElement = indoku("h3"), MenuElement = indoku("ul"), MenuItemElement = indoku("li"), LinkElement = indoku("a"), ButtonElement = indoku("button"), InsetElement = indoku("main")
export interface ProviderProps extends React.HTMLAttributes<HTMLDivElement> { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void; shortcut?: string | false; children?: React.ReactNode }
export function Provider({ defaultOpen = true, open: controlledOpen, onOpenChange, shortcut = "b", children, ...props }: ProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen), open = controlledOpen ?? internalOpen, [mobileOpen, setMobileOpen] = React.useState(false)
  const setOpen = React.useCallback((next: boolean) => { if (controlledOpen === undefined) setInternalOpen(next); onOpenChange?.(next) }, [controlledOpen, onOpenChange])
  const toggle = React.useCallback(() => { setOpen(!open); setMobileOpen((current) => !current) }, [open, setOpen])
  React.useEffect(() => { if (shortcut === false || typeof document === "undefined") return; const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut.toLowerCase()) { event.preventDefault(); toggle() } }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler) }, [shortcut, toggle])
  React.useEffect(() => { if (!mobileOpen || typeof document === "undefined") return; const handler = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false) }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler) }, [mobileOpen])
  const context = React.useMemo(() => ({ open, setOpen, mobileOpen, setMobileOpen, toggle }), [open, setOpen, mobileOpen, toggle])
  return <SidebarContext.Provider value={context}><Layout display="flex" minHeight="100dvh" width="100%" {...props}>{children}</Layout></SidebarContext.Provider>
}
export type RootProps = React.ComponentProps<typeof Aside>
export function Root({ children, ...props }: RootProps) {
  const sidebar = useSidebar()
  return <><Aside data-state={sidebar.open ? "expanded" : "collapsed"} data-mobile-open={sidebar.mobileOpen ? "" : undefined} display="flex" flexDirection="column" flexShrink="0" overflow="hidden" bg="bg.surface" position={{ base: "fixed", md: "sticky" }} top="0" insetInlineStart="0" height="100dvh" zIndex={{ base: 50, md: 10 }} width={{ base: "288px", md: sidebar.open ? "256px" : "0" }} borderInlineEnd={{ base: "1px solid", md: sidebar.open ? "1px solid" : "0" }} borderColor="border.subtle" transform={{ base: sidebar.mobileOpen ? "translateX(0)" : "translateX(-100%)", md: "none" }} visibility={{ base: sidebar.mobileOpen ? "visible" : "hidden", md: sidebar.open ? "visible" : "hidden" }} transition="transform 200ms ease, width 200ms ease, visibility 200ms ease" {...props}>{children}</Aside><ButtonElement type="button" aria-label="Close sidebar" tabIndex={-1} onClick={() => sidebar.setMobileOpen(false)} display={{ base: sidebar.mobileOpen ? "block" : "none", md: "none" }} position="fixed" inset="0" zIndex={40} border="0" style={{ background: "rgba(0,0,0,.4)" }} /></>
}
export function Header(props: React.ComponentProps<typeof HeaderElement>) { return <HeaderElement display="flex" alignItems="center" gap="2" p="3" {...props} /> }
export function Content(props: React.ComponentProps<typeof ContentElement>) { return <ContentElement aria-label="Sidebar" display="flex" flexDirection="column" gap="4" flex="1" minHeight="0" overflowY="auto" p="2" {...props} /> }
export function Footer(props: React.ComponentProps<typeof FooterElement>) { return <FooterElement display="flex" alignItems="center" gap="2" p="3" {...props} /> }
export function Group(props: React.ComponentProps<typeof GroupElement>) { return <GroupElement display="flex" flexDirection="column" gap="1" {...props} /> }
export function GroupLabel(props: React.ComponentProps<typeof GroupLabelElement>) { return <GroupLabelElement margin="0" px="2" py="1.5" fontSize="xs" fontWeight="medium" color="fg.muted" {...props} /> }
export function Menu(props: React.ComponentProps<typeof MenuElement>) { return <MenuElement display="flex" flexDirection="column" gap="2px" margin="0" padding="0" listStyleType="none" {...props} /> }
export function MenuItem(props: React.ComponentProps<typeof MenuItemElement>) { return <MenuItemElement listStyleType="none" {...props} /> }
export interface MenuButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { isActive?: boolean; href?: string }
export function MenuButton({ isActive, href, children, ...props }: MenuButtonProps) {
  const styles = { display: "flex", alignItems: "center", gap: 8, width: "100%", height: 32, paddingInline: 8, borderRadius: 6, fontSize: 14, textAlign: "start" as const, cursor: "pointer", color: "var(--indoku-colors-fg-default)", background: isActive ? "var(--indoku-colors-bg-subtle)" : "transparent", fontWeight: isActive ? 500 : 400, textDecoration: "none", border: 0 }
  return href !== undefined ? <LinkElement href={href} aria-current={isActive ? "page" : undefined} data-active={isActive ? "" : undefined} style={styles} {...props}>{children}</LinkElement> : <ButtonElement type="button" aria-current={isActive ? "page" : undefined} data-active={isActive ? "" : undefined} style={styles} {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}>{children}</ButtonElement>
}
export type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export function Trigger(props: TriggerProps) { const sidebar = useSidebar(); return <ButtonElement type="button" aria-label="Toggle sidebar" aria-expanded={sidebar.open} onClick={sidebar.toggle} display="inline-flex" alignItems="center" justifyContent="center" width="32px" height="32px" borderRadius="md" bg="transparent" color="fg.default" cursor="pointer" _hover={{ bg: "bg.subtle" }} {...props}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg></ButtonElement> }
export function Inset(props: React.ComponentProps<typeof InsetElement>) { return <InsetElement flex="1" minWidth="0" {...props} /> }
export const Sidebar = Object.assign(Provider, { Provider, Root, Header, Content, Footer, Group, GroupLabel, Menu, MenuItem, MenuButton, Trigger, Inset })
