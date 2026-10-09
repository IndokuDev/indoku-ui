import * as React from "react"
import { indoku } from "../primitives/indoku"
const Root = indoku("div"), Media = indoku("div"), Content = indoku("div"), Title = indoku("div"), Description = indoku("div"), End = indoku("div"), Actions = indoku("div")
export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> { title?: React.ReactNode; description?: React.ReactNode; startElement?: React.ReactNode; endElement?: React.ReactNode; variant?: "outline" | "subtle" | "plain"; interactive?: boolean; }
function ItemRoot({ title, description, startElement, endElement, variant = "plain", interactive = false, children, ...props }: ItemProps) {
  const hasSummaryProps = title !== undefined || description !== undefined || startElement !== undefined || endElement !== undefined
  return <Root display="flex" alignItems="center" gap="12px" p={variant === "plain" ? "0" : "12px"} border={variant === "outline" ? "1px solid" : "none"} borderColor="border.subtle" borderRadius="lg" bg={variant === "subtle" ? "bg.subtle" : "transparent"} cursor={interactive ? "pointer" : undefined} _hover={interactive ? { bg: "bg.subtle" } : undefined} {...props}>
    {hasSummaryProps ? <>
      {startElement !== undefined && <Media display="flex" alignItems="center" justifyContent="center" flexShrink={0}>{startElement}</Media>}
      <Content flex="1" minW="0" display="flex" flexDirection="column" gap="4px">{title !== undefined && <Title fontSize="14px" fontWeight="medium">{title}</Title>}{description !== undefined && <Description fontSize="13px" color="fg.muted">{description}</Description>}{children}</Content>
      {endElement !== undefined && <End flexShrink={0}>{endElement}</End>}
    </> : children}
  </Root>
}

export const Item = Object.assign(ItemRoot, {
  Root: ItemRoot,
  Media: (props: React.HTMLAttributes<HTMLDivElement>) => <Media display="flex" alignItems="center" justifyContent="center" flexShrink={0} boxSize="36px" borderRadius="md" bg="bg.subtle" {...props} />,
  Content: (props: React.HTMLAttributes<HTMLDivElement>) => <Content display="flex" flexDirection="column" gap="8px" minW="0" flex="1" {...props} />,
  Title: (props: React.HTMLAttributes<HTMLParagraphElement>) => <Title as="p" m="0" fontSize="14px" fontWeight="medium" color="fg.default" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" {...props} />,
  Description: (props: React.HTMLAttributes<HTMLParagraphElement>) => <Description as="p" m="0" fontSize="12px" color="fg.muted" {...props} />,
  End,
  Actions,
})
export type ItemRootProps = ItemProps
