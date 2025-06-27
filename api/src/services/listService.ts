import prisma from "../prisma";
import ApiError from "../errors/ApiError";
import { handleCatch } from "../util/utilities";

// List controller main logic
export const createList = async (name: string, userId: number) => {
	try {
		if (!name) return ApiError.badRequest("Name cannot be empty");

		return await prisma.list.create({
			data: {
				name,
				adminId: userId,
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const readOneList = async (id: number) => {
	try {
		return await prisma.list.findUnique({
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
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const updateList = async (id: number, name: string) => {
	try {
		if (!name) return ApiError.badRequest("Name cannot be empty");

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

export const delList = async (id: number) => {
	try {
		return await prisma.list.delete({ where: { id } });
	} catch (err: unknown) {
		return handleCatch(err);
	}
};

export const switchViewer = async (
	id: number,
	email: string,
	action: "add" | "remove"
) => {
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

		const candidate = await prisma.user.findUnique({
			where: { email },
		});
		if (!candidate) {
			return ApiError.notFound(
				`User for ${action === "add" ? "addition to" : "removal from"} list watchers not found`
			);
		}

		const hasUser = list.viewers.map((u) => u.id).includes(candidate.id);
		if (action === "add" && hasUser) {
			return ApiError.badRequest("User is already added to list");
		} else if (action === "remove" && !hasUser) {
			return ApiError.badRequest("User is not added to to list");
		}

		return await prisma.list.update({
			where: { id },
			data: {
				viewers: {
					...(action === "add"
						? { connect: { id: candidate.id } }
						: { disconnect: { id: candidate.id } }),
				},
			},
		});
	} catch (err: unknown) {
		return handleCatch(err);
	}
};
