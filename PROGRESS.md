# PROGRESS.md

Handoff file. Any AI or human continuing this project: read this first, update it at the end of every session, then commit and push.

## Goal

IndokuUI: standalone UI library, no dependency on Chakra UI. API 1:1 with Chakra UI v3 (same props, components, composition, recipes), distributed shadcn-style. Devs can customize and create their own components and recipes.

Default look: 1:1 visual match with shadcn/ui (neutral palette, black primary button, thin light borders, 8-10px radius, 32/36/40px control heights, Inter or system font), light and dark. Match the look only, never copy shadcn code.

Install target:

```bash
npm i @indoku/ui @emotion/react
npm i @indoku/science
npx @indoku/cli snippet add all
npx @indoku/cli snippet add component <name>
```

## Rules

- Never copy, fork, or read Chakra source code, `.d.ts`, or sourcemaps. Use only the public docs and observed behavior.
- Never use Chakra v1/v2 concepts (`extendTheme`, `colorScheme`, `isDisabled`, `baseStyle`, `Modal`). Only v3 concepts.
- Rename: `ChakraProvider` -> `Provider`, `chakra()` -> `indoku()`. Class and CSS variable prefix: `indoku`.
- Logic and accessibility come from Ark UI and Zag.js (dependencies, MIT). Styling engine is written here.
- Emotion stays (users install `@emotion/react`).
- 1:1 target: Chakra UI v3.37 (docs of 3.37.x). Do not chase later releases until 1:1 is reached.
- Done = conformance tests derived from the docs pass.
- Keep code minimal: no filler comments.
- Default theme values (colors, radius, sizes, fonts) come from the `ui-old` theme and the shadcn visual reference, never from Chakra's default theme.
- The playground renders only library output. No hand-written component CSS.
- No native-drawn controls. Anything whose visuals the browser or OS draws (select popup, date/time/color pickers, file input button, native dialog, `title` tooltips, datalist, default checkbox/radio look) must not appear in the library or playground. Build them as custom components on Ark UI, styled by recipes. Plain `<button>`, `<input type="text">`, and `<textarea>` are fine because they are fully stylable.
- Provider sets `color-scheme` (light/dark) so unavoidable native bits (scrollbars, autofill, caret) follow the theme.
- Hover, focus, and active states use semantic tokens only (e.g. `accent.hover`), never raw palette values like `gray.800`. Every state must be readable in both light and dark mode.
- Scope: this repo is only @indoku/ui, single package. science and cli are separate repos, not here.
- Do not publish to npm yet. Push progress to GitHub.

## Layout

```
src/   engine, primitives, components
```

Old wrapper (Chakra v3 + shadcn-like theme, 79 src files, 27 recipe files) is in `~/Documents/indoku/ui-old` and git tag `v0.0.1-wrapper`. Recipes there are data in Chakra format and can be ported.

## Status

