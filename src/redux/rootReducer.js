import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice"
import feedReducer from "../lib/slices/feedSlice"
import userReducer from "../lib/slices/userSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  user: userReducer,
});

export default rootReducer;
