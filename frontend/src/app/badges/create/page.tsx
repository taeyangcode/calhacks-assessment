"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import AuthCard from "@/components/ui/custom/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { dateToUnixTimestamp, decodeJWT, isValidUserPayload, UserPayload } from "@/utility/jwt";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const title: string = "Create Badge";
const description: string = "Time to create your personal badge!";

export default function CreateBadge() {
	const [fullName, setFullName] = useState<string>("");
	const [university, setUniversity] = useState<string>("");
	const [major, setMajor] = useState<string>("");
	const [graduationDate, setGraduationDate] = useState<Date | undefined>(new Date());
	const [github, setGithub] = useState<string>("");
	const [submitClicked, setSubmitClicked] = useState<boolean>(false);

	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("token") ?? "";
		if (!token) {
			router.push("/signup");
			return;
		}

		try {
			const userPayload: UserPayload = decodeJWT(token);

			if (!isValidUserPayload(userPayload)) {
				localStorage.removeItem("token");
				router.push("/signup");
			}
		} catch {
			localStorage.removeItem("token");
			router.push("/signup");
		}
	}, []);

	useEffect(() => {
		if (!submitClicked) {
			return;
		}

		async function createBadge() {
			const badgeEndpoint = "http://localhost:8000/api/badges";
			const method = "POST";
			const body = JSON.stringify({
				full_name: fullName,
				university,
				major,
				graduation_date: dateToUnixTimestamp(graduationDate!),
				github,
			});

			const token = localStorage.getItem("token")!;

			const response = await fetch(badgeEndpoint, {
				method,
				body,
				headers: { Authorization: token, "Content-Type": "application/json" },
			});

			if (response.status !== 200) {
				setSubmitClicked(() => false);

				toast({
					variant: "destructive",
					title: "Error creating badge",
					description: "Please try again.",
					duration: 3_000,
				});

				return;
			}

			const { id }: UserPayload = decodeJWT(token);

			router.push(`/badges/${id}`);
		}

		createBadge();
	}, [submitClicked]);

	return (
		<div className="w-screen h-screen grid place-content-center">
			<AuthCard className="w-[420px] h-fit" title={title} description={description}>
				<form onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="full_name">Full Name</Label>
						<Input
							id="full_name"
							placeholder="John Appleseed"
							value={fullName}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)}
						/>
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="university">University</Label>
						<Input
							id="university"
							placeholder=""
							value={university}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setUniversity(event.target.value)}
						/>
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="major">Major</Label>
						<Input
							id="major"
							placeholder=""
							value={major}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setMajor(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5 mt-4 grid">
						<Label htmlFor="graduation_date">Graduation Date</Label>
						<Calendar
							id="graduation_date"
							mode="single"
							selected={graduationDate}
							onSelect={setGraduationDate}
							className="rounded-md border shadow justify-self-center"
						/>
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="github">GitHub</Label>
						<Input
							id="github"
							placeholder="https://github.com/username"
							value={github}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setGithub(event.target.value)}
						/>
					</div>
					<Button type="submit" className="mt-6 w-full" onClick={() => setSubmitClicked(true)}>
						Create Badge
					</Button>
				</form>
			</AuthCard>
			<Toaster />
		</div>
	);
}
