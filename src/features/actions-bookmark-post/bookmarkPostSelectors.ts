import type { RootState } from "../../redux/store"

// Selectors
export const selectIsBookmarked = (state: RootState, postId: string, defaultIsBookmarked: boolean) =>
    state.bookmarkPost.bookmarkedPosts[postId]?.isBookmarked ?? defaultIsBookmarked;

export const selectBookmarks = (state: RootState, postId: string, defaultBookmarks: number) =>
    state.bookmarkPost.bookmarkedPosts[postId]?.bookmarks ?? defaultBookmarks;


