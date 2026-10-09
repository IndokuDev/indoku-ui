import * as React from "react"
import { indoku } from "../primitives/indoku"

export type MessageAlign = "start" | "end"
export type AvatarPosition = "top" | "bottom" | "none"
const AlignContext = React.createContext<MessageAlign>("start")
const RootElement = indoku("div")
const AvatarElement = indoku("div")
const ContentElement = indoku("div")
const HeaderElement = indoku("div")
const FooterElement = indoku("div")
export interface MessageRootProps extends React.HTMLAttributes<HTMLDivElement> { align?: MessageAlign }
export function MessageRoot({ align = "start", children, ...props }: MessageRootProps) { return <AlignContext.Provider value={align}><RootElement display="flex" gap="10px" w="100%" flexDirection={align === "end" ? "row-reverse" : "row"} data-align={align} {...props}>{children}</RootElement></AlignContext.Provider> }
export interface MessageAvatarProps { children?: React.ReactNode }
export function MessageAvatar({ children }: MessageAvatarProps) { return <AvatarElement flexShrink={0} alignSelf="flex-end" w="28px" h="28px">{children}</AvatarElement> }
export type MessageContentProps = React.HTMLAttributes<HTMLDivElement>
export function MessageContent(props: MessageContentProps) { const align = React.useContext(AlignContext); return <ContentElement display="flex" flexDirection="column" gap="4px" minW="0" maxW="80%" alignItems={align === "end" ? "flex-end" : "flex-start"} {...props} /> }
export type MessageHeaderProps = React.HTMLAttributes<HTMLDivElement>
export function MessageHeader(props: MessageHeaderProps) { return <HeaderElement display="flex" alignItems="baseline" gap="6px" px="4px" fontSize="12px" color="fg.muted" {...props} /> }
export type MessageFooterProps = React.HTMLAttributes<HTMLDivElement>
export function MessageFooter(props: MessageFooterProps) { return <FooterElement px="4px" fontSize="12px" color="fg.muted" {...props} /> }
export interface MessageGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> { align?: MessageAlign; avatar?: React.ReactNode; avatarPosition?: AvatarPosition; header?: React.ReactNode; children?: React.ReactNode }
export function MessageGroup({ align = "start", avatar, avatarPosition = "bottom", header, children, ...props }: MessageGroupProps) { const showAvatar = avatarPosition !== "none" && Boolean(avatar); return <RootElement display="flex" gap="10px" w="100%" flexDirection={align === "end" ? "row-reverse" : "row"} {...props}>{showAvatar && <AvatarElement flexShrink={0} w="28px" h="28px" alignSelf={avatarPosition === "top" ? "flex-start" : "flex-end"}>{avatar}</AvatarElement>}<ContentElement display="flex" flexDirection="column" gap="4px" minW="0" maxW="80%" alignItems={align === "end" ? "flex-end" : "flex-start"}>{header && <HeaderElement display="flex" alignItems="baseline" gap="6px" px="4px" fontSize="12px" color="fg.muted">{header}</HeaderElement>}{children}</ContentElement></RootElement> }
export const Message = Object.assign(MessageRoot, { Root: MessageRoot, Avatar: MessageAvatar, Content: MessageContent, Header: MessageHeader, Footer: MessageFooter, Group: MessageGroup })
