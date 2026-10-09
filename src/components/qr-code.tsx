import * as React from "react"
import { encodeQr, type QrLevel, type QrMatrix } from "../lib/qr"
import { indoku } from "../primitives/indoku"

interface QrContextValue { matrix: QrMatrix; quietZone: number; fill: string; background: string; label: string }
const QrContext = React.createContext<QrContextValue | null>(null)
function useQr() { const context = React.useContext(QrContext); if (!context) throw new Error("QrCode.Frame must be used inside QrCode.Root"); return context }
export function useQrMatrix(value: string, level: QrLevel = "M", boost = true): QrMatrix { return React.useMemo(() => encodeQr(value, level, boost), [value, level, boost]) }
const RootElement = indoku("div")
const FrameElement = indoku("svg")
const OverlayElement = indoku("div")
export interface QrCodeRootProps extends React.HTMLAttributes<HTMLDivElement> { value: string; level?: QrLevel; noBoost?: boolean; quietZone?: number; fill?: string; background?: string; label?: string; children?: React.ReactNode }
export function QrCodeRoot({ value, level = "M", noBoost, quietZone = 2, fill = "#09090b", background = "#ffffff", label = "QR code", children, ...props }: QrCodeRootProps) {
  const matrix = useQrMatrix(value, level, !noBoost)
  const context = React.useMemo(() => ({ matrix, quietZone, fill, background, label }), [matrix, quietZone, fill, background, label])
  return <QrContext.Provider value={context}><RootElement position="relative" display="inline-flex" w="160px" h="160px" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="border.subtle" style={{ backgroundColor: background }} {...props}>{children ?? <QrCodeFrame />}</RootElement></QrContext.Provider>
}
export type QrCodeFrameProps = React.SVGAttributes<SVGSVGElement>
export function QrCodeFrame(props: QrCodeFrameProps) {
  const { matrix, quietZone, fill, label } = useQr()
  const total = matrix.size + quietZone * 2
  const path = React.useMemo(() => { let output = ""; matrix.modules.forEach((row, y) => { for (let x = 0; x < row.length; x++) { if (!row[x]) continue; let width = 1; while (x + width < row.length && row[x + width]) width++; output += `M${x + quietZone} ${y + quietZone}h${width}v1h-${width}z`; x += width - 1 } }); return output }, [matrix, quietZone])
  return <FrameElement viewBox={`0 0 ${total} ${total}`} role="img" aria-label={label} shapeRendering="crispEdges" w="100%" h="100%" {...props}><path d={path} fill={fill} /></FrameElement>
}
export interface QrCodeOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}
export function QrCodeOverlay({ style, ...props }: QrCodeOverlayProps) { const { background } = useQr(); return <OverlayElement position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" display="flex" alignItems="center" justifyContent="center" w="20%" h="20%" p="4px" borderRadius="sm" style={{ backgroundColor: background, ...style }} {...props} /> }
export const QrCode = Object.assign(QrCodeRoot, { Root: QrCodeRoot, Frame: QrCodeFrame, Overlay: QrCodeOverlay })
