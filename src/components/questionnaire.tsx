import * as React from "react"
import { Button } from "./button"
import { Kbd } from "./kbd-group"
import { indoku } from "../primitives/indoku"

export interface Choice { value: string; label: React.ReactNode; description?: React.ReactNode }
export interface QuestionItem { name: string; prompt: React.ReactNode; description?: React.ReactNode; choices: Choice[]; multiple?: boolean; required?: boolean; input?: { label?: string; placeholder?: string } }
export interface Answer { choices: string[]; text: string }
export type Answers = Record<string, Answer>
export interface Labels { progress: (current: number, total: number) => string; previous: string; next: string; skip: string; submit: string; required: string }
const defaultLabels: Labels = { progress: (current, total) => `Question ${current} of ${total}`, previous: "Back", next: "Next", skip: "Skip", submit: "Submit", required: "Choose an answer to continue." }
export interface QuestionnaireRootProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "defaultValue"> { items: readonly QuestionItem[]; defaultValue?: Answers; onSubmit?: (answers: Answers) => void; onStepChange?: (step: number) => void; shortcuts?: boolean; labels?: Partial<Labels> }
const empty: Answer = { choices: [], text: "" }
const answered = (answer?: Answer) => !!answer && (answer.choices.length > 0 || answer.text.trim() !== "")
const FormElement = indoku("form")
const ProgressText = indoku("p")
const Fieldset = indoku("fieldset")
const Legend = indoku("legend")
const Description = indoku("span")
const ChoiceLabel = indoku("label")
const HiddenInput = indoku("input")
const IconWrap = indoku("span")
const ChoiceContent = indoku("span")
const ErrorText = indoku("p")
const Actions = indoku("div")
const TextInput = indoku("input")
export function QuestionnaireRoot({ items, defaultValue, onSubmit, onStepChange, shortcuts = true, labels: overrides, ...props }: QuestionnaireRootProps) {
  const labels = React.useMemo(() => ({ ...defaultLabels, ...overrides }), [overrides])
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Answers>(defaultValue ?? {})
  const [error, setError] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const id = React.useId()
  if (items.length === 0) return null
  const item = items[Math.min(step, items.length - 1)]!
  const answer = answers[item.name] ?? empty
  const last = step === items.length - 1
  const update = (next: Answer) => { setError(false); setAnswers((previous) => ({ ...previous, [item.name]: next })) }
  const pick = (value: string) => { if (item.multiple) { const has = answer.choices.includes(value); update({ ...answer, choices: has ? answer.choices.filter((entry) => entry !== value) : [...answer.choices, value] }) } else update({ choices: [value], text: "" }) }
  const go = (to: number) => { setStep(to); setError(false); onStepChange?.(to); requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[data-question]")?.focus()) }
  const advance = (final: Answers) => last ? onSubmit?.(final) : go(step + 1)
  return <FormElement ref={formRef} noValidate display="flex" flexDirection="column" gap="16px" width="100%" maxW="560px" onSubmit={(event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (item.required && !answered(answer)) { setError(true); return } advance(answers) }} onKeyDown={(event: React.KeyboardEvent<HTMLFormElement>) => { if (!shortcuts || event.metaKey || event.ctrlKey || event.altKey) return; if ((event.target as HTMLElement).tagName === "INPUT" && (event.target as HTMLInputElement).type === "text") return; const index = "abcdefghijklmnopqrstuvwxyz".indexOf(event.key.toLowerCase()); if (event.key.length === 1 && index >= 0 && index < item.choices.length) { event.preventDefault(); pick(item.choices[index]!.value) } }} {...props}>
    <ProgressText m="0" fontSize="12px" color="fg.muted" aria-live="polite">{labels.progress(step + 1, items.length)}</ProgressText>
    <Fieldset m="0" p="0" border="0" minW="0" display="flex" flexDirection="column" gap="12px" aria-describedby={`${id}-description ${id}-error`}>
      <Legend p="0" mb="2px" data-question="" tabIndex={-1} outline="none"><span style={{ display: "block", fontWeight: 600 }}>{item.prompt}</span>{item.description && <Description id={`${id}-description`} display="block" mt="4px" fontSize="14px" color="fg.muted" fontWeight="normal">{item.description}</Description>}</Legend>
      {item.choices.map((choice, index) => { const checked = answer.choices.includes(choice.value); return <ChoiceLabel key={choice.value} data-checked={checked ? "" : undefined} display="flex" alignItems="flex-start" gap="12px" p="12px" border="1px solid" borderColor={checked ? "border.default" : "border.subtle"} borderRadius="lg" cursor="pointer" bg={checked ? "bg.subtle" : "bg.surface"} _hover={{ bg: "bg.subtle" }} css={{ "&:has(input:focus-visible)": { outline: "2px solid var(--indoku-colors-accent-default)", outlineOffset: "2px" } }}>
        <HiddenInput type={item.multiple ? "checkbox" : "radio"} name={`${id}-${item.name}`} value={choice.value} checked={checked} onChange={() => pick(choice.value)} position="absolute" opacity={0} width="1px" height="1px" overflow="hidden" />
        <IconWrap mt="2px" aria-hidden="true" display="inline-flex" alignItems="center" justifyContent="center" w="18px" h="18px" flexShrink={0} border="1px solid" borderColor={checked ? "accent.default" : "border.default"} borderRadius={item.multiple ? "sm" : "full"} bg={checked ? "accent.default" : "transparent"} color="primary.foreground">{checked ? item.multiple ? "✓" : <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} /> : null}</IconWrap>
        <ChoiceContent display="flex" flexDirection="column" flex="1" minW="0" fontSize="14px"><span style={{ fontWeight: 500 }}>{choice.label}</span>{choice.description && <span style={{ color: "var(--indoku-colors-fg-muted)" }}>{choice.description}</span>}</ChoiceContent>{shortcuts && <Kbd aria-hidden="true">{String.fromCharCode(65 + index)}</Kbd>}
      </ChoiceLabel> })}
      {item.input && <TextInput type="text" aria-label={item.input.label ?? "Other answer"} placeholder={item.input.placeholder ?? "Type another answer…"} value={answer.text} onChange={(event: React.ChangeEvent<HTMLInputElement>) => update({ choices: item.multiple ? answer.choices : [], text: event.target.value })} h="36px" px="10px" border="1px solid" borderColor="border.subtle" borderRadius="md" bg="bg.surface" color="fg.default" />}
    </Fieldset>
    <ErrorText id={`${id}-error`} role="alert" m="0" fontSize="14px" color="status.danger" hidden={!error}>{error ? labels.required : null}</ErrorText>
    <Actions display="flex" justifyContent="flex-end" gap="8px">{step > 0 && <Button type="button" variant="ghost" mr="auto" onClick={() => go(step - 1)}>{labels.previous}</Button>}{!item.required && <Button type="button" variant="outline" onClick={() => { const next = { ...answers, [item.name]: empty }; setAnswers(next); advance(next) }}>{labels.skip}</Button>}<Button type="submit">{last ? labels.submit : labels.next}</Button></Actions>
  </FormElement>
}
export const Questionnaire = Object.assign(QuestionnaireRoot, { Root: QuestionnaireRoot })
