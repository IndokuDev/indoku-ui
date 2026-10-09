import * as React from "react"
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/react/navigation-menu"
import { indoku } from "../primitives/indoku"

const ListElement = indoku(ArkNavigationMenu.List)
const ItemElement = indoku(ArkNavigationMenu.Item)
const TriggerElement = indoku(ArkNavigationMenu.Trigger)
const ContentElement = indoku(ArkNavigationMenu.Content)
const LinkElement = indoku(ArkNavigationMenu.Link)
const IndicatorElement = indoku(ArkNavigationMenu.Indicator)
const ItemIndicatorElement = indoku(ArkNavigationMenu.ItemIndicator)
const ViewportElement = indoku(ArkNavigationMenu.Viewport)
const ViewportPositionerElement = indoku(ArkNavigationMenu.ViewportPositioner)
const ArrowElement = indoku(ArkNavigationMenu.Arrow)

export type NavigationMenuRootProps = React.ComponentProps<typeof ArkNavigationMenu.Root>
export function NavigationMenuRoot(props: NavigationMenuRootProps) { return <ArkNavigationMenu.Root {...props} /> }
export type NavigationMenuListProps = React.ComponentProps<typeof ArkNavigationMenu.List>
export function NavigationMenuList(props: NavigationMenuListProps) { return <ListElement display="flex" alignItems="center" gap="4px" listStyle="none" m="0" p="0" {...props} /> }
export type NavigationMenuItemProps = React.ComponentProps<typeof ArkNavigationMenu.Item>
export function NavigationMenuItem(props: NavigationMenuItemProps) { return <ItemElement position="relative" {...props} /> }
export type NavigationMenuTriggerProps = React.ComponentProps<typeof ArkNavigationMenu.Trigger>
export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) { return <TriggerElement type="button" display="inline-flex" alignItems="center" gap="6px" px="12px" h="36px" borderRadius="md" color="fg.default" fontSize="14px" _hover={{ bg: "bg.subtle" }} _open={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type NavigationMenuContentProps = React.ComponentProps<typeof ArkNavigationMenu.Content>
export function NavigationMenuContent(props: NavigationMenuContentProps) { return <ContentElement p="16px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" boxShadow="lg" minW="240px" {...props} /> }
export type NavigationMenuLinkProps = React.ComponentProps<typeof ArkNavigationMenu.Link>
export function NavigationMenuLink(props: NavigationMenuLinkProps) { return <LinkElement display="block" px="10px" py="8px" borderRadius="md" color="fg.default" fontSize="14px" textDecoration="none" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" }} {...props} /> }
export type NavigationMenuIndicatorProps = React.ComponentProps<typeof ArkNavigationMenu.Indicator>
export function NavigationMenuIndicator(props: NavigationMenuIndicatorProps) { return <IndicatorElement position="absolute" bottom="-4px" height="2px" bg="accent.default" transition="transform 150ms ease" {...props} /> }
export type NavigationMenuItemIndicatorProps = React.ComponentProps<typeof ArkNavigationMenu.ItemIndicator>
export function NavigationMenuItemIndicator(props: NavigationMenuItemIndicatorProps) { return <ItemIndicatorElement color="fg.muted" {...props} /> }
export type NavigationMenuViewportProps = React.ComponentProps<typeof ArkNavigationMenu.Viewport>
export function NavigationMenuViewport(props: NavigationMenuViewportProps) { return <ViewportElement position="relative" mt="8px" minW="280px" overflow="hidden" borderRadius="lg" {...props} /> }
export type NavigationMenuViewportPositionerProps = React.ComponentProps<typeof ArkNavigationMenu.ViewportPositioner>
export function NavigationMenuViewportPositioner(props: NavigationMenuViewportPositionerProps) { return <ViewportPositionerElement position="absolute" top="100%" left="0" zIndex={40} {...props} /> }
export type NavigationMenuArrowProps = React.ComponentProps<typeof ArkNavigationMenu.Arrow>
export function NavigationMenuArrow(props: NavigationMenuArrowProps) { return <ArrowElement {...props} /> }
export const NavigationMenu = Object.assign(NavigationMenuRoot, { Root: NavigationMenuRoot, List: NavigationMenuList, Item: NavigationMenuItem, Trigger: NavigationMenuTrigger, Content: NavigationMenuContent, Link: NavigationMenuLink, Indicator: NavigationMenuIndicator, ItemIndicator: NavigationMenuItemIndicator, Viewport: NavigationMenuViewport, ViewportPositioner: NavigationMenuViewportPositioner, Arrow: NavigationMenuArrow })
