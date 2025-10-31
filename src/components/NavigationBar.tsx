import Chats from "@/assets/icons/chats.png";
import Swipe from "@/assets/icons/swipe.png";
import User from "@/assets/icons/user.png";
import Users from "@/assets/icons/users.png";

import Image from "next/image";
import NavigationAction from "./NavigationAction";

export default function NavigationBar() {
    return (
        <nav className="w-full h-16 bg-[linear-gradient(180deg,rgba(20,1,51,0.95)_-29.17%,rgba(22,2,41,0.98)_91.67%)] flex items-center gap-6 justify-center border-t border-t-[#1F014B]">
            <NavigationAction icon={<Image src={Swipe} alt="Swipe" />} route="/home" />
            <NavigationAction icon={<Image src={Users} alt="Users" />} route="/matches" />
            <NavigationAction icon={<Image src={Chats} alt="Likes" />} route="/likes" />
            <NavigationAction icon={<Image src={User} alt="User profile" />} route="/profile" />
        </nav>
    )
}