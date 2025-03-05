import { createSlice } from "@reduxjs/toolkit"
import type { UserProfile } from "@/lib/types"
import { fetchUserById, fetchUserFollowers, fetchUserFollowing, followUser, unfollowUser } from "./userThunks"

interface UsersState {
  users: Record<string, UserProfile>
  followers: Record<string, string[]>
  following: Record<string, string[]>
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: {},
  followers: {},
  following: {},
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.users[action.payload.id] = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user"
      })

      // Fetch user followers
      .addCase(fetchUserFollowers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.loading = false
        state.followers[action.meta.arg] = action.payload
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch followers"
      })

      // Fetch user following
      .addCase(fetchUserFollowing.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.loading = false
        state.following[action.meta.arg] = action.payload
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch following"
      })

      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        const currentUserId = action.meta.arg.currentUserId
        const targetUserId = action.meta.arg.targetUserId

        // Update current user's following list
        if (state.users[currentUserId]) {
          if (!state.users[currentUserId].following.includes(targetUserId)) {
            state.users[currentUserId].following.push(targetUserId)
          }
        }

        // Update target user's followers list
        if (state.users[targetUserId]) {
          if (!state.users[targetUserId].followers.includes(currentUserId)) {
            state.users[targetUserId].followers.push(currentUserId)
          }
        }
      })

      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const currentUserId = action.meta.arg.currentUserId
        const targetUserId = action.meta.arg.targetUserId

        // Update current user's following list
        if (state.users[currentUserId]) {
          state.users[currentUserId].following = state.users[currentUserId].following.filter(
            (id) => id !== targetUserId,
          )
        }

        // Update target user's followers list
        if (state.users[targetUserId]) {
          state.users[targetUserId].followers = state.users[targetUserId].followers.filter((id) => id !== currentUserId)
        }
      })
  },
})

export default usersSlice.reducer

