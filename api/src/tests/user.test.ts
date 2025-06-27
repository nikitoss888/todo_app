import { api } from "./testApp";
import jwt from "jsonwebtoken";
import { USERS_ROUTE } from "./routes";

describe("User actions", () => {
	const user = {
		name: "John Doe",
		email: "john.doe@mail.com",
		password: "12345678",
	};

	test("POST /signup - Register a new user", async () => {
		const res = await api.post(`${USERS_ROUTE}/signup`).send(user);

		if (!res.ok) {
			console.error(res.body);
			expect(res.status).toBe(201);
		}

		expect(res.body).toHaveProperty("message", "Sign-up was succesful!");
		expect(res.body).toHaveProperty("token");

		const decoded = jwt.verify(res.body.token, process.env.SECRET_KEY!);
		expect(decoded).toMatchObject({
			name: user.name,
			email: user.email,
		});
	});

	test("POST /signin - Log in user", async () => {
		const res = await api.post(`${USERS_ROUTE}/signin`).send(user);

		if (!res.ok) {
			console.error(res.body);
			expect(res.status).toBe(200);
		}

		const decoded = jwt.verify(res.body.token, process.env.SECRET_KEY!);
		expect(decoded).toMatchObject({
			name: user.name,
			email: user.email,
		});
	});

	test("POST /signup - Existing user error", async () => {
		const res = await api.post(`${USERS_ROUTE}/signup`).send(user);

		if (res.status !== 400) {
			console.error(res.body);
			expect(res.status).toBe(400);
		}

		expect(res.body.message).toBe(
			"User with specified email already exists"
		);
	});

	test("POST /signin - Non-existing user error", async () => {
		const res = await api
			.post(`${USERS_ROUTE}/signin`)
			.send({
				...user,
				email: "nouser@mail.com",
			})
			.expect(404);

		expect(res.body.message).toBe("User not found");
	});
});
