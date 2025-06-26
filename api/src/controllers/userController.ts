import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { createUser, generateJwt, logInUser } from "../services/userService";

export const signUp = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, password } = req.body;

	const result = await createUser(name, email, password);
	if (result instanceof ApiError) return next(result);

	const token = generateJwt(result);

	res.status(201).json({
		message: "Sign-up was succesful!",
		token,
	});
};

export const signIn = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;

	const result = await logInUser(email, password);
	if (result instanceof ApiError) {
		return next(result);
	}

	const token = generateJwt(result);

	res.status(200).json({
		message: "Sign-in was successful!",
		token,
	});
};
