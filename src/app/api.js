import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { searchRecipes, getRecipe } from "@features/recipes/recipesApi"
import { fetchFavorites, createFavorite, deleteFavorite } from "@features/favorites/favoritesApi"

function toResult(promise) {
    return promise
        .then((data) => ({ data }))
        .catch((err) => ({ error: { message: err.response?.data?.message ?? err.message } }))
}

export const api = createApi({
    reducerPath: "api",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Favorites"],
    keepUnusedDataFor: 300,
    endpoints: (builder) => ({
        searchRecipes: builder.query({
            queryFn: (ingredients, { signal }) => toResult(searchRecipes(ingredients, signal)),
        }),
        getRecipe: builder.query({
            queryFn: (id, { signal }) => toResult(getRecipe(id, signal)),
        }),
        getFavorites: builder.query({
            queryFn: (_arg, { signal }) => toResult(fetchFavorites(signal)),
            providesTags: ["Favorites"],
        }),
        addFavorite: builder.mutation({
            queryFn: (recipe) => toResult(createFavorite(recipe)),
            invalidatesTags: ["Favorites"],
        }),
        removeFavorite: builder.mutation({
            queryFn: (id) => toResult(deleteFavorite(id)),
            invalidatesTags: ["Favorites"],
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
