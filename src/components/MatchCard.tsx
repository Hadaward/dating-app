'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export interface MatchCardProps {
    match: {
        id: string;
        createdAt: Date | string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            photos: Array<{ id: string; url: string }>;
        };
    };
}

export default function MatchCard({ match }: MatchCardProps) {
    const router = useRouter();
    const photoUrl = match.user.photos[0]?.url || '/file.svg';

    return (
        <button
            onClick={() => router.push(`/profile/${match.user.id}`)}
            className="flex flex-col items-center gap-2 group"
        >
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-pink-500 group-hover:scale-105 transition-transform">
                <Image
                    src={photoUrl}
                    alt={`${match.user.firstName} ${match.user.lastName}`}
                    fill
                    className="object-cover"
                />
            </div>
            <span className="text-white text-sm font-medium">
                {match.user.firstName}
            </span>
        </button>
    );
}
