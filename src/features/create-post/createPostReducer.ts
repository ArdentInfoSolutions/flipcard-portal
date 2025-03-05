import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { createPost } from "./createPostThunks"

interface CreatePostState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: CreatePostState = {
  loading: false,
  error: null,
  success: false,
}

const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    resetCreatePostState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(createPost.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || "An error occurred"
        state.success = false
      })
  },
})

export const { resetCreatePostState } = createPostSlice.actions
export default createPostSlice.reducer

