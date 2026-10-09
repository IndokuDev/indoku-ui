import { renderToStaticMarkup } from "react-dom/server"
import { expect, test } from "vitest"
import { Box, Flex, Grid, Stack, Text, indoku } from "./index"

const render = (element: React.ReactElement) => renderToStaticMarkup(element)

test("Box renders a div and accepts style props", () => {
  const html = render(<Box p="4" data-testid="box">content</Box>)
  expect(html).toContain("<div")
  expect(html).toContain("data-testid=\"box\"")
  expect(html).toContain("content")
  expect(html).toContain("padding:var(--indoku-spacing-4)")
})

test("indoku supports custom elements and the as prop", () => {
  const Link = indoku("a")
  expect(render(<Link href="/docs">docs</Link>)).toContain("<a href=\"/docs\"")
  expect(render(<Box as="section">section</Box>)).toContain("<section")
})

test("layout primitives apply their defaults", () => {
  expect(render(<Stack />)).toContain("flex-direction:column")
  expect(render(<Flex />)).toContain("display:flex")
  expect(render(<Grid />)).toContain("display:grid")
})

test("Text defaults to a paragraph", () => {
  expect(render(<Text>hello</Text>)).toContain("<p")
})
