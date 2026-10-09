import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Pagination as ArkPagination } from "@ark-ui/react/pagination"
import { indoku } from "../primitives/indoku"
import { Button } from "./button"

const ContentElement = indoku("div")
const IndokuSpan = indoku("span")

export type PaginationRootProps = React.ComponentProps<typeof ArkPagination.Root>
export function PaginationRoot(props: PaginationRootProps) { return <ArkPagination.Root {...props} /> }
export type PaginationContentProps = React.HTMLAttributes<HTMLDivElement>
export function PaginationContent(props: PaginationContentProps) { return <ContentElement display="flex" alignItems="center" justifyContent="center" gap="4px" flexWrap="wrap" {...props} /> }
export type PaginationPreviousProps = React.ComponentProps<typeof ArkPagination.PrevTrigger> & { children?: React.ReactNode }
export function PaginationPrevious({ children, ...props }: PaginationPreviousProps) { return <ArkPagination.PrevTrigger asChild {...props}><Button variant="ghost" size="sm" aria-label="Previous page" gap="4px"><ChevronLeft size={16} aria-hidden="true" />{children ?? "Previous"}</Button></ArkPagination.PrevTrigger> }
export type PaginationNextProps = React.ComponentProps<typeof ArkPagination.NextTrigger> & { children?: React.ReactNode }
export function PaginationNext({ children, ...props }: PaginationNextProps) { return <ArkPagination.NextTrigger asChild {...props}><Button variant="ghost" size="sm" aria-label="Next page" gap="4px">{children ?? "Next"}<ChevronRight size={16} aria-hidden="true" /></Button></ArkPagination.NextTrigger> }
export interface PaginationPagesProps extends React.HTMLAttributes<HTMLDivElement> { ellipsis?: React.ReactNode }
export function PaginationPages({ ellipsis, ...props }: PaginationPagesProps) {
  return <ContentElement display="flex" alignItems="center" gap="4px" {...props}><ArkPagination.Context>{(context) => context.pages.map((page, index) => page.type === "ellipsis" ? <ArkPagination.Ellipsis key={`ellipsis-${index}`} index={index}><span aria-hidden="true">{ellipsis ?? <MoreHorizontal size={16} />}</span></ArkPagination.Ellipsis> : <ArkPagination.Item key={page.value} type="page" value={page.value} asChild><Button size="sm" minW="32px" variant={page.value === context.page ? "outline" : "ghost"} aria-current={page.value === context.page ? "page" : undefined}>{page.value}</Button></ArkPagination.Item>)}</ArkPagination.Context></ContentElement>
}
export type PaginationPageTextProps = React.HTMLAttributes<HTMLSpanElement>
export function PaginationPageText(props: PaginationPageTextProps) { return <IndokuSpan color="fg.muted" fontSize="12px" {...props}><ArkPagination.Context>{(context) => `Page ${context.page} of ${context.totalPages}`}</ArkPagination.Context></IndokuSpan> }
export const Pagination = Object.assign(PaginationRoot, { Root: PaginationRoot, Content: PaginationContent, Previous: PaginationPrevious, Next: PaginationNext, Pages: PaginationPages, PageText: PaginationPageText })
