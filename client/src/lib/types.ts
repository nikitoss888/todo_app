export interface User {
	id: number;
	name: string;
	email: string;
}

export interface Task {
	id: number;
	title: string;
	description?: string;
	done: boolean;
}

export interface List {
	id: number;
	name: string;
	adminId: number;
	viewers: User[];
	tasks?: Record<number, Task>;
}

export type Status = "idle" | "loading" | "error";
