import type { System } from "../system"

export type ResponsiveValue<T> =
  | T
  | T[]
  | Partial<Record<string, T>>

export type StyleValue = ResponsiveValue<string | number>

export interface StyleProps {
  m?: StyleValue
  mt?: StyleValue
  mr?: StyleValue
  me?: StyleValue
  mb?: StyleValue
  ml?: StyleValue
  ms?: StyleValue
  mx?: StyleValue
  my?: StyleValue
  p?: StyleValue
  pt?: StyleValue
  pr?: StyleValue
  pe?: StyleValue
  pb?: StyleValue
  pl?: StyleValue
  ps?: StyleValue
  px?: StyleValue
  py?: StyleValue
  gap?: StyleValue
  rowGap?: StyleValue
  columnGap?: StyleValue
  w?: StyleValue
  width?: StyleValue
  minW?: StyleValue
  maxW?: StyleValue
  h?: StyleValue
  height?: StyleValue
  minH?: StyleValue
  maxH?: StyleValue
  display?: StyleValue
  pos?: StyleValue
  position?: StyleValue
  inset?: StyleValue
  top?: StyleValue
  right?: StyleValue
  bottom?: StyleValue
  left?: StyleValue
  zIndex?: StyleValue
  overflow?: StyleValue
  overflowX?: StyleValue
  overflowY?: StyleValue
  color?: StyleValue
  bg?: StyleValue
  background?: StyleValue
  bgColor?: StyleValue
  opacity?: StyleValue
  fontFamily?: StyleValue
  fontSize?: StyleValue
  fontWeight?: StyleValue
  lineHeight?: StyleValue
  letterSpacing?: StyleValue
  textAlign?: StyleValue
  textTransform?: StyleValue
  textDecoration?: StyleValue
  border?: StyleValue
  borderWidth?: StyleValue
  borderStyle?: StyleValue
  borderColor?: StyleValue
  borderTop?: StyleValue
  borderRight?: StyleValue
  borderBottom?: StyleValue
  borderLeft?: StyleValue
  rounded?: StyleValue
  borderRadius?: StyleValue
  shadow?: StyleValue
  boxShadow?: StyleValue
  flex?: StyleValue
  flexDirection?: StyleValue
  flexWrap?: StyleValue
  alignItems?: StyleValue
  alignContent?: StyleValue
  justifyContent?: StyleValue
  alignSelf?: StyleValue
  order?: StyleValue
  columns?: ResponsiveValue<number>
  templateColumns?: StyleValue
  gridTemplateColumns?: StyleValue
  gridTemplateRows?: StyleValue
  gridColumn?: StyleValue
  gridRow?: StyleValue
  cursor?: StyleValue
  pointerEvents?: StyleValue
  userSelect?: StyleValue
  transition?: StyleValue
  transform?: StyleValue
  animation?: StyleValue
  css?: Record<string, unknown>
  [key: string]: unknown
}

export type StylePropsWithoutCss = Omit<StyleProps, "css">

export interface StyleEngineResult {
  style: Record<string, unknown>
  rest: Record<string, unknown>
}

export type StyleEngine = (
  props: StyleProps & Record<string, unknown>,
  system: System,
) => StyleEngineResult
