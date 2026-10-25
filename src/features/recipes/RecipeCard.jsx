import { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIngredients } from "@features/ingredients/IngredientsSlice"
import { Button } from "@shared/ui/Button"
import { Loader } from "@shared/ui/Loader"
import { toEnglish, toRussian } from "@shared/lib/ingredients"
import { FavoriteButton } from "@features/favorites/FavoriteButton"
import { useGetRecipeQuery } from "@/app/api"

export function RecipeCard({ id, title, thumb, matched }) {
  const userIngredients = useSelector(selectIngredients)
  const [open, setOpen] = useState(false)
  const { data: recipe, isLoading, isError, refetch } = useGetRecipeQuery(id, { skip: !open })

  const have = userIngredients.map(toEnglish)
  const missing = (recipe?.ingredients ?? []).filter((item) => !have.some((h) => item.includes(h)))

  return (
    <article className="recipe-card">
      <img className="recipe-card__image" src={thumb} alt={title} loading="lazy" />
      <h3 className="recipe-card__title"><Link to={`/recipe/${id}`}>{title}</Link></h3>
      {matched.length > 0 && <p className="recipe-card__matched">Подходит по: {matched.join(', ')}</p>}
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? 'Скрыть состав' : 'Показать состав'}
      </Button>
      <FavoriteButton id={id} title={title} thumb={thumb} />
      {open && isLoading && <Loader text="Загружаем состав..." />}
      {open && isError && (
        <div className="recipe-card__details">
          <p className="recipe-card__status recipe-card__status--missing">Не удалось загрузить состав</p>
          <Button variant="secondary" onClick={refetch}>Повторить</Button>
        </div>
      )}
      {open && recipe && (
        missing.length === 0
          ? <p className="recipe-card__status recipe-card__status--ready">Всё есть, можно готовить</p>
          : <p className="recipe-card__status recipe-card__status--missing">Не хватает: {missing.map(toRussian).join(', ')}</p>
      )}
    </article>
  )
}
