import * as React from "react"
import { ChevronRight } from "lucide-react"
import { indoku } from "../primitives/indoku"

export type BubbleAlign = "start" | "end"
export type BubbleVariant = "solid" | "subtle" | "outline"
interface BubbleContextValue { align: BubbleAlign; variant: BubbleVariant }
const BubbleContext = React.createContext<BubbleContextValue>({ align: "start", variant: "subtle" })
const RootElement = indoku("div")
const ContentElement = indoku("div")
const FooterElement = indoku("div")
const ActionElement = indoku("button")
const CollapsibleRoot = indoku("div")
const CollapsibleTrigger = indoku("button")
const CollapsibleContent = indoku("div")
export interface BubbleRootProps extends React.HTMLAttributes<HTMLDivElement> { align?: BubbleAlign; variant?: BubbleVariant }
export function BubbleRoot({ align = "start", variant = "subtle", children, ...props }: BubbleRootProps) {
  const style = variant === "outline" ? { border: "1px solid", borderColor: "border.subtle", bg: "transparent", color: "fg.default" } : align === "end" && variant === "solid" ? { bg: "fg.default", color: "bg.surface" } : variant === "solid" ? { bg: "bg.subtle", color: "fg.default" } : { bg: align === "end" ? "accent.default" : "bg.subtle", color: align === "end" ? "primary.foreground" : "fg.default" }
  return <BubbleContext.Provider value={{ align, variant }}><RootElement position="relative" display="inline-flex" flexDirection="column" maxW="100%" borderRadius="xl" borderEndEndRadius={align === "end" ? "sm" : undefined} borderStartStartRadius={align === "start" ? "sm" : undefined} {...style} {...props}>{children}</RootElement></BubbleContext.Provider>
}
export type BubbleContentProps = React.HTMLAttributes<HTMLDivElement>
export function BubbleContent(props: BubbleContentProps) { return <ContentElement px="14px" py="10px" fontSize="14px" lineHeight={1.5} css={{ "& p": { margin: 0 }, "& p + p": { marginTop: "0.5em" } }} {...props} /> }
export type BubbleFooterProps = React.HTMLAttributes<HTMLDivElement>
export function BubbleFooter(props: BubbleFooterProps) { const { align } = React.useContext(BubbleContext); return <FooterElement position="absolute" bottom="0" transform="translateY(50%)" zIndex={1} display="flex" alignItems="center" gap="4px" bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="full" boxShadow="sm" px="6px" py="4px" {...(align === "end" ? { insetInlineStart: "12px" } : { insetInlineEnd: "12px" })} {...props} /> }
export interface BubbleActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { "aria-label": string }
export function BubbleAction(props: BubbleActionProps) { return <ActionElement type="button" display="inline-flex" alignItems="center" justifyContent="center" w="20px" h="20px" fontSize="12px" borderRadius="full" color="fg.muted" cursor="pointer" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export interface BubbleCollapsibleProps extends React.HTMLAttributes<HTMLDivElement> { open: boolean; label: React.ReactNode; onOpenChange: (open: boolean) => void }
export function BubbleCollapsible({ open, label, onOpenChange, children, ...props }: BubbleCollapsibleProps) { return <CollapsibleRoot {...props}><CollapsibleTrigger type="button" onClick={() => onOpenChange(!open)} aria-expanded={open} display="inline-flex" alignItems="center" gap="6px" fontSize="12px" color="fg.muted" cursor="pointer" _hover={{ color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }}><ChevronRight size={12} aria-hidden="true" style={{ transform: open ? "rotate(90deg)" : undefined, transition: "transform 150ms" }} />{label}</CollapsibleTrigger>{open && <CollapsibleContent mt="8px" pl="16px" borderInlineStart="1px solid var(--indoku-colors-border-subtle)" fontSize="12px" color="fg.muted">{children}</CollapsibleContent>}</CollapsibleRoot> }
export const Bubble = Object.assign(BubbleRoot, { Root: BubbleRoot, Content: BubbleContent, Footer: BubbleFooter, Action: BubbleAction, Collapsible: BubbleCollapsible })