- [x] Old wrapper tagged `v0.0.1-wrapper` and pushed
- [x] Old folder moved to `ui-old`, fresh clone in `ui`
- [x] Single-package repo (no monorepo)
- [x] Pin Chakra v3 target: 3.37.x
- [x] Tooling: tsup, vitest, tsc; typecheck, test, build pass
- [x] Ark UI current/latest selected: `@ark-ui/react@5.39.3`
- [x] Zag.js current/latest selected: `@zag-js/core@1.45.0`
- [x] Package version stays `0.0.1` until a genuinely major milestone
- [x] `createSystem` skeleton: tokens, semantic tokens, conditions, breakpoints
- [x] Style prop engine foundation + TypeScript types
- [ ] Engine design doc (later, after skeleton)
- [x] Primitive foundation: `Box`, `Stack`, `Flex`, `Grid`, `Text`, `indoku()`
- [x] Initial `defineRecipe` and slot recipe engine, registered through `createSystem`
- [x] `Provider`, color mode, and behavior tests
- [x] CSS condition resolver for style props and recipes (`_hover`, `_dark`, nested conditions)
- [x] Token resolver for semantic color paths and CSS variable injection from `Provider`
- [x] Emotion cache key `indoku` and intrinsic DOM prop filtering
- [x] Grid `columns` / `templateColumns` style props
- [x] Recursive style prop alias/token resolution inside `_hover`, `_dark`, and responsive condition values
- [x] `wrap` / `flexWrap` maps to CSS `flex-wrap` without leaking to DOM
- [x] Development warning for dotted token-like style values missing from the active theme
- [x] Neutral shadcn/zinc-inspired default palette, black/white primary semantic tokens, and tighter radii
- [x] Minimal default theme (tokens, semantic light/dark tokens) and Provider CSS reset
- [x] Rendered CSS assertions for token variables, condition selectors, class prefix, Grid columns, DOM prop filtering, conditional shorthand tokens, and Flex wrapping
- [x] Recipe engine deep merge, separate `className`/`css` result, nested-condition test
- [x] Playground hover uses semantic `accent.hover`, resolving to readable light/dark values
- [x] Provider sets root `color-scheme: light | dark`; tests verify light/dark updates
- [ ] Align default theme with the shadcn reference (foreground, muted foreground, dark primary, radius version) and drop or rename the grayscale `brand` palette
- [x] Port Button variants/sizes, semantic nested conditions, disabled/loading states, focus-visible ring, and default `type="button"`; light/dark CSS conformance tests
- [x] Select on Ark UI (custom popup, items, keyboard interaction, semantic recipes), first component after Button
- [x] Checkbox: custom-drawn checkbox with hidden native input, controlled/uncontrolled state, disabled/required/invalid states, and behavior tests
- [x] Radio Group: custom-drawn radio controls with hidden native inputs for form semantics; controlled/uncontrolled value, horizontal/vertical layout, disabled/required/invalid states, and behavior tests
- [ ] Switch: custom Ark UI component + recipe
- [ ] Dialog: Ark UI dialog + custom recipe; never native dialog
- [ ] Popover: Ark UI popover + custom recipe
- [ ] Tooltip: custom Ark UI tooltip + recipe; never title attribute
- [ ] Date Picker: custom Ark UI-based calendar + recipe; never native date/time picker
- [x] Replaced native `<select>` color mode control with library-styled System, Light, Dark buttons, then upgraded it to the custom Select component
- [x] Select uses Ark UI popup/items, keyboard navigation, and semantic-token recipes; trigger is a custom button, not a native select popup
- [ ] Port remaining recipes and components

## Style prop foundation

Implemented in `src/styled`:

- spacing aliases: `m/mt/mr/me/mb/ml/ms/mx/my`, `p/pt/pr/pe/pb/pl/ps/px/py`
- layout: `gap/rowGap/columnGap`, sizing, display, position, inset, z-index, overflow, Grid `columns` / `templateColumns`
- color/background, opacity, typography
- borders/radius/shadows
- flex/grid alignment and basic interactivity/transition/transform/animation props
- responsive object syntax and array syntax
- condition props such as `_hover` and nested `_dark`, recursively resolved through system conditions, including recipe output
- negative token syntax such as `m="-4"`
- color alpha modifier syntax such as `color="red/50"`
- `css` object passthrough
- non-style props are returned as `rest`; unknown props are filtered before reaching intrinsic DOM elements
- public TypeScript `StyleProps` and `ResponsiveValue` types

This is a foundation, not yet the full Chakra v3.37 style-prop surface. Rendered-CSS tests now assert that conditions become actual selectors and semantic tokens become `var(--indoku-...)` references. Expand coverage from public docs and add conformance tests as needed.

## Primitive foundation

Implemented in `src/primitives`:

- `indoku(element, options?)` factory with `as`, `system`, `className`, `css`, native props, refs, and Emotion-generated classes
- `Box` renders a `div`
- `Stack` defaults to flex column with stretch alignment
- `Flex` defaults to `display: flex`
- `Grid` defaults to `display: grid`
- `Text` renders a paragraph by default
- Public exports are available from `src/index.ts`
- Added `@types/react-dom` for SSR rendering tests

