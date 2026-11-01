import { RecipeCard } from './RecipeCard'
import { ErrorBox } from '@shared/ui/ErrorBox'
import { EmptyState } from '@shared/ui/EmptyState'
import type { RecipeSearchResult } from '@shared/types/recipe'
import './recipes.css'

interface RecipeGridSkeletonProps {
  count?: number
}

interface RecipeListProps {
  recipes: RecipeSearchResult[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error?: { message?: string } | null
  onRetry: () => void
}

export function RecipeGridSkeleton({
  count = 8,
}: RecipeGridSkeletonProps) {
  return (
    <section className="recipes" aria-busy="true">
      <p className="visually-hidden" role="status">Загрузка...</p>
      {Array.from({ length: count }, (_, i) => (
        <div
          className="recipe-card recipe-card--skeleton"
          key={i}
          aria-hidden="true"
        >
          <div className="skeleton skeleton--media" />
          <div className="recipe-card__body">
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </div>
      ))}
    </section>
  )
}

export function RecipeList({
  recipes,
  isLoading,
  isFetching,
  isError,
  error,
  onRetry,
}: RecipeListProps) {
  if (isLoading) return <RecipeGridSkeleton />

  if (isError) {
    return <ErrorBox message={error?.message} onRetry={onRetry} />
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="utensils"
        title="Ничего не нашлось"
        hint="Попробуйте убрать один из продуктов или добавить другие"
      />
    )
  }

  return (
    <section className={`recipes${isFetching ? ' recipes--stale' : ''}`}>
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          index={index}
          id={recipe.id}
          title={recipe.title}
          thumb={recipe.thumb}
          matched={recipe.matched}
        />
      ))}
    </section>
  )
}