import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
	title: ReactNode;
	description?: ReactNode;

	className?: string;
	children?: ReactNode;
}

export default function AuthCard(props: AuthCardProps) {
	return (
		<div className={props.className}>
			<Card className="w-full h-full">
				<CardHeader>
					<CardTitle className="text-2xl">{props.title}</CardTitle>
					{props.description ?? <CardDescription>{props.description}</CardDescription>}
				</CardHeader>
				<CardContent>{props.children}</CardContent>
			</Card>
		</div>
	);
}
