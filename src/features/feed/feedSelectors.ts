import type { RootState } from "../../redux/store"

export const selectPostItems = (state: RootState) => state.feed.posts
export const selectFeedLoading = (state: RootState) => state.feed.loading
export const selectFeedError = (state: RootState) => state.feed.error

