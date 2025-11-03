"use client";

import BottomNav from "@/components/BottomNav";
import MatchCard from "@/components/MatchCard";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TabType = "all" | "youLiked" | "likedYou" | "views";

interface MatchItem {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string | null;
  matchedAt?: Date;
  likedAt?: Date;
  viewedAt?: Date;
  type: string;
  reactionType?: string;
}

export default function Matches() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [youLiked, setYouLiked] = useState<MatchItem[]>([]);
  const [likedYou, setLikedYou] = useState<MatchItem[]>([]);
  const [views, setViews] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const response = await fetch("/api/matches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches.map((m: any) => ({ ...m, matchedAt: new Date(m.matchedAt) })));
        setYouLiked(data.youLiked.map((m: any) => ({ ...m, likedAt: new Date(m.likedAt) })));
        setLikedYou(data.likedYou.map((m: any) => ({ ...m, likedAt: new Date(m.likedAt) })));
        setViews(data.views.map((m: any) => ({ ...m, viewedAt: new Date(m.viewedAt) })));
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubtitle = (item: MatchItem) => {
    if (item.type === "match") {
      return "Found from matches proposal";
    }
    if (item.type === "you_liked") {
      return item.reactionType === "SUPER_LIKE" ? "You super liked" : "You liked";
    }
    if (item.type === "liked_you") {
      return item.reactionType === "SUPER_LIKE" ? "Super liked you" : "Liked you via Swipe";
    }
    return "Viewed your profile";
  };

  const getDisplayItems = () => {
    switch (activeTab) {
      case "all":
        return matches;
      case "youLiked":
        return youLiked;
      case "likedYou":
        return likedYou;
      case "views":
        return views;
      default:
        return [];
    }
  };

  const displayItems = getDisplayItems();

  const handleDeleteItem = (itemId: string, itemType: TabType) => {
    // Remover item da lista apropriada
    if (itemType === "all") {
      setMatches((prev) => prev.filter((m) => m.id !== itemId));
    } else if (itemType === "youLiked") {
      setYouLiked((prev) => prev.filter((m) => m.id !== itemId));
    } else if (itemType === "likedYou") {
      setLikedYou((prev) => prev.filter((m) => m.id !== itemId));
    }
  };

  if (isLoading) {
    return (
      <main className="relative w-full md:w-md h-screen overflow-hidden flex items-center justify-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <p className="text-white font-lexend">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="w-full p-6 flex items-center gap-4">
        <button onClick={() => router.back()}>
          <ArrowBack className="text-white" sx={{ fontSize: 28 }} />
        </button>
        <div>
          <h1 className="text-white font-lexend font-bold text-2xl">Dating Matches</h1>
          <p className="text-white/60 font-lexend text-sm">
            Check out lists of matches & keep enjoying
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-6 flex gap-8 border-b border-purple-900/30">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 font-lexend font-semibold text-base relative ${
            activeTab === "all" ? "text-[#DD3562]" : "text-white/60"
          }`}
        >
          All
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DD3562]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("youLiked")}
          className={`pb-3 font-lexend font-semibold text-base relative ${
            activeTab === "youLiked" ? "text-[#DD3562]" : "text-white/60"
          }`}
        >
          You Liked
          {activeTab === "youLiked" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DD3562]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("likedYou")}
          className={`pb-3 font-lexend font-semibold text-base relative ${
            activeTab === "likedYou" ? "text-[#DD3562]" : "text-white/60"
          }`}
        >
          Liked You
          {activeTab === "likedYou" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DD3562]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("views")}
          className={`pb-3 font-lexend font-semibold text-base relative ${
            activeTab === "views" ? "text-[#DD3562]" : "text-white/60"
          }`}
        >
          Views
          {activeTab === "views" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DD3562]" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {displayItems.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/40 font-lexend text-center">
              No {activeTab === "all" ? "matches" : activeTab} yet
            </p>
          </div>
        ) : (
          <div className="w-full">
            {displayItems.map((item) => (
              <MatchCard
                key={item.id}
                id={item.id}
                userId={item.userId}
                firstName={item.firstName}
                lastName={item.lastName}
                avatar={item.avatar}
                subtitle={getSubtitle(item)}
                date={item.matchedAt || item.likedAt || item.viewedAt || new Date()}
                type={item.type as "match" | "you_liked" | "liked_you" | "view"}
                onDelete={() => handleDeleteItem(item.id, activeTab)}
                onClick={() => router.push(`/profile/${item.userId}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
