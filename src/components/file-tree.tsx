import * as React from "react"
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { TreeView as ArkTreeView, createTreeCollection, useTreeViewContext } from "@ark-ui/react/tree-view"
import { indoku } from "../primitives/indoku"

export interface FileTreeNode {
  id: string
  name: string
  /** Presence of children, including an empty array, identifies a folder. */
  children?: FileTreeNode[]
  /** Optional icon override for this node. */
  icon?: React.ReactNode
}
type IconProp = React.ReactNode | ((node: FileTreeNode) => React.ReactNode)
export interface FileTreeProps extends Omit<React.ComponentProps<typeof ArkTreeView.Root>, "collection" | "children"> {
  items: FileTreeNode[]
  label?: React.ReactNode
  folderIcon?: IconProp
  folderOpenIcon?: IconProp
  fileIcon?: IconProp
  showChevron?: boolean
  indentGuides?: boolean
}
const RootElement = indoku(ArkTreeView.Root)
const LabelElement = indoku(ArkTreeView.Label)
const TreeElement = indoku(ArkTreeView.Tree)
const BranchElement = indoku(ArkTreeView.Branch)
const BranchControlElement = indoku(ArkTreeView.BranchControl)
const BranchContentElement = indoku(ArkTreeView.BranchContent)
const BranchIndicatorElement = indoku(ArkTreeView.BranchIndicator)
const BranchTextElement = indoku(ArkTreeView.BranchText)
const ItemElement = indoku(ArkTreeView.Item)
const ItemTextElement = indoku(ArkTreeView.ItemText)
const IndentGuideElement = indoku(ArkTreeView.BranchIndentGuide)
const iconProps = { size: 16, strokeWidth: 1.7, "aria-hidden": true as const }
const pick = (icon: IconProp | undefined, node: FileTreeNode, fallback: React.ReactNode) =>
  node.icon ?? (typeof icon === "function" ? icon(node) : icon ?? fallback)

interface TreeNodeViewProps {
  node: FileTreeNode
  indexPath: number[]
  folderIcon?: IconProp
  folderOpenIcon?: IconProp
  fileIcon?: IconProp
  showChevron: boolean
  indentGuides: boolean
}
function TreeNodeView({ node, indexPath, folderIcon, folderOpenIcon, fileIcon, showChevron, indentGuides }: TreeNodeViewProps) {
  const tree = useTreeViewContext()
  const nodeState = tree.getNodeState({ node, indexPath })
  const nodeProps = { "aria-label": node.name }
  return (
    <ArkTreeView.NodeProvider node={node} indexPath={indexPath}>
      {nodeState.isBranch ? (
        <BranchElement>
          <BranchControlElement {...nodeProps}>
            {showChevron && <BranchIndicatorElement><ChevronRight {...iconProps} /></BranchIndicatorElement>}
            {pick(nodeState.expanded ? folderOpenIcon : folderIcon, node, nodeState.expanded ? <FolderOpen {...iconProps} /> : <Folder {...iconProps} />)}
            <BranchTextElement>{node.name}</BranchTextElement>
          </BranchControlElement>
          <BranchContentElement>
            {indentGuides && <IndentGuideElement />}
            {node.children?.map((child, index) => (
              <TreeNodeView key={child.id} node={child} indexPath={[...indexPath, index]} folderIcon={folderIcon} folderOpenIcon={folderOpenIcon} fileIcon={fileIcon} showChevron={showChevron} indentGuides={indentGuides} />
            ))}
          </BranchContentElement>
        </BranchElement>
      ) : (
        <ItemElement {...nodeProps}>
          {pick(fileIcon, node, <FileText {...iconProps} />)}
          <ItemTextElement>{node.name}</ItemTextElement>
        </ItemElement>
      )}
    </ArkTreeView.NodeProvider>
  )
}

export function FileTree({ items, label, folderIcon, folderOpenIcon, fileIcon, showChevron = true, indentGuides = true, ...props }: FileTreeProps) {
  const collection = React.useMemo(() => createTreeCollection<FileTreeNode>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    nodeToChildren: (node) => node.children ?? [],
    rootNode: { id: "ROOT", name: "", children: items },
  }), [items])
  return (
    <RootElement collection={collection} {...props} css={{
      "& [data-part=tree]": { display: "flex", flexDirection: "column", gap: "2px" },
      "& [data-part=branch-control], & [data-part=item]": { display: "flex", alignItems: "center", gap: "8px", minHeight: "32px", px: "8px", borderRadius: "md", fontSize: "14px", color: "fg.default", cursor: "pointer" },
      "& [data-part=branch-control][data-selected], & [data-part=item][data-selected]": { bg: "bg.subtle" },
      "& [data-part=branch-control]:focus-visible, & [data-part=item]:focus-visible": { outline: "2px solid", outlineColor: "accent.default", outlineOffset: "-2px" },
      "& [data-part=branch-indent-guide]": { borderInlineStart: "1px solid", borderColor: "border.subtle", marginInlineStart: "10px" },
      "& [data-part=branch-indicator] svg": { transition: "transform 120ms ease" },
      "& [data-part=branch-control][data-state=open] [data-part=branch-indicator] svg": { transform: "rotate(90deg)" },
    }}>
      {label && <LabelElement fontSize="13px" fontWeight="medium" color="fg.muted" mb="6px">{label}</LabelElement>}
      <TreeElement>
        {items.map((node, index) => <TreeNodeView key={node.id} node={node} indexPath={[index]} folderIcon={folderIcon} folderOpenIcon={folderOpenIcon} fileIcon={fileIcon} showChevron={showChevron} indentGuides={indentGuides} />)}
      </TreeElement>
    </RootElement>
  )
}
