import SplashBg from "@/assets/splash-bg.png";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Splash() {
    return (
        <>
        {/* Background Effects */}
            <div
                className="
                absolute
                w-[36.956rem]
                h-[36.956rem]
                -top-32
                -left-24
                rotate-75
                opacity-50
                pointer-events-none
                bg-[linear-gradient(180deg,rgba(100,28,60,0.4)_0%,#07011A_100%)]
                mix-blend-normal
                blur-[2rem]
                z-1
                "
            />

            <div
                className="
                absolute
                w-[36.956rem]
                h-[36.956rem]
                top-56
                left-0
                rotate-75
                opacity-75
                pointer-events-none
                bg-[linear-gradient(180deg,#270D59_0%,rgba(7,1,26,0)_100%)]
                mix-blend-screen
                blur-[12.5rem]
                z-2
                "
            />

            <section
                className="w-full h-full flex flex-col items-center justify-center"
            >
                <div className="relative z-3 w-96 h-auto pointer-events-none">
                <Image
                    src={SplashBg}
                    alt="Background Splash"
                    className="w-full h-full object-cover"
                />
                </div>

                <div className="absolute z-4 pointer-events-none">
                <Image
                    src={Logo}
                    alt="App Logo"
                    className="w-44 h-auto"
                />
                </div>

                <Link
                href="/get-started"
                className="absolute bottom-20 z-10 flex items-center gap-3 font-bold text-2xl pointer-events-auto bg-clip-text text-transparent bg-[linear-gradient(87.08deg,#DD3562_6.8%,#8354FF_102.07%)]"
                >
                Get Started
                <ArrowRight className="w-6 h-6 text-white" />
                </Link>
            </section>
        </>
    )
}