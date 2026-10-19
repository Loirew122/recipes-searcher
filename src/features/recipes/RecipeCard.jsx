import { useState } from "react"
import { Button } from "@shared/ui/Button"
import { Loader } from "@shared/ui/Loader"
import { toEnglish, toRussian } from "@shared/lib/ingredients"
import { useRecipeDetails } from "./useRecipeDetails"

export function RecipeCard({ id, title, thumb, matched, userIngredients }) {
  const [open, setOpen] = useState(false)
  const { ingredients, status, reload } = useRecipeDetails(id, open)

  const have = userIngredients.map(toEnglish)
  const missing = (ingredients ?? []).filter((item) => !have.some((h) => item.includes(h)))

  return (
    <article className="recipe-card">
      <img className="recipe-card__image" src={thumb} alt={title} loading="lazy" />
      <h3 className="recipe-card__title">{title}</h3>
      {matched.length > 0 && <p className="recipe-card__matched">Подходит по: {matched.join(', ')}</p>}
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? 'Скрыть состав' : 'Показать состав'}
      </Button>
      {open && status === 'loading' && <Loader text="Загружаем состав..." />}
      {open && status === 'error' && (
        <div className="recipe-card__details">
          <p className="recipe-card__status recipe-card__status--missing">Не удалось загрузить состав</p>
          <Button variant="secondary" onClick={reload}>Повторить</Button>
        </div>
      )}
      {open && status === 'success' && (
        missing.length === 0
          ? <p className="recipe-card__status recipe-card__status--ready">Всё есть, можно готовить</p>
          : <p className="recipe-card__status recipe-card__status--missing">Не хватает: {missing.map(toRussian).join(', ')}</p>
      )}
    </article>
  )
}