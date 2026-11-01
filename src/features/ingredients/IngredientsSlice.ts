import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

interface IngredientsState {
  items: string[]
  error: string
}

const initialState: IngredientsState = {
  items: [],
  error: '',
}

function ucFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<string>) {
      const clearName = action.payload.trim().toLowerCase()

      if (clearName === '') {
        state.error = 'Название не должно быть пустым'
        return
      }

      if (state.items.some((item) => item.toLowerCase() === clearName)) {
        state.error = 'Такой ингредиент уже есть'
        return
      }

      state.items.push(ucFirst(clearName))
      state.error = ''
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item !== action.payload)
    },
  },
})

export const { addIngredient, removeIngredient } = ingredientsSlice.actions

export const selectIngredients = (state: RootState) => state.ingredients.items
export const selectIngredientsError = (state: RootState) => state.ingredients.error

export default ingredientsSlice.reducer
