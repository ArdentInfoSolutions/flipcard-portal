import { createAsyncThunk } from "@reduxjs/toolkit"
import { signIn, signOut } from "next-auth/react"
import { fetchUserProfile as apiFetchUserProfile } from "../../lib/api"
import type { UserProfile } from "../../lib/types"

export const loginUser = createAsyncThunk<UserProfile, void>("auth/login", async (_, { rejectWithValue }) => {
  try {
    const result = await signIn("google", { redirect: false })
    if (result?.error) {
      throw new Error(result.error)
    }
    // ✅ Use session to get user details
    const session = await fetch("/api/auth/session").then((res) => res.json());
    if (!session?.user) {
      throw new Error("Failed to retrieve user session");
    }

    // ✅ Fetch user profile from API
    const userProfile = await apiFetchUserProfile(session.user.id);
    return userProfile;
  } catch (error) {
    return rejectWithValue("Login failed")
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut({ redirect: false })
})

export const fetchUserProfile = createAsyncThunk<UserProfile, string>(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const userProfile = await apiFetchUserProfile(userId)
      return userProfile
    } catch (error) {
      return rejectWithValue("Failed to fetch user profile")
    }
  },
)

