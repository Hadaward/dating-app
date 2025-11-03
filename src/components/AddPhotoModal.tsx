import Close from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoAdded?: () => void;
}

export default function AddPhotoModal({
  isOpen,
  onClose,
  onPhotoAdded,
}: AddPhotoModalProps) {
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMain, setIsMain] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
      setTimeout(() => {
        setPreview(null);
        setSelectedFile(null);
        setIsMain(false);
        setError("");
      }, 300);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
      return;
    }

    // Validar tipo
    if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
      setError("Invalid format. Use JPEG, PNG or WebP");
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1];

      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("isMain", String(isMain));

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Error uploading photo");
        return;
      }

      onPhotoAdded?.();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Unexpected error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-[#1a0b2e] rounded-3xl border border-purple-900/30 shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-900/30 flex items-center justify-between">
          <h2 className="text-white font-lexend font-bold text-2xl">
            Add Photo
          </h2>
          <button onClick={onClose} disabled={isUploading}>
            <Close className="text-white/60" sx={{ fontSize: 28 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-square rounded-2xl bg-[#251759] border-2 border-dashed border-purple-700/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#2d1d63] transition-colors mb-4 overflow-hidden"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <PhotoCamera className="text-white/40 mb-4" sx={{ fontSize: 64 }} />
                <p className="text-white/60 font-lexend text-center px-4">
                  Click to select a photo
                </p>
              </>
            )}
          </div>

          {/* Main Photo Toggle */}
          {selectedFile && (
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
                disabled={isUploading}
                className="w-5 h-5 rounded border-2 border-purple-700 bg-transparent checked:bg-[#DD3562] cursor-pointer"
              />
              <span className="text-white font-lexend text-sm">
                Set as main photo
              </span>
            </label>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>

            <button
              onClick={onClose}
              disabled={isUploading}
              className="w-full py-4 rounded-full bg-transparent hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <span className="font-lexend font-semibold text-lg text-white/60">
                Cancel
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
