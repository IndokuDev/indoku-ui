import * as React from "react"
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel"
import { indoku } from "../primitives/indoku"

export interface CarouselProps {
  items: React.ReactNode[]
  slidesPerPage?: number
  spacing?: string
  loop?: boolean
  autoplay?: boolean
  page?: number
  defaultPage?: number
  onPageChange?: (details: { page: number }) => void
  orientation?: "horizontal" | "vertical"
  allowMouseDrag?: boolean
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

function CarouselComponent({ items, slidesPerPage = 1, spacing = "12px", loop = false, autoplay = false, page, defaultPage, onPageChange, orientation = "horizontal", allowMouseDrag = false, className, label = "Carousel" }: CarouselProps) {
  return (
    <Root className={className} slideCount={items.length} page={page} defaultPage={defaultPage} onPageChange={onPageChange} slidesPerPage={slidesPerPage} spacing={spacing} loop={loop} orientation={orientation} allowMouseDrag={allowMouseDrag} autoplay={autoplay ? { delay: 4000 } : undefined} aria-label={label} style={{ width: "100%" }}>
      <ItemGroup style={{ display: "flex", gap: spacing, overflow: "hidden", alignItems: "stretch" }}>
        {items.map((content, index) => <Item key={index} index={index} style={{ boxSizing: "border-box", flex: `0 0 calc((100% - ${Math.max(0, slidesPerPage - 1) * (Number.parseFloat(spacing) || 0)}px) / ${slidesPerPage})`, minWidth: 0 }}>{content}</Item>)}
      </ItemGroup>
      <Control style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
        <PrevTrigger aria-label="Previous slide" style={triggerStyle}>‹</PrevTrigger>
        <IndicatorGroup style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {items.map((_, i) => <Indicator key={i} index={i} aria-label={`Go to slide ${i + 1}`} style={indicatorStyle} />)}
        </IndicatorGroup>
        <NextTrigger aria-label="Next slide" style={triggerStyle}>›</NextTrigger>
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
