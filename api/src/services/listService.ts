import prisma from "../prisma";
import ApiError from "../errors/ApiError";
import { PartialUser } from "../types/types";
import { handleCatch, canEditList, canReadList } from "./common";

// List controller main logic
export const createList = async (name: string, user: PartialUser) => {
	try {
		if (!name) return ApiError.badRequest("Name cannot be empty");

		return await prisma.list.create({
			data: {
				name,
				adminId: user.id,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const readOneList = async (id: number, user: PartialUser) => {
	try {
		const list = await prisma.list.findUnique({
			where: { id },
			include: {
				viewers: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!list) {
			return ApiError.notFound("List not found by specified ID");
		}

		if (!canReadList(list, user)) {
			return ApiError.forbidden(
				"You need to be invited to read this list"
			);
		}

		return list;
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const updateList = async (
	id: number,
	user: PartialUser,
	name: string
) => {
	try {
		if (!name) return ApiError.badRequest("Name cannot be empty");

		const list = await prisma.list.findUnique({
			where: { id },
			include: {
				viewers: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!list) {
			return ApiError.notFound("List not found by specified ID");
		}

		if (!canEditList(list, user)) {
			return ApiError.forbidden(
				"You need to be an admin of this list to edit it"
			);
		}

		return await prisma.list.update({
			where: { id },
			data: {
				name,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const delList = async (id: number, user: PartialUser) => {
	try {
		const list = await prisma.list.findUnique({
			where: { id },
			include: {
				viewers: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!list) {
			return ApiError.notFound("List not found by specified ID");
		}

		if (!canEditList(list, user)) {
			return ApiError.forbidden(
				"You need to be an admin of this list to delete it"
			);
		}

		return await prisma.list.delete({ where: { id } });
	} catch (err: unknown) {
		return handleCatch(err);
	}
};
