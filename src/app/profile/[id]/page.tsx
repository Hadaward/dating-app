"use client";

import BottomNav from "@/components/BottomNav";
import InterestBadge from "@/components/InterestBadge";
import PhotoGallery from "@/components/PhotoGallery";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string | null;
  photos: Array<{
    id: string;
    url: string;
    isMain: boolean;
    order: number;
  }>;
  interests: Array<{
    id: string;
    name: string;
    iconName: string;
  }>;
  isCurrentUser: boolean;
}

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const response = await fetch(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      router.push("/home");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      document.cookie = "auth-token=; path=/; max-age=0";
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="relative w-full md:w-md h-screen overflow-hidden flex items-center justify-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <p className="text-white font-lexend">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="w-full p-6 flex items-center justify-between">
        <button onClick={() => router.back()}>
          <ArrowBack className="text-white" sx={{ fontSize: 28 }} />
        </button>
        
        {user.isCurrentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
          >
            <Logout className="text-red-400" sx={{ fontSize: 20 }} />
            <span className="text-red-400 font-lexend font-semibold text-sm">
              Logout
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Avatar and Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-4 border-4 border-white/20">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Person className="text-white/30" sx={{ fontSize: 64 }} />
            )}
          </div>
          
          <h1 className="text-white font-lexend font-bold text-3xl mb-1">
            {user.firstName} {user.lastName}
          </h1>
          
          <p className="text-white/60 font-lexend text-lg">
            {user.age} years old
          </p>
        </div>

        {/* Interests Section */}
        {user.interests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-lexend font-bold text-xl mb-4">
              Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest) => (
                <InterestBadge
                  key={interest.id}
                  name={interest.name}
                  iconName={interest.iconName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Photos Gallery */}
        {user.photos.length > 0 && (
          <div>
            <h2 className="text-white font-lexend font-bold text-xl mb-4">
              Photos ({user.photos.length})
            </h2>
            <PhotoGallery photos={user.photos} />
          </div>
        )}

        {user.photos.length === 0 && user.interests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 font-lexend">
              {user.isCurrentUser
                ? "Complete your profile by adding photos and interests"
                : "This user hasn't added photos or interests yet"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
