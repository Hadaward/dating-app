"use client";

import Person from "@mui/icons-material/Person";
import { useState } from "react";

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-square rounded-3xl bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center">
        <Person className="text-white/30" sx={{ fontSize: 80 }} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo.url)}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src={photo.url}
              alt="Photo"
              className="w-full h-full object-cover"
            />
            {photo.isMain && (
              <div className="absolute top-2 right-2 bg-[#DD3562] px-2 py-1 rounded-full">
                <span className="text-white text-xs font-lexend font-semibold">
                  Main
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
