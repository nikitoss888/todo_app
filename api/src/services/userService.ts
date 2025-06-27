import prisma from "../prisma";
import ApiError from "../errors/ApiError";
import { handleCatch } from "../util/utilities";
import { PartialUser } from "../types/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const validate = ({
	email,
	name,
	password,
}: {
	email: string;
	name: string;
	password: string;
}): ApiError | null => {
	if (!validateEmail(email))
		return ApiError.badRequest("Invalid email pattern");

	if (!name || name.length === 0)
		return ApiError.badRequest("Name should not be empty");

	if (!password || password.length < 7)
		return ApiError.badRequest(
			"Password should be at least 8 character long",
			[
				{
					password,
				},
			]
		);

	return null;
};

const validateEmail = (email: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const generateJwt = (user: PartialUser) => {
	const tokenBody: PartialUser = {
		id: user.id,
		name: user.name,
		email: user.email,
	};

	return jwt.sign(tokenBody, process.env.SECRET_KEY, { expiresIn: "24h" });
};

export const verifyTokenStructure = (payload: jwt.JwtPayload | string) => {
	if (typeof payload === "string") {
		throw ApiError.unauthorized("JWT should be an object with user data");
	}

	if (!("id" in payload) || !("name" in payload) || !("email" in payload)) {
		throw ApiError.forbidden("JWT has to carry ID, name and email of user");
	}

	const { id, name, email } = payload;

	if (
		typeof id !== "number" ||
		!Number(id) ||
		typeof name !== "string" ||
		typeof email !== "string"
	) {
		throw ApiError.forbidden(
			"JWT data have to be of types: ID - number, name - string, email - string"
		);
	}

	const tokenUser: PartialUser = { id, name, email };
	return tokenUser;
};

// User controller main logic
export const createUser = async (
	name: string,
	email: string,
	password: string
) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (user) {
			return ApiError.badRequest(
				"User with specified email already exists",
				[
					{
						id: user.id,
						name: user.name,
						email: user.email,
					},
				]
			);
		}

		const validateRes = validate({ email, name, password });
		if (validateRes !== null) return validateRes;

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		return prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const logInUser = async (email: string, password: string) => {
	try {
		if (!validateEmail(email)) {
			return ApiError.badRequest("Incorrect email pattern");
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return ApiError.notFound("User not found");
		}

		if (!bcrypt.compareSync(password, user.password)) {
			return ApiError.unauthorized("Wrong password");
		}

		return user;
	} catch (err: unknown) {
		return handleCatch(err);
	}
};
