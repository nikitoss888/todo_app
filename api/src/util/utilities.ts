import ApiError from "../errors/ApiError";
import { List } from "../../generated/prisma";
import { PartialUser } from "../types/types";
import prisma from "../prisma";

export const parseBoolean = (value: unknown): boolean | undefined => {
	if (value === true || value === "true") return true;
	else if (value === false || value === "false") return false;
	return undefined;
};

export const handleCatch = (err: unknown): ApiError => {
	if (err instanceof ApiError) return err;
	else if (err instanceof Error) return ApiError.internal(err.message);
};

const canEditList = (list: List, user: PartialUser) => list.adminId == user.id;

const canReadList = (
	list: List & { viewers: { id: number }[] },
	user: PartialUser
) => list.viewers.map((u) => u.id).includes(user.id) || canEditList(list, user);

export const checkList = async (
	id: number,
	user: PartialUser,
	action: "edit" | "read"
) => {
	const list = await prisma.list.findUnique({
		where: { id },
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

	if (!list) {
		return ApiError.notFound("List not found by specified ID", [{ id }]);
	}

	if (action == "edit" && !canEditList(list, user)) {
		return ApiError.forbidden(
			"You need to be an admin of the list to edit it"
		);
	} else if (action == "read" && !canReadList(list, user)) {
		return ApiError.forbidden("You need to be invited to read this list");
	}

	return null;
};
