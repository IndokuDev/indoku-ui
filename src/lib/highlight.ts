/** Highlighter sederhana tanpa dependency (pengganti Shiki/Highlight.js). Cukup untuk docs & snippet. */

export type TokenType = "comment" | "string" | "number" | "keyword" | "fn" | "type" | "tag" | "attr" | "plain"
export interface Token {
  type: TokenType
  value: string
}

const JS_KW =
  "const|let|var|function|return|if|else|for|while|do|import|export|from|default|class|extends|new|async|await|try|catch|finally|throw|switch|case|break|continue|typeof|instanceof|in|of|interface|type|enum|implements|public|private|protected|readonly|as|null|undefined|true|false|this|void|static|get|set|yield|satisfies|keyof|declare|namespace"
const PY_KW =
  "def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|raise|with|lambda|pass|break|continue|yield|in|is|not|and|or|None|True|False|self|async|await|global"
const SH_KW =
  "if|then|else|elif|fi|for|do|done|while|case|esac|function|in|echo|cd|export|source|sudo|exit|return|npm|npx|yarn|pnpm|bun|git|node|curl|mkdir|rm|cp|mv|ls"

const str = String.raw`"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`
const num = String.raw`\b0x[\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b`

type Rule = [TokenType, RegExp]
const sticky = (s: string) => new RegExp(s, "y")

const js: Rule[] = [
  ["comment", sticky(String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`)],
  ["string", sticky(str + "|" + "`(?:\\\\[\\s\\S]|[^`\\\\])*`")],
  ["tag", sticky(String.raw`<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s/>])`)],
  ["number", sticky(num)],
  ["keyword", sticky(String.raw`\b(?:${JS_KW})\b`)],
  ["fn", sticky(String.raw`[A-Za-z_$][\w$]*(?=\s*\()`)],
  ["type", sticky(String.raw`\b[A-Z][\w$]*\b`)],
]
const html: Rule[] = [
  ["comment", sticky(String.raw`<!--[\s\S]*?-->`)],
  ["tag", sticky(String.raw`<\/?[A-Za-z][\w:.-]*|\/?>`)],
  ["string", sticky(str)],
  ["attr", sticky(String.raw`[\w:@.-]+(?==)`)],
]
const css: Rule[] = [
  ["comment", sticky(String.raw`\/\*[\s\S]*?\*\/`)],
  ["string", sticky(str)],
  ["keyword", sticky(String.raw`@[\w-]+`)],
  ["attr", sticky(String.raw`--?[\w-]+(?=\s*:)|[a-z-]+(?=\s*:)`)],
  ["number", sticky(String.raw`#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?`)],
  ["fn", sticky(String.raw`[\w-]+(?=\()`)],
]
const json: Rule[] = [
  ["attr", sticky(String.raw`"(?:\\.|[^"\\])*"(?=\s*:)`)],
  ["string", sticky(String.raw`"(?:\\.|[^"\\])*"`)],
  ["number", sticky(String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`)],
  ["keyword", sticky(String.raw`\b(?:true|false|null)\b`)],
]
const py: Rule[] = [
  ["comment", sticky(String.raw`#[^\n]*`)],
  ["string", sticky(String.raw`"""[\s\S]*?"""|'''[\s\S]*?'''|` + str)],
  ["number", sticky(num)],
  ["keyword", sticky(String.raw`\b(?:${PY_KW})\b`)],
  ["fn", sticky(String.raw`[A-Za-z_]\w*(?=\s*\()`)],
]
const sh: Rule[] = [
  ["comment", sticky(String.raw`#[^\n]*`)],
  ["string", sticky(str)],
  ["type", sticky(String.raw`\$\{?[\w@#?*]+\}?`)],
  ["attr", sticky(String.raw`--?[\w-]+`)],
  ["keyword", sticky(String.raw`\b(?:${SH_KW})\b`)],
  ["number", sticky(num)],
]

const langs: Record<string, Rule[]> = {
  js, jsx: js, ts: js, tsx: js, javascript: js, typescript: js, mjs: js,
  html, xml: html, svg: html, vue: html,
  css, scss: css,
  json, jsonc: json,
  py, python: py,
  sh, bash: sh, shell: sh, zsh: sh,
}

export function tokenize(code: string, language = "text"): Token[] {
  const rules = langs[language.toLowerCase()]
  if (!rules) return [{ type: "plain", value: code }]
  const out: Token[] = []
  let plain = ""
  const flush = () => {
    if (plain) out.push({ type: "plain", value: plain })
    plain = ""
  }
  let i = 0
  outer: while (i < code.length) {
    // karakter pembentuk kata yang bukan awal token dilewati utuh, biar "foo-bar" tidak terpotong jadi opsi/angka
    for (const [type, re] of rules) {
      re.lastIndex = i
      const m = re.exec(code)
      if (m && m[0].length > 0) {
        flush()
        out.push({ type, value: m[0] })
        i += m[0].length
        continue outer
      }
    }
    plain += code[i++]
  }
  flush()
  return out
}

/** Pecah token jadi baris (token multi-baris dipotong per baris). */
export function tokenizeLines(code: string, language?: string): Token[][] {
  const lines: Token[][] = [[]]
  for (const t of tokenize(code, language)) {
    t.value.split("\n").forEach((p, idx) => {
      if (idx > 0) lines.push([])
      if (p) lines[lines.length - 1]!.push({ type: t.type, value: p })
    })
  }
  return lines
}
