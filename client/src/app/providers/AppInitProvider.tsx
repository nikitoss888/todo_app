"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { initUserFromCookies } from "@/lib/store/slices/userSlice";

export default function AppInitProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initUserFromCookies());
	}, [dispatch]);

	return <>{children}</>;
}
