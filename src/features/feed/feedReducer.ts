import { createSlice } from "@reduxjs/toolkit"
import type { FeedState } from "../../lib/types"
import { fetchAllPostsFeed } from "./feedThunks"

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
}

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPostsFeed.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPostsFeed.fulfilled, (state, action) => {
        state.posts = action.payload
        state.loading = false
      })
      .addCase(fetchAllPostsFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch all posts items"
      })
  },
})

export default feedSlice.reducer

