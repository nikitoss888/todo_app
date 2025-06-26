import ApiError from "../errors/ApiError";
import { List } from "../../generated/prisma";
import { PartialUser } from "../types/types";

export const handleCatch = (err: unknown): ApiError => {
	if (err instanceof ApiError) return err;
	else if (err instanceof Error) return ApiError.internal(err.message);
};

export const canEditList = (list: List, user: PartialUser) =>
	list.adminId == user.id;

export const canReadList = (
	list: List & { viewers: { id: number }[] },
	user: PartialUser
) => list.viewers.map((u) => u.id).includes(user.id) || canEditList(list, user);
