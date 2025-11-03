"use client";

import AddPhotoModal from "@/components/AddPhotoModal";
import BottomNav from "@/components/BottomNav";
import MatchModal from "@/components/MatchModal";
import { MatchSuggestion } from "@/lib/shared/types/match";
import Add from "@mui/icons-material/Add";
import ChatBubble from "@mui/icons-material/ChatBubble";
import Close from "@mui/icons-material/Close";
import Favorite from "@mui/icons-material/Favorite";
import MoreVert from "@mui/icons-material/MoreVert";
import Notifications from "@mui/icons-material/Notifications";
import Search from "@mui/icons-material/Search";
import ThumbUp from "@mui/icons-material/ThumbUp";
import { useEffect, useState } from "react";

export default function Home() {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [matchedUser, setMatchedUser] = useState<{
    firstName: string;
    avatar: string | null;
  } | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  useEffect(() => {
    fetchSuggestions();
    fetchCurrentUserAvatar();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const response = await fetch("/api/matches/suggestions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUserAvatar = async () => {
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
        setCurrentUserAvatar(data.avatar);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleReaction = async (type: "LIKE" | "SUPER_LIKE" | "DISLIKE") => {
    if (currentIndex >= suggestions.length) {
      return;
    }

    const currentUser = suggestions[currentIndex];

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: currentUser.id,
          type,
        }),
      });

      const result = await response.json();

      // Mover para próximo perfil primeiro
      setCurrentIndex((prev) => prev + 1);
      setCurrentPhotoIndex(0);

      // Verificar se foi um match após mover
      if (result.matched) {
        setMatchedUser({
          firstName: currentUser.firstName,
          avatar: currentUser.avatar,
        });
        
        // Fechar modal automaticamente após 5 segundos
        setTimeout(() => {
          setMatchedUser(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error sending reaction:", error);
    }
  };

  const handlePhotoAdded = () => {
    // Recarregar avatar do usuário atual
    fetchCurrentUserAvatar();
  };

  const currentUser = suggestions[currentIndex];
  const hasNoMoreSuggestions = !currentUser || currentIndex >= suggestions.length;
  
  // Fotos extras (sem a principal)
  const extraPhotos = currentUser?.extraPhotos.map((p) => p.url) || [];
  
  // Foto de fundo: se houver extras, usa a atual do carrossel, senão usa a principal
  const backgroundPhoto = extraPhotos.length > 0 
    ? extraPhotos[currentPhotoIndex] 
    : currentUser?.avatar;

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
      <div className="w-full flex items-center justify-between p-6 z-20">
        <button
          onClick={() => setShowAddPhotoModal(true)}
          className="w-14 h-14 rounded-full bg-[#DD3562] flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Add className="text-white" sx={{ fontSize: 28 }} />
        </button>
        <p className="text-white font-lexend font-semibold text-lg">
          Add Photo
        </p>
        <div className="flex items-center gap-4">
          <button>
            <Search className="text-white" sx={{ fontSize: 28 }} />
          </button>
          <button>
            <Notifications className="text-white" sx={{ fontSize: 28 }} />
          </button>
          <button>
            <MoreVert className="text-white" sx={{ fontSize: 28 }} />
          </button>
        </div>
      </div>

      {/* Card Container ou Mensagem de Sem Sugestões */}
      <div className="flex-1 flex items-center justify-center px-4 pb-32">
        {hasNoMoreSuggestions ? (
          <div className="text-center">
            <p className="text-white font-lexend text-xl mb-4">
              No more suggestions
            </p>
            <button
              onClick={fetchSuggestions}
              className="text-[#DD3562] font-lexend font-semibold cursor-pointer"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div
            className="relative w-full max-w-md h-[600px] rounded-[3rem] overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(157, 78, 221, 0.6) 0%, rgba(77, 0, 180, 0.6) 100%)",
              padding: "2px",
            }}
          >
            {/* Card Content */}
            <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-[#1a0b2e]">
              {/* Background Photo */}
              {backgroundPhoto && (
                <img
                  src={backgroundPhoto}
                  alt={currentUser.firstName}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#1a0b2e]" />

              {/* Top Right Icon */}
              <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-purple-600/80 flex items-center justify-center backdrop-blur-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              {/* Photo Indicators - apenas se houver fotos extras */}
              {extraPhotos.length > 0 && (
                <div className="absolute top-6 left-6 right-6 flex gap-2">
                  {extraPhotos.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                    >
                      <div
                        className={`h-full bg-white transition-all duration-300 ${
                          index === currentPhotoIndex ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* User Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar com foto principal */}
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-purple-600">
                      {currentUser.avatar && (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.firstName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="text-white font-lexend font-bold text-2xl">
                        {currentUser.firstName} {currentUser.lastName}
                      </h2>
                      <p className="text-white/70 font-lexend text-sm">
                        {currentUser.age} years old
                      </p>
                    </div>
                  </div>
                  <button>
                    <ChatBubble className="text-white" sx={{ fontSize: 32 }} />
                  </button>
                </div>

                {/* Photo Dots - apenas se houver fotos extras */}
                {extraPhotos.length > 0 && (
                  <div className="flex gap-2 justify-center mb-4">
                    {extraPhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentPhotoIndex
                            ? "bg-white"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - apenas se houver sugestão atual */}
      {!hasNoMoreSuggestions && (
        <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-6 px-4">
          <button
            onClick={() => handleReaction("LIKE")}
            className="w-16 h-16 rounded-full bg-linear-to-br from-[#4CD964] to-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ThumbUp className="text-white" sx={{ fontSize: 28 }} />
          </button>
          <button
            onClick={() => handleReaction("SUPER_LIKE")}
            className="w-16 h-16 rounded-full bg-linear-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Favorite className="text-white" sx={{ fontSize: 28 }} />
          </button>
          <button
            onClick={() => handleReaction("DISLIKE")}
            className="w-16 h-16 rounded-full bg-linear-to-br from-[#FF3B30] to-[#DD3562] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Close className="text-white" sx={{ fontSize: 28 }} />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Match Modal */}
      {matchedUser && (
        <MatchModal
          isOpen={!!matchedUser}
          matchedUser={matchedUser}
          currentUserAvatar={currentUserAvatar}
        />
      )}

      {/* Add Photo Modal */}
      <AddPhotoModal
        isOpen={showAddPhotoModal}
        onClose={() => setShowAddPhotoModal(false)}
        onPhotoAdded={handlePhotoAdded}
      />
    </main>
  );
}
