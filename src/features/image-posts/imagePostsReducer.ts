import { createSlice } from "@reduxjs/toolkit"
import type { PostItemState } from "../../lib/types"
import { fetchImagePostItems } from "./imagePostsThunks"

const initialState: PostItemState = {
  postItems: [],
  loading: false,
  error: null,
}

const imagePostsSlice = createSlice({
  name: "imagePosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagePostItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchImagePostItems.fulfilled, (state, action) => {
        state.postItems = action.payload
        state.loading = false
      })
      .addCase(fetchImagePostItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch web post items"
      })
  },
})

export default imagePostsSlice.reducer

