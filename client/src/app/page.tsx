import Header from "./components/layout/Header";
import ListControls from "./components/list/ListControls";
import ErrorModal from "./components/modals/ErrorModal";
import LoadingModal from "./components/modals/LoadingModal";

export default function Home() {
	return (
		<div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
			<Header />
			<main className="flex flex-col gap-[32px] items-center sm:items-start w-full">
				<ListControls />
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
				<p className="text-[14px] text-gray-500">
					&copy; 2025 Oleksiichuk Mykyta for Insiders
				</p>
			</footer>
			<LoadingModal />
			<ErrorModal />
		</div>
	);
}
