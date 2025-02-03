import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../redux/store"
import { api } from "../api-mock"
import { WebItem, SocialMediaPost } from "../types"


interface FeedState {
  webItems: WebItem[]
  socialMediaPosts: SocialMediaPost[]
  loading: boolean
  error: string | null
}

const initialState: FeedState = {
  webItems: [],
  socialMediaPosts: [],
  loading: false,
  error: null,
}

export const fetchWebItems = createAsyncThunk("feed/fetchWebItems", async () => {
  return api.fetchWebItems()
})

export const fetchSocialMediaPosts = createAsyncThunk("feed/fetchSocialMediaPosts", async () => {
  return api.fetchSocialMediaPosts()
})

export const likeWebItem = createAsyncThunk("feed/likeWebItem", async (id: string, { getState }) => {
  const state = getState() as RootState
  const userId = state.auth.user?.uid
  if (!userId) throw new Error("User not authenticated")

  return api.likeWebItem(id, userId)
})

export const bookmarkWebItem = createAsyncThunk("feed/bookmarkWebItem", async (id: string, { getState }) => {
  const state = getState() as RootState
  const userId = state.auth.user?.uid
  if (!userId) throw new Error("User not authenticated")

  return api.bookmarkWebItem(id, userId)
})

export const uploadWebItem = createAsyncThunk(
  "feed/uploadWebItem",
  async (webItemData: Partial<WebItem>, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.user?.uid
    if (!userId) throw new Error("User not authenticated")

    return api.uploadWebItem(webItemData, userId)
  },
)

export const uploadSocialMediaPost = createAsyncThunk(
  "feed/uploadSocialMediaPost",
  async (postData: Partial<SocialMediaPost>, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.user?.uid
    if (!userId) throw new Error("User not authenticated")

    return api.uploadSocialMediaPost(postData, userId)
  },
)

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

