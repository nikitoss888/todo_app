"use client";

import { Tabs, Tab, Input } from "@heroui/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createList, readList, updateList } from "@/lib/store/slices/listSlice";

export default function ListControls() {
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	const [newName, setNewName] = useState("");

	const dispatch = useAppDispatch();
	const { user, token } = useAppSelector((state) => state.user);
	const { list } = useAppSelector((state) => state.list);

	if (!user) return null;

	return (
		<div className="w-full max-w-xl mx-auto mt-6">
			<Tabs aria-label="ListInputs" variant="underlined">
				<Tab key="create" title="Create List">
					<div className="flex items-end gap-4">
						<label className="flex-1">
							List name:
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter list name"
							/>
						</label>
						<button
							className="bg-blue-600 text-white px-4 py-2 rounded-md w-min-[200px]"
							onClick={() => {
								if (name && token)
									dispatch(createList({ name, token }));
							}}
						>
							Create
						</button>
					</div>
				</Tab>

				<Tab key="load" title="Load List">
					<div className="flex items-end gap-4">
						<label className="flex-1">
							List ID:
							<Input
								type="number"
								value={id}
								onChange={(e) => setId(e.target.value)}
								placeholder="Enter list ID"
								className="outline-hidden"
							/>
						</label>
						<button
							className="bg-green-600 text-white px-4 py-2 rounded-md w-min-[200px]"
							onClick={() => {
								const parsedId = parseInt(id);
								if (!isNaN(parsedId) && token)
									dispatch(readList({ id: parsedId, token }));
							}}
						>
							Load
						</button>
					</div>
				</Tab>
			</Tabs>

			{list && (
				<div className="mt-2 space-y-4">
					<h2 className="text-xl font-bold">
						Current List: {list.name} (#{list.id})
					</h2>
					<div className="flex gap-4 items-end">
						<label className="flex-1">
							New list name:
							<Input
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="Enter new name"
							/>
						</label>
						<button
							className="bg-yellow-600 text-white px-4 py-2 rounded-md"
							onClick={() => {
								if (newName && token) {
									dispatch(
										updateList({
											id: list.id,
											name: newName,
											token,
										})
									);
								}
							}}
						>
							Rename
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
