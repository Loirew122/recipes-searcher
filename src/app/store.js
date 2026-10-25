import { configureStore } from "@reduxjs/toolkit"
import ingredientsReducer from "@features/ingredients/IngredientsSlice"
import searchReducer from "@features/recipes/searchSlice"
import { api } from "@/app/api"

export const store = configureStore({
    reducer: {
        ingredients: ingredientsReducer,
        search: searchReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})
