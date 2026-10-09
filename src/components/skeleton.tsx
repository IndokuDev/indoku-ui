import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div")
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { isLoaded?: boolean; circle?: boolean }
export function Skeleton({ isLoaded = false, circle = false, children, ...props }: SkeletonProps) {
  if (isLoaded) return <>{children}</>
  return <Root aria-hidden="true" borderRadius={circle ? "full" : "md"} bg="bg.subtle" position="relative" overflow="hidden" _after={{ content: '""', position: "absolute", inset: "0", transform: "translateX(-100%)", background: "linear-gradient(90deg, transparent, var(--indoku-colors-bg-muted), transparent)", animation: "indoku-skeleton-shimmer 1.5s infinite" }} {...props} />
}
