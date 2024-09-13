import { Button } from "@/components/ui/button";
import AuthCard from "@/components/ui/custom/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
	event.preventDefault();
}

export default function Login() {
	const title: string = "Login";

	return (
		<div className="w-screen h-screen grid place-content-center">
			<AuthCard className="w-[360px] h-fit" title={title}>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="name">Email</Label>
						<Input id="Email" placeholder="john@appleseed.com" />
					</div>
					<div className="flex flex-col space-y-1.5 mt-4">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" placeholder="" />
					</div>
					<Button type="submit" className="mt-6 w-full">
						Login
					</Button>
				</form>
			</AuthCard>
		</div>
	);
}
