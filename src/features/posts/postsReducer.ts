import { createSlice } from "@reduxjs/toolkit"
import type { PostItemState } from "../../lib/types"
import { fetchPostItems } from "./postsThunks"

const initialState: PostItemState = {
  postItems: [],
  loading: false,
  error: null,
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostItems.fulfilled, (state, action) => {
        state.postItems = action.payload
        state.loading = false
      })
      .addCase(fetchPostItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch post items"
      })
  },
})

export default postsSlice.reducer

