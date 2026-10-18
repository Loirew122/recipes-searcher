import {IngredientList}  from "@features/ingredients/IngredientList.jsx"
import { IngredientForm } from "@features/ingredients/IngredientForm.jsx"
import { RecipeList } from "@features/recipes/RecipeList"
import { useIngredients } from "@features/ingredients/useIngredients.js"
import { useRecipeSearch } from "@features/recipes/useRecipeSearch.js"
import { Button } from "@shared/ui/Button.jsx"


function App(){

  const {ingredients, error, addIngredienst,  removeIngredient} = useIngredients();
  const { status, foundRecipes, searchError, search, reload } = useRecipeSearch()

  return (
    <main>
      <h1>Придумывалка рецептов</h1>
      <h2>Продуктов : {ingredients.length}</h2>
      <IngredientForm onAdd = {addIngredienst} error = {error}/>
      <IngredientList items = {ingredients} onRemove={removeIngredient}/>
      <Button onClick={() => search(ingredients)}
      disabled={ingredients.length === 0 || status ==='loading'}>
        Найти рецепты</Button>
      <RecipeList status = {status} recipes={foundRecipes}
      error = {searchError} onRetry={reload} userIngredients={ingredients}/>
    </main>
  )
}

export default App
