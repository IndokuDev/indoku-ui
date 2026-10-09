import * as React from "react"
import { Button } from "../components/button"
import { indoku } from "../primitives/indoku"

export interface UsePlayerOptions { duration: number; loop?: boolean; autoPlay?: boolean; speed?: number }
export interface PlayerState { t: number; playing: boolean; speed: number; duration: number; play(): void; pause(): void; toggle(): void; seek(t: number): void; setSpeed(speed: number): void }
const Bar = indoku("div")
const Time = indoku("span")
const SliderTrack = indoku("div")
const prefersReduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
export function usePlayer({ duration, loop = true, autoPlay, speed: initialSpeed = 1 }: UsePlayerOptions): PlayerState {
  const [t, setT] = React.useState(0), [playing, setPlaying] = React.useState(false), [speed, setSpeed] = React.useState(initialSpeed)
  const timeRef = React.useRef(0)
  React.useEffect(() => { timeRef.current = 0; setT(0); setPlaying(duration > 0 && (autoPlay ?? !prefersReduced())) }, [duration, autoPlay])
  React.useEffect(() => {
    if (!playing || duration <= 0) return
    let frame = 0, last = performance.now()
    const tick = (now: number) => {
      let next = timeRef.current + ((now - last) / 1000) * speed; last = now
      if (next >= duration) { if (loop) next %= duration; else { next = duration; setPlaying(false) } }
      timeRef.current = next; setT(next); frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, duration, loop, speed])
  const seek = React.useCallback((value: number) => { const next = Math.max(0, Math.min(duration, value)); timeRef.current = next; setT(next) }, [duration])
  return { t, playing, speed, duration, play: () => { if (timeRef.current >= duration) seek(0); setPlaying(true) }, pause: () => setPlaying(false), toggle: () => setPlaying((value) => !value), seek, setSpeed }
}
const SPEEDS = [0.25, 0.5, 1, 2]
export function PlayerBar({ player }: { player: PlayerState }) {
  const { t, duration, playing, speed } = player
  const seekFromPointer = (event: React.PointerEvent<HTMLDivElement>) => { const rect = event.currentTarget.getBoundingClientRect(); if (rect.width) player.seek(((event.clientX - rect.left) / rect.width) * duration) }
  return <Bar display="flex" alignItems="center" gap="3" px="3" py="2" borderTop="1px solid" borderColor="border.subtle" fontSize="xs" flexWrap="wrap">
    <Button size="xs" variant="outline" onClick={player.toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? "Pause" : "Play"}</Button>
    <SliderTrack role="slider" aria-label="Time" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={t} aria-valuetext={`${t.toFixed(2)} seconds`} tabIndex={0} flex="1" minWidth="80px" height="8px" borderRadius="full" bg="bg.muted" position="relative" cursor="pointer" onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => { event.currentTarget.setPointerCapture(event.pointerId); seekFromPointer(event) }} onPointerMove={(event: React.PointerEvent<HTMLDivElement>) => { if (event.buttons) seekFromPointer(event) }} onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => { if (event.key === "ArrowRight") { event.preventDefault(); player.seek(t + duration / 100) } else if (event.key === "ArrowLeft") { event.preventDefault(); player.seek(t - duration / 100) } else if (event.key === "Home") { event.preventDefault(); player.seek(0) } else if (event.key === "End") { event.preventDefault(); player.seek(duration) } }}>
      <div style={{ width: `${duration > 0 ? (t / duration) * 100 : 0}%`, height: "100%", borderRadius: "inherit", background: "var(--indoku-colors-accent-default)" }} />
    </SliderTrack>
    <Time color="fg.muted" style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{t.toFixed(2)} / {duration.toFixed(2)} s</Time>
    <Bar display="flex" gap="1">{SPEEDS.map((value) => <Button key={value} size="xs" variant={value === speed ? "solid" : "ghost"} onClick={() => player.setSpeed(value)}>{value}x</Button>)}</Bar>
  </Bar>
}
