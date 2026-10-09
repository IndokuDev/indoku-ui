import * as React from "react"
import { indoku } from "../primitives/indoku"

const GroupElement = indoku("span")
const KbdElement = indoku("kbd")
export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> { separator?: React.ReactNode }
export function KbdGroup({ separator, children, ...props }: KbdGroupProps) {
  const items = React.Children.toArray(children)
  return <GroupElement display="inline-flex" alignItems="center" gap="4px" color="fg.muted" fontSize="12px" {...props}>{items.map((child, index) => <React.Fragment key={index}>{index > 0 && separator != null && <span aria-hidden="true">{separator}</span>}{child}</React.Fragment>)}</GroupElement>
}
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}
export function Kbd(props: KbdProps) { return <KbdElement as="kbd" display="inline-flex" alignItems="center" justifyContent="center" minW="20px" px="5px" py="2px" border="1px solid" borderColor="border.subtle" borderRadius="sm" bg="bg.subtle" color="fg.default" fontFamily="monospace" fontSize="12px" lineHeight={1.2} {...props} /> }
