import { api } from "./testApp";
import { USERS_ROUTE, LISTS_ROUTE, TASKS_ROUTE } from "./routes";

describe("Task actions", () => {
	const user = {
		name: "Johan Doe",
		email: "johan.doe@mail.com",
		password: "12345678",
		token: null,
	};

	const listData = {
		name: "List for test tasks",
		id: null,
	};

	const viewerUser = {
		name: "Ben",
		email: "ben@mail.com",
		password: "12345678",
	};

	test("POST /lists/:listId/tasks - Create a task in the list", async () => {
		const title = "Task 1";
		const description = "Task 1 description";

		const signUpRes = await api.post(`${USERS_ROUTE}/signup`).send(user);
		const token = signUpRes.body.token;
		user.token = token;

		const createListRes = await api
			.post(`${LISTS_ROUTE}/`)
			.set({ authorization: `Bearer ${token}` })
			.send({ name: listData.name })
			.expect(201);

		const list = createListRes.body.list;
		expect(list).toHaveProperty("id");
		listData.id = list.id;

		const createTaskRes = await api
			.post(`${LISTS_ROUTE}/${list.id}${TASKS_ROUTE}`)
			.set({ authorization: `Bearer ${token}` })
			.send({ title, description });

		if (!createTaskRes.ok) {
			console.error(createTaskRes.body);
			expect(createTaskRes.status).toBe(201);
		}

		const task = createTaskRes.body.task;

		expect(task).toHaveProperty("id");
		expect(task.title).toBe(title);
		expect(task.description).toBe(description);
		expect(task.done).toBe(false);
	});

	test("GET /lists/:listId/tasks/:taskId - Read one task of the list", async () => {
		const title = "Task 2";
		const description = "Task 2 description";

		const createTaskRes = await api
			.post(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ title, description })
			.expect(201);

		const createTask = createTaskRes.body.task;
		expect(createTask).toHaveProperty("id");

		const getTaskRes = await api
			.get(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/${createTask.id}`)
			.set({ authorization: `Bearer ${user.token}` });

		if (!getTaskRes.ok) {
			console.error(getTaskRes.body);
			expect(getTaskRes.status).toBe(200);
		}

		const readTask = getTaskRes.body.task;
		expect(readTask.id).toBe(createTask.id);
		expect(readTask.title).toBe(createTask.title);
		expect(readTask.description).toBe(createTask.description);
	});

	test("GET /lists/:listId/tasks/ - Read all tasks of the list", async () => {
		const title = "Task Batch";
		const description = "Task Batch description";
		const n = 3;

		for (let i = 0; i < n; i++) {
			const createTaskRes = await api
				.post(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}`)
				.set({ authorization: `Bearer ${user.token}` })
				.send({ title: title + i, description: description + i })
				.expect(201);

			const createTask = createTaskRes.body.task;
			expect(createTask).toHaveProperty("id");
		}

		const getTasksRes = await api
			.get(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/`)
			.set({ authorization: `Bearer ${user.token}` });

		if (!getTasksRes.ok) {
			console.error(getTasksRes.body);
			expect(getTasksRes.status).toBe(200);
		}

		const readTasks = getTasksRes.body.tasks;
		expect(readTasks).toBeInstanceOf(Array);
		expect(readTasks.length).toBeGreaterThan(3);
		expect(readTasks.map((t) => t.title)).toEqual(
			expect.arrayContaining([title + 0, title + 1, title + 2])
		);
	});

	test("PATCH /lists/:listId/tasks/:taskId - Update one task of the list", async () => {
		const titleOld = "Task to Update";
		const descriptionOld = "Task to Update";

		const createTaskRes = await api
			.post(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ title: titleOld, description: descriptionOld })
			.expect(201);

		const createTask = createTaskRes.body.task;
		expect(createTask).toHaveProperty("id");

		const titleNew = "Updated title";
		const descriptionNew = "Updated description";

		const updTaskRes = await api
			.patch(
				`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/${createTask.id}`
			)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ title: titleNew, description: descriptionNew });

		if (!updTaskRes.ok) {
			console.error(updTaskRes.body);
			expect(updTaskRes.status).toBe(200);
		}

		const updTask = updTaskRes.body.task;
		expect(updTask.title).toBe(titleNew);
		expect(updTask.description).toBe(descriptionNew);
	});

	test("PATCH /lists/:listId/tasks/:taskId/setDone - Update task status by viewer", async () => {
		const title = "Task to Update";
		const description = "Task to Update";

		const createTaskRes = await api
			.post(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ title, description })
			.expect(201);

		const createTask = createTaskRes.body.task;
		expect(createTask).toHaveProperty("id");

		const signUpRes = await api
			.post(`${USERS_ROUTE}/signup`)
			.send(viewerUser);
		const token2 = signUpRes.body.token;

		await api
			.post(`${LISTS_ROUTE}/${listData.id}/viewers`)
			.send({ email: viewerUser.email })
			.set({ authorization: `Bearer ${user.token}` })
			.expect(200);

		const updTaskRes = await api
			.patch(
				`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/${createTask.id}/setDone`
			)
			.set({ authorization: `Bearer ${token2}` })
			.send({ done: true });

		if (!updTaskRes.ok) {
			console.error(updTaskRes.body);
			expect(updTaskRes.status).toBe(200);
		}

		const updTask = updTaskRes.body.task;
		expect(updTask.done).toBe(true);
	});

	test("PATCH /lists/:listId/tasks/:taskId - Update one task of the list", async () => {
		const title = "Task to Update";
		const description = "Task to Update";

		const createTaskRes = await api
			.post(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}`)
			.set({ authorization: `Bearer ${user.token}` })
			.send({ title, description })
			.expect(201);

		const createTask = createTaskRes.body.task;
		expect(createTask).toHaveProperty("id");

		const delTaskRes = await api
			.delete(
				`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/${createTask.id}`
			)
			.set({ authorization: `Bearer ${user.token}` });

		if (!delTaskRes.ok) {
			console.error(delTaskRes.body);
			expect(delTaskRes.status).toBe(200);
		}

		await api
			.get(`${LISTS_ROUTE}/${listData.id}${TASKS_ROUTE}/${createTask.id}`)
			.set({ authorization: `Bearer ${user.token}` })
			.expect(404);
	});
});
