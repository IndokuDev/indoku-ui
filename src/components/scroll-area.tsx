import * as React from "react"
import { ScrollArea as ArkScrollArea } from "@ark-ui/react/scroll-area"
import { indoku } from "../primitives/indoku"

const ViewportElement = indoku(ArkScrollArea.Viewport)
const ContentElement = indoku(ArkScrollArea.Content)
const ScrollbarElement = indoku(ArkScrollArea.Scrollbar)
const ThumbElement = indoku(ArkScrollArea.Thumb)
const CornerElement = indoku(ArkScrollArea.Corner)

export type ScrollAreaRootProps = React.ComponentProps<typeof ArkScrollArea.Root> & { orientation?: "vertical" | "horizontal" | "both" }
export function ScrollAreaRoot({ orientation = "vertical", style, ...props }: ScrollAreaRootProps) {
  return <ArkScrollArea.Root {...props} data-orientation={orientation} style={{ position: "relative", overflow: "hidden", ...style }} />
}
export type ScrollAreaViewportProps = React.ComponentProps<typeof ArkScrollArea.Viewport>
export function ScrollAreaViewport(props: ScrollAreaViewportProps) { return <ViewportElement width="100%" height="100%" overflowX="auto" overflowY="auto" outline="none" _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }} {...props} /> }
export type ScrollAreaContentProps = React.ComponentProps<typeof ArkScrollArea.Content>
export function ScrollAreaContent(props: ScrollAreaContentProps) { return <ContentElement minW="100%" {...props} /> }
export type ScrollAreaScrollbarProps = React.ComponentProps<typeof ArkScrollArea.Scrollbar>
export function ScrollAreaScrollbar({ orientation = "vertical", ...props }: ScrollAreaScrollbarProps) { return <ScrollbarElement orientation={orientation} position="absolute" display="flex" userSelect="none" touchAction="none" p="2px" bg="transparent" data-orientation={orientation} {...(orientation === "vertical" ? { top: 0, right: 0, bottom: 0, width: "10px", flexDirection: "column" } : { left: 0, right: 0, bottom: 0, height: "10px", flexDirection: "row" })} {...props}><ScrollAreaThumb /></ScrollbarElement> }
export type ScrollAreaThumbProps = React.ComponentProps<typeof ArkScrollArea.Thumb>
export function ScrollAreaThumb(props: ScrollAreaThumbProps) { return <ThumbElement flex="1" borderRadius="full" bg="border.default" _hover={{ bg: "fg.muted" }} {...props} /> }
export type ScrollAreaCornerProps = React.ComponentProps<typeof ArkScrollArea.Corner>
export function ScrollAreaCorner(props: ScrollAreaCornerProps) { return <CornerElement position="absolute" right="0" bottom="0" width="10px" height="10px" bg="bg.surface" {...props} /> }
export const ScrollArea = Object.assign(ScrollAreaRoot, { Root: ScrollAreaRoot, Viewport: ScrollAreaViewport, Content: ScrollAreaContent, Scrollbar: ScrollAreaScrollbar, Thumb: ScrollAreaThumb, Corner: ScrollAreaCorner })
