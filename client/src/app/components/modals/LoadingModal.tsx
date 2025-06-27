"use client";

import { Modal, ModalContent, Spinner } from "@heroui/react";
import { useAppSelector } from "@/lib/store/hooks";

export default function LoadingModal() {
	const { userStatus, listStatus } = useAppSelector((state) => ({
		userStatus: state.user.status,
		listStatus: state.list.status,
	}));

	return (
		<Modal
			isOpen={userStatus === "loading" || listStatus === "loading"}
			backdrop="blur"
			size="md"
			isDismissable={false}
			hideCloseButton
		>
			<ModalContent className="h-30 w-30 rounded-full">
				<div className="flex items-center justify-center h-full">
					<Spinner size="lg" />
				</div>
			</ModalContent>
		</Modal>
	);
}
