import { expect, test } from "vitest"
import { encodeQr, tokenize, tokenizeLines, version } from "./index"

test("exports version", () => {
  expect(version).toBe("0.0.1")
})


test("exports legacy utility helpers from the package entry", () => {
  expect(tokenize("const value = 1", "ts").length).toBeGreaterThan(0)
  expect(tokenizeLines("one\ntwo")).toHaveLength(2)
  const qr = encodeQr("Indoku UI")
  expect(qr.size).toBeGreaterThan(0)
  expect(qr.modules).toHaveLength(qr.size)
})

test("keeps legacy form and questionnaire type aliases in the public entry", async () => {
  // Runtime import guards the public entry while typecheck validates the aliases.
  const entry = await import("./index")
  expect(entry.Form).toBeDefined()
  expect(entry.Questionnaire).toBeDefined()
})
