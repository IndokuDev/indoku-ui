import * as React from "react"
import { Dialog as ArkDialog } from "@ark-ui/react/dialog"
import { indoku } from "../primitives/indoku"

const TriggerElement = indoku(ArkDialog.Trigger)
const BackdropElement = indoku(ArkDialog.Backdrop)
const PositionerElement = indoku(ArkDialog.Positioner)
const ContentElement = indoku(ArkDialog.Content)
const HeaderElement = indoku("div")
const BodyElement = indoku("div")
const FooterElement = indoku("div")
const TitleElement = indoku(ArkDialog.Title)
const DescriptionElement = indoku(ArkDialog.Description)
const CloseElement = indoku(ArkDialog.CloseTrigger)

export type DialogRootProps = React.ComponentProps<typeof ArkDialog.Root>
export function DialogRoot({ unmountOnExit = true, lazyMount = true, ...props }: DialogRootProps) { return <ArkDialog.Root unmountOnExit={unmountOnExit} lazyMount={lazyMount} {...props} /> }
export type DialogTriggerProps = React.ComponentProps<typeof ArkDialog.Trigger>
export function DialogTrigger(props: DialogTriggerProps) { return <TriggerElement type="button" border="1px solid" borderColor="border.subtle" borderRadius="md" px="12px" h="32px" bg="bg.surface" color="fg.default" _hover={{ bg: "bg.subtle" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type DialogBackdropProps = React.ComponentProps<typeof ArkDialog.Backdrop>
export function DialogBackdrop(props: DialogBackdropProps) { return <BackdropElement position="fixed" inset="0" zIndex={50} style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", ...props.style }} {...props} /> }
export type DialogPositionerProps = React.ComponentProps<typeof ArkDialog.Positioner>
export function DialogPositioner(props: DialogPositionerProps) { return <PositionerElement position="fixed" inset="0" zIndex={50} display="flex" alignItems="center" justifyContent="center" p="16px" {...props} /> }
export type DialogContentProps = React.ComponentProps<typeof ArkDialog.Content>
export function DialogContent(props: DialogContentProps) { return <ContentElement width="100%" maxW="480px" maxH="calc(100vh - 32px)" overflowY="auto" border="1px solid" borderColor="border.subtle" borderRadius="xl" bg="bg.surface" color="fg.default" boxShadow="lg" p="24px" outline="none" _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export function DialogHeader(props: DialogHeaderProps) { return <HeaderElement display="flex" flexDirection="column" gap="6px" mb="16px" {...props} /> }
export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>
export function DialogBody(props: DialogBodyProps) { return <BodyElement fontSize="14px" color="fg.default" {...props} /> }
export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export function DialogFooter(props: DialogFooterProps) { return <FooterElement display="flex" justifyContent="flex-end" alignItems="center" gap="8px" mt="24px" {...props} /> }
export type DialogTitleProps = React.ComponentProps<typeof ArkDialog.Title>
export function DialogTitle(props: DialogTitleProps) { return <TitleElement fontSize="18px" fontWeight="semibold" lineHeight={1.3} {...props} /> }
export type DialogDescriptionProps = React.ComponentProps<typeof ArkDialog.Description>
export function DialogDescription(props: DialogDescriptionProps) { return <DescriptionElement fontSize="14px" color="fg.muted" lineHeight={1.5} {...props} /> }
export type DialogCloseTriggerProps = React.ComponentProps<typeof ArkDialog.CloseTrigger>
export function DialogCloseTrigger(props: DialogCloseTriggerProps) { return <CloseElement type="button" aria-label="Close dialog" position="absolute" top="12px" right="12px" borderRadius="md" p="6px" color="fg.muted" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot, Trigger: DialogTrigger, Backdrop: DialogBackdrop, Positioner: DialogPositioner,
  Content: DialogContent, Header: DialogHeader, Body: DialogBody, Footer: DialogFooter,
  Title: DialogTitle, Description: DialogDescription, CloseTrigger: DialogCloseTrigger,
})
