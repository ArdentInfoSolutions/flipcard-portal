import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookmarkPost as bookmarkPostApi } from "@/lib/api-mock"; // Import the mock API function

export const bookmarkPost = createAsyncThunk(
  "bookmarks/bookmarkPost",
  async (postId: string, thunkAPI) => {
      try {
        console.log("Inthunk:",postId);
        const response = await bookmarkPostApi(postId); // Call the mock API
        console.log("API Response:",response);
        return { postId, isBookmarked: response.isBookmarked, bookmarks: response.bookmarks };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
    }
  }
)

