import { favoritesClient } from "@shared/api/favoritesClient"

export async function fetchFavorites(signal) {
    const response = await favoritesClient.get("/favorites", { signal })
    return response.data
}

export async function createFavorite(recipe) {
    const response = await favoritesClient.post("/favorites", recipe)
    return response.data
}

export async function deleteFavorite(id) {
    await favoritesClient.delete(`/favorites/${id}`)
    return id
}
