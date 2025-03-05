import { createAsyncThunk } from "@reduxjs/toolkit";
import { likePost as likePostApi } from "@/lib/api-mock"; // Import the mock API function

export const likePost = createAsyncThunk(
  "likes/likePost",
  async (postId: string, thunkAPI) => {
      try {
        console.log("Inthunk:",postId);
        const response = await likePostApi(postId); // Call the mock API
        console.log("API Response:",response);
        return { postId, isLiked: response.isLiked, likes:response.likes };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
    }
  }
)

