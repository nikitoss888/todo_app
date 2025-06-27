import { api } from "./testApp";
import { USERS_ROUTE, LISTS_ROUTE } from "./routes";

describe("List actions", () => {
	const user = {
		name: "Jane Doe",
		email: "jane.doe@mail.com",
		password: "12345678",
		token: null,
	};

	const viewerUser = {
		name: "Joanne Doe",
		email: "joanne.doe@mail.com",
		password: "12345678",
	};

	test("POST /lists - Create a list", async () => {
		const name = "Test list 1";

		const signUpRes = await api.post(`${USERS_ROUTE}/signup`).send(user);
		const token = signUpRes.body.token;
		user.token = token;

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name });

		if (!createRes.ok) {
			console.error(createRes.body);
			expect(createRes.status).toBe(201);
		}

		const list = createRes.body.list;
		expect(list.name).toBe(name);
	});

	test("GET /lists/:id - Read one list", async () => {
		const name = "Test list 2";

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const getRes = await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${user.token}` });

		if (!getRes.ok) {
			console.error(getRes.body);
			expect(getRes.status).toBe(200);
		}

		const readList = getRes.body.list;
		expect(readList.id).toBe(id);
	});

	test("PATCH /lists/:id - Edit name of the list", async () => {
		const name = "Test list to edit";

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const newName = "New name of list";
		const editRes = await api
			.patch(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${user.token}` })
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

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const deleteRes = await api
			.delete(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${user.token}` });

		if (!deleteRes.ok) {
			console.error(deleteRes.body);
			expect(deleteRes.status).toBe(200);
		}

		await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${user.token}` })
			.expect(404);
	});

	test("POST /:id/viewers && Delete /:id/viewers - Add and remove user from the list", async () => {
		const name = "Test list to add user";

		const createRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ name });
		const list = createRes.body.list;
		const id = list.id;

		const signUpRes = await api
			.post(`${USERS_ROUTE}/signup`)
			.send(viewerUser);
		const token2 = signUpRes.body.token;

		await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token2}` })
			.expect(403);

		const addRes = await api
			.post(`${LISTS_ROUTE}/${id}/viewers`)
			.send({ email: viewerUser.email })
			.set({ authorization: `Bearer ${user.token}` });

		if (!addRes.ok) {
			console.error(addRes.body);
			expect(addRes.status).toBe(200);
		}

		const updAddRes = await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token2}` })
			.expect(200);

		const updAddList = updAddRes.body.list;

		expect(updAddList.viewers).toBeInstanceOf(Array);
		expect(updAddList.viewers.length).toBeGreaterThan(0);
		expect(updAddList.viewers[0]).toMatchObject({
			name: viewerUser.name,
			email: viewerUser.email,
		});

		await api
			.delete(`${LISTS_ROUTE}/${id}/viewers`)
			.send({ email: viewerUser.email })
			.set({ authorization: `Bearer ${user.token}` })
			.expect(200);

		await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${token2}` })
			.expect(403);

		const updRemoveRes = await api
			.get(`${LISTS_ROUTE}/${id}`)
			.set({ authorization: `Bearer ${user.token}` })
			.expect(200);

		const updRemoveList = updRemoveRes.body.list;

		expect(updRemoveList.viewers).toBeInstanceOf(Array);
		expect(updRemoveList.viewers.length).toBe(0);
	});
});
