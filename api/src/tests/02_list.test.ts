import { api } from "./testApp";
import { USERS_ROUTE } from "./common_data";

const LISTS_ROUTE = "/lists";

describe("List actions", () => {
	const user = {
		name: "Jane Doe",
		email: "jane.doe@mail.com",
		password: "12345678",
	};

	test("POST /lists - Create a list", async () => {
		const name = "Test list 1";

		const signUpRes = await api.post(`${USERS_ROUTE}/signup`).send(user);
		const token = signUpRes.body.token;

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name });

		console.log({ status: createRes.status, body: createRes.body });

		if (!createRes.ok) {
			console.error(createRes.body);
			expect(createRes.status).toBe(201);
		}

		const list = createRes.body.list;
		expect(list.name).toBe(name);
	});

	test("GET /lists/:id - Read one list", async () => {
		const name = "Test list 2";

		const logInRes = await api.post(`${USERS_ROUTE}/signin`).send(user);
		const token = logInRes.body.token;

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const getRes = await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token}` })
			.expect(200);

		if (!getRes.ok) {
			console.error(getRes.body);
			expect(getRes.status).toBe(200);
		}

		const readList = getRes.body.list;
		expect(readList.id).toBe(id);
	});

	test("PATCH /lists/:id - Edit name of the list", async () => {
		const name = "Test list to edit";

		const logInRes = await api.post(`${USERS_ROUTE}/signin`).send(user);
		const token = logInRes.body.token;

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const newName = "New name of list";
		const editRes = await api
			.patch(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name: newName });

		if (!editRes.ok) {
			console.error(editRes.body);
			expect(editRes.status).toBe(200);
		}

		const editList = editRes.body.list;
		expect(editList.id).toBe(id);
		expect(editList.name).toBe(newName);
	});

	test("DELETE /lists/:id - Delete list", async () => {
		const name = "Test list to delete";

		const logInRes = await api.post(`${USERS_ROUTE}/signin`).send(user);
		const token = logInRes.body.token;

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const deleteRes = await api
			.delete(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token}` });

		if (!deleteRes.ok) {
			console.error(deleteRes.body);
			expect(deleteRes.status).toBe(200);
		}

		await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token}` })
			.expect(404);
	});
});