These are initial primitives, not a claim of full Chakra v3.37 API parity. Follow up with stronger polymorphic types, correct default-system token scales, style precedence tests, and documented prop conformance.

## Recipe engine foundation

Implemented in `src/recipe`:

- `defineRecipe`: `base`, `variants`, `defaultVariants`, `compoundVariants`, and recipe `className`
- `defineSlotRecipe`: `slots`, per-slot `base`, per-slot variants, defaults, and per-slot compound styles
- Compound variants are merged after single variants, so matching compound styles override earlier styles
- Variant selection is deterministic: base, variants in config insertion order, then compound variants in config insertion order
- Generated class names use the `indoku-` prefix; slot classes use `indoku-<name>__<slot>`
- `createSystem({ theme: { recipes, slotRecipes } })` accepts multiple named recipes and slot recipes in one system config. Decision: one config object with multiple named recipes, not multiple positional configs.
- `system.recipe(name)` and `system.slotRecipe(name)` are currently project APIs and **not yet verified against Chakra UI v3.37 public docs**.
- Recipe results use `{ className, css }`, keeping generated class names separate from styles.
- Nested styles deep-merge recursively, preserving sibling declarations in conditions such as `_hover` and `_dark`; merge order remains base, variants in config order, then compound variants in config order.
- Added tests for default override, compound override, stable key order, nested condition deep merge, per-slot classes, and multi-recipe system registration

This is the initial engine contract. Keep expanding public-docs-based conformance before claiming full Chakra UI v3.37 parity.

### Public documentation references (target: Chakra UI 3.37.x)

- Recipes: https://chakra-ui.com/docs/theming/recipes
- Slot recipes: https://chakra-ui.com/docs/theming/slot-recipes
- Provider setup: https://chakra-ui.com/docs/get-started/frameworks/next-app
- Color mode: https://chakra-ui.com/docs/components/concepts/color-mode

Implementation must use these public docs and observed behavior only; do not inspect Chakra source, declaration files, or sourcemaps.

## Provider and color mode foundation

Implemented in `src/provider.tsx` and `src/system/provider.tsx`:

- `Provider` accepts a `value` system and supplies it through context; primitives read the nearest system unless a component/factory override is supplied.
- `useSystem`, `useColorMode`, `createColorModeScript`, and `colorModeScript` are public exports.
- Provider injects CSS custom properties for token scales and semantic tokens; semantic token declarations can provide `base`/`_dark` values.
- Emotion is wrapped in a cache with key `indoku`, so generated classes use the `indoku-` prefix.
- The default system includes a neutral shadcn/zinc-inspired color palette, black/white primary semantic tokens, compact radii, spacing/size/type/shadow tokens, semantic light/dark colors, and a global CSS reset. Missing dotted token-like values produce a development warning.
- Color mode supports `light`, `dark`, and `system` preference; `forcedColorMode`; a configurable storage key; document class, `data-theme`, and `color-scheme` updates; and system preference change events.
- Initial client state avoids server/client markup differences; `createColorModeScript` can apply the stored mode before hydration to reduce theme flash.
- Tests cover mode toggle, localStorage restore/write, system context, hydration with no recoverable mismatch, and custom script storage keys.

This is a foundation. Continue validating behavior against public Chakra UI v3.37 docs; do not claim complete parity yet.


## Quick playground

- Added a Vite + React playground under `playground/`, importing the current library directly from `src/index.ts` so it always reflects the working source without publishing or installing a stale package build.
- Run `npm run playground` and open `http://localhost:5173`.
- Run `npm run playground:build` to verify the playground production bundle.
- The page demonstrates Provider/color-mode controls, Button, Box/Stack/Flex/Grid/Text style props, a tiny interactive counter, and recipe variant/nested-condition output.
- The playground has no stylesheet and `main.tsx` imports no CSS; component appearance comes from `@indoku/ui` primitives, tokens, semantic tokens, and recipes, not handwritten component CSS.
- Playground uses its own Vite config and build output under `playground/dist`; no generated playground files should be committed.

