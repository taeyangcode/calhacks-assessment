"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { decodeJWT, isValidUserPayload, UserPayload } from "@/utility/jwt";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface BadgeDetails {
	id: string;
	full_name: string;
	university: string;
	major: string;
	graduation_date: number;
	github: string;
}

export default function Badge() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const [id, setId] = useState<string>("");
	const [fullName, setFullName] = useState<string>("");
	const [university, setUniversity] = useState<string>("");
	const [major, setMajor] = useState<string>("");
	const [graduationYear, setGraduationYear] = useState<number>(0);
	const [github, setGithub] = useState<string>("");

	useEffect(() => {
		const token = localStorage.getItem("token") ?? "";
		if (!token) {
			router.push("/login");
			return;
		}

		try {
			var userPayload: UserPayload = decodeJWT(token);

			if (!isValidUserPayload(userPayload)) {
				localStorage.removeItem("token");
				router.push("/login");
			}
		} catch {
			localStorage.removeItem("token");
			router.push("/login");
		}

		async function retrieveBadgeDetails() {
			const badgeEndpoint = `http://localhost:8000/api/badges/${params.id}`;
			const method = "GET";

			const response = await fetch(badgeEndpoint, {
				method,
				headers: { "Content-Type": "application/json" },
			});

			if (response.status !== 200) {
				router.push("/signup");

				toast({
					variant: "destructive",
					title: "Error creating badge",
					description: "Please try again.",
					duration: 3_000,
				});

				return;
			}

			const badgeDetails: BadgeDetails = await response.json();

			console.log(badgeDetails);

			setId(badgeDetails.id);
			setFullName(badgeDetails.full_name);
			setGithub(badgeDetails.github);
			setGraduationYear(new Date(badgeDetails.graduation_date * 1000).getFullYear());
			setMajor(badgeDetails.major);
			setUniversity(badgeDetails.university);
		}

		retrieveBadgeDetails();
	}, []);

	return (
		<div className="w-screen h-screen grid place-items-center">
			<Card className="w-[360px] h-fit">
				<CardHeader>
					<CardTitle className="text-2xl">{fullName}</CardTitle>
					<CardDescription>{`${university} | Year of ${graduationYear}`}</CardDescription>
					<CardDescription>{`${major}`}</CardDescription>
				</CardHeader>
				<CardContent>
					<Link className="underline decoration-2 decoration-sky-500 text-sm" href={github}>
						{github}
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
