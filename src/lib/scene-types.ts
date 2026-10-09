export type Vec2 = [number, number]
export type Vec3 = [number, number, number]
export interface StatLike { label: string; value: number | string; unit?: string }
export type Item2DLike =
  | { t: "line"; pts: Vec2[]; color?: string; width?: number; dash?: boolean }
  | { t: "point"; x: number; y: number; r?: number; color?: string; label?: string }
  | { t: "vector"; x: number; y: number; dx: number; dy: number; color?: string; label?: string }
  | { t: "text"; x: number; y: number; text: string; color?: string }
export interface Scene2DLike { kind: "2d"; title?: string; bounds: { xMin: number; xMax: number; yMin: number; yMax: number }; duration: number; loop?: boolean; latex?: string[]; stats?(t: number): StatLike[]; frame(t: number): Item2DLike[] }
export interface Mesh3DLike { positions: Float32Array; normals: Float32Array; indices: Uint32Array }
export type Obj3DLike =
  | { t: "mesh"; mesh: Mesh3DLike; color?: string; wire?: boolean; position?: Vec3; rotation?: Vec3; scale?: number | Vec3 }
  | { t: "sphere"; pos: Vec3; r: number; color?: string; label?: string }
  | { t: "line"; pts: Vec3[]; color?: string }
  | { t: "arrow"; from: Vec3; to: Vec3; color?: string }
export interface Scene3DLike { kind: "3d"; title?: string; duration: number; loop?: boolean; radius: number; latex?: string[]; stats?(t: number): StatLike[]; frame(t: number): Obj3DLike[] }
export type ParamValuesLike = Record<string, number | string | boolean>
export interface ParamSpecLike { key: string; label: string; type: "number" | "select" | "boolean" | "text"; default: number | string | boolean; min?: number; max?: number; step?: number; unit?: string; options?: { value: string; label?: string }[]; placeholder?: string; maxLength?: number }
export interface ModelInfoLike { id: string; title: string; category: string; description?: string; params: ParamSpecLike[] }
export interface ModelCatalogLike { list(category?: string): ModelInfoLike[]; build(id: string, params?: ParamValuesLike): Scene2DLike | Scene3DLike }
