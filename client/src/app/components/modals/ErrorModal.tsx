"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearError as listClearError } from "@/lib/store/slices/listSlice";
import { clearError as userClearError } from "@/lib/store/slices/userSlice";

export default function ErrorModal() {
	const dispatch = useAppDispatch();
	const [listStatus, listError, userStatus, userError] = useAppSelector(
		(state) => [
			state.list.status,
			state.list.error,
			state.user.status,
			state.user.error,
		]
	);

	const handleClose = () => {
		if (listError) dispatch(listClearError());
		if (userError) dispatch(userClearError());
	};

	return (
		<Modal
			isOpen={listStatus == "error" || userStatus == "error"}
			onOpenChange={handleClose}
		>
			<ModalContent className="bg-red-200">
				<ModalHeader className="text-red-600">Error!</ModalHeader>
				<ModalBody className="text-black">
					{listError ?? userError}
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onPress={handleClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
