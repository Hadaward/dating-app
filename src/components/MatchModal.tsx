"use client";

import ChatBubble from "@mui/icons-material/ChatBubble";
import ThumbUp from "@mui/icons-material/ThumbUp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MatchModalProps {
  isOpen: boolean;
  matchedUser: {
    firstName: string;
    avatar: string | null;
  };
  currentUserAvatar: string | null;
}

export default function MatchModal({
  isOpen,
  matchedUser,
  currentUserAvatar,
}: MatchModalProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleStartConversation = () => {
    setVisible(false);
    setTimeout(() => {
      router.push("/messages");
    }, 300);
  };

  const handleKeepDating = () => {
    setVisible(false);
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0E0127] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
        {/* Animated circles and decorations */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Gradient circles */}
          <div className="absolute w-[800px] h-[800px]">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full opacity-10 animate-pulse"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, rgba(221, 53, 98, 0.3) 0deg, rgba(131, 84, 255, 0.3) 180deg, rgba(221, 53, 98, 0.3) 360deg)",
                animationDuration: "3s",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-15 animate-pulse"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, rgba(221, 53, 98, 0.4) 0deg, rgba(131, 84, 255, 0.4) 180deg, rgba(221, 53, 98, 0.4) 360deg)",
                animationDuration: "2.5s",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full opacity-20 animate-pulse"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, rgba(221, 53, 98, 0.5) 0deg, rgba(131, 84, 255, 0.5) 180deg, rgba(221, 53, 98, 0.5) 360deg)",
                animationDuration: "2s",
              }}
            />
          </div>

          {/* Floating dots - Left side */}
          <div className="absolute top-[20%] left-[10%] w-3 h-3 rounded-full bg-pink-400 opacity-60 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute top-[25%] left-[8%] w-2 h-2 rounded-full bg-purple-400 opacity-50 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
          <div className="absolute top-[30%] left-[12%] w-4 h-4 rounded-full bg-orange-400 opacity-40 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.6s" }} />
          
          {/* Floating dots - Right side */}
          <div className="absolute bottom-[25%] right-[10%] w-3 h-3 rounded-full bg-blue-400 opacity-60 animate-pulse" style={{ animationDuration: "2.2s" }} />
          <div className="absolute bottom-[30%] right-[8%] w-2 h-2 rounded-full bg-yellow-400 opacity-50 animate-pulse" style={{ animationDuration: "2.7s", animationDelay: "0.4s" }} />
          <div className="absolute bottom-[35%] right-[12%] w-4 h-4 rounded-full bg-pink-400 opacity-40 animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "0.8s" }} />
        </div>

        {/* Profile circles */}
        <div className="relative w-full max-w-lg h-80 mb-8">
          {/* Current user circle (left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-4 border-white overflow-hidden shadow-2xl z-10">
            {currentUserAvatar ? (
              <img
                src={currentUserAvatar}
                alt="You"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-600 to-purple-800">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.3">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 6v2h18v-2c0-4-4-6-9-6z" />
                </svg>
              </div>
            )}
          </div>

          {/* Matched user circle (right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-4 border-white overflow-hidden shadow-2xl z-10">
            {matchedUser.avatar ? (
              <img
                src={matchedUser.avatar}
                alt={matchedUser.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-500 to-pink-700">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.3">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 6v2h18v-2c0-4-4-6-9-6z" />
                </svg>
              </div>
            )}
          </div>

          {/* Like icon (top center) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-linear-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center shadow-2xl z-20 animate-bounce" style={{ animationDuration: "1.5s" }}>
            <ThumbUp className="text-white" sx={{ fontSize: 36 }} />
          </div>

          {/* Heart icon (bottom center) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
            <div className="relative animate-pulse" style={{ animationDuration: "1.8s" }}>
              {/* Main heart */}
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-2xl"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="url(#heart-gradient)"
                />
                <defs>
                  <linearGradient
                    id="heart-gradient"
                    x1="2"
                    y1="3"
                    x2="22"
                    y2="21.35"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF3B30" />
                    <stop offset="1" stopColor="#DD3562" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Check icon inside heart */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              
              {/* Small decorative hearts */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#FF3B30"
                className="absolute -bottom-4 -right-6 opacity-80 animate-pulse"
                style={{ animationDuration: "2s", animationDelay: "0.2s" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#DD3562"
                className="absolute -bottom-8 -right-3 opacity-60 animate-pulse"
                style={{ animationDuration: "2.3s", animationDelay: "0.5s" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#FF6B9D"
                className="absolute -bottom-6 -right-10 opacity-50 animate-pulse"
                style={{ animationDuration: "2.6s", animationDelay: "0.8s" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center mb-10 z-10">
          <h1 className="font-lexend font-bold text-white text-6xl mb-3 tracking-tight">
            Congrats!
          </h1>
          <p className="font-lexend text-white text-2xl mb-3 font-semibold">It's a Match!</p>
          <p className="font-lexend text-white/70 text-lg">
            {matchedUser.firstName} & You both liked each other
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm flex flex-col gap-5 z-10">
          <button
            onClick={handleStartConversation}
            className="w-full py-5 rounded-full bg-[#FFD700] flex items-center justify-center gap-3 hover:bg-[#FFE55C] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChatBubble className="text-[#0E0127]" sx={{ fontSize: 26 }} />
            <span className="font-lexend font-bold text-[#0E0127] text-xl">
              Start Conversation
            </span>
          </button>

          <button
            onClick={handleKeepDating}
            className="w-full py-5 rounded-full bg-transparent hover:bg-white/5 transition-all transform hover:scale-105"
          >
            <span
              className="font-lexend font-bold text-xl"
              style={{
                background:
                  "linear-gradient(87.08deg, #DD3562 6.8%, #8354FF 102.07%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Keep Dating
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
