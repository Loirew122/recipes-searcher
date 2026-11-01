import axios from 'axios'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { searchRecipes, getRecipe } from '@features/recipes/recipesApi'
import {
  fetchFavorites,
  createFavorite,
  deleteFavorite,
} from '@features/favorites/favoritesApi'
import { isRecord } from '@shared/lib/apiGuards'
import type {
  FavoriteRecipe,
  RecipeDetails,
  RecipeSearchResult,
} from '@shared/types/recipe'

interface ApiError {
  message: string
}

type QueryResult<T> =
  | { data: T }
  | { error: ApiError }

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<unknown>(error)) {
    const responseData = error.response?.data

    if (isRecord(responseData) && typeof responseData.message === 'string') {
      return responseData.message
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Произошла неизвестная ошибка'
}

async function toResult<T>(promise: Promise<T>): Promise<QueryResult<T>> {
  try {
    return { data: await promise }
  } catch (error: unknown) {
    return { error: { message: getErrorMessage(error) } }
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Favorites'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    searchRecipes: builder.query<RecipeSearchResult[], string[]>({
      queryFn: (ingredients, { signal }) =>
        toResult(searchRecipes(ingredients, signal)),
    }),
    getRecipe: builder.query<RecipeDetails | null, string>({
      queryFn: (id, { signal }) => toResult(getRecipe(id, signal)),
    }),
    getFavorites: builder.query<FavoriteRecipe[], void>({
      queryFn: (_arg, { signal }) => toResult(fetchFavorites(signal)),
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation<FavoriteRecipe, FavoriteRecipe>({
      queryFn: (recipe) => toResult(createFavorite(recipe)),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation<string, string>({
      queryFn: (id) => toResult(deleteFavorite(id)),
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useSearchRecipesQuery,
  useGetRecipeQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = api