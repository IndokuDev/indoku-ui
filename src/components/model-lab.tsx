import * as React from "react"
import { Badge } from "./badge"
import { Button } from "./button"
import { Select } from "./select"
import { Switch } from "./switch"
import { Plot2D } from "./plot2d"
import { Plot3D } from "./plot3d"
import { PlayerBar, usePlayer } from "../lib/player"
import { indoku } from "../primitives/indoku"
import type { ModelCatalogLike, ModelInfoLike, ParamSpecLike, ParamValuesLike, Scene2DLike, Scene3DLike } from "../lib/scene-types"

export interface ModelLabProps { catalog: ModelCatalogLike; defaultModel?: string; categories?: string[]; renderLatex?: (latex: string) => React.ReactNode; view3d?: (scene: Scene3DLike, t: number) => React.ReactNode; height?: number }
const Root = indoku("div"), Header = indoku("div"), Layout = indoku("div"), Panel = indoku("div"), ParamRow = indoku("div"), ParamLabel = indoku("label"), Input = indoku("input"), Description = indoku("p"), Muted = indoku("span")
const ORDER = ["physics", "chemistry", "biology", "math", "shapes"]
const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const defaults = (model: ModelInfoLike): ParamValuesLike => Object.fromEntries(model.params.map((parameter) => [parameter.key, parameter.default]))
function ParameterControl({ spec, value, onChange, id }: { spec: ParamSpecLike; value: number | string | boolean; onChange: (value: number | string | boolean) => void; id: string }) {
  if (spec.type === "boolean") return <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange}>{spec.label}</Switch>
  if (spec.type === "select") return <Select items={(spec.options ?? []).map((option) => ({ value: option.value, label: option.label ?? option.value }))} value={String(value)} onValueChange={onChange as (value: string) => void} aria-label={spec.label} size="sm" />
  return <Input type="text" inputMode={spec.type === "number" ? "decimal" : "text"} value={String(value)} placeholder={spec.placeholder} maxLength={spec.maxLength} id={id} aria-label={spec.label} border="1px solid" borderColor="border.subtle" borderRadius="md" bg="bg.surface" color="fg.default" px="2" py="1" fontSize="sm" width="100%" onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(spec.type === "number" ? (event.target.value === "" ? "" : Number(event.target.value)) : event.target.value)} />
}
/** Interactive parameter explorer for any structural science model catalog. */
export function ModelLab({ catalog, defaultModel, categories, renderLatex, view3d, height = 380 }: ModelLabProps) {
  const all = React.useMemo(() => catalog.list().filter((model) => !categories || categories.includes(model.category)), [catalog, categories])
  const categoryNames = React.useMemo(() => [...new Set(all.map((model) => model.category))].sort((a, b) => { const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b); return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) }), [all])
  const first = all.find((model) => model.id === defaultModel) ?? all[0]
  const [category, setCategory] = React.useState(first?.category ?? "")
  const [id, setId] = React.useState(first?.id ?? "")
  const model = all.find((item) => item.id === id)
  const [values, setValues] = React.useState<ParamValuesLike>(() => first ? defaults(first) : {})
  React.useEffect(() => { if (model) setValues(defaults(model)) }, [model?.id])
  const built = React.useMemo(() => {
    if (!model) return { error: "No models available.", scene: null }
    try { return { error: null, scene: catalog.build(model.id, values) } } catch (error) { return { error: error instanceof Error ? error.message : String(error), scene: null } }
  }, [catalog, model, values])
  const scene = built.scene as Scene2DLike | Scene3DLike | null
  const player = usePlayer({ duration: scene?.duration ?? 0, loop: scene?.loop ?? true, autoPlay: true })
  const categoryModels = all.filter((item) => item.category === category)
  if (!model) return <Root color="fg.muted">No models available.</Root>
  return <Root border="1px solid" borderColor="border.subtle" borderRadius="xl" overflow="hidden" color="fg.default" bg="bg.surface">
    <Header display="flex" flexWrap="wrap" gap="1" p="2" borderBottom="1px solid" borderColor="border.subtle">{categoryNames.map((name) => <Button key={name} size="xs" variant={name === category ? "solid" : "ghost"} onClick={() => { setCategory(name); const next = all.find((item) => item.category === name); if (next) setId(next.id) }}>{titleCase(name)}</Button>)}</Header>
    <Layout display="grid" gridTemplateColumns={{ base: "1fr", md: "minmax(220px, 280px) minmax(0, 1fr)" }}>
      <Panel p="3" display="flex" flexDirection="column" gap="3" borderRight={{ md: "1px solid" }} borderColor="border.subtle" borderBottom={{ base: "1px solid", md: "0" }}>
        <Select items={categoryModels.map((item) => ({ value: item.id, label: item.title }))} value={id} onValueChange={setId} aria-label="Model" size="sm" />
        {model.description && <Description fontSize="xs" color="fg.muted" m="0">{model.description}</Description>}
        {model.params.map((parameter) => <ParamRow key={parameter.key} display="flex" flexDirection="column" gap="1">
          <ParamLabel htmlFor={`model-param-${parameter.key}`} fontSize="xs" fontWeight="medium">{parameter.label} {parameter.type === "number" && parameter.unit && <Muted color="fg.muted">({parameter.unit})</Muted>}</ParamLabel>
          <ParameterControl id={`model-param-${parameter.key}`} spec={parameter} value={values[parameter.key] ?? parameter.default} onChange={(value) => setValues((current) => ({ ...current, [parameter.key]: value }))} />
        </ParamRow>)}
        <Button size="xs" variant="outline" onClick={() => setValues(defaults(model))}>Reset parameters</Button>
      </Panel>
      <Panel p="3" minWidth="0" display="flex" flexDirection="column" gap="3">
        {built.error && <Description role="alert" color="status.danger" fontSize="sm">{built.error}</Description>}
        {scene?.kind === "2d" && <Plot2D scene={scene} t={player.t} controls={false} renderLatex={renderLatex} />}
        {scene?.kind === "3d" && (view3d ? view3d(scene, player.t) : <Plot3D scene={scene} t={player.t} controls={false} height={height} renderLatex={renderLatex} />)}
        {scene && scene.duration > 0 && <PlayerBar player={player} />}
        {scene?.stats && <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{scene.stats(player.t).map((stat) => <Badge key={stat.label} variant="secondary">{stat.label}: {stat.value}{stat.unit ? ` ${stat.unit}` : ""}</Badge>)}</div>}
      </Panel>
    </Layout>
  </Root>
}
