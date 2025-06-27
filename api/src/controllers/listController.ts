import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import {
	createList,
	delList,
	readOneList,
	switchViewer,
	updateList,
} from "../services/listService";

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.body;
	const user = req.user;

	if (!user)
		return next(
			ApiError.unauthorized("Cannot access lists without authorization")
		);

	const result = await createList(name, user.id);
	if (result instanceof ApiError) return next(result);

	res.status(201).json({
		message: "List was successfuly created!",
		list: result,
	});
};

export const readOne = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await readOneList(parsedId);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "List fetched successfully!",
		list: result,
	});
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;
	const { name } = req.body;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await updateList(parsedId, name);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "List edited successfully!",
		list: result,
	});
};

export const deleteList = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await delList(parsedId);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "List deleleted successfully!",
		list: result,
	});
};

export const addViewer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;
	const { email } = req.body;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await switchViewer(parsedId, email, "add");
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "User added to the list successfuly!",
		list: result,
	});
};

export const removeViewer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { listId } = req.params;
	const { email } = req.body;

	const parsedId = parseInt(listId);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await switchViewer(parsedId, email, "remove");
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "User removed from the list successfuly!",
		list: result,
	});
};
