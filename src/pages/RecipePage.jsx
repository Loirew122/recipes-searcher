import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "@shared/ui/Button"
import { Loader } from "@shared/ui/Loader"
import { EmptyState } from "@shared/ui/EmptyState"
import { toEnglish, toRussian } from "@shared/lib/ingredients"
import { selectIngredients } from "@features/ingredients/IngredientsSlice"
import { FavoriteButton } from "@features/favorites/FavoriteButton"
import { useGetRecipeQuery } from "@/app/api"

export function RecipePage() {
  const { id } = useParams()
  const { data: recipe, isLoading, isError, error, refetch } = useGetRecipeQuery(id)
  const userIngredients = useSelector(selectIngredients)

  if (isLoading) return <Loader text="Загружаем рецепт..." />
  if (isError) {
    return (
      <div className="error-box" role="alert">
        <p>{error.message}</p>
        <Button variant="secondary" onClick={refetch}>Повторить</Button>
      </div>
    )
  }
  if (!recipe) {
    return (
      <>
        <EmptyState title="Рецепт не найден" hint="Проверьте адрес" />
        <Link to="/" className="back-link">← К поиску</Link>
      </>
    )
  }

  const have = userIngredients.map(toEnglish)
  const missing = recipe.ingredients.filter((item) => !have.some((h) => item.includes(h)))

  return (
    <article className="recipe-card recipe-page">
      <Link to="/" className="back-link">← К поиску</Link>
      <img className="recipe-card__image" src={recipe.thumb} alt={recipe.title} />
      <h2>{recipe.title}</h2>
      <FavoriteButton id={recipe.id} title={recipe.title} thumb={recipe.thumb} />
      {missing.length === 0
        ? <p className="recipe-card__status recipe-card__status--ready">Всё есть, можно готовить</p>
        : <p className="recipe-card__status recipe-card__status--missing">Не хватает: {missing.map(toRussian).join(', ')}</p>}
      <h3>Состав</h3>
      <ul>
        {recipe.ingredients.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h3>Приготовление</h3>
      <p>{recipe.instructions}</p>
    </article>
  )
}
