import type { RootState } from "../../redux/store"

export const selectVideoPostItems = (state: RootState) => state.videoPosts.postItems
export const selectVideoPostsLoading = (state: RootState) => state.videoPosts.loading
export const selectVideoPostsError = (state: RootState) => state.videoPosts.error

