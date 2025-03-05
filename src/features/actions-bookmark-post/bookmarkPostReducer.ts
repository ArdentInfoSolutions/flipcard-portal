import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bookmarkPost } from "./bookmarkPostThunks";
import { BookmarkPostState } from "../../lib/types";


const initialState: BookmarkPostState = {
  loading: false,
  error: null,
  bookmarkedPosts: {},
};

const bookmarkPostSlice = createSlice({
  name: "bookmarkPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookmarkPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        bookmarkPost.fulfilled,
        (state, action: PayloadAction<{ postId: string, isBookmarked: boolean, bookmarks: number }>) => {
            state.loading = false;  
            const { postId, isBookmarked, bookmarks } = action.payload;
            console.log("Updating Redux State:", { postId, isBookmarked, bookmarks });
            state.bookmarkedPosts[postId] = {isBookmarked, bookmarks};
        }
      )
      .addCase(bookmarkPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



export default bookmarkPostSlice.reducer;
