import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchWebItems as apiFetchWebItems } from "../../lib/api-mock"

export const fetchWebItems = createAsyncThunk("feed/fetchWebItems", async (_, { rejectWithValue }) => {
  try {
    const webItems = await apiFetchWebItems()
    return webItems
  } catch (error) {
    return rejectWithValue("Failed to fetch web items")
  }
})