## Conformance test ideas

`p` vs `px` precedence, nested conditions (`_dark` + `_hover`), negative tokens (`m="-4"`), color alpha (`red.500/50`), responsive order, `compoundVariants`, prop precedence across `css`, style props and recipe, SSR hydration class match.

## Decisions

- Rewrite from docs, not fork. Reason: no Chakra code, no credit obligation, recipes still port.
- Do not publish until the tree is mature.
- Use the current/latest Ark UI and Zag.js versions at implementation time, while matching Chakra 3.37 behavior.
- Keep `@indoku/ui` at `0.0.1` for normal/minor progress; only reconsider versioning for a genuinely major milestone.

## Open

- Validate Ark UI behavior against the Chakra 3.37 docs as components are implemented.
- Decide the exact `0.0.1` release milestone later.
- Order after Button: Select first (needed by the playground and Provider demo), then the other custom controls.

## Notes

- Theme provider sync improvement pushed in `c711e1b`: `ColorModeBridge` applies the resolved mode in `useLayoutEffect` for client mounts. Tests/typecheck/build passed; still needs direct browser verification for visual theme flash across Vite, Astro SSR, and Next.js.
- RadioGroup added and exported; supports controlled/uncontrolled selection, orientation, shared control sizes, disabled options, and required/invalid states. Validation: 59 tests pass, typecheck/build and Vite playground production build pass.

- TypeScript pinned to ^5.9 (root devDependency). TypeScript 7 breaks tsup dts build.
- Commands: `npm test`, `npm run typecheck`, `npm run build`.
- Current verification after recursive style-prop resolution and the neutral theme pass: 42 tests pass, typecheck passes, library build passes, Vite playground production build passes, and `git diff --check` passes.
- Next: have the playground reviewed visually against the actual rendered output. Do not port Button until that review confirms the foundation is resolving tokens and conditions correctly.

## Out of scope for now

@indoku/science, @indoku/cli, docs site, publishing.

- [x] Playground Button visual pass: use Button variants instead of overriding the recipe with ad-hoc style props; regression test asserts hover CSS and enabled state

- [x] Added strict recipe-derived Button size types and square `icon`, `icon-xs`, `icon-sm`, `icon-lg` sizes with CSS/type regression tests

## Full component rewrite plan (source of truth)

### Rewrite contract

- Treat `../ui-old/src/components` as the behavioral/API reference for the legacy wrapper, while preserving the current Indoku UI styling engine, semantic tokens, recipes, Provider, and public package conventions.
- Do not import Chakra UI or copy Chakra implementation/source. Replace Chakra-specific wrappers with Indoku primitives and recipes. Ark UI / Zag.js are allowed for headless behavior where useful, consistent with the project rules above.
- Prefer compound/composable APIs (`Component.Root`, `Component.Item`, `Component.Trigger`, etc.) where a component has meaningful parts or shared state. Keep simple components simple; do not force compound APIs onto every component.
- Keep convenience APIs only when they are intentional, documented adapters over the canonical primitives—not a separate competing implementation.
- Every component is complete only when its API, state model, keyboard/pointer/touch behavior, accessibility, disabled/invalid/loading states where applicable, SSR behavior, recipes, exports, and tests are reviewed. Build success alone is not conformance.
- Playground work is secondary until the component API and behavior are stable. Then migrate demos to demonstrate the canonical composition API.
- Work batch by batch; update checkboxes here as each item is audited, implemented, and tested. A file existing is not evidence of completion.

### Batch 0 — Audit and shared foundation

- [ ] Inventory every current component, primitive, recipe, and public export against `ui-old`.
- [ ] Record public component API and subcomponent names from `ui-old` for each component.
- [ ] Map each legacy Chakra wrapper to Indoku primitives/recipes and identify required Ark UI / Zag.js behavior.
- [x] Audit direct dependencies and current source for Chakra: `@chakra-ui/react`, `@chakra-ui/system`, and `@chakra-ui/icons` are absent from installed top-level dependencies; no `@chakra-ui` imports or `chakra(` calls remain under `src`. Transitive full-tree audit remains open.
- [ ] Establish shared patterns for compound context, controllable state, IDs/ARIA, outside interaction, keyboard navigation, pointer/touch, focus management, and SSR-safe effects.
- [ ] Establish component-level behavior and accessibility test conventions.

