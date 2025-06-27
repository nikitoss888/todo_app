export enum ApiPaths {
	USERS = "/users",
	LISTS = "/lists",
	TASKS = "/tasks",
}

export const UserEndpoints = {
	signup: `${ApiPaths.USERS}/signup`,
	signin: `${ApiPaths.USERS}/signin`,
};

export const ListEndpoints = {
	create: ApiPaths.LISTS,
	readOne: (listId: number) => `${ApiPaths.LISTS}/${listId}`,
	update: (listId: number) => `${ApiPaths.LISTS}/${listId}`,
	viewers: (listId: number) => `${ApiPaths.LISTS}/${listId}/viewers`,

	tasks: (listId: number) => `${ApiPaths.LISTS}/${listId}/${ApiPaths.TASKS}/`,
	taskOne: (listId: number, taskId: number) =>
		`${ApiPaths.LISTS}/${listId}/${ApiPaths.TASKS}/${taskId}`,
	taskSetDone: (listId: number, taskId: number) =>
		`${ApiPaths.LISTS}/${listId}/${ApiPaths.TASKS}/${taskId}/setDone`,
};
