export function RecipeCard({ title, time, description, ingredients, userIngredients }) {
  const have = userIngredients.map((item)=> item.toLowerCase())
  const missing = ingredients.filter((item)=>!have.includes(item))
  return (
    <article>
      <h3>{title}</h3>
      <p>Время: {time} мин</p>
      <p>{description}</p>
      <p>Состав: {ingredients.join(', ')}</p>
      {missing.length === 0 ?
       <p>Всё есть, можно готовить</p>
       : <p>Не хватает: {missing.join(', ')}</p>}
    </article>
  )
}