import * as React from "react"

export type Direction = "ltr" | "rtl"
const DirectionContext = React.createContext<Direction>("ltr")
export interface DirectionRootProps { dir: Direction; children?: React.ReactNode }
export function DirectionRoot({ dir, children }: DirectionRootProps) { return <DirectionContext.Provider value={dir}><div dir={dir} style={{ display: "contents" }}>{children}</div></DirectionContext.Provider> }
export function useDirection() { return React.useContext(DirectionContext) }
export function useDocumentDirection(dir: Direction) {
  React.useEffect(() => {
    const previous = document.documentElement.dir
    document.documentElement.dir = dir
    return () => { document.documentElement.dir = previous }
  }, [dir])
}
export const Direction = Object.assign(DirectionRoot, { Root: DirectionRoot })
