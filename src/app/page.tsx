"use client";
import Logo from "@/assets/logo.png";
import SplashBg from "@/assets/splash-bg.png";
import { ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

export default function SplashScreen() {
  return (
    <div className="w-full md:w-md h-full relative overflow-hidden bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Background Top Effect */}
      <div className="absolute w-[36.956rem] h-[36.956rem] -top-32 -left-24 rotate-75 opacity-50 pointer-events-none bg-[linear-gradient(180deg,rgba(100,28,60,0.4)_0%,#07011A_100%)] mix-blend-normal blur-[2rem] z-1" />
  
      {/* Background Bottom Effect */}
      <div className="absolute w-[36.956rem] h-[36.956rem] top-56 left-0 rotate-75 opacity-75 pointer-events-none bg-[linear-gradient(180deg,#270D59_0%,rgba(7,1,26,0)_100%)] mix-blend-screen blur-[12.5rem] z-2" />
    
      <section className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative z-3 w-96 h-auto pointer-events-none">
            <Image src={SplashBg} alt="Background Splash" className="w-full h-full object-cover" />
          </div>

          <div className="absolute z-4 pointer-events-none">
            <Image src={Logo} alt="App Logo" className="w-44 h-auto" />
          </div>

          <Link href="/signin" className="fixed bottom-20 z-10 flex items-center gap-3 font-bold font-lexend text-2xl pointer-events-auto bg-clip-text text-transparent bg-[linear-gradient(87.08deg,#DD3562_6.8%,#8354FF_102.07%)]">
            Get Started
            <ArrowForward className="text-white" sx={{ fontSize: '2rem' }} />
          </Link>
        </section>
    </div>
  )
}