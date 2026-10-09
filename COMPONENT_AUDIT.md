# Component rewrite audit

Generated from the public source files in `../ui-old/src/components` and `src/components` for the current rewrite. This is a module/export inventory, not a claim that behavior or API parity is complete.

- Legacy component modules: **42**
- Matching Indoku component modules: **42**
- Direct Chakra imports or Chakra-specific calls found under `src/`: **0** at the time of this audit.
- Dependency tree search for Chakra package names: **no matches** at the time of this audit.

| Legacy module | Indoku module | Legacy public declarations | Indoku public declarations |
|---|---|---|---|
| `attachment` | `attachment` | RootProps, Root, MediaProps, Media, Content, Name, MetaProps, Meta, AttachmentStatus, StatusProps, Status, Actions, ActionProps, Action, Remove, Group | AttachmentStatus, AttachmentRootProps, AttachmentRoot, AttachmentMediaProps, AttachmentMedia, AttachmentContentProps, AttachmentContent, AttachmentNameProps, AttachmentName, AttachmentMetaProps, AttachmentMeta, AttachmentStatusProps, AttachmentStatusView, AttachmentActionsProps, AttachmentActions, AttachmentActionProps, AttachmentAction, AttachmentRemove, AttachmentGroupProps, AttachmentGroup, Attachment |
| `bubble` | `bubble` | BubbleAlign, BubbleVariant, RootProps, Root, Content, Footer, ActionProps, Action, CollapsibleProps, Collapsible | BubbleAlign, BubbleVariant, BubbleRootProps, BubbleRoot, BubbleContentProps, BubbleContent, BubbleFooterProps, BubbleFooter, BubbleActionProps, BubbleAction, BubbleCollapsibleProps, BubbleCollapsible, Bubble |
| `button-group` | `button-group` | RootProps, Root | ButtonGroupProps, ButtonGroup |
| `calendar` | `calendar` | RootProps, Root | CalendarRootProps, CalendarRoot, CalendarLabelProps, CalendarLabel, CalendarControlProps, CalendarControl, CalendarInputProps, CalendarInput, CalendarTriggerProps, CalendarTrigger, CalendarPositionerProps, CalendarPositioner, CalendarContentProps, CalendarContent, CalendarViewProps, CalendarView, CalendarViewControlProps, CalendarViewControl, CalendarViewTriggerProps, CalendarViewTrigger, CalendarPrevTriggerProps, CalendarPrevTrigger, CalendarNextTriggerProps, CalendarNextTrigger, CalendarRangeTextProps, CalendarRangeText, CalendarTableProps, CalendarTable, CalendarTableHeaderProps, CalendarTableHeader, CalendarTableBodyProps, CalendarTableBody, CalendarTableRowProps, CalendarTableRow, CalendarTableCellProps, CalendarTableCell, CalendarTableCellTriggerProps, CalendarTableCellTrigger, CalendarDayTableProps, CalendarDayTable, CalendarMonthSelectProps, CalendarMonthSelect, CalendarYearSelectProps, CalendarYearSelect, CalendarClearTriggerProps, CalendarClearTrigger, Calendar |
| `chart` | `chart` | chartTokens, ChartValue, ChartSeries, ChartFormat, compactFormat, sortChartData, niceDomain, UseChartOptions, ChartApi, useChart, ChartLegendProps, ChartLegend, ReferenceLineSpec, CartesianGridProps, CartesianGrid, ChartAxisProps, ChartAxis, LineChartProps, LineChart, AreaChartProps, AreaChart, BarChartProps, BarChart, HistogramProps, Histogram, RangeDatum, RangeBarChartProps, RangeBarChart, CandleDatum, CandlestickChartProps, CandlestickChart, BarSegmentDatum, BarSegmentProps, BarSegment, PieDatum, PieChartProps, PieChart, RadialTextProps, RadialText, DonutChartProps, DonutChart, RadarChartProps, RadarChart, ScatterPoint, ScatterSeries, ScatterChartProps, ScatterChart, SparklineProps, Sparkline | chartTokens, ChartValue, ChartSeries, ChartFormat, compactFormat, sortChartData, niceDomain, UseChartOptions, ChartApi, useChart, ChartLegendProps, ChartLegend, ReferenceLineSpec, CartesianGridProps, ChartAxisProps, CommonChartProps, LineChartProps, AreaChartProps, BarChartProps, LineChart, AreaChart, BarChart, PieDatum, PieChartProps, PieChart, DonutChartProps, DonutChart, SparklineProps, Sparkline, RadialText, HistogramProps, Histogram, BarSegmentDatum, BarSegmentProps, BarSegment, ScatterPoint, ScatterSeries, ScatterChartProps, ScatterChart, RadarChartProps, RadarChart, RangeDatum, RangeBarChartProps, RangeBarChart, CandleDatum, CandlestickChartProps, CandlestickChart, CartesianGrid, ChartAxis |
| `code-block` | `code-block` | RootProps, Root | CodeBlockRootProps, CodeBlock |
| `command` | `command` | commandScore, RootProps, Root, Input, List, Empty, GroupProps, Group, ItemProps, Item, Separator, Shortcut, DialogProps, Dialog | commandScore, RootProps, Root, InputProps, Input, ListProps, List, EmptyProps, Empty, GroupProps, Group, ItemProps, Item, SeparatorProps, Separator, ShortcutProps, Shortcut, DialogProps, CommandDialog, Command |
| `data-table` | `data-table` | DataTableColumn, SortDirection, SortState, DataTableLabels, useDataTable, RootProps, Root, Toolbar, Search, ColumnToggle, Table, Pagination | DataTableColumn, SortDirection, SortState, DataTableLabels, useDataTable, RootProps, Root, ToolbarProps, Toolbar, SearchProps, Search, ColumnToggle, TableProps, Table, Pagination, DataTable |
| `date-fields` | `date-fields` | DatePickerFieldProps, DatePickerField, DateInputFieldProps, DateInputField, parseDate, today, getLocalTimeZone | DatePickerFieldProps, DatePickerField, DateInputFieldProps, DateInputField, parseDate, today, getLocalTimeZone |
| `direction` | `direction` | Direction, RootProps, Root, useDirection, useDocumentDirection | Direction, DirectionRootProps, DirectionRoot, useDirection, useDocumentDirection |
| `empty` | `empty` | RootProps, Root, Header, MediaProps, Media, Title, Description, Content | EmptyRootProps, EmptyRoot, EmptyIndicatorProps, EmptyIndicator, EmptyTitleProps, EmptyTitle, EmptyDescriptionProps, EmptyDescription, EmptyContentProps, EmptyContent, Empty |
| `file-tree` | `file-tree` | FileTreeNode, FileTreeProps, FileTree | FileTreeNode, FileTreeProps, FileTree |
| `flash` | `flash` | FlashType, FlashProps, Flash | FlashType, FlashProps, Flash |
| `form` | `form` | Validator, UseFormOptions, FieldMeta, InputProps, UseFormReturn, useForm, FieldProps, FormField, Field | Validator, UseFormOptions, FieldMeta, InputProps, UseFormReturn, useForm, FieldProps, FormField, Form, Field |
| `graph2d` | `graph2d` | GraphViewport, GraphFunction, GraphPoint, Graph2DProps, Graph2D, CartesianCanvas | GraphViewport, GraphFunction, GraphPoint, Graph2DProps, Graph2D, CartesianCanvas |
| `input-otp` | `input-otp` | REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS, RootProps, Root, Group, SlotProps, Slot, Separator | REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS, InputOTPRootProps, InputOTPRoot, InputOTPGroupProps, InputOTPGroup, InputOTPSlotProps, InputOTPSlot, InputOTPSeparatorProps, InputOTPSeparator, InputOTP |
| `item` | `item` | RootProps, Root, Media, Content, Title, Description, Actions | ItemProps, Item |
| `kbd-group` | `kbd-group` | KbdGroupProps, KbdGroup | KbdGroupProps, KbdGroup, KbdProps, Kbd |
| `label` | `label` | LabelProps, Label | LabelProps, Label |
| `marker` | `marker` | Separator, MarkerTone, StatusProps, Status, Row, TypingIndicator | MarkerTone, MarkerSeparatorProps, Separator, MarkerStatusProps, Status, MarkerRowProps, Row, TypingIndicatorProps, TypingIndicator, Marker |
| `math` | `math` | KatexLike, MathRendererProps, MathRenderer, FormulaBlockProps, FormulaBlock | KatexLike, MathRendererProps, MathRenderer, FormulaVariable, FormulaBlockProps, FormulaBlock |
| `menubar` | `menubar` | Root, MenuProps, MenuItem, Item, CheckboxItem, RadioItemGroup, RadioItem, ItemGroup, ItemGroupLabel, Separator, ItemCommand, ItemIndicator | MenubarRootProps, MenubarRoot, MenubarMenuProps, MenubarMenuItem, Menubar |
| `message-scroller` | `message-scroller` | useMessageScroller, RootProps, Root, ScrollToBottomButton | useMessageScroller, MessageScrollerRootProps, MessageScrollerRoot, ScrollToBottomButtonProps, ScrollToBottomButton, MessageScroller |
| `message` | `message` | MessageAlign, RootProps, Root, Avatar, Content, Header, Footer, AvatarPosition, GroupProps, Group | MessageAlign, AvatarPosition, MessageRootProps, MessageRoot, MessageAvatarProps, MessageAvatar, MessageContentProps, MessageContent, MessageHeaderProps, MessageHeader, MessageFooterProps, MessageFooter, MessageGroupProps, MessageGroup, Message |
| `model-lab` | `model-lab` | ModelLabProps, ModelLab | ModelLabProps, ModelLab |
| `navigation-menu` | `navigation-menu` | RootProps, Root, List, Item, Trigger, Link, Content, ContentGridProps, ContentGrid, ContentLinkProps, ContentLink | NavigationMenuRootProps, NavigationMenuRoot, NavigationMenuListProps, NavigationMenuList, NavigationMenuItemProps, NavigationMenuItem, NavigationMenuTriggerProps, NavigationMenuTrigger, NavigationMenuContentProps, NavigationMenuContent, NavigationMenuLinkProps, NavigationMenuLink, NavigationMenuIndicatorProps, NavigationMenuIndicator, NavigationMenuItemIndicatorProps, NavigationMenuItemIndicator, NavigationMenuViewportProps, NavigationMenuViewport, NavigationMenuViewportPositionerProps, NavigationMenuViewportPositioner, NavigationMenuArrowProps, NavigationMenuArrow, NavigationMenu |
| `pagination` | `pagination` | Pagination | PaginationRootProps, PaginationRoot, PaginationContentProps, PaginationContent, PaginationPreviousProps, PaginationPrevious, PaginationNextProps, PaginationNext, PaginationPagesProps, PaginationPages, PaginationPageTextProps, PaginationPageText, Pagination |
| `password-input` | `password-input` | PasswordInputProps, PasswordInput, passwordStrength, PasswordStrengthMeterProps, PasswordStrengthMeter | PasswordInputProps, PasswordInput, passwordStrength, PasswordStrengthMeterProps, PasswordStrengthMeter |
| `periodic-table` | `periodic-table` | PeriodicElement, PeriodicTableProps, PeriodicTable | PeriodicElement, PeriodicTableProps, PeriodicTable |
| `plot2d` | `plot2d` | Plot2DProps, Plot2D | Plot2DProps, Plot2D |
| `plot3d` | `plot3d` | Plot3DProps, Plot3D | Plot3DProps, Plot3D |
| `prose` | `prose` | ProseProps, Prose | ProseProps, Prose |
| `qr-code` | `qr-code` | useQrMatrix, RootProps, Root, Frame, Overlay | useQrMatrix, QrCodeRootProps, QrCodeRoot, QrCodeFrameProps, QrCodeFrame, QrCodeOverlayProps, QrCodeOverlay, QrCode |
| `questionnaire` | `questionnaire` | Choice, QuestionItem, Answer, Answers, Labels, RootProps, Root | Choice, QuestionItem, Answer, Answers, Labels, QuestionnaireRootProps, QuestionnaireRoot, Questionnaire |
| `resizable` | `resizable` | PanelProps, PanelGroupProps, PanelGroup, Panel, HandleProps, Handle, Root | PanelGroupProps, PanelGroup, PanelProps, Panel, HandleProps, Handle, Resizable |
| `rich-text-editor` | `rich-text-editor` | sanitizeHtml, RootProps, Root, Toolbar, ControlGroup, ControlProps, Control, Bold, Italic, Underline, Strikethrough, H1, H2, H3, Blockquote, BulletList, OrderedList, AlignLeft, AlignCenter, AlignRight, Code, Link, Hr, Undo, Redo, ContentProps, Content, Basic | sanitizeHtml, RichTextEditorRootProps, RichTextEditorRoot, RichTextEditorToolbarProps, RichTextEditorToolbar, RichTextEditorControlGroupProps, RichTextEditorControlGroup, RichTextEditorControlProps, RichTextEditorControl, Bold, Italic, Underline, StrikethroughControl, H1, H2, H3, Blockquote, BulletList, OrderedList, AlignLeftControl, AlignCenterControl, AlignRightControl, CodeControl, LinkControl, HorizontalRule, Undo, Redo, RichTextEditorContentProps, RichTextEditorContent, Basic, RichTextEditor |
| `scroll-area` | `scroll-area` | RootProps, Root | ScrollAreaRootProps, ScrollAreaRoot, ScrollAreaViewportProps, ScrollAreaViewport, ScrollAreaContentProps, ScrollAreaContent, ScrollAreaScrollbarProps, ScrollAreaScrollbar, ScrollAreaThumbProps, ScrollAreaThumb, ScrollAreaCornerProps, ScrollAreaCorner, ScrollArea |
| `sidebar` | `sidebar` | useSidebar, ProviderProps, Provider, Root, Header, Content, Footer, Group, GroupLabel, Menu, MenuItem, MenuButtonProps, MenuButton, Trigger, Inset | useSidebar, ProviderProps, Provider, RootProps, Root, Header, Content, Footer, Group, GroupLabel, Menu, MenuItem, MenuButtonProps, MenuButton, TriggerProps, Trigger, Inset, Sidebar |
| `time` | `time` | TimeProps, Time | TimeProps, Time |
| `toast` | `toast` | ToastType, ToastOptions, toaster, toast, ToasterProps, ToasterView, createToaster, Toaster | ToastType, ToastOptions, toaster, toast, ToasterProps, Toaster, Toast, createToaster |
| `toggle-group` | `toggle-group` | RootProps, Root, ItemProps, Item | ToggleGroupType, ToggleGroupVariant, ToggleGroupRootProps, ToggleGroupItemProps, ToggleGroup |
| `toggle` | `toggle` | ToggleProps, Toggle | ToggleProps, Toggle |

