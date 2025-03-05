import type { RootState } from "../../redux/store"

export const selectWebPostItems = (state: RootState) => state.webPosts.postItems
export const selectWebPostsLoading = (state: RootState) => state.webPosts.loading
export const selectWebPostsError = (state: RootState) => state.webPosts.error

