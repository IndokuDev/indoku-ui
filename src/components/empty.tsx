import * as React from "react"
import { indoku } from "../primitives/indoku"

const RootElement = indoku("section")
const IndicatorElement = indoku("div")
const TitleElement = indoku("h3")
const DescriptionElement = indoku("p")
const ContentElement = indoku("div")

export type EmptyRootProps = React.HTMLAttributes<HTMLElement>
export function EmptyRoot(props: EmptyRootProps) { return <RootElement display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" gap="8px" p="32px" border="1px dashed" borderColor="border.subtle" borderRadius="xl" {...props} /> }
export type EmptyIndicatorProps = React.HTMLAttributes<HTMLDivElement>
export function EmptyIndicator(props: EmptyIndicatorProps) { return <IndicatorElement display="flex" alignItems="center" justifyContent="center" color="fg.muted" fontSize="24px" mb="4px" {...props} /> }
export type EmptyTitleProps = React.HTMLAttributes<HTMLHeadingElement>
export function EmptyTitle(props: EmptyTitleProps) { return <TitleElement fontSize="16px" fontWeight="semibold" color="fg.default" {...props} /> }
export type EmptyDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
export function EmptyDescription(props: EmptyDescriptionProps) { return <DescriptionElement fontSize="14px" lineHeight={1.5} color="fg.muted" maxW="420px" {...props} /> }
export type EmptyContentProps = React.HTMLAttributes<HTMLDivElement>
export function EmptyContent(props: EmptyContentProps) { return <ContentElement display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" gap="8px" mt="8px" {...props} /> }
export const Empty = Object.assign(EmptyRoot, { Root: EmptyRoot, Indicator: EmptyIndicator, Title: EmptyTitle, Description: EmptyDescription, Content: EmptyContent })
