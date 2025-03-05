import type { RootState } from "@/redux/store"

export const selectCreatePostLoading = (state: RootState) => state.createPost.loading
export const selectCreatePostError = (state: RootState) => state.createPost.error
export const selectCreatePostSuccess = (state: RootState) => state.createPost.success

