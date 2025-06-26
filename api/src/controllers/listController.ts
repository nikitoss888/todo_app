import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import {
	createList,
	delList,
	readOneList,
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
			ApiError.unauthorized("Cannot create list without authorization")
		);

	const result = await createList(name, user);
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
	const { id } = req.params;
	const user = req.user;

	if (!user)
		return next(
			ApiError.unauthorized("Cannot create list without authorization")
		);

	const parsedId = parseInt(id);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await readOneList(parsedId, user);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "List fetched successfully!",
		list: result,
	});
};

export const edit = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const user = req.user;
	const { name } = req.body;

	if (!user)
		return next(
			ApiError.unauthorized("Cannot create list without authorization")
		);

	const parsedId = parseInt(id);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await updateList(parsedId, user, name);
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
	const { id } = req.params;
	const user = req.user;

	if (!user)
		return next(
			ApiError.unauthorized("Cannot create list without authorization")
		);

	const parsedId = parseInt(id);
	if (isNaN(parsedId))
		return next(ApiError.badRequest("ID can be only integer number"));

	const result = await delList(parsedId, user);
	if (result instanceof ApiError) {
		return next(result);
	}

	res.status(200).json({
		message: "List deleleted successfully!",
		list: result,
	});
};
