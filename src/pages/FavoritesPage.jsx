import { Link } from "react-router-dom"
import { Button } from "@shared/ui/Button"
import { Loader } from "@shared/ui/Loader"
import { EmptyState } from "@shared/ui/EmptyState"
import { FavoriteButton } from "@features/favorites/FavoriteButton"
import { useGetFavoritesQuery } from "@/app/api"

export function FavoritesPage() {
  const { data: favorites = [], isLoading, isError, error, refetch } = useGetFavoritesQuery()

  if (isLoading) return <Loader text="Загружаем избранное..." />
  if (isError) {
    return (
      <div className="error-box" role="alert">
        <p>{error.message}</p>
        <Button variant="secondary" onClick={refetch}>Повторить</Button>
      </div>
    )
  }
  if (favorites.length === 0) {
    return <EmptyState title="В избранном пусто" hint="Добавьте рецепты на странице поиска" />
  }

  return (
    <section className="recipes">
      {favorites.map((item) => (
        <article className="recipe-card" key={item.id}>
          <img className="recipe-card__image" src={item.thumb} alt={item.title} loading="lazy" />
          <h3 className="recipe-card__title"><Link to={`/recipe/${item.id}`}>{item.title}</Link></h3>
          <FavoriteButton id={item.id} title={item.title} thumb={item.thumb} />
        </article>
      ))}
    </section>
  )
}