## Audit limitations

- Export declaration names are harvested syntactically; they do not establish compatible signatures or runtime behavior.
- Some Indoku components intentionally use named compound aliases while legacy components used namespace exports; `src/index.ts` is the authoritative package surface.
- Continue checking controlled/uncontrolled state, ARIA, keyboard navigation, pointer/touch behavior, responsive layout, SSR, semantic tokens, and all legacy props against the source and tests.
- Any item marked as a first port in `PROGRESS.md` remains incomplete until its stated parity gaps are closed and validated.

## Public package-entry audit (Batch 0)

The following checks compare the explicit exports in `../ui-old/src/index.ts` with `src/index.ts`. This intentionally excludes the legacy blanket `export * from "@chakra-ui/react"`: those Chakra exports are not to be reintroduced into Indoku UI.

### Confirmed legacy entry exports missing from the current entry

These symbols exist in current source modules or have obvious current equivalents, but are not re-exported from `src/index.ts`:

| Legacy public name | Current source / equivalent | Audit classification |
|---|---|---|
| `ButtonGroupRootProps` | `ButtonGroupProps` in `components/button-group.tsx` | Compatibility type alias candidate |
| `CodeBlockRootProps` | `CodeBlockRootProps` in `components/code-block.tsx` | Export omission; source type exists |
| `ItemRootProps` | `ItemProps` in `components/item.tsx` | Compatibility type alias candidate |
| `ResizablePanelGroupProps` | `PanelGroupProps` in `components/resizable.tsx` | Compatibility type alias candidate |
| `ResizablePanelProps` | `PanelProps` in `components/resizable.tsx` | Compatibility type alias candidate |
| `usePlayer`, `PlayerBar`, `UsePlayerOptions`, `PlayerState` | `lib/player.tsx` | Export omission; source symbols exist |
| `encodeQr`, `QrLevel`, `QrMatrix` | `lib/qr.ts` | Export omission; source symbols exist |
| `tokenize`, `tokenizeLines` | `lib/highlight.ts` | Export omission; source functions exist |
| `Scene2DLike`, `Item2DLike`, `Scene3DLike`, `Obj3DLike`, `Mesh3DLike`, `StatLike`, `ModelCatalogLike`, `ModelInfoLike`, `ParamSpecLike`, `ParamValuesLike` | `lib/scene-types.ts` | Type export omissions; source types exist |
| `RadialTextProps` | `components/chart` | Verify/export if current component props are intended public API |

