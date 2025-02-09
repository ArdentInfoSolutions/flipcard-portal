import { createSlice } from "@reduxjs/toolkit"
import { fetchUserProfile, updateUserProfile } from "./thunks"
import type { UserState } from "./types"

const initialState: UserState = {
    profile: null,
    loading: false,
    error: null,
}
  
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserProfile.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.loading = false
          state.profile = action.payload
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || "An error occurred"
        })
        .addCase(updateUserProfile.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.loading = false
          state.profile = action.payload
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || "An error occurred"
        })
    },
  })
  
  export default userSlice.reducer
  