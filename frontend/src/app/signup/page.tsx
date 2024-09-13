"use client";

import { Button } from "@/components/ui/button";
import AuthCard from "@/components/ui/custom/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { decodeJWT, isValidUserPayload, UserPayload } from "@/utility/jwt";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const title: string = "Sign Up";
const description = (
	<Link className="underline decoration-2 decoration-sky-500" href="/login">
		Already have an account? Click here.
	</Link>
);

export default function Signup() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [submitClicked, setSubmitClicked] = useState<boolean>(false);

	const router = useRouter();

	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("token") ?? "";
		if (!token) {
			localStorage.removeItem("token");
			return;
		}

		try {
			const userPayload: UserPayload = decodeJWT(token);

			if (!isValidUserPayload(userPayload)) {
				localStorage.removeItem("token");
				return;
			}

			router.push(`/badge/${userPayload.id}`);
		} catch {
			localStorage.removeItem("token");
			return;
		}
	}, []);

	useEffect(() => {
		if (!submitClicked) {
			return;
		}

		async function signupUser() {
			const signupEndpoint = "http://localhost:8000/api/signup";
			const method = "POST";
			const body = JSON.stringify({ email, password });

			const response = await fetch(signupEndpoint, {
				method,
				body,
				headers: { "Content-Type": "application/json" },
			});

			if (response.status !== 200) {
				setSubmitClicked(() => false);

				toast({
					variant: "destructive",
					title: "Something went wrong!",
					description: "Sign up not processed. Please try again!",
					duration: 3_000,
				});

				return;
			}

			const token: string = await response.text();
			localStorage.setItem("token", token.replaceAll('"', ""));

			router.push("/badge/create");
		}

		signupUser();
	}, [submitClicked]);

	return (
		<div className="w-screen h-screen grid place-content-center">
			<AuthCard className="w-[360px] h-fit" title={title} description={description}>
				<form onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="name">Email</Label>
						<Input
							id="Email"
							placeholder="john@appleseed.com"
							value={email}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
						/>
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder=""
							value={password}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
						/>
					</div>
					<Button type="submit" className="mt-6 w-full" onClick={() => setSubmitClicked(true)}>
						Sign Up
					</Button>
				</form>
			</AuthCard>
			<Toaster />
		</div>
	);
}
