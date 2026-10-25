import { useDispatch, useSelector } from "react-redux"
import { IngredientList } from "@features/ingredients/IngredientList.jsx"
import { IngredientForm } from "@features/ingredients/IngredientForm.jsx"
import { selectIngredients } from "@features/ingredients/IngredientsSlice.js"
import { RecipeList } from "@features/recipes/RecipeList"
import { selectSubmittedSearch, submitSearch } from "@features/recipes/searchSlice"
import { useSearchRecipesQuery } from "@/app/api"
import { Button } from "@shared/ui/Button.jsx"

export function HomePage() {
  const dispatch = useDispatch()
  const ingredients = useSelector(selectIngredients)
  const submitted = useSelector(selectSubmittedSearch)
  const { data: recipes = [], isLoading, isFetching, isError, error, refetch } = useSearchRecipesQuery(submitted)

  return (
    <>
      <section className="panel">
        <IngredientForm />
        <IngredientList />
        <Button onClick={() => dispatch(submitSearch(ingredients))}
        disabled={ingredients.length === 0 || isFetching}>
          Найти рецепты</Button>
      </section>
      <RecipeList recipes={recipes} isLoading={isLoading} isError={isError}
      error={error} onRetry={refetch} />
    </>
  )
}
