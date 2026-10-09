import * as React from "react"
import { indoku } from "../primitives/indoku"

export const REGEXP_ONLY_DIGITS = /^[0-9]*$/
export const REGEXP_ONLY_CHARS = /^[a-zA-Z]*$/
export const REGEXP_ONLY_DIGITS_AND_CHARS = /^[a-zA-Z0-9]*$/
interface OtpContextValue { value: string; maxLength: number; focused: boolean; invalid: boolean; disabled: boolean }
const OtpContext = React.createContext<OtpContextValue | null>(null)
const RootElement = indoku("div")
const GroupElement = indoku("div")
const SlotElement = indoku("div")
const SeparatorElement = indoku("div")
export interface InputOTPRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  maxLength: number; value?: string; defaultValue?: string; onChange?: (value: string) => void; onComplete?: (value: string) => void
  pattern?: RegExp; disabled?: boolean; invalid?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; name?: string; autoFocus?: boolean
}
export function InputOTPRoot({ maxLength, value: controlled, defaultValue = "", onChange, onComplete, pattern = REGEXP_ONLY_DIGITS, disabled = false, invalid = false, inputMode, name, autoFocus, children, ...props }: InputOTPRootProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [focused, setFocused] = React.useState(false)
  const ref = React.useRef<HTMLInputElement>(null)
  const value = controlled ?? internal
  const syncSelection = React.useCallback(() => {
    const input = ref.current
    if (!input) return
    const length = input.value.length
    const start = length < maxLength ? length : maxLength - 1
    const end = length < maxLength ? length : maxLength
    if (input.selectionStart !== start || input.selectionEnd !== end) input.setSelectionRange(start, end)
  }, [maxLength])
  React.useEffect(() => { if (focused) syncSelection() }, [value, focused, syncSelection])
  const set = (next: string) => { if (next === value) return; if (controlled === undefined) setInternal(next); onChange?.(next); if (next.length === maxLength) onComplete?.(next) }
  return <OtpContext.Provider value={{ value, maxLength, focused, invalid, disabled }}><RootElement position="relative" display="inline-flex" alignItems="center" gap="8px" data-disabled={disabled ? "" : undefined} opacity={disabled ? 0.5 : undefined} {...props}>{children}<input ref={ref} value={value} name={name} disabled={disabled} autoFocus={autoFocus} maxLength={maxLength} inputMode={inputMode ?? (pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text")} autoComplete="one-time-code" aria-invalid={invalid || undefined} spellCheck={false} onChange={(event) => { const clean = Array.from(event.target.value).filter((char) => { pattern.lastIndex = 0; return pattern.test(char) }).join("").slice(0, maxLength); set(clean) }} onFocus={() => { setFocused(true); requestAnimationFrame(syncSelection) }} onBlur={() => setFocused(false)} onSelect={syncSelection} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, border: 0, padding: 0, margin: 0, cursor: disabled ? "not-allowed" : "text", caretColor: "transparent", fontSize: 16 }} /></RootElement></OtpContext.Provider>
}
export type InputOTPGroupProps = React.HTMLAttributes<HTMLDivElement>
export function InputOTPGroup(props: InputOTPGroupProps) { return <GroupElement display="flex" alignItems="center" css={{ "& > [data-slot]": { marginInlineStart: "-1px" }, "& > [data-slot]:first-of-type": { marginInlineStart: 0, borderStartStartRadius: "var(--indoku-radii-md)", borderEndStartRadius: "var(--indoku-radii-md)" }, "& > [data-slot]:last-of-type": { borderStartEndRadius: "var(--indoku-radii-md)", borderEndEndRadius: "var(--indoku-radii-md)" } }} {...props} /> }
export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> { index: number }
export function InputOTPSlot({ index, ...props }: InputOTPSlotProps) {
  const context = React.useContext(OtpContext)
  if (!context) throw new Error("InputOTP.Slot must be used inside InputOTP.Root")
  const character = context.value[index]
  const activeIndex = context.value.length < context.maxLength ? context.value.length : context.maxLength - 1
  const active = context.focused && !context.disabled && index === activeIndex
  return <SlotElement data-slot="" data-active={active ? "" : undefined} data-invalid={context.invalid ? "" : undefined} position="relative" display="flex" alignItems="center" justifyContent="center" w="36px" h="36px" border="1px solid" borderColor="border.subtle" bg="bg.surface" fontSize="14px" css={{ "&[data-invalid]": { borderColor: "status.danger" }, "&[data-active]": { zIndex: 1, borderColor: "fg.muted", outline: "3px solid", outlineColor: "border.subtle" }, "&[data-active][data-invalid]": { outlineColor: "status.danger", borderColor: "status.danger" } }} {...props}>{character}{active && !character && <span aria-hidden="true" style={{ position: "absolute", width: 1, height: 16, background: "currentColor", animation: "indoku-typing 1.2s ease-in-out infinite" }} />}</SlotElement>
}
export type InputOTPSeparatorProps = React.HTMLAttributes<HTMLDivElement>
export function InputOTPSeparator(props: InputOTPSeparatorProps) { return <SeparatorElement role="separator" display="flex" alignItems="center" color="fg.muted" {...props}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></SeparatorElement> }
export const InputOTP = Object.assign(InputOTPRoot, { Root: InputOTPRoot, Group: InputOTPGroup, Slot: InputOTPSlot, Separator: InputOTPSeparator })
