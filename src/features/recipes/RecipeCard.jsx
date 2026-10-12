export function RecipeCard({ title, time, description, ingredients, userIngredients }) {
  const have = userIngredients.map((item)=> item.toLowerCase())
  const missing = ingredients.filter((item)=>!have.includes(item))
  return (
    <article className="recipe-card">
      <h3 className="recipe-card__title">{title}</h3>
      <p className="recipe-card__time">{time} мин</p>
      <p className="recipe-card__description">{description}</p>
      <p className="recipe-card__composition">Состав: {ingredients.join(', ')}</p>
      {missing.length === 0 ?
       <p className="recipe-card__status recipe-card__status--ready">Всё есть, можно готовить</p>
       : <p className="recipe-card__status recipe-card__status--missing">Не хватает: {missing.join(', ')}</p>}
    </article>
  )
}
