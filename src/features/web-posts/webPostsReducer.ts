import { createSlice } from "@reduxjs/toolkit"
import type { PostItemState } from "../../lib/types"
import { fetchWebPostItems } from "./webPostsThunks"

const initialState: PostItemState = {
  postItems: [],
  loading: false,
  error: null,
}

const webPostsSlice = createSlice({
  name: "webPosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebPostItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWebPostItems.fulfilled, (state, action) => {
        state.postItems = action.payload
        state.loading = false
      })
      .addCase(fetchWebPostItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch web post items"
      })
  },
})

export default webPostsSlice.reducer

