import { httpClient } from "@shared/api/httpClient"
import { toEnglish } from "@/shared/lib/ingredients"
async function fetchByIngredient(name, signal) {
    const ingredient = toEnglish(name).replaceAll(" ", "_")
    const response = await httpClient.get("/filter.php", {params : {i: ingredient}, signal})
    return response.data.meals ?? []
}

function toRecipe(meal){
    return {id : meal.idMeal, title : meal.strMeal, thumb : meal.strMealThumb, matched: []}
}


export async function searchRecipes(userIngredients, signal) {
    if (userIngredients.length === 0){
        const response = await httpClient.get("/filter.php", {params : {c: "Seafood"}, signal})
            return (response.data.meals ?? []).map(toRecipe)
    }

    const lists = await Promise.all(userIngredients.map((name)=> fetchByIngredient(name, signal)))
    const byId = new Map()
    lists.forEach((meals, index) => {
        meals.forEach((meal) => {
            const recipe = byId.get(meal.idMeal) ?? toRecipe(meal)
            recipe.matched.push(userIngredients[index])
            byId.set(meal.idMeal, recipe)
        })
    })
    return [...byId.values()].sort((a, b) => b.matched.length - a.matched.length)
}
export async function getRecipe(id, signal) {
    const response = await httpClient.get("/lookup.php", { params: { i: id }, signal })
    const meal = response.data.meals?.[0]
    if (!meal) return null
    const ingredients = []
    const measures = []
    for (let n = 1; n <= 20; n++) {
        const name = meal[`strIngredient${n}`]
        if (name && name.trim()) {
            ingredients.push(name.trim().toLowerCase())
            measures.push(meal[`strMeasure${n}`]?.trim() ?? "")
        }
    }
    const steps = (meal.strInstructions ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim().replace(/^([-–•▢*]|step\s*\d+[.):]?|\d+[.)])\s*/i, ""))
        .filter((line) => line && line !== line.toUpperCase())
    return {
        id: meal.idMeal,
        title: meal.strMeal,
        thumb: meal.strMealThumb,
        ingredients,
        measures,
        steps,
        category: meal.strCategory,
        area: meal.strArea,
        youtube: meal.strYoutube,
    }
}
