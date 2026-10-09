import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("span"), Image = indoku("img"), Fallback = indoku("span")
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> { src?: string; alt?: string; name?: string; fallback?: React.ReactNode; size?: "xs" | "sm" | "md" | "lg" | "xl" }
export function Avatar({ src, alt, name, fallback, size = "md", children, ...props }: AvatarProps) {
 const [failed, setFailed] = React.useState(false)
 const d = ({ xs: "24px", sm: "32px", md: "40px", lg: "48px", xl: "64px" } as const)[size]
 const initials = name?.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase()
 return <Root role="img" aria-label={alt ?? name ?? "Avatar"} position="relative" display="inline-flex" alignItems="center" justifyContent="center" overflow="hidden" flexShrink={0} w={d} h={d} borderRadius="full" bg="bg.subtle" color="fg.default" fontWeight="medium" fontSize={size === "xs" || size === "sm" ? "11px" : "14px"} {...props}>{src && !failed ? <Image src={src} alt={alt ?? name ?? ""} w="100%" h="100%" objectFit="cover" onError={() => setFailed(true)} /> : <Fallback as="span">{fallback ?? children ?? initials ?? "?"}</Fallback>}</Root>
}
