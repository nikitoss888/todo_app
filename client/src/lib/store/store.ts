import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import listReducer from "./slices/listSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		list: listReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
