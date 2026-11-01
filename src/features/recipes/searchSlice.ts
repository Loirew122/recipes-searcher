import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

interface SearchState {
  submitted: string[]
}

const initialState: SearchState = {
  submitted: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    submitSearch(state, action: PayloadAction<string[]>) {
      state.submitted = action.payload
    },
  },
})

export const { submitSearch } = searchSlice.actions

export const selectSubmittedSearch = (state: RootState) =>
  state.search.submitted

export default searchSlice.reducer
