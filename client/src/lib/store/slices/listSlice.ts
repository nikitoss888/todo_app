import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { List, Status, Task } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ListEndpoints } from "@/lib/api/paths";

interface ListState {
	status: Status;
	error: string | null;
	list: List | null;
}

const initialState: ListState = {
	status: "idle",
	error: null,
	list: null,
};

export const createList = createAsyncThunk(
	"list/create",
	async ({ name, token }: { name: string; token: string }) => {
		return await apiClient.post<{ message: string; list: List }>(
			ListEndpoints.create,
			{ name },
			token
		);
	}
);

export const readList = createAsyncThunk(
	"list/read",
	async ({ id, token }: { id: number; token: string }) => {
		return await apiClient.get<{ message: string; list: List }>(
			ListEndpoints.readOne(id),
			token
		);
	}
);

export const updateList = createAsyncThunk(
	"list/update",
	async ({
		id,
		name,
		token,
	}: {
		id: number;
		name: string;
		token: string;
	}) => {
		return await apiClient.patch<{ message: string; list: List }>(
			ListEndpoints.update(id),
			{ name },
			token
		);
	}
);

export const createTask = createAsyncThunk(
	"task/create",
	async ({
		listId,
		title,
		description,
		token,
	}: {
		listId: number;
		title: string;
		description?: string;
		token: string;
	}) => {
		return await apiClient.post<{ message: string; task: Task }>(
			ListEndpoints.tasks(listId),
			{ title, description },
			token
		);
	}
);

export const updateTask = createAsyncThunk(
	"task/update",
	async ({
		listId,
		task,
		token,
	}: {
		listId: number;
		task: Task;
		token: string;
	}) => {
		return await apiClient.patch<{ message: string; task: Task }>(
			ListEndpoints.taskOne(listId, task.id),
			task,
			token
		);
	}
);

export const toggleTaskDone = createAsyncThunk(
	"task/toggleDone",
	async ({
		listId,
		taskId,
		token,
	}: {
		listId: number;
		taskId: number;
		token: string;
	}) => {
		return await apiClient.patch<{ message: string; task: Task }>(
			ListEndpoints.taskSetDone(listId, taskId),
			{},
			token
		);
	}
);

export const deleteTask = createAsyncThunk(
	"task/delete",
	async ({
		listId,
		taskId,
		token,
	}: {
		listId: number;
		taskId: number;
		token: string;
	}) => {
		return await apiClient.delete<{ message: string; task: Task }>(
			ListEndpoints.taskOne(listId, taskId),
			null,
			token
		);
	}
);

export const addViewer = createAsyncThunk(
	"list/addViewer",
	async ({
		listId,
		email,
		token,
	}: {
		listId: number;
		email: string;
		token: string;
	}) => {
		return apiClient.post<{ message: string; list: List }>(
			ListEndpoints.viewers(listId),
			{ email },
			token
		);
	}
);

export const removeViewer = createAsyncThunk(
	"list/removeViewer",
	async ({
		listId,
		email,
		token,
	}: {
		listId: number;
		email: string;
		token: string;
	}) => {
		return apiClient.delete<{ message: string; list: List }>(
			ListEndpoints.viewers(listId),
			{ email },
			token
		);
	}
);

const listSlice = createSlice({
	name: "list",
	initialState,
	reducers: {
		clearError: (state) => {
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(readList.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(readList.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				state.list = action.payload.list;
			})
			.addCase(readList.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error fetching list";
			})

			.addCase(createList.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(createList.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				state.list = action.payload.list;
			})
			.addCase(createList.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error creating list";
			})

			.addCase(updateList.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(updateList.fulfilled, (state, action) => {
				state.list = action.payload.list;
				state.status = "idle";
				state.error = null;
			})
			.addCase(updateList.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error updating list";
			})

			.addCase(createTask.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(createTask.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				if (state.list)
					state.list.tasks = {
						...state.list.tasks,
						[action.payload.task.id]: action.payload.task,
					};
			})
			.addCase(createTask.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error creating task";
			})

			.addCase(updateTask.pending, (state) => {
				state.status = "idle";
				state.error = null;
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				if (state.list?.tasks)
					state.list.tasks[action.payload.task.id] =
						action.payload.task;
			})
			.addCase(updateTask.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error updating task";
			})

			.addCase(toggleTaskDone.pending, (state) => {
				state.status = "idle";
				state.error = null;
			})
			.addCase(toggleTaskDone.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				if (state.list?.tasks)
					state.list.tasks[action.payload.task.id] =
						action.payload.task;
			})
			.addCase(toggleTaskDone.rejected, (state, action) => {
				state.status = "error";
				state.error =
					action.error.message ?? "Error changing task's state";
			})

			.addCase(deleteTask.pending, (state) => {
				state.status = "idle";
				state.error = null;
			})
			.addCase(deleteTask.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				if (state.list?.tasks)
					delete state.list.tasks[action.payload.task.id];
			})
			.addCase(deleteTask.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Error deleting task";
			})

			.addCase(addViewer.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(addViewer.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				state.list = action.payload.list;
			})
			.addCase(addViewer.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Failed to add viewer";
			})

			.addCase(removeViewer.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(removeViewer.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				state.list = action.payload.list;
			})
			.addCase(removeViewer.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message ?? "Failed to remove viewer";
			});
	},
});

export default listSlice.reducer;
export const { clearError } = listSlice.actions;
