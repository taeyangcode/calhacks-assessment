"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
	const router = useRouter();

	function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		localStorage.removeItem("token");
		router.push("/signup");
	}

	return (
		<div className="top-4 left-4 relative">
			<Button variant="outline" onClick={handleOnClick}>
				Logout
			</Button>
			{children}
		</div>
	);
}
