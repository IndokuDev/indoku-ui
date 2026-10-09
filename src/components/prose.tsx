import * as React from "react"
import { indoku } from "../primitives/indoku"

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> { size?: "md" | "lg" }
const ProseElement = indoku("div")
export function Prose({ size = "md", ...props }: ProseProps) {
  const large = size === "lg"
  return <ProseElement maxW="65ch" color="fg.default" fontSize={large ? "18px" : "16px"} lineHeight={1.75} css={{
    "& > :first-child": { marginTop: 0 }, "& > :last-child": { marginBottom: 0 },
    "& h1, & h2, & h3, & h4": { fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em", marginTop: "1.75em", marginBottom: "0.6em" },
    "& h1": { fontSize: large ? "2.5em" : "2.25em", marginTop: 0 }, "& h2": { fontSize: "1.6em" }, "& h3": { fontSize: "1.3em" }, "& h4": { fontSize: "1.1em" },
    "& p, & ul, & ol, & pre, & table, & blockquote, & figure": { marginTop: "1em", marginBottom: "1em" },
    "& a": { color: "var(--indoku-colors-accent-default)", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 500 },
    "& strong, & b": { fontWeight: 600 }, "& ul": { listStyle: "disc", paddingInlineStart: "1.5em" }, "& ol": { listStyle: "decimal", paddingInlineStart: "1.5em" },
    "& li": { marginTop: "0.35em", marginBottom: "0.35em" }, "& li::marker": { color: "var(--indoku-colors-fg-muted)" },
    "& blockquote": { borderInlineStart: "3px solid var(--indoku-colors-border-default)", paddingInlineStart: "1em", color: "var(--indoku-colors-fg-muted)", fontStyle: "italic" },
    "& hr": { border: 0, borderTop: "1px solid var(--indoku-colors-border-subtle)", marginBlock: "2em" },
    "& code": { fontFamily: "var(--indoku-fonts-mono, monospace)", fontSize: "0.875em", background: "var(--indoku-colors-bg-subtle)", padding: "0.15em 0.4em", borderRadius: "var(--indoku-radii-sm)" },
    "& pre": { background: "var(--indoku-colors-bg-subtle)", padding: "1em", borderRadius: "var(--indoku-radii-lg)", overflowX: "auto", fontSize: "0.875em" }, "& pre code": { background: "transparent", padding: 0 },
    "& kbd": { fontFamily: "inherit", fontSize: "0.8em", fontWeight: 500, background: "var(--indoku-colors-bg-subtle)", padding: "0.1em 0.45em", borderRadius: "var(--indoku-radii-sm)", border: "1px solid var(--indoku-colors-border-subtle)" },
    "& mark": { background: "var(--indoku-colors-status-warning)", color: "var(--indoku-colors-fg-default)", padding: "0 0.2em", borderRadius: "var(--indoku-radii-sm)" },
    "& img": { maxWidth: "100%", height: "auto", borderRadius: "var(--indoku-radii-lg)" }, "& table": { width: "100%", borderCollapse: "collapse", fontSize: "0.9em" },
    "& th, & td": { textAlign: "start", padding: "0.6em 0.8em", borderBottom: "1px solid var(--indoku-colors-border-subtle)" }, "& th": { fontWeight: 600, color: "var(--indoku-colors-fg-muted)" },
  }} {...props} />
}
