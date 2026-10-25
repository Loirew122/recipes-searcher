import { createSlice } from "@reduxjs/toolkit"

const searchSlice = createSlice({
    name: "search",
    initialState: { submitted: [] },
    reducers: {
        submitSearch(state, action) {
            state.submitted = action.payload
        },
    },
})

export const { submitSearch } = searchSlice.actions
export const selectSubmittedSearch = (state) => state.search.submitted
export default searchSlice.reducer
