import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchUserProfile } from "@/lib/api"
import type { UserProfile } from "@/lib/types"
import type { RootState } from "@/redux/store"

// Fetch a user by ID
export const fetchUserById = createAsyncThunk<UserProfile, string>(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const userProfile = await fetchUserProfile(userId)
      return userProfile
    } catch (error) {
      return rejectWithValue("Failed to fetch user profile")
    }
  },
)

// Fetch a user's followers
export const fetchUserFollowers = createAsyncThunk<string[], string>(
  "users/fetchUserFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call to get the followers
      // For now, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock followers data
      const mockFollowers = Array.from({ length: 5 }, (_, i) => `follower${i + 1}`)

      return mockFollowers
    } catch (error) {
      return rejectWithValue("Failed to fetch followers")
    }
  },
)

// Fetch users that a user is following
export const fetchUserFollowing = createAsyncThunk<string[], string>(
  "users/fetchUserFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call to get the following users
      // For now, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock following data
      const mockFollowing = Array.from({ length: 5 }, (_, i) => `following${i + 1}`)

      return mockFollowing
    } catch (error) {
      return rejectWithValue("Failed to fetch following")
    }
  },
)

// Follow a user
export const followUser = createAsyncThunk<void, string, { state: RootState }>(
  "users/followUser",
  async (targetUserId, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const currentUser = state.auth.user

      if (!currentUser) {
        throw new Error("You must be logged in to follow a user")
      }

      // In a real app, you would make an API call to follow the user
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      return
    } catch (error) {
      return rejectWithValue("Failed to follow user")
    }
  },
  {
    // This prepareAction function allows us to pass additional metadata to the action
    getPendingMeta: ({ getState }, { arg }) => {
      const state = getState() as RootState
      const currentUserId = state.auth.user?.id

      return {
        currentUserId,
        targetUserId: arg,
      }
    },
  },
)

// Unfollow a user
export const unfollowUser = createAsyncThunk<void, string, { state: RootState }>(
  "users/unfollowUser",
  async (targetUserId, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const currentUser = state.auth.user

      if (!currentUser) {
        throw new Error("You must be logged in to unfollow a user")
      }

      // In a real app, you would make an API call to unfollow the user
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      return
    } catch (error) {
      return rejectWithValue("Failed to unfollow user")
    }
  },
  {
    // This prepareAction function allows us to pass additional metadata to the action
    getPendingMeta: ({ getState }, { arg }) => {
      const state = getState() as RootState
      const currentUserId = state.auth.user?.id

      return {
        currentUserId,
        targetUserId: arg,
      }
    },
  },
)

