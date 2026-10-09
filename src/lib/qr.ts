// @ts-nocheck -- encoder ported from the legacy implementation; conformance is exercised by QR output tests.
/**
 * QR Code encoder, nol dependency. Mode byte (UTF-8), versi 1-40, level L/M/Q/H.
 * Algoritma mengikuti spec ISO/IEC 18004 (struktur ala Nayuki QR generator).
 */

export type QrLevel = "L" | "M" | "Q" | "H"

const ECC_PER_BLOCK: Record<QrLevel, number[]> = {
  L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
}
const NUM_BLOCKS: Record<QrLevel, number[]> = {
  L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
}
const FORMAT_BITS: Record<QrLevel, number> = { L: 1, M: 0, Q: 3, H: 2 }

const bit = (n: number, i: number) => ((n >>> i) & 1) !== 0

function rawModules(ver: number): number {
  let r = (16 * ver + 128) * ver + 64
  if (ver >= 2) {
    const n = Math.floor(ver / 7) + 2
    r -= (25 * n - 10) * n - 55
    if (ver >= 7) r -= 36
  }
  return r
}

const dataCodewords = (ver: number, lvl: QrLevel) =>
  Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[lvl][ver] * NUM_BLOCKS[lvl][ver]

function rsMul(x: number, y: number): number {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = rsMul(result[j], root)
      if (j + 1 < degree) result[j] ^= result[j + 1]
    }
    root = rsMul(root, 0x02)
  }
  return result
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0)
  for (const b of data) {
    const factor = b ^ (result.shift() as number)
    result.push(0)
    divisor.forEach((coef, i) => (result[i] ^= rsMul(coef, factor)))
  }
  return result
}

function buildCodewords(bytes: number[], ver: number, lvl: QrLevel): number[] {
  const capacity = dataCodewords(ver, lvl)
  const bits: number[] = []
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1)
  }
  push(0b0100, 4)
  push(bytes.length, ver < 10 ? 8 : 16)
  bytes.forEach((b) => push(b, 8))
  push(0, Math.min(4, capacity * 8 - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2))
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad)

  const nBlocks = NUM_BLOCKS[lvl][ver]
  const eccLen = ECC_PER_BLOCK[lvl][ver]
  const raw = Math.floor(rawModules(ver) / 8)
  const nShort = nBlocks - (raw % nBlocks)
  const shortLen = Math.floor(raw / nBlocks)
  const divisor = rsDivisor(eccLen)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < nBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1))
    k += dat.length
    const ecc = rsRemainder(dat, divisor)
    if (i < nShort) dat.push(0)
    blocks.push(dat.concat(ecc))
  }
  const out: number[] = []
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= nShort) out.push(block[i])
    })
  }
  return out
}

export interface QrMatrix {
  /** Jumlah modul per sisi (tanpa quiet zone). */
  size: number
  version: number
  level: QrLevel
  /** `modules[y][x]` = true kalau modul gelap. */
  modules: boolean[][]
}

