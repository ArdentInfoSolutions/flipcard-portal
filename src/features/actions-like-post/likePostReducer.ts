import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { likePost } from "./likePostThunks";
import { LikePostState } from "../../lib/types";


const initialState: LikePostState = {
  loading: false,
  error: null,
  likedPosts: {},
};

const likePostSlice = createSlice({
  name: "likePost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        likePost.fulfilled,
        (state, action: PayloadAction<{ postId: string, isLiked: boolean, likes: number }>) => {
            state.loading = false;  
            const { postId, isLiked, likes } = action.payload;
            console.log("Updating Redux State:", { postId, isLiked, likes });
            state.likedPosts[postId] = {isLiked, likes};
        }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



export default likePostSlice.reducer;
