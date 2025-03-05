import { createSlice } from "@reduxjs/toolkit"
import type { PostItemState } from "../../lib/types"
import { fetchVideoPostItems } from "./videoPostsThunks"

const initialState: PostItemState = {
  postItems: [],
  loading: false,
  error: null,
}

const videoPostsSlice = createSlice({
  name: "videoPosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoPostItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVideoPostItems.fulfilled, (state, action) => {
        state.postItems = action.payload
        state.loading = false
      })
      .addCase(fetchVideoPostItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch web post items"
      })
  },
})

export default videoPostsSlice.reducer

