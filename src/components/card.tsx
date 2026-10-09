import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("section"), Header = indoku("div"), Title = indoku("h3"), Description = indoku("p"), Content = indoku("div"), Footer = indoku("div")
export interface CardProps extends React.HTMLAttributes<HTMLElement> { variant?: "outline" | "elevated"; }
export function Card({ variant = "outline", ...props }: CardProps) { return <Root border="1px solid" borderColor="border.subtle" borderRadius="xl" bg="bg.surface" color="fg.default" boxShadow={variant === "elevated" ? "md" : "none"} overflow="hidden" {...props} /> }
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) { return <Header display="flex" flexDirection="column" gap="6px" p="24px" {...props} /> }
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) { return <Title fontSize="18px" fontWeight="semibold" lineHeight="1.3" {...props} /> }
export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) { return <Description fontSize="14px" color="fg.muted" lineHeight="1.5" {...props} /> }
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) { return <Content px="24px" pb="24px" {...props} /> }
export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) { return <Footer display="flex" alignItems="center" px="24px" pb="24px" gap="8px" {...props} /> }
