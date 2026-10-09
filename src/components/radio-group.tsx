import * as React from "react"
import { indoku } from "../primitives/indoku"
import type { ControlSize } from "./control-size"

export interface RadioGroupItem {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioGroupProps {
  items: RadioGroupItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  size?: ControlSize
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  "aria-label"?: string
  className?: string
}

const Root = indoku("div")
const Label = indoku("label")
const Input = indoku("input")
const Control = indoku("span")

export function RadioGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  name,
  size = "md",
  orientation = "vertical",
  disabled,
  required,
  invalid,
  "aria-label": ariaLabel,
  className,
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")
  const selectedValue = value ?? uncontrolledValue
  const controlSize = size === "xs" ? "14px" : size === "lg" ? "20px" : "16px"
  const dotSize = size === "xs" ? "6px" : size === "lg" ? "10px" : "8px"
  const gap = size === "xs" ? "6px" : "8px"

  return (
    <Root
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className={className}
      display="flex"
      flexDirection={orientation === "horizontal" ? "row" : "column"}
      flexWrap={orientation === "horizontal" ? "wrap" : "nowrap"}
      gap={gap}
    >
      {items.map((item) => {
        const checked = selectedValue === item.value
        const itemDisabled = disabled || item.disabled
        return (
          <Label
            key={item.value}
            display="inline-flex"
            alignItems="center"
            gap={gap}
            cursor={itemDisabled ? "not-allowed" : "pointer"}
            opacity={itemDisabled ? 0.5 : 1}
            color="fg.default"
            fontSize={size === "xs" ? "12px" : "14px"}
            position="relative"
          >
            <Input
              type="radio"
              name={name}
              value={item.value}
              checked={checked}
              disabled={itemDisabled}
              required={required}
              aria-invalid={invalid || undefined}
              onChange={() => {
                if (value === undefined) setUncontrolledValue(item.value)
                onValueChange?.(item.value)
              }}
              position="absolute"
              inset="0"
              width="100%"
              height="100%"
              margin="0"
              opacity="0"
              cursor={itemDisabled ? "not-allowed" : "pointer"}
            />
            <Control
              aria-hidden="true"
              width={controlSize}
              height={controlSize}
              flexShrink={0}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid"
              borderColor={invalid ? "border.destructive" : checked ? "accent.default" : "border.subtle"}
              borderRadius="full"
              bg="bg.surface"
              boxSizing="border-box"
              transition="border-color 150ms ease"
            >
              <span
                style={{
                  display: "block",
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "9999px",
                  background: "var(--indoku-colors-accent-default)",
                  opacity: checked ? 1 : 0,
                }}
              />
            </Control>
            <span style={{ fontSize: size === "xs" ? "12px" : "14px", lineHeight: 1.25 }}>{item.label}</span>
          </Label>
        )
      })}
    </Root>
  )
}
