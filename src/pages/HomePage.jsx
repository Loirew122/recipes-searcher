import { useDispatch, useSelector } from "react-redux"
import { IngredientList } from "@features/ingredients/IngredientList.jsx"
import { IngredientForm } from "@features/ingredients/IngredientForm.jsx"
import { IngredientSuggestions } from "@features/ingredients/IngredientSuggestions.jsx"
import { selectIngredients } from "@features/ingredients/IngredientsSlice.js"
import { RecipeList } from "@features/recipes/RecipeList"
import { selectSubmittedSearch, submitSearch } from "@features/recipes/searchSlice"
import { useSearchRecipesQuery } from "@/app/api"
import { Button } from "@shared/ui/Button.jsx"
import { Icon } from "@shared/ui/Icon.jsx"
import { plural } from "@shared/lib/plural"
import "./HomePage.css"

export function HomePage() {
  const dispatch = useDispatch()
  const ingredients = useSelector(selectIngredients)
  const submitted = useSelector(selectSubmittedSearch)
  const { data: recipes = [], isLoading, isFetching, isError, error, refetch } = useSearchRecipesQuery(submitted)
  const showCount = !isLoading && !isError && recipes.length > 0

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">Что приготовим <em>сегодня</em>?</h1>
        <p className="hero__subtitle">
          Добавьте продукты, которые есть под рукой, — подберём рецепты и подскажем, чего не хватает
        </p>
      </header>
      <section className="panel" aria-label="Мои продукты">
        <IngredientForm />
        <IngredientList />
        <IngredientSuggestions />
        <Button className="panel__submit" onClick={() => dispatch(submitSearch(ingredients))}
        disabled={ingredients.length === 0 || isFetching} aria-busy={isFetching}>
          {isFetching ? <span className="btn__spinner" aria-hidden="true" /> : <Icon name="search" />}
          {isFetching ? "Ищем рецепты..." : "Найти рецепты"}
        </Button>
      </section>
      <section className="results">
        <div className="results__head">
          <h2 className="results__title">
            {submitted.length > 0 ? "Подходящие рецепты" : "Идеи для вдохновения"}
          </h2>
          {showCount && (
            <span className="results__count">
              {recipes.length} {plural(recipes.length, ["рецепт", "рецепта", "рецептов"])}
            </span>
          )}
        </div>
        <RecipeList recipes={recipes} isLoading={isLoading} isFetching={isFetching} isError={isError}
        error={error} onRetry={refetch} />
      </section>
    </div>
  )
}
