import * as React from "react"
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip"
import { indoku } from "../primitives/indoku"

const TriggerElement = indoku(ArkTooltip.Trigger)
const PositionerElement = indoku(ArkTooltip.Positioner)
const ContentElement = indoku(ArkTooltip.Content)
const ArrowElement = indoku(ArkTooltip.Arrow)
const ArrowTipElement = indoku(ArkTooltip.ArrowTip)

export type TooltipRootProps = React.ComponentProps<typeof ArkTooltip.Root>
export function TooltipRoot(props: TooltipRootProps) { return <ArkTooltip.Root {...props} /> }
export type TooltipTriggerProps = React.ComponentProps<typeof ArkTooltip.Trigger>
export function TooltipTrigger(props: TooltipTriggerProps) { return <TriggerElement type="button" border="1px solid" borderColor="border.subtle" borderRadius="md" px="12px" h="32px" bg="bg.surface" color="fg.default" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type TooltipPositionerProps = React.ComponentProps<typeof ArkTooltip.Positioner>
export function TooltipPositioner(props: TooltipPositionerProps) { return <PositionerElement zIndex={60} {...props} /> }
export type TooltipContentProps = React.ComponentProps<typeof ArkTooltip.Content>
export function TooltipContent(props: TooltipContentProps) { return <ContentElement px="10px" py="6px" borderRadius="md" bg="fg.default" color="bg.surface" fontSize="12px" maxW="240px" boxShadow="md" {...props} /> }
export type TooltipArrowProps = React.ComponentProps<typeof ArkTooltip.Arrow>
export function TooltipArrow(props: TooltipArrowProps) { return <ArrowElement {...props}><ArrowTipElement bg="fg.default" {...props} /></ArrowElement> }

export const Tooltip = Object.assign(TooltipRoot, { Root: TooltipRoot, Trigger: TooltipTrigger, Positioner: TooltipPositioner, Content: TooltipContent, Arrow: TooltipArrow })
