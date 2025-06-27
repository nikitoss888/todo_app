"use client";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Button,
} from "@heroui/react";
import { useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { signupUser } from "@/lib/store/slices/userSlice";

export default function SignUpModal({
	open,
	onOpenChange,
}: Readonly<{
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useAppDispatch();

	const handleSubmit = () => {
		dispatch(signupUser({ name, email, password }));
		onOpenChange(false);
	};

	return (
		<Modal isOpen={open} onOpenChange={() => onOpenChange(false)}>
			<ModalContent className="bg-gray-900">
				<ModalHeader>Sign Up</ModalHeader>
				<ModalBody className="flex flex-col space-y-4">
					<Input
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button onPress={handleSubmit}>Submit</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