### Batch 1 — Existing basics and composable display components

- [ ] Button — variants, sizes, icon sizes, loading/disabled, focus, polymorphism, and public API conformance.
- [x] ButtonGroup — legacy attached-by-default layout, horizontal/vertical segmentation, focus stacking, and child size propagation restored through Indoku styling; covered by tests.
- [ ] Badge — variants, semantic colors, inline layout.
- [ ] Card — Root, Header, Title, Description, Content, Footer; variants and layout composition.
- [ ] Avatar — Root, Image, Fallback, Group, GroupCount; loading/error fallback and accessible labeling.
- [ ] AspectRatio — ratio handling, responsive sizing, arbitrary children.
- [ ] Item — Root, Media, Content, Title, Description, Actions/End; layout variants.
- [ ] Skeleton — dimensions, loading composition, reduced-motion behavior.
- [ ] Progress — Root, Track, Range, Label, ValueText; determinate/indeterminate states and ARIA.
- [ ] Status — indicator, label/content composition, semantic status variants.
- [ ] Stat — Root, Label, ValueText, HelpText, Change/Indicator; trend and value composition.
- [ ] DataList — Root, Item, ItemLabel, ItemValue; horizontal/vertical layouts and responsive composition.
- [ ] ColorSwatch — Root, Trigger/Swatch, ValueText/Label; accessible color display and optional checkerboard.
- [x] CodeBlock — legacy Root API and props ported to Indoku primitives: lightweight syntax highlighting, line numbers, highlighted/added/removed lines, wrapping, copy feedback, and collapsible long code. Tested line-state and expansion behavior; clipboard permission/failure paths still need browser-level verification.
- [ ] Toggle — Root and controlled/uncontrolled pressed state, keyboard and ARIA.
- [ ] ToggleGroup — Root, Item; single/multiple selection, orientation, roving focus. (Initial compound API and basic controlled/uncontrolled tests added; roving focus and legacy parity remain.)

### Batch 2 — Compound interactive controls

- [ ] Accordion — Root, Item, ItemTrigger, ItemContent, ItemIndicator; single/multiple, collapsible, controlled/uncontrolled, keyboard and animation.
- [ ] Carousel — Root, ItemGroup, Item, Control, PrevTrigger, NextTrigger, IndicatorGroup, Indicator; controlled state, keyboard, touch/swipe, mouse drag, Shift+wheel, looping, variable-width slides, vertical orientation, thumbnails, autoplay, multiple visible slides, and reduced motion.
- [ ] Checkbox — Root, Control, Indicator, Label, HiddenInput; checked/indeterminate, controlled/uncontrolled, forms and validation.
- [ ] RadioGroup — Root, Item, ItemControl, ItemText, Label, Indicator; roving focus, controlled/uncontrolled, forms and validation.
- [ ] Switch — Root, Control, Thumb, Label, HiddenInput; controlled/uncontrolled, forms and disabled/invalid states.
- [ ] Select — Root, Trigger, Indicator, ClearTrigger, Positioner, Content, Item, ItemText, ItemIndicator, Label, ValueText; custom popup, keyboard, typeahead, groups, disabled options, controlled/uncontrolled, forms.
- [ ] ColorMode — Provider integration, ColorModeButton, LightMode, DarkMode, useColorMode, useColorModeValue; SSR-safe icon/state and subtree theme behavior.

### Batch 3 — Overlay, navigation, and layout primitives from ui-old

