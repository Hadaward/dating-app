"use client";

import Delete from "@mui/icons-material/Delete";
import MoreVert from "@mui/icons-material/MoreVert";
import Person from "@mui/icons-material/Person";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface MatchCardProps {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  subtitle: string;
  date: Date;
  type: "match" | "you_liked" | "liked_you" | "view";
  onDelete?: () => void;
  onClick?: () => void;
}

export default function MatchCard({
  id,
  userId,
  firstName,
  lastName,
  avatar,
  subtitle,
  date,
  type,
  onDelete,
  onClick,
}: MatchCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const deleteType = type === "match" ? "match" : "reaction";
      const response = await fetch(`/api/matches/${id}?type=${deleteType}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShowConfirmModal(false);
        onDelete?.();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="w-full flex items-center gap-4 py-4 border-b border-purple-900/30 cursor-pointer hover:bg-white/5 transition-colors relative"
      >
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center shrink-0">
          {avatar ? (
            <img src={avatar} alt={firstName} className="w-full h-full object-cover" />
          ) : (
            <Person className="text-white/30" sx={{ fontSize: 32 }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-lexend font-semibold text-lg truncate">
            {firstName} {lastName}
          </h3>
          <p className="text-white/60 font-lexend text-sm truncate">{subtitle}</p>
          <p className="text-white/40 font-lexend text-xs mt-1">
            {formatDistanceToNow(date, { addSuffix: true })}
          </p>
        </div>

        {/* Menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            disabled={isDeleting}
          >
            <MoreVert className="text-white/60" sx={{ fontSize: 24 }} />
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />

              {/* Menu dropdown */}
              <div className="absolute right-0 top-8 bg-[#1a0b2e] rounded-lg shadow-xl border border-purple-900/30 py-2 min-w-40 z-50">
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-red-400"
                >
                  <Delete sx={{ fontSize: 20 }} />
                  <span className="font-lexend text-sm">
                    Remove {type === "match" ? "Match" : "Like"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Remove Confirmation"
        message={`Are you sure you want to remove ${type === "match" ? "this match" : "this like"} with ${firstName} ${lastName}?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