### API changes that need an explicit compatibility decision

- `system`: the legacy entry exported a Chakra theme `system`. The current entry exposes `createSystem`, `useSystem`, `defaultSystem`, and `defaultTheme`. Do **not** restore the old Chakra object or runtime; decide whether an Indoku `system` alias is appropriate under the rewrite contract.
- `EmptyMediaProps`: legacy `Empty` has a `Media` part, while the current compound API exposes `Indicator`. These are not proven semantically equivalent by the name inventory. Review expected behavior and choose a compatibility adapter or document the intentional rename.
- `Resizable.Root`: legacy module has a `Root` name; the current module uses `Resizable`/`PanelGroup`. Confirm namespace compatibility and expected root behavior.
- Legacy namespace exports (for example `Item`, `ButtonGroup`, `Resizable`, `Empty`) are represented as compound objects in current modules, but named top-level exports and exact subpart aliases differ. Validate import forms separately; module-name parity does not establish namespace parity.

### Important interpretation

The earlier automated name scan was a lexical comparison, not a TypeScript symbol-resolution test. Its raw “missing names” count must not be treated as a verified list by itself. The rows above are source-inspected candidates and migration decisions; they are not implemented in this audit-only batch. Batch 0 must still map every module's public props, compound parts, callbacks, controlled/uncontrolled behavior, and accessibility requirements before implementation begins.

## Batch 0 baseline validation

Run on 2026-10-10 in the current working tree:

- `npm run typecheck` — passed.
- `npm test` — passed, 10 test files / 114 tests.
- `npm run build` — passed, ESM, CJS, and TypeScript declaration outputs.
- `git diff --check` — passed.
- Source scan under `src/` for `@chakra-ui` imports or `chakra(` calls — no matches.
- Full `npm ls --all` output filtered for Chakra package names — no matches at the time of audit.

These are baseline checks for the current tree, not evidence of complete legacy behavior parity.
