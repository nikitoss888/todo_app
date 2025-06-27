import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import {
	createTask,
	getAllTasks,
	getOneTask,
	updateTask,
	delTask,
	setTaskDone,
} from "../services/taskService";
import { parseBoolean } from "../util/utilities";

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;

	const { title, description, done } = req.body;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId)) {
		return next(
			ApiError.badRequest("ID can be only integer number", [
				{ id: listId, parsed: parsedId },
			])
		);
	}

	const doneParsed = parseBoolean(done);

	const result = await createTask(parsedId, title, description, doneParsed);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(201).json({
		message: "Task created successfuly!",
		task: result,
	});
};

export const getOne = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { taskId } = req.params;

	const parsedTaskId = parseInt(taskId);
	if (isNaN(parsedTaskId)) {
		return next(
			ApiError.badRequest("ID can be only integer number", [
				{ id: taskId, parsed: parsedTaskId },
			])
		);
	}

	const result = await getOneTask(parsedTaskId);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "Task fetched successfully!",
		task: result,
	});
};

export const getAll = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;

	const parsedListId = parseInt(listId);
	if (isNaN(parsedListId)) {
		return next(
			ApiError.badRequest("ID can be only integer number", [
				{ id: listId, parsed: parsedListId },
			])
		);
	}

	const result = await getAllTasks(parsedListId);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: `Tasks of the list ${listId} fetched successfully!`,
		tasks: result,
	});
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { taskId } = req.params;

	const { title, description, done } = req.body;

	const parsedTaskId = parseInt(taskId);
	if (isNaN(parsedTaskId)) {
		return next(
			ApiError.badRequest("ID can be only integer numbers", [
				{ id: taskId, parsed: parsedTaskId },
			])
		);
	}

	const doneParsed = parseBoolean(done);

	const result = await updateTask(
		parsedTaskId,
		title,
		description,
		doneParsed
	);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "Task updated successfuly!",
		task: result,
	});
};

export const deleteTask = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { taskId } = req.params;

	const parsedTaskId = parseInt(taskId);
	if (isNaN(parsedTaskId)) {
		return next(
			ApiError.badRequest("ID can be only integer numbers", [
				{ id: taskId, parsed: parsedTaskId },
			])
		);
	}

	const result = await delTask(parsedTaskId);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "Task deleted successfuly!",
		task: result,
	});
};

export const setDone = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { taskId } = req.params;
	const { done } = req.body;

	const doneParsed = parseBoolean(done);

	const parsedTaskId = parseInt(taskId);
	if (isNaN(parsedTaskId)) {
		return next(
			ApiError.badRequest("ID can be only integer numbers", [
				{ id: taskId, parsed: parsedTaskId },
			])
		);
	}

	const result = await setTaskDone(parsedTaskId, doneParsed);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "Task status changed successfuly!",
		task: result,
	});
};
