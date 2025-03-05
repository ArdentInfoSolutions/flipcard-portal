import { createAsyncThunk } from "@reduxjs/toolkit"
import { createPostItem } from "@/lib/api-mock"
import type { PostItem } from "@/lib/types"

export const createPost = createAsyncThunk<void, PostItem>(
  "createPost/createPost",
  async (postItem, { rejectWithValue }) => {
    try {
      await createPostItem(postItem)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

