import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { checkList } from "../util/utilities";

const canAccess = (action: "read" | "edit") => {
	return async (req: Request, _: Response, next: NextFunction) => {
		const { listId } = req.params;
		const user = req.user;

		if (!user)
			return next(
				ApiError.unauthorized(
					"Cannot access lists without authorization"
				)
			);

		const parsedId = parseInt(listId);
		if (isNaN(parsedId))
			return next(ApiError.badRequest("ID can be only integer number"));

		const result = await checkList(parsedId, user, action);
		if (result != null) return next(result);

		next();
	};
};

export default canAccess;
