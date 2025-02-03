import { RootState } from "../../redux/store";

//This makes it easy to get state values without repeating state.auth.user in every component.

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

