'use client';

import { Close, Favorite, Star } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

export interface SwipeableCardProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        age: number;
        photos: Array<{ id: string; url: string }>;
        interests?: Array<{ interest: { id: string; name: string } }>;
        profile?: {
            gender: string;
        } | null;
    };
    onLike: (userId: string) => void;
    onSuperLike: (userId: string) => void;
    onDislike: (userId: string) => void;
    onProfileClick: (userId: string) => void;
}

export default function SwipeableCard({ 
    user, 
    onLike, 
    onSuperLike, 
    onDislike,
    onProfileClick 
}: SwipeableCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const photoUrl = user.photos[currentPhotoIndex]?.url || '/file.svg';

    const handleNextPhoto = () => {
        if (currentPhotoIndex < user.photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    const handlePrevPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        }
    };

    return (
        <div className="relative w-full max-w-md h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Photo */}
            <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => onProfileClick(user.id)}
            >
                <Image
                    src={photoUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    className="object-cover"
                    priority
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            </div>

            {/* Photo indicators */}
            {user.photos.length > 1 && (
                <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-10">
                    {user.photos.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded-full ${
                                index === currentPhotoIndex 
                                    ? 'bg-white' 
                                    : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Photo navigation zones */}
            {user.photos.length > 1 && (
                <>
                    <div 
                        className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                        onClick={handlePrevPhoto}
                    />
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                        onClick={handleNextPhoto}
                    />
                </>
            )}

            {/* User info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="mb-2">
                    <h2 className="text-white text-3xl font-bold">
                        {user.firstName}, {user.age}
                    </h2>
                </div>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.interests.slice(0, 3).map((ui) => (
                            <span
                                key={ui.interest.id}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                            >
                                {ui.interest.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-center items-center gap-6">
                    {/* Dislike */}
                    <button
                        onClick={() => onDislike(user.id)}
                        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Close className="text-red-500 text-3xl" />
                    </button>

                    {/* Super Like */}
                    <button
                        onClick={() => onSuperLike(user.id)}
                        className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Star className="text-blue-500 text-2xl" />
                    </button>

                    {/* Like */}
                    <button
                        onClick={() => onLike(user.id)}
                        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Favorite className="text-pink-500 text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}
