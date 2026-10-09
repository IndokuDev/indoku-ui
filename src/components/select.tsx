import * as React from "react"
import { Select as ArkSelect, createListCollection } from "@ark-ui/react/select"
import { defineRecipe } from "../recipe"
import { indoku } from "../primitives/indoku"
import { useSystem } from "../system/provider"

export interface SelectItem {
  label: string
  value: string
  disabled?: boolean
}

export type SelectSize = "xs" | "sm" | "md" | "lg"

export interface SelectProps {
  items: SelectItem[]
  size?: SelectSize
  rtl?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  "aria-label"?: string
  name?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

const Trigger = indoku(ArkSelect.Trigger)
const Control = indoku(ArkSelect.Control)
const Positioner = indoku(ArkSelect.Positioner)
const Content = indoku(ArkSelect.Content)
const Item = indoku(ArkSelect.Item)
const ItemText = indoku(ArkSelect.ItemText)
const ItemIndicator = indoku(ArkSelect.ItemIndicator)
const Indicator = indoku(ArkSelect.Indicator)

const triggerConfig = {
  className: "select-trigger",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    minWidth: "0",
    height: "var(--indoku-select-trigger-height, 32px)",
    px: "3",
    border: "1px solid",
    borderColor: "border.subtle",
    borderRadius: "lg",
    bg: "bg.surface",
    color: "fg.default",
    fontSize: "14px",
    fontWeight: "medium",
    textAlign: "start",
    outline: "none",
    cursor: "pointer",
    _hover: { bg: "bg.subtle" },
    _focusVisible: { outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" },
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
} as const

const contentConfig = {
  className: "select-content",
  base: {
    zIndex: 50,
    minWidth: "var(--reference-width)",
    maxHeight: "240px",
    overflowY: "auto",
    p: "1",
    border: "1px solid",
    borderColor: "border.subtle",
    borderRadius: "md",
    bg: "bg.surface",
    color: "fg.default",
    boxShadow: "md",
    outline: "none",
  },
} as const

const itemConfig = {
  className: "select-item",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    px: "2",
    py: "2",
    borderRadius: "sm",
    color: "fg.default",
    cursor: "pointer",
    outline: "none",
    "&[data-highlighted]": { bg: "bg.subtle" },
    "&[data-selected]": { fontWeight: "medium" },
    "&[data-disabled]": { opacity: 0.5, cursor: "not-allowed" },
  },
} as const

export function Select({
  items,
  size = "md",
  rtl = false,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select option",
  "aria-label": ariaLabel,
  name,
  disabled,
  required,
  className,
}: SelectProps) {
  const system = useSystem()
  const collection = React.useMemo(() => createListCollection({ items }), [items])
  const triggerRecipe = React.useMemo(() => defineRecipe(triggerConfig as any, system)(), [system])
  const triggerHeight = size === "xs" ? "24px" : size === "sm" ? "28px" : size === "lg" ? "36px" : "32px"
  const contentRecipe = React.useMemo(() => defineRecipe(contentConfig as any, system)(), [system])
  const itemRecipe = React.useMemo(() => defineRecipe(itemConfig as any, system)(), [system])

  return (
    <ArkSelect.Root
      collection={collection}
      value={value === undefined ? undefined : [value]}
      defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
      onValueChange={(details) => onValueChange?.(details.value[0] ?? "")}
      name={name}
      disabled={disabled}
      required={required}
      dir={rtl ? "rtl" : "ltr"}
    >
      <Control dir={rtl ? "rtl" : "ltr"}>
        <Trigger dir={rtl ? "rtl" : "ltr"} css={{ ...triggerRecipe.css, height: triggerHeight }} className={className} aria-label={ariaLabel}>
          <ArkSelect.ValueText placeholder={placeholder} />
          <Indicator aria-hidden="true" color="fg.muted">⌄</Indicator>
        </Trigger>
      </Control>
      <Positioner>
        <Content css={contentRecipe.css}>
          {collection.items.map((item) => (
            <Item key={item.value} item={item} css={itemRecipe.css}>
              <ItemText>{item.label}</ItemText>
              <ItemIndicator aria-hidden="true">✓</ItemIndicator>
            </Item>
          ))}
        </Content>
      </Positioner>
    </ArkSelect.Root>
  )
}
