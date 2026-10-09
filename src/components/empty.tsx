import * as React from "react"
import { indoku } from "../primitives/indoku"

const RootElement = indoku("section")
const HeaderElement = indoku("header")
const IndicatorElement = indoku("div")
const MediaElement = indoku("div")
const TitleElement = indoku("h3")
const DescriptionElement = indoku("p")
const ContentElement = indoku("div")

export interface EmptyRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Plain empty state by default; outline adds a dashed border. */
  variant?: "plain" | "outline"
}
export function EmptyRoot({ variant = "plain", ...props }: EmptyRootProps) {
  return <RootElement display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" gap="24px" p="24px" minW="0" border={variant === "outline" ? "1px dashed" : "none"} borderColor="border.subtle" borderRadius="lg" css={{ textWrap: "balance" }} {...props} />
}
export type EmptyHeaderProps = React.HTMLAttributes<HTMLElement>
export function EmptyHeader(props: EmptyHeaderProps) { return <HeaderElement display="flex" flexDirection="column" alignItems="center" gap="8px" maxW="sm" {...props} /> }
export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> { variant?: "default" | "icon" }
export function EmptyMedia({ variant = "default", ...props }: EmptyMediaProps) {
  return <MediaElement display="flex" alignItems="center" justifyContent="center" flexShrink="0" mb="8px" css={variant === "icon" ? { width: "40px", height: "40px", borderRadius: "var(--indoku-radii-md, 6px)", background: "var(--indoku-colors-bg-muted)", color: "var(--indoku-colors-fg-default)", "& svg": { width: "20px", height: "20px" } } : undefined} {...props} />
}
export type EmptyIndicatorProps = React.HTMLAttributes<HTMLDivElement>
export function EmptyIndicator(props: EmptyIndicatorProps) { return <IndicatorElement display="flex" alignItems="center" justifyContent="center" color="fg.muted" fontSize="24px" mb="4px" {...props} /> }
export type EmptyTitleProps = React.HTMLAttributes<HTMLHeadingElement>
export function EmptyTitle(props: EmptyTitleProps) { return <TitleElement m="0" fontSize="14px" fontWeight="medium" color="fg.default" letterSpacing="tight" {...props} /> }
export type EmptyDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
export function EmptyDescription(props: EmptyDescriptionProps) { return <DescriptionElement m="0" fontSize="14px" lineHeight="1.6" color="fg.muted" maxW="420px" {...props} /> }
export type EmptyContentProps = React.HTMLAttributes<HTMLDivElement>
export function EmptyContent(props: EmptyContentProps) { return <ContentElement display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexWrap="wrap" gap="12px" width="100%" maxW="sm" minW="0" fontSize="sm" mt="8px" {...props} /> }
export const Empty = Object.assign(EmptyRoot, { Root: EmptyRoot, Header: EmptyHeader, Media: EmptyMedia, Indicator: EmptyIndicator, Title: EmptyTitle, Description: EmptyDescription, Content: EmptyContent })
