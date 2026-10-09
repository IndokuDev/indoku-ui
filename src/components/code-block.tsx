import * as React from "react"
import { Copy, Check } from "lucide-react"
import { indoku } from "../primitives/indoku"
import { tokenizeLines, type TokenType } from "../lib/highlight"

const RootElement = indoku("div")
const Header = indoku("div")
const TitleElement = indoku("span")
const CopyTrigger = indoku("button")
const Pre = indoku("pre")
const Line = indoku("span")
const Token = indoku("span")
const ExpandTrigger = indoku("button")

const tokenColor: Record<TokenType, string | undefined> = {
  comment: "fg.muted",
  string: "status.success",
  number: "accent.default",
  keyword: "accent.default",
  fn: "accent.default",
  type: "status.info",
  tag: "status.danger",
  attr: "accent.default",
  plain: undefined,
}

export interface CodeBlockRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  code: string
  language?: string
  title?: React.ReactNode
  showLineNumbers?: boolean
  /** 1-based line numbers to highlight. */
  highlightLines?: number[]
  addedLines?: number[]
  removedLines?: number[]
  wrap?: boolean
  /** Initially clamp the code block to this many lines. */
  maxLines?: number
  /** Show the copy button. Defaults to true. */
  copyable?: boolean
}

function CodeBlockRoot({
  code,
  language = "text",
  title,
  showLineNumbers = false,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  wrap = false,
  maxLines,
  copyable = true,
  ...props
}: CodeBlockRootProps) {
  const trimmed = React.useMemo(() => code.replace(/^\n+|\s+$/g, ""), [code])
  const lines = React.useMemo(() => tokenizeLines(trimmed, language), [trimmed, language])
  const [copied, setCopied] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [copyFailed, setCopyFailed] = React.useState(false)
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  React.useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])
  const collapsible = maxLines !== undefined && maxLines > 0 && lines.length > maxLines
  const hasHeader = Boolean(title) || copyable

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable")
      await navigator.clipboard.writeText(trimmed)
      setCopied(true)
      setCopyFailed(false)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopyFailed(true)
    }
  }

  return (
    <RootElement border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.subtle" color="fg.default" overflow="hidden" minW="0" data-code-block="" {...props}>
      {hasHeader && (
        <Header display="flex" alignItems="center" justifyContent="space-between" gap="8px" px="12px" h="36px" borderBottom="1px solid" borderColor="border.subtle" fontSize="12px" color="fg.muted">
          <TitleElement fontWeight="medium" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{title ?? language}</TitleElement>
          {copyable && (
            <CopyTrigger type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"} display="inline-flex" alignItems="center" justifyContent="center" w="24px" h="24px" flexShrink="0" ml="auto" border="0" borderRadius="sm" bg="transparent" color="fg.muted" cursor="pointer" _hover={{ bg: "bg.subtle", color: "fg.default" }} _focusVisible={{ outline: "2px solid", outlineColor: "accent.default", outlineOffset: "2px" }}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            </CopyTrigger>
          )}
        </Header>
      )}
      {copyFailed && <span role="status" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>Could not copy code</span>}
      <Pre m="0" py="12px" overflow="auto" fontFamily="mono" fontSize="12px" lineHeight={1.7} tabIndex={0} whiteSpace={wrap ? "pre-wrap" : "pre"} wordBreak={wrap ? "break-word" : undefined} style={collapsible && !expanded ? { maxHeight: `calc(${maxLines} * 1.7em + 1.5rem)`, overflow: "hidden" } : undefined}>
        <code>
          {lines.map((line, index) => {
            const number = index + 1
            const state = addedLines.includes(number) ? "added" : removedLines.includes(number) ? "removed" : highlightLines.includes(number) ? "highlighted" : undefined
            return (
              <Line key={number} display="flex" px="12px" data-line={number} data-state={state} {...(state ? { bg: state === "added" ? "status.success.subtle" : state === "removed" ? "status.danger.subtle" : "bg.subtle" } : {})}>
                {showLineNumbers && <span aria-hidden="true" style={{ display: "inline-block", width: 32, flexShrink: 0, paddingRight: 12, textAlign: "right", userSelect: "none", color: "var(--indoku-colors-fg-muted)" }}>{number}</span>}
                <span style={{ flex: 1, minWidth: 0 }}>{line.length === 0 ? "\u200b" : line.map((part, partIndex) => part.type === "plain" ? part.value : <Token key={partIndex} {...(tokenColor[part.type] ? { color: tokenColor[part.type] } : {})} {...(part.type === "comment" ? { fontStyle: "italic" } : {})}>{part.value}</Token>)}</span>
              </Line>
            )
          })}
        </code>
      </Pre>
      {collapsible && (
        <ExpandTrigger type="button" onClick={() => setExpanded(value => !value)} w="100%" h="32px" borderTop="1px solid" borderColor="border.subtle" bg="transparent" color="fg.muted" fontSize="12px" cursor="pointer" _hover={{ bg: "bg.subtle", color: "fg.default" }}>
          {expanded ? "Show less" : `Show all ${lines.length} lines`}
        </ExpandTrigger>
      )}
    </RootElement>
  )
}

export const CodeBlock = Object.assign(CodeBlockRoot, { Root: CodeBlockRoot })
