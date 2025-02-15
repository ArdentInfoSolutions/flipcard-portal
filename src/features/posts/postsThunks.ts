import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchPostItems as apiFetchPostItems } from "../../lib/api-mock"

export const fetchPostItems = createAsyncThunk("posts/fetchPostItems", async (_, { rejectWithValue }) => {
  try {
    const postItems = await apiFetchPostItems()
    return postItems
  } catch (error) {
    return rejectWithValue("Failed to fetch post items")
  }
})

