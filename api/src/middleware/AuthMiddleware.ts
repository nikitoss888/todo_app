import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import jwt from "jsonwebtoken";
import { verifyTokenStructure } from "../services/userService";
import prisma from "../prisma";

const auth = async (req: Request, _: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

		if (!token) {
			return next(ApiError.unauthorized("User not found"));
		}

		const user = verifyTokenStructure(
			jwt.verify(token, process.env.SECRET_KEY)
		);
		const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

		if (!dbUser) {
			return next(
				ApiError.unauthorized("No user found by the provided token")
			);
		}

		req.user = user;

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
