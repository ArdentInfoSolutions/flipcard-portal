import { combineReducers } from "redux";
import authReducer from "../features/auth/authReducer"
import feedReducer from "../features/feed/reducers"
import userReducer from "../lib/slices/userSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  user: userReducer,
});

export default rootReducer;
