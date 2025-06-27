"use client";

import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import AppInitProvider from "./providers/AppInitProvider";

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<HeroUIProvider>
			<Provider store={store}>
				<AppInitProvider>{children}</AppInitProvider>
			</Provider>
		</HeroUIProvider>
	);
}
