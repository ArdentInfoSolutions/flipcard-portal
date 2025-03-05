import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authReducer"
import feedReducer from "../features/feed/feedReducer"
import webPostsReducer from "../features/web-posts/webPostsReducer"
import imagePostsReducer from "../features/image-posts/imagePostsReducer"
import videoPostsReducer from "../features/video-posts/videoPostsReducer"
import likePostReducer from "@/features/actions-like-post/likePostReducer"
import bookMarkPostReducer from "@/features/actions-bookmark-post/bookmarkPostReducer"
import createPostReducer from "@/features/create-post/createPostReducer"
import userReducer  from "@/features/user-profile/userReducer"


export const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  webPosts: webPostsReducer,
  imagePosts: imagePostsReducer,
  videoPosts: videoPostsReducer,
  likePost: likePostReducer,
  bookmarkPost: bookMarkPostReducer,
  createPost: createPostReducer,
  user: userReducer,
})

