import * as React from "react"
import { Menu as ArkMenu } from "@ark-ui/react/menu"
import { indoku } from "../primitives/indoku"

const TriggerElement = indoku(ArkMenu.Trigger)
const PositionerElement = indoku(ArkMenu.Positioner)
const ContentElement = indoku(ArkMenu.Content)
const ItemElement = indoku(ArkMenu.Item)
const ItemGroupElement = indoku(ArkMenu.ItemGroup)
const ItemGroupLabelElement = indoku(ArkMenu.ItemGroupLabel)
const SeparatorElement = indoku(ArkMenu.Separator)
const ArrowElement = indoku(ArkMenu.Arrow)
const ArrowTipElement = indoku(ArkMenu.ArrowTip)
const ContextTriggerElement = indoku(ArkMenu.ContextTrigger)
const CheckboxItemElement = indoku(ArkMenu.CheckboxItem)
const RadioItemElement = indoku(ArkMenu.RadioItem)
const RadioItemGroupElement = indoku(ArkMenu.RadioItemGroup)
const ItemIndicatorElement = indoku(ArkMenu.ItemIndicator)
const ItemTextElement = indoku(ArkMenu.ItemText)
const TriggerItemElement = indoku(ArkMenu.TriggerItem)

export type MenuRootProps = React.ComponentProps<typeof ArkMenu.Root>
export function MenuRoot(props: MenuRootProps) { return <ArkMenu.Root {...props} /> }
export type MenuTriggerProps = React.ComponentProps<typeof ArkMenu.Trigger>
export function MenuTrigger(props: MenuTriggerProps) { return <TriggerElement type="button" border="1px solid" borderColor="border.subtle" borderRadius="md" px="12px" h="32px" bg="bg.surface" color="fg.default" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type MenuPositionerProps = React.ComponentProps<typeof ArkMenu.Positioner>
export function MenuPositioner(props: MenuPositionerProps) { return <PositionerElement zIndex={50} {...props} /> }
export type MenuContentProps = React.ComponentProps<typeof ArkMenu.Content>
export function MenuContent(props: MenuContentProps) { return <ContentElement minW="180px" p="4px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" color="fg.default" boxShadow="md" outline="none" _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type MenuItemProps = React.ComponentProps<typeof ArkMenu.Item>
export function MenuItem(props: MenuItemProps) { return <ItemElement display="flex" alignItems="center" gap="8px" px="10px" py="8px" borderRadius="md" fontSize="14px" cursor="pointer" _highlighted={{ bg: "bg.subtle" }} _disabled={{ opacity: 0.5, cursor: "not-allowed" }} {...props} /> }
export type MenuItemGroupProps = React.ComponentProps<typeof ArkMenu.ItemGroup>
export function MenuItemGroup(props: MenuItemGroupProps) { return <ItemGroupElement {...props} /> }
export type MenuItemGroupLabelProps = React.ComponentProps<typeof ArkMenu.ItemGroupLabel>
export function MenuItemGroupLabel(props: MenuItemGroupLabelProps) { return <ItemGroupLabelElement px="10px" py="6px" color="fg.muted" fontSize="12px" fontWeight="medium" {...props} /> }
export type MenuSeparatorProps = React.ComponentProps<typeof ArkMenu.Separator>
export function MenuSeparator(props: MenuSeparatorProps) { return <SeparatorElement my="4px" borderTop="1px solid" borderColor="border.subtle" {...props} /> }
export type MenuArrowProps = React.ComponentProps<typeof ArkMenu.Arrow>
export function MenuArrow(props: MenuArrowProps) { return <ArrowElement {...props}><ArrowTipElement bg="bg.surface" borderColor="border.subtle" {...props} /></ArrowElement> }
export type MenuCheckboxItemProps = React.ComponentProps<typeof ArkMenu.CheckboxItem>
export function MenuCheckboxItem(props: MenuCheckboxItemProps) { return <CheckboxItemElement display="flex" alignItems="center" gap="8px" px="10px" py="8px" borderRadius="md" fontSize="14px" cursor="pointer" _highlighted={{ bg: "bg.subtle" }} {...props} /> }
export type MenuRadioItemProps = React.ComponentProps<typeof ArkMenu.RadioItem>
export function MenuRadioItem(props: MenuRadioItemProps) { return <RadioItemElement display="flex" alignItems="center" gap="8px" px="10px" py="8px" borderRadius="md" fontSize="14px" cursor="pointer" _highlighted={{ bg: "bg.subtle" }} {...props} /> }
export type MenuRadioItemGroupProps = React.ComponentProps<typeof ArkMenu.RadioItemGroup>
export function MenuRadioItemGroup(props: MenuRadioItemGroupProps) { return <RadioItemGroupElement {...props} /> }
export type MenuItemIndicatorProps = React.ComponentProps<typeof ArkMenu.ItemIndicator>
export function MenuItemIndicator(props: MenuItemIndicatorProps) { return <ItemIndicatorElement color="fg.muted" {...props} /> }
export type MenuItemTextProps = React.ComponentProps<typeof ArkMenu.ItemText>
export function MenuItemText(props: MenuItemTextProps) { return <ItemTextElement {...props} /> }
export type MenuTriggerItemProps = React.ComponentProps<typeof ArkMenu.TriggerItem>
export function MenuTriggerItem(props: MenuTriggerItemProps) { return <TriggerItemElement display="flex" alignItems="center" px="10px" py="8px" borderRadius="md" fontSize="14px" cursor="pointer" _highlighted={{ bg: "bg.subtle" }} {...props} /> }
export type MenuContextTriggerProps = React.ComponentProps<typeof ArkMenu.ContextTrigger>
export function MenuContextTrigger(props: MenuContextTriggerProps) { return <ContextTriggerElement {...props} /> }

export const Menu = Object.assign(MenuRoot, { Root: MenuRoot, Trigger: MenuTrigger, Positioner: MenuPositioner, Content: MenuContent, Item: MenuItem, ItemGroup: MenuItemGroup, ItemGroupLabel: MenuItemGroupLabel, Separator: MenuSeparator, Arrow: MenuArrow, ContextTrigger: MenuContextTrigger, CheckboxItem: MenuCheckboxItem, RadioItem: MenuRadioItem, RadioItemGroup: MenuRadioItemGroup, ItemIndicator: MenuItemIndicator, ItemText: MenuItemText, TriggerItem: MenuTriggerItem })
