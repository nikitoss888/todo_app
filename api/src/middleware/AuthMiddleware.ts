import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import jwt from "jsonwebtoken";
import { verifyTokenStructure } from "../services/userService";

const auth = (req: Request, _: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

		if (!token) {
			return next(ApiError.unauthorized("User not found"));
		}

		req.user = verifyTokenStructure(
			jwt.verify(token, process.env.SECRET_KEY)
		);

		next();
	} catch (e: unknown) {
		if (e instanceof jwt.TokenExpiredError) {
			return next(ApiError.unauthorized("Token expired"));
		} else if (e instanceof jwt.JsonWebTokenError) {
			return next(ApiError.unauthorized("Incorrect token"));
		}

		if (e instanceof ApiError) return next(e);

		return next(ApiError.unauthorized("No access", [e]));
	}
};

export default auth;
