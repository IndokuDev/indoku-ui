import * as React from "react"
import { indoku } from "../primitives/indoku"

export interface KatexLike { renderToString: (latex: string, options?: Record<string, unknown>) => string }
export interface MathRendererProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> { latex: string; display?: boolean; katex?: KatexLike }
const MathElement = indoku("span")
export function MathRenderer({ latex, display = false, katex, ...props }: MathRendererProps) {
  const [html, setHtml] = React.useState<string | null>(null)
  React.useEffect(() => {
    let cancelled = false
    void (async () => { try { let loadedKatex = katex
      if (!loadedKatex) {
        const optionalPackage: string = "katex"
        loadedKatex = (await import(/* @vite-ignore */ optionalPackage)).default as unknown as KatexLike
      }
      const module = loadedKatex; const result = module.renderToString(latex, { displayMode: display, throwOnError: false, output: "htmlAndMathml" }); if (!cancelled) setHtml(result) } catch { if (!cancelled) setHtml(null) } })()
    return () => { cancelled = true }
  }, [latex, display, katex])
  if (html == null) return <MathElement fontFamily="monospace" fontSize="0.9em" display={display ? "block" : "inline"} textAlign={display ? "center" : undefined} {...props}>{latex}</MathElement>
  return <MathElement display={display ? "block" : "inline"} overflowX={display ? "auto" : undefined} dangerouslySetInnerHTML={{ __html: html }} {...props} />
}
export interface FormulaVariable { symbol: string; meaning: React.ReactNode }
export interface FormulaBlockProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> { latex: string; title?: React.ReactNode; description?: React.ReactNode; variables?: FormulaVariable[]; katex?: KatexLike }
const Figure = indoku("figure")
const Text = indoku("div")
const Box = indoku("div")
export function FormulaBlock({ latex, title, description, variables, katex, ...props }: FormulaBlockProps) {
  return <Figure border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" p="16px" m="0" {...props}>{title && <Text fontWeight="medium" mb="4px">{title}</Text>}{description && <Text color="fg.muted" fontSize="14px" mb="8px">{description}</Text>}<Box py="12px" fontSize="18px"><MathRenderer latex={latex} display katex={katex} /></Box>{variables && variables.length > 0 && <Box borderTop="1px solid" borderColor="border.subtle" pt="12px" display="grid" gridTemplateColumns="auto 1fr" columnGap="16px" rowGap="4px" fontSize="14px">{variables.map((variable) => <React.Fragment key={variable.symbol}><MathRenderer latex={variable.symbol} katex={katex} /><Text color="fg.muted">{variable.meaning}</Text></React.Fragment>)}</Box>}</Figure>
}
