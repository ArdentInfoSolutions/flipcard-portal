<<<<<<< HEAD
import { createReducer } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";
import { signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, signOutUser } from "./authThunks";

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Reducer using createReducer
const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(signInWithGoogle.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(signInWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    })
    .addCase(signUpWithEmailPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signUpWithEmailPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(signUpWithEmailPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    })
    .addCase(signInWithEmailPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signInWithEmailPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(signInWithEmailPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    })
    .addCase(signOutUser.fulfilled, (state) => {
      state.user = null;
    });
});

export default authReducer;
=======
import { createSlice } from "@reduxjs/toolkit"
import type { AuthState } from "../../lib/types"
import { loginUser, logoutUser, fetchUserProfile } from "./authThunks"

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Login failed"
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user profile"
      })
  },
})

export default authSlice.reducer

>>>>>>> fbab2be (commit code)
