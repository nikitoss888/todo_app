"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import SignInModal from "../modals/SignInModal";
import SignUpModal from "../modals/SignUpModal";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { signOff } from "@/lib/store/slices/userSlice";

export default function Header() {
	const [showSignIn, setShowSignIn] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();

	return (
		<header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md w-full">
			<h1 className="text-2xl font-bold">ToDo Lists Manager</h1>
			<div className="flex items-center gap-4">
				{user ? (
					<>
						<div>
							<span className="text-lg">Hello, </span>
							<span className="text-lg font-medium">
								{user.name}
							</span>
						</div>
						<Button
							variant="solid"
							color="danger"
							onPress={() => dispatch(signOff())}
						>
							Log out
						</Button>
					</>
				) : (
					<>
						<Button onPress={() => setShowSignIn(true)}>
							Sign In
						</Button>
						<Button onPress={() => setShowSignUp(true)}>
							Sign Up
						</Button>
					</>
				)}
			</div>
			<SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
			<SignUpModal open={showSignUp} onOpenChange={setShowSignUp} />
		</header>
	);
}
