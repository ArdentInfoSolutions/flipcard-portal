import type { RootState } from "../../redux/store"

export const selectWebItems = (state: RootState) => state.feed.webItems
export const selectFeedLoading = (state: RootState) => state.feed.loading
export const selectFeedError = (state: RootState) => state.feed.error

