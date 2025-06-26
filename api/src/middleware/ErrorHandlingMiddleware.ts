import type {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from "express";
import ApiError from "../errors/ApiError";

const errorHandler: ErrorRequestHandler = function (
	err: Error | ApiError,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const status = (err as ApiError).status || 500;
	const errors = (err as ApiError).errors || [];

	const env = process.env.NODE_ENV || "development";
	if (env.toLowerCase() === "development") console.error(err);

	res.status(status).json({
		name: err.name,
		message: err.message,
		errors: errors,
		stack: env.toLowerCase() === "development" ? err.stack : undefined,
	});
};

export default errorHandler;
