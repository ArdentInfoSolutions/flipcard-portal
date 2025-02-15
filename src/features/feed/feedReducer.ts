import { createSlice } from "@reduxjs/toolkit"
import type { FeedState } from "../../lib/types"
import { fetchWebItems } from "./feedThunks"

const initialState: FeedState = {
  webItems: [],
  loading: false,
  error: null,
}

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWebItems.fulfilled, (state, action) => {
        state.webItems = action.payload
        state.loading = false
      })
      .addCase(fetchWebItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch web items"
      })
  },
})

export default feedSlice.reducer

