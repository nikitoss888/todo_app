import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, Status } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { UserEndpoints } from "@/lib/api/paths";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

interface UserState {
	status: Status;
	error: string | null;
	user: User | null;
	token: string | null;
}

const initialState: UserState = {
	status: "idle",
	error: null,
	user: null,
	token: null,
};

export const signupUser = createAsyncThunk(
	"user/signup",
	async (data: { name: string; email: string; password: string }) => {
		return await apiClient.post<{ message: string; token: string }>(
			UserEndpoints.signup,
			data
		);
	}
);

export const signinUser = createAsyncThunk(
	"user/signin",
	async (data: { email: string; password: string }) => {
		return await apiClient.post<{ message: string; token: string }>(
			UserEndpoints.signin,
			data
		);
	}
);

export const initUserFromCookies = createAsyncThunk(
	"user/initFromCookies",
	async () => {
		const token = Cookies.get("token");
		if (!token) throw new Error("No token found");

		const decoded = jwt.decode(token) as User;
		return { user: decoded, token };
	}
);

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearError: (state) => {
			state.status = "idle";
			state.error = null;
		},
		signOff: (state) => {
			state.status = "idle";
			state.error = null;
			state.user = null;
			state.token = null;
			Cookies.remove("token");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signupUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(signupUser.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				const token = action.payload.token;
				Cookies.set("token", token);
				const decoded = jwt.decode(token) as User;
				state.user = decoded;
				state.token = token;
			})
			.addCase(signupUser.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Signup error";
			})

			.addCase(signinUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(signinUser.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				const token = action.payload.token;
				Cookies.set("token", token);
				const decoded = jwt.decode(token) as User;
				state.user = decoded;
				state.token = token;
			})
			.addCase(signinUser.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Signin error";
			})

			.addCase(initUserFromCookies.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(initUserFromCookies.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = "idle";
				state.error = null;
			})
			.addCase(initUserFromCookies.rejected, (state, action) => {
				state.error =
					action.error.message ?? "Failed to restore user from token";
				state.status = "error";
			});
	},
});

export default userSlice.reducer;
export const { clearError, signOff } = userSlice.actions;
