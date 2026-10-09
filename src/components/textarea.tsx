import * as React from "react"
import { indoku } from "../primitives/indoku"
import { controlHeights, type ControlSize } from "./control-size"

const Root = indoku("textarea")
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: ControlSize
  resize?: "none" | "vertical" | "horizontal" | "both"
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ size = "md", resize = "vertical", ...props }, ref) {
  const minHeight = size === "xs" ? "56px" : size === "sm" ? "64px" : size === "lg" ? "88px" : "72px"
  return <Root {...props} ref={ref} minHeight={minHeight} width="100%" px="10px" py="8px" border="1px solid" borderColor="border.subtle" borderRadius="md" bg="bg.surface" color="fg.default" fontSize={size === "xs" ? "12px" : "14px"} lineHeight="1.5" resize={resize} outline="none" transition="border-color 150ms ease, box-shadow 150ms ease" _placeholder={{ color: "fg.muted" }} _focusVisible={{ borderColor: "accent.default", boxShadow: "0 0 0 3px rgb(0 0 0 / 0.15)" }} _disabled={{ cursor: "not-allowed", opacity: 0.5 }} />
})
Textarea.displayName = "Textarea"
