"use client";

import AvatarUpload from "@/components/AvatarUpload";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import TextField from "@/components/TextField";
import { SignUpInput, signUpSchema } from "@/lib/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CameraAlt from "@mui/icons-material/CameraAlt";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Flight from "@mui/icons-material/Flight";
import LocalBar from "@mui/icons-material/LocalBar";
import Mic from "@mui/icons-material/Mic";
import MusicNote from "@mui/icons-material/MusicNote";
import Palette from "@mui/icons-material/Palette";
import Pool from "@mui/icons-material/Pool";
import Restaurant from "@mui/icons-material/Restaurant";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import SportsEsports from "@mui/icons-material/SportsEsports";
import Terrain from "@mui/icons-material/Terrain";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Interest {
  id: string;
  name: string;
  iconName: string;
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <CameraAlt />,
  cooking: <Restaurant />,
  gamepad: <SportsEsports />,
  music: <MusicNote />,
  airplane: <Flight />,
  "shopping-bag": <ShoppingBag />,
  microphone: <Mic />,
  palette: <Palette />,
  water: <Pool />,
  wine: <LocalBar />,
  mountain: <Terrain />,
  dumbbell: <FitnessCenter />,
};

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      orientation: undefined
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (avatarFile) {
      setValue("photo", avatarFile, { shouldValidate: true });
    }
  }, [avatarFile, setValue]);

  useEffect(() => {
    // Buscar interesses disponíveis
    fetch("/api/interests")
      .then((res) => res.json())
      .then((data) => setInterests(data.interests || []))
      .catch(console.error);
  }, []);

  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["firstName", "lastName", "dateOfBirth", "photo"]);
    } else if (step === 2) {
      isValid = await trigger(["gender", "orientation"]);
    } else if (step === 3) {
      isValid = await trigger(["email", "password", "confirmPassword"]);
    }

    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const onSubmit = async (data: SignUpInput) => {
    setApiError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("orientation", data.orientation);
      formData.append("photo", data.photo);
      formData.append("interests", JSON.stringify(selectedInterests));

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || "Error creating account");
        return;
      }

      document.cookie = `auth-token=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push("/home");
    } catch (error) {
      setApiError("Unexpected error. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const skipInterests = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      <div className="w-full h-10 p-6">
        {step > 1 ? (
          <button onClick={handleBack}>
            <ArrowBack className="text-white" />
          </button>
        ) : (
          <Link href="/">
            <ArrowBack className="text-white" />
          </Link>
        )}
      </div>

      <div className="w-full h-full flex flex-col items-center gap-8 px-6 pb-6 pt-8 overflow-y-auto">
        {step === 4 ? (
          <>
            {/* Header para step 4 */}
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold font-lexend text-white text-3xl md:text-4xl">
                  Likes, Interests
                </h1>
                <h2 className="font-lexend text-white/70 text-sm">
                  Share your likes & passion with others
                </h2>
              </div>
              <button
                type="button"
                onClick={skipInterests}
                disabled={isLoading}
                className="text-[#FF3D71] font-lexend font-semibold text-lg"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-around">
            <h1 className="font-semibold font-lexend text-white text-3xl md:text-4xl">
              {step === 1 && "Profile Details"}
              {step === 2 && "About You"}
              {step === 3 && "Credentials"}
            </h1>
            <h2 className="font-lexend text-white text-sm sm:text-base">
              {step === 1 && "Fill up the following details"}
              {step === 2 && "Tell us more about yourself"}
              {step === 3 && "Create a secure password"}
            </h2>
          </div>
        )}

        {apiError && (
          <div className="w-full bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          </div>
        )}

        {/* Step 1: Informações Básicas */}
        {step === 1 && (
          <div className="w-full flex flex-col gap-8 pb-8">
            <div className="w-full flex items-center justify-center">
              <AvatarUpload
                onAvatarChanged={setAvatarFile}
                onError={(error) => setApiError(error)}
              />
            </div>
            {errors.photo && (
              <p className="text-red-500 text-sm text-center -mt-4">
                {errors.photo.message}
              </p>
            )}

            <div>
              <TextField
                {...register("firstName")}
                value={formValues.firstName}
                onChange={(value) => setValue("firstName", value, { shouldValidate: true })}
              >
                First Name
              </TextField>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.firstName.message}</p>
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
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <TextField
                {...register("dateOfBirth")}
                type="date"
                value={formValues.dateOfBirth}
                onChange={(value) => setValue("dateOfBirth", value, { shouldValidate: true })}
              >
                Date of Birth
              </TextField>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20">
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Gênero e Orientação */}
        {step === 2 && (
          <div className="w-full flex flex-col gap-8 pb-8">
            <div>
              <SelectField
                {...register("gender")}
                value={formValues.gender}
                onChange={(value) => setValue("gender", value as any, { shouldValidate: true })}
                options={[
                  { value: "MALE", children: "Male" },
                  { value: "FEMALE", children: "Female" },
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
                {...register("orientation")}
                value={formValues.orientation}
                onChange={(value) => setValue("orientation", value as any, { shouldValidate: true })}
                options={[
                  { value: "HETEROSEXUAL", children: "Straight" },
                  { value: "BISEXUAL", children: "Bisexual" },
                  { value: "GAY", children: "Gay" },
                  { value: "LESBIAN", children: "Lesbian" },
                  { value: "OTHER", children: "Other" },
                ]}
              >
                Sexual Orientation
              </SelectField>
              {errors.orientation && (
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.orientation.message}</p>
              )}
            </div>

            <div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20">
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Email e Senha */}
        {step === 3 && (
          <div className="w-full flex flex-col gap-8 pb-8">
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
              <TextField
                {...register("confirmPassword")}
                type="password"
                value={formValues.confirmPassword}
                onChange={(value) => setValue("confirmPassword", value, { shouldValidate: true })}
              >
                Confirm Password
              </TextField>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 ml-2">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="w-full flex items-center justify-center">
              <Link
                href="/signin"
                className="opacity-90 flex items-center gap-3 font-medium font-lexend text-lg pointer-events-auto text-[#C53E8D]"
              >
                Already have an account? Sign In
              </Link>
            </div>

            <div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20">
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Interesses */}
        {step === 4 && (
          <div className="w-full flex flex-col gap-6 pb-8">
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      relative px-6 py-4 rounded-4xl font-lexend font-medium text-base transition-all
                      flex items-center gap-3
                      ${
                        isSelected
                          ? "bg-transparent text-white border-2 border-transparent"
                          : "bg-[#251759] text-white/70 border-2 border-transparent"
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            background: "linear-gradient(#140034, #140034) padding-box, linear-gradient(87.08deg, #DD3562 6.8%, #8354FF 102.07%) border-box",
                          }
                        : undefined
                    }
                  >
                    <span className={isSelected ? "text-white" : "text-white/50"}>
                      {iconMap[interest.iconName] || <CameraAlt />}
                    </span>
                    <span>{interest.name}</span>
                  </button>
                );
              })}
            </div>

            {interests.length >= 12 && (
              <button
                type="button"
                className="text-[#FF3D71] font-lexend font-semibold text-lg"
              >
                Load More
              </button>
            )}

            <div className="w-full flex items-center justify-center px-6 sm:px-10 md:px-20 pt-4">
              <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
