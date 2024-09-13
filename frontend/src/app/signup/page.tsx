import { Button } from "@/components/ui/button";
import AuthCard from "@/components/ui/custom/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function handleSubmit() {}

export default function Signup() {
	const title: string = "Sign Up";
	const description = (
		<Link className="underline decoration-2 decoration-sky-500 font-bold" href="/login">
			Already have an account? Click here.
		</Link>
	);

	return (
		<div className="w-screen h-screen grid place-content-center">
			<AuthCard className="w-[360px] h-fit" title={title} description={description}>
				<form>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="name">Email</Label>
						<Input id="Email" placeholder="john@appleseed.com" />
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" placeholder="" />
					</div>
					<Button type="submit" className="mt-6 w-full">
						Sign Up
					</Button>
				</form>
			</AuthCard>
		</div>
	);
}
