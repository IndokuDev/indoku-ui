import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("pre"), Code = indoku("code")
export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> { code?: string; language?: string; showLineNumbers?: boolean; }
export function CodeBlock({ code, language, showLineNumbers = false, children, ...props }: CodeBlockProps) { const content = code ?? children; return <Root overflow="auto" p="16px" border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.subtle" color="fg.default" fontSize="13px" lineHeight="1.65" fontFamily="mono" tabIndex={0} {...props}><Code>{showLineNumbers && typeof content === "string" ? content.split("\n").map((line, i) => `${String(i + 1).padStart(2, " ")}  ${line}`).join("\n") : content}</Code></Root> }
