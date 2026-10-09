import * as React from "react"
import { ArrowDown } from "lucide-react"
import { indoku } from "../primitives/indoku"

interface MessageScrollerContextValue { isAtBottom: boolean; scrollToBottom: (behavior?: ScrollBehavior) => void; scrollToTop: (behavior?: ScrollBehavior) => void }
const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null)
export function useMessageScroller() { const context = React.useContext(MessageScrollerContext); if (!context) throw new Error("MessageScroller subcomponents must be used inside MessageScroller.Root"); return context }
export interface MessageScrollerRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> { children?: React.ReactNode; threshold?: number; watch?: unknown[] }
const RootElement = indoku("div")
const ViewportElement = indoku("div")
const JumpButton = indoku("button")
export function MessageScrollerRoot({ children, threshold = 80, watch = [], ...props }: MessageScrollerRootProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const stickToBottom = React.useRef(true)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const checkPosition = React.useCallback(() => { const element = viewportRef.current; if (!element) return; const distance = element.scrollHeight - element.scrollTop - element.clientHeight; const atBottom = distance <= threshold; stickToBottom.current = atBottom; setIsAtBottom(atBottom) }, [threshold])
  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => { const element = viewportRef.current; if (!element) return; if (typeof element.scrollTo === "function") { try { element.scrollTo({ top: element.scrollHeight, behavior }) } catch { element.scrollTop = element.scrollHeight } } else element.scrollTop = element.scrollHeight; stickToBottom.current = true; setIsAtBottom(true) }, [])
  const scrollToTop = React.useCallback((behavior: ScrollBehavior = "smooth") => { const element = viewportRef.current; if (!element) return; if (typeof element.scrollTo === "function") { try { element.scrollTo({ top: 0, behavior }) } catch { element.scrollTop = 0 } } else element.scrollTop = 0 }, [])
  React.useEffect(() => { if (stickToBottom.current) scrollToBottom("auto") }, watch as React.DependencyList)
  React.useEffect(() => { checkPosition() }, [checkPosition])
  const context = React.useMemo(() => ({ isAtBottom, scrollToBottom, scrollToTop }), [isAtBottom, scrollToBottom, scrollToTop])
  return <MessageScrollerContext.Provider value={context}><RootElement position="relative" minH="0" {...props}><ViewportElement ref={viewportRef} onScroll={checkPosition} h="100%" overflowY="auto" display="flex" flexDirection="column" data-message-viewport="">{children}</ViewportElement></RootElement></MessageScrollerContext.Provider>
}
export type ScrollToBottomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export function ScrollToBottomButton({ children, ...props }: ScrollToBottomButtonProps) { const { isAtBottom, scrollToBottom } = useMessageScroller(); if (isAtBottom) return null; return <JumpButton type="button" onClick={() => scrollToBottom()} position="absolute" bottom="16px" left="50%" transform="translateX(-50%)" display="inline-flex" alignItems="center" gap="6px" h="32px" px="12px" borderRadius="full" fontSize="12px" fontWeight="medium" bg="bg.surface" color="fg.default" border="1px solid" borderColor="border.subtle" boxShadow="md" cursor="pointer" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props}><ArrowDown size={12} aria-hidden="true" />{children ?? "New messages"}</JumpButton> }
export const MessageScroller = Object.assign(MessageScrollerRoot, { Root: MessageScrollerRoot, ScrollToBottomButton })
