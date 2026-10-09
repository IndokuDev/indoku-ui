import type { RecipeFunction, SlotRecipeFunction } from "../recipe/types"

export type TokenPrimitive = string | number

export interface TokenDefinition<T extends TokenPrimitive = TokenPrimitive> {
  value: T
  description?: string
}

export interface TokenScale {
  [key: string]: TokenNode
}

export type TokenNode = TokenPrimitive | TokenDefinition | TokenScale
export type Tokens = Record<string, TokenNode>
export type SemanticTokenValue = string | number | Record<string, string | number>

export interface SemanticTokenDefinition {
  value: SemanticTokenValue
  description?: string
}

export interface SemanticTokenScale { [key: string]: SemanticTokenNode }
export type SemanticTokenNode = SemanticTokenDefinition | SemanticTokenValue | SemanticTokenScale
export type SemanticTokens = Record<string, SemanticTokenNode>
export type Conditions = Record<string, string>
export type Breakpoints = Record<string, TokenPrimitive>

export interface SystemConfig {
  theme?: {
    tokens?: Tokens
    semanticTokens?: SemanticTokens
    breakpoints?: Breakpoints
    conditions?: Conditions
    recipes?: Record<string, RecipeFunction>
    slotRecipes?: Record<string, SlotRecipeFunction>
  }
  cssVarsPrefix?: string
}

export interface System {
  tokens: Tokens
  semanticTokens: SemanticTokens
  conditions: Conditions
  breakpoints: Breakpoints
  token(path: string): string | undefined
  tokenVar(path: string): string | undefined
  resolve(path: string): TokenPrimitive | SemanticTokenValue | undefined
  condition(name: string): string | undefined
  breakpoint(name: string): TokenPrimitive | undefined
  cssVariables(): string
  recipes: Record<string, RecipeFunction>
  slotRecipes: Record<string, SlotRecipeFunction>
  recipe(name: string): RecipeFunction | undefined
  slotRecipe(name: string): SlotRecipeFunction | undefined
}
