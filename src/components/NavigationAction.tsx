"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationActionProps {
    icon: React.ReactNode;
    route: string;
}

export default function NavigationAction({ icon, route }: NavigationActionProps) {
    const path = usePathname();
    const isActive = path === route;
    
    return (
        <Link href={route} className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors duration-200">
            {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[linear-gradient(87.08deg,#DD3562_6.8%,#8354FF_102.07%)]" />
            )}
            <div className={isActive ? "opacity-100" : "opacity-60"}>
                {icon}
            </div>
        </Link>
    );
}