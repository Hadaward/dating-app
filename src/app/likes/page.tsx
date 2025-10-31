'use client';

import LikeCard from "@/components/LikeCard";
import NavigationBar from "@/components/NavigationBar";
import gateways from "@/lib/client/gateways";
import { Favorite } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Reaction {
  id: string;
  type: 'LIKE' | 'SUPER_LIKE' | 'DISLIKE';
  createdAt: Date;
  fromUser: {
    id: string;
    firstName: string;
    lastName: string;
    photos: Array<{ id: string; url: string }>;
  };
}

export default function LikesPage() {
  const [likes, setLikes] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setLoading(true);
      const response = await fetch(gateways.REACTIONS('received'));
      
      if (response.ok) {
        const data = await response.json();
        setLikes(data);
      } else if (response.status === 401) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Erro ao carregar likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId: string) => {
    try {
      const response = await fetch(gateways.CREATE_REACTION(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: userId,
          type: 'LIKE',
        }),
      });

      if (response.ok) {
        // Recarregar likes
        loadLikes();
      }
    } catch (error) {
      console.error('Erro ao aceitar like:', error);
    }
  };

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="w-full p-6">
        <h1 className="text-white text-3xl font-bold">Curtidas Recebidas</h1>
        <p className="text-gray-400 mt-1">
          {likes.length} {likes.length === 1 ? 'pessoa curtiu' : 'pessoas curtiram'} você
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-white text-xl">Carregando...</div>
          </div>
        ) : likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Favorite className="text-gray-600 text-6xl mb-4" />
            <p className="text-white text-xl font-semibold mb-2">
              Ninguém curtiu você ainda
            </p>
            <p className="text-gray-400">
              Continue ativo para receber mais curtidas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likes.map((like) => (
              <LikeCard 
                key={like.id} 
                reaction={like}
                onAccept={handleAccept}
              />
            ))}
          </div>
        )}
      </div>

      <NavigationBar />
    </main>
  );
}