- [ ] Dialog — Root, Trigger, Backdrop, Positioner, Content, Header, Body, Footer, Title, Description, CloseTrigger; modal focus trap, escape/outside close, scroll lock, nested dialogs.
- [ ] Popover — Root, Trigger, Anchor, Positioner, Content, Arrow, CloseTrigger; placement, focus, outside interaction.
- [ ] Tooltip — Root, Trigger, Positioner, Content, Arrow; delay, keyboard focus, pointer behavior, accessible description; no native `title` tooltip.
- [ ] Menu — inventory/port if present in the legacy public API; Root, Trigger, Positioner, Content, Item, ItemGroup, separators and submenu behavior.
- [ ] Menubar — Root, Menu, Trigger, Positioner, Content, Item; keyboard navigation and submenu behavior.
- [ ] NavigationMenu — Root, List, Item, Trigger, Content, Link, Indicator, Viewport; keyboard and responsive behavior.
- [ ] Pagination — Root, Items, PrevTrigger, NextTrigger, PageTrigger, Ellipsis; controlled page state and accessible labels.
- [ ] ScrollArea — Root, Viewport, Content, Scrollbar, Thumb, Corner; horizontal/vertical scrolling and pointer/keyboard behavior.
- [ ] Resizable — Root/PanelGroup, Panel, Handle; keyboard resizing, min/max constraints, orientation.
- [ ] Sidebar — Root/Provider, Trigger, Content, Header, Footer, Group, Menu, MenuItem, Rail; collapse state, keyboard shortcuts and responsive behavior.
- [ ] Empty — Root, Indicator, Title, Description, Content/Actions composition.
- [ ] KbdGroup — Root and Kbd composition for keyboard shortcut display.
- [ ] Marker — root/marker API, semantic variants, accessible meaning.
- [ ] Direction — provider/context and direction-aware layout/keyboard behavior where applicable.

### Batch 4 — Forms, date/time, and data-entry components from ui-old

- [ ] Label — accessible label association and disabled/required styling.
- [ ] Form — Root, Field, Label, Control, HelperText, ErrorText, RequiredIndicator; validation and native form integration.
- [ ] InputOTP — Root, Input, Group, Slot, Separator; paste, keyboard navigation, controlled/uncontrolled value.
- [ ] PasswordInput — Root, Input, VisibilityTrigger/Control; accessible show/hide and form integration.
- [ ] DateFields — Root and segmented date/time fields; locale, keyboard editing, validation.
- [ ] Calendar — Root, Header, PrevTrigger, NextTrigger, Grid, Cell/Day; keyboard grid navigation, ranges and locale.
- [ ] Time — inspect legacy API and behavior, then port the time display/formatting component.
- [ ] Questionnaire — inspect legacy API; port question/answer composition and form state.
- [ ] Flash — inspect legacy API; port transient status/flash presentation and dismissal lifecycle.
- [ ] Toast — Root/Provider, Toast, Title, Description, Action, CloseTrigger; queueing, timers, pause-on-hover/focus, live region.
- [ ] Attachment — file attachment display/interaction, removable state, keyboard and accessible names; custom file UI only.

### Batch 5 — Rich content, command, tables, charts, and specialized components

- [ ] Command — Root, Input, List, Empty, Group, Item, Shortcut, Separator, Dialog adapter; filtering, active item, keyboard navigation, async/empty results.
- [ ] DataTable — Root, Header, Body, Row, Cell, ColumnHeader, caption/empty state; sorting/selection/pagination APIs as supported by legacy behavior.
- [ ] FileTree — Root, Item/Node, Branch, BranchControl, BranchContent; expand/collapse, selection, keyboard navigation.
- [ ] Graph2D — inspect legacy API; port graph rendering and interaction without Chakra-specific layout assumptions.
- [ ] Plot2D — inspect legacy API; port 2D plot rendering, scales, labels, and interaction.
- [ ] Plot3D — inspect legacy API; port 3D plot rendering and interaction.
- [ ] Chart — inspect legacy API; chart composition, responsive sizing, legends/tooltips, accessible fallback.
- [ ] PeriodicTable — inspect legacy API; element grid, selection, keyboard and responsive behavior.
- [ ] QRCode — inspect legacy API; value, sizing, error correction, accessible label and download/copy behavior if supported.
- [ ] Math — inspect legacy API; math rendering, fallback and overflow behavior.
- [ ] Prose — typography/content wrapper, headings, lists, links, code, tables, and nested content styles.
- [ ] RichTextEditor — inspect legacy API; editor state, toolbar composition, keyboard shortcuts, selection and accessibility.
- [ ] Bubble — inspect legacy API; message bubble composition and variants.
- [ ] Message — inspect legacy API; message content/metadata/actions and composition.
- [ ] MessageScroller — inspect legacy API; scroll-to-bottom, streaming updates, user-scroll preservation.
- [ ] ModelLab — inspect legacy API and separate generic UI composition from domain-specific logic before porting.

