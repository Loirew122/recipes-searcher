import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { selectIngredients } from '@features/ingredients/IngredientsSlice'
import { selectSubmittedSearch } from '@features/recipes/searchSlice'
import { useAppSelector } from '@/app/hooks'
import type { RecipeSearchResult } from '@shared/types/recipe'
import { Button } from '@shared/ui/Button'
import { Icon } from '@shared/ui/Icon'
import { Loader } from '@shared/ui/Loader'
import { toEnglish, toRussian } from '@shared/lib/ingredients'
import { FavoriteButton } from '@features/favorites/FavoriteButton'
import { useGetRecipeQuery } from '@/app/api'
import './recipes.css'


interface RecipeCardProps extends Pick<RecipeSearchResult, 'id' | 'title' | 'thumb'> {
  matched?: RecipeSearchResult['matched']
  index?: number
}

export function RecipeCard({
  id,
  title,
  thumb,
  matched = [],
  index = 0,
}: RecipeCardProps) {
  const userIngredients = useAppSelector(selectIngredients)
  const total = useAppSelector(selectSubmittedSearch).length
  const [open, setOpen] = useState(false)
  const { data: recipe, isLoading, isError, refetch } = useGetRecipeQuery(id, { skip: !open })

  const have = userIngredients.map(toEnglish)
  const missing = (recipe?.ingredients ?? []).filter((item) => !have.some((h) => item.includes(h)))
  const isFullMatch = total > 0 && matched.length === total
  const cardStyle: CSSProperties & { '--i': number } = {
    '--i': index,
  }
  return (
    <article className="recipe-card" style={cardStyle}>
      <div className="recipe-card__media">
        <Link to={`/recipe/${id}`} tabIndex={-1} aria-hidden="true">
          <img className="recipe-card__image" src={thumb} alt="" loading="lazy" />
        </Link>
        <div className="recipe-card__fav">
          <FavoriteButton id={id} title={title} thumb={thumb} compact />
        </div>
        {matched.length > 0 && (
          <span className={`recipe-card__badge${isFullMatch ? " recipe-card__badge--full" : ""}`}>
            <Icon name="check" size={14} />
            {matched.length} из {total}
          </span>
        )}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title"><Link to={`/recipe/${id}`}>{title}</Link></h3>
        {matched.length > 0 && (
          <ul className="recipe-card__tags">
            {matched.map((name) => <li key={name}>{name}</li>)}
          </ul>
        )}
        <Button variant="ghost" className="recipe-card__toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Скрыть" : "Чего не хватает?"}
          <Icon name="chevron" size={16} />
        </Button>
        {open && (
          <div className="recipe-card__details">
            {isLoading && <Loader text="Загружаем состав..." />}
            {isError && (
              <>
                <p className="recipe-card__status recipe-card__status--missing">Не удалось загрузить состав</p>
                <Button variant="ghost" onClick={refetch}>Повторить</Button>
              </>
            )}
            {recipe && (
              missing.length === 0
                ? (
                  <p className="recipe-card__status recipe-card__status--ready">
                    <Icon name="check" size={16} />Всё есть, можно готовить
                  </p>
                )
                : (
                  <>
                    <p className="recipe-card__label">Не хватает {missing.length} из {recipe.ingredients.length}:</p>
                    <ul className="mini-chips">
                      {missing.map((item) => <li key={item}>{toRussian(item)}</li>)}
                    </ul>
                  </>
                )
            )}
          </div>
        )}
      </div>
    </article>
  )
}
