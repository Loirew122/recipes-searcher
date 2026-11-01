import { Link } from "react-router-dom"
import { ErrorBox } from "@shared/ui/ErrorBox"
import { EmptyState } from "@shared/ui/EmptyState"
import { plural } from "@shared/lib/plural"
import { RecipeCard } from "@features/recipes/RecipeCard"
import { RecipeGridSkeleton } from "@features/recipes/RecipeList"
import { useGetFavoritesQuery } from "@/app/api"

export function FavoritesPage() {
  const { data: favorites = [], isLoading, isError, error, refetch } = useGetFavoritesQuery()

  let content
  if (isLoading) content = <RecipeGridSkeleton count={4} />
  else if (isError) content = <ErrorBox message={error.message} onRetry={refetch} />
  else if (favorites.length === 0) {
    content = (
      <EmptyState icon="heart" title="В избранном пусто" hint="Нажмите на сердечко у рецепта, чтобы сохранить его здесь">
        <Link to="/" className="btn btn--primary">Найти рецепты</Link>
      </EmptyState>
    )
  } else {
    content = (
      <section className="recipes">
        {favorites.map((item, index) => (
          <RecipeCard key={item.id} index={index} id={item.id} title={item.title} thumb={item.thumb} />
        ))}
      </section>
    )
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Избранное</h1>
        {favorites.length > 0 && (
          <p>Сохранено {favorites.length} {plural(favorites.length, ["рецепт", "рецепта", "рецептов"])}</p>
        )}
      </header>
      {content}
    </div>
  )
}
