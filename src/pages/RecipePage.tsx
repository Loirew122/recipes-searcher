import { Link, useParams } from "react-router-dom"
import { skipToken } from '@reduxjs/toolkit/query'
import { useAppSelector } from '@/app/hooks'
import { Loader } from "@shared/ui/Loader"
import { EmptyState } from "@shared/ui/EmptyState"
import { ErrorBox } from "@shared/ui/ErrorBox"
import { Icon } from "@shared/ui/Icon"
import { plural } from "@shared/lib/plural"
import { toEnglish, toRussian } from "@shared/lib/ingredients"
import { selectIngredients } from "@features/ingredients/IngredientsSlice"
import { FavoriteButton } from "@features/favorites/FavoriteButton"
import { useGetRecipeQuery } from "@/app/api"
import "./RecipePage.css"

export function RecipePage() {
  const { id } = useParams()
  const { data: recipe, isLoading, isError, error, refetch } = useGetRecipeQuery(id ?? skipToken)
  const userIngredients = useAppSelector(selectIngredients)

  if (isLoading) return <Loader text="Загружаем рецепт..." />
  if (isError) return <ErrorBox message={error.message} onRetry={() => { void refetch() }} />
  if (!recipe) {
    return (
      <EmptyState icon="utensils" title="Рецепт не найден" hint="Проверьте адрес">
        <Link to="/" className="btn btn--primary">К поиску</Link>
      </EmptyState>
    )
  }

  const have = userIngredients.map(toEnglish)
  const isHave = (item: string): boolean => have.some((h) => item.includes(h))
  const missing = recipe.ingredients.filter((item) => !isHave(item))
  const total = recipe.ingredients.length
  const percent = total > 0 ? Math.round(((total - missing.length) / total) * 100) : 0
  const tags = [recipe.category, recipe.area].filter(
    (tag): tag is string => Boolean(tag) && tag !== 'Unknown',
  )

  return (
    <article className="page recipe-page">
      <Link to="/" className="back-link"><Icon name="back" />К поиску</Link>

      <header className="recipe-hero">
        <img className="recipe-hero__image" src={recipe.thumb} alt={recipe.title} />
        <div className="recipe-hero__overlay">
          {tags.length > 0 && (
            <ul className="recipe-hero__tags">
              {tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          <h1 className="recipe-hero__title">{recipe.title}</h1>
        </div>
      </header>

      <div className="recipe-page__actions">
        <FavoriteButton id={recipe.id} title={recipe.title} thumb={recipe.thumb} />
        {recipe.youtube && (
          <a className="btn btn--ghost" href={recipe.youtube} target="_blank" rel="noreferrer">
            <Icon name="play" />Видео-рецепт
          </a>
        )}
      </div>

      <div className="progress-card">
        {missing.length === 0
          ? (
            <p className="progress-card__text progress-card__text--ready">
              <Icon name="check" />Всё есть, можно готовить
            </p>
          )
          : (
            <p className="progress-card__text progress-card__text--missing">
              Есть {total - missing.length} из {total} — не хватает {missing.length}{" "}
              {plural(missing.length, ["продукта", "продуктов", "продуктов"])}
            </p>
          )}
        <div className="meter" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
        aria-label="Сколько продуктов уже есть">
          <span className="meter__bar" style={{ width: `${percent}%` }} />
        </div>
        {missing.length > 0 && (
          <p className="progress-card__hint">Докупить: {missing.map(toRussian).join(", ")}</p>
        )}
      </div>

      <div className="recipe-page__layout">
        <section className="recipe-section recipe-page__aside">
          <h2>Состав <span className="recipe-section__count">{total}</span></h2>
          <ul className="ingredients">
            {recipe.ingredients.map((item, i) => (
              <li key={`${item}-${i}`}
              className={`ingredients__item ingredients__item--${isHave(item) ? "have" : "missing"}`}>
                <span className="ingredients__mark"><Icon name="check" size={13} /></span>
                <span className="ingredients__name">{item}</span>
                {recipe.measures[i] && <span className="ingredients__measure">{recipe.measures[i]}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-section">
          <h2>Приготовление</h2>
          <ol className="steps">
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>
      </div>
    </article>
  )
}
