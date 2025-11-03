"use client";

import Logo from "@/assets/logo.png";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { SignInInput, signInSchema } from "@/lib/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignIn() {
	const router = useRouter();
	const [apiError, setApiError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const formValues = watch();

	const onSubmit = async (data: SignInInput) => {
		setApiError("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				setApiError(result.error || "Erro ao fazer login");
				return;
			}

			// Salvar token no cookie
			document.cookie = `auth-token=${result.token}; path=/; max-age=${
				60 * 60 * 24 * 7
			}`;

			// Redirecionar para home
			router.push("/home");
		} catch (error) {
			setApiError("Erro inesperado. Tente novamente.");
			console.error("Signin error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
			<div className="w-full h-10 p-6">
				<Link href="/">
					<ArrowBack className="text-white" />
				</Link>
			</div>
			<div className="w-full h-full flex flex-col items-center justify-between px-6 pb-6 pt-8 overflow-y-auto">
				<h1 className="font-semibold font-lexend text-white text-3xl md:text-4xl">
					Login
				</h1>

				<div className="w-full py-6 flex items-center justify-center pointer-events-none">
					<Image src={Logo} alt="App Logo" className="w-44 h-auto" />
				</div>

				{apiError && (
					<div className="w-full bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
						<p className="text-red-500 text-sm text-center">{apiError}</p>
					</div>
				)}

				<form
					className="w-full flex flex-col gap-8 pb-8"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div>
						<TextField
							{...register("email")}
							type="email"
							value={formValues.email}
							onChange={(value) =>
								setValue("email", value, { shouldValidate: true })
							}
						>
							Email
						</TextField>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<TextField
							{...register("password")}
							type="password"
							value={formValues.password}
							onChange={(value) =>
								setValue("password", value, { shouldValidate: true })
							}
						>
							Password
						</TextField>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="w-full flex items-center justify-center">
						<Link
							href="/signup"
							className="opacity-90 flex items-center gap-3 font-medium font-lexend text-lg pointer-events-auto text-[#C53E8D]"
						>
							Signup
						</Link>
					</div>

					<div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Logging in..." : "Continue"}
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}