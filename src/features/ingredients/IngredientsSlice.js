import { createSlice } from "@reduxjs/toolkit"

function ucFirst(str) {
    if (!str) return str
    return str[0].toUpperCase() + str.slice(1)
}

const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState: { items: [], error: "" },
    reducers: {
        addIngredient(state, action) {
            const clearName = action.payload.trim().toLowerCase()
            if (clearName === "") {
                state.error = "Название не должно быть пустым"
                return
            }
            if (state.items.some((i) => i.toLowerCase() === clearName)) {
                state.error = "Такой ингридиент уже есть"
                return
            }
            state.items.push(ucFirst(clearName))
            state.error = ""
        },
        removeIngredient(state, action) {
            state.items = state.items.filter((item) => item !== action.payload)
        },
    },
})

export const { addIngredient, removeIngredient } = ingredientsSlice.actions
export const selectIngredients = (state) => state.ingredients.items
export const selectIngredientsError = (state) => state.ingredients.error
export default ingredientsSlice.reducer