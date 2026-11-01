import { httpClient } from '@shared/api/httpClient'
import {
  isRecord,
  nullableString,
  requireString,
} from '@shared/lib/apiGuards'
import { toEnglish } from '@/shared/lib/ingredients'
import type { RecipeDetails, RecipeSearchResult } from '@shared/types/recipe'

function readMeals(data: unknown): unknown[] {
  if (!isRecord(data)) {
    throw new Error('Ответ TheMealDB должен быть объектом')
  }

  const meals = data.meals

  if (meals === null) {
    return []
  }

  if (!Array.isArray(meals)) {
    throw new Error('Поле meals в ответе TheMealDB должно быть массивом или null')
  }

  return meals
}

function toSearchResult(value: unknown): RecipeSearchResult {
  if (!isRecord(value)) {
    throw new Error('Рецепт в результатах поиска должен быть объектом')
  }

  return {
    id: requireString(value.idMeal, 'idMeal'),
    title: requireString(value.strMeal, 'strMeal'),
    thumb: requireString(value.strMealThumb, 'strMealThumb'),
    matched: [],
  }
}

function toRecipeDetails(value: unknown): RecipeDetails {
  if (!isRecord(value)) {
    throw new Error('Данные рецепта должны быть объектом')
  }

  const ingredients: string[] = []
  const measures: string[] = []

  for (let n = 1; n <= 20; n++) {
    const name = nullableString(value[`strIngredient${n}`], `strIngredient${n}`)

    if (name && name.trim()) {
      const measure = nullableString(value[`strMeasure${n}`], `strMeasure${n}`)

      ingredients.push(name.trim().toLowerCase())
      measures.push(measure?.trim() ?? '')
    }
  }

  const instructions = nullableString(value.strInstructions, 'strInstructions')
  const steps = (instructions ?? '')
    .split(/\r?\n/)
    .map((line) =>
      line
        .trim()
        .replace(/^([-–•▢*]|step\s*\d+[.):]?|\d+[.)])\s*/i, ''),
    )
    .filter((line) => line && line !== line.toUpperCase())

  return {
    id: requireString(value.idMeal, 'idMeal'),
    title: requireString(value.strMeal, 'strMeal'),
    thumb: requireString(value.strMealThumb, 'strMealThumb'),
    ingredients,
    measures,
    steps,
    category: nullableString(value.strCategory, 'strCategory'),
    area: nullableString(value.strArea, 'strArea'),
    youtube: nullableString(value.strYoutube, 'strYoutube'),
  }
}

async function fetchByIngredient(
  name: string,
  signal: AbortSignal,
): Promise<unknown[]> {
  const ingredient = toEnglish(name).replaceAll(' ', '_')
  const response = await httpClient.get<unknown>('/filter.php', {
    params: { i: ingredient },
    signal,
  })

  return readMeals(response.data)
}

export async function searchRecipes(
  userIngredients: string[],
  signal: AbortSignal,
): Promise<RecipeSearchResult[]> {
  if (userIngredients.length === 0) {
    const response = await httpClient.get<unknown>('/filter.php', {
      params: { c: 'Seafood' },
      signal,
    })

    return readMeals(response.data).map(toSearchResult)
  }

  const lists = await Promise.all(
    userIngredients.map((name) => fetchByIngredient(name, signal)),
  )
  const byId = new Map<string, RecipeSearchResult>()

  lists.forEach((meals, index) => {
    const matchedIngredient = userIngredients[index]

    if (matchedIngredient === undefined) {
      return
    }

    meals.forEach((meal) => {
      const searchResult = toSearchResult(meal)
      const recipe = byId.get(searchResult.id) ?? searchResult

      recipe.matched.push(matchedIngredient)
      byId.set(recipe.id, recipe)
    })
  })

  return [...byId.values()].sort(
    (a, b) => b.matched.length - a.matched.length,
  )
}

export async function getRecipe(
  id: string,
  signal: AbortSignal,
): Promise<RecipeDetails | null> {
  const response = await httpClient.get<unknown>('/lookup.php', {
    params: { i: id },
    signal,
  })
  const meals = readMeals(response.data)
  const meal = meals[0]

  if (meal === undefined) {
    return null
  }

  return toRecipeDetails(meal)
}