### Batch 6 — Cross-component conformance and release readiness

- [ ] Normalize public exports and compound namespace naming; add missing TypeScript prop exports.
- [ ] Ensure compound subcomponents share context/state rather than duplicating state.
- [ ] Verify controlled/uncontrolled contracts, callbacks, default values, and reset behavior.
- [ ] Verify keyboard and pointer/touch behavior against the legacy observed behavior and public reference docs.
- [ ] Verify accessible names, roles, states, relationships, focus management, and live regions.
- [ ] Verify light/dark semantic tokens, hover/focus/active/disabled/invalid states, and no raw palette values in states.
- [ ] Verify SSR and hydration for components that use IDs, effects, portals, timers, or environment-dependent state.
- [ ] Verify no native-drawn controls or native `title` tooltips in library/playground.
- [ ] Add component conformance tests and regressions for all fixed bugs.
- [ ] Migrate playground examples to canonical composable APIs; add demos for important variants and interactions.
- [ ] Run full typecheck, test suite, library build, playground build, dependency audit, and `git diff --check`.
- [ ] Update this progress file and push verified work; do not publish to npm yet.

### Current rewrite tracking

- [x] Initial compound API adapters added for Card, Item, Stat, DataList, ButtonGroup, and Accordion.
- [ ] Audit those adapters against the actual `ui-old` API; current additions are a starting point, not proof of 1:1 parity.
- [x] Add ToggleGroup compound API (`Root`/`Item`) using Indoku primitives and shared context; add initial single/multiple/disabled behavior tests.
- [x] Add `Item.Actions` compound slot matching the legacy Item API.
- [x] Port `ui-old` lightweight syntax tokenizer and restore the legacy CodeBlock feature set without Chakra runtime; add conformance coverage for line numbers, highlighted lines, and expand/collapse.
- [x] Align ButtonGroup with the legacy API: attached segments by default, orientation-aware borders, focus stacking, and size propagation. Add a data-state attribute and tokenized focus outline to Toggle.
- [ ] Rewrite Carousel against the legacy composable API and verify every requested interaction/indicator layout.
- [ ] Add Lucide icons as the shared icon dependency where appropriate, beginning with ColorModeButton sun/moon icons.
- [ ] Finish Batch 0 full inventory, API/subcomponent matrix, shared behavior patterns, and conformance conventions; proceed sequentially through batches and keep this checklist accurate as work lands.

