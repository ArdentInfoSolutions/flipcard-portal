import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchVideoPostItems as apiFetchPostItems } from "../../lib/api-mock"

export const fetchVideoPostItems = createAsyncThunk("posts/fetchVideoPostItems", async (_, { rejectWithValue }) => {
  try {
    const postItems = await apiFetchPostItems()
    return postItems
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to fetch post items")
  }
})

