import { configureStore } from "@reduxjs/toolkit"
<<<<<<< HEAD
import rootReducer from './rootReducer';
=======
import { rootReducer } from "./rootReducer"
>>>>>>> fbab2be (commit code)

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

