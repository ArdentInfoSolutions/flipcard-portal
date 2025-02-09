import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../lib/api-mock"
import type { RootState } from "../../redux/store"
import type { WebItem, SocialMediaPost } from "./types"

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

