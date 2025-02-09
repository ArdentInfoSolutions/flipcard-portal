import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../lib/api-mock"
import { UserProfile } from "@/lib/types"
import { RootState } from "@/redux/store"

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
