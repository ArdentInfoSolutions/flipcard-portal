import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Sign in with Google
export const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle", async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
});

// Sign up with email & password
export const signUpWithEmailPassword = createAsyncThunk(
  "auth/signUpWithEmailPassword",
  async ({ email, password }: { email: string; password: string }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  }
);

// Sign in with email & password
export const signInWithEmailPassword = createAsyncThunk(
  "auth/signInWithEmailPassword",
  async ({ email, password }: { email: string; password: string }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }
);

// Sign out user
export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  await signOut(auth);
});
