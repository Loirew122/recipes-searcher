import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { IngredientList } from '@features/ingredients/IngredientList'
import { IngredientForm } from '@features/ingredients/IngredientForm'
import { IngredientSuggestions } from '@features/ingredients/IngredientSuggestions'
import { selectIngredients } from '@features/ingredients/IngredientsSlice'
import { RecipeList } from '@features/recipes/RecipeList'
import {
  selectSubmittedSearch,
  submitSearch,
} from '@features/recipes/searchSlice'
import { useSearchRecipesQuery } from '@/app/api'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Button } from '@shared/ui/Button'
import { Icon } from '@shared/ui/Icon'
import { plural } from '@shared/lib/plural'
import { parseRecipeLimit } from '@shared/lib/recipeLimit'
import './HomePage.css'

export function HomePage() {
  const [recipeLimitInput, setRecipeLimitInput] = useState<string>('12')
  const [lastValidRecipeLimit, setLastValidRecipeLimit] = useState<number>(12)
  const dispatch = useAppDispatch()
  const ingredients = useAppSelector(selectIngredients)
  const submitted = useAppSelector(selectSubmittedSearch)
  const {
    data: recipes = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchRecipesQuery(submitted)

  const recipeLimit = parseRecipeLimit(recipeLimitInput)
  const visibleRecipes = recipes.slice(0, lastValidRecipeLimit)
  const showCount = !isLoading && !isError && visibleRecipes.length > 0

  function handleRecipeLimitChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextInput = event.target.value
    const nextLimit = parseRecipeLimit(nextInput)

    setRecipeLimitInput(nextInput)
    if (nextLimit !== null) {
      setLastValidRecipeLimit(nextLimit)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">
          Что приготовим <em>сегодня</em>?
        </h1>
        <p className="hero__subtitle">
          Добавьте продукты, которые есть под рукой, — подберём рецепты и подскажем, чего не хватает
        </p>
      </header>

      <section className="panel" aria-label="Мои продукты">
        <IngredientForm />
        <IngredientList />
        <IngredientSuggestions />
        <label className="limit-field">
          <span className="limit-field__label">Максимум рецептов</span>
          <input
            className="input limit-field__input"
            type="number"
            min="1"
            max="20"
            step="1"
            value={recipeLimitInput}
            onChange={handleRecipeLimitChange}
            aria-invalid={recipeLimit === null}
            aria-describedby={recipeLimit === null ? 'recipe-limit-error' : undefined}
          />
        </label>
        {recipeLimit === null && (
          <p className="limit-field__error" id="recipe-limit-error" role="alert">
            Введите целое число от 1 до 20
          </p>
        )}
        <Button
          className="panel__submit"
          onClick={() => dispatch(submitSearch(ingredients))}
          disabled={ingredients.length === 0 || isFetching || recipeLimit === null}
          aria-busy={isFetching}
        >
          {isFetching ? (
            <span className="btn__spinner" aria-hidden="true" />
          ) : (
            <Icon name="search" />
          )}
          {isFetching ? 'Ищем рецепты...' : 'Найти рецепты'}
        </Button>
      </section>

      <section className="results">
        <div className="results__head">
          <h2 className="results__title">
            {submitted.length > 0 ? 'Подходящие рецепты' : 'Идеи для вдохновения'}
          </h2>
          {showCount && (
            <span className="results__count">
              {visibleRecipes.length} {plural(visibleRecipes.length, ['рецепт', 'рецепта', 'рецептов'])}
              {visibleRecipes.length < recipes.length && ` из ${recipes.length}`}
            </span>
          )}
        </div>
        <RecipeList
          recipes={visibleRecipes}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          error={error}
          onRetry={() => { void refetch() }}
        />
      </section>
    </div>
  )
}
