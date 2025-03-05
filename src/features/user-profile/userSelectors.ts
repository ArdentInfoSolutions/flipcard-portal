import type { RootState } from "@/redux/store"

export const selectUserById = (state: RootState, userId: string) => state.user.users[userId]
export const selectUsersLoading = (state: RootState) => state.user.loading
export const selectUsersError = (state: RootState) => state.user.error
export const selectUserFollowers = (state: RootState, userId: string) => state.user.followers[userId] || []
export const selectUserFollowing = (state: RootState, userId: string) => state.user.following[userId] || []

