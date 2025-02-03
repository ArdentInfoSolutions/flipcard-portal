import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../redux/store"
import { api } from "../api-mock"
import type { UserProfile } from "../types"

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
}

export const fetchUserProfile = createAsyncThunk("user/fetchUserProfile", async (userId: string) => {
  return api.fetchUserProfile(userId)
})

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData: Partial<UserProfile>, { getState }) => {
    const state = getState() as RootState
    const userId = state.auth.user?.uid
    if (!userId) throw new Error("User not authenticated")

    return api.updateUserProfile(userId, profileData)
  },
)

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

