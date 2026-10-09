import * as React from "react"
import { indoku } from "../primitives/indoku"

const RootView = indoku("span")
const ImageView = indoku("img")
const FallbackView = indoku("span")
const GroupView = indoku("div")
const GroupCountView = indoku("span")

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
const dimensions: Record<AvatarSize, string> = { xs: "24px", sm: "32px", md: "40px", lg: "48px", xl: "64px" }

interface AvatarContextValue { failed: boolean; loaded: boolean; setFailed: (failed: boolean) => void; setLoaded: (loaded: boolean) => void; size: AvatarSize; name?: string; alt?: string; src?: string }
const AvatarContext = React.createContext<AvatarContextValue | null>(null)
function useAvatarContext() {
  const value = React.useContext(AvatarContext)
  if (!value) throw new Error("Avatar subcomponents must be used within Avatar.Root")
  return value
}

export interface AvatarRootProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  fallback?: React.ReactNode
}
export function AvatarRoot({ src, alt, name, size = "md", fallback, children, ...props }: AvatarRootProps) {
  const [failed, setFailed] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const initials = name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  const value = React.useMemo(() => ({ failed, loaded, setFailed, setLoaded, size, name, alt, src }), [failed, loaded, size, name, alt, src])
  return <AvatarContext.Provider value={value}><RootView role="img" aria-label={alt ?? name ?? "Avatar"} position="relative" display="inline-flex" alignItems="center" justifyContent="center" overflow="hidden" flexShrink={0} w={dimensions[size]} h={dimensions[size]} borderRadius="full" bg="bg.subtle" color="fg.default" fontWeight="medium" fontSize={size === "xs" || size === "sm" ? "11px" : "14px"} {...props}>{children ?? <><AvatarImage src={src} alt={alt ?? name ?? ""} />{(!loaded || failed || !src) && <AvatarFallback>{fallback ?? initials ?? "?"}</AvatarFallback>}</>}</RootView></AvatarContext.Provider>
}
export interface AvatarImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> { alt?: string }
export function AvatarImage({ onError, ...props }: AvatarImageProps) {
  const { failed, setFailed, setLoaded, alt, name, src: rootSrc } = useAvatarContext()
  const src = props.src ?? rootSrc
  if (failed || !src) return null
  return <ImageView {...props} src={src} alt={props.alt ?? alt ?? name ?? ""} w="100%" h="100%" objectFit="cover" onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => { setLoaded(true); props.onLoad?.(event) }} onError={(event: React.SyntheticEvent<HTMLImageElement>) => { setFailed(true); onError?.(event) }} />
}
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> { delayMs?: number }
export function AvatarFallback({ children, delayMs = 0, ...props }: AvatarFallbackProps) {
  const { failed, loaded, src } = useAvatarContext()
  const [delayElapsed, setDelayElapsed] = React.useState(delayMs <= 0 || !src || failed)
  React.useEffect(() => {
    if (!src || failed || loaded || delayMs <= 0) { setDelayElapsed(true); return }
    setDelayElapsed(false)
    const timer = setTimeout(() => setDelayElapsed(true), delayMs)
    return () => clearTimeout(timer)
  }, [src, failed, loaded, delayMs])
  const hidden = Boolean(src && loaded && !failed) || !delayElapsed
  return <FallbackView data-state={hidden ? "hidden" : "visible"} hidden={hidden} {...props}>{children}</FallbackView>
}
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> { size?: AvatarSize; spacing?: string }
export function AvatarGroup({ size = "md", spacing = "-8px", children, ...props }: AvatarGroupProps) {
  return <GroupView display="inline-flex" alignItems="center" flexDirection="row" {...props} data-size={size} css={{ "& > * + *": { marginInlineStart: spacing }, "& > *": { border: "2px solid", borderColor: "bg.surface" } }}>{children}</GroupView>
}
export interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLSpanElement> { size?: AvatarSize }
export function AvatarGroupCount({ size = "md", ...props }: AvatarGroupCountProps) {
  return <GroupCountView display="inline-flex" alignItems="center" justifyContent="center" flexShrink={0} w={dimensions[size]} h={dimensions[size]} borderRadius="full" bg="bg.subtle" color="fg.default" fontSize={size === "xs" || size === "sm" ? "11px" : "14px"} fontWeight="medium" {...props} />
}

export interface AvatarProps extends AvatarRootProps {}
export const Avatar = Object.assign(AvatarRoot, { Root: AvatarRoot, Image: AvatarImage, Fallback: AvatarFallback, Group: AvatarGroup, GroupCount: AvatarGroupCount })
