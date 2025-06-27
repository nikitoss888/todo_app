import prisma from "../prisma";
import ApiError from "../errors/ApiError";
import { handleCatch } from "../util/utilities";

// Task controller main logic
export const createTask = async (
	listId: number,
	title: string,
	description?: string,
	done?: boolean
) => {
	try {
		if (!title) {
			return ApiError.badRequest("Title of task cannot be empty");
		}

		const list = await prisma.list.findUnique({
			where: { id: listId },
			include: {
				viewers: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		return await prisma.task.create({
			data: {
				title,
				description,
				done,
				listId: list.id,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const getOneTask = async (taskId: number) => {
	try {
		const task = await prisma.task.findUnique({ where: { id: taskId } });
		if (!task) return ApiError.notFound("Task not found");

		return task;
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const getAllTasks = async (listId: number) => {
	try {
		const list = await prisma.list.findUnique({ where: { id: listId } });
		if (!list) return ApiError.notFound("List not found");

		return await prisma.task.findMany({ where: { listId } });
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const updateTask = async (
	taskId: number,
	title: string,
	description?: string,
	done?: boolean
) => {
	try {
		if (!title) return ApiError.badRequest("Title of task cannot be empty");

		const task = await prisma.task.findUnique({ where: { id: taskId } });
		if (!task) return ApiError.notFound("Task not found");

		return await prisma.task.update({
			where: {
				id: taskId,
			},
			data: {
				title,
				description,
				done,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const setTaskDone = async (taskId: number, done?: boolean) => {
	try {
		const task = await prisma.task.findUnique({ where: { id: taskId } });
		if (!task) return ApiError.notFound("Task not found");

		return await prisma.task.update({
			where: { id: taskId },
			data: {
				done,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const delTask = async (taskId: number) => {
	try {
		const task = await prisma.task.findUnique({ where: { id: taskId } });
		if (!task) return ApiError.notFound("Task not found");

		return await prisma.task.delete({
			where: { id: taskId },
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};
