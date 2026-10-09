import * as React from "react"
import { Popover as ArkPopover } from "@ark-ui/react/popover"
import { indoku } from "../primitives/indoku"

const TriggerElement = indoku(ArkPopover.Trigger)
const AnchorElement = indoku(ArkPopover.Anchor)
const PositionerElement = indoku(ArkPopover.Positioner)
const ContentElement = indoku(ArkPopover.Content)
const ArrowElement = indoku(ArkPopover.Arrow)
const ArrowTipElement = indoku(ArkPopover.ArrowTip)
const CloseElement = indoku(ArkPopover.CloseTrigger)

export type PopoverRootProps = React.ComponentProps<typeof ArkPopover.Root>
export function PopoverRoot(props: PopoverRootProps) { return <ArkPopover.Root {...props} /> }
export type PopoverTriggerProps = React.ComponentProps<typeof ArkPopover.Trigger>
export function PopoverTrigger(props: PopoverTriggerProps) { return <TriggerElement type="button" border="1px solid" borderColor="border.subtle" borderRadius="md" px="12px" h="32px" bg="bg.surface" color="fg.default" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type PopoverAnchorProps = React.ComponentProps<typeof ArkPopover.Anchor>
export function PopoverAnchor(props: PopoverAnchorProps) { return <AnchorElement {...props} /> }
export type PopoverPositionerProps = React.ComponentProps<typeof ArkPopover.Positioner>
export function PopoverPositioner(props: PopoverPositionerProps) { return <PositionerElement zIndex={40} {...props} /> }
export type PopoverContentProps = React.ComponentProps<typeof ArkPopover.Content>
export function PopoverContent(props: PopoverContentProps) { return <ContentElement width="280px" maxW="calc(100vw - 24px)" p="16px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" color="fg.default" boxShadow="md" outline="none" _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type PopoverArrowProps = React.ComponentProps<typeof ArkPopover.Arrow>
export function PopoverArrow(props: PopoverArrowProps) { return <ArrowElement {...props}><ArrowTipElement bg="bg.surface" borderColor="border.subtle" {...props} /></ArrowElement> }
export type PopoverCloseTriggerProps = React.ComponentProps<typeof ArkPopover.CloseTrigger>
export function PopoverCloseTrigger(props: PopoverCloseTriggerProps) { return <CloseElement type="button" aria-label="Close popover" position="absolute" top="8px" right="8px" p="4px" borderRadius="sm" color="fg.muted" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }

export const Popover = Object.assign(PopoverRoot, { Root: PopoverRoot, Trigger: PopoverTrigger, Anchor: PopoverAnchor, Positioner: PopoverPositioner, Content: PopoverContent, Arrow: PopoverArrow, CloseTrigger: PopoverCloseTrigger })
