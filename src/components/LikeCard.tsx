'use client';

import { Favorite, Star } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface LikeCardProps {
    reaction: {
        id: string;
        type: 'LIKE' | 'SUPER_LIKE' | 'DISLIKE';
        createdAt: Date | string;
        fromUser: {
            id: string;
            firstName: string;
            lastName: string;
            photos: Array<{ id: string; url: string }>;
        };
    };
    onAccept: (userId: string) => void;
}

export default function LikeCard({ reaction, onAccept }: LikeCardProps) {
    const router = useRouter();
    const photoUrl = reaction.fromUser.photos[0]?.url || '/file.svg';

    return (
        <div className="relative w-40 h-56 rounded-2xl overflow-hidden shadow-lg group">
            <Image
                src={photoUrl}
                alt={`${reaction.fromUser.firstName} ${reaction.fromUser.lastName}`}
                fill
                className="object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

            {/* Reaction type badge */}
            <div className="absolute top-2 right-2 z-10">
                {reaction.type === 'SUPER_LIKE' && (
                    <div className="bg-blue-500 rounded-full p-1">
                        <Star className="text-white text-sm" />
                    </div>
                )}
                {reaction.type === 'LIKE' && (
                    <div className="bg-pink-500 rounded-full p-1">
                        <Favorite className="text-white text-sm" />
                    </div>
                )}
            </div>

            {/* User info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <p className="text-white font-semibold text-sm mb-2">
                    {reaction.fromUser.firstName}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/profile/${reaction.fromUser.id}`)}
                        className="flex-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs hover:bg-white/30 transition-colors"
                    >
                        Ver Perfil
                    </button>
                    <button
                        onClick={() => onAccept(reaction.fromUser.id)}
                        className="flex-1 px-3 py-1.5 bg-pink-500 rounded-full text-white text-xs hover:bg-pink-600 transition-colors"
                    >
                        Curtir
                    </button>
                </div>
            </div>
        </div>
    );
}
