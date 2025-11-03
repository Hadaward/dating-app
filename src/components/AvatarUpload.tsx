"use client";
import Person from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Image from "next/image";
import { useRef, useState } from "react";

export interface AvatarUploadProps {
  onAvatarChanged?: (file: File | null) => void;
  onError?: (error: string) => void;
}

export default function AvatarUpload({ onAvatarChanged, onError }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validar tipo de arquivo
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      onError?.("Choose a valid image file (png, jpeg, jpg)");
      return;
    }

    // Validar tamanho (8MB = 8 * 1024 * 1024 bytes)
    if (file.size > 8 * 1024 * 1024) {
      onError?.("The image must be smaller than 8MB");
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Chamar callback
    onAvatarChanged?.(file);
  };

  return (
    <div
      onClick={handleClick}
      className="w-32 h-32 rounded-full bg-[#251759] border-3 border-white relative flex items-center justify-center cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <Image
          src={preview}
          alt="Avatar preview"
          fill
          className="object-cover rounded-full"
        />
      ) : (
        <Person className="text-[#563890]" sx={{ fontSize: "5rem" }} />
      )}

      {/* Bottom-right camera container */}
      <div className="absolute bg-[linear-gradient(87.08deg,#DD3562_6.8%,#8354FF_102.07%)] -bottom-1.5 -right-1.5 w-10 h-10 rounded-full flex items-center justify-center border-3 border-[#0E0127] z-10">
        <PhotoCamera className="text-white" sx={{ fontSize: '1.5rem' }} />
      </div>
    </div>
  );
}