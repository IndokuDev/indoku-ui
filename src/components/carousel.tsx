import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel"
import { indoku } from "../primitives/indoku"

export interface CarouselProps {
  items: React.ReactNode[]
  slidesPerPage?: number
  spacing?: string
  loop?: boolean
  autoplay?: boolean | { delay?: number }
  autoSize?: boolean
  page?: number
  defaultPage?: number
  onPageChange?: (details: { page: number }) => void
  orientation?: "horizontal" | "vertical"
  allowMouseDrag?: boolean
  height?: string
  className?: string
  label?: string
}

const Root = indoku(ArkCarousel.Root)
const RootProvider = indoku(ArkCarousel.RootProvider)
const ItemGroup = indoku(ArkCarousel.ItemGroup)
const Item = indoku(ArkCarousel.Item)
const Control = indoku(ArkCarousel.Control)
const PrevTrigger = indoku(ArkCarousel.PrevTrigger)
const NextTrigger = indoku(ArkCarousel.NextTrigger)
const IndicatorGroup = indoku(ArkCarousel.IndicatorGroup)
const Indicator = indoku(ArkCarousel.Indicator)
const AutoplayTrigger = indoku(ArkCarousel.AutoplayTrigger)
const AutoplayIndicator = indoku(ArkCarousel.AutoplayIndicator)
const ProgressText = indoku(ArkCarousel.ProgressText)

function CarouselComponent({ items, slidesPerPage = 1, spacing = "12px", loop = false, autoplay = false, autoSize = false, page, defaultPage, onPageChange, orientation = "horizontal", allowMouseDrag = false, height, className, label = "Carousel" }: CarouselProps) {
  const [internalPage, setInternalPage] = React.useState(defaultPage ?? 0)
  const activePage = page ?? internalPage
  const handlePageChange = (details: { page: number }) => {
    if (page === undefined) setInternalPage(details.page)
    onPageChange?.(details)
  }
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const shouldNavigate = orientation === "vertical" ? Math.abs(event.deltaY) > 0 : event.shiftKey && Math.abs(event.deltaY) > 0
    if (!shouldNavigate) return
    event.preventDefault()
    const direction = orientation === "vertical" ? event.deltaY : event.deltaY
    const lastPage = Math.max(0, items.length - slidesPerPage)
    const nextPage = activePage + (direction > 0 ? 1 : -1)
    const target = loop ? (nextPage < 0 ? lastPage : nextPage > lastPage ? 0 : nextPage) : Math.max(0, Math.min(lastPage, nextPage))
    handlePageChange({ page: target })
  }
  return (
    <Root className={className} slideCount={items.length} page={page ?? internalPage} defaultPage={defaultPage} onPageChange={handlePageChange} onWheel={handleWheel} slidesPerPage={slidesPerPage} spacing={spacing} loop={loop} orientation={orientation} allowMouseDrag={allowMouseDrag} autoSize={autoSize} autoplay={autoplay ? { delay: typeof autoplay === "object" ? autoplay.delay ?? 4000 : 4000 } : undefined} aria-label={label} style={{ width: "100%", ...(height ? { height } : {}), ...(orientation === "vertical" ? { display: "flex", alignItems: "stretch", gap: 0, minHeight: 0 } : {}) }}>
      <ItemGroup style={{ display: "flex", flexDirection: orientation === "vertical" ? "column" : "row", gap: spacing, overflow: "hidden", alignItems: "stretch", ...(orientation === "vertical" ? { height: "100%", flex: "1 1 auto", minHeight: 0, minWidth: 0 } : autoSize ? { overflowX: "auto", overflowY: "hidden", scrollBehavior: "smooth" } : {}) }}>
        {items.map((content, index) => <Item key={index} index={index} style={{ boxSizing: "border-box", ...(orientation === "vertical" ? { flex: "0 0 100%", width: "100%", minHeight: 0 } : autoSize ? { flex: "0 0 auto", width: "auto" } : { flex: `0 0 calc((100% - ${Math.max(0, slidesPerPage - 1) * (Number.parseFloat(spacing) || 0)}px) / ${slidesPerPage})` }), minWidth: 0 }}>{content}</Item>)}
      </ItemGroup>
      <Control style={{ display: "flex", flexDirection: orientation === "vertical" ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: orientation === "vertical" ? 0 : 12, marginLeft: orientation === "vertical" ? 12 : 0, flex: "0 0 auto" }}>
        <PrevTrigger aria-label={orientation === "vertical" ? "Previous slide" : "Previous slide"} style={triggerStyle}>{orientation === "vertical" ? <ChevronUp size={16} /> : <ChevronLeft size={16} />}</PrevTrigger>
        <IndicatorGroup style={{ display: "flex", flexDirection: orientation === "vertical" ? "column" : "row", alignItems: "center", gap: 6 }}>
          {items.map((_, i) => <Indicator key={i} index={i} aria-label={`Go to slide ${i + 1}`} style={indicatorStyle} />)}
        </IndicatorGroup>
        <NextTrigger aria-label="Next slide" style={triggerStyle}>{orientation === "vertical" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</NextTrigger>
      </Control>
    </Root>
  )
}

const triggerStyle: React.CSSProperties = { display: "inline-grid", placeItems: "center", width: 28, height: 28, border: "1px solid var(--indoku-colors-border-subtle)", borderRadius: 8, background: "var(--indoku-colors-bg-surface)", color: "var(--indoku-colors-fg-default)", cursor: "pointer" }
const indicatorStyle: React.CSSProperties = { width: 6, height: 6, borderRadius: 999, border: 0, padding: 0, background: "var(--indoku-colors-fg-muted)", cursor: "pointer" }

export const Carousel = Object.assign(CarouselComponent, {
  Root, RootProvider, ItemGroup, Item, Control, PrevTrigger, NextTrigger,
  IndicatorGroup, Indicator, AutoplayTrigger, AutoplayIndicator, ProgressText,
})
