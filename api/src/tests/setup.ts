import prisma from "./prisma";

beforeAll(async () => {
	await prisma.task.deleteMany();
	await prisma.list.deleteMany();
	await prisma.user.deleteMany();
});

afterAll(async () => {
	await prisma.$disconnect();
});
