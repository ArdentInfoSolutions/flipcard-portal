import { createSlice } from "@reduxjs/toolkit"
import type { FeedState } from "./types"
import {
  fetchWebItems,
  fetchSocialMediaPosts,
  likeWebItem,
  bookmarkWebItem,
  uploadWebItem,
  uploadSocialMediaPost,
} from "./thunks"

const initialState: FeedState = {
  webItems: [],
  socialMediaPosts: [],
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
        state.loading = false
        state.webItems = action.payload
      })
      .addCase(fetchWebItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "An error occurred"
      })
      .addCase(fetchSocialMediaPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSocialMediaPosts.fulfilled, (state, action) => {
        state.loading = false
        state.socialMediaPosts = action.payload
      })
      .addCase(fetchSocialMediaPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "An error occurred"
      })
      .addCase(likeWebItem.fulfilled, (state, action) => {
        const index = state.webItems.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.webItems[index] = action.payload
        }
      })
      .addCase(bookmarkWebItem.fulfilled, (state, action) => {
        const index = state.webItems.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.webItems[index] = action.payload
        }
      })
      .addCase(uploadWebItem.fulfilled, (state, action) => {
        state.webItems.unshift(action.payload)
      })
      .addCase(uploadSocialMediaPost.fulfilled, (state, action) => {
        state.socialMediaPosts.unshift(action.payload)
      })
  },
})

export default feedSlice.reducer

