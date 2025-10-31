"use client";

import AvatarUpload from "@/components/AvatarUpload";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import TextField from "@/components/TextField";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [preference, setPreference] = useState("");

	return (
		<main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
			<div className="w-full h-10 p-6">
				<Link href="/">
					<ArrowBack className="text-white" />
				</Link>
			</div>
			<div className="w-full h-full flex flex-col items-center px-6 pb-6 pt-8">
				<h1 className="font-semibold font-lexend text-white text-4xl">
					Profile Details
				</h1>
				<h2 className="font-lexend text-white">
					Fill up the following details
				</h2>

				<div className="w-full py-12 flex flex-col items-center justify-center">
					<AvatarUpload />
				</div>

				<form className="w-full flex flex-col gap-8">
					<TextField
						name="firstName"
						value={firstName}
						onChange={(value) => setFirstName(value)}
					>
						First Name
					</TextField>

					<TextField
						name="lastName"
						value={lastName}
						onChange={(value) => setLastName(value)}
					>
						Last Name
					</TextField>

					<TextField
						name="dateOfBirth"
						type="date"
						value={dateOfBirth}
						onChange={(value) => setDateOfBirth(value)}
					>
						DOB
					</TextField>

					<SelectField
						name="gender"
						value={preference}
						onChange={setPreference}
						options={[
							{
								value: "male",
								children: "Male",
							},
							{
								value: "female",
								children: "Female",
							},
							{
								value: "other",
								children: "Other",
							},
						]}
					>
						<span className="text-gray-400">Select</span> <span className="text-gray-500">your preference</span>
          </SelectField>
          
          <div
            className="w-full flex items-center justify-center px-20 pt-8"
          >
            <Button
              type="submit"
            >
              Continue
            </Button>
          </div>
				</form>
			</div>
		</main>
	);
}
