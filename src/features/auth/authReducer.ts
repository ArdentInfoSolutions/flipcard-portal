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