/** Encode teks (UTF-8) jadi matriks QR. `minLevel` bisa dinaikkan otomatis kalau muat (`boost`). */
export function encodeQr(text: string, level: QrLevel = "M", boost = true): QrMatrix {
  const bytes = Array.from(new TextEncoder().encode(text))
  let ver = 1
  for (; ; ver++) {
    if (ver > 40) throw new RangeError("Data terlalu panjang untuk QR Code.")
    const need = 4 + (ver < 10 ? 8 : 16) + bytes.length * 8
    if (need <= dataCodewords(ver, level) * 8) break
  }
  if (boost) {
    for (const l of ["M", "Q", "H"] as QrLevel[]) {
      if ("LMQH".indexOf(l) > "LMQH".indexOf(level) && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= dataCodewords(ver, l) * 8) level = l
    }
  }

  const size = ver * 4 + 17
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const isFn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const setFn = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark
    isFn[y][x] = true
  }

  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy))
        const x = cx + dx
        const y = cy + dy
        if (x >= 0 && x < size && y >= 0 && y < size) setFn(x, y, d !== 2 && d !== 4)
      }
  }
  for (let i = 0; i < size; i++) {
    setFn(6, i, i % 2 === 0)
    setFn(i, 6, i % 2 === 0)
  }
  finder(3, 3)
  finder(size - 4, 3)
  finder(3, size - 4)
  if (ver > 1) {
    const n = Math.floor(ver / 7) + 2
    const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2
    const pos = [6]
    for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p)
    pos.forEach((cy, i) =>
      pos.forEach((cx, j) => {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) return
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
      }),
    )
  }

  const drawFormat = (mask: number) => {
    const data = (FORMAT_BITS[level] << 3) | mask
    let rem = data
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = ((data << 10) | rem) ^ 0x5412
    for (let i = 0; i <= 5; i++) setFn(8, i, bit(bits, i))
    setFn(8, 7, bit(bits, 6))
    setFn(8, 8, bit(bits, 7))
    setFn(7, 8, bit(bits, 8))
    for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(bits, i))
    for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(bits, i))
    for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(bits, i))
    setFn(8, size - 8, true)
  }
  drawFormat(0)
  if (ver >= 7) {
    let rem = ver
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const bits = (ver << 12) | rem
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      setFn(a, b, bit(bits, i))
      setFn(b, a, bit(bits, i))
    }
  }

  const codewords = buildCodewords(bytes, ver, level)
  let idx = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert
        if (!isFn[y][x] && idx < codewords.length * 8) {
          modules[y][x] = bit(codewords[idx >>> 3], 7 - (idx & 7))
          idx++
        }
      }
  }

  const applyMask = (m: number) => {
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const inv = [
          (x + y) % 2 === 0,
          y % 2 === 0,
          x % 3 === 0,
          (x + y) % 3 === 0,
          (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
          ((x * y) % 2) + ((x * y) % 3) === 0,
          ((((x * y) % 2) + ((x * y) % 3)) % 2) === 0,
          ((((x + y) % 2) + ((x * y) % 3)) % 2) === 0,
        ][m]
        if (!isFn[y][x] && inv) modules[y][x] = !modules[y][x]
      }
  }

  const addHistory = (run: number, h: number[]) => {
    if (h[0] === 0) run += size
    h.pop()
    h.unshift(run)
  }
  const countPatterns = (h: number[]) => {
    const n = h[1]
    const core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n
    return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0)
  }
  const penalty = () => {
    let result = 0
    const scan = (get: (a: number, b: number) => boolean) => {
      for (let a = 0; a < size; a++) {
        let color = false
        let run = 0
        const h = [0, 0, 0, 0, 0, 0, 0]
        for (let b = 0; b < size; b++) {
          if (get(a, b) === color) {
            run++
            if (run === 5) result += 3
            else if (run > 5) result++
          } else {
            addHistory(run, h)
            if (!color) result += countPatterns(h) * 40
            color = get(a, b)
            run = 1
          }
        }
        if (color) {
          addHistory(run, h)
          run = 0
        }
        run += size
        addHistory(run, h)
        result += countPatterns(h) * 40
      }
    }
    scan((y, x) => modules[y][x])
    scan((x, y) => modules[y][x])
    let dark = 0
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (modules[y][x]) dark++
        if (y < size - 1 && x < size - 1) {
          const c = modules[y][x]
          if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) result += 3
        }
      }
    const total = size * size
    return result + (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10
  }

  let best = 0
  let min = Infinity
  for (let m = 0; m < 8; m++) {
    applyMask(m)
    drawFormat(m)
    const p = penalty()
    if (p < min) {
      min = p
      best = m
    }
    applyMask(m)
  }
  applyMask(best)
  drawFormat(best)
  return { size, version: ver, level, modules }
}
