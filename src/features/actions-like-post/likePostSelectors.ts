import type { RootState } from "../../redux/store"

// Selectors
export const selectIsPostLiked = (state: RootState, postId: string, defaultIsLiked: boolean) =>
    state.likePost.likedPosts[postId]?.isLiked ?? defaultIsLiked;

export const selectPostLikes = (state: RootState, postId: string, defaultLikes: number) =>
    state.likePost.likedPosts[postId]?.likes ?? defaultLikes;


