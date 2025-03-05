import type { RootState } from "../../redux/store"

export const selectImagePostItems = (state: RootState) => state.imagePosts.postItems
export const selectImagePostsLoading = (state: RootState) => state.imagePosts.loading
export const selectImagePostsError = (state: RootState) => state.imagePosts.error

