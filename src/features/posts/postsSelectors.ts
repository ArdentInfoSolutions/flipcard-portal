import type { RootState } from "../../redux/store"

export const selectPostItems = (state: RootState) => state.posts.postItems
export const selectPostsLoading = (state: RootState) => state.posts.loading
export const selectPostsError = (state: RootState) => state.posts.error

