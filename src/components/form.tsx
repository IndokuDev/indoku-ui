import * as React from "react"
import { indoku } from "../primitives/indoku"
import { Label } from "./label"

export type Validator<V, Values> = (value: V, values: Values) => string | undefined
export interface UseFormOptions<Values extends object> { defaultValues: Values; validators?: { [K in keyof Values]?: Validator<Values[K], Values> }; onSubmit: (values: Values) => void | Promise<void> }
export interface FieldMeta { error?: string; touched: boolean; invalid: boolean }
export interface InputProps<K, V> { name: string; value: V; onChange: (event: { target: { value: V } }) => void; onBlur: () => void; onValueChange: (value: V) => void; __key?: K }
export interface UseFormReturn<Values extends object> {
  values: Values; errors: Partial<Record<keyof Values, string>>; touched: Partial<Record<keyof Values, boolean>>; isSubmitting: boolean; isValid: boolean
  setValue: <K extends keyof Values>(name: K, value: Values[K]) => void; setValues: (patch: Partial<Values>) => void
  getFieldMeta: <K extends keyof Values>(name: K) => FieldMeta; getInputProps: <K extends keyof Values>(name: K) => InputProps<K, Values[K]>
  validateAll: () => boolean; handleSubmit: (event?: { preventDefault?: () => void }) => Promise<void>; reset: (nextValues?: Values) => void
}
export function useForm<Values extends object>({ defaultValues, validators, onSubmit }: UseFormOptions<Values>): UseFormReturn<Values> {
  const [values, setValuesState] = React.useState<Values>(defaultValues)
  const [errors, setErrors] = React.useState<Partial<Record<keyof Values, string>>>({})
  const [touched, setTouched] = React.useState<Partial<Record<keyof Values, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const valuesRef = React.useRef(values)
  valuesRef.current = values
  const validateField = React.useCallback(<K extends keyof Values>(name: K, value: Values[K]) => validators?.[name]?.(value, valuesRef.current), [validators])
  const setValue = React.useCallback(<K extends keyof Values>(name: K, value: Values[K]) => {
    valuesRef.current = { ...valuesRef.current, [name]: value }
    setValuesState(valuesRef.current)
    setTouched((previous) => previous[name] ? previous : { ...previous, [name]: true })
    const error = validateField(name, value)
    setErrors((previous) => { const next = { ...previous }; if (error) next[name] = error; else delete next[name]; return next })
  }, [validateField])
  const setValues = React.useCallback((patch: Partial<Values>) => { valuesRef.current = { ...valuesRef.current, ...patch }; setValuesState(valuesRef.current) }, [])
  const getFieldMeta = React.useCallback(<K extends keyof Values>(name: K): FieldMeta => { const error = errors[name]; const isTouched = !!touched[name]; return { error, touched: isTouched, invalid: isTouched && !!error } }, [errors, touched])
  const getInputProps = React.useCallback(<K extends keyof Values>(name: K): InputProps<K, Values[K]> => ({ name: String(name), value: values[name], onChange: (event) => setValue(name, event.target.value), onValueChange: (value) => setValue(name, value), onBlur: () => { setTouched((previous) => ({ ...previous, [name]: true })); const error = validateField(name, valuesRef.current[name]); setErrors((previous) => { const next = { ...previous }; if (error) next[name] = error; else delete next[name]; return next }) } }), [values, setValue, validateField])
  const validateAll = React.useCallback(() => { const nextErrors: Partial<Record<keyof Values, string>> = {}; const nextTouched: Partial<Record<keyof Values, boolean>> = {}; for (const name of Object.keys(validators ?? {}) as (keyof Values)[]) { nextTouched[name] = true; const error = validateField(name, valuesRef.current[name]); if (error) nextErrors[name] = error } setTouched((previous) => ({ ...previous, ...nextTouched })); setErrors(nextErrors); return Object.keys(nextErrors).length === 0 }, [validators, validateField])
  const handleSubmit = React.useCallback(async (event?: { preventDefault?: () => void }) => { event?.preventDefault?.(); if (!validateAll()) return; setIsSubmitting(true); try { await onSubmit(valuesRef.current) } finally { setIsSubmitting(false) } }, [validateAll, onSubmit])
  const reset = React.useCallback((nextValues?: Values) => { const next = nextValues ?? defaultValues; valuesRef.current = next; setValuesState(next); setErrors({}); setTouched({}); setIsSubmitting(false) }, [defaultValues])
  return { values, errors, touched, isSubmitting, isValid: Object.keys(errors).length === 0, setValue, setValues, getFieldMeta, getInputProps, validateAll, handleSubmit, reset }
}

const FieldRoot = indoku("div")
const HelperText = indoku("div")
const ErrorText = indoku("div")
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> { meta: FieldMeta; label?: React.ReactNode; helperText?: React.ReactNode; required?: boolean; children: React.ReactNode }
export function FormField({ meta, label, helperText, required, children, ...props }: FieldProps) {
  const id = React.useId()
  const childId = React.isValidElement(children) ? (children.props as { id?: string }).id ?? id : id
  const errorId = `${childId}-error`
  const helperId = `${childId}-helper`
  let child: React.ReactNode = children
  if (React.isValidElement(children)) {
    const childProps: Record<string, unknown> = { ...(children.props as Record<string, unknown>), id: childId, "aria-invalid": meta.invalid || undefined, "aria-describedby": meta.error ? errorId : helperText ? helperId : undefined }
    if (children.type === "input") delete childProps.onValueChange
    child = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, childProps)
  }
  return <FieldRoot display="flex" flexDirection="column" gap="6px" {...props}>{label && <Label htmlFor={childId} required={required}>{label}</Label>}{child}{helperText && !meta.error && <HelperText id={helperId} fontSize="12px" color="fg.muted">{helperText}</HelperText>}{meta.error && <ErrorText id={errorId} role="alert" fontSize="12px" color="status.danger">{meta.error}</ErrorText>}</FieldRoot>
}
export { FormField as Field }
export const Form = Object.assign(indoku("form"), { Field: FormField })
