import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, LoaderCircle, X } from "lucide-react"
import { Portal } from "@ark-ui/react/portal"
import { Toast as ArkToast, Toaster as ArkToaster, createToaster, type CreateToasterProps, type CreateToasterReturn, type ToastOptions as ArkToastOptions } from "@ark-ui/react/toast"
import { indoku } from "../primitives/indoku"

export type ToastType = "success" | "error" | "warning" | "info" | "loading"
export interface ToastOptions { id?: string; description?: React.ReactNode; duration?: number; closable?: boolean; icon?: React.ReactNode | false; action?: { label: string; onClick: () => void } }
interface ToastMeta { icon?: React.ReactNode | false; action?: ToastOptions["action"] }
export const toaster: CreateToasterReturn<React.ReactNode> = createToaster({ placement: "bottom-end", pauseOnPageIdle: true })
function dispatch(type: ToastType | undefined, title: React.ReactNode, options: ToastOptions = {}) {
  const { icon, action, ...rest } = options
  return toaster.create({ ...rest, type, title, meta: { icon, action } satisfies ToastMeta } as ArkToastOptions)
}
export const toast = Object.assign((title: React.ReactNode, options: ToastOptions = {}) => dispatch(undefined, title, { icon: false, ...options }), {
  success: (title: React.ReactNode, options?: ToastOptions) => dispatch("success", title, options),
  error: (title: React.ReactNode, options?: ToastOptions) => dispatch("error", title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) => dispatch("warning", title, options),
  info: (title: React.ReactNode, options?: ToastOptions) => dispatch("info", title, options),
  loading: (title: React.ReactNode, options?: ToastOptions) => dispatch("loading", title, options),
  dismiss: (id?: string) => toaster.dismiss(id),
  remove: (id?: string) => toaster.remove(id),
})
export { createToaster }
export type { CreateToasterProps, CreateToasterReturn }

const ToastRootElement = indoku(ArkToast.Root)
const ToastTitleElement = indoku(ArkToast.Title)
const ToastDescriptionElement = indoku(ArkToast.Description)
const ToastCloseElement = indoku(ArkToast.CloseTrigger)
const ToastActionElement = indoku(ArkToast.ActionTrigger)
const ToastRegionElement = indoku("div")
const colors: Record<ToastType, string> = { success: "status.success", error: "status.danger", warning: "status.warning", info: "status.info", loading: "fg.muted" }
function iconFor(type?: string) {
  if (type === "success") return <CheckCircle2 size={18} aria-hidden="true" />
  if (type === "error") return <AlertCircle size={18} aria-hidden="true" />
  if (type === "warning") return <AlertTriangle size={18} aria-hidden="true" />
  if (type === "info") return <Info size={18} aria-hidden="true" />
  if (type === "loading") return <LoaderCircle size={18} aria-hidden="true" className="indoku-toast-spinner" />
  return null
}
export interface ToasterProps extends Omit<React.ComponentProps<typeof ArkToaster>, "children" | "toaster"> { toaster?: CreateToasterReturn<React.ReactNode> }
export function Toaster({ toaster: instance = toaster, ...props }: ToasterProps) {
  return <Portal><ArkToaster toaster={instance} {...props}>{(item) => {
    const meta = (item.meta ?? {}) as ToastMeta
    const type = item.type as ToastType | undefined
    const icon = meta.icon === false ? null : meta.icon ?? iconFor(type)
    return <ToastRootElement display="flex" alignItems="flex-start" gap="10px" width="min(360px, calc(100vw - 32px))" p="14px" border="1px solid" borderColor="border.subtle" borderRadius="lg" style={{ borderInlineStartWidth: "3px", borderInlineStartColor: `var(--indoku-colors-${(type ? colors[type] : "border.subtle").replaceAll(".", "-")})` }} bg="bg.surface" color="fg.default" boxShadow="lg" data-type={type ?? "default"}>
      {icon && <span style={{ color: `var(--indoku-colors-${colors[type ?? "info"].replaceAll(".", "-")})`, flexShrink: 0 }}>{icon}</span>}
      <div style={{ minWidth: 0, flex: 1 }}>{item.title && <ToastTitleElement fontSize="14px" fontWeight="semibold">{item.title}</ToastTitleElement>}{item.description && <ToastDescriptionElement mt="3px" color="fg.muted" fontSize="13px">{item.description}</ToastDescriptionElement>}{meta.action && <ToastActionElement onClick={meta.action.onClick} mt="8px" fontSize="12px" fontWeight="medium" textDecoration="underline">{meta.action.label}</ToastActionElement>}</div>
      {item.closable && <ToastCloseElement type="button" aria-label="Dismiss notification" p="2px" borderRadius="sm" _hover={{ bg: "bg.subtle" }}><X size={14} aria-hidden="true" /></ToastCloseElement>}
    </ToastRootElement>
  }}</ArkToaster></Portal>
}
export const Toast = Object.assign(ToastRootElement, { Root: ToastRootElement, Title: ToastTitleElement, Description: ToastDescriptionElement, ActionTrigger: ToastActionElement, CloseTrigger: ToastCloseElement, Region: ToastRegionElement })
