/** Shared shadcn-like control heights used across form and action components. */
export const controlHeights = {
  xs: "24px",
  sm: "28px",
  md: "32px",
  lg: "36px",
} as const

export type ControlSize = keyof typeof controlHeights
