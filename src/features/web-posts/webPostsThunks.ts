import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchWebPostItems as apiFetchPostItems } from "../../lib/api-mock"

export const fetchWebPostItems = createAsyncThunk("posts/fetchWebPostItems", async (_, { rejectWithValue }) => {
  try {
    const postItems = await apiFetchPostItems()
    return postItems
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue("Failed to fetch post items")
  }
})