- [ ] Avatar compound API adapter added (`Root`, `Image`, `Fallback`, `Group`, `GroupCount`) with image-load/error fallback state and a focused test; still needs parity review for delay behavior, group sizing/overlap, and accessibility against the legacy public API.
- [ ] Progress compound API adapter added (`Root`, `Track`, `Range`, `Label`, `ValueText`) with ARIA bounds/state and basic rendering test; still needs complete recipe/indeterminate/formatting parity review.
- [x] Replaced raw Button/Textarea focus-ring shadows with semantic-token outlines after test failures exposed the style engine treating arbitrary shadow strings as tokens; Button light/dark CSS assertions updated.
- [ ] Accordion compound slots now use Indoku-styled wrappers instead of unstyled Ark wrappers; basic compound composition/expanded-state regression added. Still needs parity audit for keyboard, animation, multiple/collapsible combinations, and visual recipes.
- [x] ToggleGroup initial roving-focus behavior added: one enabled item is tabbable, arrows follow orientation, Home/End jump, and disabled items are skipped; regression test added. Still needs full legacy/API conformance review.
- [x] Added semantic `status.*` tokens for success/danger/warning/info/neutral and wired Status, Progress, and CodeBlock syntax roles to them.
- [ ] Added compound `Dialog`, `Popover`, `Tooltip`, and `Menu` wrappers over Ark UI with Indoku semantic-token styling and basic composition tests. Interaction conformance remains open; Dialog close behavior and browser focus/outside-click behavior require dedicated verification before marking complete.
- [ ] Added `Empty`, `Kbd`/`KbdGroup`, `Marker`, `Direction`, `ScrollArea`, and `Pagination` APIs with basic rendering/accessibility tests. Their full legacy parity (including ScrollArea's legacy `type` visibility modes and custom thumb dragging, pagination responsive layout, and RTL edge cases) remains open.
- [x] Added legacy-shaped `Form`/`useForm` helpers: typed values, field metadata, validators, submit lifecycle, reset, and accessible field helper/error text. Basic validation-submit-reset regression passes; complex child composition and async error handling still need conformance coverage.
- [x] Added compound `InputOTP` (`Root`, `Group`, `Slot`, `Separator`) with controlled/uncontrolled values, filtering, completion callback, focus/caret synchronization, and hidden native input for paste/autofill. Basic filter/completion test passes; browser/mobile autofill and pointer/focus behavior still need manual verification.
- [x] Added compound `Pagination` (`Root`, `Content`, `Previous`, `Next`, `Pages`, `PageText`) using Ark pagination state, with current-page semantics and page-range rendering tested.
- [ ] FileTree first Indoku port added over Ark TreeView with recursive NodeProvider composition, default/custom icons, folder expansion, indentation guides, and a tree-render/expand regression test. Typecheck, 103 tests, library build, playground build, and diff check pass; full legacy API/selection/keyboard parity and empty-folder semantics still need audit.
- [ ] Graph2D first Indoku port added for function curves, labelled points, adaptive grid/axes, coordinate readout, pointer pan, wheel zoom, zoom controls, and reset; semantic scene-color names resolve through Indoku status/accent tokens. Added SVG/legend regression coverage. Full gesture/browser review and parity audit remain open.
- [ ] Plot2D first Indoku port added for structural scene data (lines, points, vectors, text), semantic scene colors, responsive SVG bounds/grid, optional LaTeX rendering, live stats, and reduced-motion-aware playback/scrubber/speed controls. Added scene-render regression coverage. Browser animation/performance and API parity still need review.
- [ ] Plot3D first Indoku canvas renderer added for structural sphere/line/arrow/mesh scenes, camera orbit/zoom/reset, semantic scene colors, optional auto-rotation, live stats/LaTeX, and playback controls. Accessibility/camera-control regression passes; complex mesh lighting, mobile gestures, and browser rendering/performance need manual verification.
- [ ] PeriodicTable first Indoku port added with 18-column positioning, detached lanthanide/actinide rows, selected-element summary, controlled/uncontrolled selection, accessible button names, and semantic category styling. Selection/details regression passes; full 118-element layout and responsive/browser visual review remain open.
- [ ] ModelLab first Indoku port added for structural model catalogs, category/model selection, typed parameter controls, reset, build-error display, 2D/3D scene integration, playback, and live stat badges. Mock-catalog interaction/render test passes; async catalogs, invalid parameter edge cases, and real science-catalog/browser integration remain to verify.
- [ ] Chart initial Indoku subset added: shared series/color/highlight API, formatting/domain/sorting helpers, LineChart, AreaChart, BarChart, Histogram, BarSegment, ScatterChart, RadarChart, RangeBarChart, CandlestickChart, PieChart/DonutChart, Sparkline, RadialText, and interactive keyboard-focusable legend. SVG/helper regression passes; legacy advanced chart set (reference lines/areas, dual axes, stacking/percent modes, full prop forwarding) remains open and these are not yet 1:1 parity.
