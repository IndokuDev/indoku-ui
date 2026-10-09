import * as React from "react"
import { FileCode2, FileText, LoaderCircle, X } from "lucide-react"
import { indoku } from "../primitives/indoku"
import { Progress } from "./progress"

export type AttachmentStatus = "idle" | "uploading" | "error" | "done"
const RootElement = indoku("div")
const MediaElement = indoku("div")
const ContentElement = indoku("div")
const NameElement = indoku("p")
const MetaElement = indoku("p")
const StatusElement = indoku("p")
const ActionsElement = indoku("div")
const ActionElement = indoku("button")
const GroupElement = indoku("div")
function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
export interface AttachmentRootProps extends React.HTMLAttributes<HTMLDivElement> { onClick?: () => void; orientation?: "horizontal" | "vertical" }
export function AttachmentRoot({ onClick, orientation = "horizontal", onKeyDown, children, ...props }: AttachmentRootProps) {
  return <RootElement role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} data-orientation={orientation} onClick={onClick} onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => { onKeyDown?.(event); if (event.defaultPrevented) return; if (onClick && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onClick() } }} display="flex" alignItems="center" gap="12px" p="10px" border="1px solid" borderColor="border.subtle" borderRadius="md" bg="bg.surface" cursor={onClick ? "pointer" : "default"} _hover={onClick ? { bg: "bg.subtle" } : undefined} css={{ "&[data-orientation=vertical]": { flexDirection: "column", alignItems: "stretch", gap: "8px", width: "160px", flexShrink: 0 }, "&[data-orientation=vertical] > [data-part=media]": { width: "100%", aspectRatio: "4 / 3", height: "auto" } }} {...props}>{children}</RootElement>
}
export interface AttachmentMediaProps { src?: string; alt?: string; kind?: "file" | "code"; loading?: boolean }
export function AttachmentMedia({ src, alt = "", kind = "file", loading }: AttachmentMediaProps) { return <MediaElement data-part="media" flexShrink={0} w="40px" h="40px" borderRadius="sm" overflow="hidden" bg="bg.subtle" display="flex" alignItems="center" justifyContent="center" color="fg.muted">{src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : loading ? <LoaderCircle size={18} aria-label="Uploading" /> : kind === "code" ? <FileCode2 size={18} aria-hidden="true" /> : <FileText size={18} aria-hidden="true" />}</MediaElement> }
export type AttachmentContentProps = React.HTMLAttributes<HTMLDivElement>
export function AttachmentContent(props: AttachmentContentProps) { return <ContentElement display="flex" flexDirection="column" gap="2px" minW="0" flex="1" {...props} /> }
export type AttachmentNameProps = React.HTMLAttributes<HTMLParagraphElement>
export function AttachmentName(props: AttachmentNameProps) { return <NameElement m="0" fontSize="14px" fontWeight="medium" color="fg.default" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" {...props} /> }
export interface AttachmentMetaProps extends React.HTMLAttributes<HTMLParagraphElement> { size?: number; format?: string }
export function AttachmentMeta({ size, format, children, ...props }: AttachmentMetaProps) { const text = [format, size !== undefined ? formatBytes(size) : null].filter(Boolean).join(" · "); return <MetaElement m="0" fontSize="12px" color="fg.muted" {...props}>{children ?? (text || null)}</MetaElement> }
export interface AttachmentStatusProps { status: AttachmentStatus; progress?: number; variant?: "bar" | "text" }
export function AttachmentStatusView({ status, progress, variant = "bar" }: AttachmentStatusProps) { if (status === "uploading" && variant === "text") return <StatusElement m="0" fontSize="12px" color="fg.muted">Uploading{progress !== undefined ? ` · ${Math.round(progress)}%` : "…"}</StatusElement>; if (status === "uploading") return <Progress.Root value={progress ?? null} size="sm" label="Upload progress"><Progress.Track><Progress.Range /></Progress.Track></Progress.Root>; if (status === "error") return <StatusElement m="0" fontSize="12px" color="status.danger" role="alert">Upload failed</StatusElement>; return null }
export type AttachmentActionsProps = React.HTMLAttributes<HTMLDivElement>
export function AttachmentActions({ onClick, ...props }: AttachmentActionsProps) { return <ActionsElement display="flex" alignItems="center" gap="4px" flexShrink={0} onClick={(event: React.MouseEvent<HTMLDivElement>) => { event.stopPropagation(); onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>) }} {...props} /> }
export interface AttachmentActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { "aria-label": string }
export function AttachmentAction(props: AttachmentActionProps) { return <ActionElement type="button" display="inline-flex" alignItems="center" justifyContent="center" w="28px" h="28px" borderRadius="sm" color="fg.muted" cursor="pointer" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }} {...props} /> }
export function AttachmentRemove({ "aria-label": label = "Remove", ...props }: Partial<AttachmentActionProps>) { return <AttachmentAction aria-label={label} {...props}><X size={14} aria-hidden="true" /></AttachmentAction> }
export interface AttachmentGroupProps extends React.HTMLAttributes<HTMLDivElement> { wrap?: boolean }
export function AttachmentGroup({ wrap = false, ...props }: AttachmentGroupProps) { return <GroupElement display="flex" gap="8px" flexWrap={wrap ? "wrap" : "nowrap"} overflowX={wrap ? "visible" : "auto"} {...props} /> }
export const Attachment = Object.assign(AttachmentRoot, { Root: AttachmentRoot, Media: AttachmentMedia, Content: AttachmentContent, Name: AttachmentName, Meta: AttachmentMeta, Status: AttachmentStatusView, Actions: AttachmentActions, Action: AttachmentAction, Remove: AttachmentRemove, Group: AttachmentGroup })
