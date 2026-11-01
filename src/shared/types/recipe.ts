export interface RecipeBase {
  id: string
  title: string
  thumb: string
}

export interface RecipeDetails extends RecipeBase {
  ingredients: string[]
  measures: string[]
  steps: string[]
  category: string | null
  area: string | null
  youtube: string | null
}

export type RecipeSearchResult = Omit<
  RecipeDetails,
  'ingredients' | 'measures' | 'steps' | 'category' | 'area' | 'youtube'
> & {
  matched: string[]
}

export type FavoriteRecipe = Pick<
  RecipeDetails,
  'id' | 'title' | 'thumb'
>

export type RecipeSearchStatus = 'idle' | 'loading' | 'success' | 'error'

export type RecipeSearchStatusLabels = Record<RecipeSearchStatus, string>
