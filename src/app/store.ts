import {configureStore} from '@reduxjs/toolkit'
import {WebSocketListenerMiddleware} from "../common/Middlewares/WebSocketMiddleware";
import {mainSlice} from "../features/mainSlice";

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(WebSocketListenerMiddleware.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// export type AccountState = ReturnType<typeof accountSlice.reducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch