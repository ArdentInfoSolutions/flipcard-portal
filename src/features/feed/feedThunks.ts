import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchAllPostItems, fetchImagePostItems, fetchVideoPostItems, fetchWebPostItems } from "../../lib/api-mock"

export const fetchAllPostsFeed = createAsyncThunk(
  "feed/fetchAllPostsFeed", async (_, { rejectWithValue }) => {
  try {
    const postItems = await fetchAllPostItems()
    return postItems
  } catch (error) {
    return rejectWithValue("Failed to fetch all posts feed items")
  }
})

export const fetchImagePostsFeed = createAsyncThunk("feed/fetchImagePostsFeed", async (_, { rejectWithValue }) => {
  try {
    const postItems = await fetchImagePostItems()
    return postItems
  } catch (error) {
    return rejectWithValue("Failed to fetch image posts feed items")
  }
})

export const fetchVideoPostsFeed = createAsyncThunk("feed/fetchVideoPostsFeed", async (_, { rejectWithValue }) => {
  try {
    const postItems = await fetchVideoPostItems()
    return postItems
  } catch (error) {
    return rejectWithValue("Failed to fetch video posts feed items")
  }
})

export const fetchWebPostsFeed = createAsyncThunk("feed/fetchWebPostsFeed", async (_, { rejectWithValue }) => {
  try {
    const postItems = await fetchWebPostItems()
    return postItems
  } catch (error) {
    return rejectWithValue("Failed to fetch web posts feed items")
  }
})