import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBox } from '@shared/ui/ErrorBox'
import { EmptyState } from '@shared/ui/EmptyState'
import { plural } from '@shared/lib/plural'
import { RecipeCard } from '@features/recipes/RecipeCard'
import { RecipeGridSkeleton } from '@features/recipes/RecipeList'
import { useGetFavoritesQuery } from '@/app/api'
import { isRecord } from '@shared/lib/apiGuards'
import type { FavoriteRecipe } from '@shared/types/recipe'

type FavoritesPageView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'ready'; favorites: FavoriteRecipe[] }

function getErrorMessage(error: unknown): string {
  if (isRecord(error) && typeof error.message === 'string') {
    return error.message
  }

  return 'Не удалось загрузить избранное'
}

function renderContent(view: FavoritesPageView, onRetry:()=>void): ReactNode {
  switch (view.status) {
    case 'loading':
      return <RecipeGridSkeleton count={4} />

    case 'error':
      return <ErrorBox message={view.message} onRetry={onRetry} />

    case 'empty':
      return (
        <EmptyState
          icon="heart"
          title="В избранном пусто"
          hint="Нажмите на сердечко у рецепта, чтобы сохранить его здесь"
        >
          <Link to="/" className="btn btn--primary">
            Найти рецепты
          </Link>
        </EmptyState>
      )

    case 'ready':
      return (
        <section className="recipes">
          {view.favorites.map((item, index) => (
            <RecipeCard
              key={item.id}
              index={index}
              id={item.id}
              title={item.title}
              thumb={item.thumb}
            />
          ))}
        </section>
      )
  }

  const unreachable: never = view
  return unreachable
}

export function FavoritesPage() {
  const {
    data: favorites = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFavoritesQuery()

  const view: FavoritesPageView = isLoading
    ? { status: 'loading' }
    : isError
      ? { status: 'error', message: getErrorMessage(error) }
      : favorites.length === 0
        ? { status: 'empty' }
        : { status: 'ready', favorites }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Избранное</h1>
        {favorites.length > 0 && (
          <p>
            Сохранено {favorites.length}{' '}
            {plural(favorites.length, ['рецепт', 'рецепта', 'рецептов'])}
          </p>
        )}
      </header>
      {renderContent(view, refetch)}
    </div>
  )
}
