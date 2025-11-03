"use client";

import ChatBubble from "@mui/icons-material/ChatBubble";
import Dashboard from "@mui/icons-material/Dashboard";
import Favorite from "@mui/icons-material/Favorite";
import Person from "@mui/icons-material/Person";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUserId();
  }, []);

  const fetchCurrentUserId = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const response = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.id);
      }
    } catch (error) {
      console.error("Error fetching current user ID:", error);
    }
  };

  const navItems = [
    { path: "/home", icon: Dashboard, label: "Home" },
    { path: "/matches", icon: Favorite, label: "Matches" },
    { path: "/messages", icon: ChatBubble, label: "Messages" },
    {
      path: currentUserId ? `/profile/${currentUserId}` : "/profile",
      icon: Person,
      label: "Profile",
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0E0127] border-t border-purple-900/30">
      <div className="flex items-center justify-around h-full px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 transition-colors"
            >
              <Icon
                className={isActive ? "text-white" : "text-[#DD3562]"}
                sx={{ fontSize: 24 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
