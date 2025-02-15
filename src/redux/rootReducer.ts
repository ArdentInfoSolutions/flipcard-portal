import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authReducer"
import feedReducer from "../features/feed/feedReducer"
import postsReducer from "../features/posts/postsReducer"

export const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  posts: postsReducer,
})

