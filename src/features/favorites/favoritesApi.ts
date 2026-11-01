import { favoritesClient } from '@shared/api/favoritesClient'
import { isRecord, requireString } from '@shared/lib/apiGuards'
import type { FavoriteRecipe } from '@shared/types/recipe'

const FAVORITES_STORAGE_KEY = 'recipe-ai-favorites'
const favoritesServerUrl = import.meta.env.VITE_FAVORITES_URL?.trim()

function parseFavorite(value: unknown): FavoriteRecipe {
  if (!isRecord(value)) {
    throw new Error('Элемент избранного должен быть объектом')
  }

  return {
    id: requireString(value.id, 'id'),
    title: requireString(value.title, 'title'),
    thumb: requireString(value.thumb, 'thumb'),
  }
}

function parseFavorites(value: unknown): FavoriteRecipe[] {
  if (!Array.isArray(value)) {
    throw new Error('Ответ со списком избранного должен быть массивом')
  }

  return value.map((item: unknown) => parseFavorite(item))
}

function readStoredFavorites(): FavoriteRecipe[] {
  const value = localStorage.getItem(FAVORITES_STORAGE_KEY)

  if (value === null) {
    return []
  }

  return parseFavorites(JSON.parse(value))
}

function writeStoredFavorites(favorites: FavoriteRecipe[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

export async function fetchFavorites(
  signal: AbortSignal,
): Promise<FavoriteRecipe[]> {
  if (!favoritesServerUrl) {
    if (signal.aborted) {
      throw new DOMException('Запрос отменён', 'AbortError')
    }

    return readStoredFavorites()
  }

  const response = await favoritesClient.get<unknown>('/favorites', { signal })

  return parseFavorites(response.data)
}

export async function createFavorite(
  recipe: FavoriteRecipe,
): Promise<FavoriteRecipe> {
  if (!favoritesServerUrl) {
    const favorites = readStoredFavorites()

    if (favorites.some((item) => item.id === recipe.id)) {
      throw new Error('Уже в избранном')
    }

    writeStoredFavorites([...favorites, recipe])
    return recipe
  }

  const response = await favoritesClient.post<unknown>('/favorites', recipe)

  return parseFavorite(response.data)
}

export async function deleteFavorite(id: string): Promise<string> {
  if (!favoritesServerUrl) {
    const favorites = readStoredFavorites()
    const remaining = favorites.filter((item) => item.id !== id)

    if (remaining.length === favorites.length) {
      throw new Error('Не найдено')
    }

    writeStoredFavorites(remaining)
    return id
  }

  await favoritesClient.delete(`/favorites/${id}`)

  return id
}
