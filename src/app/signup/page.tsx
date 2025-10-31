"use client";

import AvatarUpload from "@/components/AvatarUpload";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import TextField from "@/components/TextField";
import { SignUpInput, signUpSchema } from "@/lib/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
	const router = useRouter();
	const [apiError, setApiError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			dateOfBirth: "",
			gender: undefined,
			preference: undefined,
			photo: "",
		},
	});

	const formValues = watch();

	const handleAvatarChange = (file: File | null) => {
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setValue("photo", reader.result as string, { shouldValidate: true });
		};
		reader.readAsDataURL(file);
	};

	const handleAvatarError = (error: string) => {
		// Você pode usar setError do react-hook-form se quiser
		setApiError(error);
	};

	const onSubmit = async (data: SignUpInput) => {
		setApiError("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				setApiError(result.error || "Erro ao criar conta");
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
			console.error("Signup error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
			<div className="w-full h-10 p-6">
				<Link href="/signin">
					<ArrowBack className="text-white" />
				</Link>
			</div>
			<div className="w-full h-full flex flex-col items-center px-6 pb-6 pt-8 overflow-y-auto">
				<h1 className="font-semibold font-lexend text-white text-3xl md:text-4xl">
					Profile Details
				</h1>
				<h2 className="font-lexend text-white text-sm sm:text-base">
					Fill up the following details
				</h2>

				<div className="w-full py-12 flex flex-col items-center justify-center">
					<AvatarUpload
						onAvatarChanged={handleAvatarChange}
						onError={handleAvatarError}
					/>
					{errors.photo && (
						<p className="text-red-500 text-sm mt-2">{errors.photo.message}</p>
					)}
				</div>

				{apiError && (
					<div className="w-full bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
						<p className="text-red-500 text-sm text-center">{apiError}</p>
					</div>
				)}

				<form className="w-full flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<TextField
							{...register("firstName")}
							value={formValues.firstName}
							onChange={(value) => setValue("firstName", value, { shouldValidate: true })}
						>
							First Name
						</TextField>
						{errors.firstName && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.firstName.message}
							</p>
						)}
					</div>

					<div>
						<TextField
							{...register("lastName")}
							value={formValues.lastName}
							onChange={(value) => setValue("lastName", value, { shouldValidate: true })}
						>
							Last Name
						</TextField>
						{errors.lastName && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.lastName.message}
							</p>
						)}
					</div>

					<div>
						<TextField
							{...register("dateOfBirth")}
							type="date"
							value={formValues.dateOfBirth}
							onChange={(value) => setValue("dateOfBirth", value, { shouldValidate: true })}
						>
							DOB
						</TextField>
						{errors.dateOfBirth && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.dateOfBirth.message}
							</p>
						)}
					</div>

					<div>
						<TextField
							{...register("email")}
							type="email"
							value={formValues.email}
							onChange={(value) => setValue("email", value, { shouldValidate: true })}
						>
							Email
						</TextField>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1 ml-2">{errors.email.message}</p>
						)}
					</div>

					<div>
						<TextField
							{...register("password")}
							type="password"
							value={formValues.password}
							onChange={(value) => setValue("password", value, { shouldValidate: true })}
						>
							Password
						</TextField>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1 ml-2">{errors.password.message}</p>
						)}
					</div>

					<div>
						<SelectField
							{...register("gender")}
							value={formValues.gender || ""}
							onChange={(value) => setValue("gender", value as any, { shouldValidate: true })}
							options={[
								{ value: "MALE", children: "Male" },
								{ value: "FEMALE", children: "Female" },
								{ value: "OTHER", children: "Other" },
							]}
						>
							Gender
						</SelectField>
						{errors.gender && (
							<p className="text-red-500 text-sm mt-1 ml-2">{errors.gender.message}</p>
						)}
					</div>

					<div>
						<SelectField
							{...register("preference")}
							value={formValues.preference || ""}
							onChange={(value) => setValue("preference", value as any, { shouldValidate: true })}
							options={[
								{ value: "MALE", children: "Male" },
								{ value: "FEMALE", children: "Female" },
								{ value: "OTHER", children: "Other" },
							]}
						>
							Preference
						</SelectField>
						{errors.preference && (
							<p className="text-red-500 text-sm mt-1 ml-2">
								{errors.preference.message}
							</p>
						)}
					</div>

					<div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20 pt-8">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Creating..." : "Continue"}
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}
