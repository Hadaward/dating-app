'use client';

import gateways from "@/lib/client/gateways";
import { ArrowBack, Close, Favorite, Star } from "@mui/icons-material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  photos: Array<{ id: string; url: string }>;
  profile: {
    id: string;
    gender: string;
    preference: string;
  } | null;
  interests: Array<{ 
    id: string;
    interest: { id: string; name: string } 
  }>;
  hasMatch: boolean;
  reaction: string | null;
  stats: {
    totalMatches: number;
  } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(gateways.PROFILE(userId));
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 401) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: 'LIKE' | 'SUPER_LIKE' | 'DISLIKE') => {
    try {
      const response = await fetch(gateways.CREATE_REACTION(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: userId,
          type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.matched) {
          alert('É um match! 🎉');
        }
        
        router.back();
      }
    } catch (error) {
      console.error('Erro ao reagir:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <div className="text-white text-xl">Perfil não encontrado</div>
      </div>
    );
  }

  const currentPhoto = profile.photos[currentPhotoIndex];

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowBack className="text-white" />
        </button>
      </div>

      {/* Photo carousel */}
      <div className="relative w-full h-2/3">
        <Image
          src={currentPhoto?.url || '/file.svg'}
          alt={`${profile.firstName} ${profile.lastName}`}
          fill
          className="object-cover"
          priority
        />

        {/* Photo indicators */}
        {profile.photos.length > 1 && (
          <div className="absolute top-16 left-0 right-0 flex gap-2 px-4 z-10">
            {profile.photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentPhotoIndex 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      </div>

      {/* Profile info */}
      <div className="relative h-1/3 overflow-y-auto px-6 py-4">
        {/* Name and age */}
        <div className="mb-4">
          <h1 className="text-white text-3xl font-bold">
            {profile.firstName} {profile.lastName}, {profile.age}
          </h1>
          {profile.hasMatch && profile.stats && (
            <p className="text-pink-400 text-sm mt-1">
              ✨ Você tem match com {profile.firstName}!
            </p>
          )}
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-white text-sm font-semibold mb-2">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((ui) => (
                <span
                  key={ui.interest.id}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm"
                >
                  {ui.interest.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* About (placeholder) */}
        <div className="mb-4">
          <h3 className="text-white text-sm font-semibold mb-2">Sobre</h3>
          <p className="text-gray-300 text-sm">
            Olá! Me chamo {profile.firstName} e estou aqui para conhecer pessoas interessantes.
          </p>
        </div>

        {/* Stats */}
        {profile.stats && (
          <div className="mb-4">
            <h3 className="text-white text-sm font-semibold mb-2">Estatísticas</h3>
            <p className="text-gray-300 text-sm">
              {profile.stats.totalMatches} matches
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!profile.hasMatch && !profile.reaction && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 px-6">
          {/* Dislike */}
          <button
            onClick={() => handleReaction('DISLIKE')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Close className="text-red-500 text-3xl" />
          </button>

          {/* Super Like */}
          <button
            onClick={() => handleReaction('SUPER_LIKE')}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Star className="text-blue-500 text-2xl" />
          </button>

          {/* Like */}
          <button
            onClick={() => handleReaction('LIKE')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Favorite className="text-pink-500 text-3xl" />
          </button>
        </div>
      )}
    </main>
  );
}
